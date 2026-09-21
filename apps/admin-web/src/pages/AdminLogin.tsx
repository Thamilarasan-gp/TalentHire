import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PortalSwitcher } from '@thamilarasan/ui';
import { ShieldAlert, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@thamilarasan.global');
  const [password, setPassword] = useState('Admin@12345');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tg_token', 'admin-super-demo-token');
    localStorage.setItem('tg_role', 'SUPER_ADMIN');
    navigate('/admin/dashboard');
  };

  const handleQuickRole = (roleEmail: string, roleName: string) => {
    setEmail(roleEmail);
    localStorage.setItem('tg_token', `${roleName.toLowerCase()}-demo-token`);
    localStorage.setItem('tg_role', roleName);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PortalSwitcher />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-500/30 mb-2">
              TG
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Command Center Authentication
            </h1>
            <p className="text-xs text-slate-400">
              Restricted infrastructure portal. Hardware security key or session token required.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Administrative Principal (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hardware Token / Master Secret
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            </div>

            <Button type="submit" size="md" className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Authenticate & Enter Command Center
            </Button>
          </form>

          {/* 1-Click Role Switcher */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block text-center">
              1-Click Admin Role Switcher
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRole('admin@thamilarasan.global', 'SUPER_ADMIN')}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-left transition-colors"
              >
                <span className="font-bold text-white block text-xs">Super Admin</span>
                <span className="text-[10px] text-slate-400">Full platform root</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('qa@thamilarasan.global', 'QA_LEAD')}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-left transition-colors"
              >
                <span className="font-bold text-purple-400 block text-xs">QA Lead</span>
                <span className="text-[10px] text-slate-400">Calibrate & Payouts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
