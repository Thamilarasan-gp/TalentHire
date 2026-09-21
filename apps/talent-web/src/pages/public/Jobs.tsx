import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { Search, MapPin, DollarSign, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button, StatusBadge } from '@thamilarasan/ui';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<HiringRequirement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequirements().then((res) => {
      if (res.success && res.data) {
        setJobs(res.data);
      }
      setLoading(false);
    });
  }, []);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'ALL' || job.roleCategory.toLowerCase().includes(selectedRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vetted International Opportunities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Verified Software Engineering Roles
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Global remote positions with transparent compensation in USD, evaluated on skill and merit.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-slate-200/80 rounded-xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role or tech stack (e.g. Node.js, React, AWS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Backend', 'Full Stack', 'Cloud', 'DevOps'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedRole(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRole === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading verified openings...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer">
                    {job.title}
                  </h3>
                  <StatusBadge status={job.state} size="sm" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                  {job.jobDescription}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)} / yr
                  </span>
                  <span>•</span>
                  <span>{job.minExperienceYears}+ yrs experience</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.timezoneRequirement}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link to={`/jobs/${job.id}`}>
                  <Button variant="outline" size="sm">
                    View Specs
                  </Button>
                </Link>
                <Link to="/talent/dashboard">
                  <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
                    Apply via Vetting
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
