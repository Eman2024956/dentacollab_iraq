# DentaCollab System Architecture & Technical Specifications

## 1. System Overview

DentaCollab is an enterprise-grade digital dentistry training platform engineered with a strict **Arabic-first, responsive, cross-platform architecture**.

```text
                                 ┌─────────────────────────────────┐
                                 │       Next.js 15 Admin          │
                                 │   (TypeScript, Tailwind CSS)    │
                                 └───────────────┬─────────────────┘
                                                 │ HTTPS / Client SDK
                                                 ▼
┌─────────────────────────────────┐       ┌──────────────┴─────────────────┐
│     Flutter Student App         │       │        Firebase Backend        │
│   (iOS, Android, Tablet)        ├──────►│  - Cloud Functions (Node 22)   │
│   Material 3, Riverpod, GoRouter│       │  - Cloud Firestore (Rules)     │
└─────────────────────────────────┘       │  - Cloud Storage (Rules)       │
                                          │  - Cloud Messaging (FCM)       │
                                          └────────────────────────────────┘
```

---

## 2. Design System Tokens

| Token | Hex Value | Usage |
|---|---|---|
| Primary Navy | `#101C38` | Brand deep contrast, buttons, hero gradients |
| Brand Cyan | `#1FB6D1` | Accent, icons, active tab highlights, badges |
| Light Background | `#F7FAFC` | Daylight reading mode background |
| Dark Background | `#040B18` | OLED-friendly deep dark mode canvas |
| Dark Cards | `#081426` | Card surfaces, modals, bottom sheets |
| Light Borders | `#E2E8F0` | High contrast daylight dividers |
| Dark Borders | `#19314F` | Card outlines, dividers, input borders |

### Typography
- **Arabic Body & Headlines:** `IBM Plex Sans Arabic`
- **English & Numerals:** `Inter`

---

## 3. Transactional Seat Reservation & Waitlist Lifecycle

1. **Client Submission:** Student selects an open cohort and submits an enrollment payload with a client-generated UUID `idempotencyKey`.
2. **Server Transaction:**
   - Evaluates `idempotencyKey` against existing records (returns existing record on retry).
   - Validates that the cohort is `published` and `registrationOpen: true`.
   - Checks if student is already actively enrolled in this cohort.
   - If `reservedSeats < maxCapacity`:
     - Increments `reservedSeats` by 1.
     - Sets status to `confirmed`.
   - If `reservedSeats >= maxCapacity`:
     - Increments `waitlistCount` by 1.
     - Sets status to `waitlisted`.
3. **Pass Token Generation:** Generates opaque cryptographic token `dc_pass_<base64>` for physical attendance QR verification.
4. **Durable Inbox Event:** Writes event doc to `users/{uid}/notifications/{eventId}` and triggers asynchronous FCM push delivery.
5. **Cancellation & Auto-Promotion:**
   - When a confirmed enrollment is cancelled, `reservedSeats` decrements by 1.
   - If `waitlistCount > 0`, the earliest waitlisted enrollment (`orderBy('registeredAt', 'asc')`) is automatically promoted to `confirmed`.
