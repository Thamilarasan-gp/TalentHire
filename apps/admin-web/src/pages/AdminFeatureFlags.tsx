import React, { useState } from 'react';
import { Button } from '@thamilarasan/ui';
import { Sliders, CheckCircle2, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminFeatureFlags: React.FC = () => {
  const [flags, setFlags] = useState([
    {
      key: 'ENFORCE_STRICT_CONFLICT_OF_INTEREST',
      title: 'Mandatory Conflict-of-Interest Hard Block',
      desc: 'Disallows any evaluator assignment if past employment overlap in past 5 years is detected.',
      enabled: true,
      category: 'Trust & Safety',
    },
    {
      key: 'NON_FABRICATION_SHORTLIST_GUARD',
      title: 'Non-Fabrication Top-N Shortlist Guard',
      desc: 'If 10 candidates are requested and only 7 qualify, displays 7 with "Sourcing active" instead of lowering thresholds.',
      enabled: true,
      category: 'Integrity',
    },
    {
      key: 'REAL_TIME_LIVENESS_TELEMETRY',
      title: 'Live Audio-Visual Impersonation Detection',
      desc: 'Scans webcam frame frequency and voice harmonics during evaluator sessions.',
      enabled: true,
      category: 'Fraud Prevention',
    },
    {
      key: 'INSTANT_PAYOUT_ON_QA_LOCK',
      title: 'Automated IMPS/UPI Payout on QA Calibration',
      desc: 'Disburses ₹5,000 to evaluator bank account the moment QA marks scorecard as CALIBRATED.',
      enabled: true,
      category: 'Finance',
    },
    {
      key: 'CANDIDATE_FREE_TIER_IMMUTABILITY',
      title: 'Zero Candidate Fee Enforcement',
      desc: 'Blocks any feature or webhook that attempts to charge candidates fees or commissions.',
      enabled: true,
      category: 'Core Policy',
    },
  ]);

  const toggle = (idx: number) => {
    const updated = [...flags];
    updated[idx].enabled = !updated[idx].enabled;
    setFlags(updated);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md">
              Runtime Circuit Breakers
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Feature Flags & Guardrails
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time toggles for platform policies, fraud engines, and financial automation.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {flags.map((flag, idx) => (
          <div
            key={flag.key}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {flag.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{flag.title}</h4>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">{flag.desc}</p>
              <code className="text-[10px] font-mono text-slate-400 block pt-0.5">{flag.key}</code>
            </div>

            <button
              onClick={() => toggle(idx)}
              className={`p-2 rounded-xl transition-colors ${
                flag.enabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'
              }`}
            >
              {flag.enabled ? (
                <ToggleRight className="w-8 h-8 fill-emerald-100" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
