# Manual Setup Required Before Live Production Release

The codebase is fully scaffolded, compiled, and tested locally. The following external credentials and manual console configurations must be provided before production release:

1. **Firebase Production Project:**
   - Create owned Firebase Project in Google Cloud Console.
   - Recommended region for Iraq latency: `europe-west3` (Frankfurt) or `me-central1` (Doha).
   - Generate `google-services.json` and place in `apps/mobile/android/app/`.
   - Generate `GoogleService-Info.plist` and add to Xcode project under `apps/mobile/ios/Runner/`.
2. **Apple Developer Configuration:**
   - Register App ID and Bundle Identifier (e.g. `org.dentacollab.mobile`).
   - Create APNs Auth Key (`.p8`) and upload to Firebase Console.
3. **Google Play Console:**
   - Create developer application and register package name.
4. **Super-Admin Bootstrap:**
   - Execute `npx ts-node scripts/bootstrap-admin.ts <your-email> <secure-password> "اسم المشرف"` to inject initial super-admin claims.
5. **AI Assistant Key (Optional):**
   - Provide `GEMINI_API_KEY` in Google Secret Manager or Firebase environment to enable live generative AI responses (fallback academy logic works out of the box).
