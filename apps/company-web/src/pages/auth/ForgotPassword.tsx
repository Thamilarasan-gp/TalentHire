import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0F1D] text-slate-100">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-slate-400">
            Enter your corporate email address to receive password reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-300">
              Password recovery link has been dispatched to <strong>{email}</strong>.
            </p>
            <Link to="/company/login">
              <Button size="sm" className="bg-cyan-600 mt-2">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Corporate Email</label>
              <input
                type="email"
                required
                placeholder="talent@vanguard-fintech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <Button type="submit" size="md" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
              Send Reset Instructions
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-500">
          Remember your credentials?{' '}
          <Link to="/company/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
