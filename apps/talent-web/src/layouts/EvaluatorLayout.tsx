import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { PortalSwitcher } from '@thamilarasan/ui';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  CreditCard,
  Clock,
  History,
  Activity,
  Settings,
  LogOut,
  Award,
  Briefcase,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { api } from '@thamilarasan/api-client';

export const EvaluatorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('tg_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('tg_user');
    localStorage.removeItem('tg_token');
    api.logout();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const navItems = [
    { label: 'Evaluator Dashboard', path: '/evaluator/dashboard', icon: LayoutDashboard },
    { label: 'Available Assignments', path: '/evaluator/assignments', icon: ClipboardList },
    { label: 'My Assignments', path: '/evaluator/my-assignments', icon: CalendarCheck },
    { label: 'Earnings & Payouts', path: '/evaluator/earnings', icon: CreditCard },
    { label: 'Availability Hours', path: '/evaluator/availability', icon: Clock },
    { label: 'Evaluation History', path: '/evaluator/history', icon: History },
    { label: 'QA / Calibration', path: '/evaluator/calibration', icon: Activity },
    { label: 'Settings', path: '/evaluator/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-100">
      <PortalSwitcher />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 text-slate-300">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 px-2 group">
              <img src="/inayon-white.png" alt="Inayon" className="h-9 w-auto object-contain" />
              <div className="border-l border-slate-700 pl-2">
                <span className="font-bold text-white text-[11px] block leading-tight tracking-wider uppercase">Evaluator Network</span>
              </div>
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3 pt-6">
            {/* Quick Switcher back to Job Seeker View */}
            <Link
              to="/talent/dashboard"
              className="block p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  Job Seeker Mode
                </span>
                <span className="text-[10px] bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                  Switch ⇆
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Return to candidate applications & stack passes
              </p>
            </Link>

            {/* User Session card */}
            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser?.fullName?.charAt(0) || 'K'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">
                    {currentUser?.fullName || 'Karthik Iyer'}
                  </span>
                  <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" /> Principal Evaluator
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 pt-2 border-t border-slate-800 font-medium transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out ({currentUser?.email || 'karthik.iyer1@example.com'})</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area with Top Navbar */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0F172A]">
          {/* Top Header Navbar */}
          <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 sm:px-10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium">Evaluator Workstation</span>
              <span>/</span>
              <span className="font-bold text-slate-200 capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>

            {/* Dynamic Navbar CTAs */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-900/40 border border-purple-700/50 text-[11px] text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Active Bounty: <strong>₹2,000 / Hire</strong></span>
              </div>

              <Link
                to="/talent/dashboard"
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job Seeker View ⇆</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
            <ErrorBoundary fallbackTitle="Evaluator Workstation Issue">
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
};
