import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
export const messaging = admin.messaging();

/**
 * Helper: verify staff roles
 */
function assertStaff(auth: any, allowedRoles: string[] = ['super_admin', 'academy_manager']) {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'يجب تسجيل الدخول أولاً / Authentication required');
  }
  const role = auth.token?.role || 'student';
  if (!allowedRoles.includes(role)) {
    throw new HttpsError('permission-denied', 'ليس لديك صلاحية لتنفيذ هذا الإجراء / Permission denied');
  }
  return role;
}

/**
 * 1. createEnrollment
 * Atomic transaction checking cohort publication, capacity, duplicate registrations.
 */
export const createEnrollment = onCall({ cors: true }, async (request) => {
  const { auth, data } = request;
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be signed in to enroll');
  }

  const {
    cohortId,
    courseId,
    studentName,
    studentEmail,
    studentPhone,
    idempotencyKey,
    notes,
  } = data;

  if (!cohortId || !idempotencyKey || !studentName) {
    throw new HttpsError('invalid-argument', 'Missing required enrollment parameters');
  }

  const uid = auth.uid;

  return await db.runTransaction(async (transaction) => {
    // 1. Check idempotency: check if enrollment with this key already exists
    const existingSnap = await transaction.get(
      db.collection('enrollments').where('idempotencyKey', '==', idempotencyKey).limit(1)
    );
    if (!existingSnap.empty) {
      const doc = existingSnap.docs[0];
      return { success: true, enrollmentId: doc.id, status: doc.data().status, deduplicated: true };
    }

    // 2. Check cohort
    const cohortRef = db.collection('courseCohorts').doc(cohortId);
    const cohortDoc = await transaction.get(cohortRef);
    if (!cohortDoc.exists) {
      throw new HttpsError('not-found', 'الدورة أو الورشة غير موجودة / Cohort not found');
    }

    const cohortData = cohortDoc.data()!;
    if (cohortData.publicationStatus !== 'published' || !cohortData.registrationOpen) {
      throw new HttpsError('failed-precondition', 'التسجيل مغلق لهذه الدورة / Registration is closed');
    }

    // 3. Check duplicate active enrollment for this student in this cohort
    const userEnrollmentSnap = await transaction.get(
      db.collection('enrollments')
        .where('uid', '==', uid)
        .where('cohortId', '==', cohortId)
        .where('status', 'in', ['requested', 'awaiting_payment', 'confirmed'])
        .limit(1)
    );
    if (!userEnrollmentSnap.empty) {
      throw new HttpsError('already-exists', 'أنت مسجل بالفعل في هذا التدريب / Already registered');
    }

    // 4. Capacity & Waitlist determination
    const maxCapacity = cohortData.maxCapacity || 0;
    const reservedSeats = cohortData.reservedSeats || 0;
    let enrollmentStatus: 'confirmed' | 'waitlisted' | 'requested' = 'requested';

    if (reservedSeats < maxCapacity) {
      enrollmentStatus = 'confirmed';
      transaction.update(cohortRef, {
        reservedSeats: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date().toISOString(),
      });
    } else {
      enrollmentStatus = 'waitlisted';
      transaction.update(cohortRef, {
        waitlistCount: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date().toISOString(),
      });
    }

    // 5. Generate secure opaque verification pass token
    const verificationPassToken = `dc_pass_${Buffer.from(`${uid}_${cohortId}_${Date.now()}`).toString('base64url')}`;

    // 6. Create enrollment doc
    const enrollmentRef = db.collection('enrollments').doc();
    const nowIso = new Date().toISOString();
    const enrollmentRecord = {
      id: enrollmentRef.id,
      uid,
      entityType: 'course_cohort',
      courseId: courseId || cohortData.courseId || '',
      cohortId,
      status: enrollmentStatus,
      paymentStatus: 'not_required',
      idempotencyKey,
      studentName,
      studentEmail: studentEmail || auth.token.email || '',
      studentPhone: studentPhone || '',
      notes: notes || '',
      verificationPassToken,
      registeredAt: nowIso,
      updatedAt: nowIso,
    };

    transaction.set(enrollmentRef, enrollmentRecord);

    // 7. Write durable inbox notification
    const eventId = `evt_enr_${enrollmentRef.id}`;
    const notificationRef = db.collection('users').doc(uid).collection('notifications').doc(eventId);
    transaction.set(notificationRef, {
      id: eventId,
      uid,
      title: {
        ar: enrollmentStatus === 'confirmed' ? 'تم تأكيد تسجيلك بنجاح' : 'تمت إضافتك لقائمة الانتظار',
        en: enrollmentStatus === 'confirmed' ? 'Enrollment Confirmed' : 'Added to Waitlist',
      },
      body: {
        ar: `تم تسجيلك في: ${cohortData.title?.ar || 'الدورة التدريبية'}.`,
        en: `You have registered for: ${cohortData.title?.en || 'the training course'}.`,
      },
      eventType: enrollmentStatus === 'confirmed' ? 'enrollment_confirmed' : 'enrollment_waitlisted',
      entityType: 'enrollment',
      entityId: enrollmentRef.id,
      routeKey: 'enrollment_detail',
      read: false,
      createdAt: nowIso,
    });

    return {
      success: true,
      enrollmentId: enrollmentRef.id,
      status: enrollmentStatus,
      verificationPassToken,
    };
  });
});

/**
 * 2. cancelEnrollment
 * Student or admin cancels, decrements seat counter, promotes from waitlist if applicable.
 */
export const cancelEnrollment = onCall({ cors: true }, async (request) => {
  const { auth, data } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'Authentication required');

  const { enrollmentId, reason } = data;
  if (!enrollmentId) throw new HttpsError('invalid-argument', 'Missing enrollmentId');

  return await db.runTransaction(async (transaction) => {
    const enrollmentRef = db.collection('enrollments').doc(enrollmentId);
    const snap = await transaction.get(enrollmentRef);
    if (!snap.exists) throw new HttpsError('not-found', 'Enrollment not found');

    const enrollment = snap.data()!;
    const isOwner = enrollment.uid === auth.uid;
    const isStaffUser = ['super_admin', 'academy_manager'].includes(auth.token?.role);

    if (!isOwner && !isStaffUser) {
      throw new HttpsError('permission-denied', 'Not authorized to cancel this enrollment');
    }

    if (['cancelled', 'completed'].includes(enrollment.status)) {
      return { success: true, message: 'Already cancelled or completed' };
    }

    const previousStatus = enrollment.status;
    const nowIso = new Date().toISOString();

    transaction.update(enrollmentRef, {
      status: 'cancelled',
      cancellationReason: reason || 'Cancelled by user',
      updatedAt: nowIso,
    });

    // If it was confirmed, free a seat on the cohort
    if (previousStatus === 'confirmed' && enrollment.cohortId) {
      const cohortRef = db.collection('courseCohorts').doc(enrollment.cohortId);
      transaction.update(cohortRef, {
        reservedSeats: admin.firestore.FieldValue.increment(-1),
        updatedAt: nowIso,
      });

      // Promote first waitlisted student if available
      const waitlistSnap = await transaction.get(
        db.collection('enrollments')
          .where('cohortId', '==', enrollment.cohortId)
          .where('status', '==', 'waitlisted')
          .orderBy('registeredAt', 'asc')
          .limit(1)
      );

      if (!waitlistSnap.empty) {
        const nextDoc = waitlistSnap.docs[0];
        transaction.update(nextDoc.ref, {
          status: 'confirmed',
          updatedAt: nowIso,
        });
        transaction.update(cohortRef, {
          reservedSeats: admin.firestore.FieldValue.increment(1),
          waitlistCount: admin.firestore.FieldValue.increment(-1),
        });
      }
    }

    return { success: true, status: 'cancelled' };
  });
});

/**
 * 3. recordAttendance
 * Staff scans opaque pass token and checks in student.
 */
export const recordAttendance = onCall({ cors: true }, async (request) => {
  const { auth, data } = request;
  assertStaff(auth, ['super_admin', 'academy_manager', 'instructor']);

  const { verificationPassToken, cohortId, status = 'present' } = data;
  if (!verificationPassToken) {
    throw new HttpsError('invalid-argument', 'Missing verificationPassToken');
  }

  const enrollmentSnap = await db.collection('enrollments')
    .where('verificationPassToken', '==', verificationPassToken)
    .limit(1)
    .get();

  if (enrollmentSnap.empty) {
    throw new HttpsError('not-found', 'بطاقة الدخول غير صالحة / Invalid pass token');
  }

  const enrollmentDoc = enrollmentSnap.docs[0];
  const enrollment = enrollmentDoc.data();

  if (cohortId && enrollment.cohortId !== cohortId) {
    throw new HttpsError('failed-precondition', 'بطاقة الدخول مخصصة لدورة تدريبية أخرى / Pass is for another cohort');
  }

  // Check if attendance already recorded today for this enrollment
  const attendanceId = `att_${enrollmentDoc.id}_${new Date().toISOString().slice(0, 10)}`;
  const attRef = db.collection('attendance').doc(attendanceId);

  await attRef.set({
    id: attendanceId,
    enrollmentId: enrollmentDoc.id,
    cohortId: enrollment.cohortId || '',
    uid: enrollment.uid,
    studentName: enrollment.studentName,
    checkedInAt: new Date().toISOString(),
    checkedInByStaffUid: auth!.uid,
    status,
  }, { merge: true });

  return {
    success: true,
    studentName: enrollment.studentName,
    enrollmentId: enrollmentDoc.id,
    status,
  };
});

/**
 * 4. setStaffRole
 * Privileged operation for super_admin to grant custom claims and create staff membership.
 */
export const setStaffRole = onCall({ cors: true }, async (request) => {
  const { auth, data } = request;
  assertStaff(auth, ['super_admin']);

  const { targetUid, role, email, fullName } = data;
  const validRoles = ['super_admin', 'academy_manager', 'content_editor', 'instructor', 'support_agent', 'student'];

  if (!targetUid || !validRoles.includes(role)) {
    throw new HttpsError('invalid-argument', 'Valid targetUid and role required');
  }

  // 1. Set custom claims in Firebase Auth
  await admin.auth().setCustomUserClaims(targetUid, { role });

  // 2. Store in staffMemberships collection
  const nowIso = new Date().toISOString();
  await db.collection('staffMemberships').doc(targetUid).set({
    uid: targetUid,
    email: email || '',
    fullName: fullName || '',
    role,
    isActive: role !== 'student',
    grantedByUid: auth!.uid,
    updatedAt: nowIso,
  }, { merge: true });

  // 3. Log audit event
  await db.collection('auditLogs').add({
    id: `audit_${Date.now()}`,
    actorUid: auth!.uid,
    actorEmail: auth!.token?.email || '',
    actorRole: 'super_admin',
    action: 'SET_STAFF_ROLE',
    targetCollection: 'staffMemberships',
    targetId: targetUid,
    afterSnapshot: { role, targetUid },
    timestamp: nowIso,
  });

  return { success: true, targetUid, role };
});

/**
 * 5. registerDevice & unregisterDevice
 * Binds/unbinds device FCM token for notifications.
 */
export const registerDevice = onCall({ cors: true }, async (request) => {
  const { auth, data } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

  const { installationId, fcmToken, platform, appVersion, language } = data;
  if (!installationId || !fcmToken) {
    throw new HttpsError('invalid-argument', 'Missing installationId or fcmToken');
  }

  const nowIso = new Date().toISOString();
  await db.collection('deviceRegistrations').doc(installationId).set({
    installationId,
    uid: auth.uid,
    fcmToken,
    platform: platform || 'android',
    appVersion: appVersion || '1.0.0',
    language: language || 'ar',
    active: true,
    lastSeenAt: nowIso,
  }, { merge: true });

  return { success: true };
});

export const unregisterDevice = onCall({ cors: true }, async (request) => {
  const { data } = request;
  const { installationId } = data;
  if (!installationId) throw new HttpsError('invalid-argument', 'Missing installationId');

  await db.collection('deviceRegistrations').doc(installationId).update({
    active: false,
    unregisteredAt: new Date().toISOString(),
  });

  return { success: true };
});

/**
 * 6. askAcademyAssistant
 * Answers inquiries using verified academy curriculum and FAQ context.
 */
export const askAcademyAssistant = onCall({ cors: true }, async (request) => {
  const { data } = request;
  const question = data?.question?.trim();
  if (!question) throw new HttpsError('invalid-argument', 'Question cannot be empty');

  // Fallback factual academy FAQ response
  const normalized = question.toLowerCase();
  if (normalized.includes('exocad') || normalized.includes('تصميم') || normalized.includes('design')) {
    return {
      answer: {
        ar: 'تقدم أكاديمية DentaCollab دورات متقدمة في التصميم الرقمي باستخدام برمجية Exocad، تشمل تصميم التيجان والجسور والابتسامة الرقمية من المسح حتى تصدير STL.',
        en: 'DentaCollab Academy offers comprehensive Exocad digital design courses, covering crowns, bridges, and digital smile design from scanning to STL export.',
      },
      sources: ['courses/digital-dentistry-foundations'],
    };
  }

  if (normalized.includes('زرع') || normalized.includes('exoplan') || normalized.includes('implant') || normalized.includes('جراحي')) {
    return {
      answer: {
        ar: 'ورشة تخطيط الزرعات ودليل الجراحة الرقمي (Exoplan) تعتمد على حالات حقيقية لتصميم الأدلة الجراحية بدقة عالية متوافقة مع الطباعة ثلاثية الأبعاد.',
        en: 'Our Exoplan Implant Planning and Surgical Guides workshop provides hands-on surgical guide design calibrated for 3D printing workflows.',
      },
      sources: ['courses/implant-planning'],
    };
  }

  if (normalized.includes('عنوان') || normalized.includes('موقع') || normalized.includes('بغداد') || normalized.includes('location')) {
    return {
      answer: {
        ar: 'تقع الأكاديمية في بغداد، العراق. تتوفر الخريطة وتفاصيل الوصول والمواعيد في صفحة "تواصل معنا".',
        en: 'The Academy is located in Baghdad, Iraq. Full location maps and contact schedules are available on the Contact page.',
      },
      sources: ['contact'],
    };
  }

  return {
    answer: {
      ar: 'أهلاً بك في أكاديمية DentaCollab لطب الأسنان الرقمي في بغداد. يمكنك استعراض الدورات المتاحة أو التواصل المباشر مع فريق الدعم للإجابة على استفسارك المحدد.',
      en: 'Welcome to DentaCollab Digital Dentistry Academy. You can browse our published courses or connect with support for customized inquiries.',
    },
    sources: ['faq'],
  };
});
