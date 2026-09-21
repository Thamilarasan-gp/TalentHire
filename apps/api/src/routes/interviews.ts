import { Router } from 'express';
import { InterviewModel, CandidateModel, AuditLogModel } from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const interviewsRouter = Router();

interviewsRouter.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { companyId, candidateId, requirementId } = req.query;
    const query: any = {};

    const targetCompanyId = companyId || req.user?.companyId;
    if (targetCompanyId) query.companyId = targetCompanyId;
    if (candidateId) query.candidateId = candidateId;
    if (requirementId) query.requirementId = requirementId;

    const interviews = await InterviewModel.find(query).sort({ scheduledAt: -1, createdAt: -1 }).lean();

    const candIds = interviews.map((i: any) => i.candidateId).filter(Boolean);
    const candidates = candIds.length > 0 ? await CandidateModel.find({ id: { $in: candIds } }).lean() : [];
    const candMap = new Map(candidates.map((c: any) => [c.id, c]));

    const enriched = interviews.map((inv: any) => {
      const cand: any = candMap.get(inv.candidateId);
      return {
        ...inv,
        candidateName: cand?.fullName || inv.candidateName || 'Candidate',
        candidateHeadline: cand?.headline || inv.candidateHeadline || '',
        candidateEmail: cand?.email || inv.candidateEmail || '',
        candidate: cand,
      };
    });

    return res.json({
      success: true,
      data: enriched,
      total: enriched.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

interviewsRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      requirementId,
      candidateId,
      companyId = req.user?.companyId || 'comp-1',
      scheduledAt,
      durationMinutes = 45,
      interviewType = 'FINAL_CLIENT_INTERVIEW',
      interviewerNames = ['Engineering Lead'],
      meetingLink = 'https://meet.thamilarasan.global/room/tg-interview-room',
    } = req.body;

    const newInterview = await InterviewModel.create({
      id: `int-${Date.now()}`,
      requirementId,
      companyId,
      candidateId,
      interviewType,
      scheduledAt: scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      durationMinutes,
      meetingLink,
      status: 'SCHEDULED',
      interviewerNames,
    });

    // Update candidate status to INTERVIEW_SCHEDULED
    await CandidateModel.updateOne(
      { id: candidateId },
      { $set: { state: 'INTERVIEWING' } }
    );

    // Audit log
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'INTERVIEW_SCHEDULED',
      actorId: req.user?.userId || 'company',
      actorEmail: req.user?.email || 'talent@vanguardfintech.com',
      actorRole: req.user?.role || 'COMPANY_ADMIN',
      entity: 'Interview',
      entityId: newInterview.id,
      timestamp: new Date().toISOString(),
      details: { requirementId, candidateId, scheduledAt },
    });

    return res.status(201).json({
      success: true,
      data: newInterview,
      message: 'Interview successfully scheduled in MongoDB Atlas.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
