import React, { useEffect, useState } from 'react';
import { Placement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { StatusBadge, StatCard } from '@thamilarasan/ui';
import { Award, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';

export const CompanyPlacements: React.FC = () => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPlacements('companyId=comp-1').then((res) => {
      if (res.success && res.data) setPlacements(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Placements & Hired Talent</h1>
        <p className="text-xs text-slate-500 mt-1">
          Engineers placed through Thamilarasan Global with active 90-day replacement guarantees.
        </p>
      </div>

      <div className="space-y-4">
        {placements.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {p.candidateId === 'cand-2' ? 'Priya Nair' : 'Karthik Iyer'} — Senior Node.js Backend
                </h3>
                <StatusBadge status={p.state} size="sm" />
              </div>
              <p className="text-xs text-slate-500">
                Annual Compensation: <strong>{formatUSD(p.annualSalaryUsd)}</strong> • Platform Placement Fee: <strong>{formatUSD(p.platformFeeUsd)}</strong>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span>Joined: {formatDate(p.startDate)}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Guarantee Active until {formatDate(p.guaranteeEndDate)}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Guarantee Protected
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
