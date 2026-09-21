import mongoose, { Schema } from 'mongoose';

// ==========================================
// 1. USER SCHEMA
// ==========================================
const UserSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, index: true },
    passwordHash: { type: String, default: '$2a$10$e8w6qjX0dG6Xw9w8TqE6z.tEaB3F9wG6Xw9w8TqE6z.tEaB3F9wG' },
    role: { type: String, index: true },
    fullName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    isActive: { type: Boolean, default: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    evaluatorId: { type: String, index: true },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 2. COMPANY SCHEMA
// ==========================================
const CompanySchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, index: true },
    slug: { type: String, index: true },
    website: { type: String },
    headquarters: { type: String },
    country: { type: String },
    city: { type: String },
    timezone: { type: String },
    size: { type: String },
    industry: { type: String },
    tier: { type: String, default: 'GROWTH' },
    billingTier: { type: String, default: 'GROWTH' },
    status: { type: String, default: 'ACTIVE' },
    logoUrl: { type: String },
    description: { type: String },
    primaryContactEmail: { type: String },
    contactEmail: { type: String },
    activeRequirementsCount: { type: Number, default: 0 },
    totalPlacementsCount: { type: Number, default: 0 },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 3. CANDIDATE SCHEMA
// ==========================================
const CandidateSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    fullName: { type: String, index: true },
    headline: { type: String },
    skills: { type: Schema.Types.Mixed, default: [] },
    totalYearsOfExperience: { type: Number, index: true },
    timezone: { type: String, default: 'UTC+5:30' },
    availableHoursStart: { type: Number, default: 12 },
    availableHoursEnd: { type: Number, default: 21 },
    currentSalaryInr: { type: Number },
    expectedSalaryInr: { type: Number },
    expectedSalaryUsd: { type: Number, index: true },
    noticePeriodDays: { type: Number, index: true },
    state: { type: String, default: 'VETTED', index: true },
    tier: { type: String, default: 'TIER_1' },
    evaluationScore: { type: Number, default: 85, index: true },
    verifiedClaims: { type: Schema.Types.Mixed, default: [] },
    pastCompanies: { type: [String], default: [] },
    education: { type: Schema.Types.Mixed, default: [] },
    resumeUrl: { type: String },
    fraudStatus: { type: String, default: 'CLEAR' },
    primaryRole: { type: String, default: 'Software Engineer' },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 4. EVALUATOR SCHEMA
// ==========================================
const EvaluatorSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    fullName: { type: String, index: true },
    headline: { type: String },
    primaryDomains: { type: [String], default: [] },
    skills: { type: Schema.Types.Mixed, default: [] },
    totalExperienceYears: { type: Number, default: 10 },
    currentCompany: { type: String },
    pastCompanies: { type: [String], default: [] },
    currentEmployer: { type: String },
    exEmployers: { type: [String], default: [] },
    status: { type: String, default: 'ACTIVE' },
    hourlyRateInr: { type: Number, default: 5000 },
    maxWeeklyInterviews: { type: Number, default: 5 },
    completedEvaluationsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 4.9 },
    calibrationScore: { type: Number, default: 95 },
    reliabilityScore: { type: Number, default: 95 },
    passRate: { type: Number, default: 0.65 },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 5. HIRING REQUIREMENT SCHEMA
// ==========================================
const RequirementSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    title: { type: String, index: true },
    roleCategory: { type: String },
    seniority: { type: String },
    requiredSkills: { type: Schema.Types.Mixed, default: [] },
    niceToHaveSkills: { type: [String], default: [] },
    minExperienceYears: { type: Number },
    budgetMinUsd: { type: Number },
    budgetMaxUsd: { type: Number },
    timezoneRequirement: { type: String },
    minTimezoneOverlapHours: { type: Number, default: 4 },
    maxNoticePeriodDays: { type: Number, default: 30 },
    jobDescription: { type: String, default: '' },
    state: { type: String, default: 'MATCHING_ACTIVE', index: true },
    targetShortlistSize: { type: Number, default: 10 },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 6. MATCH RECORD SCHEMA
// ==========================================
const MatchSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    requirementId: { type: String, index: true },
    candidateId: { type: String, index: true },
    companyId: { type: String, index: true },
    matchSource: { type: String, default: 'GLOBAL_EVALUATED', index: true },
    stage1Passed: { type: Boolean },
    stage1FailReasons: { type: [String], default: [] },
    stage2Score: { type: Number, default: 0, index: true },
    stage2Breakdown: { type: Schema.Types.Mixed },
    isShortlistCandidate: { type: Boolean, default: false },
    rank: { type: Number },
    evaluationId: { type: String, index: true },
    evaluationStatus: { type: String },
    evaluationScope: { type: String },
    consentStatus: { type: String },
    isTopUpRequired: { type: Boolean, default: false },
    uncoveredSkills: { type: [String], default: [] },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 7. EVALUATION SCHEMA
// ==========================================
const EvaluationSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    assignmentId: { type: String },
    requirementId: { type: String, index: true },
    candidateId: { type: String, index: true },
    evaluatorId: { type: String, index: true },
    companyId: { type: String, index: true },
    scope: { type: String, default: 'REUSABLE', index: true }, // REUSABLE | COMPANY_SPECIFIC | TOP_UP
    validityStatus: { type: String, default: 'VALID', index: true }, // VALID | EXPIRING | EXPIRED | REASSESSMENT_REQUIRED | SUSPENDED
    consentStatus: { type: String, default: 'ACTIVE', index: true }, // ACTIVE | WITHDRAWN | PENDING
    status: { type: String, default: 'PENDING_EVALUATION', index: true },
    qaStatus: { type: String, default: 'SUBMITTED', index: true }, // SUBMITTED | QA_REVIEW | APPROVED | REASSESSMENT_REQUIRED
    scheduledAt: { type: String },
    evaluatedAt: { type: String },
    completedAt: { type: String },
    expiresAt: { type: String, index: true },
    coveredSkills: { type: [String], default: [] },
    reuseCount: { type: Number, default: 0 },
    lastReusedAt: { type: String },
    companiesUsingEvaluation: { type: [String], default: [] },
    isTopUpRequired: { type: Boolean, default: false },
    uncoveredSkills: { type: [String], default: [] },
    rubricScores: { type: Schema.Types.Mixed, default: [] },
    overallScore: { type: Number, index: true },
    recommendation: { type: String },
    evidenceNotes: { type: String },
    strengths: { type: [String], default: [] },
    concerns: { type: [String], default: [] },
    qaCalibrated: { type: Boolean, default: false },
    payoutReleased: { type: Boolean, default: false },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 8. SHORTLIST SCHEMA
// ==========================================
const ShortlistSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    requirementId: { type: String, index: true },
    companyId: { type: String, index: true },
    targetCount: { type: Number },
    qualifiedCount: { type: Number },
    isDeficit: { type: Boolean, default: false },
    candidates: { type: Schema.Types.Mixed, default: [] },
    generatedAt: { type: String },
    status: { type: String, default: 'READY_FOR_COMPANY' },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 9. INTERVIEW SCHEMA
// ==========================================
const InterviewSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    requirementId: { type: String, index: true },
    scheduledAt: { type: String },
    durationMinutes: { type: Number, default: 60 },
    meetingLink: { type: String },
    status: { type: String, default: 'SCHEDULED' },
    interviewType: { type: String, default: 'FINAL_CLIENT_INTERVIEW' },
    interviewerNames: { type: [String], default: [] },
    feedbackNotes: { type: String, default: '' },
    rating: { type: Number, default: null },
    companyDecision: { type: String, default: null },
    candidateName: { type: String, default: '' },
    candidateRole: { type: String, default: '' },
    candidateHeadline: { type: String, default: '' },
    candidateEmail: { type: String, default: '' },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 10. OFFER SCHEMA
// ==========================================
const OfferSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    requirementId: { type: String, index: true },
    annualSalaryUsd: { type: Number },
    signingBonusUsd: { type: Number, default: 0 },
    proposedStartDate: { type: String },
    expiryDate: { type: String },
    status: { type: String, default: 'EXTENDED' },
    terms: { type: String, default: '' },
    extendedAt: { type: String },
    respondedAt: { type: String },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 11. PLACEMENT SCHEMA
// ==========================================
const PlacementSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    requirementId: { type: String, index: true },
    offerId: { type: String },
    startDate: { type: String },
    annualSalaryUsd: { type: Number },
    placementFeePercentage: { type: Number, default: 15 },
    feeAmountUsd: { type: Number },
    status: { type: String, default: 'ACTIVE_GUARANTEE' },
    guaranteeEndDate: { type: String },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 12. INVOICE SCHEMA
// ==========================================
const InvoiceSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    placementId: { type: String },
    amountUsd: { type: Number },
    issueDate: { type: String },
    dueDate: { type: String },
    status: { type: String, default: 'ISSUED' },
    stripeInvoiceId: { type: String },
    razorpayOrderId: { type: String },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 13. EVALUATOR PAYOUT SCHEMA
// ==========================================
const PayoutSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    evaluatorId: { type: String, index: true },
    evaluationId: { type: String },
    amountInr: { type: Number, default: 5000 },
    status: { type: String, default: 'PROCESSING' },
    disbursedAt: { type: String },
    transactionRef: { type: String },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 14. AUDIT LOG SCHEMA
// ==========================================
const AuditLogSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    action: { type: String, index: true },
    actorId: { type: String },
    actorEmail: { type: String },
    actorRole: { type: String },
    entity: { type: String },
    entityId: { type: String },
    timestamp: { type: String },
    ipAddress: { type: String, default: '127.0.0.1' },
    details: { type: Schema.Types.Mixed },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 15. COMPANY PRIVATE NOTES SCHEMA
// ==========================================
const CompanyNoteSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    authorId: { type: String },
    authorName: { type: String },
    notes: { type: String, required: true },
    rating: { type: Number },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 16. SUPPORT TICKET SCHEMA
// ==========================================
const SupportTicketSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String },
    subject: { type: String, required: true },
    category: { type: String, default: 'GENERAL' },
    priority: { type: String, default: 'MEDIUM' },
    status: { type: String, default: 'OPEN', index: true },
    messages: { type: Schema.Types.Mixed, default: [] },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 17. CANDIDATE APPLICATION SCHEMA (COMPANY DEDICATED PIPELINE)
// ==========================================
const CandidateApplicationSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    candidateId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    requirementId: { type: String, required: true, index: true },
    source: {
      type: String,
      enum: ['DIRECT_APPLICATION', 'PLATFORM_MATCH', 'COMPANY_INVITATION', 'RECRUITER_SOURCE'],
      default: 'DIRECT_APPLICATION',
      index: true,
    },
    status: {
      type: String,
      default: 'APPLIED',
      index: true,
    },
    appliedAt: { type: String, default: () => new Date().toISOString() },
    screeningStatus: { type: String, default: 'PENDING' },
    evaluationId: { type: String, index: true },
    shortlistStatus: { type: String, default: 'NOT_SHORTLISTED' },
  },
  { strict: false, timestamps: true }
);
CandidateApplicationSchema.index({ companyId: 1, requirementId: 1, candidateId: 1 }, { unique: true });

// ==========================================
// 18. EVALUATION CONFLICT SCHEMA
// ==========================================
const EvaluationConflictSchema = new Schema<any>(
  {
    id: { type: String, required: true, unique: true, index: true },
    evaluatorId: { type: String, required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    requirementId: { type: String, index: true },
    companyId: { type: String, index: true },
    conflictReason: { type: String, required: true },
    detectedAt: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false, timestamps: true }
);

// ==========================================
// 19. GOOGLE INTEGRATION SCHEMA
// ==========================================
const GoogleIntegrationSchema = new Schema<any>(
  {
    companyId: { type: String, required: true, unique: true, index: true },
    isConnected: { type: Boolean, default: false },
    calendarEmail: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: String },
    lastSyncAt: { type: String },
  },
  { strict: false, timestamps: true }
);

// Mongoose Models Export
export const UserModel: mongoose.Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);
export const CompanyModel: mongoose.Model<any> = mongoose.models.Company || mongoose.model('Company', CompanySchema);
export const CandidateModel: mongoose.Model<any> = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
export const EvaluatorModel: mongoose.Model<any> = mongoose.models.Evaluator || mongoose.model('Evaluator', EvaluatorSchema);
export const RequirementModel: mongoose.Model<any> = mongoose.models.Requirement || mongoose.model('Requirement', RequirementSchema);
export const MatchModel: mongoose.Model<any> = mongoose.models.Match || mongoose.model('Match', MatchSchema);
export const EvaluationModel: mongoose.Model<any> = mongoose.models.Evaluation || mongoose.model('Evaluation', EvaluationSchema);
export const ShortlistModel: mongoose.Model<any> = mongoose.models.Shortlist || mongoose.model('Shortlist', ShortlistSchema);
export const InterviewModel: mongoose.Model<any> = mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
export const OfferModel: mongoose.Model<any> = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
export const PlacementModel: mongoose.Model<any> = mongoose.models.Placement || mongoose.model('Placement', PlacementSchema);
export const InvoiceModel: mongoose.Model<any> = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export const PayoutModel: mongoose.Model<any> = mongoose.models.Payout || mongoose.model('Payout', PayoutSchema);
export const AuditLogModel: mongoose.Model<any> = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
export const CompanyNoteModel: mongoose.Model<any> = mongoose.models.CompanyNote || mongoose.model('CompanyNote', CompanyNoteSchema);
export const SupportTicketModel: mongoose.Model<any> = mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
export const CandidateApplicationModel: mongoose.Model<any> = mongoose.models.CandidateApplication || mongoose.model('CandidateApplication', CandidateApplicationSchema);
export const EvaluationConflictModel: mongoose.Model<any> = mongoose.models.EvaluationConflict || mongoose.model('EvaluationConflict', EvaluationConflictSchema);
export const GoogleIntegrationModel: mongoose.Model<any> = mongoose.models.GoogleIntegration || mongoose.model('GoogleIntegration', GoogleIntegrationSchema);

/**
 * Builds safe ID query supporting both custom business IDs (e.g. 'eval-1', 'evaluator-1') and MongoDB ObjectIds without throwing CastError
 */
export function buildIdQuery(id: string) {
  const ids = [id];
  if (id.startsWith('eval-')) ids.push(id.replace('eval-', 'evaluator-'));
  if (id.startsWith('evaluator-')) ids.push(id.replace('evaluator-', 'eval-'));
  if (id.startsWith('cand-')) ids.push(id.replace('cand-', 'candidate-'));
  if (id.startsWith('candidate-')) ids.push(id.replace('candidate-', 'cand-'));
  if (id.startsWith('comp-')) ids.push(id.replace('comp-', 'company-'));
  if (id.startsWith('company-')) ids.push(id.replace('company-', 'comp-'));

  if (mongoose.isValidObjectId(id)) {
    return { $or: [...ids.map(i => ({ id: i })), { _id: id }] };
  }
  return { $or: ids.map(i => ({ id: i })) };
}
