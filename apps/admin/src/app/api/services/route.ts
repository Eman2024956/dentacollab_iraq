import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_SERVICES = [
  {
    id: 'service_exocad_design',
    slug: 'exocad-restoration-design',
    title: {
      ar: 'خدمات التصميم الرقمي واستشارات Exocad',
      en: 'Digital Dentistry Consultation & Exocad Design',
    },
    summary: {
      ar: 'تصميم التيجان والجسور والابتسامة الرقمية (Digital Smile Design) للعيادات والمختبرات بدقة متناهية.',
      en: 'Crown & bridge design, digital smile design (DSD), and restorative CAD files.',
    },
    description: {
      ar: 'فريق متخصص من خبراء طب الأسنان الرقمي يوفر تصاميم معتمدة متوافقة مع جميع أجهزة التفريز والطباعة ثلاثية الأبعاد.',
      en: 'Specialized digital dentistry team delivering production-ready CAD files for milling and 3D printing.',
    },
    category: 'التصميم الرقمي',
    priceMode: 'quote',
    priceText: 'تسعير مخصص / Quote',
    turnaroundSummary: {
      ar: '٢٤ - ٤٨ ساعة',
      en: '24 - 48 Hours',
    },
    publicationStatus: 'published',
    featured: true,
  },
  {
    id: 'service_exoplan_guides',
    slug: 'exoplan-surgical-guides',
    title: {
      ar: 'تخطيط الزرعات وتصميم الأدلة الجراحية (Exoplan)',
      en: 'Guided Surgery Planning & Exoplan Guides',
    },
    summary: {
      ar: 'تخطيط جراحي رقمي متقدم للزرعات وتصميم أدلة جراحية دقيقة لتقليل مدة ومخاطر الجراحة.',
      en: 'Advanced 3D implant planning and surgical guide design for safe, minimally-invasive surgery.',
    },
    description: {
      ar: 'مطابقة ملفات الأشعة المقطعية CBCT مع المسح الضوئي الفموي وتصميم دليل جراحي دقيق مطبوع بالراتنج الطبي المعتمد.',
      en: 'CBCT DICOM optical alignment with intraoral scans, virtual fixture positioning, and biocompatible guide generation.',
    },
    category: 'زرعات موجهة',
    priceMode: 'quote',
    priceText: 'تسعير مخصص / Quote',
    turnaroundSummary: {
      ar: '٤٨ ساعة',
      en: '48 Hours',
    },
    publicationStatus: 'published',
    featured: true,
  },
  {
    id: 'service_3d_printing',
    slug: 'dental-3d-printing-service',
    title: {
      ar: 'طباعة النماذج ثلاثية الأبعاد ومعايرة الراتنجات',
      en: 'Dental 3D Printing & Model Production',
    },
    summary: {
      ar: 'طباعة نماذج العمل الجراحية وقوالب التقويم الشفاف بأحدث طابعات الراتنج الطبية بدقة تصل إلى 25 ميكرون.',
      en: 'High-precision surgical models, clear aligner arches, and castable resins with 25-micron accuracy.',
    },
    description: {
      ar: 'معايرة كاملة لراتنجات الطباعة وغسيل ومعالجة ضوئية متطورة تضمن الثبات الأبعادي العالي للأدلة والنماذج.',
      en: 'Calibrated dental photopolymer resins with post-wash and UV-cure processes for maximum dimensional stability.',
    },
    category: 'طباعة 3D',
    priceMode: 'starting_from',
    priceText: 'يبدأ من ٣٥,٠٠٠ د.ع',
    turnaroundSummary: {
      ar: 'نفس اليوم / ٢٤ ساعة',
      en: 'Same day / 24 Hours',
    },
    publicationStatus: 'published',
    featured: true,
  },
];

export async function GET() {
  try {
    const snapshot = await adminDb.collection('services').get();

    if (snapshot.empty) {
      // Auto seed defaults
      const nowIso = new Date().toISOString();
      for (const item of DEFAULT_SERVICES) {
        await adminDb.collection('services').doc(item.id).set({
          ...item,
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
      return NextResponse.json({
        success: true,
        services: DEFAULT_SERVICES.map((s) => ({
          id: s.id,
          slug: s.slug,
          titleAr: s.title.ar,
          titleEn: s.title.en,
          summaryAr: s.summary.ar,
          descriptionAr: s.description.ar,
          category: s.category,
          priceMode: s.priceText || (s.priceMode === 'quote' ? 'تسعير مخصص / Quote' : s.priceMode),
          turnaround: s.turnaroundSummary.ar,
          status: s.publicationStatus,
          featured: s.featured,
        })),
      });
    }

    const services = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        titleAr: data.title?.ar || data.titleAr || data.title || '',
        titleEn: data.title?.en || data.titleEn || '',
        summaryAr: data.summary?.ar || data.summary || '',
        descriptionAr: data.description?.ar || data.description || '',
        category: data.category || 'التصميم الرقمي',
        priceMode: data.priceText || (data.priceMode === 'quote' ? 'تسعير مخصص / Quote' : data.priceMode || 'تسعير مخصص / Quote'),
        rawPriceMode: data.priceMode || 'quote',
        turnaround: data.turnaroundSummary?.ar || data.turnaround || '٢٤ - ٤٨ ساعة',
        status: data.publicationStatus || 'published',
        featured: data.featured ?? true,
        imageUrl: data.imageUrl || data.image || '',
        image: data.imageUrl || data.image || '',
      };
    });

    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      titleAr,
      titleEn,
      category = 'التصميم الرقمي',
      summaryAr,
      descriptionAr,
      priceMode = 'quote',
      priceText = 'تسعير مخصص / Quote',
      turnaroundAr = '٢٤ - ٤٨ ساعة',
      status = 'published',
      featured = true,
      imageUrl = '',
      image = '',
    } = body;

    if (!titleAr) {
      return NextResponse.json({ error: 'اسم الخدمة بالعربية مطلوب' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const slug = (titleEn || titleAr)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const serviceId = `service_${slug || Date.now()}`;

    const serviceData = {
      id: serviceId,
      slug,
      title: {
        ar: titleAr,
        en: titleEn || titleAr,
      },
      summary: {
        ar: summaryAr || titleAr,
        en: titleEn || titleAr,
      },
      description: {
        ar: descriptionAr || summaryAr || titleAr,
        en: titleEn || titleAr,
      },
      category,
      priceMode,
      priceText: priceText || (priceMode === 'quote' ? 'تسعير مخصص / Quote' : priceMode),
      turnaroundSummary: {
        ar: turnaroundAr,
        en: turnaroundAr,
      },
      imageUrl: imageUrl || image || '',
      image: imageUrl || image || '',
      featured: Boolean(featured),
      publicationStatus: status,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await adminDb.collection('services').doc(serviceId).set(serviceData, { merge: true });

    // Log in auditLogs
    await adminDb.collection('auditLogs').add({
      action: 'service.create',
      serviceId,
      titleAr,
      timestamp: nowIso,
      admin: 'admin@dentacollab.org',
    });

    return NextResponse.json({ success: true, serviceId, service: serviceData });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      titleAr,
      titleEn,
      category,
      summaryAr,
      descriptionAr,
      priceMode,
      priceText,
      turnaroundAr,
      status,
      featured,
      imageUrl,
      image,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف الخدمة id مطلوب' }, { status: 400 });
    }

    const serviceRef = adminDb.collection('services').doc(id);
    const docSnap = await serviceRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    }

    const nowIso = new Date().toISOString();
    const currentData = docSnap.data() || {};

    const updatedData: Record<string, any> = {
      updatedAt: nowIso,
    };

    if (titleAr !== undefined || titleEn !== undefined) {
      updatedData.title = {
        ar: titleAr ?? currentData.title?.ar ?? '',
        en: titleEn ?? currentData.title?.en ?? '',
      };
    }

    if (summaryAr !== undefined) {
      updatedData.summary = {
        ar: summaryAr,
        en: currentData.summary?.en ?? summaryAr,
      };
    }

    if (descriptionAr !== undefined) {
      updatedData.description = {
        ar: descriptionAr,
        en: currentData.description?.en ?? descriptionAr,
      };
    }

    if (category !== undefined) updatedData.category = category;
    if (priceMode !== undefined) updatedData.priceMode = priceMode;
    if (priceText !== undefined) updatedData.priceText = priceText;
    if (turnaroundAr !== undefined) {
      updatedData.turnaroundSummary = {
        ar: turnaroundAr,
        en: currentData.turnaroundSummary?.en ?? turnaroundAr,
      };
    }
    if (status !== undefined) updatedData.publicationStatus = status;
    if (featured !== undefined) updatedData.featured = Boolean(featured);
    if (imageUrl !== undefined) {
      updatedData.imageUrl = imageUrl;
      updatedData.image = imageUrl;
    }
    if (image !== undefined && imageUrl === undefined) {
      updatedData.imageUrl = image;
      updatedData.image = image;
    }

    await serviceRef.set(updatedData, { merge: true });

    // Record audit log
    await adminDb.collection('auditLogs').add({
      action: 'service.update',
      serviceId: id,
      titleAr: titleAr || currentData.title?.ar || id,
      timestamp: nowIso,
      admin: 'admin@dentacollab.org',
    });

    return NextResponse.json({ success: true, message: 'تم تحديث الخدمة بنجاح' });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');

    let idsToDelete: string[] = [];

    if (idParam) {
      idsToDelete = [idParam];
    } else {
      const body = await req.json().catch(() => ({}));
      if (body.id) {
        idsToDelete = [body.id];
      } else if (Array.isArray(body.ids)) {
        idsToDelete = body.ids;
      }
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: 'لم يتم تحديد معرف الخدمة للحذف' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const batch = adminDb.getFirestore().batch();

    for (const serviceId of idsToDelete) {
      const ref = adminDb.collection('services').doc(serviceId);
      batch.delete(ref);

      const auditRef = adminDb.collection('auditLogs').doc();
      batch.set(auditRef, {
        action: 'service.delete',
        serviceId,
        timestamp: nowIso,
        admin: 'admin@dentacollab.org',
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      deletedCount: idsToDelete.length,
      message: `تم حذف ${idsToDelete.length} خدمة بنجاح`,
    });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete service' }, { status: 500 });
  }
}
