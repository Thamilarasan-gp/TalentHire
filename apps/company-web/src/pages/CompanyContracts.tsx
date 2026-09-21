import React from 'react';
import { FileCheck, CheckCircle2, Download } from 'lucide-react';
import { StatusBadge, Button } from '@thamilarasan/ui';

export const CompanyContracts: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contracts & Onboarding</h1>
        <p className="text-xs text-slate-500 mt-1">Formal employment contracts and remote onboarding milestones.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Priya Nair — Senior Backend Contract</h3>
            <p className="text-xs text-slate-500">Executed on Sept 18, 2026 • Electronic signature verified</p>
          </div>
          <StatusBadge status="ACTIVE" size="sm" />
        </div>

        <div className="space-y-3 text-xs">
          <span className="font-bold text-slate-900 block">Onboarding Checklist</span>
          {[
            { task: 'International IP Assignment Agreement Signed', done: true },
            { task: 'Background Identity Check & Liveness Verified', done: true },
            { task: 'Corporate Security & VPN Credentials Provisioned', done: true },
            { task: 'First Week Engineering Sprint Planning Sync', done: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className={`w-4 h-4 ${item.done ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span className={item.done ? 'text-slate-800 font-medium' : 'text-slate-500'}>{item.task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
