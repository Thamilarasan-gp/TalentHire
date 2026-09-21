import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Button, StatusBadge } from '@thamilarasan/ui';
import { formatDate } from '@thamilarasan/utils';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Award,
  Clock,
  AlertCircle,
  X,
  Plus,
  Settings
} from 'lucide-react';

export const CompanyFeedback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightInterviewId = searchParams.get('interviewId');

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');

  // Edit / Add feedback modal
  const [activeFeedback, setActiveFeedback] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [decision, setDecision] = useState<'PROCEED_TO_OFFER' | 'NEXT_ROUND' | 'ON_HOLD' | 'REJECT'>('PROCEED_TO_OFFER');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.getCompanyFeedbacks();
      if (res.success && res.data) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // When highlightInterviewId is passed in URL, auto open that feedback modal
  useEffect(() => {
    if (highlightInterviewId && feedbacks.length > 0) {
      const found = feedbacks.find((f) => f.id === highlightInterviewId || f.interviewId === highlightInterviewId);
      if (found) {
        openEditModal(found);
      }
    }
  }, [highlightInterviewId, feedbacks]);

  const openEditModal = (item: any) => {
    setActiveFeedback(item);
    setRating(item.rating || 5);
    setDecision(item.companyDecision || 'PROCEED_TO_OFFER');
    setNotes(item.feedbackNotes || '');
    setSaveSuccess(false);
  };

  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedback) return;
    setSaving(true);

    try {
      const res = await api.submitInterviewFeedback(activeFeedback.id, {
        rating,
        companyDecision: decision,
        feedbackNotes: notes,
      });

      if (res.success) {
        setFeedbacks((prev) =>
          prev.map((f) =>
            f.id === activeFeedback.id
              ? { ...f, rating, companyDecision: decision, feedbackNotes: notes, status: 'COMPLETED' }
              : f
          )
        );
        setSaveSuccess(true);
        setTimeout(() => {
          setActiveFeedback(null);
          setSaveSuccess(false);
        }, 1200);
      }
    } catch (err) {
      console.error('Error saving feedback:', err);
    } finally {
      setSaving(false);
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      (f.candidateName && f.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.candidateRole && f.candidateRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.feedbackNotes && f.feedbackNotes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.interviewerNames && f.interviewerNames.some((n: string) => n.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesDecision = selectedDecision === 'ALL' || f.companyDecision === selectedDecision;
    const matchesRating = selectedRating === 'ALL' || (f.rating && f.rating >= Number(selectedRating));

    return matchesSearch && matchesDecision && matchesRating;
  });

  // Calculate Metrics
  const totalReviews = feedbacks.length;
  const offerCount = feedbacks.filter((f) => f.companyDecision === 'PROCEED_TO_OFFER').length;
  const nextRoundCount = feedbacks.filter((f) => f.companyDecision === 'NEXT_ROUND').length;
  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  const candidateLetterColors = [
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-blue-100 text-blue-700',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header with neatly aligned Blue Option buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Candidate Interview Feedback <span className="text-2xl"></span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review confidential interviewer feedback, ratings, and hiring recommendations across candidate rounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/company/interviews">
            <button className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-xs flex items-center gap-2 transition-all shadow-blue-600/20">
              <Calendar className="w-4 h-4" />
              <span>Interview Pipeline</span>
            </button>
          </Link>
          <Link to="/company/settings">
            <button className="h-10 px-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center gap-2 transition-all shadow-sm">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Settings</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Feedbacks</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{totalReviews}</span>
          <span className="text-[10px] text-slate-400 block font-medium">Recorded sessions</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Offers Recommended</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-600 block">{offerCount}</span>
          <span className="text-[10px] text-emerald-700 block font-medium">Ready for offer extension</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Next Rounds</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-blue-600 block">{nextRoundCount}</span>
          <span className="text-[10px] text-slate-400 block font-medium">Progressing to next step</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{avgRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span></span>
          <span className="text-[10px] text-slate-400 block font-medium">Candidate technical aptitude</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates, roles, notes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Decision:</span>
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 outline-none focus:bg-white focus:border-blue-500 font-medium"
            >
              <option value="ALL">All Decisions</option>
              <option value="PROCEED_TO_OFFER">Proceed to Offer</option>
              <option value="NEXT_ROUND">Schedule Next Round</option>
              <option value="ON_HOLD">Keep on Hold</option>
              <option value="REJECT">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Min Rating:</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 outline-none focus:bg-white focus:border-blue-500 font-medium"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars only</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>

          {(searchTerm || selectedDecision !== 'ALL' || selectedRating !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDecision('ALL');
                setSelectedRating('ALL');
              }}
              className="text-[11px] text-blue-600 hover:underline font-bold ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Feedbacks List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">No Feedback Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {feedbacks.length === 0
              ? 'Complete interviews with candidates to record confidential feedback and hiring decisions.'
              : 'No feedbacks matched your current search and filter criteria.'}
          </p>
          <Link to="/company/interviews">
            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
              Go to Interviews
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((f, idx) => {
            const initial = (f.candidateName || 'C').charAt(0).toUpperCase();
            const colorClass = candidateLetterColors[idx % candidateLetterColors.length];

            let decisionBadge = (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Pending Decision
              </span>
            );

            if (f.companyDecision === 'PROCEED_TO_OFFER') {
              decisionBadge = (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Proceed to Offer
                </span>
              );
            } else if (f.companyDecision === 'NEXT_ROUND') {
              decisionBadge = (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Next Round Scheduled
                </span>
              );
            } else if (f.companyDecision === 'ON_HOLD') {
              decisionBadge = (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  On Shortlist / Hold
                </span>
              );
            } else if (f.companyDecision === 'REJECT') {
              decisionBadge = (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Declined
                </span>
              );
            }

            return (
              <div
                key={f.id || idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl ${colorClass} font-black text-sm flex items-center justify-center shrink-0`}>
                      {initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {f.candidateName}
                        </h3>
                        {decisionBadge}
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {f.candidateRole} {f.candidateEmail ? `· ${f.candidateEmail}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {f.rating ? (
                      <div className="flex items-center gap-1 text-amber-500 font-black text-sm bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{f.rating} / 5</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl">
                        Not rated
                      </span>
                    )}
                  </div>
                </div>

                {/* Confidential Notes */}
                <div className="p-4 bg-slate-50/80 border border-slate-200/60 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Confidential Interviewer Evaluation
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{f.feedbackNotes || 'No evaluation notes recorded yet.'}"
                  </p>
                </div>

                {/* Bottom meta & action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Interviewed: {formatDate(f.scheduledAt || f.completedAt)}</span>
                    </span>
                    <span>•</span>
                    <span>Interviewer: <strong className="text-slate-700">{f.interviewerNames?.[0] || 'VP Engineering'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => openEditModal(f)}
                      className="h-8 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>{f.feedbackNotes ? 'Edit Feedback' : 'Give Feedback'}</span>
                    </button>
                    {f.companyDecision === 'PROCEED_TO_OFFER' && (
                      <Link to={`/company/offers?candidateId=${f.candidateId}`}>
                        <button className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-3 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/20">
                          <span>Generate Offer</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    )}
                    {f.companyDecision === 'NEXT_ROUND' && (
                      <Link to={`/company/interviews?candidateId=${f.candidateId}`}>
                        <button className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-3 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/20">
                          <span>Schedule Round</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT FEEDBACK MODAL */}
      {activeFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Candidate Feedback
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Refine ratings and hiring decision for{' '}
                  <strong className="text-slate-900">
                    {activeFeedback.candidateName || 'Candidate'}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFeedback(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Feedback Updated!</h4>
                <p className="text-xs text-slate-500">Record updated in database.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Technical Aptitude Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors ${
                          rating >= star
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
                  <label className="font-bold text-slate-700 block mb-1.5">Hiring Decision</label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-semibold"
                  >
                    <option value="PROCEED_TO_OFFER">Proceed to Formal Offer</option>
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter confidential interview evaluation notes..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:bg-white focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveFeedback(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {saving ? 'Saving...' : 'Save Feedback'}
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
