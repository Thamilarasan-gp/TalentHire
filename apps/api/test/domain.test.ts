import { describe, it, expect } from 'vitest';
import { evaluateMatch, calculateEvaluatorSuitability } from '@thamilarasan/utils';
import { Candidate, HiringRequirement, EvaluatorProfile, MatchScoringWeights } from '@thamilarasan/types';

describe('Deterministic 2-Stage Matching Engine', () => {
  const weights: MatchScoringWeights = {
    coreTechnicalSkills: 35,
    relevantExperience: 25,
    verifiedEvidence: 20,
    domainExperience: 10,
    timezoneAndCommunication: 10,
  };

  const requirement: HiringRequirement = {
    id: 'req-test-1',
    companyId: 'comp-1',
    title: 'Senior Node.js Distributed Systems',
    roleCategory: 'BACKEND',
    seniority: 'SENIOR',
    requiredSkills: [
      { name: 'Node.js', minimumYears: 4, mandatory: true },
      { name: 'PostgreSQL', minimumYears: 3, mandatory: true },
    ],
    niceToHaveSkills: ['Redis', 'Kafka'],
    minExperienceYears: 5,
    budgetMinUsd: 70000,
    budgetMaxUsd: 90000,
    timezoneRequirement: 'UTC-5',
    minTimezoneOverlapHours: 4,
    maxNoticePeriodDays: 30,
    jobDescription: 'High-throughput microservices architecture',
    state: 'MATCHING_ACTIVE',
    targetShortlistSize: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const qualifiedCandidate: Candidate = {
    id: 'cand-1',
    userId: 'user-1',
    fullName: 'Karthik Iyer',
    headline: 'Senior Backend Engineer',
    skills: [
      { name: 'Node.js', yearsOfExperience: 6, level: 'EXPERT', isVerified: true },
      { name: 'PostgreSQL', yearsOfExperience: 5, level: 'EXPERT', isVerified: true },
      { name: 'Redis', yearsOfExperience: 4, level: 'ADVANCED', isVerified: true },
    ],
    totalYearsOfExperience: 7.5,
    timezone: 'UTC+5:30',
    availableHoursStart: 12,
    availableHoursEnd: 21,
    currentSalaryInr: 2800000,
    expectedSalaryInr: 3400000,
    expectedSalaryUsd: 85000,
    noticePeriodDays: 15,
    state: 'SHORTLISTED',
    tier: 'TIER_1',
    evaluationScore: 92,
    verifiedClaims: [],
    pastCompanies: ['Razorpay', 'Swiggy'],
    education: [],
    resumeUrl: 'https://cdn.example.com/resume.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('Stage 1 Hard-Gate: Passes when all mandatory criteria are satisfied', () => {
    const match = evaluateMatch(qualifiedCandidate, requirement, weights);
    expect(match.passedHardFilters).toBe(true);
    expect(match.failedFilters).toHaveLength(0);
    expect(match.overallScore).toBeGreaterThan(80);
  });

  it('Stage 1 Hard-Gate: Fails immediately if candidate salary exceeds client budget ceiling', () => {
    const expensiveCandidate: Candidate = {
      ...qualifiedCandidate,
      expectedSalaryUsd: 110000, // exceeds 90,000 budgetMaxUsd
    };

    const match = evaluateMatch(expensiveCandidate, requirement, weights);
    expect(match.passedHardFilters).toBe(false);
    expect(match.failedFilters.some((r) => r.includes('Expected salary') || r.includes('budget'))).toBe(true);
    expect(match.overallScore).toBe(0);
  });

  it('Stage 1 Hard-Gate: Fails immediately if notice period exceeds maximum allowed', () => {
    const slowJoinerCandidate: Candidate = {
      ...qualifiedCandidate,
      noticePeriodDays: 60, // exceeds 30 days
    };

    const match = evaluateMatch(slowJoinerCandidate, requirement, weights);
    expect(match.passedHardFilters).toBe(false);
    expect(match.failedFilters.some((r) => r.includes('Notice period'))).toBe(true);
  });
});

describe('Evaluator Assignment & Conflict of Interest Guard', () => {
  const candidate: Candidate = {
    id: 'cand-1',
    userId: 'user-1',
    fullName: 'Karthik Iyer',
    headline: 'Senior Backend Engineer',
    skills: [{ name: 'Node.js', yearsOfExperience: 6, level: 'EXPERT' }],
    totalYearsOfExperience: 7.5,
    timezone: 'UTC+5:30',
    availableHoursStart: 12,
    availableHoursEnd: 21,
    currentSalaryInr: 2800000,
    expectedSalaryInr: 3400000,
    expectedSalaryUsd: 85000,
    noticePeriodDays: 15,
    state: 'SHORTLISTED',
    tier: 'TIER_1',
    evaluationScore: 92,
    verifiedClaims: [],
    pastCompanies: ['Razorpay', 'Swiggy'],
    education: [],
    resumeUrl: 'https://cdn.example.com/resume.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const requirement: HiringRequirement = {
    id: 'req-1',
    companyId: 'comp-1',
    title: 'Senior Node.js Distributed Systems',
    roleCategory: 'BACKEND',
    seniority: 'SENIOR',
    requiredSkills: [{ name: 'Node.js', minimumYears: 4, mandatory: true }],
    niceToHaveSkills: [],
    minExperienceYears: 5,
    budgetMinUsd: 70000,
    budgetMaxUsd: 90000,
    timezoneRequirement: 'UTC-5',
    minTimezoneOverlapHours: 4,
    maxNoticePeriodDays: 30,
    jobDescription: '',
    state: 'MATCHING_ACTIVE',
    targetShortlistSize: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('Conflict Detection: Rejects evaluator if they share past employers with candidate', () => {
    const conflictingEvaluator: any = {
      id: 'eval-conflict',
      userId: 'user-eval-1',
      fullName: 'Sunil Mehta',
      headline: 'Principal Engineer',
      primaryDomains: ['BACKEND'],
      skills: [{ name: 'Node.js', yearsOfExperience: 10, level: 'EXPERT' }],
      totalExperienceYears: 12,
      currentCompany: 'Google',
      pastCompanies: ['Swiggy'], // Shared past company with Karthik Iyer!
      education: [],
      status: 'ACTIVE',
      hourlyRateInr: 5000,
      maxWeeklyInterviews: 5,
      completedEvaluationsCount: 40,
      averageRating: 4.9,
      calibrationScore: 96,
      passRate: 0.65,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const suitability = calculateEvaluatorSuitability(conflictingEvaluator, requirement, candidate);
    expect(suitability.isConflict).toBe(true);
    expect(suitability.conflictReason).toContain('swiggy');
    expect(suitability.suitabilityScore).toBe(0);
  });

  it('Clean Assignment: Approves evaluator with high score when zero overlap exists', () => {
    const independentEvaluator: any = {
      id: 'eval-clean',
      userId: 'user-eval-2',
      fullName: 'Vikramaditya Sengupta',
      headline: 'Staff Backend Architect',
      primaryDomains: ['BACKEND'],
      skills: [{ name: 'Node.js', yearsOfExperience: 10, level: 'EXPERT' }],
      totalExperienceYears: 14,
      currentCompany: 'Amazon',
      pastCompanies: ['Flipkart', 'Oracle'], // No overlap with Razorpay or Swiggy
      education: [],
      status: 'ACTIVE',
      hourlyRateInr: 5000,
      maxWeeklyInterviews: 5,
      completedEvaluationsCount: 52,
      averageRating: 4.95,
      calibrationScore: 98,
      passRate: 0.62,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const suitability = calculateEvaluatorSuitability(independentEvaluator, requirement, candidate);
    expect(suitability.isConflict).toBe(false);
    expect(suitability.suitabilityScore).toBeGreaterThan(60);
  });
});
