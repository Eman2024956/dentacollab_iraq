import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminApp } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_GALLERY = [
  {
    id: 'gallery_digital_workflow',
    title: { ar: 'من التصميم إلى الواقع — سير العمل الرقمي', en: 'From Design to Reality — Digital Workflow' },
    description: { ar: 'مراحل سير العمل الرقمي الكامل: من المسح الرقمي إلى إنتاج التاج والجسر', en: 'Complete digital workflow stages: from intraoral scan to crown & bridge production' },
    images: ['step-1.jpg', 'step-2.jpg', 'step-3.jpg', 'step-4.jpg'],
    category: 'سير العمل',
    order: 1,
    status: 'published',
  },
  {
    id: 'gallery_digital_tech',
    title: { ar: 'تقنيات التصميم والطباعة الرقمية', en: 'Digital Design & Printing Technologies' },
    description: { ar: 'معرض لأبرز تقنيات التصميم الرقمي والطباعة ثلاثية الأبعاد المستخدمة في الأكاديمية', en: 'Gallery of digital design and 3D printing technologies used at the academy' },
    images: ['smale.jpg', 'exoplan.jpg', 'printer.jpg'],
    category: 'التقنيات الرقمية',
    order: 2,
    status: 'published',
  },
  {
    id: 'gallery_workshop_sessions',
    title: { ar: 'جلسات الورش العملية والتدريب الميداني', en: 'Hands-On Workshop & Lab Sessions' },
    description: { ar: 'لقطات من جلسات التدريب العملي على أجهزة المسح وطابعات الراتنج الطبية في مختبر الأكاديمية', en: 'Snapshots from hands-on training sessions on scanning devices and dental resin printers' },
    images: ['step-1.jpg', 'smale.jpg', 'exoplan.jpg'],
    category: 'ورش عمل',
    order: 3,
    status: 'published',
  },
];

export async function GET() {
  try {
    const snapshot = await adminDb.collection('gallery').orderBy('order', 'asc').get().catch(() =>
      adminDb.collection('gallery').get()
    );

    if (snapshot.empty) {
      return NextResponse.json({ success: true, gallery: [], count: 0 });
    }

    const gallery = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, gallery, count: gallery.length });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titleAr, titleEn, descriptionAr, descriptionEn, images, category, order, status } = body;
    if (!titleAr) return NextResponse.json({ error: 'عنوان الألبوم مطلوب' }, { status: 400 });

    const nowIso = new Date().toISOString();
    const id = `gallery_${Date.now()}`;

    const imageArray = Array.isArray(images)
      ? images
      : typeof images === 'string'
        ? images.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];

    const data = {
      id,
      title: { ar: titleAr, en: titleEn || titleAr },
      description: { ar: descriptionAr || '', en: descriptionEn || descriptionAr || '' },
      images: imageArray,
      category: category || 'عام',
      order: Number(order) || 99,
      status: status || 'published',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await adminDb.collection('gallery').doc(id).set(data);
    try {
      const defaultDb = getFirestore(adminApp);
      await defaultDb.collection('gallery').doc(id).set(data);
    } catch (_) {}

    await adminDb.collection('auditLogs').add({ action: 'gallery.create', id, titleAr, timestamp: nowIso, admin: 'admin@dentacollab.org' });

    return NextResponse.json({ success: true, id, album: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, titleAr, titleEn, descriptionAr, descriptionEn, images, category, order, status } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

    const nowIso = new Date().toISOString();
    const existing = (await adminDb.collection('gallery').doc(id).get()).data() || {};

    const updates: Record<string, any> = { updatedAt: nowIso };
    if (titleAr !== undefined || titleEn !== undefined) updates.title = { ar: titleAr ?? existing.title?.ar ?? '', en: titleEn ?? existing.title?.en ?? '' };
    if (descriptionAr !== undefined || descriptionEn !== undefined) updates.description = { ar: descriptionAr ?? existing.description?.ar ?? '', en: descriptionEn ?? existing.description?.en ?? '' };
    if (images !== undefined) {
      updates.images = Array.isArray(images) ? images : typeof images === 'string' ? images.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
    }
    if (category !== undefined) updates.category = category;
    if (order !== undefined) updates.order = Number(order);
    if (status !== undefined) updates.status = status;

    await adminDb.collection('gallery').doc(id).set(updates, { merge: true });
    try {
      const defaultDb = getFirestore(adminApp);
      await defaultDb.collection('gallery').doc(id).set(updates, { merge: true });
    } catch (_) {}

    await adminDb.collection('auditLogs').add({ action: 'gallery.update', id, timestamp: nowIso, admin: 'admin@dentacollab.org' });

    return NextResponse.json({ success: true, message: 'تم تحديث الألبوم' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    const clearAll = searchParams.get('clearAll') === 'true';

    const defaultDb = getFirestore(adminApp);

    // 1. Clear All Gallery Albums
    if (clearAll) {
      const snap = await adminDb.collection('gallery').get();
      const batch = adminDb.batch();
      snap.docs.forEach((doc: any) => batch.delete(doc.ref));
      await batch.commit();

      try {
        const snap2 = await defaultDb.collection('gallery').get();
        const batch2 = defaultDb.batch();
        snap2.docs.forEach((doc: any) => batch2.delete(doc.ref));
        await batch2.commit();
      } catch (_) {}

      await adminDb.collection('auditLogs').add({
        action: 'gallery.clearAll',
        timestamp: new Date().toISOString(),
        admin: 'admin@dentacollab.org',
      });

      return NextResponse.json({ success: true, message: 'تم مسح كامل معرض الصور بنجاح' });
    }

    // 2. Batch Delete Selected IDs
    if (ids) {
      const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
      const batch = adminDb.batch();
      idList.forEach((itemId) => {
        batch.delete(adminDb.collection('gallery').doc(itemId));
      });
      await batch.commit();

      try {
        const batch2 = defaultDb.batch();
        idList.forEach((itemId) => {
          batch2.delete(defaultDb.collection('gallery').doc(itemId));
        });
        await batch2.commit();
      } catch (_) {}

      await adminDb.collection('auditLogs').add({
        action: 'gallery.bulkDelete',
        ids: idList,
        timestamp: new Date().toISOString(),
        admin: 'admin@dentacollab.org',
      });

      return NextResponse.json({ success: true, message: `تم حذف ${idList.length} ألبومات بنجاح` });
    }

    // 3. Single Album Delete
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });

    await adminDb.collection('gallery').doc(id).delete();
    try {
      await defaultDb.collection('gallery').doc(id).delete();
    } catch (_) {}

    await adminDb.collection('auditLogs').add({
      action: 'gallery.delete',
      id,
      timestamp: new Date().toISOString(),
      admin: 'admin@dentacollab.org',
    });

    return NextResponse.json({ success: true, message: 'تم حذف الألبوم' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
