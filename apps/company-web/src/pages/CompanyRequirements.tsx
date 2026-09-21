import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiringRequirement } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { Button, StatusBadge } from '@thamilarasan/ui';
import {
  PlusCircle,
  ArrowRight,
  Users,
  Sparkles,
  Zap,
  Users2,
  FileText,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const CompanyRequirements: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [requirements, setRequirements] = useState<HiringRequirement[]>([]);
  const [selectedReq, setSelectedReq] = useState<HiringRequirement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanyOpenings().then((res) => {
      if (res.success && res.data) {
        setRequirements(res.data);
        if (id) {
          const found = res.data.find((r) => r.id === id);
          if (found) setSelectedReq(found);
        } else if (res.data.length > 0) {
          setSelectedReq(res.data[0]);
        }
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-16 text-center text-slate-400 text-xs">Loading company openings...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Openings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active positions created by your company, connected to our pre-evaluated talent pool and dedicated applicant pipelines.
          </p>
        </div>

        <Link to="/company/requirements/new">
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white" leftIcon={<PlusCircle className="w-4 h-4 mr-1" />}>
            New Opening
          </Button>
        </Link>
      </div>

      {/* REQUIREMENTS LIST & DETAILED DUAL-FLOW VIEW */}
      {requirements.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Openings Created Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first opening to instantly match with pre-evaluated candidates or initiate dedicated evaluation loops.
            </p>
          </div>
          <Link to="/company/requirements/new">
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white" leftIcon={<PlusCircle className="w-4 h-4 mr-1" />}>
              Create Your First Opening
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {requirements.map((req) => {
            const isSelected = selectedReq?.id === req.id;

          return (
            <div
              key={req.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{req.title}</h3>
                    <StatusBadge status={req.state} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{req.jobDescription}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>Openings: <strong className="text-slate-800">{req.openingsCount}</strong></span>
                    <span>•</span>
                    <span>Experience: <strong>{req.minExperienceYears}+ yrs</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      Budget: {formatUSD(req.budgetMinUsd)} – {formatUSD(req.budgetMaxUsd)}
                    </span>
                    <span>•</span>
                    <span>Notice Period: &le;<strong>{req.maxNoticePeriodDays} days</strong></span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(req.requiredSkills || []).map((sk: any) => (
                      <span key={typeof sk === 'string' ? sk : sk.name} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {typeof sk === 'string' ? sk : sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2.5">
                  <Link to={`/company/matches?requirementId=${req.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      Quick Match
                    </Button>
                  </Link>
                  <Link to={`/company/shortlists?requirementId=${req.id}`}>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                      Decision Shortlist
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
