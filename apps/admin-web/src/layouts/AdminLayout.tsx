import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PortalSwitcher } from '@thamilarasan/ui';
import {
  LayoutDashboard,
  Building2,
  Users,
  Award,
  FileSpreadsheet,
  ClipboardList,
  Activity,
  Sparkles,
  Users2,
  Calendar,
  Gift,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldAlert,
  History,
  Scale,
  Settings,
  Bell,
  Sliders,
  LogOut,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    {
      title: 'Operations',
      items: [
        { label: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Companies (25)', path: '/admin/companies', icon: Building2 },
        { label: 'Candidates (500)', path: '/admin/candidates', icon: Users },
        { label: 'Evaluators (50)', path: '/admin/evaluators', icon: Award },
        { label: 'Requirements (20)', path: '/admin/requirements', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'Vetting & QA',
      items: [
        { label: 'Assignment Engine', path: '/admin/assignments', icon: ClipboardList },
        { label: 'Evaluation Queue', path: '/admin/evaluations/queue', icon: FileText },
        { label: 'QA & Calibration', path: '/admin/qa-calibration', icon: Activity },
        { label: 'Matching Engine', path: '/admin/matching-engine', icon: Sparkles },
        { label: 'Shortlist Builder', path: '/admin/shortlist-builder', icon: Users2 },
      ],
    },
    {
      title: 'Placements & Finance',
      items: [
        { label: 'Interview Pipeline', path: '/admin/interviews', icon: Calendar },
        { label: 'Offers & Placements', path: '/admin/placements', icon: CheckCircle2 },
        { label: 'Finance & Invoices', path: '/admin/finance', icon: CreditCard },
        { label: 'Evaluator Payouts', path: '/admin/payouts', icon: Award },
      ],
    },
    {
      title: 'Trust & Governance',
      items: [
        { label: 'Fraud Detection', path: '/admin/fraud-detection', icon: ShieldAlert },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
        { label: 'Users & Roles (RBAC)', path: '/admin/users-roles', icon: Users },
        { label: 'System Settings', path: '/admin/system-settings', icon: Settings },
        { label: 'Feature Flags', path: '/admin/feature-flags', icon: Sliders },
        { label: 'Help & Docs', path: '/admin/help', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* Top Portal Switcher Bar */}
      <div className="shrink-0 z-30">
        <PortalSwitcher />
      </div>

      {/* Main Container: Fixed Sidebar + Independently Scrollable Right Section */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Fixed Desktop Sidebar (Matches CompanyLayout deep slate palette) */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex shrink-0 text-slate-300 h-full overflow-hidden select-none">
          {/* Scrollable Nav List inside Sidebar */}
          <div className="space-y-5 overflow-y-auto flex-1 pr-1 dark-scrollbar min-h-0">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-2 py-1">
              <img src="/inayon-white.png" alt="Inayon" className="h-8 w-auto object-contain" />
              <div className="overflow-hidden border-l border-slate-700 pl-2">
                <span className="font-bold text-white text-xs block leading-tight tracking-wide">
                  INAYON
                </span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider block">
                  COMMAND CENTER
                </span>
              </div>
            </Link>

            <nav className="space-y-5">
              {sections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                    {section.title}
                  </span>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* User & System Status Card at Bottom of Sidebar */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 mt-4 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <div className="truncate">
                <span className="text-white font-bold block text-xs truncate">Thamilarasan</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  System Healthy • 5000:OK
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-bold border border-blue-800/60 shrink-0">
                ADMIN
              </span>
            </div>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 pt-2 border-t border-slate-800 font-medium transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch / Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Independently Scrollable Right Section */}
        <main className="flex-1 h-full overflow-y-auto min-h-0 w-full bg-[#F8FAFC]">
          {/* Mobile Header Bar for small screens */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                TH
              </div>
              <span className="font-bold text-xs tracking-wide">TALENTHIRE ADMIN</span>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Sidebar Drawer */}
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
              <div className="w-72 bg-slate-900 h-full p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        TH
                      </div>
                      <span className="font-bold text-white text-xs">COMMAND CENTER</span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.title} className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block">
                          {section.title}
                        </span>
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                                isActive
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileOpen(false)} />
            </div>
          )}

          {/* Main Outlet Container */}
          <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

