import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import { ShieldCheck, UserCheck, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('karthik.iyer1@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, customEmail?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const targetEmail = customEmail || email;
      const res = await api.login({
        email: targetEmail,
        password: password,
      });

      if (res.success && res.data) {
        const user = res.data.user;
        // Save unified user profile in localStorage for dynamic navbar access
        localStorage.setItem('tg_user', JSON.stringify(user));
        if (res.data.token) {
          localStorage.setItem('tg_token', res.data.token);
        }
        window.dispatchEvent(new Event('auth-change'));

        // Route to talent dashboard or respective workspace
        const userRole = (user.role as any);
        if (userRole === 'COMPANY_ADMIN' || userRole === 'COMPANY_RECRUITER' || userRole === 'COMPANY_HIRING_MANAGER') {
          window.location.href = 'http://localhost:3002/company/dashboard';
        } else if (userRole === 'SUPER_ADMIN' || userRole === 'PLATFORM_ADMIN') {
          window.location.href = 'http://localhost:3001/admin/dashboard';
        } else {
          // Unified candidate portal (Evaluator workstation button unlocks directly in navbar)
          navigate('/talent/dashboard');
        }
      } else {
        setError(res.error || 'Invalid email or password');
      }
    } catch {
      setError('Connection to Central API failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 border border-slate-200/90 rounded-3xl shadow-sm">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src="/inayon-dark.png" alt="Inayon" className="h-10 sm:h-12 w-auto mx-auto object-contain" />
          </Link>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Sign in to Inayon</h2>
          <p className="text-xs text-slate-500 font-medium">
            One single login for both Job Seeking and Technical Evaluation
          </p>
        </div>

        {/* Dual-Role Explanation Badge */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold block">Unified Account Architecture</span>
            <span className="text-[11px] text-blue-800">
              The same email accesses your candidate applications, 5-day stack passes, and your expert Evaluator Workstation once approved.
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Instant 1-Click Sign-In with Same Email */}
        <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Instant Demo Sign-In (Same Email Dual-Role)
          </span>

          <button
            type="button"
            onClick={() => handleLogin(undefined, 'karthik.iyer1@example.com')}
            className="w-full p-3 bg-white border border-slate-200/90 hover:border-blue-500 rounded-xl text-left transition-all shadow-sm flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                KI
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900 group-hover:text-blue-600 transition-colors">
                  Karthik Iyer
                </span>
                <span className="text-[10px] text-slate-500 block">karthik.iyer1@example.com</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-purple-600" />
                Job Seeker + Evaluator
              </span>
            </div>
          </button>
        </div>

        {/* Unified Sign-In Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">Forgot?</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <Button type="submit" size="md" isLoading={loading} className="w-full py-2.5 font-bold shadow-sm">
            Sign In with Email
          </Button>
        </form>

        {/* Portal links footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Enterprise recruiter?</span>
          <a
            href="http://localhost:3002/company/login"
            className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
          >
            <Building2 className="w-3 h-3" />
            Company Portal
          </a>
        </div>
      </div>
    </div>
  );
};
