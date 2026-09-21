import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const Pricing: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Transparent Business Model</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Performance Pricing Built on Successful Placements
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Zero upfront cost to source and evaluate. Companies pay only when a verified candidate is hired, protected by a 90-day replacement guarantee. Candidates never pay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase text-slate-400">For Candidates</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Software Talent</h3>
            <div className="text-3xl font-extrabold text-slate-900">$0 <span className="text-xs font-normal text-slate-500">Free forever</span></div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full access to global hiring opportunities, evaluation sessions, skill verification, and direct offers.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Free profile verification</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Independent peer evaluation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Direct USD contract offers</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Constructive feedback report</li>
            </ul>
          </div>
          <Link to="/talent/dashboard" className="w-full">
            <Button variant="outline" className="w-full">Join as Engineer</Button>
          </Link>
        </div>

        <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-md space-y-6 flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
            Most Popular
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase text-blue-600">Standard Tier</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Growth Hiring</h3>
            <div className="text-3xl font-extrabold text-slate-900">15% <span className="text-xs font-normal text-slate-500">of first-year salary</span></div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete requirement matching, evaluator assignments, QA verified Top-N shortlists, and interview coordination.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Pay only on successful hire</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> 90-day replacement guarantee</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Complete technical dossiers</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Full tenant data isolation</li>
            </ul>
          </div>
          <a href="http://localhost:3002" className="w-full">
            <Button variant="primary" className="w-full">Start Company Hiring</Button>
          </a>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase text-slate-400">High Volume</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise</h3>
            <div className="text-3xl font-extrabold text-slate-900">Custom <span className="text-xs font-normal text-slate-500">volume discounts</span></div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dedicated calibration sessions, custom rubric anchoring, SLA commitments, and dedicated account manager.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom evaluation rubrics</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated evaluator bench</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 180-day extended guarantee</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom invoicing & procurement</li>
            </ul>
          </div>
          <Link to="/contact" className="w-full">
            <Button variant="outline" className="w-full">Contact Enterprise Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
