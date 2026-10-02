# DentaCollab Production Release Signing & Deployment Guide

This document details the configuration for **production release signing, keytool generation, and push notification services** for DentaCollab (`com.dentacollab.iraq`).

---

## 1. Firebase Project Information

- **Project ID:** `dentacollab-iraq`
- **Project Number:** `985599412865`
- **Storage Bucket:** `dentacollab-iraq.firebasestorage.app`
- **Package Name / Bundle ID:** `com.dentacollab.iraq`
- **Service Account:** `firebase-adminsdk-fbsvc@dentacollab-iraq.iam.gserviceaccount.com`

---

## 2. Android Production Keystore Generation (Keytool)

To generate the upload keystore for Google Play release:

```bash
cd apps/mobile/android/app

keytool -genkey -v \
  -keystore dentacollab-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias dentacollab-key
```

### Configure `key.properties`:
In `apps/mobile/android/`:
```properties
keyAlias=dentacollab-key
keyPassword=YOUR_KEY_PASSWORD
storeFile=app/dentacollab-release.jks
storePassword=YOUR_STORE_PASSWORD
```

### Build Production Android App Bundle (.aab):
```bash
cd apps/mobile
flutter build appbundle --release
```

---

## 3. iOS Production Signing (Xcode & App Store)

1. Open `apps/mobile/ios` in Xcode:
```bash
open apps/mobile/ios/Runner.xcworkspace
```
2. Select target **Runner** -> **Signing & Capabilities**.
3. Set Bundle Identifier to: `com.dentacollab.iraq`.
4. Ensure **Push Notifications** and **Background Modes (Remote notifications, Background fetch)** capabilities are active.
5. Upload the Apple `.p8` Auth Key in Firebase Console -> Project Settings -> Cloud Messaging.

### Build Production iOS Archive:
```bash
cd apps/mobile
flutter build ipa --release
```

---

## 4. Push Notification Service Architecture

Push notifications can be dispatched directly from the Next.js Web Admin dashboard to all mobile app users:

### Broadcast Topics:
- `/topics/all_customers`: All registered customer and student devices.
- `/topics/academy_updates`: Course cohort launches and schedule changes.

### Delivery Flow:
1. **Web Admin UI (`/notifications`)**: Admin fills out bilingual notification (Arabic / English).
2. **Server Route (`/api/notifications/send`)**: Uses the Firebase Admin SDK and private key (`dentacollab-iraq-firebase-adminsdk-fbsvc-e9d37c7b74.json`).
3. **FCM Dispatch**: Sends to topic `/topics/all_customers` with Android priority `high` and channel `all_customers`.
4. **Mobile Client**:
   - Background handler receives FCM alert.
   - Foreground handler immediately posts to the in-app durable notifications list (`AcademyRepository.notifications`).
   - Saved in Firestore `publicNotifications` collection.
