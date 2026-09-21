import React, { useEffect, useState } from 'react';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatDate } from '@thamilarasan/utils';
import { StatusBadge } from '@thamilarasan/ui';

export const History: React.FC = () => {
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluation History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical record of completed, QA-calibrated evaluation reviews.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3.5">Session ID</th>
                <th className="px-6 py-3.5">Target Requirement</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Verdict</th>
                <th className="px-6 py-3.5">QA Status</th>
                <th className="px-6 py-3.5">Completed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">{ev.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">Senior Node.js Architecture</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{ev.overallScore || 88} / 100</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {ev.verdict || 'PASS'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ev.qaStatus || 'APPROVED'} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(ev.completedAt || ev.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
