import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PortalSwitcher } from '@thamilarasan/ui';
import { api } from '@thamilarasan/api-client';
import { User, Company } from '@thamilarasan/types';
import { CompanyCommandPalette } from '../components/CompanyCommandPalette';
import {
  LayoutDashboard,
  Building2,
  Users,
  PlusCircle,
  FileSpreadsheet,
  Sparkles,
  Users2,
  Calendar,
  Gift,
  FileCheck,
  Award,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

export const CompanyLayout: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    api.getMe().then((res) => {
      if (res.success && res.data) {
        setUser(res.data);
      }
    });

    api.getCompanyMe().then((res) => {
      if (res.success && res.data) {
        setCompany(res.data);
      }
    });

    api.getNotifications().then((res: any) => {
      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadNotifs(res.data.length);
      }
    });
  }, []);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Hiring',
      items: [
        { label: 'My Openings', path: '/company/openings', icon: FileSpreadsheet },
        { label: 'Quick Match', path: '/company/matches', icon: Sparkles },
        { label: 'Decision Shortlists', path: '/company/shortlists', icon: Users2 },
      ],
    },
    {
      title: 'Interviews',
      items: [
        { label: 'Interviews', path: '/company/interviews', icon: Calendar },
        { label: 'Feedback', path: '/company/feedback', icon: FileCheck },
        { label: 'Offers', path: '/company/offers', icon: Gift },
      ],
    },
    {
      title: 'Organization',
      items: [
        { label: 'Team', path: '/company/team', icon: Users },
        { label: 'Analytics', path: '/company/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', path: '/company/settings', icon: Settings },
        { label: 'Support', path: '/company/support', icon: HelpCircle },
      ],
    },
  ];

  // Derive breadcrumb path
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
        <div className="shrink-0 z-30">
          <PortalSwitcher />
        </div>
        <CompanyCommandPalette />

        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* SaaS Enterprise Sidebar */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex shrink-0 text-slate-300 h-full overflow-hidden select-none">
            <div className="space-y-5 overflow-y-auto flex-1 pr-1 min-h-0">
              <Link to="/company/dashboard" className="flex items-center gap-2.5 px-2 py-1">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                  {(company?.name || user?.fullName || 'TH').charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-white text-xs block leading-tight truncate" title={company?.name || user?.fullName || 'Company Workspace'}>
                    {company?.name || (user?.fullName ? `${user.fullName}'s Workspace` : 'Company Workspace')}
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold truncate block">
                    {user?.fullName ? `${user.fullName} · ${user?.role?.replace('COMPANY_', '') || 'ADMIN'}` : (user?.role || 'COMPANY_ADMIN')}
                  </span>
                </div>
              </Link>

              {/* Quick Command Palette Trigger
              <button
                onClick={() => {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 text-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>Quick search...</span>
                </span>
                <kbd className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">Ctrl K</kbd>
              </button> */}

              <nav className="space-y-5">
                {navSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                      {section.title}
                    </span>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        location.pathname === item.path ||
                        (item.path === '/company/openings' &&
                          (location.pathname.startsWith('/company/openings') ||
                            location.pathname.startsWith('/company/requirements')));
                      const isFeedback = item.path === '/company/feedback';

                      let activeClass = 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40 shadow-sm';
                      let activeIconClass = 'text-blue-400';
                      if (isFeedback) {
                        activeClass = 'bg-emerald-600/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm';
                        activeIconClass = 'text-emerald-400';
                      }

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                              ? activeClass
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? activeIconClass : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

           
             <Link
                to="/company/login"
                className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300 pt-2 border-t border-slate-800 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Link>
          </aside>

          {/* Main Content Area with Header Bar & Breadcrumbs */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Top Workspace Header Bar */}
            <div className="h-14 border-b border-slate-200/80 bg-white px-6 flex items-center justify-between shrink-0">
              {/* Breadcrumbs & Dynamic Company Title */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium capitalize">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 pr-3 border-r border-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{company?.name || 'Company Portal'}</span>
                </div>
                <span>Workspace</span>
                {pathParts.slice(1).map((part, idx) => (
                  <React.Fragment key={part}>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className={idx === pathParts.length - 2 ? 'font-bold text-slate-900' : ''}>
                      {part.replace(/-/g, ' ')}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              {/* Notification & Actions */}
              <div className="flex items-center gap-4 relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 top-10 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-900">Live Hiring Notifications</span>
                      <button
                        onClick={() => {
                          setNotifications([]);
                          setUnreadNotifs(0);
                        }}
                        className="text-[10px] text-cyan-600 font-semibold hover:underline"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 text-center text-slate-400 text-[11px]">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notif: any, i: number) => (
                          <div
                            key={notif.id || i}
                            className={`p-2.5 rounded-lg border text-slate-700 ${notif.type === 'SUCCESS'
                                ? 'bg-emerald-50 border-emerald-100'
                                : notif.type === 'ERROR'
                                  ? 'bg-rose-50 border-rose-100'
                                  : 'bg-cyan-50 border-cyan-100'
                              }`}
                          >
                            <span className="font-bold text-slate-900 block capitalize">
                              {notif.title}
                            </span>
                            <span className="text-[11px] text-slate-600 block mt-0.5">
                              {notif.message}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Page View */}
            <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};
