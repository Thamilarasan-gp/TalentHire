import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import {
  Plus,
  Calendar,
  LayoutGrid,
  Zap,
  Users,
  Clock,
  Star,
  ChevronRight,
  ChevronDown,
  FileText,
  Globe,
  Trophy,
  Video,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [pipelinePeriod, setPipelinePeriod] = useState('Last 30 days');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['company-dashboard', pipelinePeriod],
    queryFn: async () => {
      const res = await api.getCompanyDashboard();
      if (!res.success) throw new Error(res.error || 'Failed to load company dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-72 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-36 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="font-bold text-slate-900">Dashboard Synchronization Error</h3>
        <p className="text-xs text-slate-500">
          {(error as Error)?.message || 'Unable to retrieve real-time hiring metrics from database.'}
        </p>
        <Button size="sm" onClick={() => refetch()}>
          Retry Connection
        </Button>
      </div>
    );
  }

  const { company, user, metrics, funnel, globalStats, activeRequirements, upcomingInterviews } = data;

  const candidateLetterColors = [
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
  ];

  const formatInterviewTime = (isoString?: string, duration = 45) => {
    if (!isoString) return 'Time TBA';
    try {
      const d = new Date(isoString);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const startTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const endD = new Date(d.getTime() + duration * 60000);
      const endTime = endD.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${dateStr} • ${startTime} - ${endTime}`;
    } catch {
      return 'Time TBA';
    }
  };

  const getPlatformName = (link?: string) => {
    if (!link) return 'Video Room';
    if (link.includes('google.com') || link.includes('meet.google')) return 'Google Meet';
    if (link.includes('zoom.us')) return 'Zoom';
    if (link.includes('teams.microsoft')) return 'MS Teams';
    return 'TG Video Room';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      {/* 1. TOP GREETING & ACTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Hi, {company?.name || 'Company Workspace'}! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Let's build something great together.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">


          <div className="flex items-center gap-2.5">
            <Link to="/company/openings/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-xs flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Requirement</span>
              </button>
            </Link>
            <Link to="/company/interviews">
              <button className="bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-colors shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Schedule Interview</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. TOP METRICS ROW (6 STAT CARDS - 100% REAL DYNAMIC DB DATA) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Active Requirements */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Active Requirements</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
              {metrics?.activeRequirementsCount ?? 0}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              {metrics?.newRequirementsThisMonth && metrics.newRequirementsThisMonth > 0
                ? `↑ ${metrics.newRequirementsThisMonth} this month`
                : 'All requirements active'}
            </span>
          </div>
        </div>

        {/* Card 2: Quick Match Talent */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Quick Match Talent</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
              {metrics?.quickMatchAvailableCount ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Pre-evaluated talent
            </span>
          </div>
        </div>

        {/* Card 3: Company Applicants */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Company Applicants</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
              {metrics?.companyApplicantsCount ?? 0}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              {metrics?.applicantsThisWeek && metrics.applicantsThisWeek > 0
                ? `↑ ${metrics.applicantsThisWeek} this week`
                : 'Active pipeline'}
            </span>
          </div>
        </div>

        {/* Card 4: Evaluations in Progress */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Evaluations in Progress</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
              {metrics?.evaluationsInProgressCount ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1 truncate">
              Across {metrics?.activeRequirementsCount ?? 0} requirement{(metrics?.activeRequirementsCount ?? 0) === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Card 5: Shortlists Ready */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Shortlists Ready</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
              {metrics?.shortlistsReadyCount ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Ready for your review
            </span>
          </div>
        </div>

        {/* Card 6: Upcoming Interviews */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Upcoming Interviews</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
              {metrics?.upcomingInterviewsCount ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              {metrics?.upcomingInterviewsCount ? `${metrics.upcomingInterviewsCount} scheduled` : 'No pending sessions'}
            </span>
          </div>
        </div>
      </div>


      {/* 4. ACTION / PATHWAY CARDS (3 CARDS SIDE-BY-SIDE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pathway 1: Quick Match */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Quick Match</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <span className="text-3xl font-bold text-slate-900 leading-none">
                {metrics?.quickMatchAvailableCount ?? 0}
              </span>
              <span className="text-xs text-slate-400 block mt-1">Pre-evaluated talent pool</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Find already-evaluated candidates from our global talent pool who match your requirements.
            </p>
          </div>

          <Link to="/company/matches" className="pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Explore Quick Match →</span>
            </button>
          </Link>
        </div>

        {/* Pathway 2: Decision Shortlist */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Decision Shortlist</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <span className="text-3xl font-bold text-slate-900 leading-none">
                {metrics?.shortlistsReadyCount ?? 0}
              </span>
              <span className="text-xs text-slate-400 block mt-1">Candidates ready for your review</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Candidates specifically evaluated for your hiring requirements.
            </p>
          </div>

          <Link to="/company/shortlists" className="pt-2">
            <button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors">
              <span>View Shortlists →</span>
            </button>
          </Link>
        </div>

        {/* Pathway 3: Create a New Requirement */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Create a New Requirement</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              Post a new hiring requirement and get matched with top global talent.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <Link to="/company/openings/new">
              <button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors">
                <span>Create Requirement →</span>
              </button>
            </Link>
          </div>

          {/* Decorative watermark plus */}
          <div className="absolute right-3 bottom-1 text-blue-100 text-7xl font-extralight select-none pointer-events-none">
            +
          </div>
        </div>
      </div>

      {/* 3. YOUR HIRING PIPELINE (FULL-WIDTH CHEVRON FUNNEL - 100% DYNAMIC DB STAGES) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Hiring Pipeline</h2>
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 px-3 py-1.5 rounded-xl font-medium transition-colors"
            >
              <span>{pipelinePeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showPeriodDropdown && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                {['Last 30 days', 'Last 90 days', 'All time'].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setPipelinePeriod(period);
                      setShowPeriodDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${pipelinePeriod === period ? 'text-blue-600 font-bold' : 'text-slate-700'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Chevron Flow (7 Stages - Pure Dynamic Values) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* Stage 1: Applicants */}
          <div className="bg-[#F4F7FA] border border-slate-200/60 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Applicants</span>
            <span className="text-2xl font-black text-slate-900 block">
              {funnel?.applicants ?? 0}
            </span>
          </div>

          {/* Stage 2: Screening */}
          <div className="bg-[#EDF5FD] border border-blue-100 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Screening</span>
            <span className="text-2xl font-black text-slate-900 block">
              {funnel?.screening ?? 0}
            </span>
          </div>

          {/* Stage 3: Evaluated */}
          <div className="bg-[#F2F1FD] border border-indigo-100 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Evaluated</span>
            <span className="text-2xl font-black text-slate-900 block">
              {funnel?.evaluated ?? 0}
            </span>
          </div>

          {/* Stage 4: QA Approved */}
          <div className="bg-[#E9F7F3] border border-emerald-100 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">QA Approved</span>
            <span className="text-2xl font-black text-emerald-900 block">
              {funnel?.qaApproved ?? 0}
            </span>
          </div>

          {/* Stage 5: Shortlisted */}
          <div className="bg-[#E6F5F8] border border-cyan-100 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Shortlisted</span>
            <span className="text-2xl font-black text-cyan-950 block">
              {funnel?.shortlisted ?? 0}
            </span>
          </div>

          {/* Stage 6: Interviews */}
          <div className="bg-[#FAF0F5] border border-purple-100 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Interviews</span>
            <span className="text-2xl font-black text-purple-950 block">
              {funnel?.interviews ?? 0}
            </span>
          </div>

          {/* Stage 7: Offers */}
          <div className="bg-[#FCF8ED] border border-amber-100 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Offers</span>
            <span className="text-2xl font-black text-amber-900 block">
              {funnel?.offers ?? 0}
            </span>
          </div>
        </div>
      </div>
      {/* 5. BOTTOM SPLIT: RECENT REQUIREMENTS & UPCOMING INTERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Requirements */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Recent Requirements</h2>
            <Link to="/company/openings" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold text-center">Applicants</th>
                  <th className="pb-3 font-semibold text-center">Shortlisted</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(!activeRequirements || activeRequirements.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No active requirements found.{' '}
                      <Link to="/company/openings/new" className="text-blue-600 hover:underline font-semibold">
                        Create your first requirement
                      </Link>
                    </td>
                  </tr>
                ) : (
                  activeRequirements.map((req: any) => {
                    const status = req.state || 'ACTIVE';
                    let statusBadge = (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600">
                        Active
                      </span>
                    );
                    if (status === 'IN_REVIEW' || status === 'REVIEW') {
                      statusBadge = (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600">
                          In Review
                        </span>
                      );
                    } else if (status === 'DRAFT') {
                      statusBadge = (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                          Draft
                        </span>
                      );
                    }

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="py-3.5 pr-2 font-bold text-slate-900">{req.title}</td>
                        <td className="py-3.5 pr-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-600">
                            {req.employmentType ? req.employmentType.replace('_', '-').toLowerCase() : 'Full-time'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 text-slate-500">{req.location || 'Remote'}</td>
                        <td className="py-3.5 px-2 text-center font-semibold text-slate-700">
                          {req.applicantsCount ?? 0}
                        </td>
                        <td className="py-3.5 px-2 text-center font-semibold text-slate-700">
                          {req.shortlistedCount && req.shortlistedCount > 0 ? req.shortlistedCount : '0'}
                        </td>
                        <td className="py-3.5 pr-2">{statusBadge}</td>
                        <td className="py-3.5 text-right text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Link to={`/company/shortlists?requirementId=${req.id}`}>
                            <ChevronRight className="w-4 h-4 inline" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Interviews */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Upcoming Interviews</h2>
              </div>
              <Link to="/company/interviews" className="text-xs font-bold text-blue-600 hover:underline">
                View Calendar
              </Link>
            </div>

            <div className="space-y-3">
              {(!upcomingInterviews || upcomingInterviews.length === 0) ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No upcoming interviews scheduled.{' '}
                  <Link to="/company/interviews" className="text-blue-600 hover:underline font-semibold">
                    Schedule an interview
                  </Link>
                </div>
              ) : (
                upcomingInterviews.slice(0, 4).map((interview: any, idx: number) => {
                  const initial = (interview.candidateName || 'C').charAt(0).toUpperCase();
                  const colorClass = candidateLetterColors[idx % candidateLetterColors.length];

                  return (
                    <div
                      key={interview.id || idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full ${colorClass} font-bold text-xs flex items-center justify-center shrink-0`}>
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {interview.candidateName || 'Candidate'}{' '}
                            <span className="font-normal text-slate-400">
                              {interview.candidateRole ? `– ${interview.candidateRole}` : ''}
                            </span>
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{formatInterviewTime(interview.scheduledAt, interview.durationMinutes)}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Video className="w-3 h-3 text-emerald-600" />
                              <span>{getPlatformName(interview.meetingLink)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={interview.meetingLink || 'https://meet.google.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <button className="border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold px-3 py-1 rounded-xl transition-colors">
                          Join
                        </button>
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM BANNER: GLOBAL TALENT / GUARANTEE & BUILD TEAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card (9 cols): Global Talent. Real Impact. */}
        <div className="lg:col-span-9 bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Global Talent. Real Impact.</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hire verified, pre-vetted software engineers from around the world.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left shrink-0">
            <div>
              <span className="text-base font-bold text-slate-900 block">
                {globalStats?.totalEvaluatedEngineers ? `${globalStats.totalEvaluatedEngineers.toLocaleString()}+` : '500+'}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Evaluated Engineers</span>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">
                {globalStats?.clientSatisfactionRate ? `${globalStats.clientSatisfactionRate}%` : '98%'}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Client Satisfaction</span>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">
                {globalStats?.countriesCount ? `${globalStats.countriesCount}+` : '30+'}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Countries</span>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">
                {globalStats?.guaranteeDays ? `${globalStats.guaranteeDays}-Day` : '90-Day'}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Replacement Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Card (3 cols): Build Your Global Team Today */}
        <div className="lg:col-span-3 bg-white border border-blue-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-blue-400 transition-colors">
          <Link to="/company/openings/new" className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  Build Your Global Team Today
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Access top 5% pre-vetted talent
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
