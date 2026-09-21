import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  CreditCard,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

export const CompanyOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Step 1: Company Information
  const [companyName, setCompanyName] = useState('Vanguard FinTech');
  const [website, setWebsite] = useState('https://vanguard-fintech.com');
  const [country, setCountry] = useState('United States');
  const [size, setSize] = useState('51-200');
  const [industry, setIndustry] = useState('Financial Services');

  // Step 2: Company Profile
  const [description, setDescription] = useState(
    'Next-generation high-frequency payments and cross-border settlement infrastructure connecting international enterprise banks.'
  );
  const [timezone, setTimezone] = useState('EST (UTC-5)');

  // Step 3: Hiring Needs
  const [primaryRole, setPrimaryRole] = useState('Senior Node.js Backend Engineer');
  const [targetHiresCount, setTargetHiresCount] = useState(10);
  const [targetStack, setTargetStack] = useState('Node.js, TypeScript, AWS, PostgreSQL');
  const [annualBudgetUsd, setAnnualBudgetUsd] = useState(85000);

  // Step 4: Team Members
  const [teammateEmail, setTeammateEmail] = useState('');
  const [teammateRole, setTeammateRole] = useState('COMPANY_HIRING_MANAGER');
  const [teamList, setTeamList] = useState<any[]>([
    { email: 'talent@vanguard-fintech.com', role: 'COMPANY_ADMIN' },
  ]);

  // Step 5: Billing Info
  const [billingContact, setBillingContact] = useState('finance@vanguard-fintech.com');
  const [billingAddress, setBillingAddress] = useState('100 Wall Street, Suite 2400, New York, NY 10005');
  const [paymentTerms, setPaymentTerms] = useState('NET 30');

  useEffect(() => {
    api.getOnboardingProgress().then((res) => {
      if (res.success && res.data) {
        if (res.data.step) setCurrentStep(res.data.step);
        const data = res.data.onboardingData || {};
        if (data.companyInfo) {
          if (data.companyInfo.companyName) setCompanyName(data.companyInfo.companyName);
          if (data.companyInfo.website) setWebsite(data.companyInfo.website);
          if (data.companyInfo.country) setCountry(data.companyInfo.country);
          if (data.companyInfo.size) setSize(data.companyInfo.size);
          if (data.companyInfo.industry) setIndustry(data.companyInfo.industry);
        }
        if (data.profile) {
          if (data.profile.description) setDescription(data.profile.description);
          if (data.profile.timezone) setTimezone(data.profile.timezone);
        }
        if (data.hiring) {
          if (data.hiring.primaryRole) setPrimaryRole(data.hiring.primaryRole);
          if (data.hiring.targetHiresCount) setTargetHiresCount(data.hiring.targetHiresCount);
          if (data.hiring.targetStack) setTargetStack(data.hiring.targetStack);
          if (data.hiring.annualBudgetUsd) setAnnualBudgetUsd(data.hiring.annualBudgetUsd);
        }
      }
      setLoading(false);
    });
  }, []);

  const saveStepData = async (nextStep: number) => {
    setSaving(true);
    try {
      const payload = {
        companyInfo: { companyName, website, country, size, industry },
        profile: { description, timezone },
        hiring: { primaryRole, targetHiresCount, targetStack, annualBudgetUsd },
        team: teamList,
        billing: { billingContact, billingAddress, paymentTerms },
      };

      await api.saveOnboardingProgress(nextStep, payload);
      setCurrentStep(nextStep);
    } catch {
      setCurrentStep(nextStep);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeammate = () => {
    if (teammateEmail) {
      setTeamList([...teamList, { email: teammateEmail, role: teammateRole }]);
      setTeammateEmail('');
    }
  };

  const handleFinishOnboarding = async () => {
    setSaving(true);
    await saveStepData(6);
    navigate('/company/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD] text-slate-500 text-sm">
        Loading workspace setup parameters...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FAFBFD] text-[#0F172A] py-10 px-4 sm:px-6 lg:px-8 antialiased"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/company"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
              TH
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900">Talent Hire</span>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Workspace Setup Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Enterprise Onboarding
          </h1>
          <p className="text-[13px] text-slate-500 max-w-md mx-auto">
            Set up your organizational parameters to begin receiving verified engineering shortlists
          </p>
        </div>

        {/* 6-Step Visual Progress Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 relative">
            {[
              { s: 1, label: 'Company' },
              { s: 2, label: 'Profile' },
              { s: 3, label: 'Hiring' },
              { s: 4, label: 'Team' },
              { s: 5, label: 'Billing' },
              { s: 6, label: 'Ready' },
            ].map((item) => (
              <div key={item.s} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div
                  className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs transition-all ${
                    currentStep > item.s
                      ? 'bg-emerald-500 text-white'
                      : currentStep === item.s
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
                </div>
                <span
                  className={`text-[11px] hidden sm:block ${
                    currentStep === item.s ? 'text-slate-900 font-bold' : 'text-slate-400 font-normal'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Container Card */}
        <div className="bg-white border border-slate-200/90 rounded-[32px] p-6 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.04)] space-y-6">
          {/* STEP 1: COMPANY INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-700" />
                Step 1: General Company Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Headquarters Location</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  >
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500+">500+ Enterprise</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COMPANY PROFILE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-700" />
                Step 2: Company Profile & Engineering Context
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Company Mission & Technical Overview
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your platform architecture, stack culture, and technical challenges..."
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Operating Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HIRING NEEDS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-slate-700" />
                Step 3: Initial Hiring Target
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Engineering Role</label>
                  <input
                    type="text"
                    value={primaryRole}
                    onChange={(e) => setPrimaryRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Number of Openings</label>
                  <input
                    type="number"
                    min={1}
                    value={targetHiresCount}
                    onChange={(e) => setTargetHiresCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Key Technical Stack Required</label>
                  <input
                    type="text"
                    value={targetStack}
                    onChange={(e) => setTargetStack(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Annual Salary Budget (USD)</label>
                  <input
                    type="number"
                    value={annualBudgetUsd}
                    onChange={(e) => setAnnualBudgetUsd(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 font-bold transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TEAM MEMBERS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-700" />
                Step 4: Hiring Team Members
              </h2>
              <div className="flex gap-2 text-xs">
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={teammateEmail}
                  onChange={(e) => setTeammateEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
                <select
                  value={teammateRole}
                  onChange={(e) => setTeammateRole(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none"
                >
                  <option value="COMPANY_HIRING_MANAGER">Hiring Manager</option>
                  <option value="COMPANY_RECRUITER">Recruiter</option>
                  <option value="COMPANY_ADMIN">Admin</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddTeammate}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {teamList.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-800 font-medium">{t.email}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-white border border-slate-200">
                      {t.role.replace('COMPANY_', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: BILLING INFORMATION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-700" />
                Step 5: Corporate Invoicing & Billing
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Accounts Payable Contact Email</label>
                  <input
                    type="email"
                    value={billingContact}
                    onChange={(e) => setBillingContact(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Registered Billing Address</label>
                  <input
                    type="text"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Agreed Invoicing Terms</label>
                  <input
                    type="text"
                    readOnly
                    value="NET 30 Corporate Invoicing (Standard placement warranty upon candidate start date)"
                    className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: VERIFICATION & COMPLETE */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900">Your Hiring Workspace is Ready</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {companyName} has been provisioned. You can now publish your first opening and access calibrated
                  engineering candidates.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-600">
                  <span>Organization:</span>
                  <span className="font-bold text-slate-900">{companyName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Billing Tier:</span>
                  <span className="font-bold text-emerald-600">ENTERPRISE (NET 30)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>90-Day Placement Warranty:</span>
                  <span className="font-bold text-slate-900">ACTIVE & COVERED</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 && currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => saveStepData(currentStep + 1)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Proceed'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={handleFinishOnboarding}
                className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {saving ? 'Launching...' : 'Launch Company Dashboard'} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
