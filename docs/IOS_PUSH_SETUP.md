# iOS Push Notifications Setup & APNs Configuration

## Requirements
- Apple Developer Account with Push Notification entitlement
- APNs `.p8` Auth Key from Apple Developer Portal
- Xcode 15+ / 16+

## Step-by-Step Instructions

1. **Bundle Identifier:** Ensure `apps/mobile/ios/Runner.xcodeproj` uses the registered Apple Bundle ID matching Firebase iOS App (e.g. `org.dentacollab.mobile`).
2. **Push Notifications Capability:**
   - In Xcode, select target `Runner` -> `Signing & Capabilities`.
   - Click `+ Capability` and add **Push Notifications**.
   - Add **Background Modes** and enable:
     - *Background fetch*
     - *Remote notifications*
3. **APNs Key Upload:**
   - In Firebase Console -> Project Settings -> Cloud Messaging.
   - Under Apple app configuration, upload your `.p8` key with Team ID and Key ID.
4. **Token Handling in Flutter:**
   - App calls `requestPermission` contextually when user opts into course reminders.
   - Calls `getAPNSToken` with bounded retries before calling `getToken` to prevent early null tokens.
5. **Foreground Presentation:**
   - Coordinated via local notifications so that iOS banners only display once per event.
