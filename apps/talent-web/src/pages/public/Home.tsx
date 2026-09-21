import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Cpu,
  Award,
  Sparkles,
  Search,
  FileCheck,
  Briefcase
} from 'lucide-react';
import { Button, StatCard } from '@thamilarasan/ui';

export const Home: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      num: '01',
      title: 'Company Posts Requirement',
      desc: 'Role specifications, required tech stack, experience depth, budget, and custom rubric benchmarks.',
      badge: 'Company Controlled',
    },
    {
      num: '02',
      title: 'Deterministic Matching',
      desc: 'Zero black-box AI. Transparent 2-stage matching evaluates hard constraints and weighted skill criteria.',
      badge: 'Rule-Engine',
    },
    {
      num: '03',
      title: 'Independent Evaluator Assigned',
      desc: 'Vetted Staff/Principal software engineers assigned with automatic conflict-of-interest exclusion.',
      badge: 'Conflict Free',
    },
    {
      num: '04',
      title: 'Structured Technical Scorecard',
      desc: 'Standardized 1-10 anchored criteria with concrete code observation evidence. (Pass / Fail / Review).',
      badge: 'Evidence Anchored',
    },
    {
      num: '05',
      title: 'QA Review & Calibration',
      desc: 'Central QA verifies inter-rater agreement and rubric consistency before candidates unlock.',
      badge: 'Calibrated',
    },
    {
      num: '06',
      title: 'Verified Top-N Shortlist',
      desc: 'Company receives ranked candidate dossiers with complete evaluation reports and strength notes.',
      badge: 'Zero Fluff',
    },
    {
      num: '07',
      title: 'Company Interview & Final Decision',
      desc: 'The company meets verified finalists and holds 100% decision authority on hiring.',
      badge: '100% Company Decision',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>THE GLOBAL HIRING INFRASTRUCTURE FOR INDIAN SOFTWARE TALENT</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Find. Evaluate. Hire.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Connect international companies with verified Indian software engineers through requirement-based matching and a distributed network of independent expert evaluators.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/jobs">
                <Button size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Verified Roles
                </Button>
              </Link>
              <a href="http://localhost:3002">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                  For Companies: Post Requirement
                </Button>
              </a>
            </div>

            {/* Non-negotiable trust badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-sm">
                <span className="text-xs font-bold text-slate-900 block">100% Free For Talent</span>
                <span className="text-[11px] text-slate-500">Candidates never pay for the platform</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-sm">
                <span className="text-xs font-bold text-slate-900 block">Conflict-Free Evaluators</span>
                <span className="text-[11px] text-slate-500">Evaluators are paid for evaluations, not hires</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-sm">
                <span className="text-xs font-bold text-slate-900 block">Deterministic Matching</span>
                <span className="text-[11px] text-slate-500">Transparent criteria, zero black-box AI</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-sm">
                <span className="text-xs font-bold text-slate-900 block">Company Decides</span>
                <span className="text-[11px] text-slate-500">100% final hiring authority stays with company</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PLATFORM PIPELINE FLOW */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
              End-To-End Architecture
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              How The Vetting Pipeline Works
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Every hire moves through a rigorous, calibrated pipeline designed to eliminate recruiter noise and highlight proven technical capability.
            </p>
          </div>

          {/* Interactive Stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 mb-10">
            {pipelineSteps.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-mono font-bold text-blue-400 block mb-1">{step.num}</span>
                <h4 className="text-xs font-bold line-clamp-2 tracking-tight text-white mb-2">{step.title}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 block w-fit">
                  {step.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Active Detail Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400">STAGE {pipelineSteps[activeStep].num}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-semibold text-emerald-400">{pipelineSteps[activeStep].badge}</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{pipelineSteps[activeStep].title}</h3>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">{pipelineSteps[activeStep].desc}</p>
            </div>
            <div className="shrink-0 flex gap-2">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : pipelineSteps.length - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium hover:bg-slate-800 text-slate-300"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStep((prev) => (prev < pipelineSteps.length - 1 ? prev + 1 : 0))}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white shadow-sm"
              >
                Next Stage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE AUDIENCES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Engineers */}
            <div className="p-8 border border-slate-200/80 rounded-2xl bg-slate-50/40 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">For Software Engineers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with international remote companies. Get assessed on real engineering capability rather than keyword-stuffed resumes. Zero platform fees.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Direct USD compensation offers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Constructive evaluation feedback
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified candidate badge
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/for-engineers" className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                  Learn more for engineers <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Evaluators */}
            <div className="p-8 border border-slate-200/80 rounded-2xl bg-slate-50/40 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">For Expert Evaluators</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lead, Staff, and Principal engineers monetizing architectural expertise. Evaluate peers on clear anchored rubrics with scheduled payouts per completed session.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ₹3,500 – ₹7,500 per completed evaluation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Paid for evaluation completion, NOT hiring outcome
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Total conflict of interest protection
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/for-evaluators" className="text-xs font-bold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1">
                  Join evaluator network <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Companies */}
            <div className="p-8 border border-slate-200/80 rounded-2xl bg-slate-50/40 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">For Global Companies</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive pre-evaluated, QA-verified Top-N shortlists in days. Review comprehensive technical dossiers, run final rounds, and hire with 90-day replacement guarantees.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pre-screened coding & system design dossiers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Side-by-side candidate comparison mode
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tenant isolated confidential data
                </li>
              </ul>
              <div className="pt-4">
                <a href="http://localhost:3002" className="text-xs font-bold text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-1">
                  Access company portal <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience hiring without borders?
          </h2>
          <p className="text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of Indian software engineers and hundreds of global companies finding the right match with Talent Hire.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs">
              <button className="px-6 py-3 rounded-lg bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-[0.98] transition-all">
                Browse Global Openings
              </button>
            </Link>
            <Link to="/for-evaluators">
              <button className="px-6 py-3 rounded-lg bg-blue-700 text-white font-bold text-sm border border-blue-500 hover:bg-blue-800 transition-all">
                Apply as Evaluator
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
