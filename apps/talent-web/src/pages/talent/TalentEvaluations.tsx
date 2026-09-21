import React, { useEffect, useState } from 'react';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { ScoreBar, StatusBadge } from '@thamilarasan/ui';
import { ShieldCheck, CheckCircle2, Clock, FileText, AlertTriangle } from 'lucide-react';

export const TalentEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvaluations('candidateId=cand-1').then((res) => {
      if (res.success && res.data) setEvaluations(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Evaluation Dossier</h1>
        <p className="text-xs text-slate-500 mt-1">
          Objective rubric-anchored scorecards evaluated by independent Staff/Principal engineers.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading evaluations...</div>
      ) : evaluations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No evaluations recorded yet.
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-slate-900">
                      Senior Backend Architecture Assessment
                    </span>
                    <StatusBadge status={ev.state} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Evaluator ID: {ev.evaluatorId} • Duration: {ev.durationMinutes} minutes
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Score</span>
                    <span className="text-2xl font-black text-blue-600">{ev.overallScore || 88} / 100</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    {ev.verdict || 'PASS'}
                  </div>
                </div>
              </div>

              {/* Rubric Criteria with Evidence Notes */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Anchored Rubric Breakdown
                </h4>
                <div className="space-y-3">
                  {ev.scores.map((scoreItem) => (
                    <div
                      key={scoreItem.criterionId}
                      className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{scoreItem.criterionName}</span>
                        <span className="text-xs font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50">
                          {scoreItem.score} / 10 ({scoreItem.level})
                        </span>
                      </div>
                      <ScoreBar score={scoreItem.score * 10} size="sm" showPercentage={false} />
                      <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200/50">
                        "{scoreItem.evidenceNotes}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Summary */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Observed Strengths
                </span>
                <ul className="list-disc list-inside space-y-1 text-emerald-800">
                  {ev.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
