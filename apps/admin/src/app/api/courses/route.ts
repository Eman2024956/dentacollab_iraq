import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminApp } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('courses').get();
    const courses = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        titleAr: data.title?.ar || data.titleAr || data.title || '',
        titleEn: data.title?.en || data.titleEn || '',
        category: data.category || 'عام',
        level: data.level === 'basic' ? 'مبتدئ / أساسي' : data.level === 'advanced' ? 'متقدم' : data.level || 'جميع المستويات',
        duration: data.duration || '٤ أسابيع',
        priceMinorUnits: data.priceMinorUnits || 0,
        price: data.priceMinorUnits ? `${data.priceMinorUnits.toLocaleString()} د.ع` : (data.price || 'مخصص'),
        status: data.publicationStatus || 'published',
        image: data.image || data.imageUrl || '',
        imageUrl: data.imageUrl || data.image || '',
        cohortsCount: 1,
        totalEnrolled: 0,
        descriptionAr: data.description?.ar || '',
        descriptionEn: data.description?.en || '',
        syllabus: data.syllabus || data.curriculum || data.modules || [],
      };
    });

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      titleAr,
      titleEn,
      category,
      level,
      priceMinorUnits,
      descriptionAr,
      descriptionEn,
      cohortTitle,
      venueName,
      maxCapacity = 12,
      image,
      imageUrl,
    } = body;

    if (!titleAr) {
      return NextResponse.json({ error: 'العنوان باللغة العربية مطلوب' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const slug = (titleEn || titleAr)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const courseId = slug || `course_${Date.now()}`;
    const finalImage = imageUrl || image || '';

    const courseData = {
      id: courseId,
      slug: courseId,
      title: {
        ar: titleAr,
        en: titleEn || titleAr,
      },
      description: {
        ar: descriptionAr || '',
        en: descriptionEn || '',
      },
      level: level || 'basic',
      category: category || 'Exocad',
      priceMinorUnits: Number(priceMinorUnits) || 450000,
      image: finalImage,
      imageUrl: finalImage,
      deliveryMode: 'in_person',
      publicationStatus: 'published',
      publishedAt: nowIso,
      instructorIds: ['dr-ammar-salieh'],
      featured: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await adminDb.collection('courses').doc(courseId).set(courseData, { merge: true });

    // Optionally create the initial cohort
    const cohortId = `cohort-${courseId}-${Date.now().toString().slice(-4)}`;
    await adminDb.collection('courseCohorts').doc(cohortId).set({
      id: cohortId,
      courseId: courseId,
      title: {
        ar: cohortTitle || `دفعة ${titleAr}`,
        en: `Cohort — ${titleEn || titleAr}`,
      },
      venueName: {
        ar: venueName || 'مقر أكاديمية DentaCollab — بغداد، المنصور',
        en: 'DentaCollab Academy Lab — Baghdad, Al-Mansour',
      },
      maxCapacity: Number(maxCapacity) || 12,
      reservedSeats: 0,
      waitlistCount: 0,
      registrationOpen: true,
      publicationStatus: 'published',
      price: {
        amountMinorUnits: Number(priceMinorUnits) || 450000,
        currency: 'IQD',
        exponent: 0,
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    }, { merge: true });

    // Log in auditLogs
    await adminDb.collection('auditLogs').add({
      action: 'course.create',
      courseId,
      titleAr,
      timestamp: nowIso,
      admin: 'admin@dentacollab.org',
    });

    return NextResponse.json({ success: true, courseId, course: courseData });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, publicationStatus, image, imageUrl, titleAr, titleEn, category, level, duration, priceMinorUnits, descriptionAr, descriptionEn, syllabus } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف الدورة id مطلوب' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const updates: Record<string, any> = {
      updatedAt: nowIso,
    };

    const finalStatus = publicationStatus !== undefined ? publicationStatus : status;
    if (finalStatus !== undefined) {
      updates.publicationStatus = finalStatus;
      updates.status = finalStatus;
    }

    const courseImage = imageUrl !== undefined ? imageUrl : image;
    if (courseImage !== undefined) {
      updates.image = courseImage;
      updates.imageUrl = courseImage;
    }

    if (titleAr !== undefined || titleEn !== undefined) {
      updates.title = {
        ar: titleAr ?? '',
        en: titleEn ?? titleAr ?? '',
      };
    }

    if (descriptionAr !== undefined || descriptionEn !== undefined) {
      updates.description = {
        ar: descriptionAr ?? '',
        en: descriptionEn ?? '',
      };
    }

    if (category !== undefined) updates.category = category;
    if (level !== undefined) updates.level = level;
    if (duration !== undefined) updates.duration = duration;
    if (priceMinorUnits !== undefined) updates.priceMinorUnits = Number(priceMinorUnits);
    if (syllabus !== undefined) {
      updates.syllabus = syllabus;
      // also keep modules for backwards compatibility
      updates.modules = syllabus.map((m: any) => ({
        ar: m.title || 'وحدة تدريبية',
        en: m.titleEn || m.title || '',
      }));
    }

    // Synchronize across both databases
    const targetDatabases = ['dentacollab', '(default)'];
    for (const dbName of targetDatabases) {
      try {
        const dbInstance = getFirestore(adminApp, dbName);
        await dbInstance.collection('courses').doc(id).set(updates, { merge: true });
      } catch (err) {
        console.warn(`[Courses API] Warning updating database ${dbName}:`, err);
      }
    }

    // Also update associated cohorts if status changed
    if (finalStatus !== undefined) {
      for (const dbName of targetDatabases) {
        try {
          const dbInstance = getFirestore(adminApp, dbName);
          const cohortsSnap = await dbInstance.collection('courseCohorts').where('courseId', '==', id).get();
          if (!cohortsSnap.empty) {
            const batch = dbInstance.batch();
            cohortsSnap.forEach((doc) => {
              batch.set(doc.ref, { publicationStatus: finalStatus, status: finalStatus, updatedAt: nowIso }, { merge: true });
            });
            await batch.commit();
          }
        } catch (_) {}
      }
    }

    return NextResponse.json({ success: true, id, status: finalStatus, updates });
  } catch (error: any) {
    console.error('Error updating course status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update course' }, { status: 500 });
  }
}
