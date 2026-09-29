import { Router } from 'express';
import {
  CandidateModel,
  UserModel,
  EvaluationModel,
  InterviewModel,
  OfferModel,
  CandidateApplicationModel,
  RequirementModel,
  CompanyModel,
  buildIdQuery,
} from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const candidatesRouter = Router();

// GET /api/candidates/my-applications - Dynamic applications for current candidate
candidatesRouter.get('/my-applications', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const candidateId = req.user?.candidateId || req.query.candidateId;
    if (!candidateId) {
      return res.json({ success: true, data: [] });
    }
    const cid = String(candidateId);
    const altCid = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');

    const applications = await CandidateApplicationModel.find({
      candidateId: { $in: [cid, altCid] },
    })
      .sort({ appliedAt: -1, createdAt: -1 })
      .lean();

    const reqIds = applications.map((a: any) => a.requirementId).filter(Boolean);
    const compIds = applications.map((a: any) => a.companyId).filter(Boolean);

    const [requirements, companies] = await Promise.all([
      RequirementModel.find({ id: { $in: reqIds } }).lean(),
      CompanyModel.find({ id: { $in: compIds } }).lean(),
    ]);

    const reqMap = new Map(requirements.map((r: any) => [r.id, r]));
    const compMap = new Map(companies.map((c: any) => [c.id, c]));

    const enriched = applications.map((app: any) => {
      const job: any = reqMap.get(app.requirementId);
      const company: any = compMap.get(app.companyId);
      return {
        ...app,
        role: job?.title || 'Engineering Role',
        company: company?.name || job?.companyName || 'Hiring Partner',
        location: job?.location || 'Remote',
        salary: job?.salary || '$85,000 - $110,000',
        stage: app.status || 'SUBMITTED',
        stageDesc:
          app.status === 'OFFERED'
            ? 'Formal offer extended! Review offer details in the Offers section.'
            : app.status === 'INTERVIEW_SCHEDULED'
            ? 'Company interview scheduled. Check the Interviews section for meeting details.'
            : app.status === 'SHORTLISTED'
            ? 'Profile shortlisted by hiring company. Final interview scheduling in progress.'
            : '1-Click application submitted with verified Stack Pass. Company reviewing dossier.',
      };
    });

    return res.json({ success: true, data: enriched });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

candidatesRouter.get('/:id', async (req, res) => {
  try {
    const candidate: any = await CandidateModel.findOne(buildIdQuery(req.params.id)).lean();

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found in MongoDB Atlas' });
    }

    const [evaluations, interviews, user] = await Promise.all([
      EvaluationModel.find({ candidateId: candidate.id }).lean(),
      InterviewModel.find({ candidateId: candidate.id }).lean(),
      candidate.userId ? UserModel.findOne({ id: candidate.userId }).lean() : null,
    ]);

    return res.json({
      success: true,
      data: {
        email: candidate.email || (user as any)?.email || '',
        phone: candidate.phone || candidate.phoneNumber || (user as any)?.phoneNumber || '',
        languages: candidate.languages || candidate.languagesKnown || ['English', 'Tamil'],
        ...candidate,
        evaluations,
        interviews,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/candidates/:id - Update candidate profile
candidatesRouter.put('/:id', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const cid = req.params.id;
    const altCid = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');

    const updateData = req.body;
    const candidate: any = await CandidateModel.findOne({
      $or: [{ id: cid }, { id: altCid }, { userId: cid }],
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate profile not found' });
    }

    if (updateData.fullName) candidate.fullName = updateData.fullName;
    if (updateData.headline) candidate.headline = updateData.headline;
    if (updateData.location) candidate.location = updateData.location;
    if (updateData.summary) candidate.summary = updateData.summary;
    if (updateData.email) candidate.email = updateData.email;
    if (updateData.phone) {
      candidate.phone = updateData.phone;
      candidate.phoneNumber = updateData.phone;
    }
    if (updateData.languages) candidate.languages = updateData.languages;
    if (updateData.expectedSalaryUsd !== undefined) candidate.expectedSalaryUsd = Number(updateData.expectedSalaryUsd);
    if (updateData.noticePeriodDays !== undefined) candidate.noticePeriodDays = Number(updateData.noticePeriodDays);
    if (updateData.totalYearsOfExperience !== undefined) candidate.totalYearsOfExperience = Number(updateData.totalYearsOfExperience);
    if (updateData.skills) candidate.skills = updateData.skills;
    if (updateData.engagementType) candidate.engagementType = updateData.engagementType;

    candidate.updatedAt = new Date().toISOString();
    await candidate.save();

    // Also update UserModel if fullName/email/phone were updated
    if (candidate.userId) {
      const userUpdates: any = {};
      if (updateData.fullName) userUpdates.fullName = updateData.fullName;
      if (updateData.email) userUpdates.email = updateData.email;
      if (updateData.phone) userUpdates.phoneNumber = updateData.phone;
      if (Object.keys(userUpdates).length > 0) {
        await UserModel.updateOne({ id: candidate.userId }, userUpdates);
      }
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: candidate,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

