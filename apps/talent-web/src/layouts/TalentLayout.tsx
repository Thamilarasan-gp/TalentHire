import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PortalSwitcher } from '@thamilarasan/ui';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Briefcase,
  FileCheck,
  Calendar,
  Gift,
  MessageSquare,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const TalentLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/talent/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/talent/profile', icon: User },
    { label: 'Recommended Jobs', path: '/talent/recommended-jobs', icon: Sparkles },
    { label: 'Applications', path: '/talent/applications', icon: Briefcase },
    { label: 'Evaluations', path: '/talent/evaluations', icon: FileCheck },
    { label: 'Interviews', path: '/talent/interviews', icon: Calendar },
    { label: 'Offers', path: '/talent/offers', icon: Gift },
    { label: 'Feedback', path: '/talent/feedback', icon: MessageSquare },
    { label: 'Settings', path: '/talent/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PortalSwitcher />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                TG
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block leading-tight">CANDIDATE PORTAL</span>
                <span className="text-[10px] text-slate-400 font-medium">Thamilarasan Global</span>
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
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                K
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-900 block truncate">Karthik Iyer</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Candidate
                </span>
              </div>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 pt-2 border-t border-slate-200/60 font-medium"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch / Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
