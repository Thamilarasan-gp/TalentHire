import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Building2, ShieldCheck, ArrowRight, AlertCircle, User, Mail, Lock, Globe, ChevronLeft } from 'lucide-react';

export const CompanyRegister: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('United States');
  const [size, setSize] = useState('51-200');
  const [industry, setIndustry] = useState('Technology');
  const [role] = useState('COMPANY_ADMIN');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@') || email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@hotmail.com')) {
      setError('Please use an official corporate work email address (e.g. name@company.com)');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await api.registerCompany({
        fullName,
        email,
        password,
        companyName,
        website,
        country,
        size,
        industry,
        role,
      });

      if (res.success && res.data) {
        navigate('/company/onboarding');
      } else {
        setError(res.error || 'Failed to create company account. Please check your details.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while creating company account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#FAFBFD] text-[#0F172A] antialiased"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Top Header Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          to="/company"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link to="/company" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
            TH
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">Talent Hire</span>
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-xl w-full mx-auto my-6 bg-white border border-slate-200/90 rounded-[32px] p-8 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.05)] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-900">
            <Building2 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Company Account
          </h1>
          <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
            Access pre-evaluated software engineers and manage technical shortlists
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="David Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Vanguard FinTech Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Country / HQ</label>
              <input
                type="text"
                required
                placeholder="United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Enterprise</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
              >
                <option value="Technology">Technology</option>
                <option value="FinTech">FinTech</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="HealthTech & AI">HealthTech & AI</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Enterprise SaaS">Enterprise SaaS</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-[13px] shadow-sm hover:shadow transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Continue to Workspace Setup ›'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/company/login" className="text-slate-900 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center py-2 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Talent Hire. Enterprise Technical Recruitment System.
      </div>
    </div>
  );
};
