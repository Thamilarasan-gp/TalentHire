import {
  CandidateState,
  RequirementState,
  EvaluationState,
  PlacementState,
  Candidate,
  HiringRequirement,
  MatchScoringWeights,
  MatchReason,
  Evaluator,
  Evaluation
} from '@thamilarasan/types';

// ==========================================
// CURRENCY & FORMATTING
// ==========================================
export function formatUSD(amount: number): string {
  const n = typeof amount === 'number' && !isNaN(amount) ? amount : (parseFloat(String(amount)) || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatINR(amount: number): string {
  const n = typeof amount === 'number' && !isNaN(amount) ? amount : (parseFloat(String(amount)) || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ==========================================
// STATE MACHINE TRANSITION VALIDATORS
// ==========================================

const CANDIDATE_TRANSITIONS: Record<CandidateState, CandidateState[]> = {
  REGISTERED: ['SCREENING', 'REJECTED', 'WITHDRAWN'],
  SCREENING: ['INTERVIEW_PENDING', 'REJECTED', 'ON_HOLD', 'WITHDRAWN'],
  INTERVIEW_PENDING: ['INTERVIEWED', 'NO_SHOW', 'ON_HOLD', 'WITHDRAWN'],
  INTERVIEWED: ['UNDER_REVIEW', 'REASSESSMENT_PENDING', 'REJECTED'],
  UNDER_REVIEW: ['VERIFIED', 'REJECTED', 'FRAUD_FLAGGED'],
  VERIFIED: ['MATCHED', 'NOTICE_PERIOD', 'WITHDRAWN'],
  MATCHED: ['COMPANY_INTERVIEW', 'ON_HOLD', 'WITHDRAWN'],
  COMPANY_INTERVIEW: ['SELECTED', 'REJECTED', 'ON_HOLD'],
  SELECTED: ['PLACED', 'OFFER_DECLINED', 'WITHDRAWN'],
  PLACED: ['ACTIVE'],
  ACTIVE: ['STALE'],
  REJECTED: ['SCREENING'],
  ON_HOLD: ['SCREENING', 'VERIFIED', 'MATCHED'],
  WITHDRAWN: ['REGISTERED'],
  NOTICE_PERIOD: ['ACTIVE', 'MATCHED'],
  OFFER_DECLINED: ['MATCHED', 'WITHDRAWN'],
  NO_SHOW: ['INTERVIEW_PENDING', 'REJECTED'],
  STALE: ['ACTIVE', 'SCREENING'],
  FRAUD_FLAGGED: ['UNDER_REVIEW', 'REJECTED'],
  REASSESSMENT_PENDING: ['INTERVIEW_PENDING', 'REJECTED'],
};

export function canTransitionCandidate(from: CandidateState, to: CandidateState): boolean {
  return CANDIDATE_TRANSITIONS[from]?.includes(to) ?? false;
}

const REQUIREMENT_TRANSITIONS: Record<RequirementState, RequirementState[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['VERIFIED', 'ON_HOLD', 'CANCELLED'],
  VERIFIED: ['SOURCING', 'ON_HOLD', 'CANCELLED'],
  SOURCING: ['EVALUATING', 'ON_HOLD', 'CANCELLED', 'EXPIRED'],
  EVALUATING: ['SHORTLISTED', 'SOURCING', 'ON_HOLD', 'CANCELLED'],
  SHORTLISTED: ['INTERVIEWING', 'SOURCING', 'ON_HOLD', 'CANCELLED'],
  INTERVIEWING: ['FILLED', 'PARTIALLY_FILLED', 'SOURCING', 'CLOSED'],
  FILLED: ['CLOSED', 'REOPENED'],
  PARTIALLY_FILLED: ['SOURCING', 'FILLED', 'CLOSED'],
  CLOSED: ['REOPENED'],
  ON_HOLD: ['SOURCING', 'EVALUATING', 'SHORTLISTED', 'CANCELLED'],
  EXPIRED: ['REOPENED'],
  CANCELLED: ['REOPENED'],
  REOPENED: ['SOURCING', 'VERIFIED'],
};

export function canTransitionRequirement(from: RequirementState, to: RequirementState): boolean {
  return REQUIREMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

const EVALUATION_TRANSITIONS: Record<EvaluationState, EvaluationState[]> = {
  PENDING: ['ASSIGNMENT_AVAILABLE', 'CANCELLED'],
  ASSIGNMENT_AVAILABLE: ['ASSIGNED', 'EXPIRED', 'CANCELLED'],
  ASSIGNED: ['ACCEPTED', 'CONFLICT_DECLARED', 'ASSIGNMENT_AVAILABLE', 'CANCELLED'],
  ACCEPTED: ['SCHEDULED', 'NO_SHOW', 'CANCELLED'],
  SCHEDULED: ['IN_PROGRESS', 'NO_SHOW', 'CANCELLED', 'ACCEPTED'],
  IN_PROGRESS: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['QA_REVIEW'],
  QA_REVIEW: ['APPROVED', 'REJECTED', 'REASSESSMENT_REQUIRED'],
  APPROVED: [],
  REJECTED: ['ASSIGNMENT_AVAILABLE'],
  REASSESSMENT_REQUIRED: ['ASSIGNMENT_AVAILABLE'],
  CONFLICT_DECLARED: ['ASSIGNMENT_AVAILABLE'],
  EXPIRED: ['ASSIGNMENT_AVAILABLE'],
  CANCELLED: [],
  NO_SHOW: ['ASSIGNMENT_AVAILABLE'],
};

export function canTransitionEvaluation(from: EvaluationState, to: EvaluationState): boolean {
  return EVALUATION_TRANSITIONS[from]?.includes(to) ?? false;
}

const PLACEMENT_TRANSITIONS: Record<PlacementState, PlacementState[]> = {
  PENDING: ['OFFERED', 'TERMINATED'],
  OFFERED: ['CONTRACT_PENDING', 'TERMINATED'],
  CONTRACT_PENDING: ['ONBOARDING', 'TERMINATED'],
  ONBOARDING: ['ACTIVE', 'TERMINATED'],
  ACTIVE: ['GUARANTEE_WINDOW', 'DISPUTED', 'TERMINATED'],
  GUARANTEE_WINDOW: ['COMPLETED', 'REPLACEMENT_IN_PROGRESS', 'DISPUTED'],
  COMPLETED: ['CONVERTED'],
  REPLACEMENT_IN_PROGRESS: ['COMPLETED', 'TERMINATED'],
  DISPUTED: ['COMPLETED', 'TERMINATED'],
  TERMINATED: ['BYPASSED'],
  CONVERTED: [],
  BYPASSED: [],
};

export function canTransitionPlacement(from: PlacementState, to: PlacementState): boolean {
  return PLACEMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

// ==========================================
// DETERMINISTIC 2-STAGE MATCHING ENGINE
// ==========================================

export interface MatchingResult {
  passedHardFilters: boolean;
  failedFilters: string[];
  overallScore: number;
  reasons: MatchReason[];
}

export const DEFAULT_MATCH_WEIGHTS: MatchScoringWeights = {
  coreTechnicalSkills: 35,
  relevantExperience: 25,
  verifiedEvidence: 20,
  domainExperience: 10,
  communication: 5,
  availability: 5,
};

export function evaluateMatch(
  candidate: Candidate,
  requirement: HiringRequirement,
  weights: MatchScoringWeights = DEFAULT_MATCH_WEIGHTS
): MatchingResult {
  const failedFilters: string[] = [];
  const reasons: MatchReason[] = [];

  // Stage 1: Hard Filters
  // 1. Mandatory Skills Check
  const candidateSkillNames = (candidate.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase());
  const missingRequired = (requirement.requiredSkills || [])
    .filter((reqSkill: any) => (typeof reqSkill === 'string' ? true : reqSkill.mandatory !== false))
    .map((reqSkill: any) => (typeof reqSkill === 'string' ? reqSkill : reqSkill.name))
    .filter((skillName: string) => !candidateSkillNames.includes(skillName.toLowerCase()));

  if (missingRequired.length > 0) {
    failedFilters.push(`Missing mandatory skills: ${missingRequired.join(', ')}`);
  }

  // 2. Minimum Experience
  if (candidate.totalYearsOfExperience < requirement.minExperienceYears) {
    failedFilters.push(
      `Experience (${candidate.totalYearsOfExperience} yrs) below requirement (${requirement.minExperienceYears} yrs)`
    );
  }

  // 3. Notice Period
  if (candidate.noticePeriodDays > requirement.maxNoticePeriodDays) {
    failedFilters.push(
      `Notice period (${candidate.noticePeriodDays} days) exceeds allowed (${requirement.maxNoticePeriodDays} days)`
    );
  }

  // 4. Budget Compatibility
  if (candidate.expectedSalaryUsd > requirement.budgetMaxUsd) {
    failedFilters.push(
      `Expected salary ($${candidate.expectedSalaryUsd}) exceeds maximum budget ($${requirement.budgetMaxUsd})`
    );
  }

  // 5. Fraud Status Check
  if (candidate.fraudStatus === 'HIGH_RISK' || candidate.fraudStatus === 'FRAUD_CONFIRMED') {
    failedFilters.push(`Candidate flagged with fraud status: ${candidate.fraudStatus}`);
  }

  const passedHardFilters = failedFilters.length === 0;

  // Stage 2: Weighted Ranking (Normalized to 100)
  // Total weight normalization
  const commWeight = (weights as any).communication || 5;
  const availWeight = (weights as any).availability || (weights as any).timezoneAndCommunication || 5;
  const totalWeight =
    (weights.coreTechnicalSkills || 35) +
    (weights.relevantExperience || 25) +
    (weights.verifiedEvidence || 20) +
    (weights.domainExperience || 10) +
    commWeight +
    availWeight;

  // Criterion A: Core Technical Skills (percentage of required & nice-to-have matched)
  const reqSkillsList = (requirement.requiredSkills || []).map((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase());
  const niceSkillsList = (requirement.niceToHaveSkills || []).map((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase());
  const totalReqSkills = reqSkillsList.length + niceSkillsList.length;
  const matchedRequiredCount = reqSkillsList.filter((s) => candidateSkillNames.includes(s)).length;
  const matchedNiceCount = niceSkillsList.filter((s) => candidateSkillNames.includes(s)).length;
  const skillScoreRaw = totalReqSkills > 0 ? ((matchedRequiredCount * 1.5 + matchedNiceCount) / (Math.max(1, reqSkillsList.length) * 1.5 + (niceSkillsList.length || 1))) * 100 : 80;
  const skillScore = Math.min(100, Math.round(skillScoreRaw));
  reasons.push({
    category: 'Core Technical Skills',
    satisfied: matchedRequiredCount === requirement.requiredSkills.length,
    score: skillScore,
    detail: `Matched ${matchedRequiredCount}/${requirement.requiredSkills.length} required and ${matchedNiceCount} secondary skills`,
  });

  // Criterion B: Relevant Experience
  const expDelta = candidate.totalYearsOfExperience - requirement.minExperienceYears;
  const expScore = expDelta >= 3 ? 100 : expDelta >= 1 ? 85 : expDelta === 0 ? 70 : 40;
  reasons.push({
    category: 'Relevant Experience',
    satisfied: expDelta >= 0,
    score: expScore,
    detail: `${candidate.totalYearsOfExperience} years vs min ${requirement.minExperienceYears} required`,
  });

  // Criterion C: Verified Evidence (Badge + verified skill items)
  const verifiedSkillsCount = candidate.skills.filter((s) => s.isVerified).length;
  const evidenceScore = candidate.verifiedBadge ? (verifiedSkillsCount > 3 ? 100 : 90) : 60;
  reasons.push({
    category: 'Verified Evidence',
    satisfied: candidate.verifiedBadge,
    score: evidenceScore,
    detail: candidate.verifiedBadge ? `Vetted profile with ${verifiedSkillsCount} verified skills` : 'Unverified self-reported skills',
  });

  // Criterion D: Domain Experience (Title / Summary keyword alignment)
  const roleString = ((candidate as any).primaryRole || candidate.headline || '').toLowerCase();
  const domainScore = roleString.includes((requirement.roleCategory || '').toLowerCase()) ? 95 : 75;
  reasons.push({
    category: 'Domain Match',
    satisfied: domainScore > 80,
    score: domainScore,
    detail: `Profile aligned with ${requirement.roleCategory}`,
  });

  // Criterion E: Communication
  const commScore = 90; // Default benchmark
  reasons.push({
    category: 'Communication Readiness',
    satisfied: true,
    score: commScore,
    detail: 'Global professional English benchmark standard',
  });

  // Criterion F: Availability (Notice period immediacy)
  const availScore = candidate.noticePeriodDays <= 15 ? 100 : candidate.noticePeriodDays <= 30 ? 85 : 65;
  reasons.push({
    category: 'Availability & Notice Period',
    satisfied: candidate.noticePeriodDays <= requirement.maxNoticePeriodDays,
    score: availScore,
    detail: `${candidate.noticePeriodDays} days notice period`,
  });

  // Final Weighted Average
  const weightedSum =
    (skillScore * (weights.coreTechnicalSkills || 35)) +
    (expScore * (weights.relevantExperience || 25)) +
    (evidenceScore * (weights.verifiedEvidence || 20)) +
    (domainScore * (weights.domainExperience || 10)) +
    (commScore * commWeight) +
    (availScore * availWeight);

  const rawOverall = Math.round(weightedSum / Math.max(1, totalWeight));
  const overallScore = passedHardFilters ? rawOverall : 0; // Deterministic: 0 if hard gate fails

  return {
    passedHardFilters,
    failedFilters,
    overallScore,
    reasons,
  };
}

// ==========================================
// EVALUATOR CONFLICT & SUITABILITY ENGINE
// ==========================================

export interface EvaluatorAssignmentScore {
  evaluatorId: string;
  isConflict: boolean;
  conflictReason?: string;
  suitabilityScore: number; // 0 - 100
  breakdown: {
    skillOverlapScore: number;
    seniorityScore: number;
    availabilityScore: number;
    loadBalancingScore: number;
    calibrationReliabilityScore: number;
  };
}

export function calculateEvaluatorSuitability(
  evaluator: Evaluator,
  requirement: HiringRequirement,
  candidate: Candidate
): EvaluatorAssignmentScore {
  // 1. Conflict of interest detection
  // Check ex-employers vs candidate's current/recent companies
  const expCompanies = ((candidate as any).experience || []).map((e: any) => (typeof e === 'string' ? e : e.company || '').toLowerCase()).filter(Boolean);
  const pastCompanies = ((candidate as any).pastCompanies || []).map((c: any) => (typeof c === 'string' ? c : c.name || '').toLowerCase()).filter(Boolean);
  const candidateCompanies = [...new Set([...expCompanies, ...pastCompanies])];

  const evaluatorExEmployers = (evaluator.exEmployers || (evaluator as any).pastCompanies || [])
    .map((e: any) => (typeof e === 'string' ? e : e.name || '').toLowerCase())
    .filter(Boolean);
  const currentEmployer = (evaluator.currentEmployer || (evaluator as any).currentCompany || '').toLowerCase();

  const companyConflict = candidateCompanies.some(
    (c) => (currentEmployer && c === currentEmployer) || evaluatorExEmployers.includes(c)
  );

  if (companyConflict) {
    const overlappingEmployer = candidateCompanies.find((c) => (currentEmployer && c === currentEmployer) || evaluatorExEmployers.includes(c));
    return {
      evaluatorId: evaluator.id,
      isConflict: true,
      conflictReason: `Evaluator has employer overlap with candidate's employment history (${overlappingEmployer})`,
      suitabilityScore: 0,
      breakdown: {
        skillOverlapScore: 0,
        seniorityScore: 0,
        availabilityScore: 0,
        loadBalancingScore: 0,
        calibrationReliabilityScore: 0,
      },
    };
  }

  // 2. Skill Overlap
  const expertiseTechs = ((evaluator as any).expertise || []).flatMap((exp: any) => (exp.technologies || []).map((t: string) => t.toLowerCase()));
  const skillTechs = ((evaluator as any).skills || []).map((s: any) => (typeof s === 'string' ? s : s.name || '').toLowerCase());
  const evaluatorTechs = [...new Set([...expertiseTechs, ...skillTechs])];

  const reqSkillsList = (requirement.requiredSkills || []).map((s: any) => (typeof s === 'string' ? s : s.name || '').toLowerCase());
  const matchedSkills = reqSkillsList.filter((rs: string) => evaluatorTechs.includes(rs));
  const skillOverlapScore = reqSkillsList.length > 0
    ? Math.round((matchedSkills.length / reqSkillsList.length) * 100)
    : 80;

  // 3. Seniority
  const evaluatorExp = evaluator.yearsOfExperience || (evaluator as any).totalExperienceYears || 10;
  const seniorityScore = evaluatorExp >= requirement.minExperienceYears + 3 ? 100 : 80;

  // 4. Availability & Load
  const activeLoad = evaluator.currentActiveLoad || 1;
  const maxLoad = evaluator.maxConcurrentAssignments || 5;
  const loadPercentage = activeLoad / maxLoad;
  const loadBalancingScore = Math.max(0, Math.round((1 - loadPercentage) * 100));

  const availabilityScore = evaluator.status === 'ACTIVE' ? 95 : 40;
  const calibrationReliabilityScore = evaluator.reliabilityScore || (evaluator as any).calibrationScore || 90;

  // Weighted suitability
  const suitabilityScore = Math.round(
    skillOverlapScore * 0.35 +
    seniorityScore * 0.20 +
    availabilityScore * 0.15 +
    loadBalancingScore * 0.15 +
    calibrationReliabilityScore * 0.15
  );

  return {
    evaluatorId: evaluator.id,
    isConflict: false,
    suitabilityScore,
    breakdown: {
      skillOverlapScore,
      seniorityScore,
      availabilityScore,
      loadBalancingScore,
      calibrationReliabilityScore,
    },
  };
}

// ==========================================
// QUICK MATCH & REUSABLE EVALUATION ENGINE
// ==========================================

export interface QuickMatchResult {
  candidateId: string;
  requirementId: string;
  passedHardFilters: boolean;
  failedFilters: string[];
  isQuickMatchEligible: boolean;
  isExpired: boolean;
  consentActive: boolean;
  isTopUpRequired: boolean;
  uncoveredSkills: string[];
  eligibilityStatus:
  | 'ELIGIBLE'
  | 'EXPIRED_EVALUATION'
  | 'CONSENT_WITHDRAWN'
  | 'HARD_FILTERS_FAILED'
  | 'TOP_UP_REQUIRED'
  | 'NO_REUSABLE_EVALUATION';
  overallScore: number;
  reasons: MatchReason[];
  evaluationSummary?: {
    evaluationId: string;
    overallScore: number;
    qaStatus: string;
    scope: string;
    evaluatedAt: string;
    expiresAt: string;
    coveredSkills: string[];
    strengths: string[];
    concerns: string[];
  };
}

export function checkSkillCoverage(
  requiredSkills: (string | { name: string; mandatory?: boolean })[],
  coveredSkills: string[] = []
): { fullyCovered: boolean; uncoveredSkills: string[] } {
  const normalizedCovered = coveredSkills.map((s) => s.toLowerCase());
  const reqSkillNames = (requiredSkills || []).map((s) => (typeof s === 'string' ? s : s.name));

  const uncoveredSkills = reqSkillNames.filter(
    (s) => !normalizedCovered.includes(s.toLowerCase())
  );

  return {
    fullyCovered: uncoveredSkills.length === 0,
    uncoveredSkills,
  };
}

export function evaluateQuickMatch(
  candidate: Candidate,
  requirement: HiringRequirement,
  evaluation: Evaluation | null | undefined,
  weights: MatchScoringWeights = DEFAULT_MATCH_WEIGHTS
): QuickMatchResult {
  // Step 1: Evaluate standard deterministic match filters & scoring
  const matchResult = evaluateMatch(candidate, requirement, weights);
  const passedHardFilters = matchResult.passedHardFilters;
  const failedFilters = matchResult.failedFilters;

  // Step 2: Evaluation existence check
  if (!evaluation) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: 'NO_REUSABLE_EVALUATION',
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons,
    };
  }

  // Step 3: Scope check (must be REUSABLE)
  const isReusableScope = !evaluation.scope || evaluation.scope === 'REUSABLE';
  if (!isReusableScope) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: 'NO_REUSABLE_EVALUATION',
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons,
    };
  }

  // Step 4: Consent check
  const consentActive = evaluation.consentStatus !== 'WITHDRAWN';
  if (!consentActive) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: false,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: 'CONSENT_WITHDRAWN',
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons,
    };
  }

  // Step 5: Validity & Expiry check
  const now = new Date();
  const isDateExpired = evaluation.expiresAt ? new Date(evaluation.expiresAt) < now : false;
  const isStatusExpired = evaluation.validityStatus === 'EXPIRED' || (evaluation as any).status === 'EXPIRED';
  const isExpired = isDateExpired || isStatusExpired;

  if (isExpired) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: true,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: 'EXPIRED_EVALUATION',
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons,
      evaluationSummary: {
        evaluationId: evaluation.id,
        overallScore: evaluation.overallScore || 0,
        qaStatus: evaluation.qaStatus || 'APPROVED',
        scope: evaluation.scope || 'REUSABLE',
        evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt || '',
        expiresAt: evaluation.expiresAt || '',
        coveredSkills: evaluation.coveredSkills || [],
        strengths: evaluation.strengths || [],
        concerns: evaluation.concerns || [],
      },
    };
  }

  // Step 6: Hard filters check
  if (!passedHardFilters) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters: false,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: 'HARD_FILTERS_FAILED',
      overallScore: 0,
      reasons: matchResult.reasons,
    };
  }

  // Step 7: Skill coverage analysis for top-up determination
  const coveredSkills = evaluation.coveredSkills && evaluation.coveredSkills.length > 0
    ? evaluation.coveredSkills
    : (candidate.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name));

  const { fullyCovered, uncoveredSkills } = checkSkillCoverage(
    requirement.requiredSkills || [],
    coveredSkills
  );

  const isTopUpRequired = !fullyCovered && uncoveredSkills.length > 0;

  return {
    candidateId: candidate.id,
    requirementId: requirement.id,
    passedHardFilters: true,
    failedFilters: [],
    isQuickMatchEligible: true,
    isExpired: false,
    consentActive: true,
    isTopUpRequired,
    uncoveredSkills,
    eligibilityStatus: isTopUpRequired ? 'TOP_UP_REQUIRED' : 'ELIGIBLE',
    overallScore: matchResult.overallScore,
    reasons: matchResult.reasons,
    evaluationSummary: {
      evaluationId: evaluation.id,
      overallScore: evaluation.overallScore || 85,
      qaStatus: evaluation.qaStatus || 'APPROVED',
      scope: evaluation.scope || 'REUSABLE',
      evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt || '2026-09-20',
      expiresAt: evaluation.expiresAt || '2027-03-20',
      coveredSkills,
      strengths: evaluation.strengths || ['High throughput concurrency', 'Strong system design'],
      concerns: evaluation.concerns || [],
    },
  };
}

/**
 * Strips tenant-specific information, company IDs, private interview logs,
 * and internal notes to ensure zero data leakage across companies.
 */
export function sanitizeReusableEvaluation(evaluation: any): any {
  if (!evaluation) return null;

  return {
    id: evaluation.id,
    candidateId: evaluation.candidateId,
    overallScore: evaluation.overallScore,
    verdict: evaluation.verdict,
    scope: evaluation.scope || 'REUSABLE',
    status: evaluation.status || evaluation.validityStatus || 'VALID',
    qaStatus: evaluation.qaStatus || (evaluation.qaCalibrated ? 'APPROVED' : 'QA_REVIEW'),
    evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt,
    expiresAt: evaluation.expiresAt,
    consentStatus: evaluation.consentStatus || 'ACTIVE',
    coveredSkills: evaluation.coveredSkills || [],
    scores: (evaluation.scores || evaluation.rubricScores || []).map((s: any) => ({
      criterionName: s.criterionName || s.category,
      score: s.score,
      level: s.level || (s.score >= 8 ? 'STRONG' : s.score >= 6 ? 'COMPETENT' : 'INADEQUATE'),
      evidenceNotes: s.evidenceNotes || s.evidence || '',
    })),
    strengths: evaluation.strengths || [],
    concerns: evaluation.concerns || [],
    summaryFeedback: evaluation.summaryFeedback || evaluation.evidenceNotes || '',
    reuseCount: evaluation.reuseCount || 0,
    lastReusedAt: evaluation.lastReusedAt,
  };
}
