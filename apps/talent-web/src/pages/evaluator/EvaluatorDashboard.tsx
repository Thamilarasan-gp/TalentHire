import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Evaluator, Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatINR } from '@thamilarasan/utils';
import { StatCard, StatusBadge, Button } from '@thamilarasan/ui';
import {
  Award,
  ClipboardList,
  Calendar,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const EvaluatorDashboard: React.FC = () => {
  const [evaluator, setEvaluator] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
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

    Promise.allSettled([
      api.getEvaluator(evalId).then((res) => {
        if (res.success && res.data) setEvaluator(res.data);
      }),
      api.getEvaluations(`evaluatorId=${evalId}`).then((res) => {
        if (res.success && Array.isArray(res.data)) setEvaluations(res.data);
      }),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading evaluator workstation...</p>
      </div>
    );
  }

  const displayName = evaluator?.fullName || 'Vikram Malhotra';
  const displayExp = evaluator?.yearsOfExperience || evaluator?.totalExperienceYears || 11;
  const displayReliability = evaluator?.reliabilityScore || 95;
  const displayCalibration = evaluator?.calibrationScore || evaluator?.interRaterAgreementScore || 94;
  const displayReviews = evaluator?.completedEvaluationsCount || 18;
  const displayPayout = evaluator?.pendingPayoutInr || 15000;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{displayName}</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Staff Technical Evaluator
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Domain: Distributed Systems • Node.js • Cloud Architecture</p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span>{displayExp} yrs industry exp</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{displayReliability}% Calibration Reliability</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/evaluator/assignments">
            <Button size="md" className="bg-purple-600 hover:bg-purple-700 border-purple-600">
              Available Assignments
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Completed Reviews"
          value={displayReviews}
          subtext="Vetted technical scorecards"
          icon={<Award className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="Pending Payout"
          value={formatINR(displayPayout)}
          subtext="Ready for disbursement"
          icon={<CreditCard className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Calibration Score"
          value={`${displayCalibration}%`}
          subtext="Inter-rater agreement index"
          icon={<Activity className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Active Workload"
          value={`${evaluator?.currentActiveLoad || 1} / 4`}
          subtext="Balanced assignment cap"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Two columns: Assigned Interviews & Pending Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Active Evaluation Assignments
              </h3>
              <Link to="/evaluator/my-assignments" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {evaluations.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                  No active evaluation assignments queued at this moment.
                </div>
              )}
              {evaluations.slice(0, 3).map((ev, index) => (
                <div
                  key={ev.id || index}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        Technical Candidate Assessment
                      </span>
                      <StatusBadge status={ev.status || ev.state || 'SCHEDULED'} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Requirement: {ev.requirementTitle || 'Senior Full Stack Engineer'}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      Honorarium: {formatINR(ev.payoutAmountInr || ev.honorariumInr || 5000)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/evaluator/interview-room/${ev.id}`}>
                      <Button size="sm" variant="outline">
                        Interview Room
                      </Button>
                    </Link>
                    <Link to={`/evaluator/scorecard/${ev.id}`}>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 border-purple-600">
                        Open Scorecard
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quality & Calibration */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Quality & Independence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your evaluation scores are calibrated against gold-standard rubrics. Payouts are guaranteed upon scorecard submission.
            </p>

            <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-xl text-xs space-y-2">
              <span className="font-bold text-purple-900 block">Conflict-of-Interest Status</span>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                Clear. The assignment engine actively screens ex-employers to prevent conflict.
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Pass Rate:</span>
                <span className="font-bold text-slate-700">
                  {evaluator?.passRate ? (evaluator.passRate < 1 ? Math.round(evaluator.passRate * 100) : evaluator.passRate) : 68}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Inter-Rater Agreement:</span>
                <span className="font-bold text-slate-700">
                  {evaluator?.interRaterAgreementScore || evaluator?.calibrationScore || 94}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
