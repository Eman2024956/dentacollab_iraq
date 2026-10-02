import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Add CORS headers so localhost:5173 can fetch freely
function corsResponse(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return corsResponse({}, 200);
}

export async function GET() {
  try {
    // 1. Settings & About & Contact
    const settingsDoc = await adminDb.collection('appSettings').doc('public').get();
    const settingsData = settingsDoc.exists ? settingsDoc.data() : {};

    // 2. Instructors
    const instSnapshot = await adminDb.collection('instructors').get();
    const instructors = instSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. Courses
    const coursesSnapshot = await adminDb.collection('courses').get();
    const courses = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 4. Workshops
    const workshopsSnapshot = await adminDb.collection('workshops').get();
    const workshops = workshopsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 5. Graduates / Testimonials
    const gradSnapshot = await adminDb.collection('graduates').get();
    let graduates: any[] = gradSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (graduates.length === 0) {
      // Return default rich graduates
      graduates = [
        {
          id: '1',
          name: { ar: 'د. علي حسين السعدي', en: 'Dr. Ali Hussain Al-Saadi' },
          course: { ar: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات', en: 'Digital Dentistry Foundations & Restorations' },
          quote: {
            ar: 'الدورة نقلت عمل عيادتي بالكامل من الطريقة التقليدية إلى المسح والتصميم الرقمي عبر Exocad. التطبيق العملي الفردي في مختبر المنصور كان مبهراً.',
            en: 'The course completely transformed my clinic practice to digital scanning and Exocad restorative design. The hands-on practice in Baghdad was stellar.',
          },
          rating: 5,
        },
        {
          id: '2',
          name: { ar: 'د. فاطمة مهدي الرديني', en: 'Dr. Fatima Mahdi Al-Rudaini' },
          course: { ar: 'تخطيط الزرعات والدليل الجراحي الرقمي', en: 'Implant Planning & Surgical Guides' },
          quote: {
            ar: 'إتقان برنامج Exoplan وتصميم الأدلة الجراحية الموجهة أعطاني ثقة ودقة مضاعفة أثناء غرس الزرعات في العمليات السريرية.',
            en: 'Mastering Exoplan and custom surgical guide design gave me tremendous confidence and accuracy in clinical implant placements.',
          },
          rating: 5,
        },
        {
          id: '3',
          name: { ar: 'د. سرمد عبد الكريم', en: 'Dr. Sarmad Abdul-Karim' },
          course: { ar: 'الطباعة ثلاثية الأبعاد لطب الأسنان', en: 'Dental 3D Printing' },
          quote: {
            ar: 'أفضل استثمار لتقنيي وأطباء الأسنان، تعلمنا معايرة طابعات الراتنج وغسيل ومعالجة النماذج بدون أي أخطاء في الإطباق.',
            en: 'The best training investment for dental labs and doctors; we learned resin calibration and post-curing without occlusion discrepancies.',
          },
          rating: 5,
        },
      ];
    }

    // 6. Gallery
    const gallerySnapshot = await adminDb.collection('gallery').get();
    let gallery: any[] = gallerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (gallery.length === 0) {
      gallery = [
        {
          id: 'gal-1',
          title: { ar: 'من التصميم الرقمي إلى التطبيق السريري', en: 'From digital design to clinical reality' },
          description: { ar: 'مراحل سير العمل الرقمي الشامل داخل مختبر الأكاديمية ببغداد', en: 'Full digital workflow stages in our Baghdad academy lab' },
          images: ['step-1.jpg', 'step-2.jpg', 'step-3.jpg', 'step-4.jpg'],
        },
        {
          id: 'gal-2',
          title: { ar: 'التقنيات ومحطات العمل الرقمية', en: 'Digital technology & workstations' },
          description: { ar: 'أجهزة مسح ضوئي، حواسيب Exocad المرخصة، وطابعات Formlabs ثلاثية الأبعاد', en: 'Scanners, licensed Exocad workstations, and 3D resin printers' },
          images: ['smale.jpg', 'exoplan.jpg', 'printer.jpg'],
        },
      ];
    }

    return corsResponse({
      success: true,
      settings: settingsData,
      instructors,
      courses,
      workshops,
      graduates,
      gallery,
    });
  } catch (error: any) {
    console.error('Error fetching dynamic content:', error);
    return corsResponse({ error: error.message || 'Failed to fetch content' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body;
    const nowIso = new Date().toISOString();

    if (!section || !data) {
      return corsResponse({ error: 'Section and data are required' }, 400);
    }

    if (section === 'settings') {
      await adminDb.collection('appSettings').doc('public').set({
        ...data,
        updatedAt: nowIso,
      }, { merge: true });
    } else if (section === 'instructors') {
      const docId = data.id || `inst_${Date.now()}`;
      await adminDb.collection('instructors').doc(docId).set({
        ...data,
        id: docId,
        updatedAt: nowIso,
      }, { merge: true });
    } else if (section === 'graduates') {
      const docId = data.id || `grad_${Date.now()}`;
      await adminDb.collection('graduates').doc(docId).set({
        ...data,
        id: docId,
        updatedAt: nowIso,
      }, { merge: true });
    } else if (section === 'gallery') {
      const docId = data.id || `gal_${Date.now()}`;
      await adminDb.collection('gallery').doc(docId).set({
        ...data,
        id: docId,
        updatedAt: nowIso,
      }, { merge: true });
    }

    // Log update in auditLogs
    await adminDb.collection('auditLogs').add({
      action: `cms.${section}.update`,
      summary: `تحديث محتوى قسم ${section} في الموقع الإلكتروني والأكاديمية`,
      admin: 'admin@dentacollab.org',
      timestamp: nowIso,
    });

    return corsResponse({ success: true, message: 'Content updated successfully' });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return corsResponse({ error: error.message || 'Failed to update content' }, 500);
  }
}
