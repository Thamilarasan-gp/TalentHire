import React, { useState, useEffect } from 'react';
import { api } from '@thamilarasan/api-client';
import { Button, StatusBadge, DataTable, Column } from '@thamilarasan/ui';
import {
  ShieldAlert,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Sparkles,
  Building,
  Clock
} from 'lucide-react';

export const AdminAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  useEffect(() => {
    // In demo mode or api call
    api.getAdminStats().then(() => {
      // Mock realistic evaluator assignment queue
      const mockAssignments = [
        {
          id: 'ASG-9021',
          candidateName: 'Karthik Iyer',
          candidateRole: 'Senior Node.js / Distributed Systems',
          companyName: 'Vanguard FinTech Global',
          assignedEvaluator: 'Vikramaditya Sengupta',
          evaluatorTitle: 'Staff Backend Architect (ex-Amazon)',
          status: 'IN_PROGRESS',
          scheduledTime: 'Today, 3:30 PM IST',
          suitabilityScore: 98,
          conflictCheck: 'PASSED',
          conflictDetails: 'No shared past employers (checked 4 years history)',
        },
        {
          id: 'ASG-9022',
          candidateName: 'Pooja Sundaram',
          candidateRole: 'Lead Full-Stack React/Next.js',
          companyName: 'Nordic Health Systems',
          assignedEvaluator: 'Ananya Deshmukh',
          evaluatorTitle: 'Principal Frontend Engineer',
          status: 'PENDING_CONFIRMATION',
          scheduledTime: 'Tomorrow, 11:00 AM IST',
          suitabilityScore: 94,
          conflictCheck: 'PASSED',
          conflictDetails: 'No direct institutional overlap verified',
        },
        {
          id: 'ASG-9023',
          candidateName: 'Rohan Sharma',
          candidateRole: 'Data Platform Engineer (Snowflake/dbt)',
          companyName: 'Apex Cloud Logistics',
          assignedEvaluator: 'Siddharth Nair',
          evaluatorTitle: 'VP Engineering (ex-Flipkart)',
          status: 'COMPLETED',
          scheduledTime: 'Yesterday, 5:00 PM IST',
          suitabilityScore: 91,
          conflictCheck: 'PASSED',
          conflictDetails: 'Evaluated & locked scorecard awaiting QA',
        },
        {
          id: 'ASG-9024',
          candidateName: 'Arjun Nambiar',
          candidateRole: 'Cloud Infrastructure & SRE',
          companyName: 'Zephyr AI Labs',
          assignedEvaluator: 'Unassigned',
          evaluatorTitle: 'Needs Kubernetes / Terraform expert',
          status: 'UNASSIGNED',
          scheduledTime: 'Queued for automatic matching',
          suitabilityScore: 0,
          conflictCheck: 'PENDING_MATCH',
          conflictDetails: 'Algorithm ranking 3 suitable evaluators',
        },
      ];
      setAssignments(mockAssignments);
      setSelectedAssignment(mockAssignments[0]);
      setLoading(false);
    });
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'candidateName',
      header: 'Candidate & Target Role',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.candidateName}</span>
          <span className="text-[11px] text-slate-500">{row.candidateRole}</span>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'Hiring Client',
      render: (row) => (
        <span className="font-medium text-slate-700 text-xs flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          {row.companyName}
        </span>
      ),
    },
    {
      key: 'assignedEvaluator',
      header: 'Assigned Evaluator',
      render: (row) => (
        <div>
          <span className={`font-semibold text-xs ${row.assignedEvaluator === 'Unassigned' ? 'text-amber-600 italic' : 'text-slate-900'}`}>
            {row.assignedEvaluator}
          </span>
          <span className="text-[10px] text-slate-400 block">{row.evaluatorTitle}</span>
        </div>
      ),
    },
    {
      key: 'conflictCheck',
      header: 'Conflict Guard',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          row.conflictCheck === 'PASSED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-amber-50 text-amber-700 border border-amber-200/50'
        }`}>
          {row.conflictCheck === 'PASSED' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
          {row.conflictCheck}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Visual Focal Point */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Evaluator Network Operations
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Strict Conflict Blocking Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Independent Evaluator Assignment Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Automated conflict-of-interest prevention, domain calibration matching, and interview room orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
            Filter Pending (1)
          </Button>
          <Button size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Auto-Assign Unassigned
          </Button>
        </div>
      </div>

      {/* Primary Split Workspace: Table & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Queue Table */}
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={assignments}
            keyExtractor={(i) => i.id}
            onRowClick={(row) => setSelectedAssignment(row)}
            searchPlaceholder="Filter candidate, client, or evaluator..."
          />
        </div>

        {/* Inspector Detail Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          {selectedAssignment ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {selectedAssignment.id}
                  </span>
                  <StatusBadge status={selectedAssignment.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedAssignment.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: {selectedAssignment.companyName}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Domain Suitability</span>
                    <span className="font-bold text-blue-600">{selectedAssignment.suitabilityScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${selectedAssignment.suitabilityScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Conflict of Interest Guarantee
                  </span>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Zero Prior Co-employment Verified
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      {selectedAssignment.conflictDetails}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Session Schedule</span>
                    <span className="font-semibold text-slate-800">{selectedAssignment.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Evaluator Fee</span>
                    <span className="font-semibold text-slate-800">₹5,000 (Guaranteed on QA Lock)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Button size="sm" className="w-full">
                  Inspect Interview Room Telemetry
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Reassign to Alternate Principal
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an assignment to inspect verification telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
