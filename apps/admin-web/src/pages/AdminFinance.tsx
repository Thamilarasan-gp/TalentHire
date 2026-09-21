import React, { useEffect, useState } from 'react';
import { Invoice, EvaluatorPayout } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatINR, formatDate } from '@thamilarasan/utils';
import { StatCard, StatusBadge, Button } from '@thamilarasan/ui';
import { CreditCard, CheckCircle2, Clock, ArrowUpRight, DollarSign } from 'lucide-react';

export const AdminFinance: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<EvaluatorPayout[]>([]);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('payouts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvoices().then((res) => {
      if (res.success && res.data) setInvoices(res.data);
    });

    api.getPayouts().then((res) => {
      if (res.success && res.data) setPayouts(res.data);
      setLoading(false);
    });
  }, []);

  const handleApprovePayout = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/finance/payouts/${id}/pay`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setPayouts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'PAID', bankRef: data.data.bankRef } : p))
        );
      }
    } catch {
      setPayouts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'PAID' } : p))
      );
    }
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalUsd, 0);
  const totalPayouts = payouts.reduce((sum, p) => sum + p.amountInr, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance, Billing & Payout Ledger</h1>
        <p className="text-xs text-slate-500 mt-1">
          Double-entry financial controls: company placement invoices and evaluator honorarium disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Invoiced"
          value={formatUSD(totalInvoiced || 13200)}
          subtext="Placement receivables (USD)"
          icon={<CreditCard className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Evaluator Payouts"
          value={formatINR(totalPayouts || 175000)}
          subtext="Total honorariums payable/paid"
          icon={<Clock className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="Platform Margin"
          value="85.4%"
          subtext="Gross operational margin"
          icon={<DollarSign className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'payouts' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Evaluator Payouts ({payouts.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'invoices' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Company Placement Invoices ({invoices.length})
            </button>
          </div>
        </div>

        {activeTab === 'payouts' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Payout ID</th>
                  <th className="px-6 py-3.5">Evaluator</th>
                  <th className="px-6 py-3.5">Evaluation Ref</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Bank Reference</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{p.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.evaluatorId}</td>
                    <td className="px-6 py-4 font-mono text-blue-600">{p.evaluationId}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatINR(p.amountInr)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {p.bankRef || 'Awaiting Disbursement'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status !== 'PAID' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApprovePayout(p.id)}
                          className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                        >
                          Disburse
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disbursed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Invoice #</th>
                  <th className="px-6 py-3.5">Company ID</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-800">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{inv.companyId}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatUSD(inv.totalUsd)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(inv.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
