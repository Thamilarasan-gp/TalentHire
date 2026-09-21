import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Scale, Cpu, Award } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">The 7-Stage Process</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How Talent Hire Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          A predictable, calibrated talent infrastructure replacing informal interviews and noisy recruiter spam with deterministic matching and peer-reviewed technical evaluation.
        </p>
      </div>

      <div className="space-y-8">
        {[
          {
            step: '01',
            title: 'Requirement Posting & Rubric Setup',
            who: 'Company',
            desc: 'International companies define exact architectural needs, budget limits, seniority requirements, and specific evaluation rubrics (e.g. system design, async concurrency, clean code).',
          },
          {
            step: '02',
            title: 'Deterministic Rules-First Matching',
            who: 'Engine',
            desc: 'Hard filters instantly screen out mismatched experience, notice periods, and budget constraints. Stage-2 weighted ranking generates an eligible pool based on verifiable criteria—no AI hallucinations.',
          },
          {
            step: '03',
            title: 'Independent Evaluator Assignment',
            who: 'Platform',
            desc: 'Senior, Staff, and Principal software engineers in the target domain are assigned. Strict conflict-of-interest filters automatically block previous coworkers and competing entities.',
          },
          {
            step: '04',
            title: 'Anchored 1-10 Technical Evaluation',
            who: 'Evaluator',
            desc: 'Evaluators conduct 60-minute technical sessions using anchored scorecards (1-3 Inadequate, 4-6 Competent, 7-8 Strong, 9-10 Expert). Evaluators must submit concrete evidence observations for each score.',
          },
          {
            step: '05',
            title: 'QA Review & Inter-Rater Calibration',
            who: 'QA Reviewer',
            desc: 'Platform QA reviews scores against evidence notes to maintain consistent global grading standards. Evaluators are paid immediately upon completed evaluation—never contingent on candidate hire.',
          },
          {
            step: '06',
            title: 'Verified Top-N Shortlist Delivery',
            who: 'Company',
            desc: 'The company receives only vetted candidates with detailed evaluation scorecards, strengths, and risk notes. If a company requests 10 candidates and only 7 pass, we report 7—never fabricating numbers.',
          },
          {
            step: '07',
            title: 'Company Final Interview & Placement',
            who: 'Company Decision',
            desc: 'The company conducts the final interview and makes 100% of the hiring decision. On accepted offer, placement is formalized with a standard 90-day replacement guarantee.',
          },
        ].map((item) => (
          <div
            key={item.step}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="text-3xl font-black font-mono text-blue-600 shrink-0 w-14">
              {item.step}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.who}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link to="/jobs">
          <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
            Explore Openings Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
