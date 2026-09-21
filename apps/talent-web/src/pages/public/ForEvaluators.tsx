import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldAlert, DollarSign, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const ForEvaluators: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600">The Independent Evaluator Network</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Monetize Your Architectural Mastery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Join an elite network of Staff, Principal, and Lead engineers conducting high-integrity technical evaluations. Transparent compensation per completed review, with full conflict protection.
        </p>
        <div className="pt-2">
          <Link to="/evaluator/dashboard">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 border-purple-600" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Access Evaluator Console
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Core Compensation Model</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Evaluators are paid strictly for completed evaluations—never on whether the candidate gets hired or placed. This guarantees 100% objective, conflict-free evaluation rigor.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Standard Technical Evaluation</span>
                <span className="text-[11px] text-slate-500">60-minute structured session + scorecard</span>
              </div>
              <span className="text-base font-extrabold text-slate-900">₹3,500</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Specialist / Deep Architecture Session</span>
                <span className="text-[11px] text-slate-500">System design, high-frequency, deep ML</span>
              </div>
              <span className="text-base font-extrabold text-slate-900">₹5,500</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Principal / Executive Engineering Review</span>
                <span className="text-[11px] text-slate-500">VP & Director level technical assessments</span>
              </div>
              <span className="text-base font-extrabold text-slate-900">₹7,500</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Conflict-of-Interest & Privacy Safeguards</h3>
          <ul className="space-y-4 text-xs text-slate-600">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Automatic Conflict Block:</strong> The system verifies previous employers and automatically prevents assignments involving current or past colleagues.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Confidential Identity:</strong> Evaluator current employer names are never used for public marketing without explicit authorization.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Flexible Workload:</strong> Set your own weekly hours and accept or decline assignments at your convenience.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
