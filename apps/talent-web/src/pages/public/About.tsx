import React from 'react';
import { Globe, Users, Award, Shield } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Company Mission</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          People • Skills • Opportunities • Without Borders
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          THAMILARASAN GLOBAL was founded on a simple thesis: Engineering excellence is distributed globally, but traditional hiring pipelines remain broken by resume buzzwords, recruiter friction, and uncalibrated interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Global Talent Infrastructure</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We connect the highest-caliber Indian software engineers with premier global technology companies in North America, Europe, and Asia-Pacific.
          </p>
        </div>

        <div className="p-8 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Independent Expert Network</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            By decoupling evaluation from hiring outcomes, our network of independent Staff and Principal evaluators provides unvarnished, calibrated assessments that companies trust.
          </p>
        </div>
      </div>
    </div>
  );
};
