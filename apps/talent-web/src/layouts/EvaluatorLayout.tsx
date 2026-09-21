import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  Award
} from 'lucide-react';

export const EvaluatorLayout: React.FC = () => {
  const location = useLocation();

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PortalSwitcher />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between hidden md:flex shrink-0 text-slate-300">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                TG
              </div>
              <div>
                <span className="font-bold text-white text-xs block leading-tight">EVALUATOR NETWORK</span>
                <span className="text-[10px] text-purple-400 font-semibold">Expert Workstation</span>
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">Arun Subramanian</span>
                <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" /> Principal Evaluator
                </span>
              </div>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 pt-2 border-t border-slate-800 font-medium"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch Account</span>
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          <ErrorBoundary fallbackTitle="Evaluator Workstation Issue">
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
