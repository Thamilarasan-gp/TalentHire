import React, { useState } from 'react';
import { Button, StatusBadge, DataTable, Column } from '@thamilarasan/ui';
import { Users, Shield, Key, Lock, CheckCircle2, XCircle, Plus } from 'lucide-react';

export const AdminUsersRoles: React.FC = () => {
  const [users, setUsers] = useState<any[]>([
    {
      id: 'USR-001',
      name: 'Thamilarasan R',
      email: 'thamilarasan@thamilarasan.global',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      lastLogin: '10 mins ago',
      mfaEnabled: true,
      permissionsCount: 'Full Root Access (28)',
    },
    {
      id: 'USR-002',
      name: 'Sarah Jenkins',
      email: 'sarah.j@thamilarasan.global',
      role: 'OPS_ADMIN',
      status: 'ACTIVE',
      lastLogin: '2 hours ago',
      mfaEnabled: true,
      permissionsCount: 'Operations & QA (18)',
    },
    {
      id: 'USR-003',
      name: 'Praveen Chander',
      email: 'praveen.c@thamilarasan.global',
      role: 'FINANCE_ADMIN',
      status: 'ACTIVE',
      lastLogin: 'Yesterday',
      mfaEnabled: true,
      permissionsCount: 'Payouts & Invoicing (12)',
    },
    {
      id: 'USR-004',
      name: 'Auditor Security Service',
      email: 'compliance-daemon@thamilarasan.global',
      role: 'AUDITOR',
      status: 'ACTIVE',
      lastLogin: '5 mins ago',
      mfaEnabled: true,
      permissionsCount: 'Read-Only WORM Log (6)',
    },
  ]);

  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Admin User',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block">{r.name}</span>
          <span className="text-[11px] text-slate-500">{r.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'RBAC Role',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
          {r.role}
        </span>
      ),
    },
    {
      key: 'permissionsCount',
      header: 'Scope of Authority',
      render: (r) => <span className="text-xs text-slate-700 font-medium">{r.permissionsCount}</span>,
    },
    {
      key: 'mfaEnabled',
      header: 'Hardware 2FA / WebAuthn',
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Enforced
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Access Control & Zero Trust
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Internal Administrators & RBAC Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Strict role-based segregation of duties between Platform Admins, Calibration Quality Leads, and Finance Disbursers.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Invite Security Principal
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        searchPlaceholder="Filter administrator name or role..."
      />
    </div>
  );
};
