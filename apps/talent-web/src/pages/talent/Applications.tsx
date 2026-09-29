import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Briefcase, CheckCircle2, Clock, MapPin, DollarSign, ArrowRight, RefreshCw, Award } from 'lucide-react';

export const Applications: React.FC = () => {
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

  const loadApplications = () => {
    setLoading(true);
    const cid = getCandidateId();
    api.getMyApplications(cid)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setApplications(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load candidate applications:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Applications</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time status of your active hiring pipelines and employer submissions.</p>
        </div>

        <Button variant="outline" size="sm" onClick={loadApplications} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-medium">Loading your job applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Job Applications Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              You haven't applied to any job openings yet. Activate your verified 5-Day Stack Pass to 1-click apply to top companies without repeated screening rounds.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/talent/stack-pass-hub">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
                Get Your Stack Pass
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="sm" variant="outline">
                Browse Open Roles
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 hover:border-blue-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{app.role}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-blue-600">{app.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.location || 'Remote'}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-400 text-[11px]">ID: {app.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.evaluationScore ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Score: {app.evaluationScore}/100
                    </span>
                  ) : null}
                  <StatusBadge status={app.stage || 'SUBMITTED'} size="sm" />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {app.stageDesc}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}</span>
                <span className="text-slate-600 font-semibold">{app.salary || 'Competitive'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
