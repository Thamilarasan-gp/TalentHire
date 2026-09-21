import React, { useState, useEffect } from 'react';
import { formatUSD, formatINR } from '@thamilarasan/utils';
import { DataTable, Column, StatusBadge, Button } from '@thamilarasan/ui';
import { CheckCircle2, Shield, Calendar, DollarSign, RefreshCw, Building } from 'lucide-react';

export const AdminPlacements: React.FC = () => {
  const [placements, setPlacements] = useState<any[]>([]);

  useEffect(() => {
    setPlacements([
      {
        id: 'PLC-7701',
        candidateName: 'Karthik Iyer',
        role: 'Senior Node.js Distributed Systems',
        companyName: 'Vanguard FinTech Global',
        annualSalaryUsd: 88000,
        placementFeeUsd: 13200, // 15%
        startDate: '2026-10-01',
        guaranteeExpiresAt: '2027-01-01', // 90 days
        guaranteeDaysRemaining: 84,
        status: 'ACTIVE_GUARANTEE',
      },
      {
        id: 'PLC-7702',
        candidateName: 'Pooja Sundaram',
        role: 'Lead Full-Stack React Engineer',
        companyName: 'Nordic Health Systems',
        annualSalaryUsd: 95000,
        placementFeeUsd: 14250,
        startDate: '2026-08-15',
        guaranteeExpiresAt: '2026-11-15',
        guaranteeDaysRemaining: 45,
        status: 'ACTIVE_GUARANTEE',
      },
      {
        id: 'PLC-7703',
        candidateName: 'Aditya Nair',
        role: 'Principal SRE / Cloud Platform',
        companyName: 'Apex Cloud Logistics',
        annualSalaryUsd: 110000,
        placementFeeUsd: 16500,
        startDate: '2026-05-01',
        guaranteeExpiresAt: '2026-08-01',
        guaranteeDaysRemaining: 0,
        status: 'GUARANTEE_COMPLETED',
      },
    ]);
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Placement Ref',
      render: (r) => <span className="font-mono text-xs text-slate-500 font-semibold">{r.id}</span>,
    },
    {
      key: 'candidateName',
      header: 'Engineer Placed',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block">{r.candidateName}</span>
          <span className="text-[11px] text-slate-500">{r.role}</span>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'Hiring Company',
      render: (r) => (
        <span className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          {r.companyName}
        </span>
      ),
    },
    {
      key: 'placementFeeUsd',
      header: 'Fee Realized (15%)',
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-emerald-700 text-xs">{formatUSD(r.placementFeeUsd)}</span>
          <span className="text-[10px] text-slate-400 block">Comp: {formatUSD(r.annualSalaryUsd)}/yr</span>
        </div>
      ),
    },
    {
      key: 'guaranteeDaysRemaining',
      header: '90-Day Guarantee',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Shield className={`w-3.5 h-3.5 ${r.guaranteeDaysRemaining > 0 ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className="text-xs font-semibold text-slate-700">
            {r.guaranteeDaysRemaining > 0 ? `${r.guaranteeDaysRemaining} days remaining` : 'Matured (Passed)'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Warranty Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Visual Focal Point */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Placement Performance & Protection
            </span>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              100% 90-Day Replacement Guarantee Policy
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Placements & 90-Day Warranty Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Monitor successful hires, verify start dates, and track 90-day replacement warranty windows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Replacement Audit
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={placements}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Filter candidate or hiring client..."
      />
    </div>
  );
};
