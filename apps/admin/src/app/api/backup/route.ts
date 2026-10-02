import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const COLLECTIONS_TO_BACKUP = [
  'courses',
  'courseCohorts',
  'workshops',
  'workshopSessions',
  'enrollments',
  'students',
  'users',
  'services',
  'serviceRequests',
  'supportTickets',
  'auditLogs',
  'appSettings',
  'gallery',
  'instructors',
  'graduates',
  'faqs',
  'staffMemberships',
  'attendance',
  'publicNotifications',
];

export async function GET(req: NextRequest) {
  try {
    const backupData: Record<string, any[]> = {};
    let totalDocs = 0;

    for (const colName of COLLECTIONS_TO_BACKUP) {
      try {
        const snap = await adminDb.collection(colName).get();
        backupData[colName] = snap.docs.map((doc) => ({
          _docId: doc.id,
          ...doc.data(),
        }));
        totalDocs += snap.docs.length;
      } catch (err) {
        console.warn(`Could not export collection ${colName}:`, err);
        backupData[colName] = [];
      }
    }

    const payload = {
      exportMetadata: {
        database: 'dentacollab',
        exportedAt: new Date().toISOString(),
        totalCollections: COLLECTIONS_TO_BACKUP.length,
        totalDocuments: totalDocs,
        version: '1.0.0',
        platform: 'DentaCollab Academy Unified Admin',
      },
      collections: backupData,
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `dentacollab-backup-${dateStr}.json`;

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Backup export failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Backup export failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.collections || typeof body.collections !== 'object') {
      return NextResponse.json(
        { success: false, error: 'تنسيق ملف النسخة الاحتياطية غير صالح (مفقود collections).' },
        { status: 400 }
      );
    }

    const collections = body.collections;
    let restoredCollectionsCount = 0;
    let restoredDocsCount = 0;

    const firestore = adminDb.getFirestore();

    for (const [colName, docs] of Object.entries(collections)) {
      if (!Array.isArray(docs) || docs.length === 0) continue;

      restoredCollectionsCount++;
      // Process in batches of 400 (Firestore limit is 500 operations per batch)
      const chunkSize = 400;
      for (let i = 0; i < docs.length; i += chunkSize) {
        const chunk = docs.slice(i, i + chunkSize);
        const batch = firestore.batch();

        for (const item of chunk) {
          const docId = item._docId || item.id || item.slug;
          const cleanItem = { ...item };
          delete cleanItem._docId;

          const ref = docId
            ? adminDb.collection(colName).doc(docId)
            : adminDb.collection(colName).doc();

          batch.set(ref, cleanItem, { merge: true });
          restoredDocsCount++;
        }

        await batch.commit();
      }
    }

    // Record audit log
    await adminDb.collection('auditLogs').add({
      action: 'DATABASE_RESTORE_COMPLETED',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      target: 'database:dentacollab',
      collection: 'all',
      details: `تمت استعادة النسخة الاحتياطية بنجاح (${restoredDocsCount} وثيقة ضمن ${restoredCollectionsCount} مجموعة)`,
      time: new Date().toLocaleDateString('ar-IQ', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'تمت استعادة البيانات بنجاح في قاعدة بيانات DentaCollab',
      restoredCollectionsCount,
      restoredDocsCount,
    });
  } catch (error: any) {
    console.error('Backup restore failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشلت عملية استعادة النسخة الاحتياطية' },
      { status: 500 }
    );
  }
}
