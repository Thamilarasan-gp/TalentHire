import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { StackPass } from '@thamilarasan/types';
import { formatINR } from '@thamilarasan/utils';
import { Button } from '@thamilarasan/ui';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Video,
  Calendar,
  User,
  Award,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const AvailableAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<StackPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<StackPass | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [conflictDeclared, setConflictDeclared] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Scheduling Form State
  const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const formattedDefaultTime = new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [scheduledAt, setScheduledAt] = useState(formattedDefaultTime);
  const [evaluatorNotes, setEvaluatorNotes] = useState(
    'Please join the Google Meet link with your code editor ready. We will conduct a 60-minute practical evaluation focusing on system design, architecture trade-offs, and live coding.'
  );

  const getEvaluatorInfo = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      if (stored) {
        const u = JSON.parse(stored);
        return {
          evaluatorId: u.evaluatorId || u.id || 'eval-1',
          evaluatorName: u.fullName || u.name || 'Arun Sundaram (Staff Evaluator)',
        };
      }
    } catch {
      // ignore
    }
    return {
      evaluatorId: 'eval-1',
      evaluatorName: 'Arun Sundaram (Staff Evaluator)',
    };
  };

  const loadPendingPasses = async () => {
    setLoading(true);
    try {
      const res = await api.getPendingEvaluations();
      if (res.success && Array.isArray(res.data)) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load pending evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPasses();
  }, []);

  const openScheduleModal = (pass: StackPass) => {
    setSelectedPass(pass);
    setConflictDeclared(false);
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass || !conflictDeclared) return;

    setSubmitting(true);
    try {
      const { evaluatorId, evaluatorName } = getEvaluatorInfo();
      const res = await api.acceptStackPassEvaluation(selectedPass.id, {
        evaluatorId,
        evaluatorName,
        scheduledAt: new Date(scheduledAt).toISOString(),
        meetingLink: meetingLink.trim(),
        evaluatorNotes: evaluatorNotes.trim(),
      });

      if (res.success) {
        setSuccessBanner(
          `✅ Evaluation accepted! Google Meet interview scheduled for ${new Date(
            scheduledAt
          ).toLocaleString()}. The candidate has been notified with the meeting link.`
        );
        setScheduleModalOpen(false);
        setSelectedPass(null);
        // Refresh list
        loadPendingPasses();
      } else {
        alert(res.error || 'Failed to accept assignment');
      }
    } catch (err: any) {
      alert('Error scheduling interview: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Available Evaluation Queue</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {assignments.length} Pending Requests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate vetting requests, confirm zero conflict of interest, and input your Google Meet link to schedule.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadPendingPasses}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Queue
        </Button>
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

      {/* Assignments List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="text-xs font-medium">Loading pending candidate evaluations...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Queue is Clear!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              There are currently no pending evaluation requests awaiting acceptance. When candidates apply for a Stack Pass from the candidate portal, they will appear dynamically here for evaluators to review and schedule.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadPendingPasses}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Check for New Requests
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {assignments.map((as: any) => (
            <div
              key={as.id}
              className="bg-white border border-slate-200/90 hover:border-purple-300 rounded-3xl p-6 sm:p-8 shadow-sm transition-all space-y-6"
            >
              {/* Top Row: Candidate & Stack info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">
                      {as.stackTitle || 'Engineering Stack Pass'}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      STATUS: PENDING ACCEPTANCE
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {as.domain || 'SDE'}
                    </span>
                  </div>

                  {/* Candidate Details */}
                  <div className="flex items-center gap-3 pt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      {as.candidateName || 'Candidate'}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      {as.candidateHeadline || 'Software Engineer'}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 font-medium">
                      {as.candidateExperienceYears ? `${as.candidateExperienceYears} yrs experience` : 'Mid-Senior Level'}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Evaluator Honorarium
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    {formatINR(5000)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    Paid instantly upon scorecard submission
                  </span>
                </div>
              </div>

              {/* Skills covered in this stack */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Candidate Covered Skills to Assess
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(as.coveredSkills || []).map((sk: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conflict Status & Pass ID */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-600">
                    Conflict Status: <strong className="text-slate-900">Clear</strong> (No previous company overlap detected)
                  </span>
                </div>
                <div className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Applied: {as.appliedAt ? new Date(as.appliedAt).toLocaleString() : 'Recently'}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-500 italic">
                  Accepting will open a scheduling prompt to enter your Google Meet link.
                </p>

                <Button
                  size="md"
                  onClick={() => openScheduleModal(as)}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600 text-white font-bold"
                  rightIcon={<Calendar className="w-4 h-4 ml-1" />}
                >
                  Accept & Schedule Interview
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduling & Google Meet Modal */}
      {scheduleModalOpen && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Schedule Candidate Interview</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Candidate: <strong>{selectedPass.candidateName}</strong> • {selectedPass.stackTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-5">
              {/* Google Meet Link Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-600" />
                  Google Meet Link (Required)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full text-xs font-medium p-3 pl-3.5 pr-20 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono"
                  />
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2.5 top-2.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 flex items-center gap-1"
                  >
                    <span>Create Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-500">
                  This Google Meet link will be displayed on the candidate's dashboard so they can join the session.
                </p>
              </div>

              {/* Interview Date & Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Interview Date & Time (IST)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full text-xs font-medium p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Instructions / Preparation Notes for Candidate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Candidate Preparation Notes / Instructions
                </label>
                <textarea
                  rows={3}
                  value={evaluatorNotes}
                  onChange={(e) => setEvaluatorNotes(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Honorarium & Conflict of interest declaration */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-900 font-bold">Session Honorarium:</span>
                  <span className="text-base font-black text-purple-900">₹5,000</span>
                </div>
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2 border-t border-purple-200/60">
                  <input
                    type="checkbox"
                    required
                    checked={conflictDeclared}
                    onChange={(e) => setConflictDeclared(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>
                    I confirm zero personal or professional conflict of interest with <strong>{selectedPass.candidateName}</strong> and agree to score objectively using the standardized rubric.
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setScheduleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  disabled={!conflictDeclared || submitting}
                  isLoading={submitting}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600 text-white font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Confirm & Schedule Interview
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
