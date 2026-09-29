import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LayoutGrid,
  HelpCircle,
  Moon,
  Award,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface UserProfileDropdownProps {
  currentUser: any;
  isApprovedEvaluator: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenEvaluatorModal: () => void;
  onLogout: () => void;
}

// Illustrated compact cartoon avatar matching the reference design
const UserAvatar: React.FC<{ name?: string }> = () => {
  return (
    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#E0F2FE] border border-sky-200/80 shadow-2xs flex items-center justify-center shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#E0F2FE" />
        <path d="M22,95 Q50,72 78,95 L78,100 L22,100 Z" fill="#1E293B" />
        <rect x="43" y="60" width="14" height="12" fill="#E0A97E" rx="3" />
        <circle cx="28" cy="46" r="4.5" fill="#F8C99D" />
        <circle cx="72" cy="46" r="4.5" fill="#F8C99D" />
        <ellipse cx="50" cy="45" rx="21" ry="22" fill="#F8C99D" />
        <path d="M26,42 Q30,20 50,20 Q70,20 74,42 Q66,30 50,30 Q34,30 26,42 Z" fill="#1E293B" />
        <path d="M28,34 Q38,30 45,36 Q50,28 65,32 Q71,34 72,40 Q65,26 50,24 Q35,26 28,34 Z" fill="#1E293B" />
        <circle cx="43" cy="45" r="2.4" fill="#1E293B" />
        <circle cx="57" cy="45" r="2.4" fill="#1E293B" />
        <path d="M46,54 Q50,58 54,54" fill="none" stroke="#B45309" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  currentUser,
  isApprovedEvaluator,
  isOpen,
  onClose,
  onOpenEvaluatorModal,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return (
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
      );
    } catch {
      return false;
    }
  });

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch {}
  };

  const handleHelpCenter = () => {
    onClose();
    navigate('/talent/evaluations');
  };

  if (!isOpen) return null;

  const displayName = currentUser?.fullName || currentUser?.firstName || 'Thamilarasan';
  const displayEmail = currentUser?.email || 'thamil@example.com';

  return (
    <div
      className="absolute right-0 top-full mt-1.5 w-64 sm:w-70 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-slate-800"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. User Header Section */}
      <Link
        to="/talent/profile"
        onClick={onClose}
        className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <UserAvatar name={displayName} />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight truncate">
                {displayName}
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-extrabold text-[9px] tracking-wider uppercase border border-blue-100/80">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">{displayEmail}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 ml-1" />
      </Link>

      {/* Divider */}
      <div className="border-t border-slate-100 my-1" />

      {/* 2. Menu Items */}
      <div className="space-y-0.5">
        {/* Profile */}
        <Link
          to="/talent/profile"
          onClick={onClose}
          className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-blue-50/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <User className="w-4 h-4 text-blue-950 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Profile</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-950 transition-colors" />
        </Link>

        {/* Dashboard */}
        <Link
          to="/talent/dashboard"
          onClick={onClose}
          className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-blue-50/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <LayoutGrid className="w-4 h-4 text-blue-950 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Dashboard</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-950 transition-colors" />
        </Link>

        {/* Help Center */}
        <button
          type="button"
          onClick={handleHelpCenter}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-blue-50/50 transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <HelpCircle className="w-4 h-4 text-blue-950 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Help Center</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-950 transition-colors" />
        </button>

        {/* Dark Mode with Toggle */}
        <div
          onClick={toggleDarkMode}
          className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <Moon className="w-4 h-4 text-blue-950 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Dark Mode</span>
          </div>

          {/* Interactive Compact Toggle Switch */}
          <div
            className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
              isDarkMode ? 'bg-blue-950 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        {/* Evaluator Hub (if Evaluator) OR Become Evaluator (if not Evaluator) */}
        {isApprovedEvaluator ? (
          <Link
            to="/evaluator/dashboard"
            onClick={onClose}
            className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-blue-50/70 bg-blue-50/30 border border-blue-100/70 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <Award className="w-4 h-4 text-blue-950 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-blue-950 block leading-tight">
                  Evaluator Hub
                </span>
                <span className="text-[9px] text-blue-800/80 font-semibold block">
                  Evaluator Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-950">
                Active
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-950 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenEvaluatorModal();
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-blue-50/50 transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <Award className="w-4 h-4 text-blue-950 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-slate-800">Become Evaluator</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-950 transition-colors" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-1" />

      {/* 3. Sign Out */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onLogout();
        }}
        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-rose-50/70 transition-colors group cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-50/90 text-blue-950 flex items-center justify-center shrink-0 group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">
          <LogOut className="w-4 h-4 text-blue-950 group-hover:text-rose-700 stroke-[2.2]" />
        </div>
        <span className="text-xs font-bold text-rose-600">Sign Out</span>
      </button>
    </div>
  );
};
