import { Router } from 'express';
import {
  StackPassModel,
  CandidateModel,
  RequirementModel,
  CandidateApplicationModel,
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

// GET /api/stack-passes/my-passes - Candidate's passes with remaining hours & expiration
stackPassesRouter.get('/my-passes', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const candidateId = req.query.candidateId ? String(req.query.candidateId) : 'cand-1';
    const passes = await StackPassModel.find(buildIdQuery(candidateId)).sort({ createdAt: -1 }).lean();

    const now = Date.now();
    const updatedPasses = await Promise.all(
      passes.map(async (pass: any) => {
        const expiresAtMs = new Date(pass.expiresAt).getTime();
        const diffMs = expiresAtMs - now;
        const remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
        const isExpired = diffMs <= 0;

        let status = pass.status;
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
    const candidate: any = await CandidateModel.findOne(buildIdQuery(candidateId)).lean();
    const quota = {
      freeEvaluationsTotal: candidate?.freeEvaluationsTotal ?? 10,
      freeEvaluationsUsed: candidate?.freeEvaluationsUsed ?? 0,
      freeEvaluationsRemaining: candidate?.freeEvaluationsRemaining ?? 10,
    };

    return res.json({
      success: true,
      data: {
        passes: updatedPasses,
        activePasses: updatedPasses.filter((p) => p.status === 'ACTIVE'),
        quota,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/book - Book an evaluation for a stack card (consumes 1 free quota)
stackPassesRouter.post('/book', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { candidateId = 'cand-1', stackKey } = req.body;

    const stackDef = STACK_CATALOG.find((s) => s.stackKey === stackKey);
    if (!stackDef) {
      return res.status(404).json({ success: false, error: 'Stack card definition not found' });
    }

    const candidate = await CandidateModel.findOne(buildIdQuery(candidateId));
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

    return res.json({
      success: true,
      message: `Evaluation booked for ${stackDef.title}! 1 Free evaluation used.`,
      quota: {
        freeEvaluationsRemaining: candidate.freeEvaluationsRemaining,
        freeEvaluationsUsed: candidate.freeEvaluationsUsed,
      },
      booking: {
        bookingId: `bk-${Date.now()}`,
        stackKey: stackDef.stackKey,
        stackTitle: stackDef.title,
        domain: stackDef.domain,
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        durationMinutes: stackDef.evaluationDurationMinutes,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stack-passes/mint-pass - Mint an active 5-Day Stack Pass (upon passing evaluation)
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

    if (score < stackDef.passThresholdScore) {
      return res.status(400).json({
        success: false,
        error: `Score of ${score}/100 is below the passing benchmark of ${stackDef.passThresholdScore}/100. Stack Pass not issued.`,
      });
    }

    const issuedAt = new Date();
    // Strictly 5 days from issuedAt (5 * 24 * 60 * 60 * 1000 ms)
    const expiresAt = new Date(issuedAt.getTime() + 5 * 24 * 60 * 60 * 1000);

    const passId = `pass-${stackKey.toLowerCase().replace(/_/g, '-')}-${Date.now().toString().slice(-6)}`;

    // Create or update pass for this stack
    const newPass = await StackPassModel.create({
      id: passId,
      candidateId,
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

    return res.json({
      success: true,
      message: `🎉 Congratulations! Your 5-Day ${stackDef.title} Pass is now active. You can now apply to all matching roles with 1 click.`,
      data: newPass,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stack-passes/check-job/:jobId - Check if candidate holds an active pass for this job
stackPassesRouter.get('/check-job/:jobId', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const candidateId = req.query.candidateId ? String(req.query.candidateId) : 'cand-1';
    const job: any = await RequirementModel.findOne(buildIdQuery(req.params.jobId)).lean();

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job requirement not found' });
    }

    // Get active passes for candidate
    const nowIso = new Date().toISOString();
    const activePasses = await StackPassModel.find({
      candidateId,
      status: 'ACTIVE',
      expiresAt: { $gt: nowIso },
    }).lean();

    const jobSkills: string[] = (job.requiredSkills || []).map((s: string) => s.toLowerCase());

    // Check if any active pass covers the job skills
    let matchingPass: any = null;
    for (const pass of activePasses) {
      const passSkills = (pass.coveredSkills || []).map((s: string) => s.toLowerCase());
      const overlap = jobSkills.filter((js) => passSkills.some((ps) => ps.includes(js) || js.includes(ps)));
      // If at least 1 primary stack match or 50% overlap
      if (overlap.length >= 1) {
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

    const job: any = await RequirementModel.findOne(buildIdQuery(jobId)).lean();
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job requirement not found' });
    }

    // Verify candidate has an active unexpired pass
    const nowIso = new Date().toISOString();
    const activePasses = await StackPassModel.find({
      candidateId,
      status: 'ACTIVE',
      expiresAt: { $gt: nowIso },
    }).lean();

    if (activePasses.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Application gated: You must hold an active 5-Day Stack Pass to apply for this verified role.',
      });
    }

    const candidate = await CandidateModel.findOne(buildIdQuery(candidateId)).lean();

    // Increment pass application count
    await StackPassModel.updateOne({ id: activePasses[0].id }, { $inc: { applicationsCount: 1 } });

    // Create CandidateApplication record
    const appId = `app-${Date.now().toString().slice(-6)}`;
    await CandidateApplicationModel.create({
      id: appId,
      requirementId: job.id,
      candidateId,
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
