import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiringRequirement, StackPass } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Zap,
  Flame,
  Award,
  Filter,
  Check,
  Globe,
  TrendingUp,
  Layers,
  Database
} from 'lucide-react';
import { Button, StatusBadge } from '@thamilarasan/ui';

export const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<HiringRequirement[]>([]);
  const [activePasses, setActivePasses] = useState<StackPass[]>([]);
  const [quota, setQuota] = useState({ freeEvaluationsRemaining: 10, freeEvaluationsTotal: 10 });
  const [loading, setLoading] = useState(true);

  // Filters (Naukri style)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'ALL' | 'SDE' | 'AI_ML' | 'DATA_ENGINEERING'>('ALL');
  const [selectedExp, setSelectedExp] = useState<'ALL' | '0-3' | '3-6' | '6+'>('ALL');
  const [selectedWorkMode, setSelectedWorkMode] = useState<'ALL' | 'REMOTE' | 'HYBRID'>('ALL');

  // Application states
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, passesRes] = await Promise.all([
          api.getRequirements(),
          api.getMyStackPasses('cand-1'),
        ]);

        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data);
        }
        if (passesRes.success && passesRes.data) {
          setActivePasses(passesRes.data.activePasses || []);
          if (passesRes.data.quota) {
            setQuota(passesRes.data.quota);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requiredSkills || []).some((s: any) => {
        const str = typeof s === 'string' ? s : s?.name || '';
        return str.toLowerCase().includes(searchTerm.toLowerCase());
      }) ||
      (job.jobDescription || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain =
      selectedDomain === 'ALL' ||
      (selectedDomain === 'SDE' && (job.roleCategory.includes('Backend') || job.roleCategory.includes('Full Stack') || job.roleCategory.includes('Frontend'))) ||
      (selectedDomain === 'AI_ML' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('ml') || job.roleCategory.includes('AI'))) ||
      (selectedDomain === 'DATA_ENGINEERING' && (job.title.toLowerCase().includes('data') || job.roleCategory.includes('Data')));

    const exp = job.minExperienceYears || 0;
    const matchesExp =
      selectedExp === 'ALL' ||
      (selectedExp === '0-3' && exp <= 3) ||
      (selectedExp === '3-6' && exp > 3 && exp <= 6) ||
      (selectedExp === '6+' && exp > 6);

    return matchesSearch && matchesDomain && matchesExp;
  });

  // Check if candidate holds valid pass for a specific job
  const getJobPassStatus = (job: HiringRequirement) => {
    const jobSkills = (job.requiredSkills || []).map((s: any) => {
      const str = typeof s === 'string' ? s : s?.name || '';
      return str.toLowerCase();
    });

    for (const pass of activePasses) {
      if (pass.status !== 'ACTIVE') continue;
      const passSkills = (pass.coveredSkills || []).map((s) => s.toLowerCase());
      const hasMatch = jobSkills.some((js) =>
        passSkills.some((ps) => ps.includes(js) || js.includes(ps))
      );
      if (hasMatch) {
        return {
          hasPass: true,
          pass,
        };
      }
    }

    const firstSkillName = job.requiredSkills?.[0]
      ? (typeof job.requiredSkills[0] === 'string' ? job.requiredSkills[0] : (job.requiredSkills[0] as any)?.name || 'Technical')
      : 'Technical';

    return {
      hasPass: false,
      recommendedStackName: `${firstSkillName} Stack`,
    };
  };

  // 1-Click Apply
  const handleApply = async (job: HiringRequirement) => {
    setApplyingJobId(job.id);
    try {
      const res = await api.applyJobWithStackPass(job.id, 'cand-1');
      if (res.success) {
        setAppliedJobs((prev) => ({ ...prev, [job.id]: true }));
        setToastMessage(`🎉 Applied to ${job.title}! Employer will review your verified score.`);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(res.error || 'Failed to submit application');
      }
    } catch (err: any) {
      alert('Error applying: ' + err.message);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header - LinkedIn + Naukri Fusion */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Direct-to-Company Jobs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>5-Day Gated Applications</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Verified Software Engineering Careers
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Apply in 1-Click with your <strong>Active 5-Day Stack Pass</strong>. No spam, no ghosting, no redundant preliminary screenings.
            </p>
          </div>

          {/* Active Pass Status Pill Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {activePasses.length > 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Active 5-Day Stack Pass: <strong>{activePasses[0].stackTitle} ({activePasses[0].score}/100)</strong>
                    </span>
                  ) : (
                    <span className="text-slate-700">You do not have an active 5-Day Stack Pass currently.</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500">
                  Free Evaluation Quota: <strong>{quota.freeEvaluationsRemaining} / {quota.freeEvaluationsTotal} remaining</strong>.
                </span>
              </div>
            </div>

            <Link to="/talent/stack-passes">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold whitespace-nowrap shadow-sm">
                <span>Open Stack Pass Hub</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Naukri-Style Deep Search & Filter Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, job roles, or stack (e.g. MERN, Python, React, AWS)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            {/* Experience Filter */}
            <div>
              <select
                value={selectedExp}
                onChange={(e: any) => setSelectedExp(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium text-slate-700"
              >
                <option value="ALL">Any Experience Level</option>
                <option value="0-3">Early Career (0 - 3 Years)</option>
                <option value="3-6">Mid / Senior (3 - 6 Years)</option>
                <option value="6+">Lead / Staff (6+ Years)</option>
              </select>
            </div>

            {/* Domain Filter */}
            <div>
              <select
                value={selectedDomain}
                onChange={(e: any) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium text-slate-700"
              >
                <option value="ALL">All Technical Domains</option>
                <option value="SDE">Software Engineering (SDE)</option>
                <option value="AI_ML">AI & Machine Learning</option>
                <option value="DATA_ENGINEERING">Data Engineering</option>
              </select>
            </div>
          </div>

          {/* Quick Domain Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Quick Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Openings' },
              { id: 'SDE', label: 'SDE & Full-Stack' },
              { id: 'AI_ML', label: 'GenAI & Machine Learning' },
              { id: 'DATA_ENGINEERING', label: 'Data Engineering' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDomain(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDomain === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing <strong>{filteredJobs.length}</strong> verified opportunities</span>
          <span className="text-[11px] text-blue-600 font-semibold">⚡ Direct Verified Hiring Pipeline</span>
        </div>

        {/* Job Listings (LinkedIn + Naukri High-Density Cards) */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading verified roles...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No openings match your criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your keyword search or domain filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const { hasPass, pass, recommendedStackName } = getJobPassStatus(job);
              const isApplied = appliedJobs[job.id];
              const isApplying = applyingJobId === job.id;

              return (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5 relative"
                >
                  {/* Top Row: Company & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* LinkedIn-style Company Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-base shrink-0 shadow-sm">
                        {job.title.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link to={`/jobs/${job.id}`}>
                            <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                              {job.title}
                            </h3>
                          </Link>
                          <StatusBadge status={job.state} size="sm" />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            Verified Global Partner
                          </span>
                          <span>•</span>
                          <span>{job.roleCategory}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-emerald-600" /> 100% Remote ({job.timezoneRequirement})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Salary & Experience Highlights (Naukri style) */}
                    <div className="sm:text-right shrink-0">
                      <div className="text-base sm:text-lg font-extrabold text-slate-900">
                        {formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)}
                        <span className="text-xs font-normal text-slate-500 block sm:inline"> / yr</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {job.minExperienceYears}+ Yrs Experience Required
                      </span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.jobDescription}
                  </p>

                  {/* Required Skills Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(job.requiredSkills || []).map((sk: any, idx: number) => {
                      const skillLabel = typeof sk === 'string' ? sk : sk?.name || JSON.stringify(sk);
                      return (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {skillLabel}
                        </span>
                      );
                    })}
                    <span className="text-[10px] text-slate-400 font-medium ml-2">
                      Max Notice: <strong>{job.maxNoticePeriodDays} Days</strong>
                    </span>
                  </div>

                  {/* Bottom Action Bar: Stack Pass Gate Verification */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Pass Gate Indicator */}
                    <div className="text-xs">
                      {hasPass ? (
                        <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            5-Day Pass Verified: <strong>{pass.stackTitle} (Score: {pass.score}/100)</strong>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-800 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Requires <strong>5-Day Stack Pass</strong> ({recommendedStackName || 'Technical Vetting'})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View Specs
                        </Button>
                      </Link>

                      {isApplied ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 shadow-sm">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Applied with Pass
                        </span>
                      ) : hasPass ? (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md active:scale-[0.98]"
                          onClick={() => handleApply(job)}
                          isLoading={isApplying}
                          leftIcon={<Zap className="w-3.5 h-3.5" />}
                        >
                          1-Click Apply with Pass
                        </Button>
                      ) : (
                        <Link to="/talent/stack-passes">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
                          >
                            Get Stack Pass (Free Quota)
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
