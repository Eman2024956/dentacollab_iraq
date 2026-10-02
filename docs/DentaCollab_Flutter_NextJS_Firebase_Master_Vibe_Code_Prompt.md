# DentaCollab — Flutter + Next.js Admin + Firebase
## Complete expert implementation prompt

**Prepared for:** Falah.G.Salieh — Baghdad, Iraq  
**Reference:** DentaCollab public website and `DentaCollab_All_Pages_Frontend_Source.zip`  
**Prompt language:** English, with Arabic-first product requirements  
**Purpose:** Build the software; do not merely describe it.

### طريقة الاستخدام

افتح مجلد مشروع جديد في وكيل البرمجة الذي تستخدمه، وأرفق ملف التصميم السابق `DentaCollab_All_Pages_Frontend_Source.zip` إن توفر. انسخ النص بين **BEGIN MASTER PROMPT** و **END MASTER PROMPT**. المطلوب تطبيق Flutter للطلاب على iOS وAndroid ولوحة إدارة ويب Next.js مرتبطة بنفس مشروع Firebase لكل بيئة.

المقصود بالخدمات هنا: وحدات الأكاديمية والدورات والورش، ودليل خدمات قابل للإدارة، مع نماذج البيانات وواجهات Modal / Bottom Sheet. خدمات المختبر أو التصميم الرقمي هي إضافة مقترحة قابلة للتعطيل، وليست ميزة مؤكدة في الموقع الأصلي. البيانات التجريبية السابقة ليست دورات أو تقييمات حقيقية.

---

# BEGIN MASTER PROMPT

You are a senior Flutter engineer, Next.js architect, Firebase backend engineer, mobile UX designer and release engineer. Implement a complete, maintainable DentaCollab digital dentistry academy system.

Create real working source code, configuration, Firebase Rules, indexes, backend functions, documentation and tests. Do not stop at a plan, UI mockup, generated screenshots or a list of recommendations. Work incrementally and verify each integrated feature. Never describe unexecuted tests or unconfigured services as successful.

## 1. Deliverables and scope

Build:

1. A native Flutter student/customer app for iOS and Android, with responsive iPad/tablet layouts.
2. A Next.js App Router web admin dashboard using TypeScript.
3. A Firebase backend shared by those two applications within each environment.
4. Course and workshop discovery, registration, enrollment tracking, notifications and support.
5. A configurable services catalog and service-inquiry flow, disabled until the academy provides real services.
6. Content management for all public academy content and the existing site's route concepts.
7. FCM push notifications on iOS and Android, plus an in-app notification inbox.
8. Secure administrator permissions, native OS permissions, and student privacy settings.
9. Deployment and manual-setup documentation, with an explicit readiness report.

The existing public website is a design/content reference. Preserve it if its source is supplied. Do not overwrite its Vite project with an admin application. Building a new public Next.js website is outside this delivery unless explicitly requested; the new Next.js app is the admin dashboard.

This is a single academy application. Avoid unnecessary multi-tenant architecture, marketplaces, taxi features or clinical patient-record functionality.

### Design fidelity

Use `DentaCollab_All_Pages_Frontend_Source.zip`, when available, for the visual direction and public route mapping. Inspect its README, route inventory, source and assets before implementation. It is a reconstruction with sample data, not the original private codebase. Do not treat its sample instructor biographies, course dates, reviews, prices or payment states as verified facts.

If that archive is unavailable, continue using the specifications below and list missing reference assets. Do not claim pixel-perfect fidelity without comparison.

## 2. Technology choices

### Flutter

- Current mutually compatible stable Flutter and Dart versions, recorded in the README; pin dependencies and commit the lockfile.
- Material 3 with a custom DentaCollab theme.
- Riverpod for state/dependency management and GoRouter for navigation.
- Feature-first architecture with presentation, domain and data boundaries.
- Freezed / json_serializable for immutable models and serialization if compatible with the selected SDK.
- Firebase Core, Auth, Cloud Firestore, Storage, Cloud Functions, Messaging, App Check and Crashlytics.
- Local notifications for the chosen foreground-display strategy.
- Cached image loading, internationalization/ARB, URL launching and secure token handling where needed.
- Native system photo/document pickers. Add permission libraries only where the selected features actually require them.

### Admin web

- Next.js App Router, TypeScript, Tailwind CSS and accessible shadcn/ui primitives.
- React Hook Form and Zod for validated forms.
- Accessible data tables with server-side pagination/filtering for large collections.
- Firebase web SDK for authenticated client operations allowed by Rules.
- Server-only Firebase Admin SDK only for verified, authorized server operations that need it.
- No service account or AI/payment secret in NEXT_PUBLIC_* or browser bundles.
- Admin web push is optional and capability-detected; mobile push is required.

### Backend

- Firebase Authentication.
- Firestore document database.
- Cloud Storage for images and private attachments.
- Cloud Functions using TypeScript and the currently supported generation/runtime.
- Firebase Admin SDK for privileged writes and notification delivery.
- Cloud Tasks or a durable job queue for scheduled notifications and retryable work.
- App Check, Secret Manager and structured logging.
- Emulator Suite for local integration and rules tests.

Resolve compatible package versions from official documentation during implementation. Do not invent versions, unsupported deployment regions or CLI flags.

## 3. Repository structure

Use this structure, adjusting filenames to the selected framework versions:

```text
dentacollab-platform/
  apps/
    mobile/
      lib/
        app/
        core/{theme,localization,routing,errors,config,widgets}/
        features/
          auth/
          home/
          courses/
          workshops/
          enrollment/
          services/
          instructors/
          gallery/
          graduates/
          certificates/
          notifications/
          support/
          assistant/
          profile/
          settings/
      android/
      ios/
      test/
      integration_test/
    admin/
      src/app/
      src/components/
      src/features/
      src/lib/{firebase,auth,permissions,validation}/
  firebase/
    functions/src/
      auth/
      enrollment/
      notifications/
      media/
      payments/
      certificates/
      support/
      jobs/
    firestore.rules
    firestore.indexes.json
    storage.rules
  packages/contracts/
  scripts/
  docs/
  firebase.json
  .firebaserc.example
  .env.example
  README.md
```

Define a documented cross-platform data contract. TypeScript and Dart models must agree on required fields, timestamps, enums, nullability and currency units. Do not force Dart to import TypeScript.

## 4. Visual system and localization

Brand palette:

- Navy: `#101C38`.
- Cyan: `#1FB6D1`.
- Light background: `#F7FAFC`.
- Dark background: `#040B18`.
- Dark cards: `#081426`.
- Light borders: `#E2E8F0`.
- Dark borders: `#19314F`.

Arabic-first with complete English support. Use IBM Plex Sans Arabic and Inter, or properly licensed bundled equivalents. Bundle app fonts to avoid depending on runtime font downloads. Use semantic RTL/LTR positioning, not manual reversal of every widget.

Create consistent spacing, typography, 16–24 px corner radii, rounded CTAs, restrained shadows, responsive images and accessible contrast. Respect large text sizes and reduced-motion settings. Support system/light/dark preferences and persist them locally. Persist language preference locally and optionally in the authenticated profile.

Adapt the desktop website into native mobile UX. Do not use a full-site WebView as the application.

All content pages require loading, empty, success, error, retry and offline-aware states. Forms must preserve input after recoverable errors. Avoid overflow with long Arabic names and titles. Use semantic labels and appropriate touch targets.

## 5. Student mobile navigation

Five bottom-navigation destinations:

1. Home — الرئيسية.
2. Courses — الدورات.
3. My Learning — تعلّمي: enrollments, upcoming sessions and certificates.
4. Notifications — الإشعارات: durable in-app inbox.
5. Account — حسابي.

Show a notification bell with a reliable unread count. Guest users may browse; protected destinations explain their purpose and offer sign-in while retaining the intended route.

App-bar menu / account menu:

- Workshops — الورش.
- Academy services — خدمات الأكاديمية, only when enabled.
- Instructors — المدربون.
- Gallery — المعرض.
- Graduates — الخريجون.
- Student benefits — مزايا الطالب.
- About the academy — عن الأكاديمية.
- FAQ — الأسئلة الشائعة.
- Contact and academy location — تواصل وموقع الأكاديمية.
- Language, appearance, notification preferences.
- Privacy policy, terms, app version and account deletion.

Do not duplicate every item into both the bottom bar and the app-bar menu.

## 6. Authentication, profile and account lifecycle

Public browsing must not require registration. Require authentication for enrollment, service inquiries that need tracking, private messages, certificates and saved personal data.

Implement email/password registration, sign-in, email verification, password reset, logout and account deletion. Profile: full name, email, optional phone, city, profession, experience and optional avatar. Use only necessary fields, with Arabic-friendly validation and normalized phone handling.

Optional phone authentication must be behind configuration, with verified regional/provider support and a documented SMS cost/abuse plan. Do not pretend Firebase Phone Auth and a third-party OTP service are interchangeable.

Start with email/password. If social sign-in is added later, verify the applicable platform login requirements before shipping it.

Account deletion requires recent authentication and a server-coordinated cleanup job. Remove or anonymize data according to a documented retention policy, unlink device tokens, and delete private uploaded files. Retain legally required financial records only under a documented policy. Do not claim all data disappears instantly when an asynchronous cleanup is still pending.

Clear user-specific local caches, streams, notifications and pending navigation on logout or account changes. Prevent one student from seeing the prior student's cached inbox or enrollment on a shared device.

## 7. Home and public content modules

Home:

- Academy brand and hero, with “صمّم. خطّط. نفّذ.”.
- Featured courses, workshops and optional services.
- Digital workflow: design, STL export, printing, final result.
- Exocad, Exoplan and 3D printing specialty cards.
- Instructor highlights, benefits and verified academy metrics.
- Registration CTA, FAQ previews and contact shortcuts.
- Optional dental-model viewer.

Do not invent statistics or real reviews. Use visibly marked seed content in development only. Production empty collections should show useful empty states.

3D viewer: support a configured licensed asset or an explicitly approved external embed, lazy-load it and provide a thumbnail fallback. Support orbit/zoom/reset and low-memory handling. A CSS/toy demonstration model must be labelled as illustrative and must not be presented as a clinically accurate guide. Preserve model attribution. Do not allow arbitrary admin-entered JavaScript or unrestricted embedded HTML.

About, benefits, instructors, instructor profiles, gallery, graduates, FAQ and contact should reuse the reference structure. Approved graduate testimonials require consent and moderation. Gallery content must not disclose patient identities.

## 8. Courses and workshops

Course listing:

- Published courses only.
- Search, level, category, delivery mode and availability filters.
- Cursor pagination and sensible loading placeholders.
- Saved courses for authenticated students.
- Cards showing localized title, image, level, duration and an accurate price/availability label.

Course detail:

- Hero, description, learning objectives and prerequisites.
- Curriculum modules and expandable lessons.
- Associated instructors.
- Equipment/software provided, with verified content.
- Delivery mode, venue, upcoming cohorts, dates and remaining-seat state.
- FAQ, registration, share/deep link, contact support.
- Registration terms and cancellation policy.

Separate a reusable **course definition** from scheduled **course cohorts**. A user enrolls in a cohort, not an ambiguous course without dates/capacity.

Workshops have their own sessions, presenter, venue, dates, capacity and registration. Reuse the same scheduling/enrollment domain where practical rather than duplicating inconsistent business logic.

Store timestamps in UTC. Display local academy scheduling in `Asia/Baghdad`, clearly indicating the timezone when relevant. Do not hardcode a universal numeric UTC offset in scheduling logic.

Delivery modes: `in_person`, `live_online`, `recorded`. Implement in-person academy training as the baseline. Recorded lessons and paid digital access are optional additions requiring the relevant store billing implementation.

## 9. Enrollment, attendance and certificates

Enrollment flow:

1. Choose a course cohort or workshop session.
2. Sign in if necessary; return to the selected item.
3. Review requirements, availability and terms.
4. Submit validated registration with an idempotency key.
5. Server validates publication, eligibility, duplicate enrollment and capacity.
6. Server transaction creates enrollment and reserves a seat or creates a waitlist entry.
7. Show the actual enrollment state, independent of payment state.
8. Write an inbox notification and queue any permitted push delivery.

Enrollment states: `requested`, `awaiting_payment`, `confirmed`, `waitlisted`, `cancelled`, `completed`.
Payment states: `not_required`, `pending`, `paid`, `failed`, `refunded`.
Attendance states are separate from both enrollment and payment.

Document allowed transitions and who may perform them. Never decrement capacity twice for a retry. For paid reservations, implement server-owned hold expiry and release seats idempotently. Handle concurrent requests and waitlist promotion transactionally. Reject new registrations while offline rather than presenting an unconfirmed cached write as a reserved seat.

My Learning shows enrollment status, schedule, venue, support action and certificates. QR entry passes use a server-verifiable opaque or signed reference. A QR alone must not grant staff privileges or expose PII. Staff check-in requires authenticated authorization and a server-side attendance operation that rejects duplicate check-ins.

Certificates: issue only after an authorized completion decision, generate a PDF, and expose private student downloads. Use a revocable verification ID or QR with minimum public information. Do not claim accreditation without academy-provided evidence.

## 10. Services module and service models

Create an optional academy service catalog, separate from courses and medical patient care. Examples may include digital design consultation, training consultation or 3D-printing enquiries, but mark them as sample categories until approved.

Service fields: ID, slug, localized title/summary/description, category, cover image, public gallery, delivery type, price mode (`fixed`, `starting_from`, `quote`), optional price/currency, turnaround description, requirements, featured flag, publication status and display order.

Service detail uses a native full page plus a “Request service” bottom sheet. Requests support student information, service ID, description, preferred contact method and status tracking.

Request states: `submitted`, `under_review`, `quoted`, `accepted`, `in_progress`, `completed`, `cancelled`. All privileged transitions happen server-side. Quote price is owned by the server/admin, never by the client request.

Do not enable patient scans, identifiable clinical records or large CAD-file uploads by default. If such uploads are later requested, implement a separately reviewed privacy, access, retention, file-validation and processing design. Start with text enquiries and restricted non-sensitive attachments only.

## 11. Required bottom sheets, modals and dialogs

Implement reusable native components:

| Interface | Flutter behavior | Admin equivalent |
|---|---|---|
| Course filters | Modal bottom sheet; Apply/Reset | Filter popover or panel |
| Cohort/session selector | Draggable sheet with schedule and availability | Session selection dialog |
| Enrollment form | Keyboard-safe full-height sheet or dedicated page for long forms | Enrollment detail side panel |
| Service request | Validated sheet; upload state if enabled | Request/quote side panel |
| Notification preferences | Sheet or settings page | Campaign preferences/configuration |
| Language/appearance | Accessible selection sheet | Settings controls |
| Gallery item | Fullscreen viewer | Media preview dialog |
| Notification detail | Sheet or route linked to related entity | Delivery/audience detail panel |
| Destructive action | Explicit confirmation dialog | Alert dialog with reason where required |

Use safe areas, scroll control and keyboard insets. Keep draft form state when resizing a sheet. Make dismiss behavior clear while a submission is pending. Announce validation errors and return focus on dismiss. Do not cram long curriculum/payment flows into small fixed-height modals.

## 12. Next.js admin dashboard

Responsive Arabic/English admin with dark mode, desktop sidebar and mobile drawer. Support iPad-sized layouts. Use meaningful tables, search, filters, pagination, accessible actions, skeletons and empty states.

Required routes:

```text
/login
/dashboard
/courses
/courses/new
/courses/[id]/edit
/courses/[id]/cohorts
/workshops
/workshops/[id]/edit
/instructors
/instructors/[id]/edit
/enrollments
/enrollments/[id]
/students
/students/[id]
/attendance
/certificates
/services
/services/[id]/edit
/service-requests
/service-requests/[id]
/gallery
/graduates
/faq
/content/home
/content/about
/notifications
/notifications/new
/notifications/[id]
/support
/support/[id]
/payments
/reports
/team
/audit-logs
/settings/general
/settings/branding
/settings/permissions
/settings/integrations
```

Functions:

- Dashboard shows real aggregate enrollment, upcoming sessions, pending requests and notification job counts, not fabricated charts.
- CRUD, archive and publish workflows for courses, workshops, instructors, content and services.
- Arabic and English editor tabs, draft preview, image upload/progress and validation.
- Curriculum editor with stable IDs and ordering.
- Cohort/session capacity and schedule management.
- Enrollment review, cancellation, waitlist, authorized payment review and attendance.
- Student access with minimum necessary data and role restrictions.
- Moderated graduates/reviews and FAQ categories.
- Notification composer with audience estimate, bilingual preview, test send and scheduling.
- Support ticket assignment and threaded responses.
- Optional payment integration configuration without exposing secret values.
- Reports with bounded/date-filtered CSV export and role checks.
- Immutable server-written audit logs for sensitive operations.

Archive referenced records rather than silently deleting them and breaking enrollment history. Use optimistic concurrency/version checks to avoid administrators overwriting each other's edits.

## 13. Roles and authorization

Roles:

- `super_admin`: all management, privileged roles and integrations.
- `academy_manager`: courses, cohorts, students, enrollment and operations; cannot grant super-admin.
- `content_editor`: public content and media; no payment/student financial access.
- `instructor`: assigned cohorts, authorized roster fields and attendance only.
- `support_agent`: assigned support cases and minimal related enrollment context.
- `student`: own profile, requests, enrollments, inbox and entitled content.

Supply a permission matrix at action and data level. The student Flutter app must not automatically become a staff console just because the current account has a staff role.

Use server-assigned Auth custom claims for coarse-grained roles. Set them only from trusted backend code. Keep a server-controlled membership/status record where immediate suspension/revocation checks are required. Do not rely only on a cached claim for urgent permission changes. Document claim refresh and session revocation behavior.

Admin UI hiding is not authorization. Verify every privileged backend action. Firebase Admin SDK bypasses client Rules; server code must independently check the caller, role, scope and document ownership.

For web server rendering, use secure server-verified sessions; if cookie authentication is used, protect state-changing endpoints against CSRF, set HttpOnly/Secure/SameSite appropriately and verify Origin. For client Firebase calls, use the current Firebase Auth identity with Rules. Do not confuse the two authentication contexts.

Provide a one-time privileged super-admin bootstrap script with environment selection and auditing. Never grant admin rights based on an unverified email field. Document optional MFA setup for privileged accounts, including provider prerequisites.

## 14. Firestore models and collection design

Implement typed Dart and TypeScript models for at least:

`UserProfile`, `StaffMembership`, `Course`, `CourseModule`, `CourseCohort`, `Workshop`, `WorkshopSession`, `Instructor`, `Enrollment`, `AttendanceRecord`, `AcademyService`, `ServiceRequest`, `Certificate`, `GalleryAlbum`, `GalleryMedia`, `GraduateReview`, `FaqItem`, `NotificationPreference`, `DeviceRegistration`, `InboxNotification`, `NotificationCampaign`, `NotificationJob`, `SupportTicket`, `SupportMessage`, `PaymentRecord`, `AuditEvent`, `AppSettings`.

Suggested collections:

```text
users/{uid}
users/{uid}/savedCourses/{courseId}
users/{uid}/notificationPreferences/main
users/{uid}/notifications/{eventId}
staffMemberships/{uid}
courses/{courseId}
courses/{courseId}/modules/{moduleId}
courseCohorts/{cohortId}
workshops/{workshopId}
workshopSessions/{sessionId}
instructors/{instructorId}
enrollments/{enrollmentId}
attendance/{attendanceId}
services/{serviceId}
serviceRequests/{requestId}
certificates/{certificateId}
certificateVerification/{publicVerificationId}
galleryAlbums/{albumId}
galleryMedia/{mediaId}
graduateReviews/{reviewId}
faqs/{faqId}
publicContent/{pageId}
appSettings/public
privateSettings/{documentId}
deviceRegistrations/{installationId}
notificationCampaigns/{campaignId}
notificationJobs/{jobId}
notificationOutbox/{eventId}
supportTickets/{ticketId}
supportTickets/{ticketId}/messages/{messageId}
payments/{paymentId}
auditLogs/{eventId}
```

Model requirements:

- Bilingual fields `{ ar: string, en: string }` for public content.
- `createdAt`, `updatedAt`, server-owned creator/editor IDs and `schemaVersion` where useful.
- `publicationStatus`, `publishedAt`, stable slug, sort order and media paths for public content.
- Explicit `uid` ownership on private records and owner-filtered queries.
- Separate public contact/display content from private instructor data and student records. Firestore reads expose whole documents; Rules do not redact individual fields.
- Never place private fields inside publicly readable documents.
- Store enrollment status and payment state separately.
- Monetary amounts as integers in the currency's defined minor unit, with explicit currency/exponent; no floating-point arithmetic or assumption that every currency has two decimals. Confirm provider handling of IQD.
- Store original asset path, processed variants, MIME type, size and dimensions.
- Avoid unbounded arrays for members, tokens, messages or rosters.
- Keep AI transcripts and student attachments out of public content.
- Use server timestamps for trusted events.

Create all required composite indexes from actual queries. Explain publication constraints, cursor pagination and date ordering. Do not assume Security Rules filter unauthorized results out of a query.

## 15. Firebase Rules and storage access

Default-deny Firestore and Storage Rules. No temporary allow-all production rules.

Public read: published, deliberately public content only. Students read/update only specifically allowed own-profile fields and their own private records. Prevent role, payment, capacity, certificate, ownership or status escalation through client writes.

Send enrollment transitions, staff actions, payment decisions, notification sending and certificate issuance through authorized functions. Students may mark their own inbox records read using an allowed-field update rule; they may not alter titles, destinations, types or ownership.

FCM tokens are server-only records. Register/update them through an authenticated, App-Check-protected endpoint that associates the installation with the current user. Do not expose tokens in admin tables or public documents.

Separate storage paths for published media, drafts, avatars and private attachments. Enforce owner/admin scope, declared MIME and size bounds; perform server-side content validation because declared MIME alone is not trustworthy. Use generated names and safe image derivatives. Strip unnecessary metadata from published media.

Do not publish long-lived bearer download URLs for private receipts, attachments or certificate files. Use authorized downloads or appropriately scoped short-lived URLs. App Check complements Auth/Rules; it does not replace access control.

## 16. Push notifications — complete design

Use FCM from trusted backend code, never a server key embedded in Flutter/admin frontend.

Notification events:

- Enrollment received, confirmed, waitlisted, cancelled.
- Session reminders, schedule changes and cancellations.
- Certificate ready.
- Service request status change.
- Support reply.
- Newly published course/workshop announcements, with marketing preference controls.

Write the durable inbox event first, with a deterministic event ID and a queued delivery job. Send asynchronously; a failed push must not undo a successful enrollment. Handle trigger/task retries idempotently. Network sends cannot provide a universal exactly-once display guarantee: use deterministic event IDs, platform collapse behavior where appropriate and application-side deduplication to reduce duplicates.

Device registration fields: installation ID, owning UID, FCM token, platform, app/environment, language, app version, permission status, last-seen timestamp and active state. Support multiple devices per account. Refresh tokens, disable invalid tokens and clean up stale registrations. On account switching/logout, unlink the installation and cancel old user subscriptions; handle token rotation as needed. Do not expose private content through a push that may arrive after logout.

Separate marketing preferences from transactional categories and the OS-level notification permission. An opted-out user can still inspect their in-app inbox. Do not use FCM topics as an authorization boundary for private enrollment or staff notifications. Resolve private recipients server-side.

Payload:

```json
{
  "schemaVersion": "1",
  "eventId": "evt_example",
  "type": "enrollment_confirmed",
  "entityType": "enrollment",
  "entityId": "enr_example",
  "routeKey": "enrollment_detail"
}
```

FCM data values are strings. Use a small typed allowlist of destinations. Do not execute arbitrary links/code from payloads. Use generic lock-screen text for sensitive events; fetch the private record after authentication. On tap, initialize Firebase/Auth/router, validate the current user and entity access, then navigate or show an unavailable state.

Implement foreground, background and terminated-state handling, including `onMessage`, `onMessageOpenedApp` and `getInitialMessage`. Use a top-level background handler with the required entry-point annotation; it must not perform navigation. Queue any tap until app initialization completes. Choose a single foreground alert strategy per platform to prevent both a local and native banner for the same event.

Scheduled reminders must be timezone-aware and reschedule/cancel when sessions change. Each job includes a source revision/expected schedule and rechecks enrollment/session status before send. Do not keep an HTTP request or serverless function sleeping until reminder time.

Admin composer: select audience, category and localized copy; validate destination; preview; send a test to a selected authorized device; show estimated recipient count; schedule or send; store initiator and audit event. Paginate/batch delivery with retry/backoff. Distinguish queued, provider-accepted, failed and app-opened states; provider acceptance is not proof of device display or human reading.

## 17. iOS notification setup

Provide code and a manual setup guide covering:

- Correct Apple bundle ID and matching Firebase iOS app.
- `GoogleService-Info.plist` target membership and environment configuration.
- Xcode Push Notifications capability and documented FCM background modes.
- APNs `.p8` upload to Firebase with Key ID and Team ID; keep the key out of the repository.
- Correct signing/entitlements for development and distribution.
- Preserve FlutterFire's required method swizzling.
- Request alert, badge and sound permission contextually; handle denied/provisional states and Settings re-entry.
- Wait for APNs token availability before token-dependent FCM operations, with bounded retry.
- Document the chosen foreground presentation method and duplicate prevention.
- Send a real-device end-to-end test; do not use simulator-only results as APNs release evidence.

Do not invent an Info.plist notification usage-description key. Avoid Critical Alerts or Time Sensitive privileges unless a real requirement and relevant entitlement justify them. Badge behavior must be reconciled with server/in-app unread state; do not blindly increment a badge for every duplicate push.

## 18. Android notification setup

- Correct application ID and environment-specific `google-services.json`.
- Google Services/Gradle integration compatible with the chosen Flutter version.
- Android 13+ runtime notification permission with contextual explanation and denial handling.
- Android 8+ channels, for example `academy_updates`, `enrollment_updates`, `session_reminders`, `support_messages`; respect user channel settings.
- Proper monochrome small icon and default FCM channel metadata.
- Foreground local alert behavior coordinated with background system alerts.
- Handle token refresh, notification taps and app cold start.
- State that Play-services-based FCM delivery needs a supported device environment.
- No promise that force-stopped apps or OS-restricted background execution always receive immediate delivery.

Avoid exact-alarm and battery-optimization exemptions for ordinary server-sent course reminders. Do not request background location or foreground-service permissions merely to keep notifications active.

## 19. Native permission matrix

Implement a documented permission service that checks capability, requests at the point of use, handles denial gracefully and opens system settings when appropriate.

| Capability | When needed | Required behavior |
|---|---|---|
| Notifications | User enables course updates/reminders | iOS permission and Android 13+ runtime handling |
| Camera | Optional avatar capture or authorized staff QR scan | Request only when capture/scan is invoked; web scan requires HTTPS/browser permission |
| Photos | Optional avatar/gallery selection | Prefer system picker; avoid blanket photo-library access |
| File selection | Allowed support attachment | Use scoped document picker; no all-files access |
| Location | Not required for baseline academy map | Open the supplied map link without requesting GPS |
| Microphone | Not needed for baseline text assistant | Do not declare/request it |
| Calendar | Optional add-session action | Prefer event intent/ICS flow; request broader access only for an implemented need |
| Tracking | No cross-app advertising in baseline | Do not add ATT permission prompts without tracking functionality |
| Bluetooth/contacts/background location | Not used | Do not declare/request |

Permission denial must not block public browsing. Do not request every permission during startup. Native usage descriptions must accurately describe the implemented feature and be localized where supported. Distinguish an app preference toggle from an OS grant that the app cannot silently change.

## 20. AI assistant and support

Build an academy assistant with a server-side provider adapter for Gemini or OpenAI. Keep keys in Secret Manager. It answers from published academy courses, FAQs, schedules and policies. It must not invent prices, seats, certificates or claim registrations were made when no authorized enrollment call succeeded.

Use bounded context, timeouts, rate limits, usage budgets, localized answers and visible retry/fallback states. Exclude other users' private data and unpublished admin content. Treat retrieved content as data, not instructions to change permissions. Start with read-only answers and links; registration occurs in the explicit enrollment flow.

If no AI provider is configured, show an honest FAQ/search/support fallback. Never label hardcoded replies as a live AI integration. Do not offer diagnosis or treatment decisions; this is an academy information assistant.

Support tickets: student-owned threads, role-limited staff access, timestamps, attachments under explicit limits and notification events. Provide offline/retry UX without duplicate ticket creation.

## 21. Payments and store-sensitive flows

Model in-person services separately from digital content consumed in the app. Verify current Apple/Google rules for the distribution markets before implementing purchases. Do not present manual approval or external payment as a workaround for paid digital content rules.

Default baseline: free registration requests or approved real-world academy bookings, with payment integration disabled until a provider/account is selected. Allow a provider interface for a supported Iraqi payment service, only after its merchant credentials and official API documentation are supplied. Do not assume a developer in Iraq has access to Stripe onboarding.

If manual payment review is enabled for eligible real-world services, label a receipt `pending_review`; only authorized server actions may approve it. A receipt image is not proof of verified payment. Keep receipt images private.

For gateway integration, create checkout server-side, verify signed webhooks, deduplicate events and update enrollment/payment transactionally. Never mark an order paid based on a return URL, client boolean or uploaded screenshot alone. Refunding and cancellation must preserve an audit trail.

For paid recorded courses/digital unlocks, implement the applicable store billing, verification, entitlement and restore flow before enabling sales. No fake successful checkout when credentials are absent.

## 22. Environments, regions, caching and costs

Use independent Firebase projects for development/staging/production. Configure Flutter flavors and separate app IDs, admin environment values and push registrations. Never use production student data as casual test fixtures.

Choose actual supported database, Functions and Storage locations based on service availability and latency to Iraq. Do not invent a region identifier or assume a single choice is available for every Firebase product. Document the selection before database provisioning; database location is not an ordinary editable setting.

Use bounded Firestore queries, cursor pagination and real-time listeners only on active screens. Dispose listeners correctly. Cache public images and content with explicit freshness behavior; do not indefinitely cache private staff data. Search public catalogs through a defined search strategy; Firestore does not supply arbitrary full-text search. Start with limited title-prefix/category queries or document a separate search service only if needed.

Create resized image variants and avoid downloading originals into small cards. Never fetch all students/enrollments for dashboard counters. Use maintained aggregates or bounded queries as appropriate. Functions should define appropriate resource limits, retries and maximum instances. Budget alerts are warnings, not a universal hard spending cap.

Document billing prerequisites for the chosen services before enabling them. Avoid quoting unsupported “entire production backend is free” claims.

Use native Universal Links/App Links for owned-domain sharing and verified notification navigation. Supply AASA and `assetlinks.json` templates with placeholders for real identifiers/fingerprints; verify the platform/domain configuration. Do not select a discontinued link product.

## 23. Backend operations and reliability

Implement authorized operations such as:

```text
bootstrapSuperAdmin       # privileged CLI operation, never anonymous HTTP
setStaffRole
createEnrollment
cancelEnrollment
reviewEnrollment
recordAttendance
createServiceRequest
updateServiceRequestStatus
issueCertificate
registerDevice
unregisterDevice
markNotificationRead      # or narrowly allowed client update
createNotificationCampaign
sendTestNotification
processNotificationOutbox
sendDueReminders
createSupportTicket
replyToSupportTicket
askAcademyAssistant
requestAccountDeletion
handlePaymentWebhook     # disabled until provider configured
```

For each operation document: authentication, permission, App Check handling where applicable, validation schema, transaction boundaries, idempotency, error codes and audit behavior. Payment provider webhooks use provider signature verification rather than a mobile App Check token.

Provide structured error codes and user-friendly Arabic/English messages. Do not return stack traces or secrets to clients. Record minimal, non-sensitive logs. Avoid logging FCM tokens, passwords, full student messages or private attachments.

Maintain source-of-truth transactions and an outbox for side effects. Demonstrate enrollment success even when a push provider is temporarily unavailable. No client-side direct notification sending.

## 24. Tests and acceptance criteria

Implement meaningful automated tests for:

- Guest reads published content but cannot read drafts/private collections.
- Student A cannot read or change student B's data.
- Self-edited role/payment/status fields are denied.
- Assigned-instructor permissions and staff suspension.
- Concurrent last-seat enrollment, duplicate submissions and seat release.
- Enrollment status transitions and webhook retry idempotency where implemented.
- Notification outbox retry, deduplication logic, token reassignment and opted-out marketing.
- Malformed/deleted/unauthorized deep-link destination handling.
- Account switching and private-cache cleanup.
- English/Arabic layout, large text and core mobile form behavior.
- Admin form validation and publish/archive flows.

Required real-device/manual matrix:

- iOS foreground/background/terminated app and permission granted/denied.
- Android foreground/background/terminated app and notification permission/channel disabled states.
- Notification tap while signed out and while another user is signed in.
- Token refresh, app reinstall, logout and two devices for the same account.
- Session rescheduled/cancelled before a reminder sends.
- Registration under slow/offline network.
- Tablet landscape, keyboard-open sheets and screen reader navigation.

FCM/APNs, App Check enforcement and real payment integrations need external configuration and device/provider tests. Emulator or unit tests alone cannot prove those work. Mark unavailable tests as NOT RUN with the reason and exact remaining setup step.

## 25. Required documentation and handoff

Deliver:

- Complete Flutter app and Next.js admin source.
- Cloud Functions source, typed contracts, Rules and indexes.
- Idempotent seed script containing clearly identified synthetic content, with an explicit environment guard preventing accidental production seeds.
- `.env.example` files containing placeholders, never credentials.
- Firebase app registration and FlutterFire setup guide.
- iOS APNs/capabilities/signing guide and Android permissions/channels guide.
- Firestore schema and permission matrix.
- Deep-link domain configuration templates.
- Admin bootstrap and role-management instructions.
- Production/staging deployment commands appropriate to the actual generated project.
- Arabic quick-start guide and English technical guide.
- Test results, unexecuted tests, known limitations and production-readiness checklist.

Suggested docs:

```text
README.md
docs/QUICK_START_AR.md
docs/ARCHITECTURE.md
docs/FIREBASE_SETUP.md
docs/IOS_PUSH_SETUP.md
docs/ANDROID_PUSH_SETUP.md
docs/ADMIN_PERMISSIONS.md
docs/DATA_MODELS.md
docs/NOTIFICATION_LIFECYCLE.md
docs/DEEP_LINKS.md
docs/PAYMENTS_AND_ENTITLEMENTS.md
docs/DEPLOYMENT.md
docs/QA_REPORT.md
docs/MANUAL_SETUP_REQUIRED.md
```

Release readiness means: builds pass; core flows work against the configured backend; Rules tests pass; critical device checks are evidenced; unresolved credentials/store/provider dependencies are explicitly listed. A placeholder API adapter is not a completed integration.

## 26. Execution order

1. Inspect supplied source/assets and local instructions; establish scope and write a short implementation checklist.
2. Scaffold repository and verify baseline Flutter/admin builds.
3. Implement theme, localization, shared models and Firebase initialization.
4. Implement secure Rules, roles and one end-to-end course publish/browse flow.
5. Implement cohorts, registration transaction and My Learning.
6. Implement the remaining content, workshop, service and admin modules.
7. Implement inbox/outbox and push lifecycle, then platform configuration templates.
8. Implement support, optional AI adapter, attendance and certificates.
9. Add approved payment interfaces without faking unsupported provider integration.
10. Run checks and integration tests, fix failures, document manual steps and produce the final source handoff.

Continue useful work if a credential or console action is missing. Build emulator-backed flows and leave that specific integration visibly unconfigured. Do not stop after completing only the homepage. Do not publish, contact students or send real campaign notifications unless explicitly authorized; development test sends must use approved test devices only.

Start implementation now.

# END MASTER PROMPT

---

## Reference notes for the person using this prompt

The prompt intentionally asks the coding agent to verify current dependency versions, permissions and store requirements during implementation. It does not assert that a prompt alone makes a production app secure or store-approved.

Official references checked while preparing this prompt:

- [Firebase Cloud Messaging for Flutter — setup](https://firebase.google.com/docs/cloud-messaging/flutter/get-started)
- [Firebase Cloud Messaging for Flutter — receiving messages](https://firebase.google.com/docs/cloud-messaging/flutter/receive-messages)
- [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Cloud Firestore locations](https://firebase.google.com/docs/firestore/locations)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

**Configuration values still needed for a real build:** owned Firebase project IDs, chosen regions, Android application IDs, iOS bundle IDs, Apple signing/APNs configuration, real academy data, owned deep-link domain, approved AI provider credentials if enabled, and payment provider documentation/credentials if payments are enabled. Supply secrets through the development environment or provider console, not inside this prompt.
