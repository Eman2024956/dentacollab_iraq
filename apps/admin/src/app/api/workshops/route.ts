import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('workshops').get();
    const workshops = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        titleAr: data.title?.ar || data.titleAr || data.title || '',
        titleEn: data.title?.en || data.titleEn || '',
        descriptionAr: data.description?.ar || data.description || '',
        venue: data.venue || 'مختبر الأكاديمية — بغداد، المنصور',
        date: data.date || 'تشرين الأول ٢٠٢٦',
        time: data.time || '٩:٠٠ ص - ٤:٠٠ م',
        maxCapacity: data.maxCapacity || 15,
        reservedSeats: data.reservedSeats || 0,
        price: data.price ? `${data.price}` : '150,000 د.ع',
        status: data.publicationStatus || 'active',
        instructor: data.instructor || 'د. عمار صالح',
      };
    });

    return NextResponse.json({ success: true, workshops });
  } catch (error: any) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch workshops' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      titleAr,
      titleEn,
      descriptionAr,
      venue = 'مختبر الأكاديمية — بغداد، المنصور',
      date = 'تشرين الأول ٢٠٢٦',
      time = '٩:٠٠ ص - ٤:٠٠ م',
      maxCapacity = 15,
      priceMinorUnits = 150000,
      instructor = 'د. عمار صالح',
    } = body;

    if (!titleAr) {
      return NextResponse.json({ error: 'عنوان الورشة بالعربية مطلوب' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const slug = (titleEn || titleAr)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const workshopId = slug || `workshop_${Date.now()}`;

    const priceFormatted = `${Number(priceMinorUnits).toLocaleString()} د.ع`;

    const workshopData = {
      id: workshopId,
      slug: workshopId,
      title: {
        ar: titleAr,
        en: titleEn || titleAr,
      },
      description: {
        ar: descriptionAr || '',
        en: '',
      },
      venue,
      date,
      time,
      maxCapacity: Number(maxCapacity),
      reservedSeats: 0,
      price: priceFormatted,
      priceMinorUnits: Number(priceMinorUnits),
      instructor,
      instructorIds: ['dr-ammar-salieh'],
      publicationStatus: 'published',
      publishedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await adminDb.collection('workshops').doc(workshopId).set(workshopData, { merge: true });

    // Create session in workshopSessions
    const sessionId = `session-${workshopId}-1`;
    await adminDb.collection('workshopSessions').doc(sessionId).set({
      id: sessionId,
      workshopId,
      title: { ar: `جلسة ${titleAr}`, en: `Session — ${titleEn || titleAr}` },
      dateUtc: nowIso,
      venueName: { ar: venue, en: 'Academy Baghdad Lab' },
      maxCapacity: Number(maxCapacity),
      reservedSeats: 0,
      price: { amountMinorUnits: Number(priceMinorUnits), currency: 'IQD', exponent: 0 },
      createdAt: nowIso,
      updatedAt: nowIso,
    }, { merge: true });

    // Log in auditLogs
    await adminDb.collection('auditLogs').add({
      action: 'workshop.create',
      workshopId,
      titleAr,
      timestamp: nowIso,
      admin: 'admin@dentacollab.org',
    });

    return NextResponse.json({ success: true, workshopId, workshop: workshopData });
  } catch (error: any) {
    console.error('Error creating workshop:', error);
    return NextResponse.json({ error: error.message || 'Failed to create workshop' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, publicationStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف الورشة id مطلوب' }, { status: 400 });
    }

    const finalStatus = publicationStatus || status || 'published';
    const nowIso = new Date().toISOString();

    await adminDb.collection('workshops').doc(id).set(
      {
        publicationStatus: finalStatus,
        status: finalStatus,
        updatedAt: nowIso,
      },
      { merge: true }
    );

    // Also update associated workshopSessions
    try {
      const sessionsSnap = await adminDb.collection('workshopSessions').where('workshopId', '==', id).get();
      if (!sessionsSnap.empty) {
        const batch = adminDb.getFirestore().batch();
        sessionsSnap.forEach((doc) => {
          batch.set(doc.ref, { publicationStatus: finalStatus, status: finalStatus, updatedAt: nowIso }, { merge: true });
        });
        await batch.commit();
      }
    } catch (_) {}

    return NextResponse.json({ success: true, id, status: finalStatus });
  } catch (error: any) {
    console.error('Error updating workshop status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update workshop' }, { status: 500 });
  }
}
