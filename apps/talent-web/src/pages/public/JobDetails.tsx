import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import {
  Home,
  ChevronRight,
  Bookmark,
  Share2,
  FileText,
  DollarSign,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
  Send,
  Sparkles,
  Globe,
  Database,
  Coffee,
  Leaf,
  Layers,
  Code2,
  Cpu,
  Server,
  Cloud,
  Box,
} from 'lucide-react';

// Tech skill badge with contextual icons matching screenshot style
const SkillBadge: React.FC<{ skill: any }> = ({ skill }) => {
  const name = typeof skill === 'string' ? skill : skill?.name || skill?.label || String(skill || '');
  const lower = name.toLowerCase();

  let Icon = Code2;
  let iconColor = 'text-blue-600';
  let bgColor = 'bg-blue-50';

  if (lower.includes('java') && !lower.includes('script')) {
    Icon = Coffee;
    iconColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
  } else if (lower.includes('spring')) {
    Icon = Leaf;
    iconColor = 'text-emerald-600';
    bgColor = 'bg-emerald-50';
  } else if (lower.includes('postgres') || lower.includes('sql') || lower.includes('mongo') || lower.includes('database')) {
    Icon = Database;
    iconColor = 'text-sky-600';
    bgColor = 'bg-sky-50';
  } else if (lower.includes('react') || lower.includes('vue') || lower.includes('frontend')) {
    Icon = Layers;
    iconColor = 'text-cyan-600';
    bgColor = 'bg-cyan-50';
  } else if (lower.includes('node') || lower.includes('express') || lower.includes('backend')) {
    Icon = Server;
    iconColor = 'text-emerald-600';
    bgColor = 'bg-emerald-50';
  } else if (lower.includes('aws') || lower.includes('cloud') || lower.includes('gcp') || lower.includes('azure')) {
    Icon = Cloud;
    iconColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
  } else if (lower.includes('docker') || lower.includes('kubernetes')) {
    Icon = Box;
    iconColor = 'text-blue-600';
    bgColor = 'bg-blue-50';
  }

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-100/80 transition-colors">
      <span className={`w-6 h-6 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </span>
      <span>{name}</span>
    </div>
  );
};

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<HiringRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [passCheck, setPassCheck] = useState<{
    hasValidPass: boolean;
    alreadyApplied?: boolean;
    application?: any;
    matchingPass: any;
    recommendedStack: any;
  } | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      const u = stored ? JSON.parse(stored) : null;
      return u?.candidateId || u?.id || 'cand-1';
    } catch {
      return 'cand-1';
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (id) {
      // Check saved state
      try {
        const saved = localStorage.getItem('talent_saved_jobs');
        if (saved) {
          const map = JSON.parse(saved);
          setIsSaved(!!map[id]);
        }
      } catch {}

      const cid = getCandidateId();
      Promise.all([
        api.getRequirement(id),
        api.checkJobStackPass(id, cid),
      ]).then(([jobRes, passRes]) => {
        if (jobRes.success && jobRes.data) {
          setJob(jobRes.data);
        }
        if (passRes.success && passRes.data) {
          setPassCheck(passRes.data);
          if (passRes.data.alreadyApplied) {
            setApplied(true);
          }
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleApply = async () => {
    if (!id || applied) return;
    setApplying(true);
    try {
      const cid = getCandidateId();
      const res = await api.applyJobWithStackPass(id, cid);
      if (res.success) {
        setApplied(true);
        showToast(res.alreadyApplied ? 'Already applied for this role!' : '1-Click Application submitted successfully!');
      } else {
        alert(res.error || 'Failed to submit application');
      }
    } catch (err: any) {
      alert('Error applying: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  const toggleBookmark = () => {
    if (!id) return;
    try {
      const saved = localStorage.getItem('talent_saved_jobs');
      const map = saved ? JSON.parse(saved) : {};
      const nextState = !map[id];
      map[id] = nextState;
      localStorage.setItem('talent_saved_jobs', JSON.stringify(map));
      setIsSaved(nextState);
      showToast(nextState ? 'Job saved to your bookmarks' : 'Job removed from bookmarks');
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast('Job link copied to clipboard!');
    } catch {
      showToast('Sharing not supported on this browser');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading opportunity specifications...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-slate-700">Requirement not found.</p>
        <Link to="/jobs" className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:underline">
          ← Back to all verified roles
        </Link>
      </div>
    );
  }

  const roleCategory = job.roleCategory || 'Engineering';

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-slate-800 transition-colors flex items-center">
            <Home className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">
            Jobs
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <Link to={`/jobs?category=${encodeURIComponent(roleCategory)}`} className="hover:text-blue-600 transition-colors">
            {roleCategory}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
            {job.title}
          </span>
        </nav>

        {/* 2-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================
              LEFT COLUMN: Main Role Details Card (8 Cols)
             ======================================================== */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Top Row: Sourcing Status Badge + Action Buttons (Bookmark & Share) */}
            <div className="flex items-center justify-between gap-4">
              {/* Status Pill with Blue Dot */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>{job.state || 'SOURCING'}</span>
              </div>

              {/* Bookmark & Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleBookmark}
                  title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isSaved
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {job.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {roleCategory} • Openings: {job.openingsCount}
              </p>
            </div>

            <div className="border-t border-slate-100" />

            {/* Section 1: Role Overview */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Role Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {job.jobDescription ||
                  `Key opportunity for ${job.title} to deliver mission-critical software capabilities with modern tech stacks and global product autonomy.`}
              </p>
            </div>

            {/* Section 2: Mandatory Technical Stack */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Mandatory Technical Stack</h3>
              <div className="flex flex-wrap gap-2.5">
                {(job.requiredSkills || []).map((sk: any, idx: number) => (
                  <SkillBadge key={idx} skill={sk} />
                ))}
              </div>
            </div>

            {/* Section 3: Evaluation Benchmarks */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Evaluation Benchmarks</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Asynchronous performance, event loop execution, and memory optimization</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Distributed database partitioning and high-concurrency consistency</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Clean architectural trade-off articulation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Hiring Summary + 1-Click Apply + Impact (4 Cols)
             ======================================================== */}
          <div className="lg:col-span-4 space-y-4">
            {/* Card 1: Hiring Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              {/* Header: Document Icon + Title + Subtitle */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Hiring Summary</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Key details about this opportunity</p>
                </div>
              </div>

              {/* 4 Details Rows */}
              <div className="space-y-2.5">
                {/* 1. Annual Budget */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      ANNUAL BUDGET
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block tracking-tight">
                      {formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)}
                    </span>
                  </div>
                </div>

                {/* 2. Min Experience */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      MIN EXPERIENCE
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block tracking-tight">
                      {job.minExperienceYears} Years Required
                    </span>
                  </div>
                </div>

                {/* 3. Max Notice Period */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      MAX NOTICE PERIOD
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block tracking-tight">
                      {job.maxNoticePeriodDays} Days
                    </span>
                  </div>
                </div>

                {/* 4. Timezone Overlap */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      TIMEZONE OVERLAP
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block tracking-tight">
                      {job.timezoneRequirement || '4 hours overlap with EST/GMT'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1-Click Apply CTA Button */}
            {applied ? (
              <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Applied</span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                  In Review
                </span>
              </div>
            ) : passCheck?.hasValidPass ? (
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99] disabled:opacity-75"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 -rotate-45" />
                  <span>
                    {applying
                      ? 'Submitting...'
                      : `1-Click Apply (${passCheck.matchingPass?.stackTitle || 'MERN Stack Engineering'})`}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" />
              </button>
            ) : (
              <Link to="/talent/stack-passes" className="block w-full">
                <button
                  type="button"
                  className="w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Get 5-Day Stack Pass to Apply</span>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              </Link>
            )}

            {/* Card 2: Build Global Impact with Decorative World Map Graphic */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1 relative z-10 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900">Build global impact</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Work on mission-critical systems with a modern stack and global teams.
                </p>
              </div>

              {/* Decorative Subtle World Map Silhouette SVG */}
              <div className="absolute right-0 top-0 bottom-0 w-36 pointer-events-none opacity-20 flex items-center justify-center">
                <svg viewBox="0 0 200 120" className="w-full h-full fill-blue-600">
                  <path d="M20,30 Q25,20 40,25 Q50,30 45,45 Q40,60 30,55 Q20,50 20,30 Z" />
                  <path d="M50,65 Q60,60 65,75 Q60,95 45,90 Q40,80 50,65 Z" />
                  <path d="M90,25 Q110,20 120,35 Q130,50 115,55 Q100,50 90,40 Z" />
                  <path d="M100,60 Q115,60 120,75 Q115,90 100,85 Q95,75 100,60 Z" />
                  <path d="M140,25 Q170,20 180,40 Q175,60 150,55 Q140,40 140,25 Z" />
                  <path d="M150,70 Q175,70 170,90 Q150,95 145,80 Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
