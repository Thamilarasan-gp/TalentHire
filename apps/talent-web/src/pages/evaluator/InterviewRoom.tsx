import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@thamilarasan/ui';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  FileText,
  Code,
  ArrowRight,
  ShieldCheck,
  Clock,
  User,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const InterviewRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [recording, setRecording] = useState(true);
  const [activeTab, setActiveTab] = useState<'problem' | 'code'>('code');
  const [liveNotes, setLiveNotes] = useState(
    'Candidate quickly recognized that fs.readFileSync blocks the event loop. Proposed worker threads for CPU-bound hashing calculations.'
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Session Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-xs tracking-tight">EVALUATION SESSION: Senior Node.js Architecture</span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400 font-mono">Session ID: {id || 'eval-1'}</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-rose-400 font-mono text-[11px] bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            REC 42:15 (Consent Verified)
          </div>
          <Button
            size="sm"
            onClick={() => navigate(`/evaluator/scorecard/${id || 'eval-1'}`)}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 text-xs"
            rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
          >
            End Interview & Open Scorecard
          </Button>
        </div>
      </div>

      {/* Main 3-Column Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Candidate Dossier */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/60 p-5 overflow-y-auto space-y-6 shrink-0 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Candidate Dossier
            </span>
            <h3 className="font-bold text-sm text-white">Karthik Iyer</h3>
            <p className="text-[11px] text-slate-400">Senior Node.js Backend Engineer • 7 yrs</p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Core Skills to Evaluate
            </span>
            <div className="flex flex-wrap gap-1">
              {['Node.js', 'Event Loop', 'libuv', 'AWS SQS', 'PostgreSQL', 'System Design'].map((sk) => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Anchored Rubric Reminders
            </span>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block">Level 7–8 (Strong):</span>
              <p>Production competence with concrete trade-off reasoning and edge-case handling.</p>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-purple-400 block">Level 9–10 (Expert):</span>
              <p>Deep internals mastery (C++ bindings, memory leaks, high-frequency concurrency).</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Video Stage & Coding Area */}
        <div className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800">
          {/* Top Video Stage */}
          <div className="h-48 bg-slate-900 border-b border-slate-800 p-3 grid grid-cols-2 gap-3 shrink-0">
            {/* Candidate Feed */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                  K
                </div>
                <span className="text-xs font-bold text-slate-300 block">Karthik Iyer (Live Stream)</span>
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 1080p 60fps
              </span>
            </div>

            {/* Evaluator Feed */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                  A
                </div>
                <span className="text-xs font-bold text-slate-300 block">Arun Subramanian (You)</span>
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-purple-400 font-mono">
                Evaluator Mic Active
              </span>
            </div>
          </div>

          {/* Interactive Code / Problem Tabs */}
          <div className="h-10 bg-slate-900/80 border-b border-slate-800 px-4 flex items-center gap-4 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 py-2 border-b-2 transition-colors ${
                activeTab === 'code' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Live Problem Workspace: Event Loop Concurrency</span>
            </button>
          </div>

          {/* Code Stage */}
          <div className="flex-1 p-4 font-mono text-xs text-slate-300 bg-slate-950 overflow-y-auto leading-relaxed">
            <pre className="text-emerald-400">// PROBLEM: High-Volume Event-Driven Transaction Worker</pre>
            <pre className="text-slate-500">// Diagnose the event loop latency spike below:</pre>
            <pre className="pt-2 text-slate-200">
{`const crypto = require('crypto');
const express = require('express');
const app = express();

app.post('/process-transaction', (req, res) => {
  // CANDIDATE LIVE REFACTOR:
  // Identified crypto.pbkdf2Sync as blocking libuv event loop.
  // Candidate refactored to worker_threads with thread pool isolation:
  const worker = new Worker('./hashWorker.js', { workerData: req.body });
  worker.on('message', (hash) => {
    res.json({ success: true, hash });
  });
});`}
            </pre>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Observation Notes */}
        <div className="w-80 bg-slate-900/60 p-5 flex flex-col justify-between shrink-0 text-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Live Observations
              </span>
              <span className="text-[10px] text-slate-500">Auto-saved to draft</span>
            </div>

            <textarea
              rows={14}
              value={liveNotes}
              onChange={(e) => setLiveNotes(e.target.value)}
              placeholder="Record concrete evidence, code choices, trade-offs, and communication signals..."
              className="w-full h-80 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Lock className="w-3 h-3 text-purple-400" />
              Confidentiality Notice
            </div>
            <p className="leading-tight text-[10px]">
              Evaluation notes are private to QA calibration and summarized objectively for the hiring company.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="h-16 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-2.5 rounded-xl border transition-colors ${
              micOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-900/40 border-rose-800 text-rose-300'
            }`}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`p-2.5 rounded-xl border transition-colors ${
              cameraOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-900/40 border-rose-800 text-rose-300'
            }`}
          >
            {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate(`/evaluator/scorecard/${id || 'eval-1'}`)}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600"
          >
            Complete Session & Open Scorecard
          </Button>
        </div>
      </div>
    </div>
  );
};
