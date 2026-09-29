import React, { useEffect, useState } from 'react';
import { Candidate } from '@thamilarasan/types';
import { api } from '@thamilarasan/api-client';
import { formatUSD } from '@thamilarasan/utils';
import { Button, StatusBadge } from '@thamilarasan/ui';
import {
  ShieldCheck,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Languages,
  Edit3,
  X,
  Check,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const TalentProfile: React.FC = () => {
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Form State
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    languages: 'English, Tamil',
    totalYearsOfExperience: 4,
    expectedSalaryUsd: 85000,
    noticePeriodDays: 30,
    engagementType: 'FULL_TIME_REMOTE',
    summary: '',
    skills: [] as string[],
    newSkillInput: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getCandidateId = () => {
    try {
      const stored = localStorage.getItem('tg_user');
      const u = stored ? JSON.parse(stored) : null;
      return u?.candidateId || u?.id || 'cand-1';
    } catch {
      return 'cand-1';
    }
  };

  const loadProfile = () => {
    setLoading(true);
    const cid = getCandidateId();
    api.getCandidate(cid)
      .then((res) => {
        if (res.success && res.data) {
          const c: any = res.data;
          setCandidate(c);
          initFormData(c);
        } else {
          try {
            const stored = localStorage.getItem('tg_user');
            if (stored) {
              const u = JSON.parse(stored);
              const fallback: any = {
                id: u.candidateId || u.id || cid,
                fullName: u.fullName || 'Thamilarasan',
                headline: u.headline || 'Full Stack Engineer | 4 yrs exp',
                email: u.email || 'thamil@example.com',
                phone: u.phoneNumber || u.phone || '+91 98765 43210',
                location: u.location || 'Chennai, India',
                languages: ['English', 'Tamil'],
                totalYearsOfExperience: u.totalYearsOfExperience || 4,
                state: 'VERIFIED',
                noticePeriodDays: 30,
                expectedSalaryUsd: 85000,
                engagementType: 'FULL_TIME_REMOTE',
                summary: `${u.fullName || 'Thamilarasan'} is an evaluated engineering professional specializing in full-stack web platforms, distributed APIs, and scalable architectures.`,
                skills: (u.skills || ['React', 'Node.js', 'TypeScript', 'MongoDB']).map((s: string) => ({
                  name: s,
                  yearsOfExperience: 3,
                  level: 'ADVANCED',
                  isVerified: true,
                })),
                experience: [],
              };
              setCandidate(fallback);
              initFormData(fallback);
            }
          } catch {}
        }
      })
      .finally(() => setLoading(false));
  };

  const initFormData = (c: any) => {
    const rawSkills = c.skills || [];
    const skillNames = rawSkills.map((sk: any) => (typeof sk === 'string' ? sk : sk?.name || String(sk)));

    const rawLang = c.languages || c.languagesKnown || ['English', 'Tamil'];
    const langStr = Array.isArray(rawLang) ? rawLang.join(', ') : String(rawLang);

    setFormData({
      fullName: c.fullName || '',
      headline: c.headline || '',
      email: c.email || '',
      phone: c.phone || c.phoneNumber || '',
      location: c.location || '',
      languages: langStr,
      totalYearsOfExperience: c.totalYearsOfExperience ?? 4,
      expectedSalaryUsd: c.expectedSalaryUsd ?? 85000,
      noticePeriodDays: c.noticePeriodDays ?? 30,
      engagementType: c.engagementType || 'FULL_TIME_REMOTE',
      summary: c.summary || '',
      skills: skillNames,
      newSkillInput: '',
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cid = getCandidateId();
      const languagesArray = formData.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      const formattedSkills = formData.skills.map((s) => ({
        name: s,
        yearsOfExperience: Math.max(1, Math.floor(formData.totalYearsOfExperience * 0.7)),
        level: 'ADVANCED',
        isVerified: true,
      }));

      const payload = {
        fullName: formData.fullName,
        headline: formData.headline,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        languages: languagesArray,
        totalYearsOfExperience: Number(formData.totalYearsOfExperience),
        expectedSalaryUsd: Number(formData.expectedSalaryUsd),
        noticePeriodDays: Number(formData.noticePeriodDays),
        engagementType: formData.engagementType,
        summary: formData.summary,
        skills: formattedSkills,
      };

      const res = await api.updateCandidate(cid, payload);

      if (res.success && res.data) {
        setCandidate({
          ...candidate,
          ...res.data,
          email: formData.email,
          phone: formData.phone,
          languages: languagesArray,
        });

        // Sync local storage user so header, navbar and dropdown show updated name & email
        try {
          const stored = localStorage.getItem('tg_user');
          if (stored) {
            const user = JSON.parse(stored);
            user.fullName = formData.fullName;
            user.email = formData.email;
            user.phone = formData.phone;
            user.location = formData.location;
            localStorage.setItem('tg_user', JSON.stringify(user));
            window.dispatchEvent(new Event('auth-change'));
          }
        } catch {}

        setIsEditing(false);
        showToast('Profile updated successfully!');
      } else {
        alert(res.error || 'Failed to update profile');
      }
    } catch (err: any) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = formData.newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
        newSkillInput: '',
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading profile...</div>;
  if (!candidate) return <div className="p-12 text-center text-slate-400">No profile found.</div>;

  const candidateName = candidate.fullName || 'Candidate';
  const initial = candidateName.charAt(0) || 'C';
  const skillsList = candidate.skills || [];
  const experienceList = candidate.experience || [];
  const engagementLabel = candidate.engagementType ? candidate.engagementType.replace(/_/g, ' ') : 'Full Time Remote';
  const executiveSummary =
    candidate.summary ||
    `${candidateName} is an evaluated engineering professional with ${candidate.totalYearsOfExperience || 3}+ years of proven production experience in distributed systems and modern web technologies.`;

  const parsedLanguages = Array.isArray(candidate.languages)
    ? candidate.languages
    : typeof candidate.languages === 'string'
    ? candidate.languages.split(',').map((l: string) => l.trim())
    : ['English', 'Tamil'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
            {initial}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidateName}</h1>
              <StatusBadge status={candidate.state || 'VERIFIED'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-medium">{candidate.headline || 'Software Engineer'}</p>

            {/* Contact & Language metadata strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1.5">
              {candidate.email && (
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> {candidate.email}
                </span>
              )}
              {candidate.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> {candidate.phone}
                  </span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {candidate.location || 'India'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Languages className="w-3.5 h-3.5 text-indigo-600" /> {parsedLanguages.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (!isEditing) initFormData(candidate);
              setIsEditing(!isEditing);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
              isEditing
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* EDIT PROFILE FORM MODE */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Edit Profile Information</h2>
              <p className="text-xs text-slate-500">Update your personal, contact, salary, and skill details.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-75"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Personal & Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="e.g. Thamilarasan"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="e.g. Senior Full Stack Engineer | 4 yrs exp"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="e.g. thamil@example.com"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="e.g. Chennai, India"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Languages Known (comma separated)</label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="e.g. English, Tamil, Hindi"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Career, Compensation & Notice Period */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Career & Compensation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.totalYearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, totalYearsOfExperience: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Annual Salary (USD)</label>
                <input
                  type="number"
                  step="1000"
                  min="10000"
                  value={formData.expectedSalaryUsd}
                  onChange={(e) => setFormData({ ...formData, expectedSalaryUsd: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={formData.noticePeriodDays}
                  onChange={(e) => setFormData({ ...formData, noticePeriodDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Engagement Type</label>
              <select
                value={formData.engagementType}
                onChange={(e) => setFormData({ ...formData, engagementType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-white"
              >
                <option value="FULL_TIME_REMOTE">Full Time Remote</option>
                <option value="FULL_TIME_ON_SITE">Full Time On-Site</option>
                <option value="CONTRACT_REMOTE">Contract Remote</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>
          </div>

          {/* Section 3: Executive Summary / Bio */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Summary</h3>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 leading-relaxed"
              placeholder="Provide a short professional summary outlining your technical strengths and architectural focus..."
            />
          </div>

          {/* Section 4: Skills Editor */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills & Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-sm pt-1">
              <input
                type="text"
                value={formData.newSkillInput}
                onChange={(e) => setFormData({ ...formData, newSkillInput: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                placeholder="Add a skill (e.g. Next.js)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      ) : null}

      {/* Summary */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Summary</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{executiveSummary}</p>
      </div>

      {/* Verified Skills */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skills & Verified Proficiencies
          </h3>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Evaluated by Staff Engineers
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skillsList.map((skill: any, idx: number) => {
            const skillName = typeof skill === 'string' ? skill : skill?.name || 'Skill';
            const expYears = typeof skill === 'object' ? skill.yearsOfExperience || skill.minYears || 3 : 3;
            const level = typeof skill === 'object' && skill.level ? skill.level : 'PROFICIENT';
            const isVerified = typeof skill === 'object' ? Boolean(skill.isVerified) : true;

            return (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{skillName}</span>
                  <span className="text-[10px] text-slate-500">
                    {expYears} yrs • {level}
                  </span>
                </div>
                {isVerified && <ShieldCheck className="w-4 h-4 text-blue-600" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Experience */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Experience</h3>
        <div className="space-y-6">
          {experienceList.length > 0 ? (
            experienceList.map((exp: any, idx: number) => (
              <div key={idx} className="border-l-2 border-blue-600 pl-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{exp.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-semibold">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(exp.technologies || []).map((t: string) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="border-l-2 border-blue-600 pl-4 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{candidate.headline || 'Software Engineer'}</h4>
                <span className="text-[11px] text-slate-400 font-mono">Verified Portfolio</span>
              </div>
              <p className="text-xs text-blue-600 font-semibold">
                {candidate.location || 'India'} • {candidate.totalYearsOfExperience || 3} Years Experience
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                Hands-on architecture, API design, and full-stack software development verified by standardized evaluation
                benchmarks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compensation & Availability Details */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Compensation & Engagement Expectations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              TARGET SALARY (USD)
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {formatUSD(candidate.expectedSalaryUsd || 85000)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              NOTICE PERIOD
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {candidate.noticePeriodDays ?? 30} Days
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              ENGAGEMENT TYPE
            </span>
            <span className="text-base font-extrabold text-slate-900">{engagementLabel}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              LANGUAGES KNOWN
            </span>
            <span className="text-base font-extrabold text-slate-900">{parsedLanguages.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
