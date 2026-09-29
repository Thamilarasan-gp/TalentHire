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
  FileText,
  Video,
  ExternalLink,
  Award,
} from 'lucide-react';

export const TalentDashboard: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<HiringRequirement[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      const u = stored ? JSON.parse(stored) : null;
      return u?.candidateId || u?.id || 'cand-1';
    } catch {
      return 'cand-1';
    }
  };

  useEffect(() => {
    const cid = getCandidateId();

    api.getCandidate(cid).then((res) => {
      if (res.success && res.data) {
        setCandidate(res.data);
      } else {
        try {
          const stored = localStorage.getItem('tg_user');
          if (stored) {
            const u = JSON.parse(stored);
            setCandidate({
              id: cid,
              fullName: u.fullName || 'Candidate',
              headline: u.headline || 'Software Engineer',
              location: u.location || 'India',
              totalYearsOfExperience: u.totalYearsOfExperience || 4,
              state: 'VERIFIED',
              expectedSalaryUsd: 85000,
            } as any);
          }
        } catch {}
      }
    });

    api.getRequirements().then((res) => {
      if (res.success && res.data) {
        setJobs(res.data.slice(0, 3));
      }
    });

    api.getMyApplications(cid).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setApplications(res.data);
      }
    });

    api.getInterviews(`candidateId=${cid}`).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setInterviews(res.data);
      }
    });

    api.getOffers(`candidateId=${cid}`).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setOffers(res.data);
      }
    });

    api.getEvaluations(`candidateId=${cid}`).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setEvaluations(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading candidate dashboard...</div>;

  const latestEvaluation = evaluations[0] as any;
  const evalScore = (candidate as any)?.evaluationScore || latestEvaluation?.overallScore;

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Top Banner: Verification & Headline */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {candidate?.fullName?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {candidate?.fullName || 'Candidate'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" /> {candidate?.state || 'VERIFIED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{candidate?.headline || 'Full Stack Engineer'}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span>{candidate?.location || 'India'}</span>
              <span>•</span>
              <span>{candidate?.totalYearsOfExperience || 3} yrs exp</span>
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
          <Link to="/talent/stack-pass-hub">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
              My Stack Passes
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Applications"
          value={applications.length}
          subtext={applications.length > 0 ? `${applications.length} pipelines active` : 'No applications yet'}
          icon={<Briefcase className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Evaluation Score"
          value={evalScore ? `${evalScore} / 100` : 'Pending'}
          subtext={evalScore ? 'Verified by Staff Evaluator' : 'Take evaluation to activate pass'}
          icon={<Award className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Upcoming Interviews"
          value={interviews.length}
          subtext={interviews.length > 0 ? `${interviews.length} company interviews` : 'No interviews scheduled'}
          icon={<Calendar className="w-4 h-4 text-purple-600" />}
        />
        <StatCard
          label="Offers Extended"
          value={offers.length}
          subtext={offers.length > 0 ? `${offers.length} active formal offers` : 'Awaiting offers'}
          icon={<Gift className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Two Columns: Pipeline Status & Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Hiring Pipeline & Interviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Applications */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Recent Applications
              </h3>
              <Link to="/talent/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All ({applications.length})
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{app.role}</span>
                        <StatusBadge status={app.stage || 'SUBMITTED'} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {app.company} • Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    {app.evaluationScore ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Score: {app.evaluationScore}/100
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-slate-400">No applications submitted yet.</p>
                <Link to="/talent/stack-pass-hub">
                  <Button size="sm" variant="outline" className="text-xs">
                    Earn Stack Pass to Apply
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Active Interviews */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Scheduled Company Interviews
              </h3>
              <Link to="/talent/interviews" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All ({interviews.length})
              </Link>
            </div>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.map((intItem: any) => (
                  <div
                    key={intItem.id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {intItem.companyName || 'Hiring Company'} — {intItem.roleTitle || 'Technical Interview'}
                        </span>
                        <StatusBadge status={intItem.status || 'SCHEDULED'} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        With {intItem.interviewerNames?.join(', ') || 'Engineering Team'} • {intItem.durationMinutes || 45} mins
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {intItem.scheduledAt ? new Date(intItem.scheduledAt).toLocaleString() : 'Date TBD'}
                      </p>
                    </div>
                    {intItem.meetingLink ? (
                      <a
                        href={intItem.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Meeting</span>
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming company interviews scheduled.</p>
            )}
          </div>

          {/* Recommended Opportunities */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Matched Opportunities For Your Stack
              </h3>
              <Link to="/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Browse All Roles
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => {
                const isApplied = applications.some((app: any) => app.requirementId === job.id);
                return (
                  <div
                    key={job.id}
                    className="p-4 bg-white border border-slate-100 hover:border-slate-300 rounded-xl flex items-center justify-between transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900">{job.title}</h4>
                        {isApplied && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Budget: {formatUSD(job.budgetMinUsd)} – {formatUSD(job.budgetMaxUsd)} • {job.minExperienceYears}+ yrs
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(job.requiredSkills || []).slice(0, 3).map((sk: any, idx: number) => {
                          const skillLabel = typeof sk === 'string' ? sk : sk?.name || JSON.stringify(sk);
                          return (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {skillLabel}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <Link to={`/jobs/${job.id}`}>
                      <Button size="sm" variant={isApplied ? 'primary' : 'outline'}>
                        {isApplied ? 'Applied' : 'View Role'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Evaluation Dossier Snapshot */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Technical Evaluation Snapshot
            </h3>

            {latestEvaluation ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {latestEvaluation.title || 'Technical Assessment'}
                    </span>
                    <StatusBadge status={latestEvaluation.status || latestEvaluation.state || 'SCHEDULED'} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Evaluator: <strong>{latestEvaluation.evaluatorName || 'Staff Evaluator'}</strong>
                  </p>
                  {latestEvaluation.scheduledAt && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      {new Date(latestEvaluation.scheduledAt).toLocaleString()}
                    </p>
                  )}
                  {latestEvaluation.meetingLink && latestEvaluation.status === 'SCHEDULED' && (
                    <a
                      href={latestEvaluation.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {latestEvaluation.overallScore ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Verified Overall Score:</span>
                      <span className="font-black text-emerald-700 text-sm">{latestEvaluation.overallScore}/100</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 block">
                      Verdict: <strong>{latestEvaluation.recommendation || latestEvaluation.verdict || 'PASS'}</strong>
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-slate-400">No evaluations completed yet.</p>
                <p className="text-[11px] text-slate-500">
                  Earn a 5-Day Stack Pass to have your skills vetted and displayed here.
                </p>
              </div>
            )}

            <Link to="/talent/evaluations" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Full Evaluations Dossier
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
