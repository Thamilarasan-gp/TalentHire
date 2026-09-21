import { generateSeedData } from '../seed/data';
import {
  User,
  Company,
  Candidate,
  Evaluator,
  HiringRequirement,
  Match,
  Evaluation,
  Shortlist,
  Interview,
  Offer,
  Placement,
  Invoice,
  EvaluatorPayout,
  AuditLog,
  Notification,
} from '@thamilarasan/types';

class DataStore {
  users: User[] = [];
  companies: Company[] = [];
  candidates: Candidate[] = [];
  evaluators: Evaluator[] = [];
  requirements: HiringRequirement[] = [];
  matches: Match[] = [];
  evaluations: Evaluation[] = [];
  shortlists: Shortlist[] = [];
  interviews: Interview[] = [];
  offers: Offer[] = [];
  placements: Placement[] = [];
  invoices: Invoice[] = [];
  payouts: EvaluatorPayout[] = [];
  auditLogs: AuditLog[] = [];
  notifications: Notification[] = [];

  constructor() {
    this.init();
  }

  init() {
    const data = generateSeedData();
    this.users = data.users;
    this.companies = data.companies;
    this.candidates = data.candidates;
    this.evaluators = data.evaluators;
    this.requirements = data.requirements;
    this.matches = data.matches;
    this.evaluations = data.evaluations;
    this.shortlists = data.shortlists;
    this.interviews = data.interviews;
    this.offers = data.offers;
    this.placements = data.placements;
    this.invoices = data.invoices;
    this.payouts = data.payouts;
    this.auditLogs = data.auditLogs;

    // Notifications
    this.notifications = [
      {
        id: 'notif-1',
        userId: 'user-admin-1',
        title: 'New Evaluation Submitted',
        message: 'Arun Subramanian submitted scorecard for Karthik Iyer (Score: 88/100). QA Review Required.',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'user-company-1',
        title: 'Verified Shortlist Ready',
        message: '16 qualified candidates ready for requirement: 10 Senior Node.js Engineers.',
        type: 'SUCCESS',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-3',
        userId: 'user-eval-1',
        title: 'Evaluation Payout Approved',
        message: 'Your evaluation payout of ₹3,500 has been verified and marked payable.',
        type: 'SUCCESS',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  // Audit Logger Helper
  logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

export const db = new DataStore();
