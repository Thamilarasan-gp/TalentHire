import React from 'react';
import { ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const CompanyReplacements: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">90-Day Placement Guarantee & Replacement</h1>
        <p className="text-xs text-slate-500 mt-1">
          Every placement is protected by our non-negotiable 90-day replacement commitment.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Active Guarantee: Zero Friction Replacement</h3>
            <p className="text-xs text-slate-500">1 active placement protected under guarantee window.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block">Placement: Priya Nair (Senior Node.js Backend)</span>
          <p className="text-slate-600">Start Date: Oct 15, 2026 • Guarantee End: Jan 15, 2027 (78 days remaining)</p>
          <p className="text-[11px] text-slate-500 pt-1">
            If the engineer resigns or performance standards are not satisfied within 90 days, we immediately source and evaluate qualified replacements at $0 additional platform fee.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm">
            Request Guarantee Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};
