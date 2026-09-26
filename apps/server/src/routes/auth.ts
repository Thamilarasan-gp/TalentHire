import { Router } from 'express';
import {
  UserModel,
  CandidateModel,
  EvaluatorModel,
  EvaluatorApplicationModel,
  AuditLogModel,
  buildIdQuery
} from '../db/models';
import { signAccessToken } from '@thamilarasan/auth';
import { AuthenticatedRequest, authenticate } from '../middleware/auth';

export const authRouter = Router();

// Helper to resolve dual-role capabilities (Job Seeker + Evaluator on same email)
async function enrichUserWithDualRole(user: any) {
  try {
    const candidate: any = await CandidateModel.findOne({
      $or: [
        { userId: user.id },
        { id: user.candidateId },
        { email: user.email?.toLowerCase() },
      ],
    }).lean();

    const candidateId = candidate?.id || user.candidateId || 'cand-1';

    const evaluatorApp: any = await EvaluatorApplicationModel.findOne({
      $or: [
        { candidateId },
        { email: user.email?.toLowerCase() },
      ],
    }).lean();

    const evaluator: any = await EvaluatorModel.findOne({
      $or: [
        { userId: user.id },
        { id: user.evaluatorId },
        { userId: candidateId },
      ],
    }).lean();

    const evaluatorStatus =
      evaluator?.status === 'ACTIVE'
        ? 'APPROVED'
        : (evaluatorApp?.status || candidate?.evaluatorApplicationStatus || (user.role === 'EVALUATOR' ? 'APPROVED' : 'NONE'));

    const isEvaluator = evaluatorStatus === 'APPROVED' || user.role === 'EVALUATOR' || !!evaluator || !!user.evaluatorId;

    return {
      ...user,
      candidateId,
      evaluatorId: evaluator?.id || user.evaluatorId || (isEvaluator ? 'eval-1' : null),
      evaluatorStatus,
      isEvaluator,
      isDualRole: true,
    };
  } catch {
    return user;
  }
}

// Login (Supports single email login for unified Job Seeker + Evaluator)
authRouter.post('/login', async (req, res) => {
  try {
    const { email, role } = req.body;

    let user: any = null;
    if (email) {
      user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    }

    if (!user && role) {
      user = await UserModel.findOne({ role }).lean();
    }

    if (!user) {
      // Fallback to first super admin
      user = await UserModel.findOne().lean();
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in MongoDB Atlas' });
    }

    const enrichedUser = await enrichUserWithDualRole(user);

    const token = signAccessToken({
      userId: enrichedUser.id,
      email: enrichedUser.email,
      role: enrichedUser.isEvaluator ? 'EVALUATOR' : enrichedUser.role,
      companyId: enrichedUser.companyId,
      candidateId: enrichedUser.candidateId,
      evaluatorId: enrichedUser.evaluatorId,
    });

    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'USER_LOGIN',
      actorId: enrichedUser.id,
      actorEmail: enrichedUser.email,
      actorRole: enrichedUser.role,
      entity: 'User',
      entityId: enrichedUser.id,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({
      success: true,
      data: {
        token,
        user: enrichedUser,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Current User Profile
authRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized session' });
    }

    const user = await UserModel.findOne(buildIdQuery(req.user.userId)).lean();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in MongoDB Atlas' });
    }

    const enrichedUser = await enrichUserWithDualRole(user);

    return res.json({
      success: true,
      data: enrichedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

authRouter.patch('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized session' });
    }

    const { firstName, lastName, fullName, phoneNumber, title } = req.body;
    const updates: any = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (fullName !== undefined) updates.fullName = fullName;
    else if (firstName || lastName) updates.fullName = `${firstName || ''} ${lastName || ''}`.trim();
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (title !== undefined) updates.title = title;

    const user = await UserModel.findOneAndUpdate(
      buildIdQuery(req.user.userId),
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { new: true }
    ).lean();

    return res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
