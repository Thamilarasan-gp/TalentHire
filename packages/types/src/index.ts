/**
 * THAMILARASAN GLOBAL - DOMAIN TYPES & INTERFACES
 * Core positioning: Find. Evaluate. Hire.
 */

// ==========================================
// ROLES & AUTH
// ==========================================
export type UserRole =
  | 'JOB_SEEKER'
  | 'EVALUATOR'
  | 'COMPANY_ADMIN'
  | 'COMPANY_RECRUITER'
  | 'COMPANY_HIRING_MANAGER'
  | 'PLATFORM_ADMIN'
  | 'PLATFORM_OPERATIONS'
  | 'QA_REVIEWER'
  | 'FINANCE_APPROVER'
  | 'COMPLIANCE'
  | 'READ_ONLY_AUDITOR'
  | 'SUPPORT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: UserRole;
  additionalRoles?: UserRole[];
  companyId?: string;
  candidateId?: string;
  evaluatorId?: string;
  avatarUrl?: string;
  phone?: string;
  isVerified: boolean;
  mfaEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// STATE MACHINES
// ==========================================

export type CandidateState =
  | 'REGISTERED'
  | 'SCREENING'
  | 'INTERVIEW_PENDING'
  | 'INTERVIEWED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'MATCHED'
  | 'COMPANY_INTERVIEW'
  | 'SELECTED'
  | 'PLACED'
  | 'ACTIVE'
  | 'REJECTED'
  | 'ON_HOLD'
  | 'WITHDRAWN'
  | 'NOTICE_PERIOD'
  | 'OFFER_DECLINED'
  | 'NO_SHOW'
  | 'STALE'
  | 'FRAUD_FLAGGED'
  | 'REASSESSMENT_PENDING';

export type RequirementState =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'SOURCING'
  | 'EVALUATING'
  | 'SHORTLISTED'
  | 'INTERVIEWING'
  | 'FILLED'
  | 'CLOSED'
  | 'ON_HOLD'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REOPENED'
  | 'PARTIALLY_FILLED';

export type EvaluationState =
  | 'PENDING'
  | 'ASSIGNMENT_AVAILABLE'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'QA_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REASSESSMENT_REQUIRED'
  | 'CONFLICT_DECLARED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PlacementState =
  | 'PENDING'
  | 'OFFERED'
  | 'CONTRACT_PENDING'
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'GUARANTEE_WINDOW'
  | 'COMPLETED'
  | 'REPLACEMENT_IN_PROGRESS'
  | 'DISPUTED'
  | 'TERMINATED'
  | 'CONVERTED'
  | 'BYPASSED';

export type EvaluationVerdict = 'PASS' | 'FAIL' | 'REVIEW_REQUIRED';

export type FraudStatus = 'CLEAR' | 'REVIEW' | 'HIGH_RISK' | 'FRAUD_CONFIRMED';

// ==========================================
// COMPANY & TEAM
// ==========================================
export interface Company {
  id: string;
  name: string;
  slug: string;
  website: string;
  headquarters: string;
  country: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  industry: string;
  logoUrl?: string;
  description: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  billingTier: 'STANDARD' | 'GROWTH' | 'ENTERPRISE';
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: 'COMPANY_ADMIN' | 'COMPANY_RECRUITER' | 'COMPANY_HIRING_MANAGER';
  title: string;
  status: 'INVITED' | 'ACTIVE' | 'DEACTIVATED';
  createdAt: string;
}

// ==========================================
// CANDIDATE PROFILE & SKILLS
// ==========================================
export interface CandidateSkill {
  name: string;
  yearsOfExperience: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  isVerified?: boolean;
}

export interface CandidateExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface CandidateEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
}

export interface Candidate {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  location: string;
  timezone: string;
  state: CandidateState;
  fraudStatus: FraudStatus;
  primaryRole: string;
  totalYearsOfExperience: number;
  skills: CandidateSkill[];
  experience: CandidateExperience[];
  education: CandidateEducation[];
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  expectedSalaryUsd: number;
  currentSalaryInr?: number;
  noticePeriodDays: number;
  availabilityDate: string;
  engagementType: 'FULL_TIME' | 'CONTRACT' | 'FLEXIBLE';
  summary: string;
  verifiedBadge: boolean;
  matchCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// EVALUATOR PROFILE & DOMAIN EXPERTISE
// ==========================================
export interface EvaluatorExpertise {
  domain: string; // e.g. "Backend", "System Design", "Cloud/DevOps", "Frontend"
  technologies: string[]; // ["Node.js", "TypeScript", "AWS", "Kubernetes"]
  seniorityLevel: 'LEAD' | 'STAFF' | 'PRINCIPAL' | 'DIRECTOR';
  yearsInDomain: number;
}

export interface EvaluatorAvailabilitySlot {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // "18:00"
  endTime: string;   // "22:00"
  timezone: string;
}

export interface Evaluator {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  currentEmployer: string; // Kept private, used for conflict check
  yearsOfExperience: number;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'PAUSED' | 'INACTIVE';
  expertise: EvaluatorExpertise[];
  availabilitySlots: EvaluatorAvailabilitySlot[];
  completedEvaluationsCount: number;
  reliabilityScore: number; // 0 - 100 percentage
  interRaterAgreementScore: number; // 0 - 100
  passRate: number; // historical % passed candidates
  totalEarningsInr: number;
  pendingPayoutInr: number;
  currentActiveLoad: number; // active assignments
  maxConcurrentAssignments: number;
  exEmployers: string[]; // for automatic conflict detection
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// HIRING REQUIREMENT & RUBRICS
// ==========================================
export interface RubricCriterion {
  id: string;
  name: string; // "System Design", "Node.js Concurrency", "Database Architecture"
  category: 'TECHNICAL' | 'SYSTEM_DESIGN' | 'PROBLEM_SOLVING' | 'COMMUNICATION' | 'DOMAIN';
  weight: number; // 0 - 100
  anchorDescriptions: {
    inadequate: string;  // 1-3
    competent: string;   // 4-6
    strong: string;      // 7-8
    expert: string;      // 9-10
  };
}

export interface HiringRequirement {
  id: string;
  companyId: string;
  title: string;
  roleCategory: string; // "Backend Engineering", "Full Stack", "DevOps"
  state: RequirementState;
  openingsCount: number; // e.g. "Need 10 Senior Node.js Engineers"
  filledCount: number;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  minExperienceYears: number;
  maxExperienceYears?: number;
  budgetMinUsd: number;
  budgetMaxUsd: number;
  engagementType: 'FULL_TIME' | 'CONTRACT';
  timezoneRequirement: string; // e.g. "Min 4 hours overlap with EST"
  maxNoticePeriodDays: number;
  jobDescription: string;
  customRubrics?: RubricCriterion[];
  matchedCount?: number;
  evaluatingCount?: number;
  shortlistCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// MATCHING & SCORING
// ==========================================
export interface MatchScoringWeights {
  coreTechnicalSkills: number; // default 35
  relevantExperience: number;  // default 20
  verifiedEvidence: number;    // default 20
  domainExperience: number;    // default 10
  communication: number;       // default 10
  availability: number;        // default 5
}

export type EvaluationScope = 'REUSABLE' | 'COMPANY_SPECIFIC' | 'TOP_UP';
export type EvaluationValidityStatus = 'VALID' | 'EXPIRING' | 'EXPIRED' | 'REASSESSMENT_REQUIRED' | 'SUSPENDED';
export type CandidateEvaluationConsentStatus = 'ACTIVE' | 'WITHDRAWN' | 'PENDING';
export type MatchSource = 'GLOBAL_EVALUATED' | 'COMPANY_APPLICATION' | 'DIRECT_INVITATION' | 'NEW_SOURCING' | 'LEGACY';

export interface CandidateApplication {
  id: string;
  candidateId: string;
  companyId: string;
  requirementId: string;
  source: 'DIRECT_APPLICATION' | 'PLATFORM_MATCH' | 'COMPANY_INVITATION' | 'RECRUITER_SOURCE';
  status: 'APPLIED' | 'SCREENING' | 'EVALUATING' | 'QA_APPROVED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'HIRED' | 'REJECTED';
  appliedAt: string;
  screeningStatus?: string;
  evaluationId?: string;
  shortlistStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoogleIntegrationStatus {
  isConnected: boolean;
  calendarEmail?: string;
  lastSyncAt?: string;
}

export interface MatchReason {
  category: string;
  satisfied: boolean;
  score: number;
  detail: string;
}

export interface Match {
  id: string;
  requirementId: string;
  candidateId: string;
  companyId?: string;
  matchSource?: MatchSource;
  overallScore: number; // 0 - 100
  passedHardFilters: boolean;
  failedFilters: string[];
  reasons: MatchReason[];
  status: 'NEW' | 'EVALUATION_REQUESTED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  evaluationId?: string;
  evaluationStatus?: EvaluationValidityStatus;
  evaluationScope?: EvaluationScope;
  consentStatus?: CandidateEvaluationConsentStatus;
  isTopUpRequired?: boolean;
  uncoveredSkills?: string[];
  createdAt: string;
}

// ==========================================
// EVALUATION & SCORECARD
// ==========================================
export interface EvaluationScoreItem {
  criterionId: string;
  criterionName: string;
  score: number; // 1 - 10
  evidenceNotes: string; // concrete observations
  level: 'INADEQUATE' | 'COMPETENT' | 'STRONG' | 'EXPERT';
}

export interface Evaluation {
  id: string;
  requirementId: string;
  candidateId: string;
  evaluatorId: string;
  companyId?: string;
  scope?: EvaluationScope;
  validityStatus?: EvaluationValidityStatus;
  consentStatus?: CandidateEvaluationConsentStatus;
  evaluatedAt?: string;
  expiresAt?: string;
  coveredSkills?: string[];
  reuseCount?: number;
  lastReusedAt?: string;
  companiesUsingEvaluation?: string[];
  isTopUpRequired?: boolean;
  uncoveredSkills?: string[];
  state: EvaluationState;
  scheduledAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  overallScore?: number; // 0 - 100
  verdict?: EvaluationVerdict;
  scores: EvaluationScoreItem[];
  strengths: string[];
  concerns: string[];
  summaryFeedback: string;
  qaReviewedBy?: string;
  qaNotes?: string;
  qaStatus?: 'SUBMITTED' | 'QA_REVIEW' | 'APPROVED' | 'REJECTED' | 'CALIBRATION_HOLD' | 'REASSESSMENT_REQUIRED';
  payoutAmountInr: number;
  conflictDeclared: boolean;
  conflictDetails?: string;
  interviewRecordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// SHORTLIST & INTERVIEWS
// ==========================================
export interface ShortlistCandidateItem {
  candidateId: string;
  candidateName: string;
  matchScore: number;
  evaluationScore: number;
  rank: number;
  headline: string;
  keySkills: string[];
  experienceYears: number;
  noticePeriodDays: number;
  expectedSalaryUsd: number;
  strengths: string[];
  concerns: string[];
  status: 'PENDING_REVIEW' | 'INTERVIEW_SCHEDULED' | 'OFFER_EXTENDED' | 'REJECTED';
}

export interface Shortlist {
  id: string;
  requirementId: string;
  companyId: string;
  targetCount: number; // e.g. 10
  qualifiedCount: number; // e.g. 7
  isDeficit: boolean; // true if qualifiedCount < targetCount
  candidates: ShortlistCandidateItem[];
  generatedAt: string;
  status: 'DRAFT' | 'READY_FOR_COMPANY' | 'ARCHIVED';
}

export interface Interview {
  id: string;
  requirementId: string;
  companyId: string;
  candidateId: string;
  interviewType: 'EVALUATOR_SCREEN' | 'COMPANY_ROUND_1' | 'COMPANY_ROUND_2' | 'COMPANY_EXECUTIVE';
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  interviewerNames: string[];
  feedbackNotes?: string;
  rating?: number; // 1 - 5
  companyDecision?: 'PROCEED_TO_OFFER' | 'NEXT_ROUND' | 'REJECT' | 'ON_HOLD';
  createdAt: string;
}

// ==========================================
// OFFERS & PLACEMENTS
// ==========================================
export interface Offer {
  id: string;
  requirementId: string;
  companyId: string;
  candidateId: string;
  annualSalaryUsd: number;
  bonusUsd?: number;
  equityTerms?: string;
  startDate: string;
  expiresAt: string;
  status: 'DRAFT' | 'EXTENDED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  termsDocumentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Placement {
  id: string;
  requirementId: string;
  companyId: string;
  candidateId: string;
  offerId: string;
  state: PlacementState;
  annualSalaryUsd: number;
  platformFeeUsd: number;
  startDate: string;
  guaranteeEndDate: string; // typically 90 days
  replacementRequested: boolean;
  replacementNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// FINANCE & LEDGER
// ==========================================
export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  requirementId?: string;
  placementId?: string;
  amountUsd: number;
  taxUsd: number;
  totalUsd: number;
  dueDate: string;
  paidAt?: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'VOID';
  items: { description: string; amountUsd: number }[];
  createdAt: string;
}

export interface EvaluatorPayout {
  id: string;
  evaluatorId: string;
  evaluationId: string;
  amountInr: number;
  status: 'ASSIGNMENT_ACCEPTED' | 'COMPLETED' | 'QA_ELIGIBLE' | 'PAYABLE' | 'APPROVED' | 'PAID';
  approvedBy?: string;
  paidAt?: string;
  bankRef?: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  referenceType: 'INVOICE' | 'EVALUATOR_PAYOUT' | 'ADJUSTMENT' | 'REFUND';
  referenceId: string;
  accountType: 'COMPANY_RECEIVABLE' | 'EVALUATOR_PAYABLE' | 'PLATFORM_REVENUE' | 'TAX_LIABILITY';
  debit: number;
  credit: number;
  currency: 'USD' | 'INR';
  description: string;
  timestamp: string;
}

// ==========================================
// AUDIT LOG & INTEGRITY
// ==========================================
export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

export interface FraudFlag {
  id: string;
  candidateId: string;
  flagType: 'IDENTITY_MISMATCH' | 'IP_ANOMALY' | 'QUESTION_LEAKAGE' | 'PROXY_ATTEMPT' | 'VOICE_DIVERGENCE';
  status: FraudStatus;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedSignals: string[];
  reviewerNotes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userRole: UserRole;
  subject: string;
  category: 'BILLING' | 'TECHNICAL' | 'EVALUATION' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  messages: { senderId: string; text: string; timestamp: string }[];
  createdAt: string;
}
