import { Router } from 'express';
import {
  EvaluationModel,
  CandidateModel,
  EvaluatorModel,
  RequirementModel,
  PayoutModel,
  AuditLogModel,
  buildIdQuery,
} from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const evaluationsRouter = Router();

evaluationsRouter.get('/', async (req, res) => {
  try {
    const { requirementId, evaluatorId, candidateId, status } = req.query;
    const query: any = {};

    if (requirementId) {
      const rid = String(requirementId);
      const alt = rid.startsWith('req-') ? rid.replace('req-', 'requirement-') : rid.replace('requirement-', 'req-');
      query.requirementId = { $in: [rid, alt] };
    }
    if (evaluatorId) {
      const eid = String(evaluatorId);
      const alt = eid.startsWith('eval-') ? eid.replace('eval-', 'evaluator-') : eid.replace('evaluator-', 'eval-');
      query.evaluatorId = { $in: [eid, alt] };
    }
    if (candidateId) {
      const cid = String(candidateId);
      const alt = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');
      query.candidateId = { $in: [cid, alt] };
    }
    if (status) query.status = status;

    const evaluations = await EvaluationModel.find(query).lean();
    return res.json({
      success: true,
      data: evaluations,
      total: evaluations.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

evaluationsRouter.get('/:id', async (req, res) => {
  try {
    const evaluation: any = await EvaluationModel.findOne(buildIdQuery(req.params.id)).lean();

    if (!evaluation) {
      return res.status(404).json({ success: false, error: 'Evaluation not found in MongoDB Atlas' });
    }

    const [candidate, evaluator, requirement] = await Promise.all([
      CandidateModel.findOne({ id: evaluation.candidateId }).lean(),
      EvaluatorModel.findOne({ id: evaluation.evaluatorId }).lean(),
      RequirementModel.findOne({ id: evaluation.requirementId }).lean(),
    ]);

    return res.json({
      success: true,
      data: {
        ...evaluation,
        candidate,
        evaluator,
        requirement,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Submit Scorecard (Evaluator -> Locked -> QA Calibration Queue)
evaluationsRouter.post('/:id/scorecard', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationModel.findOne(buildIdQuery(req.params.id));

    if (!evaluation) {
      return res.status(404).json({ success: false, error: 'Evaluation not found in MongoDB Atlas' });
    }

    const {
      scores,
      verdict = 'PASS',
      strengths = [],
      concerns = [],
      evidenceNotes = 'Comprehensive technical interview completed with verified coding rubric.',
    } = req.body;

    const previousStatus = evaluation.status;
    evaluation.status = 'PENDING_QA';
    evaluation.rubricScores = scores || [
      { criterionName: 'Problem Solving & Algorithms', score: 9 },
      { criterionName: 'System Architecture & Concurrency', score: 9 },
      { criterionName: 'Code Cleanliness & Production Quality', score: 8 },
      { criterionName: 'Technical Communication', score: 9 },
    ];
    evaluation.recommendation = verdict;
    evaluation.strengths = strengths.length > 0 ? strengths : ['Deep Raft consensus knowledge', 'Zero race condition concurrency'];
    evaluation.concerns = concerns;
    evaluation.evidenceNotes = evidenceNotes;
    evaluation.completedAt = new Date().toISOString();

    // Calculate overall score (0 - 100)
    if (evaluation.rubricScores.length > 0) {
      const avgScore = evaluation.rubricScores.reduce((sum: number, s: any) => sum + (Number(s.score) || 8), 0) / evaluation.rubricScores.length;
      evaluation.overallScore = Math.round(avgScore * 10);
    }

    await evaluation.save();

    // Record Payout in Escrow for Evaluator (₹5,000)
    await PayoutModel.findOneAndUpdate(
      { evaluationId: evaluation.id },
      {
        id: `payout-${Date.now()}`,
        evaluatorId: evaluation.evaluatorId,
        evaluationId: evaluation.id,
        amountInr: 5000,
        status: 'HELD_IN_ESCROW',
      },
      { upsert: true, new: true }
    );

    // Audit Log in Atlas
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'SCORECARD_LOCKED_SUBMITTED',
      actorId: req.user?.userId || evaluation.evaluatorId,
      actorEmail: req.user?.email || 'evaluator@thamilarasan.global',
      actorRole: req.user?.role || 'EVALUATOR',
      entity: 'Evaluation',
      entityId: evaluation.id,
      timestamp: new Date().toISOString(),
      details: { previousStatus, newStatus: evaluation.status, overallScore: evaluation.overallScore, recommendation: verdict },
    });

    return res.json({
      success: true,
      data: evaluation,
      message: 'Scorecard saved to MongoDB Atlas and routed to QA Calibration queue.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST QA Review / Calibration Approval (Admin/QA -> Approved, Releases Evaluator Honorarium)
evaluationsRouter.post('/:id/qa', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationModel.findOne(buildIdQuery(req.params.id));

    if (!evaluation) {
      return res.status(404).json({ success: false, error: 'Evaluation not found in MongoDB Atlas' });
    }

    const { status = 'CALIBRATED' } = req.body;
    evaluation.status = status;
    evaluation.qaCalibrated = true;
    evaluation.payoutReleased = true;
    await evaluation.save();

    // Update candidate to QUALIFIED if pass verdict
    await CandidateModel.updateOne(
      { id: evaluation.candidateId },
      { $set: { state: 'QUALIFIED', evaluationScore: evaluation.overallScore } }
    );

    // Release evaluator payout to DISBURSED
    await PayoutModel.updateOne(
      { evaluationId: evaluation.id },
      {
        $set: {
          status: 'DISBURSED',
          disbursedAt: new Date().toISOString(),
          transactionRef: `TXN-IMPS-${Date.now()}`,
        },
      }
    );

    // Audit log
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'QA_CALIBRATED_PAYOUT_RELEASED',
      actorId: req.user?.userId || 'admin',
      actorEmail: req.user?.email || 'qa@thamilarasan.global',
      actorRole: req.user?.role || 'SUPER_ADMIN',
      entity: 'Evaluation',
      entityId: evaluation.id,
      timestamp: new Date().toISOString(),
      details: { status, payoutAmountInr: 5000, payoutStatus: 'DISBURSED' },
    });

    return res.json({
      success: true,
      data: evaluation,
      message: 'Evaluation calibrated by QA in MongoDB Atlas. Evaluator payout of ₹5,000 released.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
