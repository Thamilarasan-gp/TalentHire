import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRole } from '@thamilarasan/types';

const JWT_SECRET = process.env.JWT_SECRET || 'thamilarasan-global-secure-key-2026-jwt-token';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'thamilarasan-global-refresh-key-2026-token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  companyId?: string;
  candidateId?: string;
  evaluatorId?: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ==========================================
// RBAC PERMISSIONS MATRIX
// ==========================================
export type Permission =
  | 'VIEW_ADMIN_DASHBOARD'
  | 'MANAGE_COMPANIES'
  | 'MANAGE_CANDIDATES'
  | 'MANAGE_EVALUATORS'
  | 'MANAGE_REQUIREMENTS'
  | 'TRIGGER_MATCHING'
  | 'ASSIGN_EVALUATOR'
  | 'REVIEW_QA'
  | 'BUILD_SHORTLIST'
  | 'MANAGE_FINANCE'
  | 'APPROVE_PAYOUTS'
  | 'VIEW_AUDIT_LOGS'
  | 'CREATE_REQUIREMENT'
  | 'VIEW_COMPANY_SHORTLIST'
  | 'SCHEDULE_COMPANY_INTERVIEW'
  | 'EXTEND_OFFER'
  | 'VIEW_COMPANY_INVOICES'
  | 'SUBMIT_EVALUATION'
  | 'VIEW_EVALUATOR_EARNINGS'
  | 'APPLY_JOB'
  | 'VIEW_CANDIDATE_OFFERS';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  PLATFORM_ADMIN: [
    'VIEW_ADMIN_DASHBOARD',
    'MANAGE_COMPANIES',
    'MANAGE_CANDIDATES',
    'MANAGE_EVALUATORS',
    'MANAGE_REQUIREMENTS',
    'TRIGGER_MATCHING',
    'ASSIGN_EVALUATOR',
    'REVIEW_QA',
    'BUILD_SHORTLIST',
    'MANAGE_FINANCE',
    'APPROVE_PAYOUTS',
    'VIEW_AUDIT_LOGS',
  ],
  PLATFORM_OPERATIONS: [
    'VIEW_ADMIN_DASHBOARD',
    'MANAGE_COMPANIES',
    'MANAGE_CANDIDATES',
    'MANAGE_EVALUATORS',
    'TRIGGER_MATCHING',
    'ASSIGN_EVALUATOR',
    'REVIEW_QA',
    'BUILD_SHORTLIST',
  ],
  QA_REVIEWER: [
    'VIEW_ADMIN_DASHBOARD',
    'REVIEW_QA',
    'VIEW_AUDIT_LOGS',
  ],
  FINANCE_APPROVER: [
    'VIEW_ADMIN_DASHBOARD',
    'MANAGE_FINANCE',
    'APPROVE_PAYOUTS',
  ],
  COMPLIANCE: [
    'VIEW_ADMIN_DASHBOARD',
    'VIEW_AUDIT_LOGS',
  ],
  READ_ONLY_AUDITOR: [
    'VIEW_ADMIN_DASHBOARD',
    'VIEW_AUDIT_LOGS',
  ],
  SUPPORT: [
    'VIEW_ADMIN_DASHBOARD',
    'MANAGE_COMPANIES',
    'MANAGE_CANDIDATES',
  ],
  COMPANY_ADMIN: [
    'CREATE_REQUIREMENT',
    'VIEW_COMPANY_SHORTLIST',
    'SCHEDULE_COMPANY_INTERVIEW',
    'EXTEND_OFFER',
    'VIEW_COMPANY_INVOICES',
  ],
  COMPANY_RECRUITER: [
    'CREATE_REQUIREMENT',
    'VIEW_COMPANY_SHORTLIST',
    'SCHEDULE_COMPANY_INTERVIEW',
    'EXTEND_OFFER',
  ],
  COMPANY_HIRING_MANAGER: [
    'VIEW_COMPANY_SHORTLIST',
    'SCHEDULE_COMPANY_INTERVIEW',
  ],
  EVALUATOR: [
    'SUBMIT_EVALUATION',
    'VIEW_EVALUATOR_EARNINGS',
  ],
  JOB_SEEKER: [
    'APPLY_JOB',
    'VIEW_CANDIDATE_OFFERS',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
