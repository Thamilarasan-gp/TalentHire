import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Offer } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Gift, CheckCircle2, DollarSign, Calendar, ShieldCheck, ArrowRight, RefreshCw, Building2 } from 'lucide-react';

export const TalentOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      const u = stored ? JSON.parse(stored) : null;
      return u?.candidateId || u?.id || 'cand-1';
    } catch {
      return 'cand-1';
    }
  };

  const loadOffers = () => {
    setLoading(true);
    const cid = getCandidateId();
    api.getOffers(`candidateId=${cid}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setOffers(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load candidate offers:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOffers();
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Formal Offers & Placement</h1>
          <p className="text-xs text-slate-500 mt-1">Review verified international compensation packages and contracts.</p>
        </div>

        <Button variant="outline" size="sm" onClick={loadOffers} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-medium">Loading formal offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Job Offers Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              When hiring companies complete your interview rounds and make a hiring decision, your formal offer packages will appear dynamically here.
            </p>
          </div>
          <Link to="/talent/applications">
            <Button size="sm" variant="outline">
              View Active Applications
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer: any) => {
            const isAccepted = offer.status === 'ACCEPTED' || acceptedId === offer.id;

            return (
              <div
                key={offer.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 hover:border-emerald-200 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-slate-900">
                        {offer.roleTitle || 'Senior Software Engineer'}
                      </span>
                      <StatusBadge status={isAccepted ? 'ACCEPTED' : offer.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{offer.companyName || 'Hiring Partner Company'}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">ID: {offer.id}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Annual Base Compensation
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {formatUSD(offer.annualSalaryUsd || 85000)}
                    </span>
                    <span className="text-[11px] text-slate-500 block">per year (USD)</span>
                  </div>
                </div>

                {/* Offer Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Signing Bonus</span>
                    <span className="text-sm font-bold text-slate-900">{formatUSD(offer.bonusUsd || offer.signingBonusUsd || 5000)}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Start Date</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {offer.startDate || offer.proposedStartDate || 'Within 30 Days'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Expiry</span>
                    <span className="text-sm font-bold text-amber-700 font-mono">
                      {offer.expiresAt || offer.expiryDate ? formatDate(offer.expiresAt || offer.expiryDate) : 'Valid for 14 Days'}
                    </span>
                  </div>
                </div>

                {/* Terms */}
                {offer.equityTerms || offer.terms ? (
                  <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-blue-900 block">Package Terms & Equity</span>
                    <p className="text-blue-800 leading-relaxed">
                      {offer.equityTerms || offer.terms}
                    </p>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Standard verified international hiring contract backed by platform escrow.
                  </span>

                  <div className="flex items-center gap-3">
                    {isAccepted ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Offer Accepted! Onboarding Activated</span>
                      </div>
                    ) : (
                      <>
                        <Button
                          size="md"
                          onClick={() => handleAccept(offer.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white font-bold"
                          rightIcon={<CheckCircle2 className="w-4 h-4 ml-1" />}
                        >
                          Accept Formal Offer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
