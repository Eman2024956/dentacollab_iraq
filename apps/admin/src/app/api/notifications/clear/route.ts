import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const snapshot = await adminDb.collection('publicNotifications').get();
    
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No notifications to clear',
      });
    }

    const batch = adminDb.collection('publicNotifications').firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      count: snapshot.size,
      message: `Successfully deleted ${snapshot.size} notifications from Firestore`,
    });
  } catch (error: any) {
    console.error('Error clearing all notifications from Firestore:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear notifications' },
      { status: 500 }
    );
  }
}
