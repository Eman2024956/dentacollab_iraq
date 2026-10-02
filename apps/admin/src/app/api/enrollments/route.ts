import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('enrollments').get();
    const enrollments = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        studentName: data.studentName || 'طالب مسجل',
        studentEmail: data.studentEmail || '',
        studentPhone: data.studentPhone || '',
        courseId: data.courseId || '',
        courseTitle: data.courseTitle || data.courseId || 'برنامج طب الأسنان الرقمي',
        cohortId: data.cohortId || 'دفعة تشرين الأول ٢٠٢٦',
        status: data.status || 'enrolled',
        paymentStatus: data.paymentStatus || 'paid',
        amountPaid: data.amountPaid || '450,000 د.ع',
        passToken: data.passToken || `dc_pass_${doc.id}`,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    });

    return NextResponse.json({ success: true, enrollments });
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName,
      studentEmail,
      studentPhone,
      courseId = 'digital-dentistry-foundations',
      courseTitle = 'أساسيات طب الأسنان الرقمي وتصميم التركيبات',
      cohortId = 'cohort-digital-dentistry-foundations-oct2026',
      status = 'enrolled',
      paymentStatus = 'paid',
      amountPaid = '450,000 د.ع',
    } = body;

    if (!studentName) {
      return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const enrollmentId = `enr_${Date.now()}`;
    const passToken = `dc_pass_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const enrollmentData = {
      id: enrollmentId,
      studentName,
      studentEmail: studentEmail || '',
      studentPhone: studentPhone || '',
      courseId,
      courseTitle,
      cohortId,
      status,
      paymentStatus,
      amountPaid,
      passToken,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await adminDb.collection('enrollments').doc(enrollmentId).set(enrollmentData, { merge: true });

    // Also create attendance record for pass
    await adminDb.collection('attendance').doc(passToken).set({
      id: passToken,
      enrollmentId,
      studentName,
      courseTitle,
      checkedIn: false,
      validFrom: nowIso,
      createdAt: nowIso,
    }, { merge: true });

    // Log in auditLogs
    await adminDb.collection('auditLogs').add({
      action: 'enrollment.create',
      enrollmentId,
      studentName,
      timestamp: nowIso,
      admin: 'admin@dentacollab.org',
    });

    return NextResponse.json({ success: true, enrollmentId, enrollment: enrollmentData });
  } catch (error: any) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: error.message || 'Failed to create enrollment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف التسجيل مطلوب' }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date().toISOString() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await adminDb.collection('enrollments').doc(id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json({ error: error.message || 'Failed to update enrollment' }, { status: 500 });
  }
}
