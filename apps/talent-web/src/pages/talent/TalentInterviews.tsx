import React, { useEffect, useState } from 'react';
import { Interview } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatDate } from '@thamilarasan/utils';
import { StatusBadge, Button } from '@thamilarasan/ui';
import { Calendar, Clock, Video, CheckCircle2 } from 'lucide-react';

export const TalentInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInterviews('candidateId=cand-1').then((res) => {
      if (res.success && res.data) setInterviews(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Interviews</h1>
        <p className="text-xs text-slate-500 mt-1">Direct video meetings with international hiring managers.</p>
      </div>

      <div className="space-y-4">
        {interviews.map((intItem) => (
          <div
            key={intItem.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">Vanguard FinTech — {intItem.interviewType.replace(/_/g, ' ')}</span>
                <StatusBadge status={intItem.status} size="sm" />
              </div>
              <p className="text-xs text-slate-600">
                Interviewers: {intItem.interviewerNames?.join(', ') || 'Hiring Manager'}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(intItem.scheduledAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {intItem.durationMinutes} mins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={intItem.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Video Room</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
