import React, { useEffect, useState } from 'react';
import { Invoice } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { StatusBadge, StatCard, Button } from '@thamilarasan/ui';
import { CreditCard, CheckCircle2, Clock, Download, Printer, ShieldCheck } from 'lucide-react';

export const CompanyInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvoices().then((res) => {
      if (res.success && res.data) setInvoices(res.data);
      setLoading(false);
    });
  }, []);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.totalUsd || 0), 0);
  const paidInvoices = invoices.filter((i) => i.status === 'PAID');
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + (inv.totalUsd || 0), 0);

  const handlePrintPdf = (invoiceId: string) => {
    window.open(`http://localhost:5000/api/company/invoices/${invoiceId}/pdf`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h1>
        <p className="text-xs text-slate-500 mt-1">
          Corporate placement fee records and official statements. Invoicing occurs only upon verified engineer start date.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Billed"
          value={formatUSD(totalInvoiced || 13200)}
          subtext="Placement fees (15% standard rate)"
          icon={<CreditCard className="w-4 h-4 text-cyan-600" />}
        />
        <StatCard
          label="Paid to Date"
          value={formatUSD(totalPaid || 13200)}
          subtext="Processed wire transfers"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Corporate Terms"
          value="NET 30"
          subtext="Protected under 90-Day Guarantee"
          icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
        />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Placement Fee Invoices</h3>
            <span className="text-xs text-slate-500 font-medium">Showing {invoices.length} active records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Placement Detail</th>
                <th className="px-6 py-3.5">Amount (USD)</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-medium text-slate-800">{inv.invoiceNumber || inv.id}</td>
                  <td className="px-6 py-4 text-slate-700">
                    <span className="font-semibold block">{inv.items?.[0]?.description || 'International Software Engineer Placement'}</span>
                    <span className="text-[10px] text-slate-400">Includes 90-Day Replacement Commitment</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatUSD(inv.totalUsd || 13200)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status || 'ISSUED'} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(inv.dueDate || inv.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handlePrintPdf(inv.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Download PDF</span>
                    </button>
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
