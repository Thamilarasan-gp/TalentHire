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

// POST /api/auth/register - Candidate / Job Seeker Signup
authRouter.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      firstName: rawFn,
      lastName: rawLn,
      email,
      password = 'Password123!',
      headline,
      primaryRole = 'Full Stack Engineer',
      totalYearsOfExperience = 3,
      location = 'Bengaluru, India',
      skills = ['React', 'Node.js', 'TypeScript'],
      expectedSalaryUsd = 75000,
      noticePeriodDays = 30,
    } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await UserModel.findOne({ email: cleanEmail }).lean();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      });
    }

    const nameParts = (fullName || 'Engineer').trim().split(' ');
    const firstName = rawFn || nameParts[0] || 'Software';
    const lastName = rawLn || nameParts.slice(1).join(' ') || 'Engineer';
    const resolvedFullName = fullName || `${firstName} ${lastName}`.trim();

    const timestamp = Date.now().toString().slice(-6);
    const userId = `user-cand-${timestamp}`;
    const candidateId = `cand-${timestamp}`;

    // 1. Create UserModel record
    const newUser = await UserModel.create({
      id: userId,
      email: cleanEmail,
      fullName: resolvedFullName,
      firstName,
      lastName,
      role: 'JOB_SEEKER',
      candidateId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Create CandidateModel record
    const formattedSkills = (Array.isArray(skills) ? skills : [skills]).map((s: string, idx: number) => ({
      name: s,
      yearsOfExperience: Math.max(1, Number(totalYearsOfExperience) - idx),
      level: idx === 0 ? 'EXPERT' : 'ADVANCED',
      isVerified: true,
    }));

    const newCandidate = await CandidateModel.create({
      id: candidateId,
      userId,
      fullName: resolvedFullName,
      headline: headline || `${primaryRole} | ${totalYearsOfExperience} yrs exp | ${location}`,
      location,
      timezone: 'IST (UTC+5:30)',
      state: 'VERIFIED',
      fraudStatus: 'CLEAR',
      primaryRole,
      totalYearsOfExperience: Number(totalYearsOfExperience) || 3,
      skills: formattedSkills,
      experience: [
        {
          title: primaryRole,
          company: 'Tech Innovations Lab',
          location,
          startDate: '2022-01-01',
          isCurrent: true,
          description: 'Architecting high-throughput microservices and production web interfaces.',
          technologies: formattedSkills.map((s: any) => s.name),
        },
      ],
      education: [
        {
          institution: 'Institute of Technology',
          degree: 'B.Tech in Computer Science',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: 2017,
          endYear: 2021,
        },
      ],
      expectedSalaryUsd: Number(expectedSalaryUsd) || 75000,
      currentSalaryInr: 1800000,
      noticePeriodDays: Number(noticePeriodDays) || 30,
      freeEvaluationsTotal: 10,
      freeEvaluationsRemaining: 10,
      freeEvaluationsUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 3. Issue JWT Token
    const token = signAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: 'JOB_SEEKER',
      candidateId: newCandidate.id,
    });

    const enrichedUser = await enrichUserWithDualRole(newUser.toObject ? newUser.toObject() : newUser);

    // 4. Record Audit Log
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'CANDIDATE_REGISTERED',
      actorId: newUser.id,
      actorEmail: newUser.email,
      actorRole: 'JOB_SEEKER',
      entity: 'Candidate',
      entityId: newCandidate.id,
      timestamp: new Date().toISOString(),
      details: { email: cleanEmail, candidateId },
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to THAMILARASAN GLOBAL.',
      data: {
        token,
        user: enrichedUser,
        candidate: newCandidate,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

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
