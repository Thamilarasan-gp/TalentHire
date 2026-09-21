import React from 'react';
import { Star, Building2, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@thamilarasan/ui';

export const SuccessStories: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Verified Impact</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Real Engineering Placements
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          How international tech startups and enterprises scaled their core systems with verified Indian engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              VF
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Vanguard FinTech (New York)</h4>
              <p className="text-xs text-slate-500">Hired 10 Senior Node.js Backend Engineers in 18 days</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-600 pl-4">
            "Before Talent Hire, our internal recruiters interviewed 60 candidates to find 2 qualified engineers. With Talent Hire, every candidate on our Top-10 shortlist had already demonstrated verified production competence. We hired all 10 in under 3 weeks."
          </p>
          <div className="pt-2 text-xs font-semibold text-slate-700">
            David Miller — VP of Engineering, Vanguard FinTech
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              CS
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">CloudScale Systems (Zurich)</h4>
              <p className="text-xs text-slate-500">Hired 5 Distributed Systems & Kubernetes Leads</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-emerald-600 pl-4">
            "The technical evaluation reports were the most detailed I have ever seen. Concrete observation notes on event loops, sharding strategies, and trade-offs made our final interviews a pure culture and vision alignment."
          </p>
          <div className="pt-2 text-xs font-semibold text-slate-700">
            Helena Meyer — CTO, CloudScale Systems
          </div>
        </div>
      </div>
    </div>
  );
};
