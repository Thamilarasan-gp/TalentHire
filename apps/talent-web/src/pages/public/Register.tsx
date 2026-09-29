import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import { ShieldCheck, Sparkles, Building2, CheckCircle2, Flame, ArrowRight, UserCheck } from 'lucide-react';

const COMMON_SKILLS = ['React', 'Node.js', 'TypeScript', 'Next.js', 'Python', 'FastAPI', 'Java', 'Spring Boot', 'Go', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB'];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Full Stack Engineer');
  const [experienceYears, setExperienceYears] = useState(3);
  const [location, setLocation] = useState('Bengaluru, India');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Node.js', 'TypeScript']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please provide your full name, email, and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.registerCandidate({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        primaryRole,
        totalYearsOfExperience: Number(experienceYears) || 3,
        location,
        skills: selectedSkills,
      });

      if (res.success && res.data) {
        const user = res.data.user;
        localStorage.setItem('tg_user', JSON.stringify(user));
        if (res.data.token) {
          localStorage.setItem('tg_token', res.data.token);
        }
        window.dispatchEvent(new Event('auth-change'));
        navigate('/talent/dashboard');
      } else {
        setError(res.error || 'Registration failed. Please check your details.');
      }
    } catch {
      setError('Connection to Central API failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 border border-slate-200/90 rounded-3xl shadow-sm">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src="/inayon-dark.png" alt="Inayon" className="h-10 sm:h-12 w-auto mx-auto object-contain" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Create Candidate Account
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Get 10 Free Evaluation Credits, verify your tech skills once, and apply directly to global hiring teams.
          </p>
        </div>

        {/* Free Evaluation Quota Callout */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs">
          <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              10 Free Evaluation Passes Included
            </span>
            <span className="text-[11px] text-slate-600 block">
              Take live technical assessments evaluated by independent Principal/Staff engineers without paying any fees.
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Karthik Iyer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. karthik.iyer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Role</label>
              <select
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Senior Backend Engineer">Senior Backend Engineer</option>
                <option value="Frontend Architect">Frontend Architect</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Experience (Years)</label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value={1}>0 - 1 years</option>
                <option value={2}>2 years</option>
                <option value={3}>3 years</option>
                <option value={5}>5 years</option>
                <option value={7}>7+ years</option>
                <option value={10}>10+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, India or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Your Core Skills
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
              {COMMON_SKILLS.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? `✓ ${sk}` : `+ ${sk}`}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            size="md"
            isLoading={loading}
            className="w-full py-3 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Create Candidate Profile</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Footer switcher */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
          <p className="text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>

          <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <span>Hiring company looking to recruit?</span>
            <a
              href="http://localhost:3002/company/register"
              className="text-slate-600 hover:text-blue-600 font-semibold inline-flex items-center gap-1 ml-1"
            >
              <Building2 className="w-3 h-3" />
              Company Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
