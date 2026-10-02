import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Default initial instructors if collection is empty
const DEFAULT_INSTRUCTORS = [
  {
    id: 'dr-ammar-saleh',
    name: {
      ar: 'د. عمار صالح الرديني',
      en: 'Dr. Ammar Saleh Al-Rudaini',
    },
    title: {
      ar: 'أخصائي جراحة الفم والزرعات — مدرب معتمد Exocad & Exoplan',
      en: 'Oral Surgery & Implant Specialist — Certified Exocad & Exoplan Trainer',
    },
    image: 'dr-ammar.png',
    bio: {
      ar: 'طبيب أسنان واستشاري جراحة وجه وفكين، خبير في سير العمل الرقمي الشامل وتصميم الأدلة الجراحية الموجهة. قدّم أكثر من ٤٠ ورشة عمل عملية في بغداد وإقليم كردستان.',
      en: 'Dental surgeon and maxillofacial consultant, specialist in full digital clinical workflow and surgical guide design. Delivered 40+ hands-on workshops across Iraq.',
    },
    credentials: [
      { ar: 'التصميم الرقمي (Exocad)', en: 'Digital Design (Exocad)' },
      { ar: 'الجراحة الموجهة (Exoplan)', en: 'Guided Surgery (Exoplan)' },
      { ar: 'الطباعة ثلاثية الأبعاد (Formlabs)', en: '3D Printing (Formlabs)' },
      { ar: 'تأهيل سريري متقدم', en: 'Advanced Clinical Training' },
    ],
    courses: ['digital-dentistry-foundations', 'implant-planning'],
    phone: '+964 781 782 8545',
    email: 'dr.ammar@dentacollab.org',
    role: 'كبير المدربين والمؤسس',
    order: 1,
    status: 'active',
  },
  {
    id: 'dr-ali-saadi',
    name: {
      ar: 'د. علي حسين السعدي',
      en: 'Dr. Ali Hussain Al-Saadi',
    },
    title: {
      ar: 'أخصائي التركيبات الثابتة وتجميل الأسنان الرقمي',
      en: 'Prosthodontics Specialist & Digital Smile Design',
    },
    image: 'dr-ali.png',
    bio: {
      ar: 'متخصص في تصميم الابتسامة الرقمية (DSD) وإعادة بناء الإطباق الكامل عبر تقنيات الـ CAD/CAM الحديثة والمعايرة المخبرية الدقيقة.',
      en: 'Specialist in Digital Smile Design (DSD) and full-mouth rehabilitation using modern CAD/CAM protocols and precision lab calibration.',
    },
    credentials: [
      { ar: 'تصميم الابتسامة (DSD)', en: 'Digital Smile Design (DSD)' },
      { ar: 'التيجان والجسور الخزفية', en: 'Ceramic Crowns & Bridges' },
      { ar: 'المسح داخل الفم', en: 'Intraoral Scanning' },
    ],
    courses: ['digital-dentistry-foundations', 'dental-3d-printing'],
    phone: '+964 770 123 4567',
    email: 'dr.ali@dentacollab.org',
    role: 'مدرب معتمد',
    order: 2,
    status: 'active',
  },
  {
    id: 'dr-sarmad-karim',
    name: {
      ar: 'د. سرمد عبد الكريم',
      en: 'Dr. Sarmad Abdul-Karim',
    },
    title: {
      ar: 'خبير تقنيات المسح ومعايرة طابعات الراتنج ثلاثية الأبعاد',
      en: 'Scanning Systems & 3D Dental Printing Specialist',
    },
    image: 'dr-sarmad.png',
    bio: {
      ar: 'مشرف على مختبر تصنيع النماذج ثلاثية الأبعاد والطباعة الحيوية، خبير في برمجيات PreForm والمعالجة الضوئية للراتنجات الطبية.',
      en: 'Supervisor of 3D model fabrication and biocompatible printing, expert in slicing workflows and post-processing protocols.',
    },
    credentials: [
      { ar: 'معايرة طابعات الراتنج', en: 'Resin 3D Printing Calibration' },
      { ar: 'تصميم النماذج التعويضية', en: 'Prosthetic Models Design' },
    ],
    courses: ['dental-3d-printing'],
    phone: '+964 750 456 7890',
    email: 'dr.sarmad@dentacollab.org',
    role: 'مشرف المختبر الرقمي',
    order: 3,
    status: 'active',
  },
];

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDb.collection('instructors').get();

    if (snapshot.empty) {
      // Seed default instructors
      const batch = adminDb.getFirestore().batch();
      for (const inst of DEFAULT_INSTRUCTORS) {
        const ref = adminDb.collection('instructors').doc(inst.id);
        batch.set(ref, inst);
      }
      await batch.commit();

      return NextResponse.json({
        success: true,
        instructors: DEFAULT_INSTRUCTORS,
        count: DEFAULT_INSTRUCTORS.length,
      });
    }

    const instructors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by order if present
    instructors.sort((a: any, b: any) => (a.order || 99) - (b.order || 99));

    return NextResponse.json({
      success: true,
      instructors,
      count: instructors.length,
    });
  } catch (error: any) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.name || (!body.name.ar && typeof body.name !== 'string')) {
      return NextResponse.json(
        { success: false, error: 'اسم المدرب مطلوب بالعربية' },
        { status: 400 }
      );
    }

    const id = body.id || body.slug || `inst_${Date.now()}`;

    const instructorData = {
      id,
      name: typeof body.name === 'string' ? { ar: body.name, en: body.nameEn || body.name } : body.name,
      title: typeof body.title === 'string' ? { ar: body.title, en: body.titleEn || body.title } : (body.title || { ar: '', en: '' }),
      bio: typeof body.bio === 'string' ? { ar: body.bio, en: body.bioEn || body.bio } : (body.bio || { ar: '', en: '' }),
      image: body.image || 'dr-ammar.png',
      credentials: Array.isArray(body.credentials)
        ? body.credentials.map((c: any) =>
            typeof c === 'string' ? { ar: c, en: c } : c
          )
        : [],
      courses: Array.isArray(body.courses) ? body.courses : [],
      phone: body.phone || '+964 781 782 8545',
      email: body.email || 'info@dentacollab.org',
      role: body.role || 'مدرب معتمد',
      order: Number(body.order) || 99,
      status: body.status || 'active',
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('instructors').doc(id).set(instructorData, { merge: true });

    // Record audit log
    await adminDb.collection('auditLogs').add({
      action: 'INSTRUCTOR_CREATED',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      target: `instructor:${id}`,
      collection: 'instructors',
      details: `إضافة المدرب: ${instructorData.name.ar} (${instructorData.title.ar})`,
      time: new Date().toLocaleDateString('ar-IQ', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'تمت إضافة المدرب بنجاح',
      instructor: instructorData,
    });
  } catch (error: any) {
    console.error('Error adding instructor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add instructor' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرّف المدرب مطلوب للترقية والتحديث' },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection('instructors').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: 'المدرب غير موجود في النظام' },
        { status: 404 }
      );
    }

    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(payload, { merge: true });

    // Record audit log
    await adminDb.collection('auditLogs').add({
      action: 'INSTRUCTOR_UPDATED',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      target: `instructor:${id}`,
      collection: 'instructors',
      details: `تحديث بيانات المدرب: ${id}`,
      time: new Date().toLocaleDateString('ar-IQ', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المدرب بنجاح',
    });
  } catch (error: any) {
    console.error('Error updating instructor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update instructor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المدرب مطلوب للحذف' },
        { status: 400 }
      );
    }

    await adminDb.collection('instructors').doc(id).delete();

    // Audit log
    await adminDb.collection('auditLogs').add({
      action: 'INSTRUCTOR_DELETED',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      target: `instructor:${id}`,
      collection: 'instructors',
      details: `حذف المدرب: ${id}`,
      time: new Date().toLocaleDateString('ar-IQ', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المدرب بنجاح',
    });
  } catch (error: any) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete instructor' },
      { status: 500 }
    );
  }
}
