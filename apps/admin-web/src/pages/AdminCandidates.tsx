import React, { useEffect, useState } from 'react';
import { Candidate } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { DataTable, StatusBadge } from '@thamilarasan/ui';
import { ShieldCheck, MapPin } from 'lucide-react';

export const AdminCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCandidates('limit=50').then((res) => {
      if (res.success && res.data) setCandidates(res.data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: 'fullName',
      header: 'Engineer',
      sortable: true,
      render: (c: Candidate) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{c.fullName}</span>
            {c.verifiedBadge && <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />}
          </div>
          <span className="text-[11px] text-slate-500 block truncate max-w-xs">{c.headline}</span>
        </div>
      ),
    },
    {
      key: 'totalYearsOfExperience',
      header: 'Exp',
      sortable: true,
      render: (c: Candidate) => <span className="font-semibold text-slate-700">{c.totalYearsOfExperience} yrs</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (c: Candidate) => <span className="text-slate-600">{c.location}</span>,
    },
    {
      key: 'noticePeriodDays',
      header: 'Notice',
      sortable: true,
      render: (c: Candidate) => <span>{c.noticePeriodDays} days</span>,
    },
    {
      key: 'expectedSalaryUsd',
      header: 'Target USD',
      sortable: true,
      render: (c: Candidate) => <span className="font-bold text-slate-900">{formatUSD(c.expectedSalaryUsd)}</span>,
    },
    {
      key: 'state',
      header: 'Pipeline State',
      render: (c: Candidate) => <StatusBadge status={c.state} size="sm" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Software Talent Pool (500 Candidates)</h1>
        <p className="text-xs text-slate-500 mt-1">Pre-vetted Indian software engineers across backend, frontend, cloud, and AI.</p>
      </div>

      <DataTable
        columns={columns}
        data={candidates as any}
        keyExtractor={(c: any) => c.id}
        searchPlaceholder="Search candidates by name, role, or stack..."
      />
    </div>
  );
};
