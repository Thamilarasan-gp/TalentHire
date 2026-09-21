import { Router } from 'express';
import { UserModel, AuditLogModel, buildIdQuery } from '../db/models';
import { signAccessToken } from '@thamilarasan/auth';
import { AuthenticatedRequest, authenticate } from '../middleware/auth';

export const authRouter = Router();

// Login (Supports direct email login or 1-click role switcher)
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

    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      candidateId: user.candidateId,
      evaluatorId: user.evaluatorId,
    });

    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'USER_LOGIN',
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      entity: 'User',
      entityId: user.id,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({
      success: true,
      data: {
        token,
        user,
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

    return res.json({
      success: true,
      data: user,
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
