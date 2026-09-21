import React, { useState } from 'react';
import { Button, StatusBadge, DataTable, Column } from '@thamilarasan/ui';
import {
  ShieldAlert,
  AlertTriangle,
  Eye,
  Lock,
  Globe,
  Camera,
  Bot,
  UserX,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const AdminFraudDetection: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([
    {
      id: 'FRD-1092',
      candidateName: 'Ramesh Patel',
      threatType: 'IP_GEO_MISMATCH',
      severity: 'HIGH',
      detectedAt: '35 mins ago',
      details: 'Registered as Bengaluru, India (ASN 45609), but evaluation session initiated from Amsterdam proxy node (M247 Ltd).',
      actionTaken: 'SESSION_FLAGGED',
      riskScore: 88,
    },
    {
      id: 'FRD-1093',
      candidateName: 'Vikas Agarwal',
      threatType: 'SYNTHETIC_IDENTITY_RESUME',
      severity: 'CRITICAL',
      detectedAt: '2 hours ago',
      details: 'Duplicated 94% text verbatim from existing candidate profile CND-044 with altered college roll numbers.',
      actionTaken: 'PROFILE_SUSPENDED',
      riskScore: 96,
    },
    {
      id: 'FRD-1094',
      candidateName: 'Sanjay Deshmukh',
      threatType: 'AI_PROXY_SPEECH_ANOMALY',
      severity: 'MEDIUM',
      detectedAt: 'Yesterday',
      details: 'Audio-visual desync detected during live interview room; background audio channel spectrogram indicates synthetic TTS or relay prompt.',
      actionTaken: 'MANUAL_REVIEW_QUEUED',
      riskScore: 62,
    },
  ]);

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Incident ID',
      render: (r) => <span className="font-mono text-xs text-slate-500 font-semibold">{r.id}</span>,
    },
    {
      key: 'candidateName',
      header: 'Subject Candidate',
      render: (r) => <span className="font-semibold text-slate-900 text-xs">{r.candidateName}</span>,
    },
    {
      key: 'threatType',
      header: 'Signal / Anomaly Type',
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/50">
          {r.threatType}
        </span>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (r) => (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
          r.severity === 'CRITICAL'
            ? 'bg-red-100 text-red-800'
            : r.severity === 'HIGH'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {r.severity}
        </span>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      render: (r) => (
        <span className={`font-mono font-bold text-xs ${r.riskScore >= 80 ? 'text-rose-600' : 'text-amber-600'}`}>
          {r.riskScore}/100
        </span>
      ),
    },
    {
      key: 'actionTaken',
      header: 'Intervention',
      render: (r) => <StatusBadge status={r.actionTaken} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Visual Focal Point */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
              Trust, Safety & Integrity Ops
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Biometric & Network Liveness Guard Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Anti-Fraud & Identity Verification Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Detect proxy test-takers, AI voice relay impersonations, resume fabrications, and geographic spoofing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
            Filter Critical (1)
          </Button>
          <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" leftIcon={<Lock className="w-3.5 h-3.5" />}>
            Suspend Bad Actors
          </Button>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Globe className="w-4 h-4" />
            <h4 className="font-bold text-xs text-slate-900">IP & ASN Verification</h4>
          </div>
          <p className="text-xs text-slate-500">
            Real-time proxy, VPN, and data-center IP detection on candidate login and interview stages.
          </p>
          <span className="text-[11px] font-semibold text-emerald-600 block pt-1">0% False Positive Tolerance</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-purple-600">
            <Camera className="w-4 h-4" />
            <h4 className="font-bold text-xs text-slate-900">Continuous Liveness Verification</h4>
          </div>
          <p className="text-xs text-slate-500">
            Automated facial feature consistency between profile ID and live interview video frame telemetry.
          </p>
          <span className="text-[11px] font-semibold text-emerald-600 block pt-1">99.8% Match Accuracy</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-rose-600">
            <Bot className="w-4 h-4" />
            <h4 className="font-bold text-xs text-slate-900">AI Prompt Relay Detection</h4>
          </div>
          <p className="text-xs text-slate-500">
            Keystroke flight time telemetry and audio spectrogram analysis to detect real-time LLM prompting.
          </p>
          <span className="text-[11px] font-semibold text-blue-600 block pt-1">Active Signal Scanners (3)</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={incidents}
        keyExtractor={(i) => i.id}
        searchPlaceholder="Filter candidate or threat type..."
      />
    </div>
  );
};
