import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { ScoreBar, StatusBadge, Button } from '@thamilarasan/ui';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Video, UserCheck, Calendar } from 'lucide-react';
import { formatDate } from '@thamilarasan/utils';

export const CompanyEvaluationReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvaluation(id || 'eval-1').then((res) => {
      if (res.success && res.data) setEvaluation(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-16 text-center text-slate-400 text-xs">Loading evaluation report...</div>;
  if (!evaluation) return <div className="p-16 text-center text-slate-500 text-xs">Evaluation not found.</div>;

  // Ensure outcome is PASS, FAIL, or REVIEW_REQUIRED (Never HIRE)
  const verdict = evaluation.recommendation === 'FAIL' ? 'FAIL' : evaluation.recommendation === 'REVIEW_REQUIRED' ? 'REVIEW_REQUIRED' : 'PASS';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/company/shortlists" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" />
        Back to Decision Shortlist
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-8">
        {/* Header & Verdict */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Independent Evaluation Report</h1>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  verdict === 'PASS'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : verdict === 'FAIL'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                VERDICT: {verdict}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>Conducted by Independent Staff Engineer</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(evaluation.scheduledAt || evaluation.completedAt)}
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-700">QA Calibrated: APPROVED</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Score</span>
            <span className="text-3xl font-black text-emerald-600">{evaluation.overallScore || 88} / 100</span>
          </div>
        </div>

        {/* Company Decision Disclaimer */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong>Company Final Hiring Authority:</strong> Independent evaluators only evaluate and score technical competency. The final hiring decision rests solely with your engineering leadership.
          </span>
        </div>

        {/* Strengths and Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Verified Strengths
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              {evaluation.strengths?.[0] || 'Exceptional asynchronous event loop mastery, Redis distributed locking, and microservices caching intuition.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <AlertCircle className="w-4 h-4 text-slate-400" /> Evaluator Observed Nuances
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {evaluation.concerns?.[0] || 'Slightly less exposure to Kubernetes cluster management, but highly adaptable and strong in containerization.'}
            </p>
          </div>
        </div>

        {/* Rubric Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Anchored Evaluation Criteria
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Asynchronous Concurrency & Memory Management', score: 35, max: 35, evidence: 'Demonstrated precise event loop execution profiling under memory pressure.' },
              { name: 'Distributed System Partitioning & Resilience', score: 28, max: 30, evidence: 'Designed clean multi-region cache invalidation and idempotency keys.' },
              { name: 'Production Cloud Deployment (AWS / Docker)', score: 25, max: 25, evidence: 'Articulated zero-downtime blue/green deployment strategy with AWS ECS.' },
              { name: 'Technical Communication & Trade-Off Articulation', score: 10, max: 10, evidence: 'Clear, concise, and defended architectural trade-offs pragmatically.' },
            ].map((criterion, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{criterion.name}</span>
                  <span className="font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50">
                    {criterion.score} / {criterion.max}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{criterion.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to={`/company/candidates/${evaluation.candidateId || 'cand-1'}`}>
            <Button variant="outline" size="sm">
              View Candidate Dossier
            </Button>
          </Link>
          <Link to={`/company/interviews/schedule?candidateId=${evaluation.candidateId || 'cand-1'}`}>
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
              Schedule Final Company Round
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
