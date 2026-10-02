import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_GRADUATES = [
  {
    id: 'grad_ali_saadi',
    name: { ar: 'د. علي حسين السعدي', en: 'Dr. Ali Hussain Al-Saadi' },
    city: 'بغداد',
    profession: 'طبيب أسنان عام',
    courseId: 'digital-dentistry-foundations',
    courseTitle: { ar: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات (Exocad)', en: 'Digital Dentistry Foundations (Exocad)' },
    quote: { ar: 'غيّرت الدورة أسلوب عملي بشكل جذري. أستخدم Exocad يومياً الآن في عيادتي وأحصل على نتائج مذهلة لمرضاي.', en: 'The course radically changed how I work. I use Exocad daily in my clinic now with amazing results.' },
    rating: 5,
    graduationDate: '2026-09-15',
    image: '',
    status: 'published',
  },
  {
    id: 'grad_fatima_mahdi',
    name: { ar: 'د. فاطمة مهدي الرديني', en: 'Dr. Fatima Mahdi Al-Rudaini' },
    city: 'النجف الأشرف',
    profession: 'أخصائية جراحة وجه وفكين',
    courseId: 'implant-planning',
    courseTitle: { ar: 'تخطيط الزرعات والدليل الجراحي الرقمي (Exoplan)', en: 'Implant Planning & Surgical Guide Design (Exoplan)' },
    quote: { ar: 'لا أتخيل عملي بدون تخطيط رقمي الآن. وفّر لي الدورة الوقت والدقة والثقة في كل جراحة أجريها.', en: 'I cannot imagine my work without digital planning now. The course gave me time savings, precision and confidence in every surgery.' },
    rating: 5,
    graduationDate: '2026-09-15',
    image: '',
    status: 'published',
  },
  {
    id: 'grad_sarmad_karim',
    name: { ar: 'د. سرمد عبد الكريم', en: 'Dr. Sarmad Abdul-Karim' },
    city: 'أربيل',
    profession: 'تقني أسنان / مصمم CAD/CAM',
    courseId: 'dental-3d-printing',
    courseTitle: { ar: 'الطباعة ثلاثية الأبعاد لطب الأسنان', en: 'Dental 3D Printing & Model Production' },
    quote: { ar: 'من اليوم الأول كانت الجلسات عملية ومباشرة. تعلّمت معايرة الطابعات وأنتج نماذج احترافية في ساعات.', en: 'From day one, sessions were practical and direct. I learned printer calibration and produce professional models in hours.' },
    rating: 5,
    graduationDate: '2026-09-15',
    image: '',
    status: 'published',
  },
];

export async function GET() {
  try {
    const snapshot = await adminDb.collection('graduates').orderBy('graduationDate', 'desc').get().catch(() =>
      adminDb.collection('graduates').get()
    );

    if (snapshot.empty) {
      const nowIso = new Date().toISOString();
      for (const g of DEFAULT_GRADUATES) {
        await adminDb.collection('graduates').doc(g.id).set({ ...g, createdAt: nowIso, updatedAt: nowIso });
      }
      return NextResponse.json({ success: true, graduates: DEFAULT_GRADUATES });
    }

    const graduates = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, graduates, count: graduates.length });
  } catch (error: any) {
    console.error('Error fetching graduates:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nameAr, nameEn, city, profession, courseId, courseTitleAr, courseTitleEn, quoteAr, quoteEn, rating, graduationDate, image, status } = body;
    if (!nameAr) return NextResponse.json({ error: 'اسم الخريج مطلوب' }, { status: 400 });

    const nowIso = new Date().toISOString();
    const id = `grad_${Date.now()}`;

    const data = {
      id,
      name: { ar: nameAr, en: nameEn || nameAr },
      city: city || '',
      profession: profession || '',
      courseId: courseId || '',
      courseTitle: { ar: courseTitleAr || '', en: courseTitleEn || courseTitleAr || '' },
      quote: { ar: quoteAr || '', en: quoteEn || quoteAr || '' },
      rating: Number(rating) || 5,
      graduationDate: graduationDate || nowIso.slice(0, 10),
      image: image || '',
      status: status || 'published',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await adminDb.collection('graduates').doc(id).set(data);
    await adminDb.collection('auditLogs').add({ action: 'graduate.create', id, nameAr, timestamp: nowIso, admin: 'admin@dentacollab.org' });

    return NextResponse.json({ success: true, id, graduate: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nameAr, nameEn, city, profession, courseId, courseTitleAr, courseTitleEn, quoteAr, quoteEn, rating, graduationDate, image, status } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

    const nowIso = new Date().toISOString();
    const existing = (await adminDb.collection('graduates').doc(id).get()).data() || {};

    const updates: Record<string, any> = { updatedAt: nowIso };
    if (nameAr !== undefined || nameEn !== undefined) updates.name = { ar: nameAr ?? existing.name?.ar ?? '', en: nameEn ?? existing.name?.en ?? '' };
    if (city !== undefined) updates.city = city;
    if (profession !== undefined) updates.profession = profession;
    if (courseId !== undefined) updates.courseId = courseId;
    if (courseTitleAr !== undefined || courseTitleEn !== undefined) updates.courseTitle = { ar: courseTitleAr ?? existing.courseTitle?.ar ?? '', en: courseTitleEn ?? existing.courseTitle?.en ?? '' };
    if (quoteAr !== undefined || quoteEn !== undefined) updates.quote = { ar: quoteAr ?? existing.quote?.ar ?? '', en: quoteEn ?? existing.quote?.en ?? '' };
    if (rating !== undefined) updates.rating = Number(rating);
    if (graduationDate !== undefined) updates.graduationDate = graduationDate;
    if (image !== undefined) updates.image = image;
    if (status !== undefined) updates.status = status;

    await adminDb.collection('graduates').doc(id).set(updates, { merge: true });
    await adminDb.collection('auditLogs').add({ action: 'graduate.update', id, timestamp: nowIso, admin: 'admin@dentacollab.org' });

    return NextResponse.json({ success: true, message: 'تم تحديث بيانات الخريج' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

    await adminDb.collection('graduates').doc(id).delete();
    await adminDb.collection('auditLogs').add({ action: 'graduate.delete', id, timestamp: new Date().toISOString(), admin: 'admin@dentacollab.org' });

    return NextResponse.json({ success: true, message: 'تم حذف الخريج' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
