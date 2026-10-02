import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      titleAr,
      titleEn,
      bodyAr,
      bodyEn,
      topic = 'all_customers',
      targetToken,
      routeKey = 'home',
    } = body;

    if (!titleAr || !bodyAr) {
      return NextResponse.json(
        { error: 'Arabic title and body are required' },
        { status: 400 }
      );
    }

    const eventId = `evt_${Date.now()}`;
    const payloadTitle = titleAr;
    const payloadBody = bodyAr;

    const message: any = {
      notification: {
        title: payloadTitle,
        body: payloadBody,
      },
      data: {
        eventId,
        titleAr,
        titleEn: titleEn || titleAr,
        bodyAr,
        bodyEn: bodyEn || bodyAr,
        routeKey,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'all_customers',
          priority: 'max', // Triggers heads-up pop banner on Android
          defaultSound: true,
          defaultVibrateTimings: true,
          visibility: 'public',
          icon: 'ic_launcher',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            alert: {
              title: payloadTitle,
              body: payloadBody,
            },
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    let fcmResponse;
    if (targetToken) {
      message.token = targetToken;
      fcmResponse = await adminMessaging.send(message);
    } else {
      // Send to broadcast topic (e.g. all_customers)
      message.topic = topic;
      fcmResponse = await adminMessaging.send(message);
    }

    // Save durable notification to publicNotifications collection in Firestore
    await adminDb.collection('publicNotifications').doc(eventId).set({
      id: eventId,
      title: { ar: titleAr, en: titleEn || titleAr },
      body: { ar: bodyAr, en: bodyEn || bodyAr },
      topic,
      routeKey,
      sentAt: new Date().toISOString(),
      fcmMessageId: fcmResponse,
    });

    return NextResponse.json({
      success: true,
      messageId: fcmResponse,
      eventId,
      topic: targetToken ? undefined : topic,
    });
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}
