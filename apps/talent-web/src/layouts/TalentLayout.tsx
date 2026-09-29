import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { PortalSwitcher } from '@thamilarasan/ui';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Briefcase,
  FileCheck,
  Calendar,
  Gift,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  Award,
  Clock,
  ArrowRight,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { BecomeEvaluatorModal } from '../components/BecomeEvaluatorModal';
import { UserProfileDropdown } from '../components/UserProfileDropdown';
import { api } from '@thamilarasan/api-client';

export const TalentLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evaluatorStatus, setEvaluatorStatus] = useState<string>('NONE');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('tg_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loadStatus = async () => {
    try {
      const candId = currentUser?.candidateId || 'cand-1';
      const res = await api.getEvaluatorAppStatus(candId);
      if (res.success && res.data) {
        setEvaluatorStatus(res.data.status);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadStatus();

    const handleAuthChange = () => {
      try {
        const stored = localStorage.getItem('tg_user');
        const user = stored ? JSON.parse(stored) : null;
        setCurrentUser(user);
        if (user?.evaluatorStatus) {
          setEvaluatorStatus(user.evaluatorStatus);
        }
      } catch {
        setCurrentUser(null);
      }
      loadStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdown on route changes
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('tg_user');
    localStorage.removeItem('tg_token');
    api.logout();
    setCurrentUser(null);
    setEvaluatorStatus('NONE');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const isApprovedEvaluator =
    evaluatorStatus === 'APPROVED' ||
    currentUser?.isEvaluator ||
    currentUser?.evaluatorStatus === 'APPROVED' ||
    currentUser?.role === 'EVALUATOR';

  const navItems = [
    { label: 'Dashboard', path: '/talent/dashboard', icon: LayoutDashboard },
    { label: 'Domain Stack Passes', path: '/talent/stack-passes', icon: Zap },
    { label: 'Explore Verified Jobs', path: '/jobs', icon: Sparkles },
    { label: 'My Applications', path: '/talent/applications', icon: Briefcase },
    { label: 'Evaluations Dossier', path: '/talent/evaluations', icon: FileCheck },
    { label: 'My Profile', path: '/talent/profile', icon: User },
    { label: 'Interviews', path: '/talent/interviews', icon: Calendar },
    { label: 'Offers', path: '/talent/offers', icon: Gift },
    { label: 'Settings', path: '/talent/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PortalSwitcher />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 px-2 group">
              <img src="/inayon-dark.png" alt="Inayon" className="h-9 w-auto object-contain" />
              <div className="border-l border-slate-200 pl-2">
                <span className="font-bold text-slate-900 text-[11px] block leading-tight tracking-wider uppercase">Candidate Portal</span>
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

          <div className="space-y-2 pt-6">
            {/* Dual Role Switcher Card in Sidebar */}
            {isApprovedEvaluator ? (
              <Link
                to="/evaluator/dashboard"
                className="block p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200/90 transition-all text-left group shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-0.5">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    Evaluator Role Active
                  </span>
                  <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold group-hover:bg-purple-700">
                    Switch ⇆
                  </span>
                </div>
                <p className="text-[10px] text-purple-700 leading-tight">
                  Open Evaluator Workstation (₹2,000 bounty active)
                </p>
              </Link>
            ) : evaluatorStatus === 'PENDING_ADMIN_VERIFICATION' ? (
              <button
                onClick={() => setEvalModalOpen(true)}
                className="w-full p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Review Pending</span>
                </div>
                <p className="text-[10px] text-amber-700 mt-0.5">Evaluator verification in progress (24h)</p>
              </button>
            ) : (
              <button
                onClick={() => setEvalModalOpen(true)}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200/80 text-left transition-all shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>Become an Evaluator</span>
                </div>
                <p className="text-[10px] text-purple-700 mt-0.5">Earn ₹2,000 bounty + scratch cash</p>
              </button>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser?.fullName?.charAt(0) || 'K'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {currentUser?.fullName || 'Karthik Iyer'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {isApprovedEvaluator ? 'Candidate + Evaluator' : 'Verified Candidate'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 pt-2 border-t border-slate-200/60 font-medium transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out ({currentUser?.email || 'karthik.iyer1@example.com'})</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area with Top Navbar */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar Header */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Talent Portal</span>
              <span>/</span>
              <span className="font-bold text-slate-800 capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>

            {/* Dynamic Role-Based Buttons in Navbar */}
            <div className="flex items-center gap-3">
              {isApprovedEvaluator ? (
                <Link
                  to="/evaluator/dashboard"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-200" />
                  <span>Evaluation Workstation</span>
                  <span className="text-[10px] bg-purple-800 text-purple-200 px-1.5 py-0.5 rounded font-mono">
                    ₹2,000 Bounty
                  </span>
                </Link>
              ) : evaluatorStatus === 'PENDING_ADMIN_VERIFICATION' ? (
                <button
                  onClick={() => setEvalModalOpen(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Evaluator: Verification Under Review</span>
                </button>
              ) : (
                <button
                  onClick={() => setEvalModalOpen(true)}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-800 border border-purple-200/80 transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
                >
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>Become an Evaluator</span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                    Earn Cash
                  </span>
                </button>
              )}

              <Link
                to="/jobs"
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              >
                Browse Jobs
              </Link>

              {/* Profile Dropdown in Top Navbar */}
              <div className="relative pl-2 border-l border-slate-200" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all cursor-pointer select-none ${
                    profileDropdownOpen
                      ? 'bg-slate-100 border-slate-300 shadow-sm ring-2 ring-blue-500/10'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                  aria-expanded={profileDropdownOpen}
                  aria-label="Profile menu"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 to-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {currentUser?.fullName?.charAt(0) || 'K'}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-slate-800 truncate max-w-[100px]">
                    {currentUser?.fullName || 'Karthik'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                <UserProfileDropdown
                  currentUser={currentUser}
                  isApprovedEvaluator={isApprovedEvaluator}
                  isOpen={profileDropdownOpen}
                  onClose={() => setProfileDropdownOpen(false)}
                  onOpenEvaluatorModal={() => setEvalModalOpen(true)}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Become an Evaluator Modal */}
      <BecomeEvaluatorModal
        isOpen={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        onApplicationUpdated={loadStatus}
        currentStatus={evaluatorStatus}
      />
    </div>
  );
};
