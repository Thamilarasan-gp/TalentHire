import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { formatUSD, formatDate } from '@thamilarasan/utils';
import { Button, StatusBadge } from '@thamilarasan/ui';
import {
  Gift,
  PlusCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CompanyOffers: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlCandidateId = searchParams.get('candidateId');

  const [offers, setOffers] = useState<any[]>([]);
  const [interviewedCandidates, setInterviewedCandidates] = useState<any[]>([]);
  const [openings, setOpenings] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(Boolean(urlCandidateId));
  
  // Form fields
  const [candidateId, setCandidateId] = useState(urlCandidateId || '');
  const [requirementId, setRequirementId] = useState('');
  const [annualSalaryUsd, setAnnualSalaryUsd] = useState(95000);
  const [bonusUsd, setBonusUsd] = useState(10000);
  const [equityTerms, setEquityTerms] = useState('0.05% stock options package with standard 4-year vesting (1-year cliff)');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [terms, setTerms] = useState('Standard International Software Engineer Remote Employment Agreement');
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      const [offersRes, invCandsRes, openingsRes] = await Promise.all([
        api.getCompanyOffers(),
        api.getInterviewedCandidates(),
        api.getCompanyOpenings(),
      ]);

      if (offersRes.success && offersRes.data) {
        setOffers(offersRes.data);
      }
      if (invCandsRes.success && invCandsRes.data) {
        setInterviewedCandidates(invCandsRes.data);
        if (!candidateId && invCandsRes.data.length > 0) {
          setCandidateId(invCandsRes.data[0].id || invCandsRes.data[0].candidateId);
        }
      }
      if (openingsRes.success && openingsRes.data && openingsRes.data.length > 0) {
        setOpenings(openingsRes.data);
        if (!requirementId) {
          setRequirementId(openingsRes.data[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load offers data:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // When urlCandidateId changes or candidate list arrives, bind correctly
  useEffect(() => {
    if (urlCandidateId) {
      setCandidateId(urlCandidateId);
      setIsCreating(true);
    }
  }, [urlCandidateId]);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId) {
      setErrorMsg('Please select a candidate to extend an employment offer.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.createCompanyOffer({
        candidateId,
        requirementId: requirementId || undefined,
        annualSalaryUsd: Number(annualSalaryUsd),
        bonusUsd: Number(bonusUsd),
        equityTerms,
        proposedStartDate: startDate,
        terms,
      });

      if (res.success && res.data) {
        setOffers([res.data, ...offers]);
        setSuccessMsg(`Formal offer package successfully extended to ${res.data.candidateName || 'candidate'}!`);
        setTimeout(() => {
          setIsCreating(false);
          setSuccessMsg(null);
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Failed to issue offer.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while extending offer.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (o.candidateName && o.candidateName.toLowerCase().includes(q)) ||
      (o.candidateRole && o.candidateRole.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q))
    );
  });

  const selectedCandidateDoc = interviewedCandidates.find(
    (c) => c.id === candidateId || c.candidateId === candidateId
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Formal Job Offers <span className="text-2xl"></span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Extend verified, calibrated employment offers to candidates who completed your interview loops.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setIsCreating(!isCreating);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
          leftIcon={<PlusCircle className="w-4 h-4 mr-1" />}
        >
          {isCreating ? 'Close Form' : 'Extend New Offer'}
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Total Offers Extended</span>
          <span className="text-2xl font-black text-slate-900 block">{offers.length}</span>
          <span className="text-[10px] text-slate-400 font-medium block">Organization wide</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Active Pending Offers</span>
          <span className="text-2xl font-black text-emerald-600 block">
            {offers.filter((o) => o.status === 'EXTENDED' || o.status === 'PENDING').length}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block">Awaiting candidate acceptance</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Interviewed Candidates</span>
          <span className="text-2xl font-black text-blue-600 block">
            {interviewedCandidates.length}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block">Completed team rounds</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Avg Offered Base</span>
          <span className="text-2xl font-black text-slate-900 block">
            {offers.length > 0
              ? formatUSD(Math.round(offers.reduce((acc, o) => acc + (o.annualSalaryUsd || 0), 0) / offers.length))
              : '$95,000'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block">Base annual compensation</span>
        </div>
      </div>

      {/* CREATE OFFER DRAWER / FORM */}
      {isCreating && (
        <form onSubmit={handleCreateOffer} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Extend Formal Employment Offer</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an interviewed candidate and define compensation, bonus, and start terms.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Candidate Selector by REAL NAME */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Select Interviewed Candidate <span className="text-rose-500">*</span>
              </label>
              {interviewedCandidates.length > 0 ? (
                <select
                  value={candidateId}
                  required
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-semibold"
                >
                  <option value="">-- Choose Candidate Who Was Interviewed --</option>
                  {interviewedCandidates.map((cand) => (
                    <option key={cand.id || cand.candidateId} value={cand.id || cand.candidateId}>
                      {cand.fullName} — {cand.headline || 'Software Engineer'} {cand.latestDecision ? `(${cand.latestDecision.replace(/_/g, ' ')})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  No interviewed candidates found yet.{' '}
                  <Link to="/company/interviews" className="font-bold underline">
                    Conduct an interview round
                  </Link>{' '}
                  to qualify talent for an offer.
                </div>
              )}
              {selectedCandidateDoc && (
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  ✓ Selected: {selectedCandidateDoc.fullName} ({selectedCandidateDoc.headline})
                </span>
              )}
            </div>

            {/* Company Opening Selector */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Role / Company Opening
              </label>
              <select
                value={requirementId}
                onChange={(e) => setRequirementId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-semibold"
              >
                {openings.length > 0 ? (
                  openings.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.title}
                    </option>
                  ))
                ) : (
                  <option value="req-1">Senior Software Engineering Role</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Base Annual Salary (USD) *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={20000}
                  step={1000}
                  value={annualSalaryUsd}
                  onChange={(e) => setAnnualSalaryUsd(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-8 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Performance Bonus (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={bonusUsd}
                  onChange={(e) => setBonusUsd(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-8 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Equity &amp; Stock Terms</label>
              <input
                type="text"
                value={equityTerms}
                onChange={(e) => setEquityTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                placeholder="e.g. 0.05% stock options package with 4-year vesting"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">Contract &amp; Working Terms</label>
            <textarea
              rows={2}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:bg-white focus:border-blue-500 leading-relaxed"
              placeholder="Enter special terms, remote work policy, equipment allowance..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {loading ? 'Extending Offer...' : 'Confirm & Extend Offer'}
            </Button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search extended offers by candidate name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Showing {filteredOffers.length} offer{filteredOffers.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* OFFERS LIST */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
            <Gift className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Job Offers Extended Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Once candidates complete their technical interview rounds, you can extend calibrated formal job offers directly from here.
            </p>
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs mt-2"
            >
              Extend First Offer
            </Button>
          </div>
        ) : (
          filteredOffers.map((offer: any) => (
            <div
              key={offer.id || offer._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-slate-900">
                    {offer.candidateName || 'Software Engineer Candidate'}
                  </h4>
                  <StatusBadge status={offer.status} size="sm" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {formatUSD(offer.annualSalaryUsd || 90000)} / yr
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  {offer.candidateRole || offer.candidateHeadline || 'Senior Software Engineer'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Bonus: {formatUSD(offer.bonusUsd || 0)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Target Start: {formatDate(offer.proposedStartDate || offer.startDate)}
                  </span>
                  {offer.equityTerms && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        {offer.equityTerms}
                      </span>
                    </>
                  )}
                </div>

                {offer.terms && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                    Terms: "{offer.terms}"
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium block">Extended On</span>
                  <span className="text-xs font-bold text-slate-700 block">
                    {formatDate(offer.extendedAt || offer.createdAt || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
