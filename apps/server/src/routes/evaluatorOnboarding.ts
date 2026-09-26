import { Router } from 'express';
import {
  EvaluatorApplicationModel,
  CandidateModel,
  EvaluatorModel,
  UserModel,
  AuditLogModel,
  buildIdQuery,
} from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const evaluatorOnboardingRouter = Router();

// POST /api/evaluator-onboarding/apply - Candidate submits professional credentials
evaluatorOnboardingRouter.post('/apply', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      candidateId = 'cand-1',
      fullName = 'Karthik Iyer',
      email = 'karthik@example.com',
      currentCompany,
      currentRole,
      totalExperienceYears,
      linkedinUrl,
      githubUrl,
      primaryDomain,
      expertStacks = [],
      professionalSummary,
    } = req.body;

    if (!currentCompany || !currentRole || !linkedinUrl || !primaryDomain) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current company, role, LinkedIn URL, and primary domain to verify professional credentials.',
      });
    }

    const appId = `eval-app-${Date.now().toString().slice(-6)}`;

    // Upsert application
    const app = await EvaluatorApplicationModel.findOneAndUpdate(
      { candidateId },
      {
        id: appId,
        candidateId,
        fullName,
        email,
        currentCompany,
        currentRole,
        totalExperienceYears: Number(totalExperienceYears) || 5,
        linkedinUrl,
        githubUrl,
        primaryDomain,
        expertStacks,
        professionalSummary: professionalSummary || 'Experienced software professional seeking evaluator role.',
        status: 'PENDING_ADMIN_VERIFICATION',
        appliedAt: new Date().toISOString(),
      },
      { upsert: true, new: true }
    );

    // Update candidate profile state
    await CandidateModel.updateOne(
      buildIdQuery(candidateId),
      {
        $set: {
          evaluatorApplicationStatus: 'PENDING_ADMIN_VERIFICATION',
        },
      }
    );

    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'EVALUATOR_APPLICATION_SUBMITTED',
      actorId: candidateId,
      actorEmail: email,
      actorRole: 'CANDIDATE',
      entity: 'EvaluatorApplication',
      entityId: appId,
      timestamp: new Date().toISOString(),
      details: { currentCompany, currentRole, primaryDomain },
    });

    return res.json({
      success: true,
      message: '✅ Your Evaluator Application has been submitted! Our technical vetting team will verify your credentials within 24-48 hours. The Evaluator Workstation will unlock upon approval.',
      data: app,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/evaluator-onboarding/my-status - Check logged in candidate's evaluator application status
evaluatorOnboardingRouter.get('/my-status', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const candidateId = req.query.candidateId ? String(req.query.candidateId) : 'cand-1';
    const app: any = await EvaluatorApplicationModel.findOne({ candidateId }).lean();
    const candidate: any = await CandidateModel.findOne(buildIdQuery(candidateId)).lean();

    const status = app?.status || candidate?.evaluatorApplicationStatus || 'NONE';

    return res.json({
      success: true,
      data: {
        status,
        isApproved: status === 'APPROVED',
        isPending: status === 'PENDING_ADMIN_VERIFICATION',
        application: app || null,
        evaluatorProfileId: candidate?.evaluatorProfileId || null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/evaluator-onboarding/admin/pending - List applications awaiting admin verification
evaluatorOnboardingRouter.get('/admin/pending', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const applications = await EvaluatorApplicationModel.find().sort({ appliedAt: -1 }).lean();
    return res.json({
      success: true,
      data: applications,
      totalPending: applications.filter((a: any) => a.status === 'PENDING_ADMIN_VERIFICATION').length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/evaluator-onboarding/admin/:id/approve - Admin approves application & activates dual-role
evaluatorOnboardingRouter.post('/admin/:id/approve', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const app = await EvaluatorApplicationModel.findOne(buildIdQuery(req.params.id));
    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const evaluatorId = `eval-${Date.now().toString().slice(-6)}`;

    // Create Evaluator profile if not exists
    await EvaluatorModel.findOneAndUpdate(
      { userId: app.candidateId },
      {
        id: evaluatorId,
        userId: app.candidateId,
        fullName: app.fullName,
        headline: `${app.currentRole} at ${app.currentCompany}`,
        primaryDomains: [app.primaryDomain],
        skills: app.expertStacks,
        totalExperienceYears: app.totalExperienceYears,
        currentCompany: app.currentCompany,
        status: 'ACTIVE',
        hourlyRateInr: 5000,
      },
      { upsert: true }
    );

    // Update Application status
    app.status = 'APPROVED';
    app.reviewedAt = new Date().toISOString();
    app.reviewedBy = req.user?.email || 'admin@talent-hire.global';
    await app.save();

    // Update candidate profile with approved evaluator status and linked profile ID
    await CandidateModel.updateOne(
      buildIdQuery(app.candidateId),
      {
        $set: {
          evaluatorApplicationStatus: 'APPROVED',
          evaluatorProfileId: evaluatorId,
        },
      }
    );

    // Update user record if exists to activate dual-role evaluator on same account
    await UserModel.updateMany(
      {
        $or: [
          { email: app.email?.toLowerCase() },
          { candidateId: app.candidateId },
          { id: app.candidateId },
        ],
      },
      {
        $set: {
          evaluatorId,
          isDualRoleEvaluator: true,
        },
      }
    );

    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'EVALUATOR_APPLICATION_APPROVED',
      actorId: req.user?.userId || 'admin',
      actorEmail: req.user?.email || 'admin@talent-hire.global',
      actorRole: 'SUPER_ADMIN',
      entity: 'EvaluatorApplication',
      entityId: app.id,
      timestamp: new Date().toISOString(),
      details: { candidateId: app.candidateId, evaluatorId },
    });

    return res.json({
      success: true,
      message: `🎉 Evaluator credentials approved! ${app.fullName} can now switch to the Evaluator Workstation.`,
      evaluatorId,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/evaluator-onboarding/admin/:id/reject - Admin rejects application
evaluatorOnboardingRouter.post('/admin/:id/reject', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { reason = 'Insufficient experience or unverified company credentials.' } = req.body;
    const app = await EvaluatorApplicationModel.findOne(buildIdQuery(req.params.id));
    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    app.status = 'REJECTED';
    app.reviewedAt = new Date().toISOString();
    app.rejectionReason = reason;
    await app.save();

    await CandidateModel.updateOne(
      buildIdQuery(app.candidateId),
      {
        $set: {
          evaluatorApplicationStatus: 'REJECTED',
        },
      }
    );

    return res.json({
      success: true,
      message: 'Evaluator application rejected.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
