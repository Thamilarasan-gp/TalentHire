import React, { useEffect, useState } from 'react';
import { Candidate } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { Button, StatusBadge } from '@thamilarasan/ui';
import { ShieldCheck, MapPin, Clock, DollarSign, Briefcase, GraduationCap, Github, Linkedin, ExternalLink } from 'lucide-react';

export const TalentProfile: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getCandidate('cand-1').then((res) => {
      if (res.success && res.data) setCandidate(res.data);
    });
  }, []);

  if (!candidate) return <div className="p-12 text-center text-slate-400">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {candidate.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.fullName}</h1>
              <StatusBadge status={candidate.state} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-medium">{candidate.headline}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {candidate.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {candidate.noticePeriodDays} days notice</span>
            </div>
          </div>
        </div>

        <Button size="sm" onClick={() => setSaved(true)}>
          {saved ? 'Changes Saved' : 'Save Profile'}
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">Executive Summary</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{candidate.summary}</p>
      </div>

      {/* Verified Skills */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Skills & Verified Proficiencies
          </h3>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Evaluated by Staff Engineers
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {candidate.skills.map((skill) => (
            <div
              key={skill.name}
              className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block">{skill.name}</span>
                <span className="text-[10px] text-slate-500">{skill.yearsOfExperience} yrs • {skill.level}</span>
              </div>
              {skill.isVerified && (
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          Professional Experience
        </h3>
        <div className="space-y-6">
          {candidate.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 border-blue-600 pl-4 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{exp.title}</h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-blue-600 font-semibold">{exp.company} • {exp.location}</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.technologies.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compensation & Availability */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          Compensation Expectations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-semibold">Target Annual Salary (USD)</span>
            <span className="text-lg font-bold text-slate-900">{formatUSD(candidate.expectedSalaryUsd)}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-semibold">Notice Period</span>
            <span className="text-lg font-bold text-slate-900">{candidate.noticePeriodDays} Days</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-semibold">Engagement Type</span>
            <span className="text-lg font-bold text-slate-900">{candidate.engagementType.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
