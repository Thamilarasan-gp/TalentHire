import { generateSeedData } from '../seed/data';
import {
  UserModel,
  CompanyModel,
  CandidateModel,
  EvaluatorModel,
  RequirementModel,
  MatchModel,
  EvaluationModel,
  ShortlistModel,
  InterviewModel,
  OfferModel,
  PlacementModel,
  InvoiceModel,
  PayoutModel,
  AuditLogModel,
  CandidateApplicationModel,
  StackPassModel,
  CompanyPricingModel,
} from './models';

/**
 * Idempotently seeds MongoDB Atlas with initial high-fidelity data if collections are empty.
 */
export async function seedAtlasIfNeeded(): Promise<void> {
  try {
    const seed = generateSeedData();

    const [compCount, evalCount, reqCount, userCount, candCount, appCount, shortlistCount] = await Promise.all([
      CompanyModel.countDocuments(),
      EvaluatorModel.countDocuments(),
      RequirementModel.countDocuments(),
      UserModel.countDocuments(),
      CandidateModel.countDocuments(),
      CandidateApplicationModel.countDocuments(),
      ShortlistModel.countDocuments(),
    ]);

    if (compCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.companies.length} companies...`);
      await CompanyModel.insertMany(seed.companies, { ordered: false }).catch(err => console.warn('Companies insert:', err.message));
    }

    if (evalCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.evaluators.length} evaluators...`);
      await EvaluatorModel.insertMany(seed.evaluators, { ordered: false }).catch(err => console.warn('Evaluators insert:', err.message));
    }

    if (reqCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.requirements.length} requirements...`);
      await RequirementModel.insertMany(seed.requirements, { ordered: false }).catch(err => console.warn('Requirements insert:', err.message));
    }

    if (candCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.candidates.length} candidates...`);
      await CandidateModel.insertMany(seed.candidates, { ordered: false }).catch(err => console.warn('Candidates insert:', err.message));
    }

    if (userCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.users.length} users...`);
      const mappedUsers = seed.users.map((u: any) => ({
        ...u,
        fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Platform User',
        passwordHash: u.passwordHash || '$2a$10$e8w6qjX0dG6Xw9w8TqE6z.tEaB3F9wG6Xw9w8TqE6z.tEaB3F9wG',
        isActive: u.isActive !== undefined ? u.isActive : true,
      }));
      await UserModel.insertMany(mappedUsers, { ordered: false }).catch(err => console.warn('Users insert:', err.message));
    }

    // =========================================================================
    // QUICK MATCH & REUSABLE EVALUATION SEEDING (SECTIONS 70 & 71)
    // =========================================================================
    const existingReusableCount = await EvaluationModel.countDocuments({ scope: 'REUSABLE' });
    if (existingReusableCount === 0) {
      console.log('[MongoDB Atlas] Seeding Reusable Evaluations for Global Evaluated Talent Pool...');
      const reusableEvalsToInsert: any[] = [];
      const candidates = await CandidateModel.find().limit(40).lean();

      // Seed 31 GLOBAL_EVALUATED candidate evaluations
      for (let i = 0; i < Math.min(31, candidates.length); i++) {
        const cand = candidates[i];
        let validityStatus = 'VALID';
        let consentStatus = 'ACTIVE';
        let evaluatedAt = '2026-09-20T10:00:00.000Z';
        let expiresAt = '2027-03-20T10:00:00.000Z';

        if (i >= 20 && i < 28) {
          // 8 expired evaluations
          validityStatus = 'EXPIRED';
          evaluatedAt = '2025-08-15T10:00:00.000Z';
          expiresAt = '2026-02-15T10:00:00.000Z';
        } else if (i >= 28) {
          // 3 withdrawn consent
          consentStatus = 'WITHDRAWN';
        }

        reusableEvalsToInsert.push({
          id: `eval-reusable-${cand.id}`,
          candidateId: cand.id,
          requirementId: 'req-global-benchmark',
          evaluatorId: `evaluator-${(i % 5) + 1}`,
          companyId: `comp-${(i % 3) + 2}`, // originally evaluated for another company!
          scope: 'REUSABLE',
          validityStatus,
          consentStatus,
          status: validityStatus === 'EXPIRED' ? 'EXPIRED' : 'COMPLETED',
          qaStatus: 'APPROVED',
          qaCalibrated: true,
          evaluatedAt,
          expiresAt,
          coveredSkills: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
          reuseCount: i === 0 ? 3 : i < 5 ? 1 : 0,
          lastReusedAt: i === 0 ? '2026-09-18T14:30:00.000Z' : undefined,
          overallScore: 94 - (i % 8),
          rubricScores: [
            { criterionName: 'Node.js & Concurrency', score: 9, level: 'EXPERT', evidenceNotes: 'Mastery of event loops & profiling' },
            { criterionName: 'System Design & Architecture', score: 8, level: 'STRONG', evidenceNotes: 'Strong sharding & queue patterns' },
            { criterionName: 'Cloud & AWS', score: 9, level: 'EXPERT', evidenceNotes: 'ECS Fargate, Lambda, IAM' },
            { criterionName: 'Communication', score: 9, level: 'EXPERT', evidenceNotes: 'Crisp articulation of trade-offs' },
          ],
          strengths: ['High throughput concurrency', 'Strong system design', 'Clear technical communication'],
          concerns: [],
          summaryFeedback: 'Exemplary backend engineer with production-grade distributed systems track record.',
        });
      }

      await EvaluationModel.insertMany(reusableEvalsToInsert, { ordered: false }).catch(err =>
        console.warn('Reusable evaluations insert:', err.message)
      );
    }

    // =========================================================================
    // CANDIDATE APPLICATIONS SEEDING (COMPANY PIPELINE - 47 APPLICANTS)
    // =========================================================================
    if (appCount === 0) {
      console.log('[MongoDB Atlas] Seeding 47 Candidate Applications for Vanguard FinTech (comp-1)...');
      const candidates = await CandidateModel.find().lean();
      const applicationsToInsert: any[] = [];

      // Requirement 1 has 47 applicants
      for (let i = 0; i < Math.min(47, candidates.length); i++) {
        const cand = candidates[i];
        // Candidate Rahul (cand-1) is in both Quick Match and dedicated pipeline
        // Candidate Arun (cand-2) is in Quick Match only (skip here)
        if (cand.id === 'cand-2') continue;

        let status = 'APPLIED';
        if (i < 10) status = 'SHORTLISTED';
        else if (i < 18) status = 'EVALUATING';
        else if (i < 30) status = 'SCREENING';

        applicationsToInsert.push({
          id: `app-req1-${cand.id}`,
          candidateId: cand.id,
          companyId: 'comp-1',
          requirementId: 'req-1',
          source: i === 0 ? 'COMPANY_INVITATION' : i < 15 ? 'PLATFORM_MATCH' : 'DIRECT_APPLICATION',
          status,
          appliedAt: new Date(Date.now() - (47 - i) * 3600000 * 6).toISOString(),
          screeningStatus: i < 30 ? 'PASSED' : 'PENDING',
          shortlistStatus: i < 10 ? 'SHORTLISTED' : 'NOT_SHORTLISTED',
        });
      }

      await CandidateApplicationModel.insertMany(applicationsToInsert, { ordered: false }).catch(err =>
        console.warn('Applications insert:', err.message)
      );
    }

    // =========================================================================
    // SHORTLIST SEEDING (INCLUDING ZERO-FABRICATION DEFICIT DEMO)
    // =========================================================================
    if (shortlistCount === 0) {
      console.log('[MongoDB Atlas] Seeding Decision Shortlists with Non-Fabrication Deficit demonstration...');
      const candidates = await CandidateModel.find().limit(20).lean();

      // 1. Requirement 1 Shortlist (10 requested, 10 qualified)
      const req1Candidates = candidates.slice(0, 10).map((cand: any, idx: number) => ({
        candidateId: cand.id,
        candidateName: cand.fullName,
        matchScore: 94 - idx,
        evaluationScore: 92 - idx,
        rank: idx + 1,
        headline: cand.headline,
        keySkills: (cand.skills || []).slice(0, 4).map((s: any) => (typeof s === 'string' ? s : s.name)),
        experienceYears: cand.totalYearsOfExperience,
        noticePeriodDays: cand.noticePeriodDays,
        expectedSalaryUsd: cand.expectedSalaryUsd,
        strengths: ['High throughput concurrency', 'Strong system design', 'Clean test-driven architecture'],
        concerns: idx > 6 ? ['Secondary experience in Kafka'] : [],
        status: idx < 3 ? 'INTERVIEW_SCHEDULED' : 'PENDING_REVIEW',
      }));

      // 2. Requirement 2 Shortlist (10 requested, 7 qualified -> STRICT DEFICIT DEMO!)
      const req2Candidates = candidates.slice(0, 7).map((cand: any, idx: number) => ({
        candidateId: cand.id,
        candidateName: cand.fullName,
        matchScore: 95 - idx * 2,
        evaluationScore: 90 - idx,
        rank: idx + 1,
        headline: cand.headline,
        keySkills: ['Distributed Systems', 'Go', 'Kubernetes', 'gRPC'],
        experienceYears: cand.totalYearsOfExperience,
        noticePeriodDays: cand.noticePeriodDays,
        expectedSalaryUsd: cand.expectedSalaryUsd,
        strengths: ['Consensus algorithms (Raft)', 'Low-latency networking'],
        concerns: [],
        status: 'PENDING_REVIEW',
      }));

      await ShortlistModel.insertMany([
        {
          id: 'shortlist-req-1',
          requirementId: 'req-1',
          companyId: 'comp-1',
          targetCount: 10,
          qualifiedCount: 10,
          isDeficit: false,
          candidates: req1Candidates,
          generatedAt: new Date().toISOString(),
          status: 'READY_FOR_COMPANY',
        },
        {
          id: 'shortlist-req-2',
          requirementId: 'req-2',
          companyId: 'comp-1',
          targetCount: 10,
          qualifiedCount: 7,
          isDeficit: true, // Non-fabrication deficit demonstration
          candidates: req2Candidates,
          generatedAt: new Date().toISOString(),
          status: 'READY_FOR_COMPANY',
        },
      ]);
    }

    const [interviewCount, offerCount, placementCount, invoiceCount] = await Promise.all([
      InterviewModel.countDocuments(),
      OfferModel.countDocuments(),
      PlacementModel.countDocuments(),
      InvoiceModel.countDocuments(),
    ]);

    if (interviewCount === 0 && seed.interviews?.length) {
      await InterviewModel.insertMany(seed.interviews, { ordered: false }).catch(err => console.warn('Interviews insert:', err.message));
    }
    if (offerCount === 0 && seed.offers?.length) {
      await OfferModel.insertMany(seed.offers, { ordered: false }).catch(err => console.warn('Offers insert:', err.message));
    }
    if (placementCount === 0 && seed.placements?.length) {
      await PlacementModel.insertMany(seed.placements, { ordered: false }).catch(err => console.warn('Placements insert:', err.message));
    }
    if (invoiceCount === 0 && seed.invoices?.length) {
      await InvoiceModel.insertMany(seed.invoices, { ordered: false }).catch(err => console.warn('Invoices insert:', err.message));
    }

    const passCount = await StackPassModel.countDocuments();
    if (passCount === 0) {
      const now = new Date();
      const expires = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
      await StackPassModel.create([
        {
          id: 'pass-mern-demo-1',
          candidateId: 'cand-1',
          candidateName: 'Karthik Iyer',
          domain: 'SDE',
          stackKey: 'MERN_STACK',
          stackTitle: 'MERN Stack Engineering',
          score: 88,
          status: 'ACTIVE',
          issuedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
          applicationsCount: 2,
          coveredSkills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript', 'REST APIs'],
          evaluatorId: 'eval-1',
        },
      ]);
      console.log('[MongoDB Atlas] Seeded initial 5-Day MERN Stack Pass for cand-1.');
    }

    console.log('[MongoDB Atlas] ✅ Database status verified & populated across all collections.');
  } catch (error) {
    console.error('[MongoDB Atlas] Error checking/seeding database:', error);
  }
}
