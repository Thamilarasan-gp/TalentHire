import { Router } from 'express';
import {
  StackPassModel,
  CandidateModel,
  RequirementModel,
  CandidateApplicationModel,
  EvaluationModel,
  buildIdQuery,
} from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';
import { StackCardDefinition, TechDomain } from '@thamilarasan/types';

export const stackPassesRouter = Router();

// Master Catalog of Domain Stack Cards
export const STACK_CATALOG: StackCardDefinition[] = [
  // --- DOMAIN 1: SDE / SOFTWARE DEVELOPMENT ---
  {
    stackKey: 'MERN_STACK',
    title: 'MERN Stack Engineering',
    domain: 'SDE',
    description: 'MongoDB, Express.js, React, Node.js, TypeScript architecture & high-throughput REST APIs.',
    coveredSkills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript', 'REST APIs'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 70,
    iconName: 'Layers',
    popularRoles: ['Full Stack Engineer', 'MERN Developer', 'Node.js Backend Lead'],
    benchmarks: [
      'Event loop optimization & async concurrency',
      'Complex React state & memoization patterns',
      'MongoDB indexing, aggregation pipelines & sharding',
    ],
  },
  {
    stackKey: 'PYTHON_FASTAPI',
    title: 'Python & Modern Microservices',
    domain: 'SDE',
    description: 'FastAPI, async Python, relational database tuning, Redis caching & Dockerized deployment.',
    coveredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 70,
    iconName: 'Code',
    popularRoles: ['Backend Engineer', 'Python Architect', 'API Platform Engineer'],
    benchmarks: [
      'Pydantic schema validation & SQLAlchemy ORM async queries',
      'Pub/sub event workers with Celery & Redis',
      'High-throughput ASGI server tuning',
    ],
  },
  {
    stackKey: 'JAVA_SPRING',
    title: 'Java Enterprise & Distributed Systems',
    domain: 'SDE',
    description: 'Spring Boot 3, Spring Cloud, Kafka event streaming, JPA/Hibernate & microservices resilience.',
    coveredSkills: ['Java', 'Spring Boot', 'Kafka', 'Microservices', 'PostgreSQL'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 75,
    iconName: 'Server',
    popularRoles: ['Senior Java Engineer', 'Enterprise Architect', 'Microservices Specialist'],
    benchmarks: [
      'Spring transactional boundaries & circuit breakers (Resilience4j)',
      'Distributed Kafka consumer lag and idempotency',
      'JVM garbage collection tuning & multi-threading memory model',
    ],
  },
  {
    stackKey: 'GO_DISTRIBUTED',
    title: 'Golang High-Concurrency Systems',
    domain: 'SDE',
    description: 'Low-latency backend services, goroutines/channels synchronization, gRPC, and Kubernetes.',
    coveredSkills: ['Go', 'gRPC', 'Kubernetes', 'Redis', 'Distributed Systems'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 75,
    iconName: 'Cpu',
    popularRoles: ['Systems Engineer', 'Cloud Infrastructure Engineer', 'Go Backend Lead'],
    benchmarks: [
      'Mutex locks, channel deadlocks, and goroutine leak prevention',
      'Protobuf/gRPC bidirectional streaming',
      'Graceful shutdown & Kubernetes liveness/readiness probes',
    ],
  },
  {
    stackKey: 'FRONTEND_REACT_TS',
    title: 'Modern Frontend & Next.js Architecture',
    domain: 'SDE',
    description: 'Next.js 14 App Router, Server Components, TypeScript, TailwindCSS, Core Web Vitals optimization.',
    coveredSkills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'State Management'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 70,
    iconName: 'Monitor',
    popularRoles: ['Frontend Architect', 'Lead UI Engineer', 'Next.js Specialist'],
    benchmarks: [
      'Server vs Client component composition & hydration debugging',
      'Core Web Vitals (LCP, INP, CLS) deep performance profiling',
      'Accessible design systems & dynamic state trees',
    ],
  },

  // --- DOMAIN 2: AI & MACHINE LEARNING ---
  {
    stackKey: 'GENAI_LLM',
    title: 'Generative AI & LLM Systems',
    domain: 'AI_ML',
    description: 'Production RAG, Vector Databases (Pinecone/Milvus), LangChain, prompt orchestration & evaluation.',
    coveredSkills: ['Python', 'LangChain', 'LlamaIndex', 'OpenAI', 'RAG', 'Vector DBs'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 75,
    iconName: 'Sparkles',
    popularRoles: ['GenAI Engineer', 'AI Solutions Architect', 'LLM Application Specialist'],
    benchmarks: [
      'Hybrid semantic search + BM25 re-ranking strategies',
      'Context window token management & chunking strategies',
      'Guardrails, hallucination detection & structured JSON outputs',
    ],
  },
  {
    stackKey: 'COMPUTER_VISION',
    title: 'Computer Vision & Deep Learning',
    domain: 'AI_ML',
    description: 'Object detection, model quantization with TensorRT, image segmentation, and edge deployment.',
    coveredSkills: ['PyTorch', 'OpenCV', 'YOLO', 'TensorRT', 'Image Segmentation'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 70,
    iconName: 'Eye',
    popularRoles: ['Computer Vision Engineer', 'Perception Engineer', 'Deep Learning Scientist'],
    benchmarks: [
      'Custom dataset augmentation & transfer learning convergence',
      'Inference latency reduction via FP16/INT8 quantization',
      'Video stream batch processing pipelines',
    ],
  },

  // --- DOMAIN 3: DATA ENGINEERING ---
  {
    stackKey: 'SPARK_BIGDATA',
    title: 'Distributed Data Processing & Spark',
    domain: 'DATA_ENGINEERING',
    description: 'Apache Spark, PySpark, Delta Lake, partition optimization, and petabyte-scale transformations.',
    coveredSkills: ['Apache Spark', 'PySpark', 'Hadoop', 'Data Lakes', 'Scala'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 75,
    iconName: 'Database',
    popularRoles: ['Big Data Engineer', 'Data Platform Architect', 'Spark Specialist'],
    benchmarks: [
      'Spark shuffle partition tuning, skew joins, and broadcast hashing',
      'Delta Lake ACID transactions & time travel querying',
      'PySpark memory allocation and executor configuration',
    ],
  },
  {
    stackKey: 'MODERN_DATA_STACK',
    title: 'Modern Data Stack & Analytics Engineering',
    domain: 'DATA_ENGINEERING',
    description: 'Snowflake, dbt core, BigQuery, Airflow DAG orchestration, and Kimball dimensional modeling.',
    coveredSkills: ['Snowflake', 'dbt', 'SQL', 'BigQuery', 'Airflow'],
    evaluationDurationMinutes: 60,
    passThresholdScore: 70,
    iconName: 'BarChart2',
    popularRoles: ['Analytics Engineer', 'Data Pipeline Engineer', 'Snowflake Architect'],
    benchmarks: [
      'dbt incremental models, snapshots, and schema testing',
      'Airflow DAG idempotency, backfilling, and dynamic task mapping',
      'Warehouse clustering keys and compute credit cost optimization',
    ],
  },
];

// GET /api/stack-passes/catalog - List all stack cards grouped by domain
stackPassesRouter.get('/catalog', (req, res) => {
  const domains: Record<TechDomain, { label: string; description: string; stacks: StackCardDefinition[] }> = {
    SDE: {
      label: 'Software Engineering (SDE)',
      description: 'Full-stack, backend, frontend & distributed systems engineering',
      stacks: STACK_CATALOG.filter((s) => s.domain === 'SDE'),
    },
    AI_ML: {
      label: 'AI & Machine Learning',
      description: 'Generative AI, LLMs, computer vision & deep learning architectures',
      stacks: STACK_CATALOG.filter((s) => s.domain === 'AI_ML'),
    },
    DATA_ENGINEERING: {
      label: 'Data Engineering',
      description: 'Big data pipelines, Spark, modern data stack (Snowflake/dbt), and real-time streaming',
      stacks: STACK_CATALOG.filter((s) => s.domain === 'DATA_ENGINEERING'),
    },
  };

  return res.json({
    success: true,
    data: {
      catalog: STACK_CATALOG,
      domains,
      passValidityDays: 5,
      passValidityHours: 120,
      freeEvaluationsDefault: 10,
    },
  });
});

// GET /api/stack-passes/my-passes - Candidate's passes with remaining hours & expiration (Strictly dynamic per candidate)
stackPassesRouter.get('/my-passes', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const candidateId = req.user?.candidateId || req.user?.userId || req.query.candidateId;
    if (!candidateId) {
      return res.json({
        success: true,
        data: { passes: [], activePasses: [], pendingPasses: [], scheduledPasses: [], quota: { freeEvaluationsTotal: 10, freeEvaluationsUsed: 0, freeEvaluationsRemaining: 10 } },
      });
    }

    const cid = String(candidateId);
    const altCandidateId = cid.startsWith('cand-')
      ? cid.replace('cand-', 'candidate-')
      : cid.replace('candidate-', 'cand-');

    const passes = await StackPassModel.find({
      candidateId: { $in: [cid, altCandidateId] },
    }).sort({ createdAt: -1 }).lean();

    const now = Date.now();
    const updatedPasses = await Promise.all(
      passes.map(async (pass: any) => {
        let status = pass.status || 'PENDING';

        if (status === 'PENDING') {
          return {
            ...pass,
            status: 'PENDING',
            remainingHours: 120,
            isExpired: false,
            remainingFormatted: 'Awaiting Evaluator',
          };
        }

        if (status === 'INTERVIEW_SCHEDULED' || status === 'APPLIED') {
          return {
            ...pass,
            status: 'INTERVIEW_SCHEDULED',
            remainingHours: 120,
            isExpired: false,
            remainingFormatted: pass.scheduledAt ? new Date(pass.scheduledAt).toLocaleString() : 'Interview Scheduled',
          };
        }

        const expiresAtMs = new Date(pass.expiresAt).getTime();
        const diffMs = expiresAtMs - now;
        const remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
        const isExpired = diffMs <= 0;

        if (isExpired && status === 'ACTIVE') {
          status = 'EXPIRED';
          await StackPassModel.updateOne({ id: pass.id }, { $set: { status: 'EXPIRED' } });
        }

        return {
          ...pass,
          status,
          remainingHours,
          isExpired,
          remainingFormatted: isExpired
            ? 'Expired'
            : `${Math.floor(remainingHours / 24)}d ${remainingHours % 24}h remaining`,
        };
      })
    );

    // Fetch candidate quota
    const candidate: any = await CandidateModel.findOne({
      $or: [{ id: cid }, { id: altCandidateId }, { userId: cid }],
    }).lean();

    const quota = {
      freeEvaluationsTotal: candidate?.freeEvaluationsTotal ?? 10,
      freeEvaluationsUsed: candidate?.freeEvaluationsUsed ?? 0,
      freeEvaluationsRemaining: candidate?.freeEvaluationsRemaining ?? 10,
    };

    return res.json({
      success: true,
      data: {
        passes: updatedPasses,
        activePasses: updatedPasses.filter((p) => p.status === 'ACTIVE' && !p.isExpired),
        pendingPasses: updatedPasses.filter((p) => p.status === 'PENDING'),
        scheduledPasses: updatedPasses.filter((p) => p.status === 'INTERVIEW_SCHEDULED'),
        quota,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stack-passes/pending-evaluations - Evaluators browse pending candidate pass requests
stackPassesRouter.get('/pending-evaluations', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const pendingPasses = await StackPassModel.find({ status: 'PENDING' }).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      data: pendingPasses,
      total: pendingPasses.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/book - Candidate applies for a stack pass (Sets status: PENDING, consumes 1 quota)
stackPassesRouter.post('/book', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { candidateId = 'cand-1', stackKey } = req.body;

    const stackDef = STACK_CATALOG.find((s) => s.stackKey === stackKey);
    if (!stackDef) {
      return res.status(404).json({ success: false, error: 'Stack card definition not found' });
    }

    const cid = String(candidateId);
    const altCid = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');

    const candidate = await CandidateModel.findOne({
      $or: [{ id: cid }, { id: altCid }, { userId: cid }],
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate profile not found' });
    }

    const remaining = candidate.freeEvaluationsRemaining ?? 10;
    if (remaining <= 0) {
      return res.status(400).json({
        success: false,
        requiresPayment: true,
        error: 'Free evaluation quota exhausted (10/10 used). Please purchase evaluation credits.',
      });
    }

    // Deduct 1 free quota
    candidate.freeEvaluationsUsed = (candidate.freeEvaluationsUsed ?? 0) + 1;
    candidate.freeEvaluationsRemaining = Math.max(0, remaining - 1);
    await candidate.save();

    const passId = `pass-${stackKey.toLowerCase().replace(/_/g, '-')}-${Date.now().toString().slice(-6)}`;

    // Create persistent pass in PENDING status (waiting for an evaluator to accept)
    let pass = await StackPassModel.findOne({
      candidateId: { $in: [cid, altCid] },
      stackKey: stackDef.stackKey,
      status: { $in: ['PENDING', 'INTERVIEW_SCHEDULED', 'ACTIVE'] },
    });

    if (pass && pass.status === 'PENDING') {
      pass.updatedAt = new Date().toISOString();
      await pass.save();
    } else {
      pass = await StackPassModel.create({
        id: passId,
        candidateId: candidate.id,
        candidateName: candidate.fullName || 'Candidate',
        candidateHeadline: candidate.headline || `${stackDef.title} Specialist`,
        candidateExperienceYears: candidate.totalYearsOfExperience || 3,
        domain: stackDef.domain,
        stackKey: stackDef.stackKey,
        stackTitle: stackDef.title,
        score: 0,
        status: 'PENDING',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicationsCount: 0,
        coveredSkills: stackDef.coveredSkills,
        evaluatorId: null,
        evaluatorName: null,
        meetingLink: null,
        scheduledAt: null,
        appliedAt: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      message: `🎯 Application for ${stackDef.title} Pass submitted! Status: PENDING. Visible to expert evaluators to accept and schedule your interview.`,
      pass,
      quota: {
        freeEvaluationsRemaining: candidate.freeEvaluationsRemaining,
        freeEvaluationsUsed: candidate.freeEvaluationsUsed,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/:id/accept - Evaluator accepts pass request & enters Google Meet link and interview time
stackPassesRouter.post('/:id/accept', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const {
      evaluatorId = (req.user as any)?.evaluatorId || 'evaluator-1',
      evaluatorName = (req.user as any)?.fullName || 'Arun Subramanian (Staff Evaluator)',
      scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      meetingLink = 'https://meet.google.com/abc-defg-hij',
      evaluatorNotes = 'Please be prepared with your code editor ready for live architecture and concurrency tasks.',
    } = req.body;

    const pass = await StackPassModel.findOne(buildIdQuery(id));
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Stack Pass request not found' });
    }

    // Format meeting link if necessary
    let cleanMeetLink = meetingLink.trim();
    if (!cleanMeetLink.startsWith('http://') && !cleanMeetLink.startsWith('https://')) {
      cleanMeetLink = `https://${cleanMeetLink}`;
    }

    pass.status = 'INTERVIEW_SCHEDULED';
    pass.evaluatorId = evaluatorId;
    pass.evaluatorName = evaluatorName;
    pass.scheduledAt = scheduledAt;
    pass.meetingLink = cleanMeetLink;
    pass.evaluatorNotes = evaluatorNotes;
    await pass.save();

    // Create / link corresponding EvaluationModel record
    const evalId = `eval-${pass.id}`;
    await EvaluationModel.findOneAndUpdate(
      { passId: pass.id },
      {
        id: evalId,
        passId: pass.id,
        candidateId: pass.candidateId,
        candidateName: pass.candidateName || 'Candidate',
        evaluatorId,
        evaluatorName,
        status: 'SCHEDULED',
        scheduledAt,
        meetingLink: cleanMeetLink,
        scope: 'REUSABLE',
        title: `${pass.stackTitle} Evaluation`,
        payoutAmountInr: 5000,
        createdAt: new Date().toISOString(),
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: `✅ Evaluation accepted! Google Meet interview scheduled for ${new Date(scheduledAt).toLocaleString()}. Candidate can now see the meeting link.`,
      pass,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/:id/submit-score - Evaluator submits score -> transitions pass to ACTIVE (5-Day Window)
stackPassesRouter.post('/:id/submit-score', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const {
      score = 88,
      verdict = 'PASS',
      evaluatorId = req.user?.evaluatorId || 'evaluator-1',
      notes = 'Candidate demonstrated exceptional problem solving, production clean code, and solid distributed architecture.',
    } = req.body;

    const pass = await StackPassModel.findOne(buildIdQuery(id));
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Stack Pass not found' });
    }

    const stackDef = STACK_CATALOG.find((s) => s.stackKey === pass.stackKey) || STACK_CATALOG[0];
    const numericScore = Number(score);

    if (numericScore < stackDef.passThresholdScore || verdict === 'FAIL') {
      pass.status = 'FAILED';
      pass.score = numericScore;
      await pass.save();
      return res.json({
        success: true,
        message: `Score of ${numericScore}/100 recorded. Candidate fell below threshold (${stackDef.passThresholdScore}). Pass not activated.`,
        pass,
      });
    }

    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days

    pass.status = 'ACTIVE';
    pass.score = numericScore;
    pass.issuedAt = issuedAt.toISOString();
    pass.expiresAt = expiresAt.toISOString();
    if (evaluatorId) pass.evaluatorId = evaluatorId;
    await pass.save();

    // Update candidate to QUALIFIED
    await CandidateModel.updateOne(
      { id: pass.candidateId },
      { $set: { state: 'QUALIFIED', evaluationScore: numericScore } }
    );

    // Update EvaluationModel to CALIBRATED
    await EvaluationModel.updateOne(
      { passId: pass.id },
      {
        $set: {
          status: 'CALIBRATED',
          overallScore: numericScore,
          recommendation: 'PASS',
          completedAt: new Date().toISOString(),
        },
      }
    );

    return res.json({
      success: true,
      message: `🎉 Score of ${numericScore}/100 saved! Pass ${pass.stackTitle} is now ACTIVE for 120 hours. Candidate can now 1-click apply to jobs.`,
      pass,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/mint-pass - Legacy / Fast-test endpoint to mint active pass
stackPassesRouter.post('/mint-pass', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      candidateId = 'cand-1',
      candidateName = 'Karthik Iyer',
      stackKey = 'MERN_STACK',
      score = 88,
      evaluatorId = 'eval-1',
    } = req.body;

    const stackDef = STACK_CATALOG.find((s) => s.stackKey === stackKey);
    if (!stackDef) {
      return res.status(404).json({ success: false, error: 'Invalid stack key' });
    }

    const cid = String(candidateId);
    const altCid = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');

    if (score < stackDef.passThresholdScore) {
      return res.status(400).json({
        success: false,
        error: `Score of ${score}/100 is below the passing benchmark of ${stackDef.passThresholdScore}/100. Stack Pass not issued.`,
      });
    }

    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 5 * 24 * 60 * 60 * 1000);

    // Look for existing pass for this candidate and stackKey
    let pass = await StackPassModel.findOne({
      candidateId: { $in: [cid, altCid] },
      stackKey,
      status: { $in: ['PENDING', 'INTERVIEW_SCHEDULED', 'APPLIED', 'ACTIVE'] },
    });

    if (pass) {
      pass.score = score;
      pass.status = 'ACTIVE';
      pass.issuedAt = issuedAt.toISOString();
      pass.expiresAt = expiresAt.toISOString();
      pass.evaluatorId = evaluatorId;
      await pass.save();
    } else {
      const passId = `pass-${stackKey.toLowerCase().replace(/_/g, '-')}-${Date.now().toString().slice(-6)}`;
      pass = await StackPassModel.create({
        id: passId,
        candidateId: cid,
        candidateName,
        domain: stackDef.domain,
        stackKey: stackDef.stackKey,
        stackTitle: stackDef.title,
        score,
        status: 'ACTIVE',
        issuedAt: issuedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        applicationsCount: 0,
        coveredSkills: stackDef.coveredSkills,
        evaluatorId,
      });
    }

    return res.json({
      success: true,
      message: `🎉 Evaluator submitted score: ${score}/100! Your 5-Day ${stackDef.title} Pass is now ACTIVE. You can now 1-click apply to matching roles.`,
      data: pass,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stack-passes/check-job/:jobId - Check if candidate holds an active pass for this job
stackPassesRouter.get('/check-job/:jobId', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const candidateId = req.query.candidateId ? String(req.query.candidateId) : 'cand-1';
    const cid = String(candidateId);
    const altCid = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');

    const job: any = await RequirementModel.findOne(buildIdQuery(req.params.jobId)).lean();

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job requirement not found' });
    }

    // Get active passes for candidate
    const nowIso = new Date().toISOString();
    const activePasses = await StackPassModel.find({
      candidateId: { $in: [cid, altCid] },
      status: 'ACTIVE',
      expiresAt: { $gt: nowIso },
    }).lean();

    const jobSkills: string[] = (job.requiredSkills || []).map((s: any) =>
      (typeof s === 'string' ? s : s?.name || '').toLowerCase()
    );

    // Check if any active pass covers the job skills
    let matchingPass: any = null;
    for (const pass of activePasses) {
      const passSkills = (pass.coveredSkills || []).map((s: string) => s.toLowerCase());
      const overlap = jobSkills.filter((js) => passSkills.some((ps) => ps.includes(js) || js.includes(ps)));
      // If at least 1 primary stack match or active pass
      if (overlap.length >= 1 || activePasses.length > 0) {
        matchingPass = pass;
        break;
      }
    }

    // Find recommended stack card to take if not holding pass
    let recommendedStack = STACK_CATALOG[0];
    for (const sc of STACK_CATALOG) {
      const scSkills = sc.coveredSkills.map((s) => s.toLowerCase());
      const hasSkill = jobSkills.some((js) => scSkills.some((ss) => ss.includes(js) || js.includes(ss)));
      if (hasSkill) {
        recommendedStack = sc;
        break;
      }
    }

    // Check if candidate already applied to this job
    const existingApp = await CandidateApplicationModel.findOne({
      requirementId: job.id,
      candidateId: { $in: [cid, altCid] },
    }).lean();

    const hasValidPass = Boolean(matchingPass);
    let remainingHours = 0;
    if (matchingPass) {
      const diffMs = new Date(matchingPass.expiresAt).getTime() - Date.now();
      remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    }

    return res.json({
      success: true,
      data: {
        hasValidPass,
        alreadyApplied: Boolean(existingApp),
        application: existingApp || null,
        matchingPass: matchingPass
          ? {
              ...matchingPass,
              remainingHours,
              remainingFormatted: `${Math.floor(remainingHours / 24)}d ${remainingHours % 24}h remaining`,
            }
          : null,
        recommendedStack,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/apply-job - 1-Click application gated by active pass
stackPassesRouter.post('/apply-job', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { candidateId = 'cand-1', jobId } = req.body;
    const cid = String(candidateId);
    const altCid = cid.startsWith('cand-') ? cid.replace('cand-', 'candidate-') : cid.replace('candidate-', 'cand-');

    const job: any = await RequirementModel.findOne(buildIdQuery(jobId)).lean();
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job requirement not found' });
    }

    // Verify candidate has an active unexpired pass
    const nowIso = new Date().toISOString();
    const activePasses = await StackPassModel.find({
      candidateId: { $in: [cid, altCid] },
      status: 'ACTIVE',
      expiresAt: { $gt: nowIso },
    }).lean();

    if (activePasses.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Application gated: You must hold an active 5-Day Stack Pass to apply for this verified role.',
      });
    }

    const candidate = await CandidateModel.findOne({
      $or: [{ id: cid }, { id: altCid }, { userId: cid }],
    }).lean();

    // Verify candidate has not already applied to this job
    const existingApp = await CandidateApplicationModel.findOne({
      requirementId: job.id,
      candidateId: { $in: [cid, altCid] },
    }).lean();

    if (existingApp) {
      return res.json({
        success: true,
        alreadyApplied: true,
        message: `You have already applied for ${job.title}. Your application is currently in review.`,
        applicationId: (existingApp as any).id,
      });
    }

    // Increment pass application count
    await StackPassModel.updateOne({ id: activePasses[0].id }, { $inc: { applicationsCount: 1 } });

    // Create CandidateApplication record
    const appId = `app-${Date.now().toString().slice(-6)}`;
    await CandidateApplicationModel.create({
      id: appId,
      requirementId: job.id,
      candidateId: (candidate as any)?.id || cid,
      companyId: job.companyId,
      status: 'SUBMITTED',
      appliedAt: new Date().toISOString(),
      evaluationScore: activePasses[0].score,
      stackPassId: activePasses[0].id,
      stackKey: activePasses[0].stackKey,
    });

    return res.json({
      success: true,
      message: `🎯 1-Click Application submitted successfully for ${job.title}! Employer will review your verified score of ${activePasses[0].score}/100.`,
      applicationId: appId,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
