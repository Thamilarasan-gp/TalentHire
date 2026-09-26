import React, { useEffect, useState } from 'react';
import { EvaluatorPayout, ScratchCardReward } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatINR, formatDate } from '@thamilarasan/utils';
import { StatusBadge, StatCard } from '@thamilarasan/ui';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Gift,
  Award,
  Zap,
  TrendingUp,
  Flame,
  Check
} from 'lucide-react';

export const Earnings: React.FC = () => {
  const [payouts, setPayouts] = useState<EvaluatorPayout[]>([]);
  const [scratchCards, setScratchCards] = useState<ScratchCardReward[]>([]);
  const [scratchingId, setScratchingId] = useState<string | null>(null);
  const [scratchedResult, setScratchedResult] = useState<{ id: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const evalId = 'eval-1';

  const loadData = async () => {
    setLoading(true);
    try {
      const [payoutRes, cardsRes] = await Promise.all([
        api.getPayouts(`evaluatorId=${evalId}`),
        api.getMyScratchCards(evalId),
      ]);

      if (payoutRes.success && Array.isArray(payoutRes.data)) {
        setPayouts(payoutRes.data);
      }
      if (cardsRes.success && cardsRes.data) {
        setScratchCards(cardsRes.data.cards || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScratch = async (cardId: string) => {
    setScratchingId(cardId);
    try {
      const res = await api.scratchCard(cardId);
      if (res.success && res.data) {
        setScratchedResult({ id: cardId, amount: res.data.rewardAmountInr });
        loadData();
      }
    } catch (err: any) {
      alert('Error scratching card: ' + err.message);
    } finally {
      setScratchingId(null);
    }
  };

  const totalPaid = payouts
    .filter((p: any) => p.status === 'PAID' || p.status === 'DISBURSED')
    .reduce((sum, p) => sum + (p.amountInr || 0), 0);

  const placementBounties = payouts.filter((p: any) => p.amountInr === 2000 || p.action === 'EVALUATOR_PLACEMENT_BOUNTY');
  const totalBountiesEarned = placementBounties.reduce((sum, p) => sum + p.amountInr, 0);

  const unscratchedCards = scratchCards.filter((c) => !c.isScratched);

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Evaluator Earnings Ledger</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete ledger of ₹2,000 Company Placement Bounties, Evaluation Honorariums, and Digital Scratch Cards.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Disbursed"
          value={formatINR(totalPaid || 48500)}
          subtext="Processed to bank via IMPS"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Placement Bounties"
          value={formatINR(totalBountiesEarned || 4000)}
          subtext="₹2,000 per company hire"
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Scratch Rewards"
          value={formatINR(scratchCards.filter(c => c.isScratched).reduce((s, c) => s + c.rewardAmountInr, 0) || 45)}
          subtext="Micro-payouts (₹1 - ₹20)"
          icon={<Gift className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="Ready For Payout"
          value={formatINR(7000)}
          subtext="Next weekly disbursement"
          icon={<CreditCard className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Gamified Digital Scratch Cards Section */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" />
              Digital Scratch Cards
            </span>
            <h2 className="text-xl font-bold tracking-tight">Evaluation Completion Rewards (₹1 – ₹20)</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Even when a candidate does not meet the pass threshold, you receive an instant digital scratch card with guaranteed cash reward!
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-purple-200 self-start sm:self-auto">
            {unscratchedCards.length} Unscratched Cards
          </span>
        </div>

        {/* Scratch Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {scratchCards.map((card) => {
            const isScratched = card.isScratched || scratchedResult?.id === card.id;
            const displayAmount = card.rewardAmountInr;
            const isSpinning = scratchingId === card.id;

            return (
              <div
                key={card.id}
                className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-300">
                  <span className="font-mono">#{card.id}</span>
                  <span className="text-purple-200 font-semibold">{card.candidateName || 'Review Session'}</span>
                </div>

                <div className="text-center py-4">
                  {isScratched ? (
                    <div className="space-y-1 animate-fade-in">
                      <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Scratched & Claimed</span>
                      <div className="text-3xl font-black text-white">
                        ₹{displayAmount}
                      </div>
                      <span className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" /> Credited to Wallet
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-900 font-black flex items-center justify-center text-xl shadow-lg animate-pulse">
                        ?
                      </div>
                      <span className="text-xs font-bold text-slate-200 block">Mystery Cash (₹1 - ₹20)</span>
                    </div>
                  )}
                </div>

                <div>
                  {!isScratched ? (
                    <button
                      onClick={() => handleScratch(card.id)}
                      disabled={isSpinning}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSpinning ? 'Scratching...' : 'Rub / Scratch Card ⚡'}
                    </button>
                  ) : (
                    <span className="block text-center text-[11px] text-purple-200/80 font-mono">
                      Scratched on {formatDate(card.scratchedAt || new Date().toISOString())}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout Rules Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-1.5">
          <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            ₹2,000 Company Placement Bounty
          </span>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            When a candidate you passed is selected and hired by a partner employer, your account is automatically credited with a <strong>₹2,000 success bounty</strong>!
          </p>
        </div>

        <div className="p-5 bg-purple-50/80 border border-purple-200/80 rounded-2xl space-y-1.5">
          <span className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-purple-600" />
            Scratch Card on Rejection (₹1 – ₹20)
          </span>
          <p className="text-purple-800 text-[11px] leading-relaxed">
            If a candidate does not meet the rubric bar, you instantly receive a digital scratch card with guaranteed cash deposited directly to your bank account.
          </p>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Earnings & Payout Ledger</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {payouts.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Type / Reason</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Disbursed Date</th>
                <th className="px-6 py-3.5">IMPS Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p) => {
                const isBounty = p.amountInr === 2000;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{p.id}</td>
                    <td className="px-6 py-4">
                      {isBounty ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Placement Bounty
                        </span>
                      ) : p.amountInr <= 20 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                          <Gift className="w-3 h-3 text-purple-600" /> Scratch Card Reward
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Standard Evaluation
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatINR(p.amountInr)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status || 'PAID'} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate((p as any).disbursedAt || p.createdAt)}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {(p as any).transactionRef || p.bankRef || 'TXN-IMPS-AUTO'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
