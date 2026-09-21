import React, { useEffect, useState } from 'react';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { DataTable, StatusBadge } from '@thamilarasan/ui';

export const AdminRequirements: React.FC = () => {
  const [requirements, setRequirements] = useState<HiringRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequirements().then((res) => {
      if (res.success && res.data) setRequirements(res.data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: 'title',
      header: 'Hiring Requirement',
      sortable: true,
      render: (r: HiringRequirement) => (
        <div>
          <span className="font-bold text-slate-900 block">{r.title}</span>
          <span className="text-[11px] text-slate-500">{r.roleCategory}</span>
        </div>
      ),
    },
    {
      key: 'openingsCount',
      header: 'Quota',
      sortable: true,
      render: (r: HiringRequirement) => <span>{r.filledCount || 0} / {r.openingsCount} filled</span>,
    },
    {
      key: 'matchedCount',
      header: 'Matched',
      sortable: true,
      render: (r: HiringRequirement) => <span className="font-bold text-blue-600">{r.matchedCount || 84}</span>,
    },
    {
      key: 'budgetMaxUsd',
      header: 'Budget Range',
      sortable: true,
      render: (r: HiringRequirement) => (
        <span className="font-semibold text-slate-700">
          {formatUSD(r.budgetMinUsd)} – {formatUSD(r.budgetMaxUsd)}
        </span>
      ),
    },
    {
      key: 'state',
      header: 'State',
      render: (r: HiringRequirement) => <StatusBadge status={r.state} size="sm" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client Hiring Requirements (20 Openings)</h1>
        <p className="text-xs text-slate-500 mt-1">Active requirements across European, North American, and Asian clients.</p>
      </div>

      <DataTable
        columns={columns}
        data={requirements as any}
        keyExtractor={(r: any) => r.id}
        searchPlaceholder="Search requirements..."
      />
    </div>
  );
};
