import React, { useEffect, useState } from 'react';
import { Company } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { DataTable, StatusBadge, Button } from '@thamilarasan/ui';
import { Building2, ShieldCheck, ExternalLink } from 'lucide-react';

export const AdminCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanies().then((res) => {
      if (res.success && res.data) setCompanies(res.data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: 'name',
      header: 'Company Name',
      sortable: true,
      render: (c: Company) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
            {c.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{c.name}</span>
            <span className="text-[11px] text-slate-500">{c.industry}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'headquarters',
      header: 'Location',
      sortable: true,
      render: (c: Company) => <span className="text-slate-600">{c.headquarters}</span>,
    },
    {
      key: 'size',
      header: 'Size',
      render: (c: Company) => <span className="text-slate-600">{c.size} employees</span>,
    },
    {
      key: 'billingTier',
      header: 'Tier',
      sortable: true,
      render: (c: Company) => (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {c.billingTier}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Company) => <StatusBadge status={c.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Client Organizations</h1>
        <p className="text-xs text-slate-500 mt-1">25 verified international companies hiring Indian software talent.</p>
      </div>

      <DataTable
        columns={columns}
        data={companies as any}
        keyExtractor={(c: any) => c.id}
        searchPlaceholder="Search companies by name or industry..."
      />
    </div>
  );
};
