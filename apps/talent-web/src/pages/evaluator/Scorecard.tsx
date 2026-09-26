import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, StatusBadge } from '@thamilarasan/ui';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

export const Scorecard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criteria, setCriteria] = useState([
    {
      id: 'crit-node',
      name: 'Node.js & Concurrency',
      score: 8,
      evidenceNotes: 'Demonstrated clear understanding of the event loop, worker threads, and memory optimization.',
      level: 'STRONG',
    },
    {
      id: 'crit-ts',
      name: 'TypeScript & Type Safety',
      score: 9,
      evidenceNotes: 'Mastered generics, discriminated unions, and utility types without resorting to any.',
      level: 'EXPERT',
    },
    {
      id: 'crit-sys',
      name: 'System Design & Distributed Systems',
      score: 8,
      evidenceNotes: 'Articulated sharding strategy for PostgreSQL, distributed caching with Redis, and queue resilience.',
      level: 'STRONG',
    },
    {
      id: 'crit-cloud',
      name: 'Cloud & Infrastructure (AWS)',
      score: 8,
      evidenceNotes: 'Production familiarity with ECS, SQS FIFO, Lambda, and IAM least-privilege security.',
      level: 'STRONG',
    },
    {
      id: 'crit-comm',
      name: 'Technical Communication',
      score: 9,
      evidenceNotes: 'Very clear technical articulation. Explained architectural trade-offs proactively.',
      level: 'EXPERT',
    },
  ]);

  const [verdict, setVerdict] = useState<'PASS' | 'FAIL' | 'REVIEW_REQUIRED'>('PASS');
  const [strengths, setStrengths] = useState(
    'Strong asynchronous event loop intuition, production-grade problem decomposition, exceptional TypeScript mastery.'
  );
  const [concerns, setConcerns] = useState('Minor: Could broaden hands-on Kubernetes multi-region ingress expertise.');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScoreChange = (index: number, newScore: number) => {
    setCriteria((prev) =>
      prev.map((c, idx) => {
        if (idx !== index) return c;
        let level: any = 'COMPETENT';
        if (newScore <= 3) level = 'INADEQUATE';
        else if (newScore <= 6) level = 'COMPETENT';
        else if (newScore <= 8) level = 'STRONG';
        else level = 'EXPERT';
        return { ...c, score: newScore, level };
      })
    );
  };

  const handleEvidenceChange = (index: number, notes: string) => {
    setCriteria((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, evidenceNotes: notes } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/evaluations/${id || 'eval-1'}/scorecard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: criteria,
          verdict,
          strengths: [strengths],
          concerns: concerns ? [concerns] : [],
          summaryFeedback: 'Comprehensive evaluation complete. Candidate demonstrated strong production readiness.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6 bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Scorecard Submitted & Locked</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The evaluation scorecard has been submitted and locked for QA Calibration. Your honorarium fee (₹3,500) has been recorded as payable in your earnings ledger.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link to="/evaluator/earnings">
            <Button variant="outline" size="sm">
              View Earnings Ledger
            </Button>
          </Link>
          <Link to="/evaluator/dashboard">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 border-purple-600">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Structured Technical Scorecard</h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Live Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Candidate: Karthik Iyer • Session ID: {id || 'eval-1'}</p>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900">
          <span className="font-bold block">Honorarium: ₹3,500</span>
          <span className="text-[11px] text-purple-700">Payable on submission</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rubric Criteria Sections */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Anchored Criteria Ratings (1 – 10)
          </h3>
          <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            <span>1–3: Insufficient</span>
            <span>4–6: Competent</span>
            <span>7–8: Strong</span>
            <span>9–10: Expert</span>
          </div>

          <div className="space-y-4">
            {criteria.map((crit, idx) => (
              <div
                key={crit.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{crit.name}</h4>
                    <span className="text-[11px] font-semibold text-purple-600">Level: {crit.level}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Score:</span>
                    <select
                      value={crit.score}
                      onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                      className="text-xs font-bold p-1.5 border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} / 10
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Concrete Evidence Observation Notes (Required)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={crit.evidenceNotes}
                    onChange={(e) => handleEvidenceChange(idx, e.target.value)}
                    placeholder="Specific code decisions, architecture reasoning, and technical proofs observed..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Concerns */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Observations for Hiring Company Dossier
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Key Verified Strengths</label>
            <textarea
              rows={2}
              required
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Potential Growth Areas / Risks</label>
            <textarea
              rows={2}
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Final Evaluation Verdict (Pass / Fail / Review Required — Never "Hire") */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Evaluation Verdict
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The evaluator evaluates capability; the evaluator does not make the final hiring decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'PASS',
                label: 'PASS',
                desc: 'Demonstrated verified competence on required benchmarks.',
                color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
              },
              {
                id: 'REVIEW_REQUIRED',
                label: 'REVIEW REQUIRED',
                desc: 'Borderline signal; recommended for QA double-scoring.',
                color: 'border-amber-500 bg-amber-50 text-amber-900',
              },
              {
                id: 'FAIL',
                label: 'FAIL',
                desc: 'Did not demonstrate required production fundamentals.',
                color: 'border-rose-500 bg-rose-50 text-rose-900',
              },
            ].map((v) => (
              <label
                key={v.id}
                onClick={() => setVerdict(v.id as any)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${verdict === v.id ? v.color : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="verdict"
                    checked={verdict === v.id}
                    onChange={() => setVerdict(v.id as any)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-extrabold text-xs tracking-tight">{v.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{v.desc}</p>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 w-full sm:w-auto"
          >
            Submit Scorecard for QA Review
          </Button>
        </div>
      </form>
    </div>
  );
};
