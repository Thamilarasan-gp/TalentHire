import React from 'react';
import { ExternalLink, Shield, Building2, UserCheck, Briefcase } from 'lucide-react';

export const PortalSwitcher: React.FC = () => {
  const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  const talentUrl = isProd ? 'https://talenthire-green.vercel.app' : 'http://localhost:3000';
  const companyUrl = isProd ? 'https://talenthirec.vercel.app/company' : 'http://localhost:3002';
  const adminUrl = isProd ? 'https://talenthire-admin.vercel.app' : 'http://localhost:3001';

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white tracking-tight">INAYON</span>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="text-slate-400 hidden sm:inline text-[11px]">Find. Evaluate. Hire.</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-500 hidden md:inline">Quick Portal Switcher:</span>
        <a
          href={talentUrl}
          className="flex items-center gap-1 hover:text-white transition-colors text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800"
        >
          <UserCheck className="w-3 h-3 text-blue-400" />
          Talent & Public
        </a>
        <a
          href={companyUrl}
          className="flex items-center gap-1 hover:text-white transition-colors text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800"
        >
          <Building2 className="w-3 h-3 text-cyan-400" />
          Company Portal
        </a>
        <a
          href={adminUrl}
          className="flex items-center gap-1 hover:text-white transition-colors text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800"
        >
          <Shield className="w-3 h-3 text-purple-400" />
          Admin Command Center
        </a>
      </div>
    </div>
  );
};
