import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Interview, Candidate } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatDate } from '@thamilarasan/utils';
import { Button, StatusBadge } from '@thamilarasan/ui';
import {
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

export const CompanyInterviews: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const candidateIdParam = searchParams.get('candidateId');

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [openings, setOpenings] = useState<any[]>([]);
  const [selectedOpeningId, setSelectedOpeningId] = useState<string>('req-1');
  const [isScheduling, setIsScheduling] = useState(Boolean(candidateIdParam));
  const [candidateId, setCandidateId] = useState(candidateIdParam || '');
  const [interviewType, setInterviewType] = useState<string>('COMPANY_ROUND_1');
  const [interviewer, setInterviewer] = useState('David Miller (VP Engineering)');
  const [scheduledAt, setScheduledAt] = useState('2026-09-22T15:00');
  const [meetingLink, setMeetingLink] = useState('');
  const [googleStatus, setGoogleStatus] = useState<{ isConnected: boolean; calendarEmail?: string }>({ isConnected: false });
  const [loading, setLoading] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  // Feedback modal state for particular person
  const [feedbackInterview, setFeedbackInterview] = useState<any | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackDecision, setFeedbackDecision] = useState<'PROCEED_TO_OFFER' | 'NEXT_ROUND' | 'ON_HOLD' | 'REJECT'>('PROCEED_TO_OFFER');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCompanyInterviews(),
      api.getCandidates('limit=30'),
      api.getCompanyOpenings(),
      api.getGoogleIntegrationStatus(),
    ]).then(([invRes, candRes, openRes, gRes]) => {
      if (invRes.success && invRes.data) setInterviews(invRes.data);
      if (candRes.success && candRes.data) {
        setCandidates(candRes.data);
        if (!candidateId && candRes.data.length > 0) {
          setCandidateId(candRes.data[0].id);
        }
      }
      if (openRes.success && openRes.data && openRes.data.length > 0) {
        setOpenings(openRes.data);
        setSelectedOpeningId(openRes.data[0].id);
      }
      if (gRes.success && gRes.data) setGoogleStatus(gRes.data);
    });
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.scheduleCompanyInterview({
        requirementId: selectedOpeningId || 'req-1',
        candidateId,
        interviewType,
        interviewerNames: [interviewer],
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: 60,
        useGoogleMeet: true,
        meetingLink: meetingLink.trim() || undefined,
      });

      if (res.success && res.data) {
        // Refresh full organization pipeline from DB
        const fresh = await api.getCompanyInterviews();
        if (fresh.success && fresh.data) {
          setInterviews(fresh.data);
        } else {
          setInterviews([res.data, ...interviews]);
        }
        setIsScheduling(false);
        setMeetingLink('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = (inv: any) => {
    setFeedbackInterview(inv);
    setFeedbackRating(inv.rating || 5);
    setFeedbackDecision(inv.companyDecision || 'PROCEED_TO_OFFER');
    setFeedbackNotes(inv.feedbackNotes || '');
    setFeedbackSuccess(false);
    setFeedbackError(null);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInterview) return;
    setFeedbackSubmitting(true);
    setFeedbackError(null);

    try {
      const res = await api.submitInterviewFeedback(feedbackInterview.id, {
        rating: feedbackRating,
        companyDecision: feedbackDecision,
        feedbackNotes,
      });

      if (res.success) {
        setInterviews((prev) =>
          prev.map((i) =>
            i.id === feedbackInterview.id
              ? { ...i, status: 'COMPLETED', rating: feedbackRating, companyDecision: feedbackDecision, feedbackNotes }
              : i
          )
        );
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackInterview(null);
          setFeedbackSuccess(false);
        }, 1200);
      } else {
        setFeedbackError(res.error || 'Failed to submit feedback for this candidate.');
      }
    } catch (err: any) {
      setFeedbackError(err.message || 'An error occurred while saving feedback.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleConnectGoogle = async () => {
    const res = await api.getGoogleConnectUrl();
    if (res.success && res.data?.url) {
      window.location.href = res.data.url;
    }
  };

  const filteredInterviews = interviews.filter((inv: any) => {
    const candMatch = inv.candidate || candidates.find((c) => c.id === inv.candidateId);
    const candName = (inv.candidateName || candMatch?.fullName || '').toLowerCase();
    const interviewerName = (inv.interviewerNames?.[0] || '').toLowerCase();
    const roleName = (inv.candidateRole || '').toLowerCase();
    const matchesSearch =
      !searchTerm ||
      candName.includes(searchTerm.toLowerCase()) ||
      interviewerName.includes(searchTerm.toLowerCase()) ||
      roleName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Company Interview Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct team fit and architectural alignment rounds with pre-assessed candidates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/company/feedback')}
            className="text-xs text-slate-700 hover:bg-slate-50"
          >
            View All Feedbacks
          </Button>
          <Button
            size="sm"
            onClick={() => setIsScheduling(!isScheduling)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            leftIcon={<Plus className="w-4 h-4 mr-1" />}
          >
            {isScheduling ? 'Cancel' : 'Schedule Interview'}
          </Button>
        </div>
      </div>

      {/* SECTION: GOOGLE CALENDAR & MEET INTEGRATION BANNER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Google Calendar &amp; Meet Integration</h3>
              {googleStatus.isConnected ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                  Custom or Auto Link Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {googleStatus.isConnected
                ? `Synchronized with ${googleStatus.calendarEmail}. Google Meet video conference links are generated automatically.`
                : 'Enter your custom Google Meet link below when scheduling, or connect Google Calendar for automated generation.'}
            </p>
          </div>
        </div>

        {!googleStatus.isConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleConnectGoogle}
            className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50 shrink-0"
          >
            Connect Google Calendar
          </Button>
        )}
      </div>

      {/* SCHEDULING DRAWER / FORM */}
      {isScheduling && (
        <form onSubmit={handleSchedule} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Schedule Interview Round</h3>
            <button
              type="button"
              onClick={() => setIsScheduling(false)}
              className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Candidate</label>
              <select
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-medium"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} — {c.headline || 'Software Engineer'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Company Opening / Requirement</label>
              <select
                value={selectedOpeningId}
                onChange={(e) => setSelectedOpeningId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-medium"
              >
                {openings.length > 0 ? (
                  openings.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.title}
                    </option>
                  ))
                ) : (
                  <option value="req-1">Primary Engineering Requisition</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Round Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="COMPANY_ROUND_1">Round 1: Team &amp; Architecture Fit</option>
                <option value="COMPANY_ROUND_2">Round 2: Deep Technical Deep-Dive</option>
                <option value="COMPANY_EXECUTIVE">Executive / Culture Alignment</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Company Interviewer(s)</label>
              <input
                type="text"
                required
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                placeholder="e.g. David Miller (VP Eng), Sarah Jenkins (Tech Lead)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date &amp; Time</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            {/* GOOGLE MEET LINK INPUT BOX */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Google Meet Link / Video URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
                <Video className="w-4 h-4 text-blue-600 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsScheduling(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Scheduling...' : 'Confirm Round'}
            </Button>
          </div>
        </form>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by candidate name, role, or interviewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'SCHEDULED', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Interviews' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SCHEDULED INTERVIEWS LIST */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 text-xs">
            {interviews.length === 0
              ? 'No company interviews currently scheduled for your organization.'
              : 'No interviews match your filter criteria.'}
          </div>
        ) : (
          filteredInterviews.map((inv: any) => {
            const candMatch = inv.candidate || candidates.find((c) => c.id === inv.candidateId);
            const candidateName = candMatch?.fullName || inv.candidateName || 'Software Engineer Candidate';
            const candidateRole = inv.candidateRole || candMatch?.headline || 'Software Engineer';

            return (
              <div
                key={inv.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {candidateName}
                    </h3>
                    <StatusBadge status={inv.status} size="sm" />
                    {inv.rating && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        ★ {inv.rating} / 5
                      </span>
                    )}
                    {inv.companyDecision && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                        {inv.companyDecision.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {candidateRole}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(inv.scheduledAt)}
                    </span>
                    <span>•</span>
                    <span>Interviewer: <strong>{inv.interviewerNames?.[0] || 'VP Engineering'}</strong></span>
                  </div>

                  {inv.meetingLink ? (
                    <div className="pt-1">
                      <a
                        href={inv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Meeting</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 pt-1">
                      Video link not yet attached.
                    </div>
                  )}

                  {inv.feedbackNotes && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 italic">
                      "{inv.feedbackNotes}"
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    onClick={() => handleOpenFeedback(inv)}
                  >
                    {inv.feedbackNotes ? 'Update Feedback' : 'Give Feedback'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QUICK IN-PLACE FEEDBACK MODAL FOR CANDIDATE */}
      {feedbackInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Candidate Interview Feedback
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record ratings and hiring decision for{' '}
                  <strong className="text-slate-900">
                    {(feedbackInterview.candidate || candidates.find((c) => c.id === feedbackInterview.candidateId))?.fullName || feedbackInterview.candidateName || 'Candidate'}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackInterview(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{feedbackError}</span>
              </div>
            )}

            {feedbackSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Feedback Recorded!</h4>
                <p className="text-xs text-slate-500">Decision updated in database.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Technical Aptitude &amp; Culture Fit Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors ${
                          feedbackRating >= star
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        ★ {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Company Hiring Decision</label>
                  <select
                    value={feedbackDecision}
                    onChange={(e) => setFeedbackDecision(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-semibold"
                  >
                    <option value="PROCEED_TO_OFFER">Proceed to Formal Offer (Recommended)</option>
                    <option value="NEXT_ROUND">Schedule Next Technical Round</option>
                    <option value="ON_HOLD">Keep on Shortlist / On Hold</option>
                    <option value="REJECT">Decline Candidate</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Confidential Team Notes</label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Enter confidential interview notes, strengths, architectural reasoning, or reasons for hiring decision..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:bg-white focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFeedbackInterview(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={feedbackSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {feedbackSubmitting ? 'Saving...' : 'Save Feedback'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
