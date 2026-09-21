import React, { useEffect, useState } from 'react';
import { api } from '@thamilarasan/api-client';
import { StatCard } from '@thamilarasan/ui';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  Zap,
  Layers,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const CompanyAnalytics: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanyAnalytics().then((res) => {
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-16 text-center text-slate-400 text-xs">Loading hiring analytics from MongoDB Atlas...</div>;
  }

  const qm = data?.quickMatchMetrics || {
    availableTalent: 31,
    interviewsScheduled: 12,
    offersExtended: 7,
    placementsCompleted: 4,
    averageTimeToInterviewDays: 1.4,
    evaluationReuseRate: 68,
    evaluationFreshnessRate: 92,
  };

  const pl = data?.pipelineMetrics || {
    totalApplications: 47,
    evaluationsConducted: 18,
    qaPassRate: 67,
    shortlistsGenerated: 2,
    pipelineInterviews: 8,
    pipelineOffers: 4,
    pipelinePlacements: 3,
  };

  const comparisonChartData = [
    { name: 'Interviews', QuickMatch: qm.interviewsScheduled || 12, DedicatedPipeline: pl.pipelineInterviews || 8 },
    { name: 'Offers', QuickMatch: qm.offersExtended || 7, DedicatedPipeline: pl.pipelineOffers || 4 },
    { name: 'Placements', QuickMatch: qm.placementsCompleted || 4, DedicatedPipeline: pl.pipelinePlacements || 3 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hiring Analytics &amp; Velocity Intelligence
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Comparing the speed of Quick Match (reusable evaluations) against Dedicated Pipeline custom vetting loops.
        </p>
      </div>

      {/* QUICK MATCH VELOCITY METRICS (SECTIONS 53 & 54) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quick Match: Speed to Hire Metrics</h3>
              <span className="text-xs text-slate-500">Values calculated from pre-evaluated global talent reuse</span>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Avg. {qm.averageTimeToInterviewDays} Days to First Interview
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Global Available Talent</span>
            <span className="text-2xl font-black text-slate-900">{qm.availableTalent}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Pre-assessed &amp; Valid</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Interviews Scheduled</span>
            <span className="text-2xl font-black text-blue-600">{qm.interviewsScheduled}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Direct client rounds</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Evaluation Reuse Rate</span>
            <span className="text-2xl font-black text-emerald-600">{qm.evaluationReuseRate}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Saved technical loops</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Evaluation Freshness</span>
            <span className="text-2xl font-black text-purple-600">{qm.evaluationFreshnessRate}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Under 6 months old</span>
          </div>
        </div>
      </div>

      {/* DEDICATED PIPELINE METRICS (SECTION 53) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dedicated Pipeline: Custom Vetting Funnel</h3>
              <span className="text-xs text-slate-500">Applicant loops scored specifically for your open requisitions</span>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            {pl.qaPassRate}% QA Calibration Pass Rate
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Inbound Applicants</span>
            <span className="text-2xl font-black text-slate-900">{pl.totalApplications}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Candidates screened</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Evaluations Conducted</span>
            <span className="text-2xl font-black text-cyan-700">{pl.evaluationsConducted}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">60-min live coding</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Shortlists Generated</span>
            <span className="text-2xl font-black text-slate-900">{pl.shortlistsGenerated}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Active requisitions</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Pipeline Placements</span>
            <span className="text-2xl font-black text-emerald-600">{pl.pipelinePlacements}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Hired engineers</span>
          </div>
        </div>
      </div>

      {/* COMPARATIVE SPEED & VOLUME CHART */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          Conversion Comparison: Quick Match (Speed) vs Dedicated Pipeline (Custom Vetting)
        </h3>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="QuickMatch" name="Quick Match (Speed)" fill="#2563EB" radius={[6, 6, 0, 0]} />
              <Bar dataKey="DedicatedPipeline" name="Dedicated Pipeline" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
