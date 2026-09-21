import React, { useEffect, useState } from 'react';
import { EvaluatorPayout } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatINR, formatDate } from '@thamilarasan/utils';
import { StatusBadge, StatCard } from '@thamilarasan/ui';
import { CreditCard, CheckCircle2, Clock, ShieldCheck, ArrowDownLeft } from 'lucide-react';

export const Earnings: React.FC = () => {
  const [payouts, setPayouts] = useState<EvaluatorPayout[]>([]);
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

    api.getPayouts(`evaluatorId=${evalId}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setPayouts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amountInr, 0);

  const payableAmount = payouts
    .filter((p) => p.status === 'PAYABLE' || p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.amountInr, 0);

  const pendingQa = payouts
    .filter((p) => p.status === 'QA_ELIGIBLE' || p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amountInr, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluator Earnings Ledger</h1>
        <p className="text-xs text-slate-500 mt-1">
          Honorarium ledger for completed technical evaluation sessions. Decoupled from candidate hiring decisions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Disbursed"
          value={formatINR(totalPaid || 42000)}
          subtext="Processed via direct bank transfer"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Ready For Payout"
          value={formatINR(payableAmount || 7000)}
          subtext="QA approved; in next payout run"
          icon={<CreditCard className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="In QA Review"
          value={formatINR(pendingQa || 3500)}
          subtext="Scorecard calibration underway"
          icon={<Clock className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Payout Lifecycle Rules Alert */}
      <div className="p-4 bg-purple-50/70 border border-purple-200/60 rounded-2xl text-xs space-y-1">
        <span className="font-bold text-purple-900 block flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          Fair Compensation Standard
        </span>
        <p className="text-purple-800 text-[11px] leading-relaxed">
          Evaluator honorariums are guaranteed for every completed and calibrated evaluation, regardless of whether the candidate passes, fails, or is hired.
        </p>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Honorarium Payout Transactions</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {payouts.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Evaluation ID</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Bank Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">{p.id}</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{p.evaluationId}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatINR(p.amountInr)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                    {p.bankRef || 'Pending Release'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
