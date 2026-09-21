import React, { useState, useEffect } from 'react';
import { api } from '@thamilarasan/api-client';
import { DataTable, Column, StatusBadge, Button } from '@thamilarasan/ui';
import { Calendar, Video, Clock, Building, Users, ExternalLink } from 'lucide-react';

export const AdminInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    // mock realistic live interview scheduling
    setInterviews([
      {
        id: 'INT-3301',
        candidateName: 'Karthik Iyer',
        candidateRole: 'Senior Node.js / Distributed Systems',
        companyName: 'Vanguard FinTech Global',
        interviewer: 'David Henderson (VP Eng)',
        scheduledAt: '2026-09-22T14:30:00Z',
        timezone: 'UTC-5 (EST)',
        type: 'FINAL_CLIENT_INTERVIEW',
        meetingUrl: 'https://meet.thamilarasan.global/room/vanguard-karthik',
        status: 'SCHEDULED',
      },
      {
        id: 'INT-3302',
        candidateName: 'Pooja Sundaram',
        candidateRole: 'Lead Full-Stack React',
        companyName: 'Nordic Health Systems',
        interviewer: 'Astrid Lindgren (CTO)',
        scheduledAt: '2026-09-23T10:00:00Z',
        timezone: 'UTC+2 (CEST)',
        type: 'CULTURE_AND_OFFER_ALIGNMENT',
        meetingUrl: 'https://meet.thamilarasan.global/room/nordic-pooja',
        status: 'CONFIRMED',
      },
      {
        id: 'INT-3303',
        candidateName: 'Rohan Sharma',
        candidateRole: 'Data Platform Engineer',
        companyName: 'Apex Cloud Logistics',
        interviewer: 'Marcus Vance (Staff Data Architect)',
        scheduledAt: '2026-09-19T16:00:00Z',
        timezone: 'UTC-7 (PDT)',
        type: 'FINAL_CLIENT_INTERVIEW',
        meetingUrl: 'https://meet.thamilarasan.global/room/apex-rohan',
        status: 'COMPLETED',
      },
    ]);
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Interview Ref',
      render: (r) => <span className="font-mono text-xs text-slate-500 font-semibold">{r.id}</span>,
    },
    {
      key: 'candidateName',
      header: 'Candidate & Role',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block">{r.candidateName}</span>
          <span className="text-[11px] text-slate-500">{r.candidateRole}</span>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'Hiring Client & Interviewer',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" />
            {r.companyName}
          </span>
          <span className="text-[11px] text-slate-400 block">{r.interviewer}</span>
        </div>
      ),
    },
    {
      key: 'scheduledAt',
      header: 'Schedule (IST & Client Local)',
      render: (r) => (
        <div className="space-y-0.5">
          <span className="font-medium text-xs text-slate-800 block">
            {new Date(r.scheduledAt).toLocaleDateString()} at {new Date(r.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{r.timezone}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'State',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'meetingUrl',
      header: 'Meeting Link',
      render: (r) => (
        <a
          href={r.meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
        >
          <Video className="w-3.5 h-3.5 text-blue-500" />
          Join Room
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Client Facilitation
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Client Interview Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Live telemetry for high-conviction client interviews with Top-N shortlisted engineers.
          </p>
        </div>

        <Button size="sm" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
          Schedule Concierge Session
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={interviews}
        keyExtractor={(i) => i.id}
        searchPlaceholder="Filter candidate, client, or date..."
      />
    </div>
  );
};
