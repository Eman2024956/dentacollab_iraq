# Firebase Setup & Local Emulators Guide

## 1. Prerequisites
- Node.js 22+
- Firebase CLI (`npm install -g firebase-tools`)
- Java Runtime Environment (for local Firestore/Auth emulators)

## 2. Configuration
Copy `.env.example` in both `apps/admin` and root to configure project IDs:
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dentacollab-dev
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
```

## 3. Running Local Emulators
Start the Firebase Emulator Suite:
```bash
firebase emulators:start
```
- **Emulator UI:** `http://localhost:4000`
- **Auth Emulator:** `localhost:9099`
- **Firestore Emulator:** `localhost:8080`
- **Cloud Functions:** `localhost:5001`
- **Storage Emulator:** `localhost:9199`

## 4. Seeding Test Data
Run the guarded development seeder:
```bash
npx ts-node scripts/seed-synthetic-data.ts
```

## 5. Production Deployment
```bash
# Deploy security rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage

# Deploy Cloud Functions
firebase deploy --only functions
```
