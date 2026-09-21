import React, { useState } from 'react';
import { Button, Card, StatusBadge, ScoreBar } from '@thamilarasan/ui';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AdminMatchingEngine: React.FC = () => {
  const [activeReqId, setActiveReqId] = useState('REQ-8801');
  const [isSimulating, setIsSimulating] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([
    {
      candidateId: 'CND-101',
      name: 'Karthik Iyer',
      title: 'Senior Node.js / Distributed Systems',
      yearsExp: 7.5,
      stage1Passed: true,
      stage1Breakdown: {
        budgetCheck: 'PASSED (₹32L within ₹35L budget)',
        noticePeriodCheck: 'PASSED (15 days <= 30 days)',
        overlapCheck: 'PASSED (4.5 hrs >= 4.0 hrs UTC-5)',
        coreTechCheck: 'PASSED (Node.js, PostgreSQL, Redis present)',
      },
      stage2Score: 94.8,
      stage2Breakdown: {
        primarySkills: 96,
        expRelevance: 95,
        productionEvidence: 92,
        evaluatorScore: 96,
        timezoneScore: 95,
      },
      qualification: 'RECOMMENDED',
    },
    {
      candidateId: 'CND-102',
      name: 'Suresh Raina',
      title: 'Backend Systems Engineer',
      yearsExp: 5.0,
      stage1Passed: true,
      stage1Breakdown: {
        budgetCheck: 'PASSED (₹28L within ₹35L budget)',
        noticePeriodCheck: 'PASSED (30 days <= 30 days)',
        overlapCheck: 'PASSED (4.0 hrs >= 4.0 hrs UTC-5)',
        coreTechCheck: 'PASSED (Node.js, MongoDB)',
      },
      stage2Score: 82.1,
      stage2Breakdown: {
        primarySkills: 84,
        expRelevance: 80,
        productionEvidence: 80,
        evaluatorScore: 85,
        timezoneScore: 82,
      },
      qualification: 'QUALIFIED',
    },
    {
      candidateId: 'CND-103',
      name: 'Pooja Verma',
      title: 'Full Stack JavaScript',
      yearsExp: 6.0,
      stage1Passed: false,
      stage1Breakdown: {
        budgetCheck: 'FAILED (₹42L exceeds ₹35L ceiling)',
        noticePeriodCheck: 'PASSED (30 days)',
        overlapCheck: 'PASSED (4.0 hrs)',
        coreTechCheck: 'PASSED (Node.js)',
      },
      stage2Score: 0,
      stage2Breakdown: null,
      qualification: 'GATE_FAILED',
    },
  ]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Visual Focal Point Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Core Algorithmic Engine
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Deterministic • Zero Hallucination
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            2-Stage Matching Engine Simulator
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Inspect deterministic Stage 1 Hard-Gate filtering and Stage 2 weighted multi-factor scoring against candidate pools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleRunSimulation}
            leftIcon={<Cpu className="w-3.5 h-3.5" />}
          >
            {isSimulating ? 'Evaluating 500 Candidates...' : 'Re-run Matching Engine'}
          </Button>
        </div>
      </div>

      {/* Visual Stage Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stage 1 Hard-Gate Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                S1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Stage 1: Deterministic Hard Gates</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Binary Pass / Fail</span>
          </div>
          <p className="text-xs text-slate-500">
            Eliminates mismatched candidates unconditionally before scoring. Zero points or approximations.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Budget Cap</span>
              <span className="text-slate-400 text-[11px]">Expected CTC &lt;= Client Max Budget</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Timezone Overlap</span>
              <span className="text-slate-400 text-[11px]">&gt;= 4.0 Hours Mandated Overlap</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Notice Period</span>
              <span className="text-slate-400 text-[11px]">&lt;= 30 Days Immediate Joining</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Core Primary Tech</span>
              <span className="text-slate-400 text-[11px]">100% Match on Mandatory Skills</span>
            </div>
          </div>
        </div>

        {/* Stage 2 Scoring Weights Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                S2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Stage 2: Multi-Factor Weighted Scoring</h3>
            </div>
            <span className="text-xs font-semibold text-purple-600">Total: 100%</span>
          </div>
          <p className="text-xs text-slate-500">
            Normalized composite index ranking candidates who passed all Stage 1 hard gates.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Core Technical Stack Depth</span>
              <span className="font-bold text-slate-900">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Independent Evaluator Anchored Score</span>
              <span className="font-bold text-slate-900">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Production Architecture Evidence</span>
              <span className="font-bold text-slate-900">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Years of Relevant Domain Exp</span>
              <span className="font-bold text-slate-900">10%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Timezone & Communication Fit</span>
              <span className="font-bold text-slate-900">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Workspace */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Live Simulation Output: REQ-8801 (10 Senior Distributed Systems)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tested against active candidate pool of 500 engineers.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-800">42</span> passed Stage 1 • <span className="font-bold text-emerald-600">10</span> Top-N Shortlisted
          </div>
        </div>

        <div className="space-y-4">
          {matchResults.map((result) => (
            <div
              key={result.candidateId}
              className={`p-5 rounded-2xl border transition-all ${
                result.stage1Passed
                  ? 'border-slate-200/80 bg-white hover:border-blue-300'
                  : 'border-rose-100 bg-rose-50/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">{result.candidateId}</span>
                    <h4 className="font-bold text-slate-900">{result.name}</h4>
                    <span className="text-xs text-slate-500">({result.yearsExp} yrs exp)</span>
                  </div>
                  <p className="text-xs text-slate-600">{result.title}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Composite Fit Score
                    </span>
                    <span className={`text-xl font-black ${result.stage2Score >= 90 ? 'text-emerald-600' : result.stage2Score > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                      {result.stage2Score > 0 ? `${result.stage2Score}%` : 'N/A'}
                    </span>
                  </div>
                  <StatusBadge status={result.qualification} />
                </div>
              </div>

              {/* Stage breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
                    Stage 1 Hard-Gate Checks
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(result.stage1Breakdown).map(([k, v]: [string, any]) => (
                      <div key={k} className="flex items-center gap-2">
                        {String(v).startsWith('PASSED') ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className={String(v).startsWith('PASSED') ? 'text-slate-700' : 'text-rose-700 font-semibold'}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.stage2Breakdown && (
                  <div>
                    <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
                      Stage 2 Weighted Score Breakdown
                    </span>
                    <div className="space-y-1.5">
                      <ScoreBar label="Tech Depth (35%)" score={result.stage2Breakdown.primarySkills} maxScore={100} />
                      <ScoreBar label="Evaluator Rating (25%)" score={result.stage2Breakdown.evaluatorScore} maxScore={100} />
                      <ScoreBar label="Evidence Quality (20%)" score={result.stage2Breakdown.productionEvidence} maxScore={100} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
