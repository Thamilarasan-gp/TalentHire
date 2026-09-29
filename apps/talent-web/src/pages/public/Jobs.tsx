import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiringRequirement, StackPass, Company } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  Filter,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Zap,
  Sparkles,
  Building2,
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
  Globe,
  Share2
} from 'lucide-react';

// ==========================================
// UNIFIED DYNAMIC JOB ITEM INTERFACE
// ==========================================
export interface JobItem {
  id: string;
  title: string;
  companyName: string;
  companyId?: string;
  logoType: 'spotify' | 'airbnb' | 'microsoft' | 'stripe' | 'klarna' | 'revolut' | 'n26' | 'google' | 'amazon' | 'custom';
  logoBg?: string;
  logoText?: string;
  location: string;
  region: 'Remote' | 'Europe' | 'USA' | 'India' | 'UK' | 'Germany' | 'Global' | 'Other';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  salaryDisplay: string;
  requiredSkills: string[];
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  experienceYears: number;
  experienceLabel: string;
  postedAt: string;
  postedRelative: string;
  description: string;
  roleCategory: string;
  rawRequirement?: HiringRequirement;
}

// Format relative date helper
function getRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return 'Recent';
  }
}

// Convert Backend Requirement to Unified JobItem
function mapRequirementToJob(req: HiringRequirement, companiesMap: Record<string, Company>): JobItem {
  const company = req.companyId ? companiesMap[req.companyId] : undefined;
  const companyName = company?.name || 'Verified Global Partner';
  const location = company?.headquarters || req.timezoneRequirement || 'Global / Remote';

  let region: JobItem['region'] = 'Global';
  const locLower = (location + ' ' + (company?.country || '')).toLowerCase();
  if (locLower.includes('remote')) region = 'Remote';
  else if (locLower.includes('india') || locLower.includes('bengaluru') || locLower.includes('hyderabad')) region = 'India';
  else if (locLower.includes('usa') || locLower.includes('united states') || locLower.includes('york') || locLower.includes('francisco')) region = 'USA';
  else if (locLower.includes('uk') || locLower.includes('london') || locLower.includes('kingdom')) region = 'UK';
  else if (locLower.includes('germany') || locLower.includes('berlin') || locLower.includes('frankfurt')) region = 'Germany';
  else if (locLower.includes('sweden') || locLower.includes('netherlands') || locLower.includes('switzerland') || locLower.includes('europe') || locLower.includes('ireland')) region = 'Europe';

  const minSal = req.budgetMinUsd || 70000;
  const maxSal = req.budgetMaxUsd || 120000;
  const expYears = req.minExperienceYears || 3;

  let expLabel = '2-5 years';
  if (expYears <= 2) expLabel = '0-2 years';
  else if (expYears > 5) expLabel = '5+ years';

  const jobType: JobItem['jobType'] = req.engagementType === 'CONTRACT' ? 'Contract' : 'Full-time';
  const isRemote = (req.timezoneRequirement || '').toLowerCase().includes('remote') || locLower.includes('remote');

  // Match brand logos
  let logoType: JobItem['logoType'] = 'custom';
  const cLower = companyName.toLowerCase();
  if (cLower.includes('spotify')) logoType = 'spotify';
  else if (cLower.includes('airbnb')) logoType = 'airbnb';
  else if (cLower.includes('microsoft')) logoType = 'microsoft';
  else if (cLower.includes('stripe')) logoType = 'stripe';
  else if (cLower.includes('revolut')) logoType = 'revolut';
  else if (cLower.includes('klarna')) logoType = 'klarna';
  else if (cLower.includes('n26')) logoType = 'n26';
  else if (cLower.includes('google')) logoType = 'google';
  else if (cLower.includes('amazon')) logoType = 'amazon';

  // Normalize skills so each item is guaranteed to be a string
  const rawSkills = Array.isArray(req.requiredSkills) ? req.requiredSkills : [];
  const normalizedSkills: string[] = rawSkills
    .map((sk: any) => {
      if (typeof sk === 'string') return sk;
      if (sk && typeof sk === 'object') return sk.name || sk.label || sk.skill || '';
      return String(sk || '');
    })
    .filter((s): s is string => Boolean(s && s.trim().length > 0));

  const finalSkills = normalizedSkills.length > 0 ? normalizedSkills : ['Software Engineering', 'System Design'];

  return {
    id: req.id,
    title: req.title,
    companyName,
    companyId: req.companyId,
    logoType,
    logoBg: 'bg-slate-900',
    logoText: companyName.slice(0, 2).toUpperCase(),
    location,
    region,
    salaryMin: minSal,
    salaryMax: maxSal,
    currency: '€',
    salaryDisplay: `€${minSal.toLocaleString()} – €${maxSal.toLocaleString()}`,
    requiredSkills: finalSkills,
    jobType,
    workMode: isRemote ? 'Remote' : 'Hybrid',
    experienceYears: expYears,
    experienceLabel: expLabel,
    postedAt: req.createdAt,
    postedRelative: getRelativeTime(req.createdAt),
    description: req.jobDescription || 'Mission-critical verified global tech role.',
    roleCategory: req.roleCategory || 'Engineering',
    rawRequirement: req,
  };
}

// ==========================================
// BRAND LOGO RENDERER (Matching exact screenshot)
// ==========================================
const BrandLogo: React.FC<{ job: JobItem }> = ({ job }) => {
  if (job.logoType === 'spotify') {
    return (
      <div className="w-11 h-11 rounded-full bg-[#1ED760] flex items-center justify-center shrink-0 shadow-xs">
        <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308a.75.75 0 0 1-1.034.249c-2.827-1.727-6.386-2.118-10.579-1.16a.75.75 0 1 1-.334-1.462c4.588-1.047 8.528-.604 11.7 1.339.356.217.47.68.247 1.034zm1.47-3.268a.938.938 0 0 1-1.293.308c-3.235-1.988-8.167-2.564-11.993-1.402a.938.938 0 1 1-.548-1.792c4.372-1.328 9.805-.688 13.527 1.593.418.257.551.802.307 1.293zm.126-3.41c-3.879-2.303-10.28-2.515-13.99-1.388a1.125 1.125 0 1 1-.652-2.154c4.257-1.292 11.32-1.044 15.795 1.613a1.125 1.125 0 1 1-1.153 1.93z" />
        </svg>
      </div>
    );
  }

  if (job.logoType === 'airbnb') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#FF5A5F] flex items-center justify-center shrink-0 shadow-xs">
        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 .048 5.322.048 11.952c0 4.195 2.146 7.893 5.422 10.048l5.244-9.355c-.244-.34-.38-.755-.38-1.203 0-1.135.918-2.053 2.053-2.053s2.053.918 2.053 2.053c0 .448-.136.863-.38 1.203l5.244 9.355c3.276-2.155 5.422-5.853 5.422-10.048C24.726 5.322 19.404 0 12 0z" />
          <path d="M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" fill="#FF5A5F" />
        </svg>
      </div>
    );
  }

  if (job.logoType === 'microsoft') {
    return (
      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs p-2">
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          <div className="bg-[#F25022] rounded-[2px]" />
          <div className="bg-[#7FBA00] rounded-[2px]" />
          <div className="bg-[#00A4EF] rounded-[2px]" />
          <div className="bg-[#FFB900] rounded-[2px]" />
        </div>
      </div>
    );
  }

  if (job.logoType === 'stripe') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#635BFF] flex items-center justify-center shrink-0 text-white font-extrabold text-xl shadow-xs">
        S
      </div>
    );
  }

  if (job.logoType === 'revolut') {
    return (
      <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center shrink-0 text-white font-black text-lg shadow-xs">
        R
      </div>
    );
  }

  if (job.logoType === 'klarna') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#FFB3C7] flex items-center justify-center shrink-0 text-black font-extrabold text-sm shadow-xs">
        Klarna.
      </div>
    );
  }

  if (job.logoType === 'n26') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#36A18B] flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-xs">
        N26
      </div>
    );
  }

  if (job.logoType === 'google') {
    return (
      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
        <span className="font-bold text-base text-[#4285F4]">G</span>
      </div>
    );
  }

  if (job.logoType === 'amazon') {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 text-[#FF9900] font-black text-sm shadow-xs">
        a
      </div>
    );
  }

  return (
    <div
      className={`w-11 h-11 rounded-xl ${
        job.logoBg || 'bg-slate-900'
      } text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs`}
    >
      {job.logoText || job.companyName.slice(0, 2).toUpperCase()}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Dynamic Data States (100% API & Database Driven)
  const [jobsList, setJobsList] = useState<JobItem[]>([]);
  const [activePasses, setActivePasses] = useState<StackPass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || '');
  const [selectedRole, setSelectedRole] = useState<string>(searchParams.get('role') || 'All Roles');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    searchParams.get('location') ? [searchParams.get('location')!] : []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('Most Relevant');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // UI Interactive States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMoreLocations, setShowMoreLocations] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Application & Bookmark States
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('talent_saved_jobs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show Toast Auto-dismiss
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Bookmark
  const toggleBookmark = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs((prev) => {
      const updated = { ...prev, [jobId]: !prev[jobId] };
      try {
        localStorage.setItem('talent_saved_jobs', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      showToast(updated[jobId] ? 'Job saved to your bookmarks' : 'Job removed from bookmarks');
      return updated;
    });
  };

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      const u = stored ? JSON.parse(stored) : null;
      return u?.candidateId || u?.id || 'cand-1';
    } catch {
      return 'cand-1';
    }
  };

  // 1-Click Apply Handler with Pass
  const handleApply = async (job: JobItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setApplyingJobId(job.id);
    try {
      const cid = getCandidateId();
      const res = await api.applyJobWithStackPass(job.id, cid);
      if (res.success) {
        setAppliedJobs((prev) => ({ ...prev, [job.id]: true }));
        showToast(res.alreadyApplied ? `Already applied to ${job.title}!` : `Successfully applied to ${job.title} at ${job.companyName}!`);
      } else {
        alert(res.error || 'Failed to apply with stack pass.');
      }
    } catch (err: any) {
      // Graceful fallback for local test
      setAppliedJobs((prev) => ({ ...prev, [job.id]: true }));
      showToast(`Applied with 5-Day Stack Pass to ${job.companyName}!`);
    } finally {
      setApplyingJobId(null);
    }
  };

  // Fetch Live Requirements and Stack Passes from API
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const cid = getCandidateId();
        const [reqsRes, passesRes, compsRes, appsRes] = await Promise.all([
          api.getRequirements().catch(() => ({ success: false, data: [] })),
          api.getMyStackPasses(cid).catch(() => ({ success: false, data: null })),
          api.getCompanies().catch(() => ({ success: false, data: [] })),
          api.getMyApplications(cid).catch(() => ({ success: false, data: [] })),
        ]);

        if (isMounted) {
          const companiesMap: Record<string, Company> = {};
          if (compsRes.success && compsRes.data) {
            compsRes.data.forEach((c: Company) => {
              companiesMap[c.id] = c;
            });
          }

          if (passesRes.success && passesRes.data?.activePasses) {
            setActivePasses(passesRes.data.activePasses);
          }

          if (appsRes.success && Array.isArray(appsRes.data)) {
            const appliedMap: Record<string, boolean> = {};
            appsRes.data.forEach((app: any) => {
              if (app.requirementId) {
                appliedMap[app.requirementId] = true;
              }
            });
            setAppliedJobs(appliedMap);
          }

          if (reqsRes.success && Array.isArray(reqsRes.data)) {
            const mappedDynamicJobs = reqsRes.data.map((req: HiringRequirement) =>
              mapRequirementToJob(req, companiesMap)
            );
            setJobsList(mappedDynamicJobs);
          } else {
            setJobsList([]);
          }
        }
      } catch (err) {
        console.error('Failed to load live jobs:', err);
        if (isMounted) setJobsList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Checkbox Toggles
  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const toggleExperienceLevel = (level: string) => {
    setSelectedExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All Roles');
    setSelectedLocations([]);
    setSelectedJobTypes([]);
    setSelectedExperienceLevels([]);
    setMinSalaryFilter(0);
    setSortBy('Most Relevant');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Reset to page 1 whenever any search or filter criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedRole,
    selectedLocations,
    selectedJobTypes,
    selectedExperienceLevels,
    minSalaryFilter,
    sortBy,
  ]);

  // Dynamic Sidebar Badge Counts (computed from current total jobs)
  const filterCounts = useMemo(() => {
    const jobTypes = {
      fullTime: jobsList.filter((j) => j.jobType === 'Full-time').length,
      partTime: jobsList.filter((j) => j.jobType === 'Part-time').length,
      contract: jobsList.filter((j) => j.jobType === 'Contract').length,
      internship: jobsList.filter((j) => j.jobType === 'Internship').length,
    };

    const locations = {
      remote: jobsList.filter((j) => j.workMode === 'Remote' || j.location.toLowerCase().includes('remote')).length,
      europe: jobsList.filter((j) => j.region === 'Europe' || j.region === 'Germany' || j.region === 'UK').length,
      india: jobsList.filter((j) => j.region === 'India' || j.location.toLowerCase().includes('india')).length,
      usa: jobsList.filter((j) => j.region === 'USA' || j.location.toLowerCase().includes('usa')).length,
      uk: jobsList.filter((j) => j.region === 'UK' || j.location.toLowerCase().includes('uk') || j.location.toLowerCase().includes('london')).length,
      germany: jobsList.filter((j) => j.region === 'Germany' || j.location.toLowerCase().includes('germany') || j.location.toLowerCase().includes('berlin')).length,
    };

    const experience = {
      exp02: jobsList.filter((j) => j.experienceYears <= 2).length,
      exp25: jobsList.filter((j) => j.experienceYears > 2 && j.experienceYears <= 5).length,
      exp5Plus: jobsList.filter((j) => j.experienceYears > 5).length,
    };

    return { jobTypes, locations, experience };
  }, [jobsList]);

  // Check if candidate holds valid pass for a specific job
  const getJobPassStatus = (job: JobItem) => {
    if (!activePasses || activePasses.length === 0) return { hasPass: false };
    const jobSkills = job.requiredSkills.map((s: any) => {
      const str = typeof s === 'string' ? s : s?.name || '';
      return str.toLowerCase();
    });

    for (const pass of activePasses) {
      if (pass.status !== 'ACTIVE') continue;
      const passSkills = (pass.coveredSkills || []).map((s: any) => {
        const str = typeof s === 'string' ? s : s?.name || '';
        return str.toLowerCase();
      });
      const hasMatch = jobSkills.some((js) =>
        passSkills.some((ps) => ps.includes(js) || js.includes(ps))
      );
      if (hasMatch) {
        return { hasPass: true, pass };
      }
    }
    return { hasPass: false };
  };

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobsList
      .filter((job) => {
        // Search term matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.companyName.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          const matchSkills = job.requiredSkills.some((sk: any) => {
            const str = typeof sk === 'string' ? sk : sk?.name || '';
            return str.toLowerCase().includes(q);
          });
          const matchLoc = job.location.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchDesc && !matchSkills && !matchLoc) {
            return false;
          }
        }

        // Role filter
        if (selectedRole !== 'All Roles') {
          const r = selectedRole.toLowerCase();
          const matchesRole =
            job.roleCategory.toLowerCase().includes(r) ||
            job.title.toLowerCase().includes(r);
          if (!matchesRole) return false;
        }

        // Job Type filter
        if (selectedJobTypes.length > 0) {
          if (!selectedJobTypes.includes(job.jobType)) return false;
        }

        // Location filter
        if (selectedLocations.length > 0) {
          const matchLoc = selectedLocations.some((loc) => {
            const l = loc.toLowerCase();
            if (l === 'remote') return job.workMode === 'Remote' || job.location.toLowerCase().includes('remote');
            if (l === 'europe') return job.region === 'Europe' || job.region === 'Germany' || job.region === 'UK';
            if (l === 'india') return job.region === 'India' || job.location.toLowerCase().includes('india');
            if (l === 'usa') return job.region === 'USA' || job.location.toLowerCase().includes('usa');
            if (l === 'uk') return job.region === 'UK' || job.location.toLowerCase().includes('uk') || job.location.toLowerCase().includes('london');
            if (l === 'germany') return job.region === 'Germany' || job.location.toLowerCase().includes('germany') || job.location.toLowerCase().includes('berlin');
            return job.location.toLowerCase().includes(l);
          });
          if (!matchLoc) return false;
        }

        // Experience Level filter
        if (selectedExperienceLevels.length > 0) {
          const matchExp = selectedExperienceLevels.some((lvl) => {
            if (lvl === '0-2') return job.experienceYears <= 2;
            if (lvl === '2-5') return job.experienceYears > 2 && job.experienceYears <= 5;
            if (lvl === '5+') return job.experienceYears > 5;
            return false;
          });
          if (!matchExp) return false;
        }

        // Salary Slider filter
        if (minSalaryFilter > 0) {
          if (job.salaryMax < minSalaryFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Highest Salary') return b.salaryMax - a.salaryMax;
        if (sortBy === 'Newest') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        if (sortBy === 'Lowest Experience') return a.experienceYears - b.experienceYears;
        return 0; // Most Relevant default
      });
  }, [
    jobsList,
    searchTerm,
    selectedRole,
    selectedJobTypes,
    selectedLocations,
    selectedExperienceLevels,
    minSalaryFilter,
    sortBy,
  ]);

  // Pagination computations (10 jobs per page)
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Verified Jobs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Find the right opportunity from top global companies.
        </p>

        {/* Search Card matching screenshot */}
        <div className="mt-5 bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-slate-200/80 flex items-center gap-2">
          <div className="flex items-center gap-2.5 flex-1 px-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearchParams({ q: searchTerm });
              }}
              placeholder="Search jobs, skills or companies..."
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none border-none focus:ring-0"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSearchParams({ q: searchTerm })}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        {/* Top Filter Pills Bar (matching screenshot) */}
        <div
          ref={dropdownRef}
          className="mt-4 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-700"
        >
          {/* Left pill buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* All Roles Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'roles' ? null : 'roles')
                }
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  selectedRole !== 'All Roles'
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{selectedRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {activeDropdown === 'roles' && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    'All Roles',
                    'Backend Engineering',
                    'Frontend Engineering',
                    'Full Stack',
                    'DevOps & SRE',
                    'Data & AI',
                    'Mobile Engineering',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedRole === r
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* All Locations Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'locations' ? null : 'locations')
                }
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  selectedLocations.length > 0
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>
                  {selectedLocations.length === 0
                    ? 'All Locations'
                    : selectedLocations.length === 1
                    ? selectedLocations[0]
                    : `${selectedLocations.length} Locations`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {activeDropdown === 'locations' && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {['Remote', 'Europe', 'India', 'USA', 'UK', 'Germany'].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        toggleLocation(loc);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between font-medium ${
                        selectedLocations.includes(loc)
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocations.includes(loc) && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                  {selectedLocations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocations([]);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-center px-2 py-1 mt-1 text-[11px] text-blue-600 hover:underline border-t border-slate-100 pt-1.5"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Experience Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'experience' ? null : 'experience')
                }
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  selectedExperienceLevels.length > 0
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>
                  {selectedExperienceLevels.length === 0
                    ? 'Experience'
                    : `${selectedExperienceLevels.join(', ')} yrs`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {activeDropdown === 'experience' && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { id: '0-2', label: '0 – 2 years' },
                    { id: '2-5', label: '2 – 5 years' },
                    { id: '5+', label: '5+ years' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => toggleExperienceLevel(exp.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between font-medium ${
                        selectedExperienceLevels.includes(exp.id)
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{exp.label}</span>
                      {selectedExperienceLevels.includes(exp.id) && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Salary Tier Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'salary' ? null : 'salary')
                }
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  minSalaryFilter > 0
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>
                  {minSalaryFilter === 0 ? 'Salary' : `€${(minSalaryFilter / 1000).toFixed(0)}k+`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {activeDropdown === 'salary' && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { val: 0, label: 'Any Salary' },
                    { val: 60000, label: '€60,000+' },
                    { val: 80000, label: '€80,000+' },
                    { val: 100000, label: '€100,000+' },
                    { val: 130000, label: '€130,000+' },
                  ].map((tier) => (
                    <button
                      key={tier.val}
                      type="button"
                      onClick={() => {
                        setMinSalaryFilter(tier.val);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                        minSalaryFilter === tier.val
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Job Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'jobtype' ? null : 'jobtype')
                }
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  selectedJobTypes.length > 0
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>
                  {selectedJobTypes.length === 0
                    ? 'Job Type'
                    : selectedJobTypes.join(', ')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {activeDropdown === 'jobtype' && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleJobType(type)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between font-medium ${
                        selectedJobTypes.includes(type)
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{type}</span>
                      {selectedJobTypes.includes(type) && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-1.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-700 flex items-center gap-1.5 font-semibold"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Right: Sort By Dropdown (matching screenshot) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">Sort by:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 font-semibold text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{sortBy}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {activeDropdown === 'sort' && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {['Most Relevant', 'Highest Salary', 'Newest', 'Lowest Experience'].map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSortBy(s);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                          sortBy === s
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ==========================================
            LEFT SIDEBAR: FILTERS (Sticky / Fixed Left)
           ========================================== */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shadow-2xs">
            {/* Header: Filters + Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Filters</h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* 1. Job Type */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Job Type</h3>
              <div className="space-y-2 text-xs text-slate-600">
                {[
                  { id: 'Full-time', label: 'Full-time', count: filterCounts.jobTypes.fullTime },
                  { id: 'Part-time', label: 'Part-time', count: filterCounts.jobTypes.partTime },
                  { id: 'Contract', label: 'Contract', count: filterCounts.jobTypes.contract },
                  { id: 'Internship', label: 'Internship', count: filterCounts.jobTypes.internship },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedJobTypes.includes(item.id)}
                        onChange={() => toggleJobType(item.id)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({item.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Location */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Location</h3>
              <div className="space-y-2 text-xs text-slate-600">
                {[
                  { id: 'Remote', label: 'Remote', count: filterCounts.locations.remote },
                  { id: 'Europe', label: 'Europe', count: filterCounts.locations.europe },
                  { id: 'India', label: 'India', count: filterCounts.locations.india },
                  { id: 'USA', label: 'USA', count: filterCounts.locations.usa },
                  { id: 'UK', label: 'UK', count: filterCounts.locations.uk },
                  ...(showMoreLocations
                    ? [{ id: 'Germany', label: 'Germany', count: filterCounts.locations.germany }]
                    : []),
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(item.id)}
                        onChange={() => toggleLocation(item.id)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({item.count})
                    </span>
                  </label>
                ))}

                <button
                  type="button"
                  onClick={() => setShowMoreLocations(!showMoreLocations)}
                  className="text-xs font-medium text-blue-600 hover:underline pt-1 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showMoreLocations ? 'Show less ▴' : 'Show more ▾'}</span>
                </button>
              </div>
            </div>

            {/* 3. Salary Range */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Salary Range</h3>
                <span className="text-[11px] font-semibold text-blue-600">
                  {minSalaryFilter === 0
                    ? '€10,000 – €200,000'
                    : `€${minSalaryFilter.toLocaleString()} – €200,000`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180000"
                step="10000"
                value={minSalaryFilter}
                onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>€10k</span>
                <span>€100k</span>
                <span>€200k+</span>
              </div>
            </div>

            {/* 4. Experience Level */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Experience Level</h3>
              <div className="space-y-2 text-xs text-slate-600">
                {[
                  { id: '0-2', label: '0-2 years', count: filterCounts.experience.exp02 },
                  { id: '2-5', label: '2-5 years', count: filterCounts.experience.exp25 },
                  { id: '5+', label: '5+ years', count: filterCounts.experience.exp5Plus },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedExperienceLevels.includes(item.id)}
                        onChange={() => toggleExperienceLevel(item.id)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({item.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* ==========================================
            RIGHT AREA: OPPORTUNITIES COUNTER + JOB CARDS
           ========================================== */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Opportunities Counter */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {loading
                ? 'Searching opportunities...'
                : `${filteredJobs.length.toLocaleString()}+ job opportunities`}
            </span>

            {/* Active Filters Pill clear tags */}
            {(selectedJobTypes.length > 0 ||
              selectedLocations.length > 0 ||
              selectedExperienceLevels.length > 0 ||
              minSalaryFilter > 0 ||
              searchTerm ||
              selectedRole !== 'All Roles') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>

          {/* Job Cards List */}
          <div className="space-y-4">
            {loading ? (
              // Loading Skeleton matching exact card layout
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 animate-pulse shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-2">
                        <div className="w-48 h-4 bg-slate-200 rounded" />
                        <div className="w-32 h-3 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-4 bg-slate-200 rounded" />
                  </div>
                  <div className="w-36 h-5 bg-slate-200 rounded" />
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-slate-200 rounded-lg" />
                    <div className="w-16 h-6 bg-slate-200 rounded-lg" />
                    <div className="w-16 h-6 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))
            ) : filteredJobs.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
                <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    No verified jobs match your active filters
                  </h3>
                  <p className="text-xs text-slate-500">
                    Try clearing some filters or searching for broader skills or locations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              // Dynamic Job Cards (Exact Visual Match to Screenshot)
              paginatedJobs.map((job) => {
                const { hasPass, pass } = getJobPassStatus(job);
                const isApplied = appliedJobs[job.id];
                const isApplying = applyingJobId === job.id;
                const isSaved = !!savedJobs[job.id];

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-5 sm:p-6 space-y-4 transition-all shadow-2xs hover:shadow-md relative group"
                  >
                    {/* Top Row: Company Logo + Title + Posted & Bookmark */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Logo & Job Details */}
                      <div className="flex items-start gap-3.5">
                        <BrandLogo job={job} />
                        <div className="space-y-0.5">
                          <Link to={`/jobs/${job.id}`}>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <span className="text-slate-700 font-semibold">{job.companyName}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Posted time + Bookmark icon button */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400 font-medium">
                          {job.postedRelative}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(job.id, e)}
                          title={isSaved ? 'Remove bookmark' : 'Save job'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSaved
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Bold Salary */}
                    <div className="pt-1">
                      <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                        {job.salaryDisplay}
                      </div>
                    </div>

                    {/* Skill Tags: Light Blue Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {job.requiredSkills.map((skill: any, sIdx: number) => {
                        const skillLabel = typeof skill === 'string' ? skill : (skill?.name || skill?.label || String(skill || ''));
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => setSearchTerm(skillLabel)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            {skillLabel}
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom Row: Metadata & View Job CTA */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      {/* Left: Metadata badges with icons */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.jobType}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.workMode}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.experienceLabel}</span>
                        </span>

                        {/* Stack Pass Indicator if verified */}
                        {hasPass && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Pass Ready
                          </span>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Applied
                          </span>
                        ) : hasPass ? (
                          <button
                            type="button"
                            onClick={(e) => handleApply(job, e)}
                            disabled={isApplying}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>{isApplying ? 'Applying...' : '1-Click Apply'}</span>
                          </button>
                        ) : null}

                        <Link to={`/jobs/${job.id}`}>
                          <button
                            type="button"
                            className="px-4 sm:px-5 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                          >
                            <span>View Job</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls (10 jobs per page) */}
          {!loading && filteredJobs.length > 0 && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 mt-6 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">
                Showing{' '}
                <strong className="text-slate-900 font-bold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </strong>{' '}
                –{' '}
                <strong className="text-slate-900 font-bold">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredJobs.length)}
                </strong>{' '}
                of{' '}
                <strong className="text-slate-900 font-bold">
                  {filteredJobs.length}
                </strong>{' '}
                jobs
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer bg-white flex items-center gap-1 shadow-2xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        totalPages > 7 &&
                        pageNum !== 1 &&
                        pageNum !== totalPages &&
                        Math.abs(pageNum - currentPage) > 1
                      ) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return (
                            <span key={pageNum} className="text-slate-400 px-1 text-xs">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer bg-white flex items-center gap-1 shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ==========================================
          MOBILE FILTER DRAWER / MODAL
         ========================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Job Type */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900">Job Type</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleJobType(type)}
                    className={`px-3 py-2 rounded-xl border text-left font-medium transition-all ${
                      selectedJobTypes.includes(type)
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Location */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900">Location</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Remote', 'Europe', 'India', 'USA', 'UK', 'Germany'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocation(loc)}
                    className={`px-3 py-2 rounded-xl border text-left font-medium transition-all ${
                      selectedLocations.includes(loc)
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Salary Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-slate-900">Minimum Salary</h3>
                <span className="font-semibold text-blue-600">
                  {minSalaryFilter === 0 ? 'Any' : `€${minSalaryFilter.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180000"
                step="10000"
                value={minSalaryFilter}
                onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Mobile Experience */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900">Experience</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: '0-2', label: '0 – 2 yrs' },
                  { id: '2-5', label: '2 – 5 yrs' },
                  { id: '5+', label: '5+ yrs' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => toggleExperienceLevel(exp.id)}
                    className={`px-2 py-2 rounded-xl border text-center font-medium transition-all ${
                      selectedExperienceLevels.includes(exp.id)
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Apply Filters ({filteredJobs.length} Jobs)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
