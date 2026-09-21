import React from 'react';
import { StatusBadge } from '@thamilarasan/ui';
import { Briefcase, CheckCircle2, Clock } from 'lucide-react';

export const Applications: React.FC = () => {
  const applications = [
    {
      id: 'app-1',
      company: 'Vanguard FinTech (New York)',
      role: 'Senior Node.js Backend Engineer',
      appliedAt: '2026-09-12',
      stage: 'OFFERED',
      stageDesc: 'Formal offer extended ($88,000 / yr). Awaiting candidate acceptance.',
    },
    {
      id: 'app-2',
      company: 'CloudScale Systems (Zurich)',
      role: 'Lead Cloud Infrastructure Architect',
      appliedAt: '2026-09-08',
      stage: 'VERIFIED',
      stageDesc: 'Evaluation complete with PASS verdict. Profile in Top-N Shortlist.',
    },
    {
      id: 'app-3',
      company: 'NeoBank Tokyo (Tokyo)',
      role: 'Senior Distributed Systems Engineer',
      appliedAt: '2026-09-01',
      stage: 'MATCHED',
      stageDesc: 'Deterministic matching passed. Evaluator assignment in queue.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Applications</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time status of your active hiring pipelines.</p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">{app.role}</h3>
                <span className="text-xs text-blue-600 font-semibold">{app.company}</span>
              </div>
              <StatusBadge status={app.stage} size="sm" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {app.stageDesc}
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">Applied on {app.appliedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
