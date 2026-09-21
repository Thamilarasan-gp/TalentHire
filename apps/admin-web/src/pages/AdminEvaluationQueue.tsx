import React, { useState, useEffect } from 'react';
import { api } from '@thamilarasan/api-client';
import { Button, StatusBadge, DataTable, Column, ScoreBar } from '@thamilarasan/ui';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  ShieldCheck,
  Check,
  X,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminEvaluationQueue: React.FC = () => {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [selectedEval, setSelectedEval] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch queue or use realistic data
    api.getAdminStats().then(() => {
      const mockEvals = [
        {
          id: 'EVL-5501',
          candidateName: 'Karthik Iyer',
          candidateRole: 'Senior Distributed Systems Architect',
          evaluatorName: 'Vikramaditya Sengupta',
          overallScore: 92,
          recommendation: 'STRONG_HIRE',
          status: 'PENDING_QA',
          submittedAt: '2 hours ago',
          rubricScores: {
            problemSolving: 95,
            systemDesign: 92,
            codeQuality: 90,
            communication: 88,
          },
          evaluatorNotes: 'Exceptional grasp of write-ahead logging, distributed transactions, and Raft consensus. Solved live concurrency exercise with zero race conditions.',
        },
        {
          id: 'EVL-5502',
          candidateName: 'Ananya Sharma',
          candidateRole: 'Principal Cloud / SRE',
          evaluatorName: 'Rahul Varma',
          overallScore: 86,
          recommendation: 'HIRE',
          status: 'PENDING_QA',
          submittedAt: '3 hours ago',
          rubricScores: {
            problemSolving: 85,
            systemDesign: 88,
            codeQuality: 84,
            communication: 90,
          },
          evaluatorNotes: 'Strong incident response and Kubernetes control plane debugging. Clear structured architecture diagrams during live whiteboard.',
        },
        {
          id: 'EVL-5503',
          candidateName: 'Dinesh Kumar',
          candidateRole: 'Full Stack React / Node Lead',
          evaluatorName: 'Priya Sundar',
          overallScore: 68,
          recommendation: 'DO_NOT_HIRE',
          status: 'CALIBRATED',
          submittedAt: 'Yesterday',
          rubricScores: {
            problemSolving: 65,
            systemDesign: 68,
            codeQuality: 70,
            communication: 72,
          },
          evaluatorNotes: 'Struggled with React reconciliation internals and memory leak root-cause analysis during the live debugging task.',
        },
      ];
      setEvaluations(mockEvals);
      setSelectedEval(mockEvals[0]);
      setLoading(false);
    });
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Evaluation ID',
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-500">{row.id}</span>,
    },
    {
      key: 'candidateName',
      header: 'Candidate',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.candidateName}</span>
          <span className="text-[11px] text-slate-500">{row.candidateRole}</span>
        </div>
      ),
    },
    {
      key: 'evaluatorName',
      header: 'Evaluator',
      render: (row) => <span className="text-xs text-slate-700 font-medium">{row.evaluatorName}</span>,
    },
    {
      key: 'overallScore',
      header: 'Score',
      render: (row) => (
        <span className={`font-mono font-bold text-xs ${row.overallScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
          {row.overallScore}/100
        </span>
      ),
    },
    {
      key: 'recommendation',
      header: 'Outcome',
      render: (row) => (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
          row.recommendation === 'STRONG_HIRE'
            ? 'bg-emerald-100 text-emerald-800'
            : row.recommendation === 'HIRE'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-rose-100 text-rose-800'
        }`}>
          {row.recommendation.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'QA Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Visual Focal Point */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md">
              Scorecard Calibration & Quality Assurance
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> SLA: 4 Hours Max Turnaround
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Technical Evaluation Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Audit locked scorecards, verify rubrics, validate compulsory evidence notes, and release evaluator compensation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Download Rubric Standards
          </Button>
          <Button size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Batch Approve Calibrated
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={evaluations}
            keyExtractor={(i) => i.id}
            onRowClick={(row) => setSelectedEval(row)}
            searchPlaceholder="Search by candidate, evaluator, or ID..."
          />
        </div>

        {/* Selected Scorecard Deep-Dive */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          {selectedEval ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs text-slate-400 font-bold block">{selectedEval.id}</span>
                  <span className="text-sm font-bold text-slate-900">{selectedEval.candidateName}</span>
                </div>
                <StatusBadge status={selectedEval.status} />
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Anchored Rubric Metrics
                </span>
                <div className="space-y-2.5">
                  <ScoreBar label="Problem Solving & Algorithms" score={selectedEval.rubricScores.problemSolving} maxScore={100} />
                  <ScoreBar label="System Architecture & Scalability" score={selectedEval.rubricScores.systemDesign} maxScore={100} />
                  <ScoreBar label="Code Cleanliness & Concurrency" score={selectedEval.rubricScores.codeQuality} maxScore={100} />
                  <ScoreBar label="Technical Communication" score={selectedEval.rubricScores.communication} maxScore={100} />
                </div>
              </div>

              {/* Compulsory Evaluator Evidence */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Compulsory Evidence & Observations
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100 italic">
                  "{selectedEval.evaluatorNotes}"
                </div>
              </div>

              {/* QA Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={() => alert(`Scorecard ${selectedEval.id} QA Approved! Payout of ₹5,000 released to ${selectedEval.evaluatorName}.`)}
                >
                  Approve Scorecard & Release Payout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-rose-600 hover:bg-rose-50 border-rose-200"
                  leftIcon={<X className="w-3.5 h-3.5" />}
                >
                  Reject & Request Evaluator Clarification
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an evaluation to view detailed anchored rubric scores
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
