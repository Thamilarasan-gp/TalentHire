import React, { useState, useEffect } from 'react';
import { formatINR } from '@thamilarasan/utils';
import { DataTable, Column, StatusBadge, Button } from '@thamilarasan/ui';
import { Award, CheckCircle2, Download, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const AdminPayouts: React.FC = () => {
  const [payouts, setPayouts] = useState<any[]>([]);

  useEffect(() => {
    setPayouts([
      {
        id: 'PAY-4011',
        evaluatorName: 'Vikramaditya Sengupta',
        evaluatorTitle: 'Staff Backend Architect',
        evaluationId: 'EVL-5501',
        candidateName: 'Karthik Iyer',
        amountInr: 5000,
        disbursedAt: '2026-09-20T08:00:00Z',
        payoutMethod: 'Razorpay Direct IMPS / UPI',
        status: 'DISBURSED',
      },
      {
        id: 'PAY-4012',
        evaluatorName: 'Ananya Deshmukh',
        evaluatorTitle: 'Principal Frontend Engineer',
        evaluationId: 'EVL-5502',
        candidateName: 'Pooja Sundaram',
        amountInr: 5000,
        disbursedAt: 'Pending QA release',
        payoutMethod: 'Pending',
        status: 'HELD_IN_ESCROW',
      },
      {
        id: 'PAY-4013',
        evaluatorName: 'Siddharth Nair',
        evaluatorTitle: 'VP Engineering',
        evaluationId: 'EVL-5498',
        candidateName: 'Rohan Sharma',
        amountInr: 5000,
        disbursedAt: '2026-09-18T14:20:00Z',
        payoutMethod: 'Bank Wire Direct',
        status: 'DISBURSED',
      },
    ]);
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Payout Ref',
      render: (r) => <span className="font-mono text-xs text-slate-500 font-semibold">{r.id}</span>,
    },
    {
      key: 'evaluatorName',
      header: 'Evaluator & Title',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block">{r.evaluatorName}</span>
          <span className="text-[11px] text-slate-500">{r.evaluatorTitle}</span>
        </div>
      ),
    },
    {
      key: 'evaluationId',
      header: 'Target Evaluation',
      render: (r) => (
        <div>
          <span className="font-mono text-xs text-blue-600 font-semibold block">{r.evaluationId}</span>
          <span className="text-[11px] text-slate-400">Candidate: {r.candidateName}</span>
        </div>
      ),
    },
    {
      key: 'amountInr',
      header: 'Honorarium',
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{formatINR(r.amountInr)}</span>
          <span className="text-[10px] text-emerald-600 block">Strictly per evaluation</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'payoutMethod',
      header: 'Disbursement Method',
      render: (r) => <span className="text-xs text-slate-600">{r.payoutMethod}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md">
              Evaluator Trust & Compensation
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Decoupled from Hiring Outcome
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Independent Evaluator Honorarium Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Evaluators are strictly compensated ₹5,000 for completed, locked, and calibrated technical reviews — never based on hiring outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export Tax CSV (TDS 194J)
          </Button>
          <Button size="sm" leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
            Process Batch Wire
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payouts}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Filter evaluator or evaluation ID..."
      />
    </div>
  );
};
