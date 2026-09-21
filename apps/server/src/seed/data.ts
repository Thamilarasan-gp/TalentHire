import {
  Company,
  Candidate,
  Evaluator,
  HiringRequirement,
  Match,
  Evaluation,
  Shortlist,
  Interview,
  Offer,
  Placement,
  Invoice,
  EvaluatorPayout,
  AuditLog,
  User,
  CandidateSkill,
  CandidateExperience,
  CandidateEducation,
  EvaluatorExpertise,
  EvaluatorAvailabilitySlot,
  EvaluationScoreItem
} from '@thamilarasan/types';
import { evaluateMatch, calculateEvaluatorSuitability } from '@thamilarasan/utils';
import { DEFAULT_MATCH_WEIGHTS, EVALUATION_FEE_INR } from '@thamilarasan/config';

// 25 Companies across Global Tech Hubs
const COMPANY_NAMES = [
  { name: 'Vanguard FinTech', hq: 'New York, USA', industry: 'Financial Services', size: '201-500' as const },
  { name: 'CloudScale Systems', hq: 'Zurich, Switzerland', industry: 'Cloud Infrastructure', size: '51-200' as const },
  { name: 'Helix BioHealth', hq: 'San Francisco, USA', industry: 'HealthTech & AI', size: '51-200' as const },
  { name: 'Hyperion Robotics', hq: 'London, UK', industry: 'Automation & Robotics', size: '11-50' as const },
  { name: 'NeoBank Tokyo', hq: 'Tokyo, Japan', industry: 'Digital Banking', size: '201-500' as const },
  { name: 'CyberVigil Labs', hq: 'Toronto, Canada', industry: 'Cybersecurity', size: '51-200' as const },
  { name: 'QuantumPay Global', hq: 'Sydney, Australia', industry: 'Payments Infrastructure', size: '500+' as const },
  { name: 'NordicStream Media', hq: 'Stockholm, Sweden', industry: 'Streaming & Media', size: '51-200' as const },
  { name: 'Apex Logix', hq: 'Singapore', industry: 'Supply Chain Tech', size: '51-200' as const },
  { name: 'Synthetix AI', hq: 'Austin, USA', industry: 'Enterprise AI', size: '11-50' as const },
  { name: 'Aether Mobility', hq: 'Berlin, Germany', industry: 'Autonomous Transport', size: '201-500' as const },
  { name: 'OmniRetail Commerce', hq: 'Chicago, USA', industry: 'E-commerce Platforms', size: '500+' as const },
  { name: 'AeroDynamics Aerospace', hq: 'Toulouse, France', industry: 'Aerospace Software', size: '500+' as const },
  { name: 'Solaria Energy Tech', hq: 'Amsterdam, Netherlands', industry: 'CleanTech', size: '11-50' as const },
  { name: 'Krypton Data Platform', hq: 'Boston, USA', industry: 'Big Data & Analytics', size: '51-200' as const },
  { name: 'Zeta Protocol', hq: 'Zug, Switzerland', industry: 'Distributed Systems', size: '11-50' as const },
  { name: 'Boreal Genomics', hq: 'Oslo, Norway', industry: 'Bioinformatics', size: '11-50' as const },
  { name: 'Cortex Neural', hq: 'Seattle, USA', industry: 'Deep Learning', size: '51-200' as const },
  { name: 'PulseTelemetry', hq: 'Dublin, Ireland', industry: 'IoT & Telemetry', size: '51-200' as const },
  { name: 'Mirage Virtualization', hq: 'Tel Aviv, Israel', industry: 'Virtual Infrastructure', size: '51-200' as const },
  { name: 'Orbit Satellite Systems', hq: 'Denver, USA', industry: 'Space Tech', size: '51-200' as const },
  { name: 'Beacon CRM Global', hq: 'Atlanta, USA', industry: 'Enterprise SaaS', size: '201-500' as const },
  { name: 'Aegis Compliance', hq: 'Frankfurt, Germany', industry: 'RegTech', size: '51-200' as const },
  { name: 'Zenith Payments', hq: 'Auckland, New Zealand', industry: 'FinTech', size: '11-50' as const },
  { name: 'Lumina Diagnostics', hq: 'San Diego, USA', industry: 'Medical Devices', size: '201-500' as const },
];

export function generateSeedData() {
  const users: User[] = [];
  const companies: Company[] = [];
  const candidates: Candidate[] = [];
  const evaluators: Evaluator[] = [];
  const requirements: HiringRequirement[] = [];
  const matches: Match[] = [];
  const evaluations: Evaluation[] = [];
  const shortlists: Shortlist[] = [];
  const interviews: Interview[] = [];
  const offers: Offer[] = [];
  const placements: Placement[] = [];
  const invoices: Invoice[] = [];
  const payouts: EvaluatorPayout[] = [];
  const auditLogs: AuditLog[] = [];

  // 1. Platform Admin User
  const adminUser: User = {
    id: 'user-admin-1',
    email: 'admin@thamilarasanglobal.com',
    firstName: 'Thamilarasan',
    lastName: 'Director',
    role: 'PLATFORM_ADMIN',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(adminUser);

  // 2. Generate 25 Companies
  COMPANY_NAMES.forEach((c, index) => {
    const id = `comp-${index + 1}`;
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const companyUser: User = {
      id: `user-company-${index + 1}`,
      email: `talent@${slug}.com`,
      firstName: 'Talent',
      lastName: 'Leader',
      role: 'COMPANY_ADMIN',
      companyId: id,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(companyUser);

    companies.push({
      id,
      name: c.name,
      slug,
      website: `https://${slug}.com`,
      headquarters: c.hq,
      country: c.hq.split(', ')[1],
      size: c.size,
      industry: c.industry,
      description: `${c.name} is a world-class ${c.industry} company scaling global high-performance engineering teams.`,
      isVerified: true,
      status: 'ACTIVE',
      billingTier: index < 5 ? 'ENTERPRISE' : index < 15 ? 'GROWTH' : 'STANDARD',
      contactEmail: `talent@${slug}.com`,
      createdAt: new Date(Date.now() - (30 - index) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  // 3. Generate 50 Evaluators (Senior / Staff / Principal tech leaders)
  const DOMAINS = ['Backend', 'System Design', 'Cloud Architecture', 'Frontend', 'DevOps & SRE', 'Data & AI'];
  const TECH_SETS = [
    ['Node.js', 'TypeScript', 'AWS', 'System Design', 'PostgreSQL'],
    ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
    ['Python', 'FastAPI', 'PyTorch', 'Docker', 'Kubernetes'],
    ['Go', 'Kubernetes', 'gRPC', 'Terraform', 'Microservices'],
    ['Java', 'Spring Boot', 'Kafka', 'AWS', 'Distributed Systems'],
  ];

  for (let i = 1; i <= 50; i++) {
    const evalUserId = `user-eval-${i}`;
    const evalId = `evaluator-${i}`;
    const techs = TECH_SETS[(i - 1) % TECH_SETS.length];
    const domain = DOMAINS[(i - 1) % DOMAINS.length];
    const seniority = i % 3 === 0 ? 'PRINCIPAL' : i % 2 === 0 ? 'STAFF' : 'LEAD';

    users.push({
      id: evalUserId,
      email: `evaluator${i}@thamilarasanglobal.eval`,
      firstName: `Expert`,
      lastName: `Evaluator ${i}`,
      role: 'EVALUATOR',
      evaluatorId: evalId,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const expertise: EvaluatorExpertise[] = [
      {
        domain,
        technologies: techs,
        seniorityLevel: seniority,
        yearsInDomain: 7 + (i % 8),
      },
      {
        domain: 'System Design',
        technologies: ['Architecture', 'Distributed Cache', 'Resilience'],
        seniorityLevel: seniority,
        yearsInDomain: 6 + (i % 6),
      },
    ];

    const availabilitySlots: EvaluatorAvailabilitySlot[] = [
      { dayOfWeek: 1, startTime: '18:00', endTime: '22:00', timezone: 'IST' },
      { dayOfWeek: 3, startTime: '18:00', endTime: '22:00', timezone: 'IST' },
      { dayOfWeek: 5, startTime: '19:00', endTime: '23:00', timezone: 'IST' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '18:00', timezone: 'IST' },
    ];

    evaluators.push({
      id: evalId,
      userId: evalUserId,
      fullName: `Arun Subramanian ${i}`,
      title: `${seniority} Software Architect`,
      currentEmployer: `Tier-1 Enterprise ${((i % 7) + 1)}`,
      yearsOfExperience: 8 + (i % 12),
      status: 'ACTIVE',
      expertise,
      availabilitySlots,
      completedEvaluationsCount: 15 + (i * 3),
      reliabilityScore: 92 + (i % 8),
      interRaterAgreementScore: 89 + (i % 10),
      passRate: 64 + (i % 14),
      totalEarningsInr: (15 + (i * 3)) * EVALUATION_FEE_INR.standard,
      pendingPayoutInr: i % 2 === 0 ? EVALUATION_FEE_INR.standard * 2 : EVALUATION_FEE_INR.standard,
      currentActiveLoad: i % 4,
      maxConcurrentAssignments: 4,
      exEmployers: [`LegacyCorp ${i % 5}`, `OldCo ${i % 3}`],
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // 4. Generate 500 Candidates (Indian Software Engineers)
  const FIRST_NAMES = ['Karthik', 'Priya', 'Deepak', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Meera', 'Aditya', 'Divya', 'Suresh', 'Pooja', 'Rahul', 'Naveen', 'Swati', 'Harish', 'Lavanya', 'Manish', 'Bhavna', 'Ganesh'];
  const LAST_NAMES = ['Iyer', 'Nair', 'Sharma', 'Patel', 'Reddy', 'Chatterjee', 'Menon', 'Rao', 'Verma', 'Kumar', 'Singh', 'Deshmukh', 'Pillai', 'Murthy', 'Joshi', 'Bose', 'Gupta', 'Banerjee'];
  const TECH_ROLES = [
    { title: 'Senior Node.js Backend Engineer', roleCategory: 'Backend Engineering', skills: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'System Design'] },
    { title: 'Senior React / Full Stack Engineer', roleCategory: 'Full Stack', skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'REST'] },
    { title: 'DevOps & Cloud Systems Engineer', roleCategory: 'DevOps & SRE', skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Linux'] },
    { title: 'Staff Python / AI Platform Engineer', roleCategory: 'Data & AI', skills: ['Python', 'FastAPI', 'PyTorch', 'Docker', 'AWS', 'PostgreSQL'] },
    { title: 'Senior Distributed Go Engineer', roleCategory: 'Backend Engineering', skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'System Design'] },
  ];
  const INDIAN_CITIES = ['Bengaluru, India', 'Hyderabad, India', 'Pune, India', 'Chennai, India', 'Gurugram, India', 'Noida, India', 'Mumbai, India', 'Kochi, India'];

  for (let i = 1; i <= 500; i++) {
    const candUserId = `user-cand-${i}`;
    const candId = `cand-${i}`;
    const fn = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const roleConfig = TECH_ROLES[(i - 1) % TECH_ROLES.length];
    const exp = 4 + (i % 9);
    const notice = [15, 30, 45, 60][i % 4];
    const city = INDIAN_CITIES[(i - 1) % INDIAN_CITIES.length];

    // State progression
    let state: Candidate['state'] = 'VERIFIED';
    if (i <= 40) state = 'SELECTED';
    else if (i <= 90) state = 'COMPANY_INTERVIEW';
    else if (i <= 180) state = 'MATCHED';
    else if (i <= 380) state = 'VERIFIED';
    else if (i <= 440) state = 'UNDER_REVIEW';
    else if (i <= 480) state = 'INTERVIEW_PENDING';
    else state = 'SCREENING';

    users.push({
      id: candUserId,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      firstName: fn,
      lastName: ln,
      role: 'JOB_SEEKER',
      candidateId: candId,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const skills: CandidateSkill[] = roleConfig.skills.map((sk, idx) => ({
      name: sk,
      yearsOfExperience: Math.max(2, exp - idx),
      level: idx < 2 ? 'EXPERT' : idx < 4 ? 'ADVANCED' : 'INTERMEDIATE',
      isVerified: i % 5 !== 0,
    }));

    const experience: CandidateExperience[] = [
      {
        title: roleConfig.title,
        company: `Innovate Tech Labs`,
        location: city,
        startDate: '2022-01-01',
        isCurrent: true,
        description: 'Architecting high-throughput backend services and microservices handling 20,000+ RPS.',
        technologies: roleConfig.skills.slice(0, 4),
      },
      {
        title: 'Software Engineer',
        company: `Global Systems India`,
        location: city,
        startDate: '2019-06-01',
        endDate: '2021-12-31',
        isCurrent: false,
        description: 'Built cloud APIs, optimized database queries, and implemented automated test suites.',
        technologies: roleConfig.skills.slice(1, 4),
      },
    ];

    const education: CandidateEducation[] = [
      {
        institution: 'National Institute of Technology (NIT)',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: 2015,
        endYear: 2019,
      },
    ];

    candidates.push({
      id: candId,
      userId: candUserId,
      fullName: `${fn} ${ln}`,
      headline: `${roleConfig.title} | ${exp} yrs exp | ${city}`,
      location: city,
      timezone: 'IST (UTC+5:30)',
      state,
      fraudStatus: i === 499 ? 'REVIEW' : 'CLEAR',
      primaryRole: roleConfig.title,
      totalYearsOfExperience: exp,
      skills,
      experience,
      education,
      expectedSalaryUsd: 55000 + (exp * 5000),
      currentSalaryInr: 1800000 + (exp * 250000),
      noticePeriodDays: notice,
      availabilityDate: new Date(Date.now() + notice * 86400000).toISOString().split('T')[0],
      engagementType: 'FULL_TIME',
      summary: `High-impact ${roleConfig.title} with proven track record designing scalable architectures, robust distributed systems, and clean code for high-growth global platforms.`,
      verifiedBadge: state === 'VERIFIED' || state === 'MATCHED' || state === 'COMPANY_INTERVIEW' || state === 'SELECTED',
      matchCount: 3 + (i % 4),
      createdAt: new Date(Date.now() - (120 - (i % 60)) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // 5. Generate 20 Hiring Requirements
  // Requirement #1: The user's flagship requirement: "Need 10 Senior Node.js Engineers"
  requirements.push({
    id: 'req-1',
    companyId: 'comp-1', // Vanguard FinTech
    title: '10 Senior Node.js Engineers',
    roleCategory: 'Backend Engineering',
    state: 'SHORTLISTED',
    openingsCount: 10,
    filledCount: 2,
    requiredSkills: ['Node.js', 'TypeScript', 'AWS', 'System Design'],
    niceToHaveSkills: ['PostgreSQL', 'Docker', 'Kubernetes'],
    minExperienceYears: 5,
    maxExperienceYears: 12,
    budgetMinUsd: 65000,
    budgetMaxUsd: 95000,
    engagementType: 'FULL_TIME',
    timezoneRequirement: 'Min 4 hours overlap with US EST',
    maxNoticePeriodDays: 45,
    jobDescription:
      'We are expanding our core transactional ledger team at Vanguard FinTech. Looking for 10 exceptional Senior Node.js Engineers with deep mastery of asynchronous event loops, distributed locking, AWS serverless and microservices architectures.',
    matchedCount: 84,
    evaluatingCount: 23,
    shortlistCount: 16,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Additional 19 Requirements
  const REQ_PRESETS = [
    { title: '5 Lead React & Next.js Architects', companyId: 'comp-2', skills: ['React', 'Next.js', 'TypeScript'], count: 5, budget: 85000 },
    { title: '4 Cloud Infrastructure & Kubernetes Specialists', companyId: 'comp-3', skills: ['AWS', 'Kubernetes', 'Terraform'], count: 4, budget: 90000 },
    { title: '6 Staff Python ML Platform Engineers', companyId: 'comp-4', skills: ['Python', 'FastAPI', 'PyTorch'], count: 6, budget: 100000 },
    { title: '8 High-Frequency Go Systems Engineers', companyId: 'comp-5', skills: ['Go', 'Kubernetes', 'gRPC'], count: 8, budget: 95000 },
    { title: '3 Principal Cyber Security Engineers', companyId: 'comp-6', skills: ['Security', 'Cloud Security', 'Kubernetes'], count: 3, budget: 110000 },
    { title: '5 Distributed Database Engineers', companyId: 'comp-7', skills: ['PostgreSQL', 'Distributed Systems', 'System Design'], count: 5, budget: 90000 },
    { title: '4 Full Stack TypeScript Engineers', companyId: 'comp-8', skills: ['React', 'Node.js', 'TypeScript'], count: 4, budget: 75000 },
    { title: '6 Backend Java / Spring Boot Engineers', companyId: 'comp-9', skills: ['Java', 'Spring Boot', 'Kafka'], count: 6, budget: 80000 },
    { title: '3 Autonomous Robotics Software Leads', companyId: 'comp-10', skills: ['Python', 'Docker', 'System Design'], count: 3, budget: 105000 },
    { title: '5 Senior Next.js / UI Engineers', companyId: 'comp-11', skills: ['React', 'Next.js', 'Tailwind CSS'], count: 5, budget: 70000 },
    { title: '4 Reliability Engineers (SRE)', companyId: 'comp-12', skills: ['AWS', 'Kubernetes', 'CI/CD'], count: 4, budget: 85000 },
    { title: '7 Senior Node.js Microservices Devs', companyId: 'comp-13', skills: ['Node.js', 'AWS', 'TypeScript'], count: 7, budget: 80000 },
    { title: '3 Data Platform Architects', companyId: 'comp-14', skills: ['Python', 'Kafka', 'PostgreSQL'], count: 3, budget: 95000 },
    { title: '5 Mobile React Native Engineers', companyId: 'comp-15', skills: ['React', 'TypeScript', 'Mobile'], count: 5, budget: 75000 },
    { title: '4 Rust Systems Engineers', companyId: 'comp-16', skills: ['Rust', 'Distributed Systems', 'Linux'], count: 4, budget: 115000 },
    { title: '6 Senior Frontend Engineers', companyId: 'comp-17', skills: ['React', 'TypeScript', 'GraphQL'], count: 6, budget: 75000 },
    { title: '4 Cloud Security DevSecOps', companyId: 'comp-18', skills: ['AWS', 'Terraform', 'Security'], count: 4, budget: 95000 },
    { title: '8 Full Stack Node + React Engineers', companyId: 'comp-19', skills: ['Node.js', 'React', 'TypeScript'], count: 8, budget: 82000 },
    { title: '5 Core Banking Backend Engineers', companyId: 'comp-20', skills: ['Java', 'Spring Boot', 'PostgreSQL'], count: 5, budget: 88000 },
  ];

  REQ_PRESETS.forEach((rp, idx) => {
    requirements.push({
      id: `req-${idx + 2}`,
      companyId: rp.companyId,
      title: rp.title,
      roleCategory: 'Engineering',
      state: idx < 5 ? 'SHORTLISTED' : idx < 12 ? 'EVALUATING' : 'SOURCING',
      openingsCount: rp.count,
      filledCount: Math.min(rp.count, idx % 3),
      requiredSkills: rp.skills,
      niceToHaveSkills: ['Docker', 'CI/CD', 'System Design'],
      minExperienceYears: 5,
      budgetMinUsd: rp.budget - 15000,
      budgetMaxUsd: rp.budget + 15000,
      engagementType: 'FULL_TIME',
      timezoneRequirement: '4 hours overlap with EST/GMT',
      maxNoticePeriodDays: 45,
      jobDescription: `Key opportunity for ${rp.title} to deliver mission-critical software capabilities with modern tech stacks and global product autonomy.`,
      matchedCount: 30 + (idx * 3),
      evaluatingCount: 10 + idx,
      shortlistCount: 6 + (idx % 5),
      createdAt: new Date(Date.now() - (20 - idx) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  // 6. Generate Matches for Requirement #1 and others (150+ matches)
  const req1 = requirements[0];
  candidates.forEach((cand, idx) => {
    if (idx < 84) {
      const matchRes = evaluateMatch(cand, req1, DEFAULT_MATCH_WEIGHTS);
      matches.push({
        id: `match-${idx + 1}`,
        requirementId: req1.id,
        candidateId: cand.id,
        companyId: req1.companyId,
        overallScore: matchRes.overallScore,
        passedHardFilters: matchRes.passedHardFilters,
        failedFilters: matchRes.failedFilters,
        reasons: matchRes.reasons,
        status: idx < 16 ? 'SHORTLISTED' : idx < 35 ? 'EVALUATION_REQUESTED' : 'NEW',
        createdAt: new Date(Date.now() - (10 - (idx % 7)) * 86400000).toISOString(),
      });
    }
  });

  // 7. Generate 50 Evaluations with Realistic Rubric Scores
  // Anchored Rubric Criteria: 1-3 Inadequate, 4-6 Competent, 7-8 Strong, 9-10 Expert
  for (let i = 1; i <= 50; i++) {
    const evalId = `eval-${i}`;
    const candidate = candidates[i - 1];
    const evaluator = evaluators[(i - 1) % evaluators.length];
    const isApproved = i <= 28;
    const isQaQueue = i > 28 && i <= 38;

    const scores: EvaluationScoreItem[] = [
      {
        criterionId: 'crit-node',
        criterionName: 'Node.js & Concurrency',
        score: 8 + (i % 3 === 0 ? 1 : 0),
        evidenceNotes: 'Demonstrated deep mastery of event loops, libuv worker pools, and memory profiling using clinic.js.',
        level: 'STRONG',
      },
      {
        criterionId: 'crit-arch',
        criterionName: 'System Design & Architecture',
        score: 7 + (i % 2 === 0 ? 1 : 0),
        evidenceNotes: 'Clear partitioning strategy for sharded PostgreSQL and idempotency keys across distributed queue workers.',
        level: 'STRONG',
      },
      {
        criterionId: 'crit-aws',
        criterionName: 'Cloud & Infrastructure (AWS)',
        score: 8,
        evidenceNotes: 'Production experience with ECS Fargate, Lambda, SQS FIFO dead-letter queues, and IAM least-privilege.',
        level: 'STRONG',
      },
      {
        criterionId: 'crit-comm',
        criterionName: 'Communication & Technical Articulation',
        score: 9,
        evidenceNotes: 'Articulated architectural trade-offs proactively and received feedback gracefully.',
        level: 'EXPERT',
      },
    ];

    const overallScore = Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length * 10);

    evaluations.push({
      id: evalId,
      requirementId: req1.id,
      candidateId: candidate.id,
      evaluatorId: evaluator.id,
      companyId: req1.companyId,
      state: isApproved ? 'APPROVED' : isQaQueue ? 'QA_REVIEW' : 'SUBMITTED',
      scheduledAt: new Date(Date.now() - (12 - (i % 8)) * 86400000).toISOString(),
      completedAt: new Date(Date.now() - (11 - (i % 8)) * 86400000).toISOString(),
      durationMinutes: 60,
      overallScore,
      verdict: i % 12 === 0 ? 'REVIEW_REQUIRED' : i % 15 === 0 ? 'FAIL' : 'PASS',
      scores,
      strengths: [
        'Exceptional production debugging competence under high memory pressure',
        'Strong distributed systems intuition with event-driven architectures',
        'Transparent communicator with clear architectural explanations'
      ],
      concerns: i % 4 === 0 ? ['Slightly less exposure to Kubernetes cluster management'] : [],
      summaryFeedback: `Candidate demonstrated solid senior engineering capabilities. Recommended for high-scale backend services.`,
      qaReviewedBy: isApproved ? 'user-admin-1' : undefined,
      qaNotes: isApproved ? 'Calibration verified. Scores consistent with rubric evidence notes.' : undefined,
      qaStatus: isApproved ? 'APPROVED' : undefined,
      payoutAmountInr: EVALUATION_FEE_INR.standard,
      conflictDeclared: false,
      createdAt: new Date(Date.now() - (14 - (i % 10)) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Payout ledger entry
    payouts.push({
      id: `payout-${i}`,
      evaluatorId: evaluator.id,
      evaluationId: evalId,
      amountInr: EVALUATION_FEE_INR.standard,
      status: isApproved ? 'PAYABLE' : 'QA_ELIGIBLE',
      approvedBy: isApproved ? 'user-admin-1' : undefined,
      createdAt: new Date(Date.now() - (10 - (i % 8)) * 86400000).toISOString(),
    });
  }

  // 8. Generate Top-N Shortlists (Flagship: Requirement #1 - 10 requested, 16 qualified!)
  const top16Evaluated = evaluations
    .filter((e) => e.verdict === 'PASS' && e.state === 'APPROVED')
    .slice(0, 16);

  const shortlistCandidates = top16Evaluated.map((ev, rank) => {
    const cand = candidates.find((c) => c.id === ev.candidateId)!;
    return {
      candidateId: cand.id,
      candidateName: cand.fullName,
      matchScore: 90 + (rank % 8),
      evaluationScore: ev.overallScore || 88,
      rank: rank + 1,
      headline: cand.headline,
      keySkills: cand.skills.slice(0, 4).map((s) => s.name),
      experienceYears: cand.totalYearsOfExperience,
      noticePeriodDays: cand.noticePeriodDays,
      expectedSalaryUsd: cand.expectedSalaryUsd,
      strengths: ev.strengths,
      concerns: ev.concerns,
      status: (rank < 3 ? ('INTERVIEW_SCHEDULED' as const) : ('PENDING_REVIEW' as const)),
    };
  });

  shortlists.push({
    id: 'shortlist-1',
    requirementId: req1.id,
    companyId: req1.companyId,
    targetCount: 10,
    qualifiedCount: shortlistCandidates.length,
    isDeficit: shortlistCandidates.length < 10,
    candidates: shortlistCandidates,
    generatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'READY_FOR_COMPANY',
  });

  // 9. Generate Interviews, Offers, and Placements
  // Candidate #1: Karthik Iyer (Full End-to-End Walkthrough Demonstration)
  const candidate1 = candidates[0];
  interviews.push({
    id: 'int-1',
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate1.id,
    interviewType: 'COMPANY_ROUND_1',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    durationMinutes: 45,
    meetingLink: 'https://meet.thamilarasanglobal.com/room/tg-vanguard-session-1',
    status: 'SCHEDULED',
    interviewerNames: ['David Miller (VP Engineering)', 'Sarah Chen (Tech Lead)'],
    createdAt: new Date().toISOString(),
  });

  // Completed company interview leading to offer and placement
  const candidate2 = candidates[1];
  interviews.push({
    id: 'int-2',
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate2.id,
    interviewType: 'COMPANY_ROUND_1',
    scheduledAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    durationMinutes: 45,
    meetingLink: 'https://meet.thamilarasanglobal.com/room/tg-vanguard-session-2',
    status: 'COMPLETED',
    interviewerNames: ['David Miller (VP Engineering)'],
    feedbackNotes: 'Outstanding cultural and technical fit. Approved for immediate offer.',
    companyDecision: 'PROCEED_TO_OFFER',
    rating: 5,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  });

  offers.push({
    id: 'offer-1',
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate2.id,
    annualSalaryUsd: 88000,
    bonusUsd: 10000,
    equityTerms: '0.05% stock options with 4-year vesting',
    startDate: '2026-10-15',
    expiresAt: '2026-09-30',
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  });

  placements.push({
    id: 'place-1',
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate2.id,
    offerId: 'offer-1',
    state: 'ONBOARDING',
    annualSalaryUsd: 88000,
    platformFeeUsd: 13200, // 15% placement fee
    startDate: '2026-10-15',
    guaranteeEndDate: '2027-01-15',
    replacementRequested: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  });

  invoices.push({
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0089',
    companyId: req1.companyId,
    requirementId: req1.id,
    placementId: 'place-1',
    amountUsd: 13200,
    taxUsd: 0,
    totalUsd: 13200,
    dueDate: '2026-10-30',
    status: 'ISSUED',
    items: [
      { description: 'Placement Fee: Senior Node.js Engineer (Priya Nair)', amountUsd: 13200 },
    ],
    createdAt: new Date().toISOString(),
  });

  // 10. Audit Logs
  auditLogs.push(
    {
      id: 'log-1',
      actorId: 'user-company-1',
      actorEmail: 'talent@vanguard-fintech.com',
      actorRole: 'COMPANY_ADMIN',
      action: 'REQUIREMENT_CREATED',
      entity: 'HiringRequirement',
      entityId: 'req-1',
      newState: { title: '10 Senior Node.js Engineers', count: 10 },
      timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'log-2',
      actorId: 'system',
      actorEmail: 'system@thamilarasanglobal.com',
      actorRole: 'PLATFORM_OPERATIONS',
      action: 'MATCHING_ENGINE_EXECUTED',
      entity: 'Match',
      entityId: 'req-1',
      newState: { matchesCount: 84 },
      timestamp: new Date(Date.now() - 13 * 86400000).toISOString(),
    },
    {
      id: 'log-3',
      actorId: 'user-admin-1',
      actorEmail: 'admin@thamilarasanglobal.com',
      actorRole: 'PLATFORM_ADMIN',
      action: 'EVALUATOR_ASSIGNED',
      entity: 'Evaluation',
      entityId: 'eval-1',
      newState: { evaluatorId: 'evaluator-1', candidateId: 'cand-1' },
      timestamp: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: 'log-4',
      actorId: 'user-eval-1',
      actorEmail: 'evaluator1@thamilarasanglobal.eval',
      actorRole: 'EVALUATOR',
      action: 'SCORECARD_SUBMITTED',
      entity: 'Evaluation',
      entityId: 'eval-1',
      newState: { verdict: 'PASS', score: 88 },
      timestamp: new Date(Date.now() - 11 * 86400000).toISOString(),
    },
    {
      id: 'log-5',
      actorId: 'user-admin-1',
      actorEmail: 'admin@thamilarasanglobal.com',
      actorRole: 'PLATFORM_ADMIN',
      action: 'QA_VERIFIED',
      entity: 'Evaluation',
      entityId: 'eval-1',
      newState: { qaStatus: 'APPROVED' },
      timestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
    }
  );

  return {
    users,
    companies,
    candidates,
    evaluators,
    requirements,
    matches,
    evaluations,
    shortlists,
    interviews,
    offers,
    placements,
    invoices,
    payouts,
    auditLogs,
  };
}
