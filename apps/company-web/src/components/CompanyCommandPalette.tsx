import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Users2,
  Calendar,
  CreditCard,
  UserPlus,
  Sparkles,
  BarChart3,
  HelpCircle,
  X
} from 'lucide-react';

export const CompanyCommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  const actions = [
    {
      label: 'Create New Requirement',
      sub: 'Define role and trigger deterministic matching engine',
      path: '/company/requirements/new',
      icon: PlusCircle,
    },
    {
      label: 'Open Decision Shortlists',
      sub: 'Review top-N verified candidate rosters',
      path: '/company/shortlists',
      icon: Users2,
    },
    {
      label: 'Schedule Interview Round',
      sub: 'Book architecture or team fit interview',
      path: '/company/interviews/schedule',
      icon: Calendar,
    },
    {
      label: 'Browse Candidate Matching Pool',
      sub: 'Explore deterministic algorithm scores',
      path: '/company/matches',
      icon: Sparkles,
    },
    {
      label: 'View Invoices & Billing',
      sub: 'Inspect NET 30 placement statements and download PDFs',
      path: '/company/invoices',
      icon: CreditCard,
    },
    {
      label: 'Invite Team Member',
      sub: 'Add hiring managers or technical leads',
      path: '/company/team',
      icon: UserPlus,
    },
    {
      label: 'Hiring Analytics & Reports',
      sub: 'Inspect conversion funnels and placement trends',
      path: '/company/analytics',
      icon: BarChart3,
    },
    {
      label: 'Help & Support Desk',
      sub: 'Create enterprise service tickets',
      path: '/company/support',
      icon: HelpCircle,
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.sub.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to feature (or press Esc)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full p-3 rounded-xl hover:bg-slate-800/80 flex items-center gap-3 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.sub}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">No matching commands found.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navigate with mouse or enter</span>
          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
