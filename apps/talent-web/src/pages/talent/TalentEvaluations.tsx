import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { ScoreBar, StatusBadge, Button } from '@thamilarasan/ui';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  ExternalLink,
  Calendar,
  User,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const TalentEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      const u = stored ? JSON.parse(stored) : null;
      return u?.candidateId || u?.id || 'cand-1';
    } catch {
      return 'cand-1';
    }
  };

  const loadEvaluations = () => {
    setLoading(true);
    const cid = getCandidateId();
    api.getEvaluations(`candidateId=${cid}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setEvaluations(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load evaluations:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Evaluation Dossier</h1>
          <p className="text-xs text-slate-500 mt-1">
            Objective rubric-anchored scorecards and live interview sessions conducted by independent Staff engineers.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadEvaluations}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Dossier
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-medium">Loading evaluation dossier...</p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Evaluations in Dossier Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              You haven't completed or scheduled any technical evaluations yet. Apply for a domain Stack Pass to have your skills vetted by independent Staff evaluators.
            </p>
          </div>
          <Link to="/talent/stack-pass-hub">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
              Explore Stack Passes & Take Evaluation
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((ev: any) => {
            const isScheduled = ev.status === 'SCHEDULED' || ev.state === 'SCHEDULED';
            const isCompleted = ev.status === 'CALIBRATED' || ev.status === 'COMPLETED' || (ev.overallScore && ev.overallScore > 0);
            const scoreList = ev.rubricScores || ev.scores || [];
            const strengthsList = ev.strengths || [];

            return (
              <div
                key={ev.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 hover:border-blue-200 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {ev.title || 'Technical Assessment'}
                      </span>
                      <StatusBadge status={ev.status || ev.state || 'SCHEDULED'} size="sm" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        Evaluator: {ev.evaluatorName || ev.evaluatorId || 'Independent Staff Evaluator'}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-400 text-[11px]">ID: {ev.id}</span>
                    </div>

                    {ev.scheduledAt && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Scheduled: {new Date(ev.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {ev.overallScore ? (
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Overall Score
                        </span>
                        <span className="text-2xl font-black text-blue-600">{ev.overallScore} / 100</span>
                      </div>
                    ) : null}

                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      {ev.recommendation || ev.verdict || (isScheduled ? 'INTERVIEW CONFIRMED' : 'PENDING')}
                    </div>
                  </div>
                </div>

                {/* Live Google Meet Banner if interview is scheduled */}
                {isScheduled && ev.meetingLink && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                        <Video className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Google Meet Interview Confirmed</span>
                      </div>
                      <p className="text-[11px] text-blue-800">
                        Join the session at your scheduled time. Your evaluator will lead the 60-minute technical session.
                      </p>
                    </div>

                    <a
                      href={ev.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all shrink-0"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Rubric Criteria with Evidence Notes (if scored) */}
                {scoreList.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Anchored Rubric Breakdown
                    </h4>
                    <div className="space-y-3">
                      {scoreList.map((scoreItem: any, idx: number) => {
                        const numScore = Number(scoreItem.score) || 0;
                        return (
                          <div
                            key={scoreItem.criterionId || idx}
                            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {scoreItem.criterionName || scoreItem.name || 'Criterion'}
                              </span>
                              <span className="text-xs font-bold text-blue-600 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100">
                                {numScore} / 10 {scoreItem.level ? `(${scoreItem.level})` : ''}
                              </span>
                            </div>
                            <ScoreBar score={numScore * 10} size="sm" showPercentage={false} />
                            {scoreItem.evidenceNotes && (
                              <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200/60">
                                "{scoreItem.evidenceNotes}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Strengths & Summary (if present) */}
                {strengthsList.length > 0 && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2 text-xs">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Key Observed Strengths
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800">
                      {strengthsList.map((str: string, idx: number) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* If scheduled but not yet scored */}
                {isScheduled && scoreList.length === 0 && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">Interview Status: In Progress</span>
                    <p className="text-[11px] text-slate-500">
                      Rubric scorecard and concrete evidence notes will be unlocked and added to this dossier once your evaluator completes the interview and submits their ratings.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
