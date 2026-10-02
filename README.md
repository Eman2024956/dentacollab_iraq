# DentaCollab Iraq — Dental Academy & Clinical Collaboration Platform

[![Platform](https://img.shields.io/badge/Platform-Flutter%20%7C%20Next.js%2014%20%7C%20Firebase-007788.svg)](https://github.com/Eman2024956/dentacollab_iraq)
[![Language](https://img.shields.io/badge/Language-Dart%20%7C%20TypeScript%20%7C%20JavaScript-22c55e.svg)](https://github.com/Eman2024956/dentacollab_iraq)
[![License](https://img.shields.io/badge/Security-Protected%20Credentials-blue.svg)](https://github.com/Eman2024956/dentacollab_iraq)

DentaCollab Iraq is a comprehensive digital ecosystem designed for modern dental education, clinical case sharing, and academy management in Iraq. It integrates a native cross-platform mobile application for dentists and students, a Next.js administrative dashboard for course and content management, and a unified Firebase cloud infrastructure.

---

## 🏛 Architecture & Project Structure

The project is structured as a modular monorepo:

```
dentacollab/
├── apps/
│   ├── mobile/             # Flutter iOS & Android mobile application
│   │   ├── lib/
│   │   │   ├── core/       # Repositories (Firestore, Storage), Providers, Theme
│   │   │   ├── features/   # Home, Academy, Gallery, Cases, Auth, Profile
│   │   │   └── main.dart   # App entry point
│   │   ├── android/        # Native Android project configuration
│   │   ├── ios/            # Native iOS project configuration
│   │   └── pubspec.yaml    # Flutter dependencies & assets
│   │
│   └── admin/              # Next.js 14 Admin Control Panel
│       ├── src/
│       │   ├── app/        # App Router pages (Dashboard, Courses, Gallery, Banners)
│       │   ├── components/ # Reusable UI components & dialogs
│       │   └── lib/        # Firebase Admin & Client SDK configurations
│       ├── next.config.js  # Next.js config with Content Security Policy (CSP)
│       └── package.json
│
├── firebase/               # Firebase Rules & Configuration
│   ├── firestore.rules     # Secure Firestore access control rules
│   └── firestore.indexes.json # Compound query indexing definitions
│
├── packages/
│   └── contracts/          # Shared data contracts, types & schemas
│
├── src/                    # Public Showcase & Landing Web Portal (React + Vite)
├── .env.example            # Environment variables template
├── .gitignore              # Security-hardened git ignore rules
└── firebase.json           # Firebase CLI project configuration
```

---

## 🔒 Security & Credential Protection

This repository strictly enforces a **Zero-Leakage Security Policy**. Private credentials, API keys, service accounts, and platform secrets are excluded from Git version control via `.gitignore`.

### Sensitive files excluded from git:
- `.env`, `.env.local`, `.env.*.local` (Environment variables containing Firebase keys)
- `apps/admin/service-account.json` (Google Cloud Service Account private key)
- `apps/mobile/android/app/google-services.json` (Firebase Android credentials)
- `apps/mobile/ios/Runner/GoogleService-Info.plist` (Firebase iOS credentials)
- `services_input/` (Staging directory for cloud certificates)
- Keystores, signing keys (`*.jks`, `*.keystore`, `key.properties`, `local.properties`)

> **Note for Contributors:** Never commit any file containing private keys, service account credentials, or production tokens. Always use `.env.example` to set up your local development environment.

---

## 🚀 Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js**: v18.17.0+ or v20.x
- **Flutter SDK**: 3.22+ ([Flutter Installation Guide](https://docs.flutter.dev/get-started/install))
- **Dart SDK**: 3.4+ (bundled with Flutter)
- **Xcode** (for macOS / iOS development)
- **Android Studio / Android SDK** (for Android development)
- **Firebase CLI**:
  ```bash
  npm install -g firebase-tools
  ```

---

## ⚙️ Environment Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Eman2024956/dentacollab_iraq.git
   cd dentacollab
   ```

2. **Configure environment variables:**
   Copy `.env.example` to create `.env` at the root and inside `apps/admin`:
   ```bash
   cp .env.example .env
   cp .env.example apps/admin/.env.local
   ```
   Fill in your Firebase project keys:
   ```env
   FIREBASE_PROJECT_ID=dentacollab-iraq
   FIREBASE_STORAGE_BUCKET=dentacollab-iraq.appspot.com

   NEXT_PUBLIC_FIREBASE_PROJECT_ID=dentacollab-iraq
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dentacollab-iraq.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dentacollab-iraq.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Provide Firebase platform files:**
   - Place `service-account.json` in `apps/admin/`
   - Place `google-services.json` in `apps/mobile/android/app/`
   - Place `GoogleService-Info.plist` in `apps/mobile/ios/Runner/`

---

## 💻 Running Locally

### 1. Admin Control Panel (Next.js 14)
The Admin Dashboard allows managing courses, hero banners, gallery items, and clinical cases in real time.

```bash
cd apps/admin
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Mobile App (Flutter)
The native iOS and Android application with real-time Firestore sync and bilingual Arabic RTL/LTR design.

```bash
cd apps/mobile
flutter pub get
flutter run
```
To run on a specific device:
```bash
# List devices
flutter devices

# Run on iOS Simulator or connected Android device
flutter run -d <device-id>
```

### 3. Public Web Portal (Vite + React)
```bash
# From repository root
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔥 Firebase Backend & Deployment

### Firestore Security Rules
Security rules are located in `firebase/firestore.rules`. To deploy them:
```bash
firebase deploy --only firestore:rules
```

### Compound Query Indexes
Firestore indexes are defined in `firebase/firestore.indexes.json`. To deploy:
```bash
firebase deploy --only firestore:indexes
```

---

## ✨ Core Features & Highlights

- **Real-time Clinical Gallery & Cases**:
  - Direct live streams from Cloud Firestore collections (`gallery`, `clinical_cases`).
  - Image uploading to Firebase Storage with secure URL generation.
  - Multi-tag filtering (Orthodontics, Implantology, Endodontics, etc.).
- **Dynamic Hero Banner**:
  - Admin-controlled live banner display with title, subtitle, CTA link, and countdown timer.
  - Instantly synced across mobile and web platforms.
- **Academy Courses & Curricula**:
  - Comprehensive course catalog with syllabus accordions, instructor profiles, and registration workflow.
- **Bilingual & Responsive Design**:
  - Full Arabic (RTL) and English (LTR) language support.
  - Consistent design tokens, typography (`IBM Plex Sans Arabic`, `Inter`), and dark/light themes.
- **Enterprise Security**:
  - Custom Content Security Policy (CSP) with Google Fonts & Firebase endpoints whitelisted.
  - Role-based Firestore authorization rules protecting administrative records.

---

## 📦 Git & Contribution Guidelines

- **Main Remote:** `git@github.com:Eman2024956/dentacollab_iraq.git`
- Before committing, always check `git status` to ensure no sensitive files (`.env`, `*.json` credentials) are staged.

```bash
git status
git add .
git commit -m "feat: description of changes"
git push origin main
```

---

## 📄 License & Ownership

Copyright © 2026 DentaCollab Iraq. All rights reserved.
Medical content, clinical photography, and trademarks are proprietary to DentaCollab Iraq and contributing clinicians.
