import React, { useEffect, useState } from 'react';
import { Offer } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Gift, CheckCircle2, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

export const TalentOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  useEffect(() => {
    api.getOffers('candidateId=cand-1').then((res) => {
      if (res.success && res.data) {
        if (res.data.length === 0) {
          // Provide a demo extended offer if none found
          setOffers([
            {
              id: 'offer-demo-1',
              requirementId: 'req-1',
              companyId: 'comp-1',
              candidateId: 'cand-1',
              annualSalaryUsd: 88000,
              bonusUsd: 8000,
              equityTerms: '0.05% stock options package with standard 4-year vesting',
              startDate: '2026-10-15',
              expiresAt: '2026-10-01',
              status: 'EXTENDED',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
        } else {
          setOffers(res.data);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleAccept = async (offerId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/offers/${offerId}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setAcceptedId(offerId);
        setOffers((prev) =>
          prev.map((o) => (o.id === offerId ? { ...o, status: 'ACCEPTED' } : o))
        );
      }
    } catch {
      setAcceptedId(offerId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Offers</h1>
        <p className="text-xs text-slate-500 mt-1">Direct contracts extended from hiring companies.</p>
      </div>

      <div className="space-y-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border-2 border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Vanguard FinTech — Senior Node.js Backend</h3>
                  <p className="text-xs text-slate-500">Official Formal Offer Letter</p>
                </div>
              </div>
              <StatusBadge status={offer.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Base Annual Salary</span>
                <span className="text-2xl font-black text-slate-900">{formatUSD(offer.annualSalaryUsd)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Annual Performance Bonus</span>
                <span className="text-xl font-bold text-slate-900">{formatUSD(offer.bonusUsd || 0)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Start Date</span>
                <span className="text-sm font-bold text-slate-900">{formatDate(offer.startDate)}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block">Equity Terms:</span>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-100 italic">
                "{offer.equityTerms || 'Standard 4-year options with 1-year cliff.'}"
              </p>
            </div>

            {offer.status === 'EXTENDED' ? (
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="outline" size="sm">
                  Request Discussion
                </Button>
                <Button
                  variant="success"
                  size="md"
                  onClick={() => handleAccept(offer.id)}
                  leftIcon={<CheckCircle2 className="w-4 h-4 mr-1" />}
                >
                  Accept Offer & Finalize Placement
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Offer Accepted! Placement finalized and onboarding team notified.</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
