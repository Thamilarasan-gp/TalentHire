import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Interview } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatDate } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Calendar, Clock, Video, CheckCircle2, Building2, ExternalLink, RefreshCw } from 'lucide-react';

export const TalentInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
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

  const loadInterviews = () => {
    setLoading(true);
    const cid = getCandidateId();
    api.getInterviews(`candidateId=${cid}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setInterviews(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load interviews:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Interviews</h1>
          <p className="text-xs text-slate-500 mt-1">Direct video meetings scheduled by international hiring companies.</p>
        </div>

        <Button variant="outline" size="sm" onClick={loadInterviews} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-medium">Loading scheduled interviews...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Interviews Scheduled Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              When hiring companies shortlist your verified Stack Pass application, direct video interview invitations will appear dynamically here.
            </p>
          </div>
          <Link to="/talent/applications">
            <Button size="sm" variant="outline">
              Check Application Status
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((intItem: any) => (
            <div
              key={intItem.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-slate-900">
                    {intItem.companyName || 'Hiring Company'} — {intItem.roleTitle || (intItem.interviewType ? intItem.interviewType.replace(/_/g, ' ') : 'Technical Interview')}
                  </span>
                  <StatusBadge status={intItem.status || 'SCHEDULED'} size="sm" />
                </div>

                <p className="text-xs text-slate-600">
                  Interviewers: <strong>{intItem.interviewerNames?.join(', ') || 'Engineering Hiring Team'}</strong>
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {intItem.scheduledAt ? new Date(intItem.scheduledAt).toLocaleString() : 'Date TBD'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {intItem.durationMinutes || 45} mins
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {intItem.meetingLink ? (
                  <a
                    href={intItem.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Link pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
