import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { ShieldCheck, ArrowLeft, CheckCircle2, DollarSign, Clock, MapPin, Briefcase } from 'lucide-react';
import { Button, StatusBadge } from '@thamilarasan/ui';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<HiringRequirement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getRequirement(id).then((res) => {
        if (res.success && res.data) {
          setJob(res.data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-16 text-center text-slate-400">Loading requirement specifications...</div>;
  if (!job) return <div className="p-16 text-center text-slate-500">Requirement not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to verified roles
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
              <StatusBadge status={job.state} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-medium">{job.roleCategory} • Openings: {job.openingsCount}</p>
          </div>
          <Link to="/talent/dashboard">
            <Button size="lg" className="w-full md:w-auto">
              Apply via Candidate Vetting
            </Button>
          </Link>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Annual Budget</span>
            <span className="font-bold text-slate-900 text-sm">{formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Min Experience</span>
            <span className="font-bold text-slate-900 text-sm">{job.minExperienceYears} Years Required</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Max Notice Period</span>
            <span className="font-bold text-slate-900 text-sm">{job.maxNoticePeriodDays} Days</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Timezone Overlap</span>
            <span className="font-bold text-slate-900 text-sm">{job.timezoneRequirement}</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Role Overview</h3>
          <p>{job.jobDescription}</p>

          <h3 className="text-base font-bold text-slate-900 tracking-tight pt-4">Mandatory Technical Stack</h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((sk) => (
              <span key={sk} className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                {sk}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold text-slate-900 tracking-tight pt-4">Evaluation Benchmarks</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Asynchronous performance, event loop execution, and memory optimization
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Distributed database partitioning and high-concurrency consistency
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Clean architectural trade-off articulation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
