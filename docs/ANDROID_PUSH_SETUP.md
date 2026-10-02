# Android Push Notifications Setup & Notification Channels

## Requirements
- Android Gradle Plugin & Google Services Gradle Plugin
- `google-services.json` placed in `apps/mobile/android/app/`

## Notification Channels Configured

| Channel ID | Name (Arabic) | Importance | Purpose |
|---|---|---|---|
| `academy_updates` | تحديثات الأكاديمية | High | Announcements for newly published cohorts and workshops |
| `enrollment_updates` | حالة التسجيل والقبول | High | Seat confirmation, waitlist promotion, attendance passes |
| `session_reminders` | تذكيرات الجلسات العملية | Default | 24h & 2h before hands-on lab starts in Baghdad |
| `support_messages` | رسائل الدعم الفني | Default | Staff responses to inquiries |

## Android 13+ (API 33+) Runtime Permissions
- `POST_NOTIFICATIONS` is requested at point of action (e.g. after registering for a cohort or toggling alerts in Settings), never on cold start.
- If denied, user can still access durable in-app notifications inbox without disruption.
