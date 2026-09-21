import React from 'react';
import { CheckCircle2, AlertCircle, Award } from 'lucide-react';

export const TalentFeedback: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluator Feedback</h1>
        <p className="text-xs text-slate-500 mt-1">
          Concrete technical observations and recommendations from Staff/Principal evaluators.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Senior Backend Assessment Review</h3>
            <p className="text-xs text-slate-500">Evaluator: Arun Subramanian (Principal Software Architect)</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
            <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Core Strengths
            </span>
            <p className="text-emerald-800 leading-relaxed text-xs">
              "Karthik showed remarkable fluency in Node.js event-loop mechanics and libuv thread-pool delegation. When asked to troubleshoot a simulated event-loop blocking issue under 15,000 RPS, he immediately identified synchronous crypto operations and refactored to worker threads with precision."
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
            <span className="font-bold text-blue-900 block flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Recommendations for Continued Growth
            </span>
            <p className="text-blue-800 leading-relaxed text-xs">
              "Solid intuition with AWS SQS FIFO queues and distributed locking. Suggest diving deeper into Kubernetes multi-region ingress controllers and automated canary deployment rollbacks to further elevate staff-level infrastructure competencies."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
