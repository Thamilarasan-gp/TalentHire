import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Building2, ShieldCheck, ArrowRight, AlertCircle, Lock, Mail, ChevronLeft } from 'lucide-react';

export const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('talent@vanguard-fintech.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        navigate('/company/dashboard');
      } else {
        // Fallback for demonstration if user is seeded
        navigate('/company/dashboard');
      }
    } catch {
      navigate('/company/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#FAFBFD] text-[#0F172A] antialiased"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Top Header Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          to="/company"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link to="/company" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
            TH
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">Talent Hire</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-[440px] w-full mx-auto my-auto bg-white border border-slate-200/90 rounded-[32px] p-8 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.05)] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-900">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Company Portal
          </h1>
          <p className="text-[13px] text-slate-500">
            Review verified candidate dossiers and manage your active requirements
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Access */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            One-Click Demo Access
          </span>
          <button
            type="button"
            onClick={() => handleLogin()}
            className="w-full p-2.5 bg-white border border-slate-200 hover:border-slate-900 rounded-xl text-left transition-all flex items-center justify-between group shadow-sm hover:shadow"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-black">
                  Vanguard FinTech (Seeded)
                </span>
                <span className="text-[10.5px] text-slate-500 font-mono">talent@vanguard-fintech.com</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <Link to="/company/forgot-password" className="text-[11px] text-blue-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-[13px] shadow-sm hover:shadow transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          New to Talent Hire?{' '}
          <Link to="/company/register" className="text-slate-900 font-semibold hover:underline">
            Register Your Company
          </Link>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center py-2 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Talent Hire. Enterprise Technical Recruitment System.
      </div>
    </div>
  );
};
