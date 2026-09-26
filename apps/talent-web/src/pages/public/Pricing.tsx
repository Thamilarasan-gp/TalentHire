import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, HelpCircle, Zap, Building2, Flame, Award, ArrowRight } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const Pricing: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Transparent Pricing Architecture</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Fair, Predictable Plans for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Companies & Talent</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Candidates get 10 free evaluations to unlock 5-day multi-job passes. Companies choose between flexible single-opening passes or unlimited growth subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Card 1: Job Seekers */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500" />
              For Software Engineers
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">5-Day Stack Pass</h3>
            <div className="text-3xl font-extrabold text-slate-900">
              ₹0 <span className="text-xs font-normal text-slate-500 block">First 10 Evaluations Free</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Earn an active 5-Day Pass in your primary stack. Apply to unlimited matching companies with 1 click without repeating round-1 coding screens.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 10 Free technical evaluations</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 5-Day Multi-Job Passport per pass</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 1-Click apply to verified roles</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Objective rubric marks from Staff engineers</li>
            </ul>
          </div>
          <Link to="/talent/stack-passes" className="w-full">
            <Button variant="outline" className="w-full font-bold">Earn Your Stack Pass</Button>
          </Link>
        </div>

        {/* Card 2: Company Single Opening (Pay-Per-Opening) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-500" />
              Pay-Per-Opening
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Single Opening Pass</h3>
            <div className="text-3xl font-extrabold text-slate-900">
              ₹15,000 <span className="text-xs font-normal text-slate-500 block">($199 USD per role)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ideal for startups hiring 1 or 2 specialized engineers. Receive vetted candidates holding active 5-day passes.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> 1 Active verified job opening</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> 30-day candidate pipeline access</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Pre-screened candidates with Stack Passes</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Standard candidate dossiers & scores</li>
            </ul>
          </div>
          <a href="https://talenthirec.vercel.app/company" className="w-full">
            <Button variant="outline" className="w-full font-bold">Post a Single Role</Button>
          </a>
        </div>

        {/* Card 3: Company Unlimited Subscription */}
        <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            Scale-Up Choice
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-purple-600" />
              Unlimited Growth Subscription
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Unlimited Openings</h3>
            <div className="text-3xl font-extrabold text-slate-900">
              ₹75,000 <span className="text-xs font-normal text-slate-500 block">($999 USD / month)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              For tech companies hiring continuously across SDE, AI/ML, and Data Engineering stacks.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> <strong>Unlimited</strong> active job postings</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> Continuous access to all active Pass holders</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> Priority automated shortlists & calendar sync</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> Dedicated account manager & custom rubrics</li>
            </ul>
          </div>
          <a href="https://talenthirec.vercel.app/company" className="w-full">
            <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-md">
              Start Unlimited Subscription
            </Button>
          </a>
        </div>
      </div>

      {/* Evaluator Compensation Spotlight */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-800/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">Independent Evaluator Model</span>
            <h3 className="text-2xl font-bold tracking-tight">How Technical Evaluators Earn</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Staff, Principal, and Lead engineers evaluate candidate Stack Cards. Earn <strong>₹2,000 Placement Bounties</strong> when your passed candidates get hired, and unlock <strong>instant scratch cards (₹1–₹20)</strong> for every completed review.
            </p>
          </div>
          <Link to="/for-evaluators">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold whitespace-nowrap shadow-md" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Explore Evaluator Rewards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
