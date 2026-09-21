import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, DollarSign, Award, ArrowRight } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const ForEngineers: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Built For Indian Software Engineers</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Your Engineering Competence Deserves Global Reach
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Skip recruiter spam, cold LinkedIn outreach, and endless rounds of leetcode trivia. Get evaluated once by respected Staff/Principal engineers and unlock direct USD offers from world-class tech firms.
        </p>
        <div className="pt-2">
          <Link to="/talent/dashboard">
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Build Your Engineering Dossier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Always 100% Free</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Candidates never pay a single rupee for profile verification, evaluation, matching, or placements. Ever.
          </p>
        </div>

        <div className="p-6 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Constructive Feedback</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Receive actionable, evidence-backed evaluation feedback from experienced engineers to level up your technical craft.
          </p>
        </div>

        <div className="p-6 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified Candidate Badge</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Passed evaluations grant a verified candidate badge visible to high-paying international employers seeking pre-evaluated engineers.
          </p>
        </div>
      </div>
    </div>
  );
};
