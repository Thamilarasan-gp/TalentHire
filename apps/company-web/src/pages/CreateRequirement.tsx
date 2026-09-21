import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import { PlusCircle, Sparkles, CheckCircle2, AlertCircle, Sliders, Layers } from 'lucide-react';

export const CreateRequirement: React.FC = () => {
  const navigate = useNavigate();

  // Basic Information
  const [title, setTitle] = useState('10 Senior Node.js Engineers');
  const [roleCategory, setRoleCategory] = useState('Backend Engineering');
  const [openingsCount, setOpeningsCount] = useState(10);
  const [employmentType, setEmploymentType] = useState<'FULL_TIME' | 'CONTRACT'>('FULL_TIME');
  const [minExperienceYears, setMinExperienceYears] = useState(5);
  const [maxExperienceYears, setMaxExperienceYears] = useState(12);

  // Technical Skills
  const [requiredSkills, setRequiredSkills] = useState('Node.js, TypeScript, AWS, System Design');
  const [niceToHaveSkills, setNiceToHaveSkills] = useState('PostgreSQL, Docker, Kubernetes');

  // Compensation & Terms
  const [budgetMinUsd, setBudgetMinUsd] = useState(65000);
  const [budgetMaxUsd, setBudgetMaxUsd] = useState(95000);
  const [maxNoticePeriodDays, setMaxNoticePeriodDays] = useState(45);
  const [timezoneRequirement, setTimezoneRequirement] = useState('Min 4 hours overlap with EST (UTC-5)');

  // Context & Details
  const [jobDescription, setJobDescription] = useState(
    'Scaling our core transactional ledger platform. Looking for senior software engineers with strong asynchronous event loop mastery, distributed caching, and microservices architecture.'
  );
  const [responsibilities, setResponsibilities] = useState(
    'Architect resilient event-driven microservices, optimize low-latency database queries, and participate in daily agile sprints.'
  );

  // Configurable Criteria Weights (Must sum to 100%)
  const [weightTech, setWeightTech] = useState(35);
  const [weightExp, setWeightExp] = useState(20);
  const [weightSysDesign, setWeightSysDesign] = useState(20);
  const [weightComm, setWeightComm] = useState(10);
  const [weightDomain, setWeightDomain] = useState(10);
  const [weightAvail, setWeightAvail] = useState(5);

  const totalWeight = weightTech + weightExp + weightSysDesign + weightComm + weightDomain + weightAvail;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (totalWeight !== 100) {
      setError(`Evaluation weights must total exactly 100%. Current sum: ${totalWeight}%`);
      return;
    }

    setLoading(true);

    try {
      const res = await api.createRequirement({
        title,
        roleCategory,
        openingsCount: Number(openingsCount),
        engagementType: employmentType,
        minExperienceYears: Number(minExperienceYears),
        maxExperienceYears: Number(maxExperienceYears),
        requiredSkills: requiredSkills.split(',').map((s) => s.trim()),
        niceToHaveSkills: niceToHaveSkills.split(',').map((s) => s.trim()),
        budgetMinUsd: Number(budgetMinUsd),
        budgetMaxUsd: Number(budgetMaxUsd),
        maxNoticePeriodDays: Number(maxNoticePeriodDays),
        timezoneRequirement,
        jobDescription,
      });

      if (res.success && res.data) {
        setSuccessMessage((res as any).message || 'Requirement created and deterministic matching engine triggered!');
        setTimeout(() => {
          navigate('/company/shortlists');
        }, 1500);
      } else {
        setError(res.error || 'Failed to submit requirement');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while submitting requirement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deterministic Matching & Evaluator Assignment</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Hiring Requirement</h1>
        <p className="text-xs text-slate-500 mt-1">
          Specify technical competencies, USD budget boundaries, and custom evaluation rubric weightings.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage} Routing to Decision Shortlist...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800 font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-8">
        {/* SECTION 1: ROLE BASICS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            1. Role Basics & Volume
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Requirement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Openings Needed (Top-N)</label>
              <input
                type="number"
                required
                min={1}
                value={openingsCount}
                onChange={(e) => setOpeningsCount(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Role Category</label>
              <input
                type="text"
                required
                value={roleCategory}
                onChange={(e) => setRoleCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as 'FULL_TIME' | 'CONTRACT')}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="FULL_TIME">Full Time Permanent</option>
                <option value="CONTRACT">Long-Term Contract</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Min Experience (Years)</label>
              <input
                type="number"
                required
                min={0}
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TECHNICAL COMPETENCIES */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            2. Technical Competencies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mandatory Technical Stack (Comma-separated)</label>
              <input
                type="text"
                required
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nice-to-Have Secondary Skills</label>
              <input
                type="text"
                value={niceToHaveSkills}
                onChange={(e) => setNiceToHaveSkills(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: COMPENSATION & AVAILABILITY */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            3. Compensation & Availability Terms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Annual Budget Min (USD)</label>
              <input
                type="number"
                required
                value={budgetMinUsd}
                onChange={(e) => setBudgetMinUsd(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Annual Budget Max (USD)</label>
              <input
                type="number"
                required
                value={budgetMaxUsd}
                onChange={(e) => setBudgetMaxUsd(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Max Notice Period (Days)</label>
              <input
                type="number"
                required
                value={maxNoticePeriodDays}
                onChange={(e) => setMaxNoticePeriodDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Timezone Overlap Requirement</label>
            <input
              type="text"
              required
              value={timezoneRequirement}
              onChange={(e) => setTimezoneRequirement(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>

        {/* SECTION 4: CUSTOM EVALUATION CRITERIA WEIGHTS (MUST TOTAL 100%) */}
        <div className="space-y-4 p-5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-cyan-600" />
                4. Custom Evaluation Benchmark Weightings
              </h4>
              <p className="text-[11px] text-slate-500">Tune the importance weights for the independent evaluator rubric.</p>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              Total: {totalWeight}% / 100%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1">Technical Skills (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weightTech}
                onChange={(e) => setWeightTech(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Experience Depth (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weightExp}
                onChange={(e) => setWeightExp(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">System Design (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weightSysDesign}
                onChange={(e) => setWeightSysDesign(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Communication (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weightComm}
                onChange={(e) => setWeightComm(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Domain Fit (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weightDomain}
                onChange={(e) => setWeightDomain(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Availability (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weightAvail}
                onChange={(e) => setWeightAvail(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: CONTEXT & EXPECTATIONS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            5. Technical Context & Expectations
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Technical Overview</label>
            <textarea
              rows={3}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Core Engineering Responsibilities</label>
            <textarea
              rows={2}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Submitting instantly triggers deterministic candidate matching and assigns conflict-free evaluators.
          </span>
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            leftIcon={<Sparkles className="w-4 h-4 mr-1 text-cyan-200" />}
            className="bg-cyan-600 hover:bg-cyan-700 border-cyan-600 font-bold"
          >
            Launch Requirement & Match Candidates
          </Button>
        </div>
      </form>
    </div>
  );
};
