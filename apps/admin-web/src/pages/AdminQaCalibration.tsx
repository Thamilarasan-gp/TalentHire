import React, { useEffect, useState } from 'react';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { StatCard, StatusBadge, Button } from '@thamilarasan/ui';
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const AdminQaCalibration: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    api.getEvaluations().then((res) => {
      if (res.success && res.data) {
        setEvaluations(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await api.reviewQa(id, {
        status: 'APPROVED',
        notes: 'QA calibration verified. Rubric evidence notes meet benchmark standards.',
      });

      if (res.success && res.data) {
        setEvaluations((prev) =>
          prev.map((e) => (e.id === id ? { ...e, state: 'APPROVED', qaStatus: 'APPROVED' } : e))
        );
      }
    } finally {
      setApprovingId(null);
    }
  };

  const queue = evaluations.filter((e) => e.state === 'QA_REVIEW' || e.state === 'SUBMITTED');
  const approved = evaluations.filter((e) => e.state === 'APPROVED');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">QA Review & Evaluator Calibration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Central quality assurance auditing scorecards, inter-rater variance, and honorarium release.
        </p>
      </div>

      {/* Calibration Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Inter-Rater Agreement"
          value="91%"
          subtext="Target: ≥ 85%"
          icon={<Scale className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="Network Pass Rate"
          value="64%"
          subtext="Calibrated benchmark (~60%)"
          icon={<Activity className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Score Variance"
          value="± 4.2 pts"
          subtext="Low deviation across evaluators"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="QA Queue"
          value={queue.length}
          subtext="Awaiting review"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
        />
      </div>

      {/* Pending QA Queue */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Scorecard Calibration Queue</h3>
            <p className="text-xs text-slate-500">Submitted evaluations requiring QA review before shortlist inclusion.</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {queue.length} Pending Actions
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {queue.slice(0, 8).map((ev) => (
            <div key={ev.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50">
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{ev.id}</span>
                  <StatusBadge status={ev.state} size="sm" />
                  <span className="font-bold text-blue-600">Candidate: {ev.candidateId}</span>
                </div>
                <p className="text-slate-600 font-medium">Evaluator: {ev.evaluatorId} • Score: <strong>{ev.overallScore || 88}/100</strong></p>
                <p className="text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 max-w-2xl">
                  "{ev.strengths[0] || 'Clear asynchronous event loop mastery and distributed locking strategy.'}"
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApprove(ev.id)}
                  isLoading={approvingId === ev.id}
                >
                  Reject for Reassessment
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleApprove(ev.id)}
                  isLoading={approvingId === ev.id}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                >
                  Approve & Release Payout
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
