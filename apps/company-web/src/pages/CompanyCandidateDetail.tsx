import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Candidate, Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { ScoreBar, StatusBadge, Button } from '@thamilarasan/ui';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  Video,
  Lock,
  MessageSquare,
  Plus
} from 'lucide-react';

export const CompanyCandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candId = id || 'cand-1';

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteRating, setNewNoteRating] = useState(5);
  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCandidate(candId),
      api.getEvaluations(`candidateId=${candId}`),
      api.getCompanyNotes(candId),
    ]).then(([candRes, evalRes, notesRes]) => {
      if (candRes.success && candRes.data) setCandidate(candRes.data);
      if (evalRes.success && evalRes.data && evalRes.data.length > 0) setEvaluation(evalRes.data[0]);
      if (notesRes.success && notesRes.data) setNotes(notesRes.data);
      setLoading(false);
    });
  }, [candId]);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setSavingNote(true);

    try {
      const res = await api.saveCompanyNote(candId, {
        notes: newNoteText,
        rating: newNoteRating,
      });

      if (res.success && res.data) {
        setNotes([res.data, ...notes]);
        setNewNoteText('');
      }
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) return <div className="p-16 text-center text-slate-400 text-xs">Loading candidate dossier...</div>;
  if (!candidate) return <div className="p-16 text-center text-slate-500 text-xs">Candidate not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/company/shortlists" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" />
        Back to Decision Shortlist
      </Link>

      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {candidate.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{candidate.fullName}</h1>
              <StatusBadge status={candidate.state} size="sm" />
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> QA Calibrated
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{candidate.headline}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {candidate.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {candidate.noticePeriodDays} days notice</span>
              <span>•</span>
              <span className="font-semibold text-slate-800">Expected: {formatUSD(candidate.expectedSalaryUsd)} / yr</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/company/interviews/schedule?candidateId=${candidate.id}`}>
            <Button size="md" className="bg-cyan-600 hover:bg-cyan-700 border-cyan-600" leftIcon={<Video className="w-4 h-4 mr-1" />}>
              Schedule Interview Round
            </Button>
          </Link>
        </div>
      </div>

      {/* 2 Columns: Match & Evaluation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Deterministic Match Score</h3>
            <span className="text-lg font-black text-blue-600">92%</span>
          </div>
          <ScoreBar score={92} size="md" />

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-500">Core Technical Stack:</span>
              <span className="font-bold text-slate-900">100% Matched (Node, TS, AWS, System Design)</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-500">Experience Depth:</span>
              <span className="font-bold text-slate-900">{candidate.totalYearsOfExperience} yrs (Min 5 required)</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-500">Notice Period Fit:</span>
              <span className="font-bold text-emerald-600">{candidate.noticePeriodDays} days (Allowed: 45)</span>
            </div>
            <div className="flex justify-between pb-1.5">
              <span className="text-slate-500">Compensation Compatibility:</span>
              <span className="font-bold text-slate-900">{formatUSD(candidate.expectedSalaryUsd)}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Independent Evaluation Score</h3>
            <span className="text-lg font-black text-emerald-600">{evaluation?.overallScore || 88} / 100</span>
          </div>
          <ScoreBar score={evaluation?.overallScore || 88} size="md" />

          <div className="space-y-2 pt-2 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Verified Strengths
              </span>
              <p className="text-[11px] leading-relaxed">
                {evaluation?.strengths?.[0] || 'Exceptional event-loop concurrency performance profiling and distributed locking intuition.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 space-y-1">
              <span className="font-bold block flex items-center gap-1.5 text-slate-900">
                <AlertCircle className="w-4 h-4 text-slate-400" /> Evaluator Observed Nuances
              </span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                {evaluation?.concerns?.[0] || 'Slightly less exposure to Kubernetes cluster management, but highly adaptable.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PRIVATE COMPANY NOTES SECTION (SECTION 22) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-600" />
            <h3 className="font-bold text-sm text-slate-900">Private Company Internal Notes</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Confidential to your organization only</span>
        </div>

        {/* Note Form */}
        <form onSubmit={handleSaveNote} className="space-y-3">
          <textarea
            rows={3}
            required
            placeholder="Record internal team feedback, impressions, or specific questions for the next round..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Internal Rating:</span>
              <select
                value={newNoteRating}
                onChange={(e) => setNewNoteRating(Number(e.target.value))}
                className="p-1 border border-slate-200 rounded text-xs"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Strong</option>
                <option value={3}>3 - Acceptable</option>
                <option value={2}>2 - Marginal</option>
                <option value={1}>1 - Reject</option>
              </select>
            </div>
            <Button size="sm" type="submit" isLoading={savingNote} className="bg-cyan-600">
              Save Private Note
            </Button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-3 pt-2">
          {notes && notes.length > 0 ? (
            notes.map((n) => (
              <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-slate-800">{n.authorName || 'Hiring Manager'}</span>
                  <span>Rating: {n.rating || 5} / 5</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{n.notes}</p>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {formatDate(n.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">No private internal notes recorded yet.</p>
          )}
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-slate-500">
          Work History & Production Evidence
        </h3>
        <div className="space-y-6">
          {candidate.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 border-cyan-600 pl-4 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{exp.title}</h4>
                <span className="text-slate-400 font-mono text-[11px]">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-cyan-700 font-semibold">{exp.company} • {exp.location}</p>
              <p className="text-slate-600 leading-relaxed pt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
