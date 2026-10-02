import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminApp } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

const DEFAULT_BANNER_SETTINGS = {
  isVisible: true,
  enableAnimation: true,
  animationIntervalSeconds: 4,
  slides: [
    {
      id: 'slide_1',
      tag: 'التدريب الميداني المعتمد',
      title: 'صمّم. خطّط. نفّذ.',
      description: 'برامج تدريبية تخصصية في التصميم الرقمي عبر Exocad، وتخطيط الزرعات Exoplan، والطباعة ثلاثية الأبعاد بأحدث المعدات في بغداد.',
      image: '',
      actionType: 'courses',
      actionText: 'استكشف الدورات',
      order: 1,
    },
    {
      id: 'slide_2',
      tag: 'دبلوم الجراحة الموجهة',
      title: 'الدليل الجراحي الرقمي',
      description: 'إتقان سير العمل الجراحي الرقمي من تخطيط الأشعة CBCT حتى طباعة الأدلة الجراحية ووضع الزرعات بدقة سريرية متناهية.',
      image: '',
      actionType: 'workshops',
      actionText: 'ورش العمل المتاحة',
      order: 2,
    },
    {
      id: 'slide_3',
      tag: 'تقنيات الابتسامة ثلاثية الأبعاد',
      title: 'معايرة طباعة الراتنج الطبي',
      description: 'تطبيقات عملية مباشرة على طابعات Formlabs و Phrozen لإنتاج نماذج الأسنان والتعويضات بدقة ميكرونية فائقة.',
      image: '',
      actionType: 'services',
      actionText: 'خدمات المختبر الرقمي',
      order: 3,
    },
  ],
};

export async function GET() {
  try {
    const docRef = adminDb.collection('appSettings').doc('heroBanner');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      const nowIso = new Date().toISOString();
      const initialData = {
        ...DEFAULT_BANNER_SETTINGS,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      await docRef.set(initialData);
      return corsResponse({ success: true, settings: initialData });
    }

    const data = docSnap.data() || {};
    return corsResponse({
      success: true,
      settings: {
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
        enableAnimation: data.enableAnimation !== undefined ? data.enableAnimation : true,
        animationIntervalSeconds: Number(data.animationIntervalSeconds) || 4,
        slides: Array.isArray(data.slides) && data.slides.length > 0 ? data.slides : DEFAULT_BANNER_SETTINGS.slides,
        updatedAt: data.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching hero banner settings:', error);
    return corsResponse({ error: error.message || 'Failed to fetch banner settings' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { isVisible, enableAnimation, animationIntervalSeconds, slides } = body;

    const docRef = adminDb.collection('appSettings').doc('heroBanner');
    const existing = (await docRef.get()).data() || {};
    const nowIso = new Date().toISOString();

    const updates: Record<string, any> = {
      updatedAt: nowIso,
    };

    if (isVisible !== undefined) updates.isVisible = Boolean(isVisible);
    if (enableAnimation !== undefined) updates.enableAnimation = Boolean(enableAnimation);
    if (animationIntervalSeconds !== undefined) {
      updates.animationIntervalSeconds = Math.max(2, Math.min(15, Number(animationIntervalSeconds) || 4));
    }
    if (Array.isArray(slides)) {
      updates.slides = slides;
    }

    await docRef.set(updates, { merge: true });

    // Sync to (default) database and public settings so mobile client receives real-time snapshot
    try {
      const defaultDb = getFirestore(adminApp);
      await defaultDb.collection('appSettings').doc('heroBanner').set(updates, { merge: true });
      await defaultDb.collection('heroBanners').doc('current').set(updates, { merge: true });
      await adminDb.collection('heroBanners').doc('current').set(updates, { merge: true });
    } catch (e) {
      console.warn('Sync to default database / backup path skipped:', e);
    }

    // Audit log
    try {
      await adminDb.collection('auditLogs').add({
        action: 'banner.settings.update',
        isVisible: updates.isVisible ?? existing.isVisible,
        enableAnimation: updates.enableAnimation ?? existing.enableAnimation,
        slidesCount: updates.slides ? updates.slides.length : (existing.slides?.length || 0),
        timestamp: nowIso,
        admin: 'admin@dentacollab.org',
      });
    } catch (_) {}

    return corsResponse({
      success: true,
      message: 'تم تحديث إعدادات البانر المتحرك بنجاح',
      settings: {
        ...existing,
        ...updates,
      },
    });
  } catch (error: any) {
    console.error('Error updating banner settings:', error);
    return corsResponse({ error: error.message || 'Failed to update banner settings' }, 500);
  }
}
