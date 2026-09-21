var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// apps/server/src/index.ts
var src_exports = {};
__export(src_exports, {
  app: () => app,
  default: () => src_default,
  io: () => io,
  server: () => server
});
module.exports = __toCommonJS(src_exports);
var import_express14 = __toESM(require("express"));
var import_http = __toESM(require("http"));
var import_cors = __toESM(require("cors"));
var import_dotenv2 = __toESM(require("dotenv"));
var import_socket = require("socket.io");

// apps/server/src/db/mongo.ts
var import_mongoose2 = __toESM(require("mongoose"));
var import_dotenv = __toESM(require("dotenv"));
var import_dns = __toESM(require("dns"));

// packages/utils/src/index.ts
var DEFAULT_MATCH_WEIGHTS = {
  coreTechnicalSkills: 35,
  relevantExperience: 25,
  verifiedEvidence: 20,
  domainExperience: 10,
  communication: 5,
  availability: 5
};
function evaluateMatch(candidate, requirement, weights = DEFAULT_MATCH_WEIGHTS) {
  const failedFilters = [];
  const reasons = [];
  const candidateSkillNames = (candidate.skills || []).map((s) => (typeof s === "string" ? s : s.name).toLowerCase());
  const missingRequired = (requirement.requiredSkills || []).filter((reqSkill) => typeof reqSkill === "string" ? true : reqSkill.mandatory !== false).map((reqSkill) => typeof reqSkill === "string" ? reqSkill : reqSkill.name).filter((skillName) => !candidateSkillNames.includes(skillName.toLowerCase()));
  if (missingRequired.length > 0) {
    failedFilters.push(`Missing mandatory skills: ${missingRequired.join(", ")}`);
  }
  if (candidate.totalYearsOfExperience < requirement.minExperienceYears) {
    failedFilters.push(
      `Experience (${candidate.totalYearsOfExperience} yrs) below requirement (${requirement.minExperienceYears} yrs)`
    );
  }
  if (candidate.noticePeriodDays > requirement.maxNoticePeriodDays) {
    failedFilters.push(
      `Notice period (${candidate.noticePeriodDays} days) exceeds allowed (${requirement.maxNoticePeriodDays} days)`
    );
  }
  if (candidate.expectedSalaryUsd > requirement.budgetMaxUsd) {
    failedFilters.push(
      `Expected salary ($${candidate.expectedSalaryUsd}) exceeds maximum budget ($${requirement.budgetMaxUsd})`
    );
  }
  if (candidate.fraudStatus === "HIGH_RISK" || candidate.fraudStatus === "FRAUD_CONFIRMED") {
    failedFilters.push(`Candidate flagged with fraud status: ${candidate.fraudStatus}`);
  }
  const passedHardFilters = failedFilters.length === 0;
  const commWeight = weights.communication || 5;
  const availWeight = weights.availability || weights.timezoneAndCommunication || 5;
  const totalWeight = (weights.coreTechnicalSkills || 35) + (weights.relevantExperience || 25) + (weights.verifiedEvidence || 20) + (weights.domainExperience || 10) + commWeight + availWeight;
  const reqSkillsList = (requirement.requiredSkills || []).map((s) => (typeof s === "string" ? s : s.name).toLowerCase());
  const niceSkillsList = (requirement.niceToHaveSkills || []).map((s) => (typeof s === "string" ? s : s.name).toLowerCase());
  const totalReqSkills = reqSkillsList.length + niceSkillsList.length;
  const matchedRequiredCount = reqSkillsList.filter((s) => candidateSkillNames.includes(s)).length;
  const matchedNiceCount = niceSkillsList.filter((s) => candidateSkillNames.includes(s)).length;
  const skillScoreRaw = totalReqSkills > 0 ? (matchedRequiredCount * 1.5 + matchedNiceCount) / (Math.max(1, reqSkillsList.length) * 1.5 + (niceSkillsList.length || 1)) * 100 : 80;
  const skillScore = Math.min(100, Math.round(skillScoreRaw));
  reasons.push({
    category: "Core Technical Skills",
    satisfied: matchedRequiredCount === requirement.requiredSkills.length,
    score: skillScore,
    detail: `Matched ${matchedRequiredCount}/${requirement.requiredSkills.length} required and ${matchedNiceCount} secondary skills`
  });
  const expDelta = candidate.totalYearsOfExperience - requirement.minExperienceYears;
  const expScore = expDelta >= 3 ? 100 : expDelta >= 1 ? 85 : expDelta === 0 ? 70 : 40;
  reasons.push({
    category: "Relevant Experience",
    satisfied: expDelta >= 0,
    score: expScore,
    detail: `${candidate.totalYearsOfExperience} years vs min ${requirement.minExperienceYears} required`
  });
  const verifiedSkillsCount = candidate.skills.filter((s) => s.isVerified).length;
  const evidenceScore = candidate.verifiedBadge ? verifiedSkillsCount > 3 ? 100 : 90 : 60;
  reasons.push({
    category: "Verified Evidence",
    satisfied: candidate.verifiedBadge,
    score: evidenceScore,
    detail: candidate.verifiedBadge ? `Vetted profile with ${verifiedSkillsCount} verified skills` : "Unverified self-reported skills"
  });
  const roleString = (candidate.primaryRole || candidate.headline || "").toLowerCase();
  const domainScore = roleString.includes((requirement.roleCategory || "").toLowerCase()) ? 95 : 75;
  reasons.push({
    category: "Domain Match",
    satisfied: domainScore > 80,
    score: domainScore,
    detail: `Profile aligned with ${requirement.roleCategory}`
  });
  const commScore = 90;
  reasons.push({
    category: "Communication Readiness",
    satisfied: true,
    score: commScore,
    detail: "Global professional English benchmark standard"
  });
  const availScore = candidate.noticePeriodDays <= 15 ? 100 : candidate.noticePeriodDays <= 30 ? 85 : 65;
  reasons.push({
    category: "Availability & Notice Period",
    satisfied: candidate.noticePeriodDays <= requirement.maxNoticePeriodDays,
    score: availScore,
    detail: `${candidate.noticePeriodDays} days notice period`
  });
  const weightedSum = skillScore * (weights.coreTechnicalSkills || 35) + expScore * (weights.relevantExperience || 25) + evidenceScore * (weights.verifiedEvidence || 20) + domainScore * (weights.domainExperience || 10) + commScore * commWeight + availScore * availWeight;
  const rawOverall = Math.round(weightedSum / Math.max(1, totalWeight));
  const overallScore = passedHardFilters ? rawOverall : 0;
  return {
    passedHardFilters,
    failedFilters,
    overallScore,
    reasons
  };
}
function calculateEvaluatorSuitability(evaluator, requirement, candidate) {
  const expCompanies = (candidate.experience || []).map((e) => (typeof e === "string" ? e : e.company || "").toLowerCase()).filter(Boolean);
  const pastCompanies = (candidate.pastCompanies || []).map((c) => (typeof c === "string" ? c : c.name || "").toLowerCase()).filter(Boolean);
  const candidateCompanies = [.../* @__PURE__ */ new Set([...expCompanies, ...pastCompanies])];
  const evaluatorExEmployers = (evaluator.exEmployers || evaluator.pastCompanies || []).map((e) => (typeof e === "string" ? e : e.name || "").toLowerCase()).filter(Boolean);
  const currentEmployer = (evaluator.currentEmployer || evaluator.currentCompany || "").toLowerCase();
  const companyConflict = candidateCompanies.some(
    (c) => currentEmployer && c === currentEmployer || evaluatorExEmployers.includes(c)
  );
  if (companyConflict) {
    const overlappingEmployer = candidateCompanies.find((c) => currentEmployer && c === currentEmployer || evaluatorExEmployers.includes(c));
    return {
      evaluatorId: evaluator.id,
      isConflict: true,
      conflictReason: `Evaluator has employer overlap with candidate's employment history (${overlappingEmployer})`,
      suitabilityScore: 0,
      breakdown: {
        skillOverlapScore: 0,
        seniorityScore: 0,
        availabilityScore: 0,
        loadBalancingScore: 0,
        calibrationReliabilityScore: 0
      }
    };
  }
  const expertiseTechs = (evaluator.expertise || []).flatMap((exp) => (exp.technologies || []).map((t) => t.toLowerCase()));
  const skillTechs = (evaluator.skills || []).map((s) => (typeof s === "string" ? s : s.name || "").toLowerCase());
  const evaluatorTechs = [.../* @__PURE__ */ new Set([...expertiseTechs, ...skillTechs])];
  const reqSkillsList = (requirement.requiredSkills || []).map((s) => (typeof s === "string" ? s : s.name || "").toLowerCase());
  const matchedSkills = reqSkillsList.filter((rs) => evaluatorTechs.includes(rs));
  const skillOverlapScore = reqSkillsList.length > 0 ? Math.round(matchedSkills.length / reqSkillsList.length * 100) : 80;
  const evaluatorExp = evaluator.yearsOfExperience || evaluator.totalExperienceYears || 10;
  const seniorityScore = evaluatorExp >= requirement.minExperienceYears + 3 ? 100 : 80;
  const activeLoad = evaluator.currentActiveLoad || 1;
  const maxLoad = evaluator.maxConcurrentAssignments || 5;
  const loadPercentage = activeLoad / maxLoad;
  const loadBalancingScore = Math.max(0, Math.round((1 - loadPercentage) * 100));
  const availabilityScore = evaluator.status === "ACTIVE" ? 95 : 40;
  const calibrationReliabilityScore = evaluator.reliabilityScore || evaluator.calibrationScore || 90;
  const suitabilityScore = Math.round(
    skillOverlapScore * 0.35 + seniorityScore * 0.2 + availabilityScore * 0.15 + loadBalancingScore * 0.15 + calibrationReliabilityScore * 0.15
  );
  return {
    evaluatorId: evaluator.id,
    isConflict: false,
    suitabilityScore,
    breakdown: {
      skillOverlapScore,
      seniorityScore,
      availabilityScore,
      loadBalancingScore,
      calibrationReliabilityScore
    }
  };
}
function checkSkillCoverage(requiredSkills, coveredSkills = []) {
  const normalizedCovered = coveredSkills.map((s) => s.toLowerCase());
  const reqSkillNames = (requiredSkills || []).map((s) => typeof s === "string" ? s : s.name);
  const uncoveredSkills = reqSkillNames.filter(
    (s) => !normalizedCovered.includes(s.toLowerCase())
  );
  return {
    fullyCovered: uncoveredSkills.length === 0,
    uncoveredSkills
  };
}
function evaluateQuickMatch(candidate, requirement, evaluation, weights = DEFAULT_MATCH_WEIGHTS) {
  const matchResult = evaluateMatch(candidate, requirement, weights);
  const passedHardFilters = matchResult.passedHardFilters;
  const failedFilters = matchResult.failedFilters;
  if (!evaluation) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: "NO_REUSABLE_EVALUATION",
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons
    };
  }
  const isReusableScope = !evaluation.scope || evaluation.scope === "REUSABLE";
  if (!isReusableScope) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: "NO_REUSABLE_EVALUATION",
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons
    };
  }
  const consentActive = evaluation.consentStatus !== "WITHDRAWN";
  if (!consentActive) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: false,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: "CONSENT_WITHDRAWN",
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons
    };
  }
  const now = /* @__PURE__ */ new Date();
  const isDateExpired = evaluation.expiresAt ? new Date(evaluation.expiresAt) < now : false;
  const isStatusExpired = evaluation.validityStatus === "EXPIRED" || evaluation.status === "EXPIRED";
  const isExpired = isDateExpired || isStatusExpired;
  if (isExpired) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: true,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: "EXPIRED_EVALUATION",
      overallScore: matchResult.overallScore,
      reasons: matchResult.reasons,
      evaluationSummary: {
        evaluationId: evaluation.id,
        overallScore: evaluation.overallScore || 0,
        qaStatus: evaluation.qaStatus || "APPROVED",
        scope: evaluation.scope || "REUSABLE",
        evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt || "",
        expiresAt: evaluation.expiresAt || "",
        coveredSkills: evaluation.coveredSkills || [],
        strengths: evaluation.strengths || [],
        concerns: evaluation.concerns || []
      }
    };
  }
  if (!passedHardFilters) {
    return {
      candidateId: candidate.id,
      requirementId: requirement.id,
      passedHardFilters: false,
      failedFilters,
      isQuickMatchEligible: false,
      isExpired: false,
      consentActive: true,
      isTopUpRequired: false,
      uncoveredSkills: [],
      eligibilityStatus: "HARD_FILTERS_FAILED",
      overallScore: 0,
      reasons: matchResult.reasons
    };
  }
  const coveredSkills = evaluation.coveredSkills && evaluation.coveredSkills.length > 0 ? evaluation.coveredSkills : (candidate.skills || []).map((s) => typeof s === "string" ? s : s.name);
  const { fullyCovered, uncoveredSkills } = checkSkillCoverage(
    requirement.requiredSkills || [],
    coveredSkills
  );
  const isTopUpRequired = !fullyCovered && uncoveredSkills.length > 0;
  return {
    candidateId: candidate.id,
    requirementId: requirement.id,
    passedHardFilters: true,
    failedFilters: [],
    isQuickMatchEligible: true,
    isExpired: false,
    consentActive: true,
    isTopUpRequired,
    uncoveredSkills,
    eligibilityStatus: isTopUpRequired ? "TOP_UP_REQUIRED" : "ELIGIBLE",
    overallScore: matchResult.overallScore,
    reasons: matchResult.reasons,
    evaluationSummary: {
      evaluationId: evaluation.id,
      overallScore: evaluation.overallScore || 85,
      qaStatus: evaluation.qaStatus || "APPROVED",
      scope: evaluation.scope || "REUSABLE",
      evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt || "2026-09-20",
      expiresAt: evaluation.expiresAt || "2027-03-20",
      coveredSkills,
      strengths: evaluation.strengths || ["High throughput concurrency", "Strong system design"],
      concerns: evaluation.concerns || []
    }
  };
}
function sanitizeReusableEvaluation(evaluation) {
  if (!evaluation) return null;
  return {
    id: evaluation.id,
    candidateId: evaluation.candidateId,
    overallScore: evaluation.overallScore,
    verdict: evaluation.verdict,
    scope: evaluation.scope || "REUSABLE",
    status: evaluation.status || evaluation.validityStatus || "VALID",
    qaStatus: evaluation.qaStatus || (evaluation.qaCalibrated ? "APPROVED" : "QA_REVIEW"),
    evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt,
    expiresAt: evaluation.expiresAt,
    consentStatus: evaluation.consentStatus || "ACTIVE",
    coveredSkills: evaluation.coveredSkills || [],
    scores: (evaluation.scores || evaluation.rubricScores || []).map((s) => ({
      criterionName: s.criterionName || s.category,
      score: s.score,
      level: s.level || (s.score >= 8 ? "STRONG" : s.score >= 6 ? "COMPETENT" : "INADEQUATE"),
      evidenceNotes: s.evidenceNotes || s.evidence || ""
    })),
    strengths: evaluation.strengths || [],
    concerns: evaluation.concerns || [],
    summaryFeedback: evaluation.summaryFeedback || evaluation.evidenceNotes || "",
    reuseCount: evaluation.reuseCount || 0,
    lastReusedAt: evaluation.lastReusedAt
  };
}

// packages/config/src/index.ts
var DEFAULT_MATCH_WEIGHTS2 = {
  coreTechnicalSkills: 35,
  relevantExperience: 20,
  verifiedEvidence: 20,
  domainExperience: 10,
  communication: 10,
  availability: 5
};
var EVALUATION_FEE_INR = {
  standard: 3500,
  specialist: 5500,
  leadPrincipal: 7500,
  calibrationBonus: 1e3
};

// apps/server/src/seed/data.ts
var COMPANY_NAMES = [
  { name: "Vanguard FinTech", hq: "New York, USA", industry: "Financial Services", size: "201-500" },
  { name: "CloudScale Systems", hq: "Zurich, Switzerland", industry: "Cloud Infrastructure", size: "51-200" },
  { name: "Helix BioHealth", hq: "San Francisco, USA", industry: "HealthTech & AI", size: "51-200" },
  { name: "Hyperion Robotics", hq: "London, UK", industry: "Automation & Robotics", size: "11-50" },
  { name: "NeoBank Tokyo", hq: "Tokyo, Japan", industry: "Digital Banking", size: "201-500" },
  { name: "CyberVigil Labs", hq: "Toronto, Canada", industry: "Cybersecurity", size: "51-200" },
  { name: "QuantumPay Global", hq: "Sydney, Australia", industry: "Payments Infrastructure", size: "500+" },
  { name: "NordicStream Media", hq: "Stockholm, Sweden", industry: "Streaming & Media", size: "51-200" },
  { name: "Apex Logix", hq: "Singapore", industry: "Supply Chain Tech", size: "51-200" },
  { name: "Synthetix AI", hq: "Austin, USA", industry: "Enterprise AI", size: "11-50" },
  { name: "Aether Mobility", hq: "Berlin, Germany", industry: "Autonomous Transport", size: "201-500" },
  { name: "OmniRetail Commerce", hq: "Chicago, USA", industry: "E-commerce Platforms", size: "500+" },
  { name: "AeroDynamics Aerospace", hq: "Toulouse, France", industry: "Aerospace Software", size: "500+" },
  { name: "Solaria Energy Tech", hq: "Amsterdam, Netherlands", industry: "CleanTech", size: "11-50" },
  { name: "Krypton Data Platform", hq: "Boston, USA", industry: "Big Data & Analytics", size: "51-200" },
  { name: "Zeta Protocol", hq: "Zug, Switzerland", industry: "Distributed Systems", size: "11-50" },
  { name: "Boreal Genomics", hq: "Oslo, Norway", industry: "Bioinformatics", size: "11-50" },
  { name: "Cortex Neural", hq: "Seattle, USA", industry: "Deep Learning", size: "51-200" },
  { name: "PulseTelemetry", hq: "Dublin, Ireland", industry: "IoT & Telemetry", size: "51-200" },
  { name: "Mirage Virtualization", hq: "Tel Aviv, Israel", industry: "Virtual Infrastructure", size: "51-200" },
  { name: "Orbit Satellite Systems", hq: "Denver, USA", industry: "Space Tech", size: "51-200" },
  { name: "Beacon CRM Global", hq: "Atlanta, USA", industry: "Enterprise SaaS", size: "201-500" },
  { name: "Aegis Compliance", hq: "Frankfurt, Germany", industry: "RegTech", size: "51-200" },
  { name: "Zenith Payments", hq: "Auckland, New Zealand", industry: "FinTech", size: "11-50" },
  { name: "Lumina Diagnostics", hq: "San Diego, USA", industry: "Medical Devices", size: "201-500" }
];
function generateSeedData() {
  const users = [];
  const companies = [];
  const candidates = [];
  const evaluators = [];
  const requirements = [];
  const matches = [];
  const evaluations = [];
  const shortlists = [];
  const interviews = [];
  const offers = [];
  const placements = [];
  const invoices = [];
  const payouts = [];
  const auditLogs = [];
  const adminUser = {
    id: "user-admin-1",
    email: "admin@thamilarasanglobal.com",
    firstName: "Thamilarasan",
    lastName: "Director",
    role: "PLATFORM_ADMIN",
    isVerified: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(adminUser);
  COMPANY_NAMES.forEach((c, index) => {
    const id = `comp-${index + 1}`;
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const companyUser = {
      id: `user-company-${index + 1}`,
      email: `talent@${slug}.com`,
      firstName: "Talent",
      lastName: "Leader",
      role: "COMPANY_ADMIN",
      companyId: id,
      isVerified: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    users.push(companyUser);
    companies.push({
      id,
      name: c.name,
      slug,
      website: `https://${slug}.com`,
      headquarters: c.hq,
      country: c.hq.split(", ")[1],
      size: c.size,
      industry: c.industry,
      description: `${c.name} is a world-class ${c.industry} company scaling global high-performance engineering teams.`,
      isVerified: true,
      status: "ACTIVE",
      billingTier: index < 5 ? "ENTERPRISE" : index < 15 ? "GROWTH" : "STANDARD",
      contactEmail: `talent@${slug}.com`,
      createdAt: new Date(Date.now() - (30 - index) * 864e5).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  const DOMAINS = ["Backend", "System Design", "Cloud Architecture", "Frontend", "DevOps & SRE", "Data & AI"];
  const TECH_SETS = [
    ["Node.js", "TypeScript", "AWS", "System Design", "PostgreSQL"],
    ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
    ["Python", "FastAPI", "PyTorch", "Docker", "Kubernetes"],
    ["Go", "Kubernetes", "gRPC", "Terraform", "Microservices"],
    ["Java", "Spring Boot", "Kafka", "AWS", "Distributed Systems"]
  ];
  for (let i = 1; i <= 50; i++) {
    const evalUserId = `user-eval-${i}`;
    const evalId = `evaluator-${i}`;
    const techs = TECH_SETS[(i - 1) % TECH_SETS.length];
    const domain = DOMAINS[(i - 1) % DOMAINS.length];
    const seniority = i % 3 === 0 ? "PRINCIPAL" : i % 2 === 0 ? "STAFF" : "LEAD";
    users.push({
      id: evalUserId,
      email: `evaluator${i}@thamilarasanglobal.eval`,
      firstName: `Expert`,
      lastName: `Evaluator ${i}`,
      role: "EVALUATOR",
      evaluatorId: evalId,
      isVerified: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const expertise = [
      {
        domain,
        technologies: techs,
        seniorityLevel: seniority,
        yearsInDomain: 7 + i % 8
      },
      {
        domain: "System Design",
        technologies: ["Architecture", "Distributed Cache", "Resilience"],
        seniorityLevel: seniority,
        yearsInDomain: 6 + i % 6
      }
    ];
    const availabilitySlots = [
      { dayOfWeek: 1, startTime: "18:00", endTime: "22:00", timezone: "IST" },
      { dayOfWeek: 3, startTime: "18:00", endTime: "22:00", timezone: "IST" },
      { dayOfWeek: 5, startTime: "19:00", endTime: "23:00", timezone: "IST" },
      { dayOfWeek: 6, startTime: "10:00", endTime: "18:00", timezone: "IST" }
    ];
    evaluators.push({
      id: evalId,
      userId: evalUserId,
      fullName: `Arun Subramanian ${i}`,
      title: `${seniority} Software Architect`,
      currentEmployer: `Tier-1 Enterprise ${i % 7 + 1}`,
      yearsOfExperience: 8 + i % 12,
      status: "ACTIVE",
      expertise,
      availabilitySlots,
      completedEvaluationsCount: 15 + i * 3,
      reliabilityScore: 92 + i % 8,
      interRaterAgreementScore: 89 + i % 10,
      passRate: 64 + i % 14,
      totalEarningsInr: (15 + i * 3) * EVALUATION_FEE_INR.standard,
      pendingPayoutInr: i % 2 === 0 ? EVALUATION_FEE_INR.standard * 2 : EVALUATION_FEE_INR.standard,
      currentActiveLoad: i % 4,
      maxConcurrentAssignments: 4,
      exEmployers: [`LegacyCorp ${i % 5}`, `OldCo ${i % 3}`],
      createdAt: new Date(Date.now() - 60 * 864e5).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  const FIRST_NAMES = ["Karthik", "Priya", "Deepak", "Ananya", "Rohan", "Sneha", "Vikram", "Meera", "Aditya", "Divya", "Suresh", "Pooja", "Rahul", "Naveen", "Swati", "Harish", "Lavanya", "Manish", "Bhavna", "Ganesh"];
  const LAST_NAMES = ["Iyer", "Nair", "Sharma", "Patel", "Reddy", "Chatterjee", "Menon", "Rao", "Verma", "Kumar", "Singh", "Deshmukh", "Pillai", "Murthy", "Joshi", "Bose", "Gupta", "Banerjee"];
  const TECH_ROLES = [
    { title: "Senior Node.js Backend Engineer", roleCategory: "Backend Engineering", skills: ["Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker", "System Design"] },
    { title: "Senior React / Full Stack Engineer", roleCategory: "Full Stack", skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "REST"] },
    { title: "DevOps & Cloud Systems Engineer", roleCategory: "DevOps & SRE", skills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Linux"] },
    { title: "Staff Python / AI Platform Engineer", roleCategory: "Data & AI", skills: ["Python", "FastAPI", "PyTorch", "Docker", "AWS", "PostgreSQL"] },
    { title: "Senior Distributed Go Engineer", roleCategory: "Backend Engineering", skills: ["Go", "Kubernetes", "gRPC", "PostgreSQL", "System Design"] }
  ];
  const INDIAN_CITIES = ["Bengaluru, India", "Hyderabad, India", "Pune, India", "Chennai, India", "Gurugram, India", "Noida, India", "Mumbai, India", "Kochi, India"];
  for (let i = 1; i <= 500; i++) {
    const candUserId = `user-cand-${i}`;
    const candId = `cand-${i}`;
    const fn = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const roleConfig = TECH_ROLES[(i - 1) % TECH_ROLES.length];
    const exp = 4 + i % 9;
    const notice = [15, 30, 45, 60][i % 4];
    const city = INDIAN_CITIES[(i - 1) % INDIAN_CITIES.length];
    let state = "VERIFIED";
    if (i <= 40) state = "SELECTED";
    else if (i <= 90) state = "COMPANY_INTERVIEW";
    else if (i <= 180) state = "MATCHED";
    else if (i <= 380) state = "VERIFIED";
    else if (i <= 440) state = "UNDER_REVIEW";
    else if (i <= 480) state = "INTERVIEW_PENDING";
    else state = "SCREENING";
    users.push({
      id: candUserId,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      firstName: fn,
      lastName: ln,
      role: "JOB_SEEKER",
      candidateId: candId,
      isVerified: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const skills = roleConfig.skills.map((sk, idx) => ({
      name: sk,
      yearsOfExperience: Math.max(2, exp - idx),
      level: idx < 2 ? "EXPERT" : idx < 4 ? "ADVANCED" : "INTERMEDIATE",
      isVerified: i % 5 !== 0
    }));
    const experience = [
      {
        title: roleConfig.title,
        company: `Innovate Tech Labs`,
        location: city,
        startDate: "2022-01-01",
        isCurrent: true,
        description: "Architecting high-throughput backend services and microservices handling 20,000+ RPS.",
        technologies: roleConfig.skills.slice(0, 4)
      },
      {
        title: "Software Engineer",
        company: `Global Systems India`,
        location: city,
        startDate: "2019-06-01",
        endDate: "2021-12-31",
        isCurrent: false,
        description: "Built cloud APIs, optimized database queries, and implemented automated test suites.",
        technologies: roleConfig.skills.slice(1, 4)
      }
    ];
    const education = [
      {
        institution: "National Institute of Technology (NIT)",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science & Engineering",
        startYear: 2015,
        endYear: 2019
      }
    ];
    candidates.push({
      id: candId,
      userId: candUserId,
      fullName: `${fn} ${ln}`,
      headline: `${roleConfig.title} | ${exp} yrs exp | ${city}`,
      location: city,
      timezone: "IST (UTC+5:30)",
      state,
      fraudStatus: i === 499 ? "REVIEW" : "CLEAR",
      primaryRole: roleConfig.title,
      totalYearsOfExperience: exp,
      skills,
      experience,
      education,
      expectedSalaryUsd: 55e3 + exp * 5e3,
      currentSalaryInr: 18e5 + exp * 25e4,
      noticePeriodDays: notice,
      availabilityDate: new Date(Date.now() + notice * 864e5).toISOString().split("T")[0],
      engagementType: "FULL_TIME",
      summary: `High-impact ${roleConfig.title} with proven track record designing scalable architectures, robust distributed systems, and clean code for high-growth global platforms.`,
      verifiedBadge: state === "VERIFIED" || state === "MATCHED" || state === "COMPANY_INTERVIEW" || state === "SELECTED",
      matchCount: 3 + i % 4,
      createdAt: new Date(Date.now() - (120 - i % 60) * 864e5).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  requirements.push({
    id: "req-1",
    companyId: "comp-1",
    // Vanguard FinTech
    title: "10 Senior Node.js Engineers",
    roleCategory: "Backend Engineering",
    state: "SHORTLISTED",
    openingsCount: 10,
    filledCount: 2,
    requiredSkills: ["Node.js", "TypeScript", "AWS", "System Design"],
    niceToHaveSkills: ["PostgreSQL", "Docker", "Kubernetes"],
    minExperienceYears: 5,
    maxExperienceYears: 12,
    budgetMinUsd: 65e3,
    budgetMaxUsd: 95e3,
    engagementType: "FULL_TIME",
    timezoneRequirement: "Min 4 hours overlap with US EST",
    maxNoticePeriodDays: 45,
    jobDescription: "We are expanding our core transactional ledger team at Vanguard FinTech. Looking for 10 exceptional Senior Node.js Engineers with deep mastery of asynchronous event loops, distributed locking, AWS serverless and microservices architectures.",
    matchedCount: 84,
    evaluatingCount: 23,
    shortlistCount: 16,
    createdAt: new Date(Date.now() - 14 * 864e5).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  const REQ_PRESETS = [
    { title: "5 Lead React & Next.js Architects", companyId: "comp-2", skills: ["React", "Next.js", "TypeScript"], count: 5, budget: 85e3 },
    { title: "4 Cloud Infrastructure & Kubernetes Specialists", companyId: "comp-3", skills: ["AWS", "Kubernetes", "Terraform"], count: 4, budget: 9e4 },
    { title: "6 Staff Python ML Platform Engineers", companyId: "comp-4", skills: ["Python", "FastAPI", "PyTorch"], count: 6, budget: 1e5 },
    { title: "8 High-Frequency Go Systems Engineers", companyId: "comp-5", skills: ["Go", "Kubernetes", "gRPC"], count: 8, budget: 95e3 },
    { title: "3 Principal Cyber Security Engineers", companyId: "comp-6", skills: ["Security", "Cloud Security", "Kubernetes"], count: 3, budget: 11e4 },
    { title: "5 Distributed Database Engineers", companyId: "comp-7", skills: ["PostgreSQL", "Distributed Systems", "System Design"], count: 5, budget: 9e4 },
    { title: "4 Full Stack TypeScript Engineers", companyId: "comp-8", skills: ["React", "Node.js", "TypeScript"], count: 4, budget: 75e3 },
    { title: "6 Backend Java / Spring Boot Engineers", companyId: "comp-9", skills: ["Java", "Spring Boot", "Kafka"], count: 6, budget: 8e4 },
    { title: "3 Autonomous Robotics Software Leads", companyId: "comp-10", skills: ["Python", "Docker", "System Design"], count: 3, budget: 105e3 },
    { title: "5 Senior Next.js / UI Engineers", companyId: "comp-11", skills: ["React", "Next.js", "Tailwind CSS"], count: 5, budget: 7e4 },
    { title: "4 Reliability Engineers (SRE)", companyId: "comp-12", skills: ["AWS", "Kubernetes", "CI/CD"], count: 4, budget: 85e3 },
    { title: "7 Senior Node.js Microservices Devs", companyId: "comp-13", skills: ["Node.js", "AWS", "TypeScript"], count: 7, budget: 8e4 },
    { title: "3 Data Platform Architects", companyId: "comp-14", skills: ["Python", "Kafka", "PostgreSQL"], count: 3, budget: 95e3 },
    { title: "5 Mobile React Native Engineers", companyId: "comp-15", skills: ["React", "TypeScript", "Mobile"], count: 5, budget: 75e3 },
    { title: "4 Rust Systems Engineers", companyId: "comp-16", skills: ["Rust", "Distributed Systems", "Linux"], count: 4, budget: 115e3 },
    { title: "6 Senior Frontend Engineers", companyId: "comp-17", skills: ["React", "TypeScript", "GraphQL"], count: 6, budget: 75e3 },
    { title: "4 Cloud Security DevSecOps", companyId: "comp-18", skills: ["AWS", "Terraform", "Security"], count: 4, budget: 95e3 },
    { title: "8 Full Stack Node + React Engineers", companyId: "comp-19", skills: ["Node.js", "React", "TypeScript"], count: 8, budget: 82e3 },
    { title: "5 Core Banking Backend Engineers", companyId: "comp-20", skills: ["Java", "Spring Boot", "PostgreSQL"], count: 5, budget: 88e3 }
  ];
  REQ_PRESETS.forEach((rp, idx) => {
    requirements.push({
      id: `req-${idx + 2}`,
      companyId: rp.companyId,
      title: rp.title,
      roleCategory: "Engineering",
      state: idx < 5 ? "SHORTLISTED" : idx < 12 ? "EVALUATING" : "SOURCING",
      openingsCount: rp.count,
      filledCount: Math.min(rp.count, idx % 3),
      requiredSkills: rp.skills,
      niceToHaveSkills: ["Docker", "CI/CD", "System Design"],
      minExperienceYears: 5,
      budgetMinUsd: rp.budget - 15e3,
      budgetMaxUsd: rp.budget + 15e3,
      engagementType: "FULL_TIME",
      timezoneRequirement: "4 hours overlap with EST/GMT",
      maxNoticePeriodDays: 45,
      jobDescription: `Key opportunity for ${rp.title} to deliver mission-critical software capabilities with modern tech stacks and global product autonomy.`,
      matchedCount: 30 + idx * 3,
      evaluatingCount: 10 + idx,
      shortlistCount: 6 + idx % 5,
      createdAt: new Date(Date.now() - (20 - idx) * 864e5).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  const req1 = requirements[0];
  candidates.forEach((cand, idx) => {
    if (idx < 84) {
      const matchRes = evaluateMatch(cand, req1, DEFAULT_MATCH_WEIGHTS2);
      matches.push({
        id: `match-${idx + 1}`,
        requirementId: req1.id,
        candidateId: cand.id,
        companyId: req1.companyId,
        overallScore: matchRes.overallScore,
        passedHardFilters: matchRes.passedHardFilters,
        failedFilters: matchRes.failedFilters,
        reasons: matchRes.reasons,
        status: idx < 16 ? "SHORTLISTED" : idx < 35 ? "EVALUATION_REQUESTED" : "NEW",
        createdAt: new Date(Date.now() - (10 - idx % 7) * 864e5).toISOString()
      });
    }
  });
  for (let i = 1; i <= 50; i++) {
    const evalId = `eval-${i}`;
    const candidate = candidates[i - 1];
    const evaluator = evaluators[(i - 1) % evaluators.length];
    const isApproved = i <= 28;
    const isQaQueue = i > 28 && i <= 38;
    const scores = [
      {
        criterionId: "crit-node",
        criterionName: "Node.js & Concurrency",
        score: 8 + (i % 3 === 0 ? 1 : 0),
        evidenceNotes: "Demonstrated deep mastery of event loops, libuv worker pools, and memory profiling using clinic.js.",
        level: "STRONG"
      },
      {
        criterionId: "crit-arch",
        criterionName: "System Design & Architecture",
        score: 7 + (i % 2 === 0 ? 1 : 0),
        evidenceNotes: "Clear partitioning strategy for sharded PostgreSQL and idempotency keys across distributed queue workers.",
        level: "STRONG"
      },
      {
        criterionId: "crit-aws",
        criterionName: "Cloud & Infrastructure (AWS)",
        score: 8,
        evidenceNotes: "Production experience with ECS Fargate, Lambda, SQS FIFO dead-letter queues, and IAM least-privilege.",
        level: "STRONG"
      },
      {
        criterionId: "crit-comm",
        criterionName: "Communication & Technical Articulation",
        score: 9,
        evidenceNotes: "Articulated architectural trade-offs proactively and received feedback gracefully.",
        level: "EXPERT"
      }
    ];
    const overallScore = Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length * 10);
    evaluations.push({
      id: evalId,
      requirementId: req1.id,
      candidateId: candidate.id,
      evaluatorId: evaluator.id,
      companyId: req1.companyId,
      state: isApproved ? "APPROVED" : isQaQueue ? "QA_REVIEW" : "SUBMITTED",
      scheduledAt: new Date(Date.now() - (12 - i % 8) * 864e5).toISOString(),
      completedAt: new Date(Date.now() - (11 - i % 8) * 864e5).toISOString(),
      durationMinutes: 60,
      overallScore,
      verdict: i % 12 === 0 ? "REVIEW_REQUIRED" : i % 15 === 0 ? "FAIL" : "PASS",
      scores,
      strengths: [
        "Exceptional production debugging competence under high memory pressure",
        "Strong distributed systems intuition with event-driven architectures",
        "Transparent communicator with clear architectural explanations"
      ],
      concerns: i % 4 === 0 ? ["Slightly less exposure to Kubernetes cluster management"] : [],
      summaryFeedback: `Candidate demonstrated solid senior engineering capabilities. Recommended for high-scale backend services.`,
      qaReviewedBy: isApproved ? "user-admin-1" : void 0,
      qaNotes: isApproved ? "Calibration verified. Scores consistent with rubric evidence notes." : void 0,
      qaStatus: isApproved ? "APPROVED" : void 0,
      payoutAmountInr: EVALUATION_FEE_INR.standard,
      conflictDeclared: false,
      createdAt: new Date(Date.now() - (14 - i % 10) * 864e5).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    payouts.push({
      id: `payout-${i}`,
      evaluatorId: evaluator.id,
      evaluationId: evalId,
      amountInr: EVALUATION_FEE_INR.standard,
      status: isApproved ? "PAYABLE" : "QA_ELIGIBLE",
      approvedBy: isApproved ? "user-admin-1" : void 0,
      createdAt: new Date(Date.now() - (10 - i % 8) * 864e5).toISOString()
    });
  }
  const top16Evaluated = evaluations.filter((e) => e.verdict === "PASS" && e.state === "APPROVED").slice(0, 16);
  const shortlistCandidates = top16Evaluated.map((ev, rank) => {
    const cand = candidates.find((c) => c.id === ev.candidateId);
    return {
      candidateId: cand.id,
      candidateName: cand.fullName,
      matchScore: 90 + rank % 8,
      evaluationScore: ev.overallScore || 88,
      rank: rank + 1,
      headline: cand.headline,
      keySkills: cand.skills.slice(0, 4).map((s) => s.name),
      experienceYears: cand.totalYearsOfExperience,
      noticePeriodDays: cand.noticePeriodDays,
      expectedSalaryUsd: cand.expectedSalaryUsd,
      strengths: ev.strengths,
      concerns: ev.concerns,
      status: rank < 3 ? "INTERVIEW_SCHEDULED" : "PENDING_REVIEW"
    };
  });
  shortlists.push({
    id: "shortlist-1",
    requirementId: req1.id,
    companyId: req1.companyId,
    targetCount: 10,
    qualifiedCount: shortlistCandidates.length,
    isDeficit: shortlistCandidates.length < 10,
    candidates: shortlistCandidates,
    generatedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    status: "READY_FOR_COMPANY"
  });
  const candidate1 = candidates[0];
  interviews.push({
    id: "int-1",
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate1.id,
    interviewType: "COMPANY_ROUND_1",
    scheduledAt: new Date(Date.now() + 864e5).toISOString(),
    durationMinutes: 45,
    meetingLink: "https://meet.thamilarasanglobal.com/room/tg-vanguard-session-1",
    status: "SCHEDULED",
    interviewerNames: ["David Miller (VP Engineering)", "Sarah Chen (Tech Lead)"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  const candidate2 = candidates[1];
  interviews.push({
    id: "int-2",
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate2.id,
    interviewType: "COMPANY_ROUND_1",
    scheduledAt: new Date(Date.now() - 3 * 864e5).toISOString(),
    durationMinutes: 45,
    meetingLink: "https://meet.thamilarasanglobal.com/room/tg-vanguard-session-2",
    status: "COMPLETED",
    interviewerNames: ["David Miller (VP Engineering)"],
    feedbackNotes: "Outstanding cultural and technical fit. Approved for immediate offer.",
    companyDecision: "PROCEED_TO_OFFER",
    rating: 5,
    createdAt: new Date(Date.now() - 4 * 864e5).toISOString()
  });
  offers.push({
    id: "offer-1",
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate2.id,
    annualSalaryUsd: 88e3,
    bonusUsd: 1e4,
    equityTerms: "0.05% stock options with 4-year vesting",
    startDate: "2026-10-15",
    expiresAt: "2026-09-30",
    status: "ACCEPTED",
    createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  placements.push({
    id: "place-1",
    requirementId: req1.id,
    companyId: req1.companyId,
    candidateId: candidate2.id,
    offerId: "offer-1",
    state: "ONBOARDING",
    annualSalaryUsd: 88e3,
    platformFeeUsd: 13200,
    // 15% placement fee
    startDate: "2026-10-15",
    guaranteeEndDate: "2027-01-15",
    replacementRequested: false,
    createdAt: new Date(Date.now() - 864e5).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  invoices.push({
    id: "inv-1",
    invoiceNumber: "INV-2026-0089",
    companyId: req1.companyId,
    requirementId: req1.id,
    placementId: "place-1",
    amountUsd: 13200,
    taxUsd: 0,
    totalUsd: 13200,
    dueDate: "2026-10-30",
    status: "ISSUED",
    items: [
      { description: "Placement Fee: Senior Node.js Engineer (Priya Nair)", amountUsd: 13200 }
    ],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  auditLogs.push(
    {
      id: "log-1",
      actorId: "user-company-1",
      actorEmail: "talent@vanguard-fintech.com",
      actorRole: "COMPANY_ADMIN",
      action: "REQUIREMENT_CREATED",
      entity: "HiringRequirement",
      entityId: "req-1",
      newState: { title: "10 Senior Node.js Engineers", count: 10 },
      timestamp: new Date(Date.now() - 14 * 864e5).toISOString()
    },
    {
      id: "log-2",
      actorId: "system",
      actorEmail: "system@thamilarasanglobal.com",
      actorRole: "PLATFORM_OPERATIONS",
      action: "MATCHING_ENGINE_EXECUTED",
      entity: "Match",
      entityId: "req-1",
      newState: { matchesCount: 84 },
      timestamp: new Date(Date.now() - 13 * 864e5).toISOString()
    },
    {
      id: "log-3",
      actorId: "user-admin-1",
      actorEmail: "admin@thamilarasanglobal.com",
      actorRole: "PLATFORM_ADMIN",
      action: "EVALUATOR_ASSIGNED",
      entity: "Evaluation",
      entityId: "eval-1",
      newState: { evaluatorId: "evaluator-1", candidateId: "cand-1" },
      timestamp: new Date(Date.now() - 12 * 864e5).toISOString()
    },
    {
      id: "log-4",
      actorId: "user-eval-1",
      actorEmail: "evaluator1@thamilarasanglobal.eval",
      actorRole: "EVALUATOR",
      action: "SCORECARD_SUBMITTED",
      entity: "Evaluation",
      entityId: "eval-1",
      newState: { verdict: "PASS", score: 88 },
      timestamp: new Date(Date.now() - 11 * 864e5).toISOString()
    },
    {
      id: "log-5",
      actorId: "user-admin-1",
      actorEmail: "admin@thamilarasanglobal.com",
      actorRole: "PLATFORM_ADMIN",
      action: "QA_VERIFIED",
      entity: "Evaluation",
      entityId: "eval-1",
      newState: { qaStatus: "APPROVED" },
      timestamp: new Date(Date.now() - 10 * 864e5).toISOString()
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
    auditLogs
  };
}

// apps/server/src/db/models.ts
var import_mongoose = __toESM(require("mongoose"));
var UserSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, index: true },
    passwordHash: { type: String, default: "$2a$10$e8w6qjX0dG6Xw9w8TqE6z.tEaB3F9wG6Xw9w8TqE6z.tEaB3F9wG" },
    role: { type: String, index: true },
    fullName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    isActive: { type: Boolean, default: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    evaluatorId: { type: String, index: true }
  },
  { strict: false, timestamps: true }
);
var CompanySchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, index: true },
    slug: { type: String, index: true },
    website: { type: String },
    headquarters: { type: String },
    country: { type: String },
    city: { type: String },
    timezone: { type: String },
    size: { type: String },
    industry: { type: String },
    tier: { type: String, default: "GROWTH" },
    billingTier: { type: String, default: "GROWTH" },
    status: { type: String, default: "ACTIVE" },
    logoUrl: { type: String },
    description: { type: String },
    primaryContactEmail: { type: String },
    contactEmail: { type: String },
    activeRequirementsCount: { type: Number, default: 0 },
    totalPlacementsCount: { type: Number, default: 0 }
  },
  { strict: false, timestamps: true }
);
var CandidateSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    fullName: { type: String, index: true },
    headline: { type: String },
    skills: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    totalYearsOfExperience: { type: Number, index: true },
    timezone: { type: String, default: "UTC+5:30" },
    availableHoursStart: { type: Number, default: 12 },
    availableHoursEnd: { type: Number, default: 21 },
    currentSalaryInr: { type: Number },
    expectedSalaryInr: { type: Number },
    expectedSalaryUsd: { type: Number, index: true },
    noticePeriodDays: { type: Number, index: true },
    state: { type: String, default: "VETTED", index: true },
    tier: { type: String, default: "TIER_1" },
    evaluationScore: { type: Number, default: 85, index: true },
    verifiedClaims: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    pastCompanies: { type: [String], default: [] },
    education: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    resumeUrl: { type: String },
    fraudStatus: { type: String, default: "CLEAR" },
    primaryRole: { type: String, default: "Software Engineer" }
  },
  { strict: false, timestamps: true }
);
var EvaluatorSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    fullName: { type: String, index: true },
    headline: { type: String },
    primaryDomains: { type: [String], default: [] },
    skills: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    totalExperienceYears: { type: Number, default: 10 },
    currentCompany: { type: String },
    pastCompanies: { type: [String], default: [] },
    currentEmployer: { type: String },
    exEmployers: { type: [String], default: [] },
    status: { type: String, default: "ACTIVE" },
    hourlyRateInr: { type: Number, default: 5e3 },
    maxWeeklyInterviews: { type: Number, default: 5 },
    completedEvaluationsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 4.9 },
    calibrationScore: { type: Number, default: 95 },
    reliabilityScore: { type: Number, default: 95 },
    passRate: { type: Number, default: 0.65 }
  },
  { strict: false, timestamps: true }
);
var RequirementSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    title: { type: String, index: true },
    roleCategory: { type: String },
    seniority: { type: String },
    requiredSkills: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    niceToHaveSkills: { type: [String], default: [] },
    minExperienceYears: { type: Number },
    budgetMinUsd: { type: Number },
    budgetMaxUsd: { type: Number },
    timezoneRequirement: { type: String },
    minTimezoneOverlapHours: { type: Number, default: 4 },
    maxNoticePeriodDays: { type: Number, default: 30 },
    jobDescription: { type: String, default: "" },
    state: { type: String, default: "MATCHING_ACTIVE", index: true },
    targetShortlistSize: { type: Number, default: 10 }
  },
  { strict: false, timestamps: true }
);
var MatchSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    requirementId: { type: String, index: true },
    candidateId: { type: String, index: true },
    companyId: { type: String, index: true },
    matchSource: { type: String, default: "GLOBAL_EVALUATED", index: true },
    stage1Passed: { type: Boolean },
    stage1FailReasons: { type: [String], default: [] },
    stage2Score: { type: Number, default: 0, index: true },
    stage2Breakdown: { type: import_mongoose.Schema.Types.Mixed },
    isShortlistCandidate: { type: Boolean, default: false },
    rank: { type: Number },
    evaluationId: { type: String, index: true },
    evaluationStatus: { type: String },
    evaluationScope: { type: String },
    consentStatus: { type: String },
    isTopUpRequired: { type: Boolean, default: false },
    uncoveredSkills: { type: [String], default: [] }
  },
  { strict: false, timestamps: true }
);
var EvaluationSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    assignmentId: { type: String },
    requirementId: { type: String, index: true },
    candidateId: { type: String, index: true },
    evaluatorId: { type: String, index: true },
    companyId: { type: String, index: true },
    scope: { type: String, default: "REUSABLE", index: true },
    // REUSABLE | COMPANY_SPECIFIC | TOP_UP
    validityStatus: { type: String, default: "VALID", index: true },
    // VALID | EXPIRING | EXPIRED | REASSESSMENT_REQUIRED | SUSPENDED
    consentStatus: { type: String, default: "ACTIVE", index: true },
    // ACTIVE | WITHDRAWN | PENDING
    status: { type: String, default: "PENDING_EVALUATION", index: true },
    qaStatus: { type: String, default: "SUBMITTED", index: true },
    // SUBMITTED | QA_REVIEW | APPROVED | REASSESSMENT_REQUIRED
    scheduledAt: { type: String },
    evaluatedAt: { type: String },
    completedAt: { type: String },
    expiresAt: { type: String, index: true },
    coveredSkills: { type: [String], default: [] },
    reuseCount: { type: Number, default: 0 },
    lastReusedAt: { type: String },
    companiesUsingEvaluation: { type: [String], default: [] },
    isTopUpRequired: { type: Boolean, default: false },
    uncoveredSkills: { type: [String], default: [] },
    rubricScores: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    overallScore: { type: Number, index: true },
    recommendation: { type: String },
    evidenceNotes: { type: String },
    strengths: { type: [String], default: [] },
    concerns: { type: [String], default: [] },
    qaCalibrated: { type: Boolean, default: false },
    payoutReleased: { type: Boolean, default: false }
  },
  { strict: false, timestamps: true }
);
var ShortlistSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    requirementId: { type: String, index: true },
    companyId: { type: String, index: true },
    targetCount: { type: Number },
    qualifiedCount: { type: Number },
    isDeficit: { type: Boolean, default: false },
    candidates: { type: import_mongoose.Schema.Types.Mixed, default: [] },
    generatedAt: { type: String },
    status: { type: String, default: "READY_FOR_COMPANY" }
  },
  { strict: false, timestamps: true }
);
var InterviewSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    requirementId: { type: String, index: true },
    scheduledAt: { type: String },
    durationMinutes: { type: Number, default: 60 },
    meetingLink: { type: String },
    status: { type: String, default: "SCHEDULED" },
    interviewType: { type: String, default: "FINAL_CLIENT_INTERVIEW" },
    interviewerNames: { type: [String], default: [] },
    feedbackNotes: { type: String, default: "" },
    rating: { type: Number, default: null },
    companyDecision: { type: String, default: null },
    candidateName: { type: String, default: "" },
    candidateRole: { type: String, default: "" },
    candidateHeadline: { type: String, default: "" },
    candidateEmail: { type: String, default: "" }
  },
  { strict: false, timestamps: true }
);
var OfferSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    requirementId: { type: String, index: true },
    annualSalaryUsd: { type: Number },
    signingBonusUsd: { type: Number, default: 0 },
    proposedStartDate: { type: String },
    expiryDate: { type: String },
    status: { type: String, default: "EXTENDED" },
    terms: { type: String, default: "" },
    extendedAt: { type: String },
    respondedAt: { type: String }
  },
  { strict: false, timestamps: true }
);
var PlacementSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    candidateId: { type: String, index: true },
    requirementId: { type: String, index: true },
    offerId: { type: String },
    startDate: { type: String },
    annualSalaryUsd: { type: Number },
    placementFeePercentage: { type: Number, default: 15 },
    feeAmountUsd: { type: Number },
    status: { type: String, default: "ACTIVE_GUARANTEE" },
    guaranteeEndDate: { type: String }
  },
  { strict: false, timestamps: true }
);
var InvoiceSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, index: true },
    placementId: { type: String },
    amountUsd: { type: Number },
    issueDate: { type: String },
    dueDate: { type: String },
    status: { type: String, default: "ISSUED" },
    stripeInvoiceId: { type: String },
    razorpayOrderId: { type: String }
  },
  { strict: false, timestamps: true }
);
var PayoutSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    evaluatorId: { type: String, index: true },
    evaluationId: { type: String },
    amountInr: { type: Number, default: 5e3 },
    status: { type: String, default: "PROCESSING" },
    disbursedAt: { type: String },
    transactionRef: { type: String }
  },
  { strict: false, timestamps: true }
);
var AuditLogSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    action: { type: String, index: true },
    actorId: { type: String },
    actorEmail: { type: String },
    actorRole: { type: String },
    entity: { type: String },
    entityId: { type: String },
    timestamp: { type: String },
    ipAddress: { type: String, default: "127.0.0.1" },
    details: { type: import_mongoose.Schema.Types.Mixed }
  },
  { strict: false, timestamps: true }
);
var CompanyNoteSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    authorId: { type: String },
    authorName: { type: String },
    notes: { type: String, required: true },
    rating: { type: Number }
  },
  { strict: false, timestamps: true }
);
var SupportTicketSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String },
    subject: { type: String, required: true },
    category: { type: String, default: "GENERAL" },
    priority: { type: String, default: "MEDIUM" },
    status: { type: String, default: "OPEN", index: true },
    messages: { type: import_mongoose.Schema.Types.Mixed, default: [] }
  },
  { strict: false, timestamps: true }
);
var CandidateApplicationSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    candidateId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    requirementId: { type: String, required: true, index: true },
    source: {
      type: String,
      enum: ["DIRECT_APPLICATION", "PLATFORM_MATCH", "COMPANY_INVITATION", "RECRUITER_SOURCE"],
      default: "DIRECT_APPLICATION",
      index: true
    },
    status: {
      type: String,
      default: "APPLIED",
      index: true
    },
    appliedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    screeningStatus: { type: String, default: "PENDING" },
    evaluationId: { type: String, index: true },
    shortlistStatus: { type: String, default: "NOT_SHORTLISTED" }
  },
  { strict: false, timestamps: true }
);
CandidateApplicationSchema.index({ companyId: 1, requirementId: 1, candidateId: 1 }, { unique: true });
var EvaluationConflictSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    evaluatorId: { type: String, required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    requirementId: { type: String, index: true },
    companyId: { type: String, index: true },
    conflictReason: { type: String, required: true },
    detectedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  { strict: false, timestamps: true }
);
var GoogleIntegrationSchema = new import_mongoose.Schema(
  {
    companyId: { type: String, required: true, unique: true, index: true },
    isConnected: { type: Boolean, default: false },
    calendarEmail: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: String },
    lastSyncAt: { type: String }
  },
  { strict: false, timestamps: true }
);
var UserModel = import_mongoose.default.models.User || import_mongoose.default.model("User", UserSchema);
var CompanyModel = import_mongoose.default.models.Company || import_mongoose.default.model("Company", CompanySchema);
var CandidateModel = import_mongoose.default.models.Candidate || import_mongoose.default.model("Candidate", CandidateSchema);
var EvaluatorModel = import_mongoose.default.models.Evaluator || import_mongoose.default.model("Evaluator", EvaluatorSchema);
var RequirementModel = import_mongoose.default.models.Requirement || import_mongoose.default.model("Requirement", RequirementSchema);
var MatchModel = import_mongoose.default.models.Match || import_mongoose.default.model("Match", MatchSchema);
var EvaluationModel = import_mongoose.default.models.Evaluation || import_mongoose.default.model("Evaluation", EvaluationSchema);
var ShortlistModel = import_mongoose.default.models.Shortlist || import_mongoose.default.model("Shortlist", ShortlistSchema);
var InterviewModel = import_mongoose.default.models.Interview || import_mongoose.default.model("Interview", InterviewSchema);
var OfferModel = import_mongoose.default.models.Offer || import_mongoose.default.model("Offer", OfferSchema);
var PlacementModel = import_mongoose.default.models.Placement || import_mongoose.default.model("Placement", PlacementSchema);
var InvoiceModel = import_mongoose.default.models.Invoice || import_mongoose.default.model("Invoice", InvoiceSchema);
var PayoutModel = import_mongoose.default.models.Payout || import_mongoose.default.model("Payout", PayoutSchema);
var AuditLogModel = import_mongoose.default.models.AuditLog || import_mongoose.default.model("AuditLog", AuditLogSchema);
var CompanyNoteModel = import_mongoose.default.models.CompanyNote || import_mongoose.default.model("CompanyNote", CompanyNoteSchema);
var SupportTicketModel = import_mongoose.default.models.SupportTicket || import_mongoose.default.model("SupportTicket", SupportTicketSchema);
var CandidateApplicationModel = import_mongoose.default.models.CandidateApplication || import_mongoose.default.model("CandidateApplication", CandidateApplicationSchema);
var EvaluationConflictModel = import_mongoose.default.models.EvaluationConflict || import_mongoose.default.model("EvaluationConflict", EvaluationConflictSchema);
var GoogleIntegrationModel = import_mongoose.default.models.GoogleIntegration || import_mongoose.default.model("GoogleIntegration", GoogleIntegrationSchema);
function buildIdQuery(id) {
  const ids = [id];
  if (id.startsWith("eval-")) ids.push(id.replace("eval-", "evaluator-"));
  if (id.startsWith("evaluator-")) ids.push(id.replace("evaluator-", "eval-"));
  if (id.startsWith("cand-")) ids.push(id.replace("cand-", "candidate-"));
  if (id.startsWith("candidate-")) ids.push(id.replace("candidate-", "cand-"));
  if (id.startsWith("comp-")) ids.push(id.replace("comp-", "company-"));
  if (id.startsWith("company-")) ids.push(id.replace("company-", "comp-"));
  if (import_mongoose.default.isValidObjectId(id)) {
    return { $or: [...ids.map((i) => ({ id: i })), { _id: id }] };
  }
  return { $or: ids.map((i) => ({ id: i })) };
}

// apps/server/src/db/seedAtlas.ts
async function seedAtlasIfNeeded() {
  try {
    const seed = generateSeedData();
    const [compCount, evalCount, reqCount, userCount, candCount, appCount, shortlistCount] = await Promise.all([
      CompanyModel.countDocuments(),
      EvaluatorModel.countDocuments(),
      RequirementModel.countDocuments(),
      UserModel.countDocuments(),
      CandidateModel.countDocuments(),
      CandidateApplicationModel.countDocuments(),
      ShortlistModel.countDocuments()
    ]);
    if (compCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.companies.length} companies...`);
      await CompanyModel.insertMany(seed.companies, { ordered: false }).catch((err) => console.warn("Companies insert:", err.message));
    }
    if (evalCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.evaluators.length} evaluators...`);
      await EvaluatorModel.insertMany(seed.evaluators, { ordered: false }).catch((err) => console.warn("Evaluators insert:", err.message));
    }
    if (reqCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.requirements.length} requirements...`);
      await RequirementModel.insertMany(seed.requirements, { ordered: false }).catch((err) => console.warn("Requirements insert:", err.message));
    }
    if (candCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.candidates.length} candidates...`);
      await CandidateModel.insertMany(seed.candidates, { ordered: false }).catch((err) => console.warn("Candidates insert:", err.message));
    }
    if (userCount === 0) {
      console.log(`[MongoDB Atlas] Seeding ${seed.users.length} users...`);
      const mappedUsers = seed.users.map((u) => ({
        ...u,
        fullName: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Platform User",
        passwordHash: u.passwordHash || "$2a$10$e8w6qjX0dG6Xw9w8TqE6z.tEaB3F9wG6Xw9w8TqE6z.tEaB3F9wG",
        isActive: u.isActive !== void 0 ? u.isActive : true
      }));
      await UserModel.insertMany(mappedUsers, { ordered: false }).catch((err) => console.warn("Users insert:", err.message));
    }
    const existingReusableCount = await EvaluationModel.countDocuments({ scope: "REUSABLE" });
    if (existingReusableCount === 0) {
      console.log("[MongoDB Atlas] Seeding Reusable Evaluations for Global Evaluated Talent Pool...");
      const reusableEvalsToInsert = [];
      const candidates = await CandidateModel.find().limit(40).lean();
      for (let i = 0; i < Math.min(31, candidates.length); i++) {
        const cand = candidates[i];
        let validityStatus = "VALID";
        let consentStatus = "ACTIVE";
        let evaluatedAt = "2026-09-20T10:00:00.000Z";
        let expiresAt = "2027-03-20T10:00:00.000Z";
        if (i >= 20 && i < 28) {
          validityStatus = "EXPIRED";
          evaluatedAt = "2025-08-15T10:00:00.000Z";
          expiresAt = "2026-02-15T10:00:00.000Z";
        } else if (i >= 28) {
          consentStatus = "WITHDRAWN";
        }
        reusableEvalsToInsert.push({
          id: `eval-reusable-${cand.id}`,
          candidateId: cand.id,
          requirementId: "req-global-benchmark",
          evaluatorId: `evaluator-${i % 5 + 1}`,
          companyId: `comp-${i % 3 + 2}`,
          // originally evaluated for another company!
          scope: "REUSABLE",
          validityStatus,
          consentStatus,
          status: validityStatus === "EXPIRED" ? "EXPIRED" : "COMPLETED",
          qaStatus: "APPROVED",
          qaCalibrated: true,
          evaluatedAt,
          expiresAt,
          coveredSkills: ["Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"],
          reuseCount: i === 0 ? 3 : i < 5 ? 1 : 0,
          lastReusedAt: i === 0 ? "2026-09-18T14:30:00.000Z" : void 0,
          overallScore: 94 - i % 8,
          rubricScores: [
            { criterionName: "Node.js & Concurrency", score: 9, level: "EXPERT", evidenceNotes: "Mastery of event loops & profiling" },
            { criterionName: "System Design & Architecture", score: 8, level: "STRONG", evidenceNotes: "Strong sharding & queue patterns" },
            { criterionName: "Cloud & AWS", score: 9, level: "EXPERT", evidenceNotes: "ECS Fargate, Lambda, IAM" },
            { criterionName: "Communication", score: 9, level: "EXPERT", evidenceNotes: "Crisp articulation of trade-offs" }
          ],
          strengths: ["High throughput concurrency", "Strong system design", "Clear technical communication"],
          concerns: [],
          summaryFeedback: "Exemplary backend engineer with production-grade distributed systems track record."
        });
      }
      await EvaluationModel.insertMany(reusableEvalsToInsert, { ordered: false }).catch(
        (err) => console.warn("Reusable evaluations insert:", err.message)
      );
    }
    if (appCount === 0) {
      console.log("[MongoDB Atlas] Seeding 47 Candidate Applications for Vanguard FinTech (comp-1)...");
      const candidates = await CandidateModel.find().lean();
      const applicationsToInsert = [];
      for (let i = 0; i < Math.min(47, candidates.length); i++) {
        const cand = candidates[i];
        if (cand.id === "cand-2") continue;
        let status = "APPLIED";
        if (i < 10) status = "SHORTLISTED";
        else if (i < 18) status = "EVALUATING";
        else if (i < 30) status = "SCREENING";
        applicationsToInsert.push({
          id: `app-req1-${cand.id}`,
          candidateId: cand.id,
          companyId: "comp-1",
          requirementId: "req-1",
          source: i === 0 ? "COMPANY_INVITATION" : i < 15 ? "PLATFORM_MATCH" : "DIRECT_APPLICATION",
          status,
          appliedAt: new Date(Date.now() - (47 - i) * 36e5 * 6).toISOString(),
          screeningStatus: i < 30 ? "PASSED" : "PENDING",
          shortlistStatus: i < 10 ? "SHORTLISTED" : "NOT_SHORTLISTED"
        });
      }
      await CandidateApplicationModel.insertMany(applicationsToInsert, { ordered: false }).catch(
        (err) => console.warn("Applications insert:", err.message)
      );
    }
    if (shortlistCount === 0) {
      console.log("[MongoDB Atlas] Seeding Decision Shortlists with Non-Fabrication Deficit demonstration...");
      const candidates = await CandidateModel.find().limit(20).lean();
      const req1Candidates = candidates.slice(0, 10).map((cand, idx) => ({
        candidateId: cand.id,
        candidateName: cand.fullName,
        matchScore: 94 - idx,
        evaluationScore: 92 - idx,
        rank: idx + 1,
        headline: cand.headline,
        keySkills: (cand.skills || []).slice(0, 4).map((s) => typeof s === "string" ? s : s.name),
        experienceYears: cand.totalYearsOfExperience,
        noticePeriodDays: cand.noticePeriodDays,
        expectedSalaryUsd: cand.expectedSalaryUsd,
        strengths: ["High throughput concurrency", "Strong system design", "Clean test-driven architecture"],
        concerns: idx > 6 ? ["Secondary experience in Kafka"] : [],
        status: idx < 3 ? "INTERVIEW_SCHEDULED" : "PENDING_REVIEW"
      }));
      const req2Candidates = candidates.slice(0, 7).map((cand, idx) => ({
        candidateId: cand.id,
        candidateName: cand.fullName,
        matchScore: 95 - idx * 2,
        evaluationScore: 90 - idx,
        rank: idx + 1,
        headline: cand.headline,
        keySkills: ["Distributed Systems", "Go", "Kubernetes", "gRPC"],
        experienceYears: cand.totalYearsOfExperience,
        noticePeriodDays: cand.noticePeriodDays,
        expectedSalaryUsd: cand.expectedSalaryUsd,
        strengths: ["Consensus algorithms (Raft)", "Low-latency networking"],
        concerns: [],
        status: "PENDING_REVIEW"
      }));
      await ShortlistModel.insertMany([
        {
          id: "shortlist-req-1",
          requirementId: "req-1",
          companyId: "comp-1",
          targetCount: 10,
          qualifiedCount: 10,
          isDeficit: false,
          candidates: req1Candidates,
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "READY_FOR_COMPANY"
        },
        {
          id: "shortlist-req-2",
          requirementId: "req-2",
          companyId: "comp-1",
          targetCount: 10,
          qualifiedCount: 7,
          isDeficit: true,
          // Non-fabrication deficit demonstration
          candidates: req2Candidates,
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "READY_FOR_COMPANY"
        }
      ]);
    }
    const [interviewCount, offerCount, placementCount, invoiceCount] = await Promise.all([
      InterviewModel.countDocuments(),
      OfferModel.countDocuments(),
      PlacementModel.countDocuments(),
      InvoiceModel.countDocuments()
    ]);
    if (interviewCount === 0 && seed.interviews?.length) {
      await InterviewModel.insertMany(seed.interviews, { ordered: false }).catch((err) => console.warn("Interviews insert:", err.message));
    }
    if (offerCount === 0 && seed.offers?.length) {
      await OfferModel.insertMany(seed.offers, { ordered: false }).catch((err) => console.warn("Offers insert:", err.message));
    }
    if (placementCount === 0 && seed.placements?.length) {
      await PlacementModel.insertMany(seed.placements, { ordered: false }).catch((err) => console.warn("Placements insert:", err.message));
    }
    if (invoiceCount === 0 && seed.invoices?.length) {
      await InvoiceModel.insertMany(seed.invoices, { ordered: false }).catch((err) => console.warn("Invoices insert:", err.message));
    }
    console.log("[MongoDB Atlas] \u2705 Database status verified & populated across all collections.");
  } catch (error) {
    console.error("[MongoDB Atlas] Error checking/seeding database:", error);
  }
}

// apps/server/src/db/mongo.ts
import_dotenv.default.config();
if (process.platform === "win32" && !process.env.VERCEL) {
  try {
    import_dns.default.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  } catch (e) {
  }
}
async function connectMongo() {
  if (import_mongoose2.default.connection.readyState >= 1) {
    return true;
  }
  const uri = process.env.MONGODB_URI || "mongodb+srv://thamilprakasam2005:appichithamil@cluster0.qqwny.mongodb.net/TAglobal?appName=Cluster0";
  if (!uri) {
    console.warn("[MongoDB Atlas] No MONGODB_URI provided in environment variables.");
    return false;
  }
  try {
    console.log("[MongoDB Atlas] Connecting to MongoDB Atlas cluster...");
    await import_mongoose2.default.connect(uri, {
      serverSelectionTimeoutMS: 8e3
    });
    console.log("[MongoDB Atlas] \u2705 Connected successfully to MongoDB Atlas (database: anthurium)!");
    await seedAtlasIfNeeded();
    return true;
  } catch (error) {
    console.error("[MongoDB Atlas] \u274C Failed to connect to MongoDB Atlas:", error.message || error);
    return false;
  }
}

// apps/server/src/routes/auth.ts
var import_express = require("express");

// packages/auth/src/index.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_bcryptjs = __toESM(require("bcryptjs"));
var JWT_SECRET = process.env.JWT_SECRET || "thamilarasan-global-secure-key-2026-jwt-token";
var JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "thamilarasan-global-refresh-key-2026-token";
function signAccessToken(payload) {
  return import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
function verifyAccessToken(token) {
  try {
    return import_jsonwebtoken.default.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// apps/server/src/middleware/auth.ts
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
  req.user = payload;
  next();
}
function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

// apps/server/src/routes/auth.ts
var authRouter = (0, import_express.Router)();
authRouter.post("/login", async (req, res) => {
  try {
    const { email, role } = req.body;
    let user = null;
    if (email) {
      user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    }
    if (!user && role) {
      user = await UserModel.findOne({ role }).lean();
    }
    if (!user) {
      user = await UserModel.findOne().lean();
    }
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found in MongoDB Atlas" });
    }
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      candidateId: user.candidateId,
      evaluatorId: user.evaluatorId
    });
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "USER_LOGIN",
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      entity: "User",
      entityId: user.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress: req.ip || "127.0.0.1"
    });
    return res.json({
      success: true,
      data: {
        token,
        user
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
authRouter.get("/me", authenticate, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized session" });
    }
    const user = await UserModel.findOne(buildIdQuery(req.user.userId)).lean();
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found in MongoDB Atlas" });
    }
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
authRouter.patch("/me", authenticate, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized session" });
    }
    const { firstName, lastName, fullName, phoneNumber, title } = req.body;
    const updates = {};
    if (firstName !== void 0) updates.firstName = firstName;
    if (lastName !== void 0) updates.lastName = lastName;
    if (fullName !== void 0) updates.fullName = fullName;
    else if (firstName || lastName) updates.fullName = `${firstName || ""} ${lastName || ""}`.trim();
    if (phoneNumber !== void 0) updates.phoneNumber = phoneNumber;
    if (title !== void 0) updates.title = title;
    const user = await UserModel.findOneAndUpdate(
      buildIdQuery(req.user.userId),
      { $set: { ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
      { new: true }
    ).lean();
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/companies.ts
var import_express2 = require("express");
var companiesRouter = (0, import_express2.Router)();
companiesRouter.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      const s = String(search);
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { domain: { $regex: s, $options: "i" } },
        { city: { $regex: s, $options: "i" } }
      ];
    }
    const companies = await CompanyModel.find(query).lean();
    return res.json({
      success: true,
      data: companies,
      total: companies.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companiesRouter.get("/:id", async (req, res) => {
  try {
    const company = await CompanyModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!company) {
      return res.status(404).json({ success: false, error: "Company not found in MongoDB Atlas" });
    }
    const [activeRequirements, placementsCount] = await Promise.all([
      RequirementModel.find({ companyId: company.id }).lean(),
      PlacementModel.countDocuments({ companyId: company.id })
    ]);
    return res.json({
      success: true,
      data: {
        ...company,
        activeRequirements,
        placementsCount
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/candidates.ts
var import_express3 = require("express");
var candidatesRouter = (0, import_express3.Router)();
candidatesRouter.get("/", async (req, res) => {
  try {
    const { search, state, skill, page = "1", limit = "20" } = req.query;
    const query = {};
    if (search) {
      const s = String(search);
      query.$or = [
        { fullName: { $regex: s, $options: "i" } },
        { headline: { $regex: s, $options: "i" } },
        { primaryRole: { $regex: s, $options: "i" } }
      ];
    }
    if (state) {
      query.state = state;
    }
    if (skill) {
      query["skills.name"] = { $regex: String(skill), $options: "i" };
    }
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const l = Math.max(1, parseInt(String(limit), 10) || 20);
    const [total, candidates] = await Promise.all([
      CandidateModel.countDocuments(query),
      CandidateModel.find(query).skip((p - 1) * l).limit(l).lean()
    ]);
    return res.json({
      success: true,
      data: candidates,
      total,
      page: p,
      limit: l
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
candidatesRouter.get("/:id", async (req, res) => {
  try {
    const candidate = await CandidateModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!candidate) {
      return res.status(404).json({ success: false, error: "Candidate not found in MongoDB Atlas" });
    }
    const [evaluations, interviews] = await Promise.all([
      EvaluationModel.find({ candidateId: candidate.id }).lean(),
      InterviewModel.find({ candidateId: candidate.id }).lean()
    ]);
    return res.json({
      success: true,
      data: {
        ...candidate,
        evaluations,
        interviews
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/evaluators.ts
var import_express4 = require("express");
var evaluatorsRouter = (0, import_express4.Router)();
evaluatorsRouter.get("/", async (req, res) => {
  try {
    const { search, domain } = req.query;
    const query = {};
    if (search) {
      const s = String(search);
      query.$or = [
        { fullName: { $regex: s, $options: "i" } },
        { headline: { $regex: s, $options: "i" } },
        { currentCompany: { $regex: s, $options: "i" } }
      ];
    }
    if (domain) {
      query.primaryDomains = { $regex: String(domain), $options: "i" };
    }
    const evaluators = await EvaluatorModel.find(query).lean();
    return res.json({
      success: true,
      data: evaluators,
      total: evaluators.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
evaluatorsRouter.get("/:id", async (req, res) => {
  try {
    const evaluator = await EvaluatorModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!evaluator) {
      return res.status(404).json({ success: false, error: "Evaluator not found in MongoDB Atlas" });
    }
    const [assignments, payouts] = await Promise.all([
      EvaluationModel.find({ evaluatorId: evaluator.id }).lean(),
      PayoutModel.find({ evaluatorId: evaluator.id }).lean()
    ]);
    return res.json({
      success: true,
      data: {
        ...evaluator,
        assignments,
        payouts
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/requirements.ts
var import_express5 = require("express");
var requirementsRouter = (0, import_express5.Router)();
requirementsRouter.get("/", async (req, res) => {
  try {
    const { companyId, state, search } = req.query;
    const query = {};
    if (companyId) query.companyId = companyId;
    if (state) query.state = state;
    if (search) {
      const s = String(search);
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { roleCategory: { $regex: s, $options: "i" } }
      ];
    }
    const requirements = await RequirementModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: requirements,
      total: requirements.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
requirementsRouter.get("/:id", async (req, res) => {
  try {
    const reqItem = await RequirementModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!reqItem) {
      return res.status(404).json({ success: false, error: "Requirement not found in MongoDB Atlas" });
    }
    const [matches, evaluations, shortlist] = await Promise.all([
      MatchModel.find({ requirementId: reqItem.id }).lean(),
      EvaluationModel.find({ requirementId: reqItem.id }).lean(),
      ShortlistModel.findOne({ requirementId: reqItem.id }).lean()
    ]);
    return res.json({
      success: true,
      data: {
        ...reqItem,
        matches,
        evaluations,
        shortlist
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
requirementsRouter.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      title,
      roleCategory = "Backend Engineering",
      openingsCount = 10,
      requiredSkills = ["Node.js", "TypeScript", "AWS"],
      niceToHaveSkills = ["Docker", "System Design"],
      minExperienceYears = 5,
      maxExperienceYears = 12,
      budgetMinUsd = 65e3,
      budgetMaxUsd = 95e3,
      engagementType = "FULL_TIME",
      timezoneRequirement = "Min 4 hours overlap with EST",
      maxNoticePeriodDays = 45,
      jobDescription,
      companyId = req.user?.companyId || "comp-1"
    } = req.body;
    const newReqId = `req-${Date.now()}`;
    const newReqData = {
      id: newReqId,
      companyId,
      title,
      roleCategory,
      state: "MATCHING_ACTIVE",
      openingsCount: Number(openingsCount),
      filledCount: 0,
      requiredSkills,
      niceToHaveSkills,
      minExperienceYears: Number(minExperienceYears),
      maxExperienceYears: Number(maxExperienceYears),
      budgetMinUsd: Number(budgetMinUsd),
      budgetMaxUsd: Number(budgetMaxUsd),
      engagementType,
      timezoneRequirement,
      maxNoticePeriodDays: Number(maxNoticePeriodDays),
      jobDescription: jobDescription || `Strategic hiring requirement for ${title}`,
      matchedCount: 0,
      evaluatingCount: 0,
      shortlistCount: 0
    };
    const allCandidates = await CandidateModel.find().lean();
    const generatedMatches = [];
    allCandidates.forEach((cand) => {
      const matchRes = evaluateMatch(cand, newReqData, DEFAULT_MATCH_WEIGHTS2);
      if (matchRes.overallScore >= 60) {
        generatedMatches.push({
          id: `match-${newReqId}-${cand.id}`,
          requirementId: newReqId,
          candidateId: cand.id,
          stage1Passed: matchRes.passedHardFilters,
          stage1FailReasons: matchRes.failedFilters,
          stage2Score: matchRes.overallScore,
          isShortlistCandidate: matchRes.passedHardFilters && matchRes.overallScore >= 80
        });
      }
    });
    generatedMatches.sort((a, b) => b.stage2Score - a.stage2Score);
    if (generatedMatches.length > 0) {
      await MatchModel.insertMany(generatedMatches);
    }
    newReqData.matchedCount = generatedMatches.length;
    const eligibleCandidates = generatedMatches.filter((m) => m.stage1Passed).slice(0, Math.min(20, openingsCount * 2));
    const allEvaluators = await EvaluatorModel.find({ status: "ACTIVE" }).lean();
    const evaluationsToCreate = [];
    for (const match of eligibleCandidates) {
      const cand = allCandidates.find((c) => c.id === match.candidateId);
      if (!cand) continue;
      const scoredEvaluators = allEvaluators.map((ev) => calculateEvaluatorSuitability(ev, newReqData, cand)).filter((s) => !s.isConflict).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
      if (scoredEvaluators.length > 0) {
        const bestEvaluator = scoredEvaluators[0];
        evaluationsToCreate.push({
          id: `eval-${Date.now()}-${cand.id}`,
          requirementId: newReqId,
          candidateId: cand.id,
          evaluatorId: bestEvaluator.evaluatorId,
          status: "PENDING_EVALUATION",
          scheduledAt: new Date(Date.now() + 864e5).toISOString(),
          rubricScores: [],
          overallScore: 0,
          strengths: [],
          concerns: [],
          qaCalibrated: false,
          payoutReleased: false
        });
      }
    }
    if (evaluationsToCreate.length > 0) {
      await EvaluationModel.insertMany(evaluationsToCreate);
    }
    newReqData.evaluatingCount = evaluationsToCreate.length;
    const createdReq = await RequirementModel.create(newReqData);
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "REQUIREMENT_CREATED_AND_MATCHED",
      actorId: req.user?.userId || "system",
      actorEmail: req.user?.email || "admin@thamilarasan.global",
      actorRole: req.user?.role || "SUPER_ADMIN",
      entity: "HiringRequirement",
      entityId: newReqId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { title, openingsCount, matchedCount: generatedMatches.length, evaluationsCreated: evaluationsToCreate.length }
    });
    return res.status(201).json({
      success: true,
      data: createdReq,
      message: `Requirement created in MongoDB Atlas. Matched ${generatedMatches.length} candidates, assigned ${evaluationsToCreate.length} evaluations.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/evaluations.ts
var import_express6 = require("express");
var evaluationsRouter = (0, import_express6.Router)();
evaluationsRouter.get("/", async (req, res) => {
  try {
    const { requirementId, evaluatorId, candidateId, status } = req.query;
    const query = {};
    if (requirementId) {
      const rid = String(requirementId);
      const alt = rid.startsWith("req-") ? rid.replace("req-", "requirement-") : rid.replace("requirement-", "req-");
      query.requirementId = { $in: [rid, alt] };
    }
    if (evaluatorId) {
      const eid = String(evaluatorId);
      const alt = eid.startsWith("eval-") ? eid.replace("eval-", "evaluator-") : eid.replace("evaluator-", "eval-");
      query.evaluatorId = { $in: [eid, alt] };
    }
    if (candidateId) {
      const cid = String(candidateId);
      const alt = cid.startsWith("cand-") ? cid.replace("cand-", "candidate-") : cid.replace("candidate-", "cand-");
      query.candidateId = { $in: [cid, alt] };
    }
    if (status) query.status = status;
    const evaluations = await EvaluationModel.find(query).lean();
    return res.json({
      success: true,
      data: evaluations,
      total: evaluations.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
evaluationsRouter.get("/:id", async (req, res) => {
  try {
    const evaluation = await EvaluationModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!evaluation) {
      return res.status(404).json({ success: false, error: "Evaluation not found in MongoDB Atlas" });
    }
    const [candidate, evaluator, requirement] = await Promise.all([
      CandidateModel.findOne({ id: evaluation.candidateId }).lean(),
      EvaluatorModel.findOne({ id: evaluation.evaluatorId }).lean(),
      RequirementModel.findOne({ id: evaluation.requirementId }).lean()
    ]);
    return res.json({
      success: true,
      data: {
        ...evaluation,
        candidate,
        evaluator,
        requirement
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
evaluationsRouter.post("/:id/scorecard", optionalAuth, async (req, res) => {
  try {
    const evaluation = await EvaluationModel.findOne(buildIdQuery(req.params.id));
    if (!evaluation) {
      return res.status(404).json({ success: false, error: "Evaluation not found in MongoDB Atlas" });
    }
    const {
      scores,
      verdict = "PASS",
      strengths = [],
      concerns = [],
      evidenceNotes = "Comprehensive technical interview completed with verified coding rubric."
    } = req.body;
    const previousStatus = evaluation.status;
    evaluation.status = "PENDING_QA";
    evaluation.rubricScores = scores || [
      { criterionName: "Problem Solving & Algorithms", score: 9 },
      { criterionName: "System Architecture & Concurrency", score: 9 },
      { criterionName: "Code Cleanliness & Production Quality", score: 8 },
      { criterionName: "Technical Communication", score: 9 }
    ];
    evaluation.recommendation = verdict;
    evaluation.strengths = strengths.length > 0 ? strengths : ["Deep Raft consensus knowledge", "Zero race condition concurrency"];
    evaluation.concerns = concerns;
    evaluation.evidenceNotes = evidenceNotes;
    evaluation.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (evaluation.rubricScores.length > 0) {
      const avgScore = evaluation.rubricScores.reduce((sum, s) => sum + (Number(s.score) || 8), 0) / evaluation.rubricScores.length;
      evaluation.overallScore = Math.round(avgScore * 10);
    }
    await evaluation.save();
    await PayoutModel.findOneAndUpdate(
      { evaluationId: evaluation.id },
      {
        id: `payout-${Date.now()}`,
        evaluatorId: evaluation.evaluatorId,
        evaluationId: evaluation.id,
        amountInr: 5e3,
        status: "HELD_IN_ESCROW"
      },
      { upsert: true, new: true }
    );
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "SCORECARD_LOCKED_SUBMITTED",
      actorId: req.user?.userId || evaluation.evaluatorId,
      actorEmail: req.user?.email || "evaluator@thamilarasan.global",
      actorRole: req.user?.role || "EVALUATOR",
      entity: "Evaluation",
      entityId: evaluation.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { previousStatus, newStatus: evaluation.status, overallScore: evaluation.overallScore, recommendation: verdict }
    });
    return res.json({
      success: true,
      data: evaluation,
      message: "Scorecard saved to MongoDB Atlas and routed to QA Calibration queue."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
evaluationsRouter.post("/:id/qa", optionalAuth, async (req, res) => {
  try {
    const evaluation = await EvaluationModel.findOne(buildIdQuery(req.params.id));
    if (!evaluation) {
      return res.status(404).json({ success: false, error: "Evaluation not found in MongoDB Atlas" });
    }
    const { status = "CALIBRATED" } = req.body;
    evaluation.status = status;
    evaluation.qaCalibrated = true;
    evaluation.payoutReleased = true;
    await evaluation.save();
    await CandidateModel.updateOne(
      { id: evaluation.candidateId },
      { $set: { state: "QUALIFIED", evaluationScore: evaluation.overallScore } }
    );
    await PayoutModel.updateOne(
      { evaluationId: evaluation.id },
      {
        $set: {
          status: "DISBURSED",
          disbursedAt: (/* @__PURE__ */ new Date()).toISOString(),
          transactionRef: `TXN-IMPS-${Date.now()}`
        }
      }
    );
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "QA_CALIBRATED_PAYOUT_RELEASED",
      actorId: req.user?.userId || "admin",
      actorEmail: req.user?.email || "qa@thamilarasan.global",
      actorRole: req.user?.role || "SUPER_ADMIN",
      entity: "Evaluation",
      entityId: evaluation.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { status, payoutAmountInr: 5e3, payoutStatus: "DISBURSED" }
    });
    return res.json({
      success: true,
      data: evaluation,
      message: "Evaluation calibrated by QA in MongoDB Atlas. Evaluator payout of \u20B95,000 released."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/shortlists.ts
var import_express7 = require("express");
var shortlistsRouter = (0, import_express7.Router)();
shortlistsRouter.get("/", async (req, res) => {
  try {
    const { companyId, requirementId } = req.query;
    const query = {};
    if (companyId) query.companyId = companyId;
    if (requirementId) query.requirementId = requirementId;
    const shortlists = await ShortlistModel.find(query).lean();
    return res.json({
      success: true,
      data: shortlists,
      total: shortlists.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
shortlistsRouter.get("/:id", async (req, res) => {
  try {
    const shortlist = await ShortlistModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!shortlist) {
      return res.status(404).json({ success: false, error: "Shortlist not found in MongoDB Atlas" });
    }
    const [requirement, company] = await Promise.all([
      RequirementModel.findOne({ id: shortlist.requirementId }).lean(),
      CompanyModel.findOne({ id: shortlist.companyId }).lean()
    ]);
    return res.json({
      success: true,
      data: {
        ...shortlist,
        requirement,
        company
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
shortlistsRouter.post("/generate", optionalAuth, async (req, res) => {
  try {
    const { requirementId, count = 10 } = req.body;
    const targetCount = Number(count) || 10;
    const requirement = await RequirementModel.findOne(buildIdQuery(requirementId));
    if (!requirement) {
      return res.status(404).json({ success: false, error: "Requirement not found in MongoDB Atlas" });
    }
    const evaluations = await EvaluationModel.find({
      requirementId: requirement.id,
      $or: [
        { qaStatus: "APPROVED" },
        { qaCalibrated: true },
        { status: { $in: ["CALIBRATED", "PASSED", "APPROVED"] } }
      ],
      overallScore: { $gte: 75 }
    }).lean();
    const candidateIds = evaluations.map((e) => e.candidateId);
    let candidates = await CandidateModel.find({
      id: { $in: candidateIds },
      fraudStatus: { $nin: ["HIGH_RISK", "FRAUD_CONFIRMED"] }
    }).lean();
    const shortlistCandidateItems = candidates.slice(0, targetCount).map((cand, idx) => {
      const ev = evaluations.find((e) => e.candidateId === cand.id);
      return {
        candidateId: cand.id,
        candidateName: cand.fullName,
        matchScore: 92 - idx,
        evaluationScore: ev?.overallScore || cand.evaluationScore || 90,
        rank: idx + 1,
        headline: cand.headline,
        keySkills: (cand.skills || []).slice(0, 4).map((s) => typeof s === "string" ? s : s.name),
        experienceYears: cand.totalYearsOfExperience,
        noticePeriodDays: cand.noticePeriodDays,
        expectedSalaryUsd: cand.expectedSalaryUsd,
        strengths: ev?.strengths || ["High throughput concurrency", "Strong system design"],
        concerns: ev?.concerns || [],
        status: idx < 3 ? "INTERVIEW_SCHEDULED" : "PENDING_REVIEW"
      };
    });
    const isDeficit = shortlistCandidateItems.length < targetCount;
    const shortlistId = `shortlist-${requirement.id}`;
    const shortlist = await ShortlistModel.findOneAndUpdate(
      { requirementId: requirement.id },
      {
        id: shortlistId,
        requirementId: requirement.id,
        companyId: requirement.companyId,
        targetCount,
        qualifiedCount: shortlistCandidateItems.length,
        isDeficit,
        candidates: shortlistCandidateItems,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "READY_FOR_COMPANY"
      },
      { upsert: true, new: true }
    );
    requirement.state = "SHORTLISTED";
    requirement.shortlistCount = shortlistCandidateItems.length;
    await requirement.save();
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "TOP_N_SHORTLIST_GENERATED",
      actorId: req.user?.userId || "admin",
      actorEmail: req.user?.email || "admin@thamilarasan.global",
      actorRole: req.user?.role || "SUPER_ADMIN",
      entity: "Shortlist",
      entityId: shortlistId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { requirementId: requirement.id, targetCount, qualifiedCount: shortlistCandidateItems.length, isDeficit }
    });
    return res.status(201).json({
      success: true,
      data: shortlist,
      message: `Top-N Shortlist generated in MongoDB Atlas with ${shortlistCandidateItems.length} verified candidates.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/interviews.ts
var import_express8 = require("express");
var interviewsRouter = (0, import_express8.Router)();
interviewsRouter.get("/", optionalAuth, async (req, res) => {
  try {
    const { companyId, candidateId, requirementId } = req.query;
    const query = {};
    const targetCompanyId = companyId || req.user?.companyId;
    if (targetCompanyId) query.companyId = targetCompanyId;
    if (candidateId) query.candidateId = candidateId;
    if (requirementId) query.requirementId = requirementId;
    const interviews = await InterviewModel.find(query).sort({ scheduledAt: -1, createdAt: -1 }).lean();
    const candIds = interviews.map((i) => i.candidateId).filter(Boolean);
    const candidates = candIds.length > 0 ? await CandidateModel.find({ id: { $in: candIds } }).lean() : [];
    const candMap = new Map(candidates.map((c) => [c.id, c]));
    const enriched = interviews.map((inv) => {
      const cand = candMap.get(inv.candidateId);
      return {
        ...inv,
        candidateName: cand?.fullName || inv.candidateName || "Candidate",
        candidateHeadline: cand?.headline || inv.candidateHeadline || "",
        candidateEmail: cand?.email || inv.candidateEmail || "",
        candidate: cand
      };
    });
    return res.json({
      success: true,
      data: enriched,
      total: enriched.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
interviewsRouter.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      requirementId,
      candidateId,
      companyId = req.user?.companyId || "comp-1",
      scheduledAt,
      durationMinutes = 45,
      interviewType = "FINAL_CLIENT_INTERVIEW",
      interviewerNames = ["Engineering Lead"],
      meetingLink = "https://meet.thamilarasan.global/room/tg-interview-room"
    } = req.body;
    const newInterview = await InterviewModel.create({
      id: `int-${Date.now()}`,
      requirementId,
      companyId,
      candidateId,
      interviewType,
      scheduledAt: scheduledAt || new Date(Date.now() + 864e5).toISOString(),
      durationMinutes,
      meetingLink,
      status: "SCHEDULED",
      interviewerNames
    });
    await CandidateModel.updateOne(
      { id: candidateId },
      { $set: { state: "INTERVIEWING" } }
    );
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "INTERVIEW_SCHEDULED",
      actorId: req.user?.userId || "company",
      actorEmail: req.user?.email || "talent@vanguardfintech.com",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Interview",
      entityId: newInterview.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { requirementId, candidateId, scheduledAt }
    });
    return res.status(201).json({
      success: true,
      data: newInterview,
      message: "Interview successfully scheduled in MongoDB Atlas."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/offers.ts
var import_express9 = require("express");
var offersRouter = (0, import_express9.Router)();
offersRouter.get("/", async (req, res) => {
  try {
    const { companyId, candidateId } = req.query;
    const query = {};
    if (companyId) query.companyId = companyId;
    if (candidateId) query.candidateId = candidateId;
    const offers = await OfferModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: offers,
      total: offers.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
offersRouter.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      requirementId,
      candidateId,
      companyId = req.user?.companyId || "comp-1",
      annualSalaryUsd = 88e3,
      signingBonusUsd = 5e3,
      proposedStartDate,
      expiryDate,
      terms = "Standard 40-hour international remote contract"
    } = req.body;
    const newOffer = await OfferModel.create({
      id: `offer-${Date.now()}`,
      requirementId,
      companyId,
      candidateId,
      annualSalaryUsd: Number(annualSalaryUsd),
      signingBonusUsd: Number(signingBonusUsd),
      proposedStartDate: proposedStartDate || new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      expiryDate: expiryDate || new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0],
      status: "EXTENDED",
      terms,
      extendedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    await CandidateModel.updateOne(
      { id: candidateId },
      { $set: { state: "OFFERED" } }
    );
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "OFFER_EXTENDED",
      actorId: req.user?.userId || "company",
      actorEmail: req.user?.email || "talent@vanguardfintech.com",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Offer",
      entityId: newOffer.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { requirementId, candidateId, annualSalaryUsd }
    });
    return res.status(201).json({
      success: true,
      data: newOffer,
      message: "Offer extended and saved to MongoDB Atlas."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
offersRouter.post("/:id/accept", optionalAuth, async (req, res) => {
  try {
    const offer = await OfferModel.findOne(buildIdQuery(req.params.id));
    if (!offer) {
      return res.status(404).json({ success: false, error: "Offer not found in MongoDB Atlas" });
    }
    offer.status = "ACCEPTED";
    offer.respondedAt = (/* @__PURE__ */ new Date()).toISOString();
    await offer.save();
    await CandidateModel.updateOne(
      { id: offer.candidateId },
      { $set: { state: "PLACED" } }
    );
    const startDate = offer.proposedStartDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const guaranteeEndDate = new Date(new Date(startDate).getTime() + 90 * 864e5).toISOString().split("T")[0];
    const feeAmountUsd = Math.round(offer.annualSalaryUsd * 0.15);
    const placementId = `plc-${Date.now()}`;
    const placement = await PlacementModel.create({
      id: placementId,
      companyId: offer.companyId,
      candidateId: offer.candidateId,
      requirementId: offer.requirementId,
      offerId: offer.id,
      startDate,
      annualSalaryUsd: offer.annualSalaryUsd,
      placementFeePercentage: 15,
      feeAmountUsd,
      status: "ACTIVE_GUARANTEE",
      guaranteeEndDate
    });
    const invoiceId = `inv-${Date.now()}`;
    const invoice = await InvoiceModel.create({
      id: invoiceId,
      companyId: offer.companyId,
      placementId,
      amountUsd: feeAmountUsd,
      issueDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      status: "ISSUED"
    });
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "OFFER_ACCEPTED_PLACEMENT_CREATED",
      actorId: req.user?.userId || offer.candidateId,
      actorEmail: req.user?.email || "karthik.iyer@example.com",
      actorRole: req.user?.role || "CANDIDATE",
      entity: "Placement",
      entityId: placementId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { offerId: offer.id, feeAmountUsd, invoiceId, guaranteeEndDate }
    });
    return res.json({
      success: true,
      data: {
        offer,
        placement,
        invoice
      },
      message: "Offer accepted! Placement recorded and 15% success fee invoice issued in MongoDB Atlas."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/placements.ts
var import_express10 = require("express");
var placementsRouter = (0, import_express10.Router)();
placementsRouter.get("/", async (req, res) => {
  try {
    const { companyId } = req.query;
    const query = {};
    if (companyId) query.companyId = companyId;
    const placements = await PlacementModel.find(query).sort({ createdAt: -1 }).lean();
    const enriched = await Promise.all(
      placements.map(async (p) => {
        const [candidate, company, requirement] = await Promise.all([
          CandidateModel.findOne({ id: p.candidateId }).lean(),
          CompanyModel.findOne({ id: p.companyId }).lean(),
          RequirementModel.findOne({ id: p.requirementId }).lean()
        ]);
        return {
          ...p,
          candidate,
          company,
          requirement
        };
      })
    );
    return res.json({
      success: true,
      data: enriched,
      total: placements.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/finance.ts
var import_express11 = require("express");

// apps/server/src/services/razorpay.ts
var import_razorpay = __toESM(require("razorpay"));
var razorpay = new import_razorpay.default({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_TaGbL5GVmCziYF",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "BtnHTwgqcE7aItb7wfysX8X8"
});
async function createInvoicePaymentOrder(invoiceId, amountInr, currency = "INR") {
  const options = {
    amount: Math.round(amountInr * 100),
    // Razorpay expects amount in paise
    currency,
    receipt: `rcpt_${invoiceId.slice(0, 20)}`,
    notes: {
      invoiceId,
      platform: "TALENT HIRE"
    }
  };
  return razorpay.orders.create(options);
}

// apps/server/src/routes/finance.ts
var financeRouter = (0, import_express11.Router)();
financeRouter.get("/invoices", async (req, res) => {
  try {
    const { companyId } = req.query;
    const query = {};
    if (companyId) query.companyId = companyId;
    const invoices = await InvoiceModel.find(query).sort({ createdAt: -1 }).lean();
    const enriched = await Promise.all(
      invoices.map(async (inv) => {
        const company = await CompanyModel.findOne({ id: inv.companyId }).lean();
        return { ...inv, company };
      })
    );
    return res.json({
      success: true,
      data: enriched,
      total: invoices.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
financeRouter.get("/payouts", async (req, res) => {
  try {
    const { evaluatorId, status } = req.query;
    const query = {};
    if (evaluatorId) {
      const eid = String(evaluatorId);
      const alt = eid.startsWith("eval-") ? eid.replace("eval-", "evaluator-") : eid.replace("evaluator-", "eval-");
      query.evaluatorId = { $in: [eid, alt] };
    }
    if (status) query.status = status;
    const payouts = await PayoutModel.find(query).sort({ createdAt: -1 }).lean();
    const enriched = await Promise.all(
      payouts.map(async (p) => {
        const [evaluator, evaluation] = await Promise.all([
          EvaluatorModel.findOne({ id: p.evaluatorId }).lean(),
          EvaluationModel.findOne({ id: p.evaluationId }).lean()
        ]);
        return { ...p, evaluator, evaluation };
      })
    );
    return res.json({
      success: true,
      data: enriched,
      total: payouts.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
financeRouter.post("/invoices/:id/razorpay-order", optionalAuth, async (req, res) => {
  try {
    const invoice = await InvoiceModel.findOne(buildIdQuery(req.params.id));
    if (!invoice) {
      return res.status(404).json({ success: false, error: "Invoice not found in MongoDB Atlas" });
    }
    const amountInr = Math.round(invoice.amountUsd * 83);
    const order = await createInvoicePaymentOrder(invoice.id, amountInr);
    invoice.razorpayOrderId = order.id;
    await invoice.save();
    return res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
financeRouter.post("/payouts/:id/disburse", optionalAuth, async (req, res) => {
  try {
    const payout = await PayoutModel.findOne(buildIdQuery(req.params.id));
    if (!payout) {
      return res.status(404).json({ success: false, error: "Payout not found in MongoDB Atlas" });
    }
    payout.status = "DISBURSED";
    payout.disbursedAt = (/* @__PURE__ */ new Date()).toISOString();
    payout.transactionRef = `TXN-RAZORPAY-${Date.now()}`;
    await payout.save();
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "EVALUATOR_PAYOUT_DISBURSED",
      actorId: req.user?.userId || "admin",
      actorEmail: req.user?.email || "finance@thamilarasan.global",
      actorRole: req.user?.role || "SUPER_ADMIN",
      entity: "EvaluatorPayout",
      entityId: payout.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { amountInr: payout.amountInr, evaluatorId: payout.evaluatorId }
    });
    return res.json({
      success: true,
      data: payout,
      message: "Payout disbursed and updated in MongoDB Atlas."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/admin.ts
var import_express12 = require("express");
var adminRouter = (0, import_express12.Router)();
adminRouter.get("/stats", async (_req, res) => {
  try {
    const [
      activeCompanies,
      openRequirements,
      pipelineCandidates,
      inEvaluation,
      qaQueue,
      shortlistsReady,
      upcomingInterviews,
      activePlacements,
      placements,
      evaluators,
      recentActivity
    ] = await Promise.all([
      CompanyModel.countDocuments({ status: "ACTIVE" }),
      RequirementModel.countDocuments({ state: { $ne: "CLOSED" } }),
      CandidateModel.countDocuments(),
      EvaluationModel.countDocuments({ status: "PENDING_EVALUATION" }),
      EvaluationModel.countDocuments({ status: "PENDING_QA" }),
      ShortlistModel.countDocuments({ status: "READY_FOR_COMPANY" }),
      InterviewModel.countDocuments({ status: "SCHEDULED" }),
      PlacementModel.countDocuments({ status: "ACTIVE_GUARANTEE" }),
      PlacementModel.find().lean(),
      EvaluatorModel.find().lean(),
      AuditLogModel.find().sort({ timestamp: -1 }).limit(10).lean()
    ]);
    const totalRevenueUsd = placements.reduce((sum, p) => sum + (p.feeAmountUsd || 13200), 0) || 13200;
    const totalEvaluatorEarningsInr = evaluators.length * 5500;
    const avgReliability = 95;
    const avgPassRate = 64;
    const interRaterAgreement = 91;
    return res.json({
      success: true,
      data: {
        activeCompanies,
        openRequirements,
        pipelineCandidates,
        inEvaluation,
        qaQueue,
        shortlistsReady,
        upcomingInterviews,
        activePlacements,
        totalRevenueUsd,
        totalEvaluatorEarningsInr,
        calibration: {
          avgReliability,
          avgPassRate,
          interRaterAgreement,
          evaluatorsMonitored: evaluators.length
        },
        recentActivity
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// apps/server/src/routes/companyPortal.ts
var import_express13 = require("express");
var import_mongoose3 = __toESM(require("mongoose"));

// apps/server/src/services/calendarProvider.ts
var GoogleCalendarProvider = class {
  name = "GOOGLE_MEET";
  async isConnected(companyId) {
    const integration = await GoogleIntegrationModel.findOne({ companyId }).lean();
    if (!integration || !integration.isConnected) {
      return { isConnected: false };
    }
    return { isConnected: true, calendarEmail: integration.calendarEmail };
  }
  getAuthUrl(companyId) {
    const clientId = process.env.GOOGLE_CLIENT_ID || "placeholder_client_id";
    const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/company/integrations/google/callback");
    const scope = encodeURIComponent("https://www.googleapis.com/auth/calendar.events");
    const state = encodeURIComponent(JSON.stringify({ companyId }));
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
  }
  async createMeeting(options) {
    const status = await this.isConnected(options.companyId);
    if (!status.isConnected) {
      return {
        success: false,
        provider: "GOOGLE_MEET",
        error: "Connect Google Calendar to create Google Meet automatically."
      };
    }
    const eventId = `gcal_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const meetHash = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetingLink = `https://meet.google.com/${meetHash}`;
    await GoogleIntegrationModel.updateOne(
      { companyId: options.companyId },
      { $set: { lastSyncAt: (/* @__PURE__ */ new Date()).toISOString() } }
    );
    return {
      success: true,
      meetingLink,
      eventId,
      provider: "GOOGLE_MEET"
    };
  }
};
var calendarProvider = new GoogleCalendarProvider();

// apps/server/src/routes/companyPortal.ts
var companyPortalRouter = (0, import_express13.Router)();
companyPortalRouter.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      companyName,
      website,
      country,
      size,
      industry,
      role = "COMPANY_ADMIN"
    } = req.body;
    if (!email || !companyName) {
      return res.status(400).json({ success: false, error: "Work email and company name are required" });
    }
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, error: "An account with this work email already exists" });
    }
    const companyId = `comp-${Date.now()}`;
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newCompany = await CompanyModel.create({
      id: companyId,
      name: companyName,
      slug,
      website: website || `https://${slug}.com`,
      country: country || "United States",
      headquarters: country || "United States",
      size: size || "51-200",
      industry: industry || "Technology",
      status: "VERIFIED",
      billingTier: "GROWTH",
      onboardingStep: 1,
      onboardingData: {
        companyInfo: { companyName, website, country, size, industry }
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const userId = `user-${Date.now()}`;
    const newUser = await UserModel.create({
      id: userId,
      email: email.toLowerCase(),
      fullName,
      firstName: fullName?.split(" ")[0] || fullName,
      lastName: fullName?.split(" ").slice(1).join(" ") || "",
      role: "COMPANY_ADMIN",
      companyId,
      isVerified: true,
      isActive: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const token = signAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      companyId
    });
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "COMPANY_REGISTERED",
      actorId: newUser.id,
      actorEmail: newUser.email,
      actorRole: newUser.role,
      entity: "Company",
      entityId: companyId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { companyName, companyId }
    });
    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          companyId
        },
        company: newCompany
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/me", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const company = await CompanyModel.findOne(buildIdQuery(companyId)).lean();
    if (!company) {
      return res.status(404).json({ success: false, error: "Company account not found in MongoDB Atlas" });
    }
    return res.json({
      success: true,
      data: company
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.patch("/me", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const updates = req.body;
    const company = await CompanyModel.findOneAndUpdate(
      buildIdQuery(companyId),
      { $set: { ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
      { new: true }
    );
    return res.json({
      success: true,
      data: company
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/openings", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { state, search } = req.query;
    const query = { companyId };
    if (state) query.state = state;
    if (search) {
      const s = String(search);
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { roleCategory: { $regex: s, $options: "i" } }
      ];
    }
    const openings = await RequirementModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: openings,
      total: openings.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/onboarding/step", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { step, data } = req.body;
    const company = await CompanyModel.findOne(buildIdQuery(companyId));
    if (!company) {
      return res.status(404).json({ success: false, error: "Company not found" });
    }
    company.onboardingStep = Number(step);
    company.onboardingData = {
      ...company.onboardingData || {},
      ...data || {}
    };
    if (data?.companyInfo) {
      if (data.companyInfo.companyName) company.name = data.companyInfo.companyName;
      if (data.companyInfo.website) company.website = data.companyInfo.website;
      if (data.companyInfo.country) company.country = data.companyInfo.country;
      if (data.companyInfo.size) company.size = data.companyInfo.size;
      if (data.companyInfo.industry) company.industry = data.companyInfo.industry;
    }
    if (Number(step) >= 6) {
      company.status = "ACTIVE";
    }
    await company.save();
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "ONBOARDING_PROGRESS_SAVED",
      actorId: req.user?.userId || "system",
      actorEmail: req.user?.email || "",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Company",
      entityId: companyId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { step, savedAt: (/* @__PURE__ */ new Date()).toISOString() }
    });
    return res.json({
      success: true,
      data: {
        step: company.onboardingStep,
        onboardingData: company.onboardingData,
        company
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/dashboard", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const [company, userDoc] = await Promise.all([
      CompanyModel.findOne(buildIdQuery(companyId)).lean(),
      req.user?.userId ? UserModel.findOne(buildIdQuery(req.user.userId)).lean() : null
    ]);
    const requirements = await RequirementModel.find({ companyId }).sort({ createdAt: -1 }).lean();
    const reqIds = requirements.map((r) => r.id);
    const [
      reusableEvaluations,
      companyApplications,
      evaluations,
      shortlists,
      interviews,
      offers,
      placements
    ] = await Promise.all([
      EvaluationModel.find({
        scope: "REUSABLE",
        validityStatus: "VALID",
        consentStatus: "ACTIVE"
      }).lean(),
      CandidateApplicationModel.find({ companyId }).lean(),
      EvaluationModel.find({ requirementId: { $in: reqIds } }).lean(),
      ShortlistModel.find({ companyId }).lean(),
      InterviewModel.find({ companyId }).sort({ scheduledAt: 1 }).lean(),
      OfferModel.find({ companyId }).lean(),
      PlacementModel.find({ companyId }).lean()
    ]);
    const activeRequirements = await Promise.all(
      requirements.slice(0, 5).map(async (r) => {
        const [appCount, shortlist] = await Promise.all([
          CandidateApplicationModel.countDocuments({ companyId, requirementId: r.id }),
          ShortlistModel.findOne({ companyId, requirementId: r.id }).lean()
        ]);
        return {
          ...r,
          applicantsCount: appCount,
          shortlistedCount: shortlist?.candidates?.length || shortlist?.qualifiedCount || 0
        };
      })
    );
    const upcomingInterviewsRaw = interviews.filter((i) => i.status !== "CANCELLED").slice(0, 5);
    const upcomingInterviews = await Promise.all(
      upcomingInterviewsRaw.map(async (interview) => {
        const [cand, reqItem] = await Promise.all([
          CandidateModel.findOne(buildIdQuery(interview.candidateId)).lean(),
          RequirementModel.findOne(buildIdQuery(interview.requirementId)).lean()
        ]);
        return {
          ...interview,
          candidateName: cand?.fullName || "Candidate",
          candidateRole: reqItem?.title || "Software Engineer",
          meetingLink: interview.meetingLink || "https://meet.google.com"
        };
      })
    );
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
    const activeRequirementsCount = requirements.filter((r) => r.state !== "CLOSED").length;
    const newRequirementsThisMonth = requirements.filter(
      (r) => new Date(r.createdAt || Date.now()) >= thirtyDaysAgo
    ).length;
    const quickMatchAvailableCount = reusableEvaluations.length;
    const companyApplicantsCount = companyApplications.length;
    const applicantsThisWeek = companyApplications.filter(
      (a) => new Date(a.appliedAt || a.createdAt || Date.now()) >= sevenDaysAgo
    ).length;
    const evaluationsInProgressCount = evaluations.filter(
      (e) => !e.completedAt && e.status === "PENDING_EVALUATION"
    ).length;
    const evaluatedCount = evaluations.filter(
      (e) => e.status === "COMPLETED" || !!e.completedAt || e.overallScore && e.overallScore > 0
    ).length;
    const qualifiedCandidatesCount = evaluations.filter(
      (e) => e.qaCalibrated || e.qaStatus === "APPROVED" || e.overallScore >= 75 && (e.completedAt || e.status === "COMPLETED")
    ).length;
    const shortlistsReadyCount = shortlists.reduce(
      (acc, s) => acc + (s.candidates?.length || s.qualifiedCount || 0),
      0
    );
    const screeningCount = companyApplications.filter(
      (a) => a.screeningStatus === "PASSED" || a.status === "SHORTLISTED" || a.status === "EVALUATING"
    ).length;
    const [totalCandidatesCount, totalEvaluatedCandidates] = await Promise.all([
      CandidateModel.countDocuments(),
      EvaluationModel.distinct("candidateId")
    ]);
    const globalStats = {
      totalEvaluatedEngineers: Math.max(totalEvaluatedCandidates.length, totalCandidatesCount),
      clientSatisfactionRate: 98,
      countriesCount: 30,
      guaranteeDays: 90
    };
    return res.json({
      success: true,
      data: {
        company: {
          id: company?.id || companyId,
          name: company?.name || "",
          status: company?.status || "ACTIVE",
          billingTier: company?.billingTier || "GROWTH"
        },
        user: {
          firstName: userDoc?.firstName || userDoc?.fullName?.split(" ")[0] || company?.name || "Hiring Leader",
          fullName: userDoc?.fullName || company?.name || "Hiring Leader",
          email: userDoc?.email || "",
          role: userDoc?.role || "COMPANY_ADMIN"
        },
        metrics: {
          activeRequirementsCount,
          newRequirementsThisMonth,
          quickMatchAvailableCount,
          companyApplicantsCount,
          applicantsThisWeek,
          evaluationsInProgressCount,
          evaluatedCount,
          qualifiedCandidatesCount,
          shortlistsReadyCount,
          upcomingInterviewsCount: upcomingInterviews.length,
          offersCount: offers.length,
          activePlacementsCount: placements.length
        },
        funnel: {
          applicants: companyApplicantsCount,
          screening: screeningCount,
          evaluated: evaluatedCount,
          qaApproved: qualifiedCandidatesCount,
          shortlisted: shortlistsReadyCount,
          interviews: upcomingInterviews.length,
          offers: offers.length
        },
        globalStats,
        activeRequirements,
        upcomingInterviews
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/quick-match", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const {
      requirementId,
      validity = "VALID",
      minScore,
      experience,
      noticePeriod,
      search
    } = req.query;
    let requirement = null;
    if (requirementId) {
      requirement = await RequirementModel.findOne(buildIdQuery(String(requirementId))).lean();
    }
    if (!requirement) {
      requirement = await RequirementModel.findOne({ companyId, state: { $ne: "CLOSED" } }).sort({ createdAt: -1 }).lean();
    }
    if (!requirement) {
      requirement = {
        id: "req-default",
        title: "Senior Software Engineer",
        roleCategory: "Backend",
        minExperienceYears: 3,
        maxExperienceYears: 10,
        budgetMaxUsd: 12e4,
        maxNoticePeriodDays: 30,
        requiredSkills: ["Node.js", "TypeScript", "AWS"],
        niceToHaveSkills: ["PostgreSQL", "Docker"]
      };
    }
    const allCandidates = await CandidateModel.find({
      fraudStatus: { $nin: ["HIGH_RISK", "FRAUD_CONFIRMED"] }
    }).lean();
    const candIds = allCandidates.map((c) => c.id);
    const evaluations = await EvaluationModel.find({
      candidateId: { $in: candIds }
    }).lean();
    const quickMatches = [];
    let validCount = 0;
    let expiredCount = 0;
    let withdrawnConsentCount = 0;
    let topUpCount = 0;
    for (const cand of allCandidates) {
      const candEval = evaluations.find(
        (e) => e.candidateId === cand.id && (!e.scope || e.scope === "REUSABLE")
      );
      const qmResult = evaluateQuickMatch(cand, requirement, candEval);
      if (qmResult.isExpired) expiredCount++;
      if (!qmResult.consentActive) withdrawnConsentCount++;
      if (qmResult.isTopUpRequired) topUpCount++;
      if (qmResult.isQuickMatchEligible && !qmResult.isExpired && qmResult.consentActive) validCount++;
      let include = false;
      if (validity === "VALID") {
        include = qmResult.isQuickMatchEligible && !qmResult.isExpired && qmResult.consentActive;
      } else if (validity === "EXPIRED") {
        include = qmResult.isExpired;
      } else if (validity === "TOP_UP") {
        include = qmResult.isTopUpRequired;
      } else if (validity === "ALL") {
        include = !!candEval;
      } else {
        include = qmResult.isQuickMatchEligible && !qmResult.isExpired && qmResult.consentActive;
      }
      if (include && search) {
        const q = String(search).toLowerCase();
        const matchesSearch = cand.fullName.toLowerCase().includes(q) || (cand.headline || "").toLowerCase().includes(q) || (cand.skills || []).some((s) => (typeof s === "string" ? s : s.name).toLowerCase().includes(q));
        if (!matchesSearch) include = false;
      }
      if (include && minScore && qmResult.overallScore < Number(minScore)) {
        include = false;
      }
      if (include && experience && cand.totalYearsOfExperience < Number(experience)) {
        include = false;
      }
      if (include && noticePeriod && cand.noticePeriodDays > Number(noticePeriod)) {
        include = false;
      }
      if (include) {
        quickMatches.push({
          candidateId: cand.id,
          fullName: cand.fullName,
          headline: cand.headline,
          location: cand.location || "India",
          totalYearsOfExperience: cand.totalYearsOfExperience,
          noticePeriodDays: cand.noticePeriodDays,
          expectedSalaryUsd: cand.expectedSalaryUsd,
          skills: (cand.skills || []).map((s) => typeof s === "string" ? s : s.name),
          verifiedBadge: cand.verifiedBadge || true,
          matchScore: qmResult.overallScore,
          evaluationScore: qmResult.evaluationSummary?.overallScore || cand.evaluationScore || 88,
          eligibilityStatus: qmResult.eligibilityStatus,
          isTopUpRequired: qmResult.isTopUpRequired,
          uncoveredSkills: qmResult.uncoveredSkills,
          evaluationSummary: qmResult.evaluationSummary,
          reasons: qmResult.reasons,
          passedHardFilters: qmResult.passedHardFilters,
          matchSource: "GLOBAL_EVALUATED"
        });
      }
    }
    quickMatches.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({
      success: true,
      data: quickMatches,
      meta: {
        requirementId: requirement.id,
        requirementTitle: requirement.title,
        totalFound: quickMatches.length,
        validCount,
        expiredCount,
        withdrawnConsentCount,
        topUpCount
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/quick-match/:candidateId", authenticate, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const companyId = req.user?.companyId || "comp-1";
    const candidate = await CandidateModel.findOne(buildIdQuery(candidateId)).lean();
    if (!candidate) {
      return res.status(404).json({ success: false, error: "Candidate not found in global talent pool" });
    }
    const evaluation = await EvaluationModel.findOne({
      candidateId: candidate.id,
      scope: "REUSABLE"
    }).lean();
    if (evaluation?.consentStatus === "WITHDRAWN") {
      return res.status(403).json({
        success: false,
        error: "Candidate has withdrawn consent for reusable evaluation sharing."
      });
    }
    const sanitizedEvaluation = sanitizeReusableEvaluation(evaluation);
    const companyNotes = await CompanyNoteModel.find({ companyId, candidateId: candidate.id }).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: {
        candidate,
        reusableEvaluation: sanitizedEvaluation,
        companyNotes
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/quick-match/:candidateId/invite", authenticate, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const companyId = req.user?.companyId || "comp-1";
    const { requirementId } = req.body;
    if (!requirementId) {
      return res.status(400).json({ success: false, error: "requirementId is required to invite candidate" });
    }
    const applicationId = `app-${Date.now()}-${candidateId}`;
    const application = await CandidateApplicationModel.findOneAndUpdate(
      { companyId, requirementId, candidateId },
      {
        id: applicationId,
        candidateId,
        companyId,
        requirementId,
        source: "COMPANY_INVITATION",
        status: "SHORTLISTED",
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        shortlistStatus: "SHORTLISTED"
      },
      { upsert: true, new: true }
    );
    await EvaluationModel.updateOne(
      { candidateId, scope: "REUSABLE" },
      {
        $inc: { reuseCount: 1 },
        $set: { lastReusedAt: (/* @__PURE__ */ new Date()).toISOString() },
        $addToSet: { companiesUsingEvaluation: companyId }
      }
    );
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "QUICK_MATCH_CANDIDATE_INVITED",
      actorId: req.user?.userId || "unknown",
      actorEmail: req.user?.email || "",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "CandidateApplication",
      entityId: applicationId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { candidateId, companyId, requirementId }
    });
    return res.json({
      success: true,
      data: application,
      message: "Candidate invited and entered into company dedicated pipeline."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/quick-match/:candidateId/top-up", authenticate, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const companyId = req.user?.companyId || "comp-1";
    const { requirementId, missingSkills } = req.body;
    const topUpEvalId = `eval-topup-${Date.now()}-${candidateId}`;
    const topUpEval = await EvaluationModel.create({
      id: topUpEvalId,
      requirementId,
      candidateId,
      companyId,
      scope: "TOP_UP",
      status: "PENDING_EVALUATION",
      uncoveredSkills: missingSkills || [],
      scheduledAt: new Date(Date.now() + 864e5).toISOString(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "TOP_UP_EVALUATION_REQUESTED",
      actorId: req.user?.userId || "unknown",
      actorEmail: req.user?.email || "",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Evaluation",
      entityId: topUpEvalId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { candidateId, requirementId, missingSkills }
    });
    return res.status(201).json({
      success: true,
      data: topUpEval,
      message: "Targeted Top-Up Evaluation successfully commissioned for missing skills."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/applications", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { requirementId, status } = req.query;
    const query = { companyId };
    if (requirementId) query.requirementId = requirementId;
    if (status) query.status = status;
    const applications = await CandidateApplicationModel.find(query).sort({ appliedAt: -1 }).lean();
    const candidateIds = applications.map((a) => a.candidateId);
    const candidates = await CandidateModel.find({ id: { $in: candidateIds } }).lean();
    const result = applications.map((app2) => {
      const cand = candidates.find((c) => c.id === app2.candidateId);
      return {
        ...app2,
        candidate: cand
      };
    });
    return res.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/applications/:id", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const app2 = await CandidateApplicationModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!app2 || app2.companyId !== companyId) {
      return res.status(403).json({ success: false, error: "Unauthorized access to applicant record" });
    }
    const candidate = await CandidateModel.findOne({ id: app2.candidateId }).lean();
    return res.json({
      success: true,
      data: { ...app2, candidate }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/shortlists", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { requirementId } = req.query;
    const query = { companyId };
    if (requirementId) query.requirementId = requirementId;
    const shortlists = await ShortlistModel.find(query).sort({ generatedAt: -1 }).lean();
    return res.json({
      success: true,
      data: shortlists,
      total: shortlists.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/shortlists/:id", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const shortlist = await ShortlistModel.findOne(buildIdQuery(req.params.id)).lean();
    if (!shortlist) {
      return res.status(404).json({ success: false, error: "Shortlist not found in MongoDB Atlas" });
    }
    if (shortlist.companyId !== companyId) {
      return res.status(403).json({ success: false, error: "Unauthorized access to company shortlist" });
    }
    const requirement = await RequirementModel.findOne({ id: shortlist.requirementId }).lean();
    return res.json({
      success: true,
      data: {
        ...shortlist,
        requirement
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/candidates/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId || "comp-1";
    const candidate = await CandidateModel.findOne(buildIdQuery(id)).lean();
    if (!candidate) {
      return res.status(404).json({ success: false, error: "Candidate profile not found" });
    }
    const evaluations = await EvaluationModel.find({
      candidateId: candidate.id,
      $or: [{ scope: "REUSABLE" }, { companyId }]
    }).lean();
    const evaluation = evaluations[0];
    const sanitizedEvaluation = sanitizeReusableEvaluation(evaluation);
    const notes = await CompanyNoteModel.find({ companyId, candidateId: candidate.id }).sort({ createdAt: -1 }).lean();
    const interviews = await InterviewModel.find({ companyId, candidateId: candidate.id }).sort({ scheduledAt: -1 }).lean();
    return res.json({
      success: true,
      data: {
        candidate,
        evaluation: sanitizedEvaluation,
        notes,
        interviews
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/candidates/:id/reusable-evaluation", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await EvaluationModel.findOne({
      candidateId: id,
      scope: "REUSABLE"
    }).lean();
    if (!evaluation) {
      return res.status(404).json({ success: false, error: "No reusable evaluation on record" });
    }
    if (evaluation.consentStatus === "WITHDRAWN") {
      return res.status(403).json({ success: false, error: "Candidate has withdrawn reusable evaluation consent" });
    }
    return res.json({
      success: true,
      data: sanitizeReusableEvaluation(evaluation)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/integrations/google/status", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const status = await calendarProvider.isConnected(companyId);
    return res.json({
      success: true,
      data: status
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/integrations/google/connect", authenticate, (req, res) => {
  const companyId = req.user?.companyId || "comp-1";
  const url = calendarProvider.getAuthUrl(companyId);
  return res.json({ success: true, url });
});
companyPortalRouter.get("/integrations/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    let companyId = "comp-1";
    if (state) {
      try {
        companyId = JSON.parse(decodeURIComponent(String(state))).companyId;
      } catch (e) {
      }
    }
    await GoogleIntegrationModel.findOneAndUpdate(
      { companyId },
      {
        companyId,
        isConnected: true,
        calendarEmail: "hiring-team@vanguardfintech.com",
        accessToken: `oauth_${Date.now()}`,
        lastSyncAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      { upsert: true }
    );
    return res.redirect("http://localhost:3002/company/interviews?connected=google");
  } catch (error) {
    return res.status(500).send(`Integration callback failed: ${error.message}`);
  }
});
companyPortalRouter.get("/interviews", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const interviews = await InterviewModel.find({ companyId }).sort({ scheduledAt: -1, createdAt: -1 }).lean();
    const candidateIds = interviews.map((i) => i.candidateId).filter(Boolean);
    const reqIds = interviews.map((i) => i.requirementId).filter(Boolean);
    const validCandidateObjIds = candidateIds.filter((id) => import_mongoose3.default.isValidObjectId(id));
    const validReqObjIds = reqIds.filter((id) => import_mongoose3.default.isValidObjectId(id));
    const candOrClauses = [{ id: { $in: candidateIds } }];
    if (validCandidateObjIds.length > 0) {
      candOrClauses.push({ _id: { $in: validCandidateObjIds } });
    }
    const candQuery = candOrClauses.length === 1 ? candOrClauses[0] : { $or: candOrClauses };
    const reqOrClauses = [{ id: { $in: reqIds } }];
    if (validReqObjIds.length > 0) {
      reqOrClauses.push({ _id: { $in: validReqObjIds } });
    }
    const reqQuery = reqOrClauses.length === 1 ? reqOrClauses[0] : { $or: reqOrClauses };
    const [candidates, requirements] = await Promise.all([
      candidateIds.length > 0 ? CandidateModel.find(candQuery).lean() : [],
      reqIds.length > 0 ? RequirementModel.find(reqQuery).lean() : []
    ]);
    const candMap = /* @__PURE__ */ new Map();
    for (const c of candidates) {
      candMap.set(c.id, c);
      candMap.set(String(c._id), c);
    }
    const reqMap = /* @__PURE__ */ new Map();
    for (const r of requirements) {
      reqMap.set(r.id, r);
      reqMap.set(String(r._id), r);
    }
    const result = interviews.map((inv) => {
      const cand = candMap.get(inv.candidateId);
      const req2 = reqMap.get(inv.requirementId);
      const fullName = cand?.fullName || inv.candidateName || "Software Engineer Candidate";
      const role = req2?.title || cand?.headline || inv.candidateRole || "Software Engineer";
      return {
        ...inv,
        candidateName: fullName,
        candidateHeadline: cand?.headline || inv.candidateHeadline || "",
        candidateRole: role,
        candidateEmail: cand?.email || inv.candidateEmail || "",
        candidate: cand
      };
    });
    return res.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/interviews", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const {
      candidateId,
      requirementId,
      interviewType = "COMPANY_ROUND_1",
      scheduledAt,
      durationMinutes = 60,
      interviewerNames = ["Hiring Manager"],
      useGoogleMeet = true,
      meetingLink: customMeetingLink
    } = req.body;
    if (!candidateId || !scheduledAt) {
      return res.status(400).json({ success: false, error: "candidateId and scheduledAt are required" });
    }
    const candidate = await CandidateModel.findOne(buildIdQuery(candidateId)).lean();
    const reqDoc = requirementId ? await RequirementModel.findOne(buildIdQuery(requirementId)).lean() : null;
    let meetingLink = customMeetingLink ? String(customMeetingLink).trim() : "";
    if (!meetingLink && useGoogleMeet) {
      const meetRes = await calendarProvider.createMeeting({
        companyId,
        candidateName: candidate?.fullName || "Candidate",
        summary: `Technical Hiring Interview - ${candidate?.fullName || "Candidate"}`,
        description: `Company Interview with ${companyId}`,
        startTime: scheduledAt,
        durationMinutes: Number(durationMinutes)
      });
      if (meetRes.success && meetRes.meetingLink) {
        meetingLink = meetRes.meetingLink;
      }
    }
    if (!meetingLink) {
      meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    }
    const interviewId = `inv-${Date.now()}-${candidateId}`;
    const candidateName = candidate?.fullName || "Software Engineer Candidate";
    const candidateRole = reqDoc?.title || candidate?.headline || "Software Engineer";
    const candidateHeadline = candidate?.headline || "";
    const candidateEmail = candidate?.email || "";
    const newInterview = await InterviewModel.create({
      id: interviewId,
      companyId,
      candidateId,
      candidateName,
      candidateRole,
      candidateHeadline,
      candidateEmail,
      requirementId: requirementId || "req-1",
      interviewType,
      scheduledAt,
      durationMinutes: Number(durationMinutes),
      meetingLink,
      status: "SCHEDULED",
      interviewerNames
    });
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "COMPANY_INTERVIEW_SCHEDULED",
      actorId: req.user?.userId || "unknown",
      actorEmail: req.user?.email || "",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Interview",
      entityId: interviewId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { candidateId, candidateName, companyId, scheduledAt, meetingLink }
    });
    return res.status(201).json({
      success: true,
      data: {
        ...newInterview.toObject(),
        candidateName,
        candidateRole,
        candidateHeadline,
        candidateEmail,
        candidate
      },
      message: "Interview scheduled with video meeting link."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/feedbacks", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { search, decision, rating } = req.query;
    const interviews = await InterviewModel.find({
      companyId,
      $or: [
        { feedbackNotes: { $exists: true, $ne: "" } },
        { rating: { $exists: true } },
        { companyDecision: { $exists: true } },
        { status: "COMPLETED" }
      ]
    }).sort({ updatedAt: -1 }).lean();
    const candIds = interviews.map((i) => i.candidateId);
    const reqIds = interviews.map((i) => i.requirementId);
    const [candidates, requirements] = await Promise.all([
      CandidateModel.find({ id: { $in: candIds } }).lean(),
      RequirementModel.find({ id: { $in: reqIds } }).lean()
    ]);
    const candMap = new Map(candidates.map((c) => [c.id, c]));
    const reqMap = new Map(requirements.map((r) => [r.id, r]));
    let enriched = interviews.map((inv) => {
      const cand = candMap.get(inv.candidateId);
      const reqDoc = reqMap.get(inv.requirementId);
      return {
        id: inv.id,
        interviewId: inv.id,
        candidateId: inv.candidateId,
        candidateName: cand?.fullName || inv.candidateName || "Software Engineer Candidate",
        candidateHeadline: cand?.headline || inv.candidateHeadline || "Software Engineer",
        candidateRole: reqDoc?.title || cand?.headline || inv.candidateRole || "Software Engineer",
        candidateEmail: cand?.email || inv.candidateEmail || "",
        rating: inv.rating !== void 0 ? inv.rating : null,
        companyDecision: inv.companyDecision || (inv.status === "COMPLETED" ? "PENDING_DECISION" : null),
        feedbackNotes: inv.feedbackNotes || "",
        interviewerNames: inv.interviewerNames || ["Hiring Manager"],
        scheduledAt: inv.scheduledAt,
        completedAt: inv.updatedAt || inv.scheduledAt,
        status: inv.status
      };
    });
    if (search) {
      const q = String(search).toLowerCase();
      enriched = enriched.filter(
        (f) => f.candidateName.toLowerCase().includes(q) || f.candidateRole.toLowerCase().includes(q) || f.feedbackNotes && f.feedbackNotes.toLowerCase().includes(q) || f.interviewerNames && f.interviewerNames.some((name) => name.toLowerCase().includes(q))
      );
    }
    if (decision && decision !== "ALL") {
      enriched = enriched.filter((f) => f.companyDecision === decision);
    }
    if (rating && rating !== "ALL") {
      const minR = Number(rating);
      enriched = enriched.filter((f) => (f.rating || 0) >= minR);
    }
    return res.json({
      success: true,
      data: enriched,
      total: enriched.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/interviews/:id/feedback", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { id } = req.params;
    const { feedbackNotes, rating, companyDecision } = req.body;
    const interview = await InterviewModel.findOne(buildIdQuery(id));
    if (!interview) {
      return res.status(404).json({ success: false, error: "Interview record not found" });
    }
    if (interview.companyId && interview.companyId !== companyId && companyId !== "comp-1") {
      if (interview.companyId === "comp-1") {
        interview.companyId = companyId;
      } else {
        return res.status(403).json({ success: false, error: "Interview record not found for this organization" });
      }
    }
    if (!interview.companyId) {
      interview.companyId = companyId;
    }
    interview.feedbackNotes = feedbackNotes;
    interview.rating = Number(rating) || 5;
    interview.companyDecision = companyDecision || "PROCEED_TO_OFFER";
    interview.status = "COMPLETED";
    await interview.save();
    if (interview.candidateId) {
      if (companyDecision === "PROCEED_TO_OFFER") {
        await CandidateModel.updateOne(buildIdQuery(interview.candidateId), { $set: { state: "OFFERED" } });
      } else if (companyDecision === "REJECT") {
        await CandidateModel.updateOne(buildIdQuery(interview.candidateId), { $set: { state: "REJECTED" } });
      } else if (companyDecision === "NEXT_ROUND") {
        await CandidateModel.updateOne(buildIdQuery(interview.candidateId), { $set: { state: "INTERVIEWING" } });
      }
    }
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "COMPANY_FEEDBACK_SUBMITTED",
      actorId: req.user?.userId || "unknown",
      actorEmail: req.user?.email || "",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Interview",
      entityId: id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { companyDecision, rating }
    });
    return res.json({
      success: true,
      data: interview,
      message: "Confidential company feedback recorded."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/offers", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const offers = await OfferModel.find({ companyId }).sort({ createdAt: -1 }).lean();
    const candidateIds = offers.map((o) => o.candidateId).filter(Boolean);
    const reqIds = offers.map((o) => o.requirementId).filter(Boolean);
    const [candidates, requirements] = await Promise.all([
      candidateIds.length > 0 ? CandidateModel.find({ id: { $in: candidateIds } }).lean() : [],
      reqIds.length > 0 ? RequirementModel.find({ id: { $in: reqIds } }).lean() : []
    ]);
    const candMap = /* @__PURE__ */ new Map();
    for (const c of candidates) {
      candMap.set(c.id, c);
      candMap.set(String(c._id), c);
    }
    const reqMap = /* @__PURE__ */ new Map();
    for (const r of requirements) {
      reqMap.set(r.id, r);
      reqMap.set(String(r._id), r);
    }
    const enriched = offers.map((o) => {
      const cand = candMap.get(o.candidateId);
      const reqDoc = reqMap.get(o.requirementId);
      return {
        ...o,
        candidateName: cand?.fullName || o.candidateName || "Software Engineer Candidate",
        candidateHeadline: cand?.headline || o.candidateHeadline || "",
        candidateRole: reqDoc?.title || cand?.headline || o.candidateRole || "Software Engineer",
        candidateEmail: cand?.email || o.candidateEmail || "",
        candidate: cand
      };
    });
    return res.json({ success: true, data: enriched, total: enriched.length });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/offers", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const {
      candidateId,
      requirementId,
      annualSalaryUsd,
      bonusUsd,
      equityTerms,
      proposedStartDate,
      expiryDate,
      terms
    } = req.body;
    if (!candidateId) {
      return res.status(400).json({ success: false, error: "Candidate is required to extend an employment offer." });
    }
    const candidate = await CandidateModel.findOne(buildIdQuery(candidateId)).lean();
    const reqDoc = requirementId ? await RequirementModel.findOne(buildIdQuery(requirementId)).lean() : null;
    const offerId = `offer-${Date.now()}-${candidateId}`;
    const candidateName = candidate?.fullName || "Software Engineer Candidate";
    const candidateHeadline = candidate?.headline || "";
    const candidateRole = reqDoc?.title || candidate?.headline || "Software Engineer";
    const candidateEmail = candidate?.email || "";
    const offer = await OfferModel.create({
      id: offerId,
      companyId,
      candidateId,
      candidateName,
      candidateHeadline,
      candidateRole,
      candidateEmail,
      requirementId: requirementId || "req-1",
      annualSalaryUsd: Number(annualSalaryUsd) || 9e4,
      bonusUsd: Number(bonusUsd) || 0,
      equityTerms: equityTerms || "",
      proposedStartDate: proposedStartDate || new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0],
      expiryDate: expiryDate || new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0],
      terms: terms || equityTerms || "Standard International Employment Agreement",
      status: "EXTENDED",
      extendedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    await CandidateModel.updateOne(buildIdQuery(candidateId), { $set: { state: "OFFERED" } });
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: "OFFER_ISSUED_BY_COMPANY",
      actorId: req.user?.userId || "unknown",
      actorEmail: req.user?.email || "",
      actorRole: req.user?.role || "COMPANY_ADMIN",
      entity: "Offer",
      entityId: offerId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: { candidateId, candidateName, annualSalaryUsd }
    });
    return res.status(201).json({
      success: true,
      data: {
        ...offer.toObject(),
        candidateName,
        candidateHeadline,
        candidateRole,
        candidateEmail,
        candidate
      },
      message: `Formal offer successfully extended to ${candidateName}.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/interviewed-candidates", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const interviews = await InterviewModel.find({ companyId }).sort({ scheduledAt: -1 }).lean();
    const candidateIds = Array.from(new Set(interviews.map((i) => i.candidateId).filter(Boolean)));
    const candidates = await CandidateModel.find({ id: { $in: candidateIds } }).lean();
    const candMap = new Map(candidates.map((c) => [c.id, c]));
    const result = candidateIds.map((candId) => {
      const cand = candMap.get(candId);
      const candInterviews = interviews.filter((i) => i.candidateId === candId);
      const latestInv = candInterviews[0] || {};
      return {
        id: candId,
        candidateId: candId,
        fullName: cand?.fullName || latestInv.candidateName || "Software Engineer Candidate",
        headline: cand?.headline || latestInv.candidateRole || "Software Engineer",
        email: cand?.email || latestInv.candidateEmail || "",
        latestDecision: latestInv.companyDecision || "PENDING_DECISION",
        interviewStatus: latestInv.status,
        rating: latestInv.rating,
        requirementId: latestInv.requirementId
      };
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/placements", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const placements = await PlacementModel.find({ companyId }).sort({ startDate: -1 }).lean();
    return res.json({ success: true, data: placements });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/invoices", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const invoices = await InvoiceModel.find({ companyId }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: invoices });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/team", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const teamMembers = await UserModel.find({ companyId }).select("-passwordHash").lean();
    return res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/notes/:candidateId", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { candidateId } = req.params;
    const notes = await CompanyNoteModel.find({ companyId, candidateId }).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/notes/:candidateId", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { candidateId } = req.params;
    const { notes, rating } = req.body;
    if (!notes) {
      return res.status(400).json({ success: false, error: "Note content is required" });
    }
    const newNote = await CompanyNoteModel.create({
      id: `note-${Date.now()}`,
      companyId,
      candidateId,
      authorId: req.user?.userId || "unknown",
      authorName: req.user?.email || "Hiring Manager",
      notes,
      rating: Number(rating) || 5
    });
    return res.status(201).json({
      success: true,
      data: newNote
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/analytics", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const [requirements, reusableEvaluations, applications, interviews, offers, placements, invoices] = await Promise.all([
      RequirementModel.find({ companyId }).lean(),
      EvaluationModel.find({ scope: "REUSABLE" }).lean(),
      CandidateApplicationModel.find({ companyId }).lean(),
      InterviewModel.find({ companyId }).lean(),
      OfferModel.find({ companyId }).lean(),
      PlacementModel.find({ companyId }).lean(),
      InvoiceModel.find({ companyId }).lean()
    ]);
    const totalReqs = requirements.length;
    const totalApplications = applications.length;
    const totalInterviews = interviews.length;
    const totalOffers = offers.length;
    const totalPlacements = placements.length;
    const quickMatchInterviews = interviews.filter((i) => i.interviewType === "COMPANY_ROUND_1").length;
    const quickMatchOffers = Math.round(totalOffers * 0.6);
    const quickMatchPlacements = Math.round(totalPlacements * 0.6);
    const reusedEvals = reusableEvaluations.filter((e) => (e.reuseCount || 0) > 0);
    const evaluationReuseRate = reusableEvaluations.length > 0 ? Math.round(reusedEvals.length / reusableEvaluations.length * 100) : 65;
    const freshEvals = reusableEvaluations.filter((e) => e.validityStatus === "VALID");
    const evaluationFreshnessRate = reusableEvaluations.length > 0 ? Math.round(freshEvals.length / reusableEvaluations.length * 100) : 90;
    return res.json({
      success: true,
      data: {
        quickMatchMetrics: {
          availableTalent: reusableEvaluations.filter((e) => e.validityStatus === "VALID").length,
          interviewsScheduled: quickMatchInterviews,
          offersExtended: quickMatchOffers,
          placementsCompleted: quickMatchPlacements,
          averageTimeToInterviewDays: 1.4,
          evaluationReuseRate,
          evaluationFreshnessRate
        },
        pipelineMetrics: {
          totalApplications,
          evaluationsConducted: Math.round(totalApplications * 0.4),
          qaPassRate: 67,
          shortlistsGenerated: 2,
          pipelineInterviews: totalInterviews - quickMatchInterviews,
          pipelineOffers: totalOffers - quickMatchOffers,
          pipelinePlacements: totalPlacements - quickMatchPlacements
        },
        financialSummary: {
          totalSpendUsd: invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + (i.totalUsd || 0), 0),
          invoicedCount: invoices.length
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/support", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const tickets = await SupportTicketModel.find({ companyId }).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.post("/support", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const { subject, category = "HIRING", priority = "MEDIUM", message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, error: "Subject and message are required" });
    }
    const ticket = await SupportTicketModel.create({
      id: `ticket-${Date.now()}`,
      companyId,
      userId: req.user?.userId,
      subject,
      category,
      priority,
      status: "OPEN",
      messages: [
        {
          author: req.user?.email || "Company User",
          text: message,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ]
    });
    return res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
companyPortalRouter.get("/invoices/:id/pdf", authenticate, async (req, res) => {
  try {
    const companyId = req.user?.companyId || "comp-1";
    const invoiceId = req.params.id;
    const [invoice, company] = await Promise.all([
      InvoiceModel.findOne(buildIdQuery(invoiceId)).lean(),
      CompanyModel.findOne(buildIdQuery(companyId)).lean()
    ]);
    if (!invoice) {
      return res.status(404).send("<h1>Invoice not found</h1>");
    }
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoice.invoiceNumber || invoice.id} - TALENT HIRE</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
    .logo { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #0284c7; }
    .meta { text-align: right; font-size: 13px; color: #64748b; }
    .details { margin-top: 30px; display: flex; justify-content: space-between; }
    .col h4 { margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #64748b; }
    .col p { margin: 0; font-size: 14px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 40px; }
    th { text-align: left; padding: 12px; background: #f8fafc; font-size: 12px; border-bottom: 1px solid #cbd5e1; color: #475569; }
    td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .total-box { margin-top: 30px; text-align: right; }
    .total-amount { font-size: 24px; font-weight: 900; color: #0f172a; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body onload="window.print()">
  <div class="header">
    <div>
      <div class="logo">TALENT HIRE</div>
      <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">FIND. EVALUATE. HIRE. \u2022 Global Engineering Placement Services</p>
    </div>
    <div class="meta">
      <h2 style="margin: 0; color: #0f172a;">INVOICE</h2>
      <p style="margin: 4px 0 0 0;"><strong>#${invoice.invoiceNumber || invoice.id}</strong></p>
      <p style="margin: 2px 0 0 0;">Issue Date: ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "2026-09-15"}</p>
      <p style="margin: 2px 0 0 0;">Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "NET 30"}</p>
    </div>
  </div>

  <div class="details">
    <div class="col">
      <h4>Billed To:</h4>
      <p>${company?.name || "Vanguard FinTech"}</p>
      <p style="font-weight: normal; font-size: 12px; color: #64748b;">${company?.headquarters || "New York, USA"}</p>
      <p style="font-weight: normal; font-size: 12px; color: #64748b;">Account Tier: ${company?.billingTier || "GROWTH"}</p>
    </div>
    <div class="col">
      <h4>Payment Terms:</h4>
      <p>NET 30 Corporate Invoicing</p>
      <p style="font-weight: normal; font-size: 12px; color: #16a34a;">Status: ${invoice.status || "ISSUED"}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Placement Role</th>
        <th>Candidate</th>
        <th style="text-align: right;">Amount (USD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${invoice.items?.[0]?.description || "International Software Engineer Placement Fee"}</strong><br><span style="font-size: 11px; color: #64748b;">Includes 90-Day Unconditional Replacement Guarantee</span></td>
        <td>Senior Software Engineer</td>
        <td>Verified Software Engineer</td>
        <td style="text-align: right; font-weight: bold;">$${Number(invoice.totalUsd || 13200).toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <span style="font-size: 12px; color: #64748b; display: block; margin-bottom: 4px;">Total Amount Due</span>
    <span class="total-amount">$${Number(invoice.totalUsd || 13200).toLocaleString()} USD</span>
  </div>

  <div class="footer">
    <p>TALENT HIRE INC. \u2022 International Placement & Technical Vetting Infrastructure</p>
    <p>Wire Transfer: Silicon Valley Bank, Routing #021000021, Account #8849204910 \u2022 SWIFT: SVBUS33XXX</p>
  </div>
</body>
</html>
`;
    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  } catch (error) {
    return res.status(500).send(`Error rendering invoice: ${error.message}`);
  }
});

// apps/server/src/index.ts
import_dotenv2.default.config();
var app = (0, import_express14.default)();
var server = import_http.default.createServer(app);
var io = null;
if (!process.env.VERCEL) {
  io = new import_socket.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`[Socket.IO] Socket ${socket.id} joined room ${room}`);
    });
    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, Cache-Control");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.options("*", (_req, res) => {
  return res.status(200).end();
});
app.use((0, import_cors.default)({
  origin: (origin, callback) => callback(null, origin || true),
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"]
}));
app.use(import_express14.default.json());
app.use(async (req, _res, next) => {
  if (req.method === "OPTIONS" || req.path === "/" || req.path === "/api") {
    return next();
  }
  try {
    await connectMongo();
  } catch (err) {
    console.error("[MongoDB Serverless Connect Error]:", err);
  }
  next();
});
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.get("/", (_req, res) => {
  return res.json({
    status: "ONLINE",
    service: "TalentHire Central Server API",
    version: "1.0.0",
    documentation: "https://github.com/Thamilarasan-gp/TalentHire",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api", (_req, res) => {
  return res.json({
    status: "ONLINE",
    service: "TalentHire API Gateway",
    version: "1.0.0",
    endpoints: [
      "/api/health",
      "/api/auth",
      "/api/company",
      "/api/companies",
      "/api/candidates",
      "/api/evaluators",
      "/api/requirements",
      "/api/evaluations",
      "/api/shortlists",
      "/api/interviews",
      "/api/offers",
      "/api/placements",
      "/api/finance",
      "/api/admin"
    ]
  });
});
app.use("/api/auth", authRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/evaluators", evaluatorsRouter);
app.use("/api/requirements", requirementsRouter);
app.use("/api/evaluations", evaluationsRouter);
app.use("/api/shortlists", shortlistsRouter);
app.use("/api/interviews", interviewsRouter);
app.use("/api/offers", offersRouter);
app.use("/api/placements", placementsRouter);
app.use("/api/finance", financeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/company", companyPortalRouter);
app.get("/api/audit", async (req, res) => {
  try {
    const { limit = "50" } = req.query;
    const l = Math.max(1, parseInt(String(limit), 10) || 50);
    const [total, logs] = await Promise.all([
      AuditLogModel.countDocuments(),
      AuditLogModel.find().sort({ timestamp: -1 }).limit(l).lean()
    ]);
    return res.json({
      success: true,
      data: logs,
      total
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/notifications", async (_req, res) => {
  try {
    const recentLogs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(5).lean();
    const notifs = recentLogs.map((log, idx) => ({
      id: log.id || `notif-${idx}`,
      title: (log.action || "HIRING_UPDATE").replace(/_/g, " "),
      message: log.details?.reason || (typeof log.details === "string" ? log.details : `${log.entity || "Activity"} updated by ${log.actorEmail || "System"}`),
      type: log.action?.includes("ERROR") ? "ERROR" : log.action?.includes("APPROVED") ? "SUCCESS" : "INFO",
      createdAt: log.timestamp || (/* @__PURE__ */ new Date()).toISOString()
    }));
    return res.json({
      success: true,
      data: notifs.length > 0 ? notifs : [
        {
          id: "notif-1",
          title: "Pipeline Active",
          message: "Hiring requirements and candidate matching active in MongoDB Atlas.",
          type: "INFO",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      total: notifs.length
    });
  } catch (err) {
    return res.json({ success: true, data: [], total: 0 });
  }
});
app.get("/api/health", async (_req, res) => {
  try {
    const [
      candidates,
      companies,
      evaluators,
      requirements,
      evaluations,
      shortlists,
      placements
    ] = await Promise.all([
      CandidateModel.countDocuments(),
      CompanyModel.countDocuments(),
      EvaluatorModel.countDocuments(),
      RequirementModel.countDocuments(),
      EvaluationModel.countDocuments(),
      ShortlistModel.countDocuments(),
      PlacementModel.countDocuments()
    ]);
    return res.json({
      status: "HEALTHY",
      service: "Talent Hire Central API (MongoDB Atlas Dynamic)",
      database: "MongoDB Atlas (anthurium cluster0)",
      uptime: process.uptime(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      metrics: {
        candidates,
        companies,
        evaluators,
        requirements,
        evaluations,
        shortlists,
        placements
      }
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", error: error.message });
  }
});
var PORT = process.env.PORT || 5e3;
async function bootstrap() {
  await connectMongo();
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` TALENT HIRE - CENTRAL API`);
    console.log(` Database: 100% Dynamic MongoDB Atlas`);
    console.log(` Core positioning: Find. Evaluate. Hire.`);
    console.log(` Listening on: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}
if (!process.env.VERCEL) {
  bootstrap().catch((err) => {
    console.error("Fatal bootstrap failure:", err);
  });
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = app;
  module.exports.default = app;
  module.exports.app = app;
  module.exports.server = server;
  module.exports.io = io;
}
var src_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  io,
  server
});
