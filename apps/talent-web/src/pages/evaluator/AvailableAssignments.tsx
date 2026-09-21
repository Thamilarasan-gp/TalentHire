import React, { useState } from 'react';
import { formatINR } from '@thamilarasan/utils';
import { Button } from '@thamilarasan/ui';
import { Award, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AvailableAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [conflictDeclared, setConflictDeclared] = useState(false);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const assignments = [
    {
      id: 'assign-1',
      title: 'Senior Node.js Backend Engineer',
      duration: '60 minutes',
      requiredSkills: ['Node.js', 'TypeScript', 'AWS', 'System Design'],
      paymentInr: 3500,
      deadline: 'Today 9:00 PM IST',
      conflictStatus: 'Clear',
      candidateName: 'Candidate #402 (Anonymized Vetting)',
      experience: '7 years backend',
    },
    {
      id: 'assign-2',
      title: 'Staff Distributed Systems Architect',
      duration: '75 minutes',
      requiredSkills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL'],
      paymentInr: 5500,
      deadline: 'Tomorrow 6:00 PM IST',
      conflictStatus: 'Clear',
      candidateName: 'Candidate #118 (Anonymized Vetting)',
      experience: '9 years distributed architecture',
    },
  ];

  const handleAccept = (id: string) => {
    setAcceptedId(id);
    setTimeout(() => {
      navigate('/evaluator/my-assignments');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Available Evaluation Assignments</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review matching assignments, confirm absence of conflict of interest, and accept.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((as) => (
          <div
            key={as.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{as.title}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {as.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{as.candidateName} • {as.experience}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Honorarium Fee</span>
                <span className="text-2xl font-black text-slate-900">{formatINR(as.paymentInr)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {as.requiredSkills.map((sk) => (
                <span key={sk} className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                  {sk}
                </span>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">
                  Conflict-of-Interest Status: <strong className="text-slate-900">Clear</strong> (No employer overlap detected)
                </span>
              </div>
              <div className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5" /> Deadline: {as.deadline}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={conflictDeclared}
                  onChange={(e) => setConflictDeclared(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>I confirm zero personal or professional conflict of interest with this candidate</span>
              </label>

              <Button
                size="md"
                disabled={!conflictDeclared || acceptedId === as.id}
                onClick={() => handleAccept(as.id)}
                className="bg-purple-600 hover:bg-purple-700 border-purple-600"
              >
                {acceptedId === as.id ? 'Assignment Accepted' : 'Accept Evaluation'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
