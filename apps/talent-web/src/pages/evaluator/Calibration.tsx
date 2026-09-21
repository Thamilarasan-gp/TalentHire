import React from 'react';
import { StatCard } from '@thamilarasan/ui';
import { Activity, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Calibration: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluator QA & Calibration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Objective evaluation metrics monitored by central platform QA reviewers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Inter-Rater Agreement"
          value="91%"
          subtext="Correlation with double-blind reviews"
          icon={<Activity className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="Pass Rate"
          value="64%"
          subtext="Healthy standard (industry benchmark ~60%)"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="QA Approval Rate"
          value="98.5%"
          subtext="Scorecards accepted without dispute"
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
        />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          QA Calibration Principles
        </h3>
        <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Evidence-Based Observations:</strong> Scores without descriptive evidence notes are returned for reassessment by central QA.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Random Sampling:</strong> 15% of all evaluations undergo double-blind review to ensure consistency across the evaluator network.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Outcome Pressure:</strong> Evaluator earnings are 100% independent of whether a candidate passes or gets hired.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
