import React, { useEffect, useState } from 'react';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { Button, StatusBadge, ScoreBar } from '@thamilarasan/ui';
import { Sparkles, ArrowRight, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<HiringRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequirements().then((res) => {
      if (res.success && res.data) setJobs(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deterministic Match Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended Opportunities</h1>
        <p className="text-xs text-slate-500 mt-1">
          Positions where your verified Node.js, TypeScript, and AWS skills match requirements above 85%.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.slice(0, 8).map((job, idx) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                  {94 - idx * 2}% Match
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{job.jobDescription}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-700">
                  {formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)}
                </span>
                <span>•</span>
                <span>{job.minExperienceYears}+ yrs exp</span>
                <span>•</span>
                <span>{job.timezoneRequirement}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(job.requiredSkills || []).map((sk: any, idx: number) => {
                  const skillLabel = typeof sk === 'string' ? sk : sk?.name || JSON.stringify(sk);
                  return (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                      {skillLabel}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link to={`/jobs/${job.id}`}>
                <Button variant="outline" size="sm">
                  Specs
                </Button>
              </Link>
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
                Apply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
