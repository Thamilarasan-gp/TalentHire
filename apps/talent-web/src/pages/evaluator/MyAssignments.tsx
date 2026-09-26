import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatINR } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Video, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export const MyAssignments: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let evalId = 'eval-1';
    try {
      const stored = localStorage.getItem('tg_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.evaluatorId) evalId = u.evaluatorId;
        else if (u.id && u.id.startsWith('eval-')) evalId = u.id;
      }
    } catch {
      // ignore
    }

    api.getEvaluations(`evaluatorId=${evalId}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setEvaluations(res.data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Active Assignments</h1>
        <p className="text-xs text-slate-500 mt-1">
          Accepted technical evaluation sessions awaiting interview or scorecard submission.
        </p>
      </div>

      <div className="space-y-4">
        {evaluations.map((ev) => (
          <div
            key={ev.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">
                  Senior Node.js Backend Candidate
                </span>
                <StatusBadge status={(ev as any).status || ev.state || 'SCHEDULED'} size="sm" />
              </div>
              <p className="text-xs text-slate-500">
                Evaluation ID: {ev.id} • Target Role: 10 Senior Node.js Engineers
              </p>
              <span className="text-xs font-bold text-emerald-600 block">
                Payable on submission: {formatINR(ev.payoutAmountInr || (ev as any).honorariumInr || 5000)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link to={`/evaluator/interview-room/${ev.id}`}>
                <Button size="sm" variant="outline" leftIcon={<Video className="w-3.5 h-3.5 mr-1 text-blue-600" />}>
                  Enter Room
                </Button>
              </Link>
              <Link to={`/evaluator/scorecard/${ev.id}`}>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 border-purple-600" leftIcon={<FileText className="w-3.5 h-3.5 mr-1" />}>
                  Open Scorecard
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
