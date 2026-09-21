import React, { useState, useEffect } from 'react';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import {
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  AlertCircle,
  Save,
  Lock
} from 'lucide-react';

export const CompanySettings: React.FC = () => {
  // Personal Details State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roleTitle, setRoleTitle] = useState('');

  // Company Details State
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('51-200');
  const [description, setDescription] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [personalSuccessMsg, setPersonalSuccessMsg] = useState('');
  const [companySuccessMsg, setCompanySuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([api.getMe(), api.getCompanyMe()])
      .then(([userRes, compRes]) => {
        if (userRes.success && userRes.data) {
          const u = userRes.data;
          setFirstName(u.firstName || u.fullName?.split(' ')[0] || '');
          setLastName(u.lastName || u.fullName?.split(' ').slice(1).join(' ') || '');
          setEmail(u.email || '');
          setPhoneNumber((u as any).phoneNumber || u.phone || '');
          setRoleTitle(u.role?.replace('COMPANY_', '') || 'Talent Acquisition Leader');
        }

        if (compRes.success && compRes.data) {
          const c = compRes.data;
          setCompanyName(c.name || '');
          setWebsite(c.website || '');
          setHeadquarters(c.headquarters || '');
          setIndustry(c.industry || 'Technology');
          setSize(c.size || '51-200');
          setDescription(c.description || '');
        }
      })
      .catch((err) => {
        setErrorMsg('Failed to load profile details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    setPersonalSuccessMsg('');
    setErrorMsg('');

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await api.updateUserMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName,
        phoneNumber: phoneNumber.trim(),
      });

      if (res.success) {
        setPersonalSuccessMsg('Personal profile details successfully updated!');
        setTimeout(() => setPersonalSuccessMsg(''), 3500);
      } else {
        setErrorMsg(res.error || 'Failed to update personal profile.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving personal details.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanySuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.updateCompanyMe({
        name: companyName.trim(),
        website: website.trim(),
        headquarters: headquarters.trim(),
        industry: industry.trim(),
        size,
        description: description.trim(),
      });

      if (res.success) {
        setCompanySuccessMsg('Company details successfully updated in database!');
        setTimeout(() => setCompanySuccessMsg(''), 3500);
      } else {
        setErrorMsg(res.error || 'Failed to update company details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving company details.');
    } finally {
      setSavingCompany(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-12 w-80 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-72 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans">
      {/* 1. Page Header with Status Badge & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/70">
              Workspace Settings
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 font-medium">Talenthire Enterprise Cloud</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Account &amp; Organization Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your personal administrative credentials, corporate profile, and data confidentiality preferences.
          </p>
        </div>

      
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* 2. PERSONAL DETAILS CARD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <form onSubmit={handleSavePersonal}>
          {/* Card Header */}
          <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                {(firstName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Personal Administrative Profile</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {roleTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your identity across interview panels, feedback logs, and candidate correspondence
                </p>
              </div>
            </div>

            {personalSuccessMsg && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{personalSuccessMsg}</span>
              </span>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>First Name</span>
                  <span className="text-[10px] font-semibold text-blue-600">Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Last Name</span>
                  <span className="text-[10px] font-semibold text-blue-600">Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Morgan"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Corporate Email</span>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Read-only ID
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-3.5 text-xs text-slate-500 font-semibold cursor-not-allowed outline-none select-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Primary corporate SSO and notification recipient for this workspace.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Direct Contact Phone</span>
                  <span className="text-[10px] font-semibold text-slate-400">Optional</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Used for urgent interview schedule alerts and candidate confirmations.
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer with Neatly Aligned Button */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              All changes update live in your active session.
            </span>
            <button
              type="submit"
              disabled={savingPersonal}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingPersonal ? 'Saving Profile...' : 'Save Personal Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. COMPANY & ORGANIZATION DETAILS CARD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <form onSubmit={handleSaveCompany}>
          {/* Card Header */}
          <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shadow-md shadow-slate-900/10 shrink-0">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Organization &amp; Brand Profile</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Employer
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Display details presented to pre-evaluated engineering candidates during matching
                </p>
              </div>
            </div>

            {companySuccessMsg && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{companySuccessMsg}</span>
              </span>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Legal Organization Name</span>
                  <span className="text-[10px] font-semibold text-blue-600">Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Vanguard FinTech Inc."
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Corporate Website</span>
                  <span className="text-[10px] font-semibold text-slate-400">Public URL</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://vanguard-fintech.com"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Headquarters</label>
                <div className="relative">
                  <input
                    type="text"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Industry Sector</label>
                <div className="relative">
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Financial Technology"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 text-xs text-slate-900 font-medium outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Company Scale</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 font-semibold outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                >
                  <option value="1-10">1-10 Employees (Seed)</option>
                  <option value="11-50">11-50 Employees (Series A)</option>
                  <option value="51-200">51-200 Employees (Growth)</option>
                  <option value="201-500">201-500 Employees (Scaleup)</option>
                  <option value="500+">500+ Employees (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Engineering Mission &amp; Overview</span>
                <span className="text-[10px] font-medium text-slate-400">Shown on candidate pitch sheets</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your tech stack, engineering culture, and the challenges candidates will solve..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-medium leading-relaxed outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Card Footer with Neatly Aligned Button */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Updates reflect immediately across matches and shortlists.
            </span>
            <button
              type="submit"
              disabled={savingCompany}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingCompany ? 'Saving Company...' : 'Save Organization Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. TENANT ISOLATION & COMPLIANCE (Security Guarantee) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Tenant Isolation &amp; Confidentiality Guarantee</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographic and schema-level guarantees enforced by Talenthire Platform Infrastructure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Strict Workspace Data Boundary</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                All hiring requirements, private interview feedback, salary offers, and internal candidate notes are partitioned exclusively to your organization ID in MongoDB Atlas.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Evaluator Conflict-of-Interest Wall</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Independent evaluators who have previously worked at your company or competitors are programmatically filtered out from reviewing candidates for your open roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

