import type { ColumnType } from "kysely";

import type {
  SchedulingType,
  PeriodType,
  IdentityProvider,
  UserPermissionRole,
  MembershipRole,
  BookingStatus,
  EventTypeCustomInputType,
  ReminderType,
  PaymentOption,
  WebhookTriggerEvents,
  AppCategories,
  WorkflowTriggerEvents,
  WorkflowActions,
  TimeUnit,
  WorkflowTemplates,
  WorkflowMethods,
  FeatureType,
} from "./enums";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
  id: string;
  userId: number;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};
export type ApiKey = {
  id: string;
  userId: number;
  teamId: number | null;
  note: string | null;
  createdAt: Generated<Timestamp>;
  expiresAt: Timestamp | null;
  lastUsedAt: Timestamp | null;
  hashedKey: string;
  appId: string | null;
};
export type App = {
  slug: string;
  dirName: string;
  keys: unknown | null;
  categories: AppCategories[];
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  enabled: Generated<boolean>;
};
export type App_RoutingForms_Form = {
  id: string;
  description: string | null;
  position: Generated<number>;
  routes: unknown | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  name: string;
  fields: unknown | null;
  userId: number;
  teamId: number | null;
  disabled: Generated<boolean>;
  /**
   * @zod.custom(imports.RoutingFormSettings)
   */
  settings: unknown | null;
};
export type App_RoutingForms_FormResponse = {
  id: Generated<number>;
  formFillerId: string;
  formId: string;
  response: unknown;
  createdAt: Generated<Timestamp>;
};
export type Attendee = {
  id: Generated<number>;
  email: string;
  name: string;
  timeZone: string;
  locale: Generated<string | null>;
  bookingId: number | null;
};
export type Availability = {
  id: Generated<number>;
  userId: number | null;
  eventTypeId: number | null;
  days: number[];
  startTime: Timestamp;
  endTime: Timestamp;
  date: Timestamp | null;
  scheduleId: number | null;
};
export type Booking = {
  id: Generated<number>;
  uid: string;
  userId: number | null;
  eventTypeId: number | null;
  title: string;
  description: string | null;
  customInputs: unknown | null;
  /**
   * @zod.custom(imports.bookingResponses)
   */
  responses: unknown | null;
  startTime: Timestamp;
  endTime: Timestamp;
  location: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  status: Generated<BookingStatus>;
  paid: Generated<boolean>;
  destinationCalendarId: number | null;
  cancellationReason: string | null;
  rejectionReason: string | null;
  dynamicEventSlugRef: string | null;
  dynamicGroupSlugRef: string | null;
  rescheduled: boolean | null;
  fromReschedule: string | null;
  recurringEventId: string | null;
  smsReminderNumber: string | null;
  scheduledJobs: string[];
  /**
   * @zod.custom(imports.bookingMetadataSchema)
   */
  metadata: unknown | null;
  isRecorded: Generated<boolean>;
};
export type BookingReference = {
  id: Generated<number>;
  /**
   * @zod.min(1)
   */
  type: string;
  /**
   * @zod.min(1)
   */
  uid: string;
  meetingId: string | null;
  meetingPassword: string | null;
  meetingUrl: string | null;
  bookingId: number | null;
  externalCalendarId: string | null;
  deleted: boolean | null;
  credentialId: number | null;
};
export type BookingSeat = {
  id: Generated<number>;
  referenceUid: string;
  bookingId: number;
  attendeeId: number;
  data: unknown | null;
};
export type BookingTimeStatus = {
  id: number;
  uid: string | null;
  eventTypeId: number | null;
  title: string | null;
  description: string | null;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  createdAt: Timestamp | null;
  location: string | null;
  paid: boolean | null;
  status: BookingStatus | null;
  rescheduled: boolean | null;
  userId: number | null;
  teamId: number | null;
  eventLength: number | null;
  timeStatus: string | null;
  eventParentId: number | null;
};
export type Credential = {
  id: Generated<number>;
  type: string;
  key: unknown;
  userId: number | null;
  teamId: number | null;
  appId: string | null;
  invalid: Generated<boolean | null>;
};
export type Deployment = {
  /**
   * This is a single row table, so we use a fixed id
   */
  id: Generated<number>;
  logo: string | null;
  /**
   * @zod.custom(imports.DeploymentTheme)
   */
  theme: unknown | null;
  licenseKey: string | null;
  agreedLicenseAt: Timestamp | null;
};
export type DestinationCalendar = {
  id: Generated<number>;
  integration: string;
  externalId: string;
  userId: number | null;
  eventTypeId: number | null;
  credentialId: number | null;
};
export type EventType = {
  id: Generated<number>;
  /**
   * @zod.min(1)
   */
  title: string;
  /**
   * @zod.custom(imports.eventTypeSlug)
   */
  slug: string;
  description: string | null;
  position: Generated<number>;
  /**
   * @zod.custom(imports.eventTypeLocations)
   */
  locations: unknown | null;
  /**
   * @zod.min(1)
   */
  length: number;
  offsetStart: Generated<number>;
  hidden: Generated<boolean>;
  userId: number | null;
  teamId: number | null;
  eventName: string | null;
  parentId: number | null;
  /**
   * @zod.custom(imports.eventTypeBookingFields)
   */
  bookingFields: unknown | null;
  timeZone: string | null;
  periodType: Generated<PeriodType>;
  /**
   * @zod.custom(imports.coerceToDate)
   */
  periodStartDate: Timestamp | null;
  /**
   * @zod.custom(imports.coerceToDate)
   */
  periodEndDate: Timestamp | null;
  periodDays: number | null;
  periodCountCalendarDays: boolean | null;
  requiresConfirmation: Generated<boolean>;
  requiresBookerEmailVerification: Generated<boolean>;
  /**
   * @zod.custom(imports.recurringEventType)
   */
  recurringEvent: unknown | null;
  disableGuests: Generated<boolean>;
  hideCalendarNotes: Generated<boolean>;
  /**
   * @zod.min(0)
   */
  minimumBookingNotice: Generated<number>;
  beforeEventBuffer: Generated<number>;
  afterEventBuffer: Generated<number>;
  seatsPerTimeSlot: number | null;
  seatsShowAttendees: Generated<boolean | null>;
  seatsShowAvailabilityCount: Generated<boolean | null>;
  schedulingType: SchedulingType | null;
  scheduleId: number | null;
  price: Generated<number>;
  currency: Generated<string>;
  slotInterval: number | null;
  /**
   * @zod.custom(imports.EventTypeMetaDataSchema)
   */
  metadata: unknown | null;
  /**
   * @zod.custom(imports.successRedirectUrl)
   */
  successRedirectUrl: string | null;
  /**
   * @zod.custom(imports.intervalLimitsType)
   */
  bookingLimits: unknown | null;
  /**
   * @zod.custom(imports.intervalLimitsType)
   */
  durationLimits: unknown | null;
};
export type EventTypeCustomInput = {
  id: Generated<number>;
  eventTypeId: number;
  label: string;
  type: EventTypeCustomInputType;
  /**
   * @zod.custom(imports.customInputOptionSchema)
   */
  options: unknown | null;
  required: boolean;
  placeholder: Generated<string>;
};
export type Feature = {
  slug: string;
  enabled: Generated<boolean>;
  description: string | null;
  type: Generated<FeatureType | null>;
  stale: Generated<boolean | null>;
  lastUsedAt: Timestamp | null;
  createdAt: Generated<Timestamp | null>;
  updatedAt: Generated<Timestamp | null>;
  updatedBy: number | null;
};
export type Feedback = {
  id: Generated<number>;
  date: Generated<Timestamp>;
  userId: number;
  rating: string;
  comment: string | null;
};
export type HashedLink = {
  id: Generated<number>;
  link: string;
  eventTypeId: number;
};
export type Host = {
  userId: number;
  eventTypeId: number;
  isFixed: Generated<boolean>;
};
export type Impersonations = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  impersonatedUserId: number;
  impersonatedById: number;
};
export type Membership = {
  id: Generated<number>;
  teamId: number;
  userId: number;
  accepted: Generated<boolean>;
  role: MembershipRole;
  disableImpersonation: Generated<boolean>;
};
export type Payment = {
  id: Generated<number>;
  uid: string;
  appId: string | null;
  bookingId: number;
  amount: number;
  fee: number;
  currency: string;
  success: boolean;
  refunded: boolean;
  data: unknown;
  externalId: string;
  paymentOption: Generated<PaymentOption | null>;
};
export type ReminderMail = {
  id: Generated<number>;
  referenceId: number;
  reminderType: ReminderType;
  elapsedMinutes: number;
  createdAt: Generated<Timestamp>;
};
export type ResetPasswordRequest = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  email: string;
  expires: Timestamp;
};
export type Schedule = {
  id: Generated<number>;
  userId: number;
  name: string;
  timeZone: string | null;
};
export type SelectedCalendar = {
  userId: number;
  integration: string;
  externalId: string;
};
export type SelectedSlots = {
  id: Generated<number>;
  eventTypeId: number;
  userId: number;
  slotUtcStartDate: Timestamp;
  slotUtcEndDate: Timestamp;
  uid: string;
  releaseAt: Timestamp;
  isSeat: Generated<boolean>;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: number;
  expires: Timestamp;
};
export type Team = {
  id: Generated<number>;
  /**
   * @zod.min(1)
   */
  name: string;
  /**
   * @zod.min(1)
   */
  slug: string | null;
  logo: string | null;
  appLogo: string | null;
  appIconLogo: string | null;
  bio: string | null;
  hideBranding: Generated<boolean>;
  isPrivate: Generated<boolean>;
  hideBookATeamMember: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  /**
   * @zod.custom(imports.teamMetadataSchema)
   */
  metadata: unknown | null;
  theme: string | null;
  brandColor: Generated<string>;
  darkBrandColor: Generated<string>;
  parentId: number | null;
  timeFormat: number | null;
  timeZone: Generated<string>;
  weekStart: Generated<string>;
};
export type User = {
  id: Generated<number>;
  username: string | null;
  name: string | null;
  /**
   * @zod.email()
   */
  email: string;
  emailVerified: Timestamp | null;
  password: string | null;
  bio: string | null;
  avatar: string | null;
  timeZone: Generated<string>;
  weekStart: Generated<string>;
  startTime: Generated<number>;
  endTime: Generated<number>;
  bufferTime: Generated<number>;
  hideBranding: Generated<boolean>;
  theme: string | null;
  created: Generated<Timestamp>;
  trialEndsAt: Timestamp | null;
  defaultScheduleId: number | null;
  completedOnboarding: Generated<boolean>;
  locale: string | null;
  timeFormat: Generated<number | null>;
  twoFactorSecret: string | null;
  twoFactorEnabled: Generated<boolean>;
  backupCodes: string | null;
  identityProvider: Generated<IdentityProvider>;
  identityProviderId: string | null;
  invitedTo: number | null;
  brandColor: Generated<string>;
  darkBrandColor: Generated<string>;
  away: Generated<boolean>;
  allowDynamicBooking: Generated<boolean | null>;
  allowSEOIndexing: Generated<boolean | null>;
  /**
   * @zod.custom(imports.userMetadata)
   */
  metadata: unknown | null;
  verified: Generated<boolean | null>;
  role: Generated<UserPermissionRole>;
  disableImpersonation: Generated<boolean>;
  organizationId: number | null;
};
export type user_eventtype = {
  A: number;
  B: number;
};
export type VerificationToken = {
  id: Generated<number>;
  identifier: string;
  token: string;
  expires: Timestamp;
  expiresInDays: number | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  teamId: number | null;
};
export type VerifiedNumber = {
  id: Generated<number>;
  userId: number | null;
  teamId: number | null;
  phoneNumber: string;
};
export type Webhook = {
  id: string;
  userId: number | null;
  teamId: number | null;
  eventTypeId: number | null;
  /**
   * @zod.url()
   */
  subscriberUrl: string;
  payloadTemplate: string | null;
  createdAt: Generated<Timestamp>;
  active: Generated<boolean>;
  eventTriggers: WebhookTriggerEvents[];
  appId: string | null;
  secret: string | null;
};
export type WebhookScheduledTriggers = {
  id: Generated<number>;
  jobName: string;
  subscriberUrl: string;
  payload: string;
  startAfter: Timestamp;
  retryCount: Generated<number>;
  createdAt: Generated<Timestamp | null>;
};
export type Workflow = {
  id: Generated<number>;
  position: Generated<number>;
  name: string;
  userId: number | null;
  teamId: number | null;
  trigger: WorkflowTriggerEvents;
  time: number | null;
  timeUnit: TimeUnit | null;
};
export type WorkflowReminder = {
  id: Generated<number>;
  bookingUid: string | null;
  method: WorkflowMethods;
  scheduledDate: Timestamp;
  referenceId: string | null;
  scheduled: boolean;
  workflowStepId: number | null;
  cancelled: boolean | null;
  seatReferenceId: string | null;
};
export type WorkflowsOnEventTypes = {
  id: Generated<number>;
  workflowId: number;
  eventTypeId: number;
};
export type WorkflowStep = {
  id: Generated<number>;
  stepNumber: number;
  action: WorkflowActions;
  workflowId: number;
  sendTo: string | null;
  reminderBody: string | null;
  emailSubject: string | null;
  template: Generated<WorkflowTemplates>;
  numberRequired: boolean | null;
  sender: string | null;
  numberVerificationPending: Generated<boolean>;
  includeCalendarEvent: Generated<boolean>;
};
export type DB = {
  _user_eventtype: user_eventtype;
  Account: Account;
  ApiKey: ApiKey;
  App: App;
  App_RoutingForms_Form: App_RoutingForms_Form;
  App_RoutingForms_FormResponse: App_RoutingForms_FormResponse;
  Attendee: Attendee;
  Availability: Availability;
  Booking: Booking;
  BookingReference: BookingReference;
  BookingSeat: BookingSeat;
  BookingTimeStatus: BookingTimeStatus;
  Credential: Credential;
  Deployment: Deployment;
  DestinationCalendar: DestinationCalendar;
  EventType: EventType;
  EventTypeCustomInput: EventTypeCustomInput;
  Feature: Feature;
  Feedback: Feedback;
  HashedLink: HashedLink;
  Host: Host;
  Impersonations: Impersonations;
  Membership: Membership;
  Payment: Payment;
  ReminderMail: ReminderMail;
  ResetPasswordRequest: ResetPasswordRequest;
  Schedule: Schedule;
  SelectedCalendar: SelectedCalendar;
  SelectedSlots: SelectedSlots;
  Session: Session;
  Team: Team;
  users: User;
  VerificationToken: VerificationToken;
  VerifiedNumber: VerifiedNumber;
  Webhook: Webhook;
  WebhookScheduledTriggers: WebhookScheduledTriggers;
  Workflow: Workflow;
  WorkflowReminder: WorkflowReminder;
  WorkflowsOnEventTypes: WorkflowsOnEventTypes;
  WorkflowStep: WorkflowStep;
};
