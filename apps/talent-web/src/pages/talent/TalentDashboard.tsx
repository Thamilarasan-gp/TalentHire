import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Candidate, HiringRequirement, Interview, Offer, Evaluation } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { StatCard, StatusBadge, Button, ScoreBar } from '@thamilarasan/ui';
import {
  ShieldCheck,
  Sparkles,
  Calendar,
  Gift,
  ArrowRight,
  Clock,
  Briefcase,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const TalentDashboard: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<HiringRequirement[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default candidate: Karthik Iyer (cand-1)
    api.getCandidate('cand-1').then((res) => {
      if (res.success && res.data) {
        setCandidate(res.data);
      }
    });

    api.getRequirements().then((res) => {
      if (res.success && res.data) {
        setJobs(res.data.slice(0, 3));
      }
    });

    api.getInterviews('candidateId=cand-1').then((res) => {
      if (res.success && res.data) {
        setInterviews(res.data);
      }
    });

    api.getOffers('candidateId=cand-1').then((res) => {
      if (res.success && res.data) {
        setOffers(res.data);
      }
    });

    api.getEvaluations('candidateId=cand-1').then((res) => {
      if (res.success && res.data) {
        setEvaluations(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading candidate dossier...</div>;

  return (
    <div className="space-y-8">
      {/* Top Banner: Verification & Headline */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {candidate?.fullName?.charAt(0) || 'K'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {candidate?.fullName || 'Karthik Iyer'}
              </h1>
              {candidate?.verifiedBadge && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Candidate
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{candidate?.headline}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span>{candidate?.location}</span>
              <span>•</span>
              <span>{candidate?.totalYearsOfExperience} yrs exp</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">Target: {formatUSD(candidate?.expectedSalaryUsd || 85000)} / yr</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/talent/profile">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
          <Link to="/talent/recommended-jobs">
            <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
              View Matching Roles
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Profile Status"
          value="VERIFIED"
          subtext="Vetted by independent evaluator"
          icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Active Matches"
          value={candidate?.matchCount || 12}
          subtext="Matched against active requirements"
          icon={<Sparkles className="w-4 h-4 text-cyan-600" />}
        />
        <StatCard
          label="Technical Score"
          value="88 / 100"
          subtext="Strong production competence"
          icon={<FileText className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Upcoming Interviews"
          value={interviews.length}
          subtext="Next: Vanguard FinTech Round 1"
          icon={<Calendar className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* Two Columns: Pipeline Status & Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Hiring Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Interviews */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Scheduled Company Interviews
              </h3>
              <Link to="/talent/interviews" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.map((intItem) => (
                  <div
                    key={intItem.id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Vanguard FinTech — Round 1 Technical</span>
                        <StatusBadge status={intItem.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        With {intItem.interviewerNames?.join(', ') || 'Engineering Team'} • 45 minutes
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {formatDate(intItem.scheduledAt)}
                      </p>
                    </div>
                    <a
                      href={intItem.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 text-center"
                    >
                      Join Meeting Room
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming interviews scheduled.</p>
            )}
          </div>

          {/* Recommended Opportunities */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Matched Opportunities For Your Stack
              </h3>
              <Link to="/talent/recommended-jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Browse All
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-white border border-slate-100 hover:border-slate-300 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">{job.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Budget: {formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)} • {job.minExperienceYears}+ yrs
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {job.requiredSkills.map((sk) => (
                        <span key={sk} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Evaluation Dossier Snapshot */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Evaluation Scorecard
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conducted by Independent Evaluator Arun Subramanian (Principal Architect).
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <span className="text-xs text-slate-600 font-medium block mb-1">Node.js Concurrency</span>
                <ScoreBar score={88} size="sm" />
              </div>
              <div>
                <span className="text-xs text-slate-600 font-medium block mb-1">Distributed Architecture</span>
                <ScoreBar score={82} size="sm" />
              </div>
              <div>
                <span className="text-xs text-slate-600 font-medium block mb-1">AWS & Cloud Systems</span>
                <ScoreBar score={85} size="sm" />
              </div>
              <div>
                <span className="text-xs text-slate-600 font-medium block mb-1">Technical Articulation</span>
                <ScoreBar score={92} size="sm" />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900 space-y-1 mt-4">
              <span className="font-bold block">Evaluator Verdict: PASS</span>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                "Demonstrated strong asynchronous event-loop mastery and distributed locking strategy under memory pressure."
              </p>
            </div>

            <Link to="/talent/evaluations" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Full Scorecard Dossier
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
