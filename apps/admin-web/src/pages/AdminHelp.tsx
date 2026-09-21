import React from 'react';
import { Card, Button } from '@thamilarasan/ui';
import { BookOpen, ShieldCheck, Scale, Award, FileText, CheckCircle2 } from 'lucide-react';

export const AdminHelp: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-slate-200/80">
        <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
          Documentation & SOPs
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
          Operations & Governance Manual
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Standard operating procedures for managing matches, QA calibration, conflict overrides, and escrow disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Scale className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Evaluator Conflict-of-Interest Policy</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluators may never review a candidate if:
            1. They worked at the same company or subsidiary in the last 5 years.
            2. They have an active referral or financial association.
            3. They attended the same academic cohort within 3 years.
          </p>
          <span className="text-[11px] font-bold text-blue-600 block">SOP-011 • Mandatory Protocol</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Award className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Scorecard Calibration Rubric (1-10)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All numerical ratings must be anchored to concrete observations. Ratings of 9+ or &lt;= 4 require explicit timestamped code references or whiteboard architectural justifications in the evidence notes.
          </p>
          <span className="text-[11px] font-bold text-purple-600 block">SOP-024 • QA Rubric Standards</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">90-Day Placement Warranty SLA</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If a placed engineer departs or fails performance reviews within 90 days of employment start date, Thamilarasan Global provides a 100% free expedited replacement within 14 calendar days.
          </p>
          <span className="text-[11px] font-bold text-emerald-600 block">SOP-038 • Client Warranty SLA</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Zero Candidate Fee Policy</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineers never pay for vetting, interviews, evaluations, or placements. Platform revenues are strictly derived from the 15% placement success fee billed to hiring companies.
          </p>
          <span className="text-[11px] font-bold text-amber-600 block">Foundational Charter #1</span>
        </div>
      </div>
    </div>
  );
};
