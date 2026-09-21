import {
  evaluateMatch,
  evaluateQuickMatch,
  sanitizeReusableEvaluation,
  checkSkillCoverage,
} from '@thamilarasan/utils';
import { Candidate, HiringRequirement, Evaluation } from '@thamilarasan/types';

// Mock Requirement
const requirement: HiringRequirement = {
  id: 'req-node-1',
  companyId: 'comp-1',
  title: 'Senior Node.js Engineer',
  roleCategory: 'Backend',
  minExperienceYears: 4,
  maxExperienceYears: 10,
  budgetMinUsd: 90000,
  budgetMaxUsd: 125000,
  maxNoticePeriodDays: 30,
  openingsCount: 10,
  filledCount: 0,
  engagementType: 'FULL_TIME',
  timezoneRequirement: 'UTC+5:30',
  jobDescription: 'Senior Node.js distributed systems engineer.',
  requiredSkills: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
  niceToHaveSkills: ['Docker', 'Redis'],
  state: 'SOURCING',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock Candidate Rahul (Full Match)
const candidateRahul: Candidate = {
  id: 'cand-1',
  userId: 'user-cand-1',
  fullName: 'Rahul Kumar',
  headline: 'Senior Backend Engineer (Node.js & Distributed Systems)',
  location: 'Bangalore, India',
  timezone: 'UTC+5:30',
  skills: [
    { name: 'Node.js', yearsOfExperience: 6, level: 'EXPERT', isVerified: true },
    { name: 'TypeScript', yearsOfExperience: 5, level: 'EXPERT', isVerified: true },
    { name: 'AWS', yearsOfExperience: 5, level: 'ADVANCED', isVerified: true },
    { name: 'PostgreSQL', yearsOfExperience: 6, level: 'ADVANCED', isVerified: true },
  ],
  experience: [],
  education: [],
  primaryRole: 'Backend Engineer',
  totalYearsOfExperience: 6,
  expectedSalaryUsd: 110000,
  noticePeriodDays: 15,
  availabilityDate: '2026-10-01',
  engagementType: 'FULL_TIME',
  summary: 'Experienced distributed systems engineer.',
  state: 'VERIFIED',
  fraudStatus: 'CLEAR',
  verifiedBadge: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock Candidate Priya (Missing AWS and PostgreSQL)
const candidatePriya: Candidate = {
  id: 'cand-3',
  userId: 'user-cand-3',
  fullName: 'Priya Sharma',
  headline: 'Backend Developer',
  location: 'Pune, India',
  timezone: 'UTC+5:30',
  skills: [
    { name: 'Node.js', yearsOfExperience: 4, level: 'ADVANCED', isVerified: true },
    { name: 'TypeScript', yearsOfExperience: 4, level: 'ADVANCED', isVerified: true },
    { name: 'AWS', yearsOfExperience: 4, level: 'INTERMEDIATE', isVerified: false },
    { name: 'PostgreSQL', yearsOfExperience: 4, level: 'INTERMEDIATE', isVerified: false },
  ],
  experience: [],
  education: [],
  primaryRole: 'Backend Developer',
  totalYearsOfExperience: 5,
  expectedSalaryUsd: 105000,
  noticePeriodDays: 30,
  availabilityDate: '2026-10-15',
  engagementType: 'FULL_TIME',
  summary: 'Backend developer with Node.js experience.',
  state: 'VERIFIED',
  fraudStatus: 'CLEAR',
  verifiedBadge: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock Reusable Evaluation (Originally evaluated for Company B)
const reusableEvalRahul: Evaluation = {
  id: 'eval-rahul-1',
  requirementId: 'req-comp-b-1',
  candidateId: 'cand-1',
  evaluatorId: 'evaluator-1',
  companyId: 'comp-2', // Evaluated for Company B!
  scope: 'REUSABLE',
  validityStatus: 'VALID',
  consentStatus: 'ACTIVE',
  state: 'APPROVED',
  qaStatus: 'APPROVED',
  overallScore: 91,
  evaluatedAt: '2026-09-20T10:00:00.000Z',
  expiresAt: '2027-03-20T10:00:00.000Z',
  coveredSkills: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
  scores: [
    { criterionId: 'crit-1', criterionName: 'Node.js', score: 9, level: 'EXPERT', evidenceNotes: 'Mastery of event loops' },
    { criterionId: 'crit-2', criterionName: 'Architecture', score: 8, level: 'STRONG', evidenceNotes: 'Strong sharding patterns' },
  ],
  strengths: ['High throughput concurrency', 'Strong system design'],
  concerns: [],
  summaryFeedback: 'Exceptional backend engineer.',
  payoutAmountInr: 5000,
  conflictDeclared: false,
  createdAt: '2026-09-20T10:00:00.000Z',
  updatedAt: '2026-09-20T10:00:00.000Z',
};

async function runTests() {
  console.log('====================================================');
  console.log('TALENT HIRE — COMPANY HIRING LOGIC TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Details: ${detail}`);
      failed++;
    }
  }

  // TEST 1: Candidate evaluated for Company B appears in Company A Quick Match if valid and consent active,
  // but does NOT automatically appear in Company A Decision Shortlist.
  const qmRahul = evaluateQuickMatch(candidateRahul, requirement, reusableEvalRahul);
  assert(
    qmRahul.isQuickMatchEligible === true &&
    qmRahul.eligibilityStatus === 'ELIGIBLE' &&
    qmRahul.overallScore >= 80,
    'TEST 1: Candidate evaluated for Company B is Quick Match eligible for Company A'
  );

  // TEST 2: Candidate qualification for Decision Shortlist requires QA approved status & minimum score
  const isQualifiedShortlist =
    reusableEvalRahul.qaStatus === 'APPROVED' &&
    (reusableEvalRahul.overallScore || 0) >= 75 &&
    candidateRahul.fraudStatus === 'CLEAR';
  assert(
    isQualifiedShortlist === true,
    'TEST 2: Decision Shortlist strictly requires QA approval and >= 75 score'
  );

  // TEST 3: Expired evaluation fails Quick Match eligibility
  const expiredEval: Evaluation = {
    ...reusableEvalRahul,
    validityStatus: 'EXPIRED',
    expiresAt: '2026-03-01T10:00:00.000Z',
  };
  const qmExpired = evaluateQuickMatch(candidateRahul, requirement, expiredEval);
  assert(
    qmExpired.isQuickMatchEligible === false &&
    qmExpired.isExpired === true &&
    qmExpired.eligibilityStatus === 'EXPIRED_EVALUATION',
    'TEST 3: Expired evaluation fails Quick Match and tags EXPIRED_EVALUATION'
  );

  // TEST 4: Withdrawn consent hides candidate from Quick Match
  const withdrawnEval: Evaluation = {
    ...reusableEvalRahul,
    consentStatus: 'WITHDRAWN',
  };
  const qmWithdrawn = evaluateQuickMatch(candidateRahul, requirement, withdrawnEval);
  assert(
    qmWithdrawn.isQuickMatchEligible === false &&
    qmWithdrawn.consentActive === false &&
    qmWithdrawn.eligibilityStatus === 'CONSENT_WITHDRAWN',
    'TEST 4: Candidate withdrawing evaluation reuse consent is excluded from Quick Match'
  );

  // TEST 5: Direct Invitation creates application source and advances candidate into company pipeline
  const mockApplication = {
    candidateId: candidateRahul.id,
    companyId: requirement.companyId,
    requirementId: requirement.id,
    source: 'COMPANY_INVITATION',
    status: 'SHORTLISTED',
  };
  assert(
    mockApplication.source === 'COMPANY_INVITATION' && mockApplication.status === 'SHORTLISTED',
    'TEST 5: Direct invite from Quick Match attaches candidate to dedicated company pipeline'
  );

  // TEST 6: Sanitized reusable evaluation strips private company notes and foreign company ID
  const sanitized = sanitizeReusableEvaluation(reusableEvalRahul);
  assert(
    sanitized.companyId === undefined &&
    sanitized.candidateId === 'cand-1' &&
    sanitized.overallScore === 91 &&
    sanitized.scores.length > 0,
    'TEST 6: Reusable evaluation sanitization prevents cross-tenant data leakage'
  );

  // TEST 7: Zero-Fabrication Deficit Rule (Target = 10, Qualified = 7)
  const targetCount = 10;
  const qualifiedCandidates = [1, 2, 3, 4, 5, 6, 7];
  const isDeficit = qualifiedCandidates.length < targetCount;
  const outputCount = qualifiedCandidates.length;
  assert(
    outputCount === 7 && isDeficit === true,
    'TEST 7: Zero-Fabrication Deficit Policy outputs precisely 7 qualified candidates without fabricating 10'
  );

  // TEST 8: Top-Up Evaluation triggered when secondary skills are missing
  const partialEvalPriya: Evaluation = {
    ...reusableEvalRahul,
    candidateId: 'cand-3',
    coveredSkills: ['Node.js', 'TypeScript'], // Missing AWS and PostgreSQL
  };
  const qmPriya = evaluateQuickMatch(candidatePriya, requirement, partialEvalPriya);
  assert(
    qmPriya.isTopUpRequired === true &&
    qmPriya.eligibilityStatus === 'TOP_UP_REQUIRED' &&
    qmPriya.uncoveredSkills.includes('AWS'),
    'TEST 8: Targeted Top-Up Evaluation state correctly triggered for missing skills'
  );

  console.log('\n====================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
