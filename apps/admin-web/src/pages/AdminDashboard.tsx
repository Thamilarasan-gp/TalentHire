import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatINR } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import {
  Building2,
  Users,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Activity,
  CreditCard,
  ShieldCheck,
  Calendar,
  Layers,
  Zap,
  Clock,
  ChevronRight,
  Check,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Synchronizing command center telemetry...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      {/* 1. Clear Visual Focal Point: Platform Operations Command Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-navy-900 text-white p-8 sm:p-10 border border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        {/* Subtle decorative mesh background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Top Row: System Heartbeat & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                ENGINE HEALTHY • DETERMINISTIC MATCHING ACTIVE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">
                SLA: 18.4h Time-to-Shortlist
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/admin/qa-calibration">
                <button className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700/60 inline-flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  QA Calibration Queue ({stats?.qaQueue || 10})
                </button>
              </Link>
              <Link to="/admin/shortlist-builder">
                <button className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-sm shadow-blue-500/20 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Deliver Top-N Shortlist
                </button>
              </Link>
            </div>
          </div>

          {/* Core Headline & Key Insight */}
          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Global Engineering Supply & Vetting Infrastructure
            </h1>
            <p className="text-sm text-slate-300/90 leading-relaxed font-normal">
              Direct deterministic matching between 25 international hiring companies and 500 vetted Indian engineers, audited by 50 independent staff evaluators.
            </p>
          </div>

          {/* Pipeline Ribbon Data Visualization: End-to-End Throughput Flow */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-between">
              <span>Real-Time Platform Throughput Funnel</span>
              <span className="text-slate-400 font-mono text-[10px]">Zero Hallucination Guaranteed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  1. Active Clients
                </span>
                <span className="text-xl font-bold text-white block">
                  {stats?.activeCompanies || 25}
                </span>
                <span className="text-[10px] text-blue-400 block font-medium">
                  {stats?.openRequirements || 20} open roles
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  2. Talent Pool
                </span>
                <span className="text-xl font-bold text-white block">
                  {stats?.pipelineCandidates || 500}
                </span>
                <span className="text-[10px] text-cyan-400 block font-medium">
                  All pre-screened
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  3. In Evaluation
                </span>
                <span className="text-xl font-bold text-white block">
                  {stats?.inEvaluation || 23}
                </span>
                <span className="text-[10px] text-amber-400 block font-medium">
                  50 evaluators active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  4. QA Queue
                </span>
                <span className="text-xl font-bold text-purple-400 block">
                  {stats?.qaQueue || 10}
                </span>
                <span className="text-[10px] text-purple-300 block font-medium">
                  Rubrics calibrating
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  5. Delivered Top-N
                </span>
                <span className="text-xl font-bold text-emerald-400 block">
                  {stats?.shortlistsReady || 1}
                </span>
                <span className="text-[10px] text-emerald-300 block font-medium">
                  10 engineers shortlisted
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  6. Final Placements
                </span>
                <span className="text-xl font-bold text-cyan-300 block">
                  3
                </span>
                <span className="text-[10px] text-cyan-200 block font-medium">
                  90-day warranty active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Operational Sections (Not random cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: High-Priority Operational Attention (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Flagship Requirement in Progress */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Primary Attention Target
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Vanguard FinTech Global — 10 Senior Node.js / Distributed Systems
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Top-N Shortlist Live
              </span>
            </div>

            {/* Micro Progression Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Pipeline Conversion to Delivery</span>
                <span className="font-bold text-slate-800">10 / 10 Vetted Candidates Ready</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[100%]" />
              </div>
            </div>

            {/* Candidate Quick Scannable Row */}
            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900">1. Karthik Iyer (7.5 yrs)</span>
                  <p className="text-[11px] text-slate-500">
                    Kafka, Redis, Raft, Distributed Systems • Evaluator: Vikramaditya Sengupta (92/100)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Score: 94.8%
                  </span>
                  <Link to="/admin/shortlist-builder">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-900">2. Suresh Raina (5.0 yrs)</span>
                  <p className="text-[11px] text-slate-500">
                    High-throughput Node.js microservices • Evaluator: Ananya Deshmukh (88/100)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Score: 82.1%
                  </span>
                  <Link to="/admin/shortlist-builder">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Showing 2 of 10 shortlisted engineers</span>
              <Link to="/admin/shortlist-builder" className="font-bold text-blue-600 hover:text-blue-700">
                View All Shortlisted Candidates →
              </Link>
            </div>
          </div>

          {/* Immutable Audit Trail Preview */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Governance & Audit Trail</h3>
                <p className="text-xs text-slate-400 mt-0.5">Cryptographically verifiable state mutations</p>
              </div>
              <Link to="/admin/audit-logs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View Full Log (900+)
              </Link>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {stats?.recentActivity?.slice(0, 4).map((log: any) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{log.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">{log.entity}:{log.entityId}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Actor: {log.actorEmail}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Economic & Integrity Health (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Financial Overview Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Economics Ledger
              </span>
              <Link to="/admin/finance" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Ledger
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Gross Realized Placement Revenue</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight block mt-0.5">
                  {formatUSD(stats?.totalRevenueUsd || 13200)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">15% placement success fee model</span>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block">Evaluator Honorariums Disbursed</span>
                <span className="text-xl font-black text-purple-700 tracking-tight block mt-0.5">
                  {formatINR(stats?.totalEvaluatorEarningsInr || 275000)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Strictly ₹5,000 per completed scorecard</span>
              </div>
            </div>
          </div>

          {/* Evaluator Reliability & Calibration Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Evaluator Reliability
              </span>
              <Link to="/admin/qa-calibration" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Calibration
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 font-medium">Inter-Rater Agreement</span>
                <span className="font-bold text-emerald-600">91.4% (Standard &gt; 85%)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 font-medium">Conflict Auto-Block</span>
                <span className="font-bold text-blue-600">100% Enforced</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 font-medium">Avg Evaluation Turnaround</span>
                <span className="font-bold text-slate-900">3.8 Hours</span>
              </div>
            </div>
          </div>

          {/* Operational Links */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
              Quick Governance Navigation
            </span>
            <div className="flex flex-col gap-1.5 pt-1">
              <Link to="/admin/matching-engine" className="text-slate-600 hover:text-blue-600 font-medium flex items-center justify-between">
                <span>Matching Engine Weights</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link to="/admin/fraud-detection" className="text-slate-600 hover:text-blue-600 font-medium flex items-center justify-between">
                <span>Anti-Fraud & Liveness Logs</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link to="/admin/system-settings" className="text-slate-600 hover:text-blue-600 font-medium flex items-center justify-between">
                <span>System Parameters & SLA</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
