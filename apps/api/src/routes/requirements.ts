import { Router } from 'express';
import {
  RequirementModel,
  CandidateModel,
  MatchModel,
  EvaluatorModel,
  EvaluationModel,
  ShortlistModel,
  AuditLogModel,
  buildIdQuery,
} from '../db/models';
import { evaluateMatch, calculateEvaluatorSuitability } from '@thamilarasan/utils';
import { DEFAULT_MATCH_WEIGHTS, EVALUATION_FEE_INR } from '@thamilarasan/config';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const requirementsRouter = Router();

requirementsRouter.get('/', async (req, res) => {
  try {
    const { companyId, state, search } = req.query;
    const query: any = {};

    if (companyId) query.companyId = companyId;
    if (state) query.state = state;
    if (search) {
      const s = String(search);
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { roleCategory: { $regex: s, $options: 'i' } },
      ];
    }

    const requirements = await RequirementModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: requirements,
      total: requirements.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

requirementsRouter.get('/:id', async (req, res) => {
  try {
    const reqItem: any = await RequirementModel.findOne(buildIdQuery(req.params.id)).lean();

    if (!reqItem) {
      return res.status(404).json({ success: false, error: 'Requirement not found in MongoDB Atlas' });
    }

    const [matches, evaluations, shortlist] = await Promise.all([
      MatchModel.find({ requirementId: reqItem.id }).lean(),
      EvaluationModel.find({ requirementId: reqItem.id }).lean(),
      ShortlistModel.findOne({ requirementId: reqItem.id }).lean(),
    ]);

    return res.json({
      success: true,
      data: {
        ...reqItem,
        matches,
        evaluations,
        shortlist,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Create Requirement - Executes Deterministic Matching & Evaluator Identification in Atlas!
requirementsRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      roleCategory = 'Backend Engineering',
      openingsCount = 10,
      requiredSkills = ['Node.js', 'TypeScript', 'AWS'],
      niceToHaveSkills = ['Docker', 'System Design'],
      minExperienceYears = 5,
      maxExperienceYears = 12,
      budgetMinUsd = 65000,
      budgetMaxUsd = 95000,
      engagementType = 'FULL_TIME',
      timezoneRequirement = 'Min 4 hours overlap with EST',
      maxNoticePeriodDays = 45,
      jobDescription,
      companyId = req.user?.companyId || 'comp-1',
    } = req.body;

    const newReqId = `req-${Date.now()}`;
    const newReqData = {
      id: newReqId,
      companyId,
      title,
      roleCategory,
      state: 'MATCHING_ACTIVE',
      openingsCount: Number(openingsCount),
      filledCount: 0,
      requiredSkills,
      niceToHaveSkills,
      minExperienceYears: Number(minExperienceYears),
      maxExperienceYears: Number(maxExperienceYears),
      budgetMinUsd: Number(budgetMinUsd),
      budgetMaxUsd: Number(budgetMaxUsd),
      engagementType,
      timezoneRequirement,
      maxNoticePeriodDays: Number(maxNoticePeriodDays),
      jobDescription: jobDescription || `Strategic hiring requirement for ${title}`,
      matchedCount: 0,
      evaluatingCount: 0,
      shortlistCount: 0,
    };

    // 1. Fetch Candidates from Atlas and execute Deterministic Matching Engine
    const allCandidates = await CandidateModel.find().lean();
    const generatedMatches: any[] = [];

    allCandidates.forEach((cand: any) => {
      const matchRes = evaluateMatch(cand, newReqData as any, DEFAULT_MATCH_WEIGHTS);
      if (matchRes.overallScore >= 60) {
        generatedMatches.push({
          id: `match-${newReqId}-${cand.id}`,
          requirementId: newReqId,
          candidateId: cand.id,
          stage1Passed: matchRes.passedHardFilters,
          stage1FailReasons: matchRes.failedFilters,
          stage2Score: matchRes.overallScore,
          isShortlistCandidate: matchRes.passedHardFilters && matchRes.overallScore >= 80,
        });
      }
    });

    // Sort matches by score descending
    generatedMatches.sort((a, b) => b.stage2Score - a.stage2Score);
    if (generatedMatches.length > 0) {
      await MatchModel.insertMany(generatedMatches);
    }
    newReqData.matchedCount = generatedMatches.length;

    // 2. Assign Conflict-Free Evaluators for Top Qualified Candidates
    const eligibleCandidates = generatedMatches.filter((m) => m.stage1Passed).slice(0, Math.min(20, openingsCount * 2));
    const allEvaluators = await EvaluatorModel.find({ status: 'ACTIVE' }).lean();
    const evaluationsToCreate: any[] = [];

    for (const match of eligibleCandidates) {
      const cand = allCandidates.find((c: any) => c.id === match.candidateId);
      if (!cand) continue;

      const scoredEvaluators = allEvaluators
        .map((ev: any) => calculateEvaluatorSuitability(ev, newReqData as any, cand as any))
        .filter((s) => !s.isConflict)
        .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

      if (scoredEvaluators.length > 0) {
        const bestEvaluator = scoredEvaluators[0];
        evaluationsToCreate.push({
          id: `eval-${Date.now()}-${cand.id}`,
          requirementId: newReqId,
          candidateId: cand.id,
          evaluatorId: bestEvaluator.evaluatorId,
          status: 'PENDING_EVALUATION',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          rubricScores: [],
          overallScore: 0,
          strengths: [],
          concerns: [],
          qaCalibrated: false,
          payoutReleased: false,
        });
      }
    }

    if (evaluationsToCreate.length > 0) {
      await EvaluationModel.insertMany(evaluationsToCreate);
    }
    newReqData.evaluatingCount = evaluationsToCreate.length;

    // 3. Save requirement in MongoDB Atlas
    const createdReq = await RequirementModel.create(newReqData);

    // 4. Record Immutable Audit Log in Atlas
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'REQUIREMENT_CREATED_AND_MATCHED',
      actorId: req.user?.userId || 'system',
      actorEmail: req.user?.email || 'admin@thamilarasan.global',
      actorRole: req.user?.role || 'SUPER_ADMIN',
      entity: 'HiringRequirement',
      entityId: newReqId,
      timestamp: new Date().toISOString(),
      details: { title, openingsCount, matchedCount: generatedMatches.length, evaluationsCreated: evaluationsToCreate.length },
    });

    return res.status(201).json({
      success: true,
      data: createdReq,
      message: `Requirement created in MongoDB Atlas. Matched ${generatedMatches.length} candidates, assigned ${evaluationsToCreate.length} evaluations.`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
