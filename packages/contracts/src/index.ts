/**
 * DentaCollab Cross-Platform Data Contracts & Enums
 * Target: Dart (Flutter), TypeScript (Next.js Admin & Firebase Functions)
 */

export interface BilingualText {
  ar: string;
  en: string;
}

export type UserRole =
  | 'super_admin'
  | 'academy_manager'
  | 'content_editor'
  | 'instructor'
  | 'support_agent'
  | 'student';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type DeliveryMode = 'in_person' | 'live_online' | 'recorded';

export type CourseLevel = 'basic' | 'intermediate' | 'advanced' | 'all_levels';

export type EnrollmentStatus =
  | 'requested'
  | 'awaiting_payment'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled'
  | 'completed';

export type PaymentStatus =
  | 'not_required'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PriceMode = 'fixed' | 'starting_from' | 'quote';

export type ServiceRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'quoted'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type SupportTicketStatus =
  | 'open'
  | 'pending_agent'
  | 'pending_student'
  | 'resolved'
  | 'closed';

export type NotificationEventType =
  | 'enrollment_received'
  | 'enrollment_confirmed'
  | 'enrollment_waitlisted'
  | 'enrollment_cancelled'
  | 'session_reminder'
  | 'schedule_change'
  | 'certificate_ready'
  | 'service_request_status_change'
  | 'support_reply'
  | 'course_announcement';

export interface MoneyAmount {
  /** Amount in minor units (e.g. integer 250000 IQD, exponent 0; or cents for USD exponent 2) */
  amountMinorUnits: number;
  currency: 'IQD' | 'USD';
  exponent: number;
}

/** User Profile stored in users/{uid} */
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  city?: string;
  profession?: string;
  experienceYears?: number;
  avatarUrl?: string;
  preferredLanguage: 'ar' | 'en';
  preferredTheme: 'light' | 'dark' | 'system';
  createdAt: string; // ISO 8601 UTC
  updatedAt: string;
}

/** Staff role mapping stored in staffMemberships/{uid} */
export interface StaffMembership {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  assignedCohortIds?: string[];
  assignedCourseIds?: string[];
  grantedByUid: string;
  createdAt: string;
  updatedAt: string;
}

/** Reusable Course definition in courses/{courseId} */
export interface Course {
  id: string;
  slug: string;
  title: BilingualText;
  description: BilingualText;
  learningObjectives?: BilingualText[];
  prerequisites?: BilingualText[];
  coverImagePath: string;
  level: CourseLevel;
  deliveryMode: DeliveryMode;
  category: string;
  instructorIds: string[];
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  sortOrder: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Curriculum Module in courses/{courseId}/modules/{moduleId} */
export interface CourseModule {
  id: string;
  courseId: string;
  title: BilingualText;
  description?: BilingualText;
  orderIndex: number;
  lessons: {
    id: string;
    title: BilingualText;
    durationMinutes?: number;
    description?: BilingualText;
  }[];
}

/** Course Cohort in courseCohorts/{cohortId} */
export interface CourseCohort {
  id: string;
  courseId: string;
  title: BilingualText;
  venueName: BilingualText;
  venueAddress?: BilingualText;
  venueMapUrl?: string;
  startDateUtc: string; // ISO 8601 UTC
  endDateUtc: string;
  timezone: string; // "Asia/Baghdad"
  scheduleSummary: BilingualText;
  maxCapacity: number;
  reservedSeats: number;
  waitlistCount: number;
  price: MoneyAmount;
  registrationOpen: boolean;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

/** Workshop in workshops/{workshopId} */
export interface Workshop {
  id: string;
  slug: string;
  title: BilingualText;
  description: BilingualText;
  coverImagePath: string;
  instructorIds: string[];
  sessions: {
    id: string;
    title: BilingualText;
    dateUtc: string;
    venueName: BilingualText;
    maxCapacity: number;
    reservedSeats: number;
    price: MoneyAmount;
  }[];
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Instructor Profile in instructors/{instructorId} */
export interface Instructor {
  id: string;
  slug: string;
  name: BilingualText;
  title: BilingualText;
  bio: BilingualText;
  credentials: BilingualText[];
  avatarImagePath: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  sortOrder: number;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

/** Enrollment record in enrollments/{enrollmentId} */
export interface Enrollment {
  id: string;
  uid: string;
  entityType: 'course_cohort' | 'workshop_session';
  courseId?: string;
  cohortId?: string;
  workshopId?: string;
  sessionId?: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  idempotencyKey: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  notes?: string;
  verificationPassToken: string; // Opaque server-verifiable token for QR
  registeredAt: string;
  updatedAt: string;
}

/** Attendance in attendance/{attendanceId} */
export interface AttendanceRecord {
  id: string;
  enrollmentId: string;
  cohortId?: string;
  sessionId?: string;
  uid: string;
  checkedInAt: string;
  checkedInByStaffUid: string;
  status: 'present' | 'absent' | 'excused';
}

/** Academy Service in services/{serviceId} */
export interface AcademyService {
  id: string;
  slug: string;
  title: BilingualText;
  summary: BilingualText;
  description: BilingualText;
  category: string;
  coverImagePath: string;
  galleryImagePaths: string[];
  priceMode: PriceMode;
  startingPrice?: MoneyAmount;
  turnaroundSummary: BilingualText;
  featured: boolean;
  publicationStatus: PublicationStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Service Inquiry/Request in serviceRequests/{requestId} */
export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  description: string;
  preferredContactMethod: 'whatsapp' | 'email' | 'phone';
  quotedPrice?: MoneyAmount;
  adminNotes?: string;
  status: ServiceRequestStatus;
  attachmentPaths?: string[];
  createdAt: string;
  updatedAt: string;
}

/** Certificate in certificates/{certificateId} */
export interface Certificate {
  id: string;
  uid: string;
  enrollmentId: string;
  courseTitle: BilingualText;
  recipientName: string;
  issuedAt: string;
  publicVerificationId: string;
  pdfDownloadPath?: string;
  revoked: boolean;
  revokedReason?: string;
}

/** In-App Notification in users/{uid}/notifications/{eventId} */
export interface InboxNotification {
  id: string; // deterministic eventId
  uid: string;
  title: BilingualText;
  body: BilingualText;
  eventType: NotificationEventType;
  entityType?: 'enrollment' | 'service_request' | 'support_ticket' | 'course';
  entityId?: string;
  routeKey?: string;
  read: boolean;
  createdAt: string;
}

/** Device Registration in deviceRegistrations/{installationId} */
export interface DeviceRegistration {
  installationId: string;
  uid: string;
  fcmToken: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  language: 'ar' | 'en';
  active: boolean;
  permissionStatus: 'granted' | 'denied' | 'provisional';
  lastSeenAt: string;
}

/** Support Ticket in supportTickets/{ticketId} */
export interface SupportTicket {
  id: string;
  uid: string;
  subject: string;
  category: 'enrollment' | 'course_content' | 'certificates' | 'general';
  status: SupportTicketStatus;
  assignedStaffUid?: string;
  createdAt: string;
  updatedAt: string;
}

/** Support Message in supportTickets/{ticketId}/messages/{messageId} */
export interface SupportMessage {
  id: string;
  ticketId: string;
  senderUid: string;
  senderName: string;
  isStaff: boolean;
  content: string;
  attachmentPaths?: string[];
  createdAt: string;
}

/** Audit Event in auditLogs/{eventId} */
export interface AuditEvent {
  id: string;
  actorUid: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetCollection: string;
  targetId: string;
  beforeSnapshot?: Record<string, any>;
  afterSnapshot?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

/** Public Settings in appSettings/public */
export interface AppSettingsPublic {
  academyName: BilingualText;
  tagline: BilingualText;
  contactWhatsApp: string;
  contactPhone: string;
  contactEmail: string;
  socialInstagram: string;
  socialFacebook: string;
  academyLocationAddress: BilingualText;
  academyLocationMapUrl: string;
  servicesCatalogEnabled: boolean;
  aiAssistantEnabled: boolean;
}
