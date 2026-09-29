import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatINR } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Video, FileText, ExternalLink, Calendar, CheckCircle2, User, Award, RefreshCw } from 'lucide-react';

export const MyAssignments: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const getEvaluatorId = () => {
    let evalId = 'eval-1';
    try {
      const stored = localStorage.getItem('tg_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.evaluatorId) evalId = u.evaluatorId;
        else if (u.id && (u.id.startsWith('eval-') || u.id.startsWith('evaluator-'))) evalId = u.id;
      }
    } catch {
      // ignore
    }
    return evalId;
  };

  const loadData = () => {
    setLoading(true);
    const evalId = getEvaluatorId();
    api.getEvaluations(`evaluatorId=${evalId}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setEvaluations(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickSubmitScore = async (ev: any) => {
    try {
      // If linked to passId, submit score
      if (ev.passId) {
        const res = await api.submitStackPassScore(ev.passId, {
          score: 88,
          verdict: 'PASS',
          notes: 'Candidate demonstrated strong architectural grasp and clean code.',
        });
        if (res.success) {
          setSuccessBanner(`🎉 Score of 88/100 submitted! Candidate's Stack Pass is now ACTIVE.`);
          loadData();
          return;
        }
      }

      // Fallback to evaluation scorecard endpoint
      const scoreRes = await fetch(`http://localhost:5000/api/evaluations/${ev.id}/scorecard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: [
            { criterionName: 'Problem Solving & Algorithms', score: 9 },
            { criterionName: 'System Architecture & Concurrency', score: 9 },
            { criterionName: 'Code Cleanliness & Production Quality', score: 8 },
            { criterionName: 'Technical Communication', score: 9 },
          ],
          verdict: 'PASS',
          strengths: ['Strong event loop intuition', 'Production TypeScript mastery'],
        }),
      });
      const data = await scoreRes.json();
      if (data.success) {
        setSuccessBanner(`🎉 Score of 88/100 submitted! Pass activated and routed to QA Calibration.`);
        loadData();
      }
    } catch (err: any) {
      alert('Error updating score: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Active Assignments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Accepted technical evaluation sessions awaiting interview or scorecard submission.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
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

      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600" />
          <p className="text-xs">Loading active assignments...</p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Accepted Assignments</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not currently have any active assignments. Visit the Available Assignments queue to accept pending candidate requests.
          </p>
          <Link to="/evaluator/available-assignments">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 border-purple-600">
              Browse Available Assignments
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((ev: any) => {
            const hasMeetingLink = !!ev.meetingLink;
            const isCompleted = ev.status === 'CALIBRATED' || ev.status === 'COMPLETED' || (ev.overallScore && ev.overallScore >= 70);

            return (
              <div
                key={ev.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col gap-5 hover:border-purple-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {ev.title || 'Technical Candidate Evaluation'}
                      </span>
                      <StatusBadge status={ev.status || ev.state || 'SCHEDULED'} size="sm" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      <span>Candidate: <strong>{ev.candidateName || 'Candidate'}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-slate-400 text-[11px]">ID: {ev.id}</span>
                    </div>

                    {ev.scheduledAt && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Scheduled: {new Date(ev.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}

                    <span className="text-xs font-bold text-emerald-600 block pt-1">
                      Honorarium Fee: {formatINR(ev.payoutAmountInr || 5000)}
                    </span>
                  </div>

                  {ev.overallScore ? (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Score</span>
                      <span className="text-2xl font-black text-purple-600">{ev.overallScore} / 100</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">PASSED & ACTIVE</span>
                    </div>
                  ) : null}
                </div>

                {/* Google Meet Link Display if present */}
                {hasMeetingLink && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-blue-900">
                      <Video className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold">Interview Link:</span>
                      <span className="font-mono text-[11px] text-blue-700 underline truncate max-w-xs">
                        {ev.meetingLink}
                      </span>
                    </div>
                    <a
                      href={ev.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] hover:bg-blue-700 flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Conduct interview via Google Meet, then enter scorecard to activate pass.
                  </span>

                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 font-bold text-xs"
                        onClick={() => handleQuickSubmitScore(ev)}
                      >
                        ⚡ Submit Score (88)
                      </Button>
                    )}

                    <Link to={`/evaluator/scorecard/${ev.id}`}>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                        leftIcon={<FileText className="w-3.5 h-3.5 mr-1" />}
                      >
                        {isCompleted ? 'View Scorecard' : 'Open Scorecard'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
