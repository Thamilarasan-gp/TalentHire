import React, { useEffect, useState } from 'react';
import { Evaluator } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatINR } from '@thamilarasan/utils';
import { DataTable, StatusBadge } from '@thamilarasan/ui';
import { Award, ShieldCheck } from 'lucide-react';

export const AdminEvaluators: React.FC = () => {
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvaluators().then((res) => {
      if (res.success && res.data) setEvaluators(res.data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: 'fullName',
      header: 'Evaluator',
      sortable: true,
      render: (e: Evaluator) => (
        <div>
          <span className="font-bold text-slate-900 block">{e.fullName}</span>
          <span className="text-[11px] text-slate-500">{e.title}</span>
        </div>
      ),
    },
    {
      key: 'yearsOfExperience',
      header: 'Exp',
      sortable: true,
      render: (e: Evaluator) => <span className="font-semibold text-slate-700">{e.yearsOfExperience} yrs</span>,
    },
    {
      key: 'completedEvaluationsCount',
      header: 'Completed',
      sortable: true,
      render: (e: Evaluator) => <span className="font-bold text-slate-900">{e.completedEvaluationsCount}</span>,
    },
    {
      key: 'reliabilityScore',
      header: 'Reliability',
      sortable: true,
      render: (e: Evaluator) => (
        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
          {e.reliabilityScore}%
        </span>
      ),
    },
    {
      key: 'totalEarningsInr',
      header: 'Disbursed',
      sortable: true,
      render: (e: Evaluator) => <span className="font-bold text-slate-900">{formatINR(e.totalEarningsInr)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (e: Evaluator) => <StatusBadge status={e.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Independent Evaluator Network (50 Experts)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Staff and Principal software architects conducting peer evaluations with conflict-of-interest shielding.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={evaluators as any}
        keyExtractor={(e: any) => e.id}
        searchPlaceholder="Search evaluators by name or title..."
      />
    </div>
  );
};
