import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { StackPass, StackCardDefinition, TechDomain } from '@thamilarasan/types';
import { Button, StatusBadge } from '@thamilarasan/ui';
import {
  Layers,
  Sparkles,
  Database,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Award,
  Zap,
  RefreshCw,
  Code,
  Server,
  Cpu,
  Monitor,
  Eye,
  BarChart2
} from 'lucide-react';

export const StackPassHub: React.FC = () => {
  const [catalog, setCatalog] = useState<StackCardDefinition[]>([]);
  const [activePasses, setActivePasses] = useState<StackPass[]>([]);
  const [quota, setQuota] = useState({
    freeEvaluationsTotal: 10,
    freeEvaluationsUsed: 0,
    freeEvaluationsRemaining: 10,
  });
  const [selectedDomain, setSelectedDomain] = useState<TechDomain>('SDE');
  const [loading, setLoading] = useState(true);
  const [evaluatingStack, setEvaluatingStack] = useState<StackCardDefinition | null>(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [simulatingPass, setSimulatingPass] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, passRes] = await Promise.all([
        api.getStackPassCatalog(),
        api.getMyStackPasses('cand-1'),
      ]);

      if (catRes.success && catRes.data) {
        setCatalog(catRes.data.catalog);
      }
      if (passRes.success && passRes.data) {
        setActivePasses(passRes.data.passes || []);
        if (passRes.data.quota) {
          setQuota(passRes.data.quota);
        }
      }
    } catch (err) {
      console.error('Error loading stack pass data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEvaluation = (stack: StackCardDefinition) => {
    setEvaluatingStack(stack);
    setEvalModalOpen(true);
  };

  const handleSimulatePassMint = async () => {
    if (!evaluatingStack) return;
    setSimulatingPass(true);
    try {
      // 1. Book evaluation (consumes 1 free quota)
      await api.bookStackPass(evaluatingStack.stackKey, 'cand-1');

      // 2. Mint the 5-day pass with a passing score (e.g. 88/100)
      const mintRes = await api.mintStackPass({
        stackKey: evaluatingStack.stackKey,
        candidateId: 'cand-1',
        candidateName: 'Karthik Iyer',
        score: 88,
        evaluatorId: 'eval-1',
      });

      if (mintRes.success) {
        setSuccessBanner(`🎉 Success! Your 5-Day ${evaluatingStack.title} Pass has been minted! It is now active for 120 hours.`);
        setEvalModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      alert('Error minting pass: ' + err.message);
    } finally {
      setSimulatingPass(false);
    }
  };

  const domainStacks = catalog.filter((s) => s.domain === selectedDomain);

  const getDomainIcon = (domain: TechDomain) => {
    switch (domain) {
      case 'SDE':
        return <Layers className="w-4 h-4" />;
      case 'AI_ML':
        return <Sparkles className="w-4 h-4" />;
      case 'DATA_ENGINEERING':
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4 animate-fade-in">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>5-Day Gated Evaluation Passport</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Earn Your Domain <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Stack Pass</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Pass a single 60-minute technical evaluation by an independent Staff engineer. Unlock an active <strong>5-Day Pass</strong> to apply to unlimited matching top-tier companies without repetitive interview rounds.
          </p>

          {/* Quota Progress Bar */}
          <div className="pt-4 max-w-md">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Flame className="w-4 h-4 text-amber-400" /> Free Evaluation Quota
              </span>
              <span className="text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                {quota.freeEvaluationsRemaining} / {quota.freeEvaluationsTotal} Remaining
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(quota.freeEvaluationsRemaining / quota.freeEvaluationsTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Your first 10 technical evaluations are 100% free with complete rubric feedback.
            </span>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl pointer-events-none" />
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-semibold shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active 5-Day Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              My Active Stack Passes
            </h2>
            <p className="text-xs text-slate-500">
              Passes are strictly valid for 5 days (120h). Use them to 1-click apply to verified company roles.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh Status
          </Button>
        </div>

        {activePasses.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Active Stack Passes Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Choose a stack card below and complete your evaluation to receive your 5-day multi-job passport.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activePasses.map((pass: any) => {
              const isActive = pass.status === 'ACTIVE' && !pass.isExpired;
              return (
                <div
                  key={pass.id}
                  className={`bg-white border rounded-2xl p-6 shadow-sm transition-all relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'border-emerald-200 ring-2 ring-emerald-500/10 hover:shadow-md'
                      : 'border-slate-200 opacity-75'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {pass.domain}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-blue-600">{pass.score} / 100</span>
                        <StatusBadge status={isActive ? 'VERIFIED' : 'EXPIRED'} size="sm" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        {pass.stackTitle}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        Pass ID: {pass.id}
                      </span>
                    </div>

                    {/* Countdown Badge */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                        isActive
                          ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Validity Window:</span>
                      </div>
                      <span className="font-mono">{pass.remainingFormatted || 'Active'}</span>
                    </div>

                    {/* Covered skills preview */}
                    <div className="flex flex-wrap gap-1">
                      {(pass.coveredSkills || []).slice(0, 4).map((sk: string) => (
                        <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {sk}
                        </span>
                      ))}
                      {(pass.coveredSkills || []).length > 4 && (
                        <span className="text-[10px] text-slate-400 font-medium pt-0.5">
                          +{pass.coveredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Applied: <strong>{pass.applicationsCount || 0} jobs</strong>
                    </span>
                    {isActive ? (
                      <Link to="/jobs">
                        <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
                          Apply to Roles
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleStartEvaluation(catalog.find(c => c.stackKey === pass.stackKey) || catalog[0])}>
                        Renew Pass
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Domain Stack Directory */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Domain Stack Directory
            </h2>
            <p className="text-xs text-slate-500">
              Select your primary engineering specialization to take an evaluation and mint your 5-day pass.
            </p>
          </div>

          {/* Domain Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 overflow-x-auto">
            {(['SDE', 'AI_ML', 'DATA_ENGINEERING'] as TechDomain[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDomain === d
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {getDomainIcon(d)}
                <span>
                  {d === 'SDE' ? 'Software Engineering' : d === 'AI_ML' ? 'AI & Machine Learning' : 'Data Engineering'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stack Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domainStacks.map((stack) => (
            <div
              key={stack.stackKey}
              className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Code className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    5-Day Pass
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {stack.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {stack.description}
                  </p>
                </div>

                {/* Covered Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Core Technical Benchmarks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.coveredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200/70"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rubric Points */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Evaluation Specs
                  </span>
                  <ul className="text-[11px] text-slate-500 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {stack.evaluationDurationMinutes} Minutes live session
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Passing score: {stack.passThresholdScore} / 100
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  size="sm"
                  onClick={() => handleStartEvaluation(stack)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
                >
                  Take Evaluation (1 Free Credit)
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Booking / Simulation Modal */}
      {evalModalOpen && evaluatingStack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    Vetting Assessment
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{evaluatingStack.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setEvalModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed">
                You are about to book your evaluation for the <strong>{evaluatingStack.title}</strong> card.
              </p>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Free Quota Deduction
                </span>
                <p className="text-blue-800">
                  This session will consume <strong>1 Free Evaluation Credit</strong> ({quota.freeEvaluationsRemaining} remaining).
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Benchmarks Evaluated:</span>
                <ul className="space-y-1 list-disc list-inside text-slate-600">
                  {evaluatingStack.benchmarks.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
                ⏱️ Upon scoring $\ge {evaluatingStack.passThresholdScore}/100$, your verified 5-Day Stack Pass is immediately issued for 120 hours.
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md"
                onClick={handleSimulatePassMint}
                isLoading={simulatingPass}
              >
                Complete Evaluation & Mint 5-Day Pass
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEvalModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
