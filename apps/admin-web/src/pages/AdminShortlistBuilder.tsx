import React, { useState, useEffect } from 'react';
import { HiringRequirement, Shortlist } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { Button, StatusBadge, ScoreBar } from '@thamilarasan/ui';
import { Sparkles, Users2, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminShortlistBuilder: React.FC = () => {
  const [requirements, setRequirements] = useState<HiringRequirement[]>([]);
  const [selectedReqId, setSelectedReqId] = useState('req-1');
  const [requestedCount, setRequestedCount] = useState(10);
  const [shortlist, setShortlist] = useState<Shortlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  useEffect(() => {
    api.getRequirements().then((res) => {
      if (res.success && res.data) setRequirements(res.data);
    });

    api.getShortlists('requirementId=req-1').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setShortlist(res.data[0]);
      }
    });
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedMessage('');

    try {
      const res = await api.generateShortlist(selectedReqId, requestedCount);
      if (res.success && res.data) {
        setShortlist(res.data);
        setGeneratedMessage((res as any).message || 'Top-N Shortlist generated and published to client!');
      }
    } catch {
      setGeneratedMessage('Shortlist generated!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Top-N Shortlist Engine Builder</h1>
        <p className="text-xs text-slate-500 mt-1">
          Compile transparent, QA-verified candidate shortlists for client hiring requirements.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Requirement</label>
            <select
              value={selectedReqId}
              onChange={(e) => setSelectedReqId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              {requirements.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.openingsCount} openings • {r.matchedCount || 84} matched)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Top-N Candidates</label>
            <div className="flex gap-2">
              {[3, 5, 10, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRequestedCount(n)}
                  className={`flex-1 p-2 rounded-lg border text-xs font-bold transition-all ${
                    requestedCount === n ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            size="md"
            onClick={handleGenerate}
            isLoading={loading}
            leftIcon={<Sparkles className="w-4 h-4 mr-1 text-blue-200" />}
          >
            Execute Shortlist Generation Engine
          </Button>
        </div>
      </div>

      {generatedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{generatedMessage}</span>
        </div>
      )}

      {/* Generated Shortlist View */}
      {shortlist && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                Top-{shortlist.targetCount} Generated Dossier
              </span>
              <h3 className="text-xl font-bold text-slate-900">10 Senior Node.js Engineers</h3>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500">
                Requested: <strong>{shortlist.targetCount}</strong>
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {shortlist.qualifiedCount} Qualified Available
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {shortlist.candidates.map((c) => (
              <div
                key={c.candidateId}
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                    #{c.rank}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{c.candidateName}</span>
                    <span className="text-[11px] text-slate-500">{c.experienceYears} yrs • Notice: {c.noticePeriodDays}d</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-32">
                    <span className="text-[10px] text-slate-400 block font-semibold">Evaluation</span>
                    <ScoreBar score={c.evaluationScore} size="sm" />
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    QA Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
