import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { ScoreBar, StatusBadge, Button } from '@thamilarasan/ui';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Calendar,
  Zap,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';

export const CompanyMatches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requirements, setRequirements] = useState<HiringRequirement[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [matches, setMatches] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [validityFilter, setValidityFilter] = useState<'VALID' | 'EXPIRED' | 'TOP_UP' | 'ALL'>('VALID');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Schedule modal state
  const [schedulingCand, setSchedulingCand] = useState<any | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [interviewerName, setInterviewerName] = useState('Hiring Manager');
  const [useGoogleMeet, setUseGoogleMeet] = useState(true);
  const [googleStatus, setGoogleStatus] = useState<{ isConnected: boolean; calendarEmail?: string }>({ isConnected: false });
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

  // Top-Up request state
  const [topUpLoading, setTopUpLoading] = useState<string | null>(null);
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null);

  // 1. Fetch openings and Google integration status
  useEffect(() => {
    Promise.all([
      api.getCompanyOpenings(),
      api.getGoogleIntegrationStatus(),
    ]).then(([reqRes, gRes]) => {
      if (reqRes.success && reqRes.data && reqRes.data.length > 0) {
        setRequirements(reqRes.data);
        const initialReq = searchParams.get('requirementId') || reqRes.data[0].id;
        setSelectedReqId(initialReq);
      }
      if (gRes.success && gRes.data) {
        setGoogleStatus(gRes.data);
      }
    });
  }, []);

  // 2. Fetch Quick Match candidates whenever requirement or validity filter changes
  useEffect(() => {
    if (!selectedReqId) return;
    setLoading(true);

    const query = new URLSearchParams({
      requirementId: selectedReqId,
      validity: validityFilter,
    });
    if (searchTerm) query.set('search', searchTerm);

    api.getQuickMatches(query.toString()).then((res) => {
      if (res.success && res.data) {
        setMatches(res.data);
        setMeta(res.meta);
      }
      setLoading(false);
    });
  }, [selectedReqId, validityFilter, searchTerm]);

  // Handle Direct Interview Scheduling
  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingCand || !scheduledAt) return;
    setSchedulingLoading(true);

    try {
      const res = await api.scheduleCompanyInterview({
        candidateId: schedulingCand.candidateId,
        requirementId: selectedReqId,
        interviewType: 'COMPANY_ROUND_1',
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: 60,
        interviewerNames: [interviewerName],
        useGoogleMeet,
      });

      if (res.success) {
        setScheduleSuccess(res.message || 'Interview scheduled directly with candidate.');
        setTimeout(() => {
          setSchedulingCand(null);
          setScheduleSuccess(null);
        }, 2000);
      }
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Handle Targeted Top-Up Evaluation Request
  const handleRequestTopUp = async (candidateId: string, missingSkills: string[]) => {
    setTopUpLoading(candidateId);
    try {
      const res = await api.requestTopUpEvaluation(candidateId, selectedReqId, missingSkills);
      if (res.success) {
        setTopUpSuccess(candidateId);
        setTimeout(() => setTopUpSuccess(null), 3000);
      }
    } finally {
      setTopUpLoading(null);
    }
  };

  const selectedRequirement = requirements.find((r) => r.id === selectedReqId);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* QUICK MATCH HERO HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>GLOBAL TALENT POOL • IMMEDIATE ACCESS</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Quick Match</h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Already-evaluated talent that matches your hiring requirements. Review pre-assessed technical dossiers and schedule company interviews in minutes—without waiting for fresh screening.
            </p>
          </div>

          {/* Requisition Switcher Dropdown */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 p-4 rounded-2xl min-w-[280px]">
            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
              Active Requirement
            </label>
            <div className="relative">
              <select
                value={selectedReqId}
                onChange={(e) => {
                  setSelectedReqId(e.target.value);
                  setSearchParams({ requirementId: e.target.value });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white appearance-none outline-none pr-8 cursor-pointer"
              >
                {requirements.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.title} ({req.openingsCount} openings)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            {selectedRequirement && (
              <div className="flex items-center gap-2 text-[11px] text-blue-300 font-medium mt-2">
                <span>Budget: {formatUSD(selectedRequirement.budgetMaxUsd)}</span>
                <span>•</span>
                <span>Notice: &le;{selectedRequirement.maxNoticePeriodDays}d</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & METRICS BAR */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setValidityFilter('VALID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              validityFilter === 'VALID'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Ready for Interview</span>
            {meta?.validCount !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${validityFilter === 'VALID' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {meta.validCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setValidityFilter('TOP_UP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              validityFilter === 'TOP_UP'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Top-Up Required</span>
            {meta?.topUpCount !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${validityFilter === 'TOP_UP' ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {meta.topUpCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setValidityFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              validityFilter === 'EXPIRED'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Expired Evaluations</span>
            {meta?.expiredCount !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${validityFilter === 'EXPIRED' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {meta.expiredCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setValidityFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              validityFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Evaluated
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by skill, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* QUICK MATCH TALENT LIST */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">
          Loading pre-evaluated Quick Match talent from MongoDB Atlas...
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {validityFilter === 'EXPIRED'
                ? 'No expired evaluations found.'
                : 'No previously evaluated candidates currently match this requirement.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You can commission a dedicated technical evaluation loop for this role through your company pipeline.
            </p>
          </div>
          <Link to={`/company/requirements`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Source &amp; Evaluate New Candidates
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((cand) => {
            const isTopUp = cand.isTopUpRequired;
            const isExpired = cand.eligibilityStatus === 'EXPIRED_EVALUATION';

            return (
              <div
                key={cand.candidateId}
                className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Candidate Headline & Badges */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/company/candidates/${cand.candidateId}?mode=quick-match`}
                        className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {cand.fullName}
                      </Link>

                      {/* Section 18 Badges */}
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-600" />
                        Previously Evaluated
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        QA Approved
                      </span>
                      {!isExpired && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Evaluation Valid
                        </span>
                      )}
                      {isExpired && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Evaluation Expired
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Candidate Consent Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">{cand.headline}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>{cand.totalYearsOfExperience} yrs exp</span>
                      <span>•</span>
                      <span>{cand.noticePeriodDays} days notice</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800">
                        {formatUSD(cand.expectedSalaryUsd)} / yr
                      </span>
                      <span>•</span>
                      <span>Valid until: {cand.evaluationSummary?.expiresAt ? formatDate(cand.evaluationSummary.expiresAt) : '20 Mar 2027'}</span>
                    </div>
                  </div>

                  {/* Scores Summary */}
                  <div className="flex items-center gap-6 shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Match Score</span>
                      <span className="text-2xl font-black text-blue-600">{cand.matchScore}%</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Evaluation Score</span>
                      <span className="text-2xl font-black text-emerald-600">{cand.evaluationScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Covered Skills:</span>
                  {(cand.skills || []).slice(0, 6).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Section 17 "Why Matched" Breakdown */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Match Verification Checklist:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Required Tech Stack Matched</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{cand.totalYearsOfExperience} yrs experience verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Budget compatible ({formatUSD(cand.expectedSalaryUsd)})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Notice period {cand.noticePeriodDays} days</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Global communication benchmark standard</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Independent Technical Assessment Approved</span>
                    </div>
                  </div>
                </div>

                {/* Top-Up Evaluation Notice (Section 20) */}
                {isTopUp && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <div>
                        <span className="font-bold">Targeted Top-Up Required: </span>
                        <span>
                          Candidate is verified in core stack, but needs assessment in {cand.uncoveredSkills.join(', ')}.
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestTopUp(cand.candidateId, cand.uncoveredSkills)}
                      disabled={topUpLoading === cand.candidateId || topUpSuccess === cand.candidateId}
                      className="border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0 text-xs"
                    >
                      {topUpSuccess === cand.candidateId
                        ? 'Top-Up Commissioned!'
                        : topUpLoading === cand.candidateId
                        ? 'Commissioning...'
                        : 'Request Targeted Top-Up'}
                    </Button>
                  </div>
                )}

                {/* Action CTAs (Section 19: Direct Company Interview Action) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    Candidate previously evaluated with zero data leakage from prior companies.
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link to={`/company/candidates/${cand.candidateId}?mode=quick-match`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Dossier
                      </Button>
                    </Link>

                    {isExpired ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                        onClick={() => alert('Fresh evaluation request submitted to platform operations.')}
                      >
                        Request Fresh Evaluation
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setSchedulingCand(cand)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Interview</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DIRECT INTERVIEW SCHEDULING MODAL (SECTION 19 & 36) */}
      {schedulingCand && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Quick Match Direct Scheduling
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Schedule Interview with {schedulingCand.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSchedulingCand(null)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Interviewer(s)</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  placeholder="e.g. Sarah Jenkins (VP Eng), Dave Lee (Tech Lead)"
                />
              </div>

              {/* Google Meet Integration Status (Section 36) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Google Meet Integration</span>
                  {googleStatus.isConnected ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                      Connected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                      Not Connected
                    </span>
                  )}
                </div>

                {googleStatus.isConnected ? (
                  <p className="text-[11px] text-slate-500">
                    A real Google Calendar invite and Google Meet link will be generated automatically for {googleStatus.calendarEmail}.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-amber-700">
                      Connect Google Calendar to auto-create Google Meet video conference links.
                    </p>
                    <Link
                      to="/company/interviews"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <span>Connect Google Calendar in Interview Settings</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {scheduleSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
                  ✓ {scheduleSuccess}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSchedulingCand(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={schedulingLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {schedulingLoading ? 'Scheduling...' : 'Confirm Interview'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
