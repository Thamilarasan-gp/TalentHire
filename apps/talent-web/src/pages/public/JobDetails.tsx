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
  const [passCheck, setPassCheck] = useState<{ hasValidPass: boolean; matchingPass: any; recommendedStack: any } | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.getRequirement(id),
        api.checkJobStackPass(id, 'cand-1'),
      ]).then(([jobRes, passRes]) => {
        if (jobRes.success && jobRes.data) {
          setJob(jobRes.data);
        }
        if (passRes.success && passRes.data) {
          setPassCheck(passRes.data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setApplying(true);
    try {
      const res = await api.applyJobWithStackPass(id, 'cand-1');
      if (res.success) {
        setApplied(true);
      } else {
        alert(res.error || 'Failed to submit application');
      }
    } catch (err: any) {
      alert('Error applying: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-16 text-center text-slate-400">Loading requirement specifications...</div>;
  if (!job) return <div className="p-16 text-center text-slate-500">Requirement not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to verified roles
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
              <StatusBadge status={job.state} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-medium">{job.roleCategory} • Openings: {job.openingsCount}</p>
          </div>

          <div>
            {applied ? (
              <div className="px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted via 5-Day Pass</span>
              </div>
            ) : passCheck?.hasValidPass ? (
              <Button
                size="lg"
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                onClick={handleApply}
                isLoading={applying}
              >
                1-Click Apply ({passCheck.matchingPass?.stackTitle})
              </Button>
            ) : (
              <Link to="/talent/stack-passes">
                <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 font-bold shadow-md">
                  Get 5-Day Stack Pass to Apply
                </Button>
              </Link>
            )}
          </div>
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
            {(job.requiredSkills || []).map((sk: any, idx: number) => {
              const skillLabel = typeof sk === 'string' ? sk : sk?.name || JSON.stringify(sk);
              return (
                <span key={idx} className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                  {skillLabel}
                </span>
              );
            })}
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
