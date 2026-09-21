import { z } from 'zod';

// ==========================================
// AUTH SCHEMAS
// ==========================================
export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum([
    'JOB_SEEKER',
    'EVALUATOR',
    'COMPANY_ADMIN',
    'COMPANY_RECRUITER',
    'COMPANY_HIRING_MANAGER',
  ]),
  companyName: z.string().optional(),
});

// ==========================================
// REQUIREMENT SCHEMAS
// ==========================================
export const createRequirementSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters'),
  roleCategory: z.string().min(2, 'Role category is required'),
  openingsCount: z.number().int().positive('Must have at least 1 opening'),
  requiredSkills: z.array(z.string()).min(1, 'Specify at least 1 required skill'),
  niceToHaveSkills: z.array(z.string()).default([]),
  minExperienceYears: z.number().min(0, 'Minimum experience cannot be negative'),
  maxExperienceYears: z.number().optional(),
  budgetMinUsd: z.number().positive('Minimum budget must be positive'),
  budgetMaxUsd: z.number().positive('Maximum budget must be positive'),
  engagementType: z.enum(['FULL_TIME', 'CONTRACT']).default('FULL_TIME'),
  timezoneRequirement: z.string().default('Min 4 hours overlap with EST/GMT'),
  maxNoticePeriodDays: z.number().int().min(0).default(60),
  jobDescription: z.string().min(20, 'Provide a detailed job description'),
});

// ==========================================
// EVALUATION SCORECARD SCHEMAS
// ==========================================
export const evaluationScoreItemSchema = z.object({
  criterionId: z.string(),
  criterionName: z.string(),
  score: z.number().min(1).max(10),
  evidenceNotes: z.string().min(10, 'Specific evidence observations are required for each criterion'),
  level: z.enum(['INADEQUATE', 'COMPETENT', 'STRONG', 'EXPERT']),
});

export const submitEvaluationSchema = z.object({
  scores: z.array(evaluationScoreItemSchema).min(1, 'At least one criterion score is required'),
  verdict: z.enum(['PASS', 'FAIL', 'REVIEW_REQUIRED']),
  strengths: z.array(z.string()).min(1, 'Provide at least one observed strength'),
  concerns: z.array(z.string()).default([]),
  summaryFeedback: z.string().min(25, 'Provide a structured summary evaluation note for QA review'),
  durationMinutes: z.number().min(15).max(180).default(60),
  conflictDeclared: z.boolean().default(false),
  conflictDetails: z.string().optional(),
});

// ==========================================
// CANDIDATE PROFILE SCHEMAS
// ==========================================
export const candidateProfileSchema = z.object({
  fullName: z.string().min(2),
  headline: z.string().min(5),
  location: z.string().min(2),
  timezone: z.string().default('IST (UTC+5:30)'),
  primaryRole: z.string().min(2),
  totalYearsOfExperience: z.number().min(0),
  expectedSalaryUsd: z.number().positive(),
  noticePeriodDays: z.number().min(0),
  summary: z.string().min(20),
  skills: z.array(
    z.object({
      name: z.string(),
      yearsOfExperience: z.number().min(0),
      level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    })
  ),
});

// ==========================================
// COMPANY INTERVIEW SCHEDULING
// ==========================================
export const scheduleInterviewSchema = z.object({
  requirementId: z.string(),
  candidateId: z.string(),
  scheduledAt: z.string(),
  durationMinutes: z.number().min(15).max(120).default(45),
  interviewType: z.enum(['COMPANY_ROUND_1', 'COMPANY_ROUND_2', 'COMPANY_EXECUTIVE']),
  interviewerNames: z.array(z.string()).min(1, 'Specify interviewer name'),
  meetingLink: z.string().url().default('https://meet.thamilarasanglobal.com/room/tg-session'),
});

// ==========================================
// OFFER SCHEMA
// ==========================================
export const createOfferSchema = z.object({
  requirementId: z.string(),
  candidateId: z.string(),
  annualSalaryUsd: z.number().positive('Annual salary is required'),
  bonusUsd: z.number().optional(),
  equityTerms: z.string().optional(),
  startDate: z.string(),
  expiresAt: z.string(),
});
