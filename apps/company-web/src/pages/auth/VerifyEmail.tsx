import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const VerifyEmail: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0F1D] text-slate-100">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Verify Your Work Email</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            We have sent an authentication verification link to your corporate email. Please click the link to confirm your corporate organization domain.
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
          <span className="text-cyan-400 font-bold block">Enterprise Domain Verification</span>
          <p>Verified domains unlock instant deterministic matching against top 1% Indian engineering candidates.</p>
        </div>

        <div className="space-y-3">
          <Link to="/company/onboarding" className="block w-full">
            <Button size="md" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Proceed to Onboarding
            </Button>
          </Link>
          <Link to="/company/login" className="text-xs text-slate-500 hover:text-slate-300 block">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
