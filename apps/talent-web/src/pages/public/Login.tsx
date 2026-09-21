import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import { ShieldCheck, UserCheck, Award, Building2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('karthik.iyer1@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, customRole?: string, customEmail?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({
        email: customEmail || email,
        password: password,
      });

      if (res.success && res.data) {
        const role = res.data.user.role;
        if (role === 'EVALUATOR') {
          navigate('/evaluator/dashboard');
        } else if (role === 'JOB_SEEKER') {
          navigate('/talent/dashboard');
        } else if (role === 'COMPANY_ADMIN' || role === 'COMPANY_RECRUITER') {
          window.location.href = 'http://localhost:3002/company/dashboard';
        } else {
          window.location.href = 'http://localhost:3001/admin/dashboard';
        }
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch {
      setError('Connection to Central API failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-slate-200/80 rounded-2xl shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center mx-auto text-lg shadow-sm">
            TH
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to Talent Hire</h2>
          <p className="text-xs text-slate-500">Access your candidate or evaluator workspace</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Demo Fast Login Switcher */}
        <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Instant Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleLogin(undefined, 'JOB_SEEKER', 'karthik.iyer1@example.com')}
              className="p-2 bg-white border border-slate-200 rounded-lg text-left hover:border-blue-500 transition-colors flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-xs font-bold block text-slate-900 leading-tight">Candidate</span>
                <span className="text-[10px] text-slate-500">Karthik Iyer</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleLogin(undefined, 'EVALUATOR', 'evaluator1@thamilarasanglobal.eval')}
              className="p-2 bg-white border border-slate-200 rounded-lg text-left hover:border-purple-500 transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-xs font-bold block text-slate-900 leading-tight">Evaluator</span>
                <span className="text-[10px] text-slate-500">Subramanian</span>
              </div>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="http://localhost:3002/company/login"
              className="p-2 bg-white border border-slate-200 rounded-lg text-left hover:border-cyan-500 transition-colors flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-cyan-600" />
              <div>
                <span className="text-xs font-bold block text-slate-900 leading-tight">Company</span>
                <span className="text-[10px] text-slate-500">Vanguard FinTech</span>
              </div>
            </a>
            <a
              href="http://localhost:3001/admin/login"
              className="p-2 bg-white border border-slate-200 rounded-lg text-left hover:border-slate-700 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-800" />
              <div>
                <span className="text-xs font-bold block text-slate-900 leading-tight">Admin</span>
                <span className="text-[10px] text-slate-500">Command Center</span>
              </div>
            </a>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <Button type="submit" size="md" isLoading={loading} className="w-full">
            Sign In with Email
          </Button>
        </form>
      </div>
    </div>
  );
};
