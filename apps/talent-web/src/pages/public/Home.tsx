import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Users,
  Star,
  Globe2,
  Zap,
  Building,
  Building2,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Calendar,
  Handshake,
  Bot,
  MapPin,
  Briefcase,
  ShieldCheck,
  Play,
  X
} from 'lucide-react';
const heroBgImage = '/inayon-hero-bg.jpg';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Active filter for jobs
  const [activeCategory, setActiveCategory] = useState('All Roles');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const categories = [
    'All Roles',
    'Frontend',
    'Backend',
    'Full Stack',
    'Mobile',
    'DevOps',
    'AI/ML',
    'Data',
    'Design',
  ];

  const jobs = [
    {
      company: 'Spotify',
      companyColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      logoText: 'Spotify',
      role: 'Frontend Developer',
      location: 'Stockholm, Sweden',
      remote: 'Remote',
      tags: ['React', 'TypeScript', 'Next.js'],
      salary: '€45K – €65K',
      posted: '2 days ago',
      category: 'Frontend',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center text-white shadow-xs">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.218.358-.68.472-1.038.254-2.846-1.74-6.428-2.133-10.648-1.17-.406.094-.808-.16-.902-.566-.094-.407.16-.809.566-.903 4.628-1.057 8.59-.61 11.768 1.348.358.218.47.68.254 1.037zm1.47-3.267c-.274.444-.86.586-1.304.312-3.257-2.002-8.223-2.584-12.076-1.413-.497.151-1.026-.134-1.177-.63-.151-.497.134-1.027.63-1.178 4.41-1.34 9.89-.693 13.615 1.605.444.274.586.86.312 1.304zm.126-3.41c-3.905-2.318-10.34-2.532-14.075-1.398-.598.182-1.233-.162-1.414-.76-.182-.598.162-1.234.76-1.415 4.3-1.306 11.414-1.05 15.892 1.608.537.319.715 1.018.396 1.555-.318.537-1.018.715-1.559.41z"/>
          </svg>
        </div>
      )
    },
    {
      company: 'Revolut',
      companyColor: 'bg-slate-900 text-white',
      logoText: 'Revolut',
      role: 'Backend Engineer',
      location: 'London, UK',
      remote: 'Remote',
      tags: ['Node.js', 'Python', 'AWS'],
      salary: '€55K – €80K',
      posted: '3 days ago',
      category: 'Backend',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-extrabold text-base shadow-xs tracking-tight">
          R
        </div>
      )
    },
    {
      company: 'Klarna',
      companyColor: 'bg-pink-100 text-pink-700',
      logoText: 'Klarna',
      role: 'Full Stack Developer',
      location: 'Berlin, Germany',
      remote: 'Remote',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      salary: '€50K – €75K',
      posted: '4 days ago',
      category: 'Full Stack',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-[#FFB3C7] flex items-center justify-center text-slate-950 font-black text-base shadow-xs">
          K
        </div>
      )
    },
    {
      company: 'N26',
      companyColor: 'bg-teal-50 text-teal-700',
      logoText: 'N26',
      role: 'Mobile Developer',
      location: 'Vienna, Austria',
      remote: 'Remote',
      tags: ['React Native', 'TypeScript'],
      salary: '€48K – €70K',
      posted: '5 days ago',
      category: 'Mobile',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-[#00897B] flex items-center justify-center text-white font-bold text-xs shadow-xs tracking-tight">
          N26
        </div>
      )
    }
  ];

  const filteredJobs = activeCategory === 'All Roles'
    ? jobs
    : jobs.filter(j => j.category === activeCategory);

  // Search Bar State matching Image 2
  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('Anywhere');
  const [searchCategory, setSearchCategory] = useState('All Roles');
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchRole) params.set('q', searchRole);
    if (searchLocation !== 'Anywhere' && searchLocation !== 'All Europe') params.set('location', searchLocation);
    if (searchCategory !== 'All Roles') params.set('category', searchCategory);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleOpenEvalModal = () => {
    window.dispatchEvent(new Event('open-eval-modal'));
  };

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ============================================================== */}
      {/* 1. HERO SECTION matching Image 2 with inayon-hero-bg.jpg       */}
      {/* ============================================================== */}
      <section
        id="hero"
        className="relative isolate w-full min-h-screen flex flex-col justify-between overflow-hidden pt-28 sm:pt-32 pb-10 sm:pb-14 bg-slate-950 text-white"
      >
        {/* Full-bleed background image from Image 1 */}
        <div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-cover bg-no-repeat bg-center select-none bg-slate-950"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        >
          <img
            src={heroBgImage}
            alt="Inayon Global Opportunities"
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
          />
          {/* Left-side dark gradient to ensure 100% crystal contrast for headlines & controls */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 md:via-slate-950/40 to-transparent" />
          {/* Subtle top vignette for seamless navbar transition */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/75 via-slate-950/20 to-transparent" />
          {/* Bottom vignette to frame the 3 glass cards and terrace */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        </div>

        {/* Ambient Building Edge Tag matching Image 2 */}
        <div className="hidden 2xl:flex flex-col items-center gap-2 absolute top-36 right-10 text-white/50 text-[10px] tracking-[0.35em] uppercase font-mono font-medium pointer-events-none select-none z-10">
          <span>PEOPLE</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>TECHNOLOGY</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>GLOBAL GROWTH</span>
        </div>

        {/* Top/Center Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-4 sm:pt-6">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            
            {/* Eyebrow Tag matching Image 2 */}
            <p className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-white/90 uppercase select-none">
              CONNECT <span className="text-white/40 mx-1.5">•</span> EVALUATE <span className="text-white/40 mx-1.5">•</span> GROW
            </p>

            {/* Main Headline matching Image 2 */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4.15rem] xl:text-[4.5rem] font-bold text-white tracking-tight leading-[1.07] drop-shadow-sm">
              Global Opportunities <br />
              for Real Talent
            </h1>

            {/* Subhead matching Image 2 */}
            <p className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal pt-1">
              Inayon connects exceptional Indian talent with global companies, building careers, innovation and a borderless tomorrow.
            </p>

            {/* Unified Rounded Search Bar matching Image 2 */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 sm:mt-8 p-1.5 sm:p-2 rounded-full bg-white shadow-2xl border border-white/60 flex flex-col md:flex-row items-center gap-2 max-w-2xl text-slate-900"
            >
              <div className="flex items-center gap-2.5 pl-3.5 flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs, skills, companies, or locations..."
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="hidden md:block h-6 w-px bg-slate-200" />

              {/* Location dropdown matching Image 2 */}
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-700 shrink-0 relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="Anywhere">Anywhere</option>
                  <option value="Berlin, Germany">Berlin, Germany</option>
                  <option value="London, UK">London, UK</option>
                  <option value="Amsterdam, Netherlands">Amsterdam, Netherlands</option>
                  <option value="Stockholm, Sweden">Stockholm, Sweden</option>
                  <option value="Paris, France">Paris, France</option>
                  <option value="Remote">100% Remote</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-0" />
              </div>

              <div className="hidden md:block h-6 w-px bg-slate-200" />

              {/* Role dropdown matching Image 2 */}
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-700 shrink-0 relative">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="AI/ML">AI / ML</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Design">Design</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-0" />
              </div>

              {/* Search Button matching Image 2 */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* 4 Stats Row matching Image 2 */}
            <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-12 text-white">
              {/* Stat 1: 10M+ Talented Professionals */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">10M+</div>
                  <div className="text-[11px] sm:text-xs text-white/75 font-normal leading-tight mt-0.5">Talented Professionals</div>
                </div>
              </div>

              {/* Stat 2: 50K+ Global Companies */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">50K+</div>
                  <div className="text-[11px] sm:text-xs text-white/75 font-normal leading-tight mt-0.5">Global Companies</div>
                </div>
              </div>

              {/* Stat 3: 150+ Countries */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">150+</div>
                  <div className="text-[11px] sm:text-xs text-white/75 font-normal leading-tight mt-0.5">Countries</div>
                </div>
              </div>

              {/* Stat 4: 98% Successful Matches */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">98%</div>
                  <div className="text-[11px] sm:text-xs text-white/75 font-normal leading-tight mt-0.5">Successful Matches</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: 3 Floating Glass Cards on Left + "Watch Our Story" on Right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-8 sm:pt-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            
            {/* 3 Glass Cards matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full lg:max-w-3xl">
              
              {/* Card 1: For Talent */}
              <Link
                to="/jobs"
                className="group rounded-2xl bg-slate-950/45 hover:bg-slate-950/60 backdrop-blur-xl border border-white/15 hover:border-white/35 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white group-hover:scale-105 transition-transform shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">For Talent</h2>
                    <p className="text-[11px] text-white/70 leading-snug mt-0.5">Discover global opportunities</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              {/* Card 2: For Companies */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('for-companies');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group rounded-2xl bg-slate-950/45 hover:bg-slate-950/60 backdrop-blur-xl border border-white/15 hover:border-white/35 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all duration-300 shadow-xl text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white group-hover:scale-105 transition-transform shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">For Companies</h2>
                    <p className="text-[11px] text-white/70 leading-snug mt-0.5">Hire pre-vetted top Indian talent</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Card 3: For Evaluators */}
              <button
                type="button"
                onClick={handleOpenEvalModal}
                className="group rounded-2xl bg-slate-950/45 hover:bg-slate-950/60 backdrop-blur-xl border border-white/15 hover:border-white/35 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all duration-300 shadow-xl text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white group-hover:scale-105 transition-transform shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">For Evaluators</h2>
                    <p className="text-[11px] text-white/70 leading-snug mt-0.5">Industry experts earn & contribute</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

            </div>

            {/* Bottom Right: "Watch Our Story" button matching Image 2 */}
            <div className="shrink-0 mb-1 self-end">
              <button
                type="button"
                onClick={() => setStoryModalOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/45 hover:bg-slate-950/65 backdrop-blur-md border border-white/20 hover:border-white/40 text-white text-xs font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span className="tracking-wide">Watch Our Story</span>
              </button>
            </div>

          </div>
        </div>

        {/* Video Story Modal */}
        {storyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-white/20 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">The Inayon Story</h3>
                    <p className="text-xs text-slate-400">Connecting Indian engineering excellence with global tech leaders</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStoryModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                <img
                  src="/inayon-hero-bg.jpg"
                  alt="Inayon Story Preview"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute flex flex-col items-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                    <Play className="w-7 h-7 fill-white text-white ml-1" />
                  </div>
                  <p className="text-sm font-semibold text-white">Experience the borderless engineering revolution</p>
                  <p className="text-xs text-slate-300 max-w-md">Hear from European CTOs and verified Indian engineers working together through Inayon's evaluation standard.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 2. TRUSTED BY INNOVATIVE COMPANIES ACROSS EUROPE               */}
      {/* ============================================================== */}
      <section className="py-10 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-8">
            Trusted by innovative companies across Europe
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-85 hover:opacity-100 transition-opacity">
            {/* Spotify */}
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-lg">
              <svg className="w-5 h-5 fill-current text-slate-800" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.218.358-.68.472-1.038.254-2.846-1.74-6.428-2.133-10.648-1.17-.406.094-.808-.16-.902-.566-.094-.407.16-.809.566-.903 4.628-1.057 8.59-.61 11.768 1.348.358.218.47.68.254 1.037zm1.47-3.267c-.274.444-.86.586-1.304.312-3.257-2.002-8.223-2.584-12.076-1.413-.497.151-1.026-.134-1.177-.63-.151-.497.134-1.027.63-1.178 4.41-1.34 9.89-.693 13.615 1.605.444.274.586.86.312 1.304zm.126-3.41c-3.905-2.318-10.34-2.532-14.075-1.398-.598.182-1.233-.162-1.414-.76-.182-.598.162-1.234.76-1.415 4.3-1.306 11.414-1.05 15.892 1.608.537.319.715 1.018.396 1.555-.318.537-1.018.715-1.559.41z"/>
              </svg>
              <span>Spotify</span>
            </div>

            {/* Revolut */}
            <div className="font-extrabold text-slate-800 text-lg tracking-tight">
              Revolut
            </div>

            {/* Zalando */}
            <div className="font-bold text-slate-800 text-lg tracking-tight lowercase">
              zalando
            </div>

            {/* Delivery Hero */}
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>delivery hero</span>
            </div>

            {/* Klarna. */}
            <div className="font-black text-slate-900 text-xl tracking-tight">
              Klarna.
            </div>

            {/* N26 */}
            <div className="border border-slate-800 px-2 py-0.5 rounded font-black text-slate-800 text-sm">
              N26
            </div>

            {/* SAP */}
            <div className="bg-[#0070F2] text-white px-2 py-0.5 rounded font-black text-sm tracking-wider">
              SAP
            </div>

            {/* Booking.com */}
            <div className="font-black text-[#003580] text-base tracking-tight">
              Booking.com
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. WHY CHOOSE US                                               */}
      {/* ============================================================== */}
      <section id="for-talent" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, intro, button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>WHY CHOOSE US</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                A Modern Hiring Platform for a{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Borderless World.
                </span>
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                We combine verified talent, expert evaluations, and efficient matching to help global companies build world-class teams from India.
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Right Column: 2x2 Feature Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Vetted Talent */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Vetted Talent</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Skill-tested and interviewed by industry experts.
                </p>
              </div>

              {/* Card 2: Expert Evaluations */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Expert Evaluations</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Get unbiased technical evaluations from senior engineers.
                </p>
              </div>

              {/* Card 3: Global Opportunities */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Global Opportunities</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Work with top European startups and companies remotely.
                </p>
              </div>

              {/* Card 4: Faster Hiring */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Faster Hiring</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reduce hiring time with our smart matching engine.
                </p>
              </div>

            </div>

          </div>

          {/* Metric Counter Bar matching screenshot */}
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-slate-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            
            {/* Stat 1 */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">10K+</p>
                <p className="text-xs text-slate-500 font-medium">Developers</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">500+</p>
                <p className="text-xs text-slate-500 font-medium">Global Companies</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">2K+</p>
                <p className="text-xs text-slate-500 font-medium">Expert Evaluators</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">95%</p>
                <p className="text-xs text-slate-500 font-medium">Successful Placements</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FEATURED OPPORTUNITIES                                      */}
      {/* ============================================================== */}
      <section id="verified-jobs" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>FEATURED OPPORTUNITIES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Top Remote Jobs from <span className="text-blue-600">European Companies</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Work with innovative startups and leading companies across Europe.
              </p>
            </div>

            {/* Right: View All Jobs + Arrows */}
            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>View All Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 4 Job Cards in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredJobs.map((job, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Company Logo & Remote Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      {job.logo}
                      <span className="font-bold text-slate-900 text-xs">{job.company}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {job.remote}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                    {job.role}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                    <span>📍</span>
                    <span>{job.location}</span>
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.tags.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Salary & Posted date */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{job.salary}</span>
                  <span className="text-[10px] text-slate-400">{job.posted}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. DUAL CARDS: FOR DEVELOPERS & FOR COMPANIES                  */}
      {/* ============================================================== */}
      <section id="for-companies" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: For Developers */}
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-8 sm:p-10 border border-indigo-100/80 shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>FOR DEVELOPERS</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Build a Global Career
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                  Get evaluated by industry experts, access global job opportunities, and work with top European companies.
                </p>

                {/* Bullets */}
                <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Free profile creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>First 3 evaluations free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Global job opportunities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Career growth support</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Find Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Developer portrait & badges */}
              <div className="mt-8 pt-6 border-t border-indigo-100/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/developer-portrait.jpg"
                    alt="Developer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Candidate Dossier</span>
                    <p className="text-xs font-bold text-slate-900">View Offers • Remote 100%</p>
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-white border border-indigo-100 shadow-xs text-right">
                  <p className="text-[10px] text-slate-500 font-medium">Job Views</p>
                  <p className="text-xs font-black text-indigo-600 flex items-center justify-end gap-1">
                    <span>+124%</span>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: For Companies */}
            <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-8 sm:p-10 border border-emerald-100/80 shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>FOR COMPANIES</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Hire Pre-vetted Talent
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                  Access a pool of skilled Indian developers, evaluated by industry experts, and hire faster.
                </p>

                {/* Bullets */}
                <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Pre-vetted, high-quality talent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Flexible hiring plans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Reduce time and cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Dedicated support</span>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://talenthirec.vercel.app/company"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Hire Talent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Company cluster metric */}
              <div className="mt-8 pt-6 border-t border-emerald-100/60 flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="Talent" />
                  <img className="w-10 h-10 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop" alt="Talent" />
                  <img className="w-10 h-10 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" alt="Talent" />
                  <img className="w-10 h-10 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop" alt="Talent" />
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-white border border-emerald-100 shadow-xs text-right">
                  <p className="text-[10px] text-slate-500 font-medium">Hiring Partners</p>
                  <p className="text-xs font-black text-emerald-700 flex items-center justify-end gap-1">
                    <span>500+ Companies</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. HOW IT WORKS: 4 CONNECTED STEPS                             */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>HOW IT WORKS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Talent to Opportunity <br className="hidden sm:block" />
            in Just a Few Steps
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto mb-16">
            A simple, transparent, and efficient hiring process for everyone.
          </p>

          {/* Connected Flow Steps */}
          <div className="relative">
            {/* Horizontal connector line on desktop */}
            <div className="hidden lg:block absolute top-1/4 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 -z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-blue-500 shadow-md flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2 shadow-xs">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Create Profile</h3>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  Showcase your skills and experience.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-purple-500 shadow-md flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-2 shadow-xs">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Get Evaluated</h3>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  Interviewed by verified industry experts.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-500 shadow-md flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-2 shadow-xs">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Get Matched</h3>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  AI matches you with relevant opportunities.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 shadow-md flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <Handshake className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2 shadow-xs">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Hire / Get Hired</h3>
                <p className="text-xs text-slate-500 max-w-[200px]">
                  Companies hire the best talent, faster.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. TESTIMONIALS                                                */}
      {/* ============================================================== */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>TESTIMONIALS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Developers and Companies
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-12">
            Hear what our community has to say.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-3xl text-indigo-400 font-serif leading-none">“</span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Inayon helped me land my dream remote job in just 2 weeks. The quality of talent is outstanding."
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                    alt="Lukas Weber"
                    className="w-10 h-10 rounded-full object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Lukas Weber</h4>
                    <p className="text-[10px] text-slate-500">CTO, Berlin Startup</p>
                  </div>
                </div>
                <span className="text-lg">🇩🇪</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-3xl text-purple-400 font-serif leading-none">“</span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "The evaluation process gave me confidence and helped me find the right talent for our team. Highly recommended!"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                    alt="Sophia Müller"
                    className="w-10 h-10 rounded-full object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Sophia Müller</h4>
                    <p className="text-[10px] text-slate-500">Engineering Manager, London</p>
                  </div>
                </div>
                <span className="text-lg">🇬🇧</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-3xl text-blue-400 font-serif leading-none">“</span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "A seamless experience from start to finish. The platform is transparent and efficient."
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop"
                    alt="Thomas de Jong"
                    className="w-10 h-10 rounded-full object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Thomas de Jong</h4>
                    <p className="text-[10px] text-slate-500">Founder, Amsterdam</p>
                  </div>
                </div>
                <span className="text-lg">🇳🇱</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. TRANSPARENT PRICING                                         */}
      {/* ============================================================== */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fair, Predictable Plans for Everyone
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8">
            Choose the plan that fits your hiring or career needs.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200 shadow-xs mb-14">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto items-stretch">
            
            {/* Plan 1: 5-Day Stack Pass */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">5-Day Stack Pass</h3>
                <p className="text-xs text-slate-500 mb-6">For Developers</p>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">₹0</span>
                </div>

                <div className="space-y-3 text-xs text-slate-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>First 3 evaluations free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Access to selected jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Valid for 5 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Upgrade anytime</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-full border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Get Started →
              </Link>
            </div>

            {/* Plan 2: Single Opening Pass (Highlighted - Most Popular) */}
            <div className="relative p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">Single Opening Pass</h3>
                <p className="text-xs text-slate-500 mb-6">For Companies</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹15,000</span>
                  <span className="text-xs text-slate-500">/opening</span>
                </div>

                <div className="space-y-3 text-xs text-slate-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Post 1 job opening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Access to pre-vetted talent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Interview scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Dedicated support</span>
                  </div>
                </div>
              </div>

              <a
                href="https://talenthirec.vercel.app/company"
                className="w-full text-center py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-md"
              >
                Post a Job →
              </a>
            </div>

            {/* Plan 3: Growth Subscription */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Growth Subscription</h3>
                <p className="text-xs text-slate-500 mb-6">For Companies</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {billingCycle === 'yearly' ? '₹45,000' : '₹4,900'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {billingCycle === 'yearly' ? '/year' : '/month'}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited job postings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Access to full talent pool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Advanced matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-900">Dedicated account manager</span>
                  </div>
                </div>
              </div>

              <a
                href="https://talenthirec.vercel.app/company"
                className="w-full text-center py-2.5 rounded-full border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Talk to Enterprise →
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. BOTTOM CTA BANNER: READY FOR A GLOBAL CAREER?               */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Floating Rounded Banner Card matching screenshot */}
          <div
            className="relative isolate rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden border border-slate-200/80 shadow-lg min-h-[260px] sm:min-h-[300px] lg:min-h-[320px] flex items-center justify-center px-6 py-10 sm:py-12 bg-cover bg-center"
            style={{ backgroundImage: "url('/global-career-bg.png')" }}
          >
            {/* Background Image Element for responsive scaling */}
            <img
              src="/global-career-bg.png"
              alt="Penthouse terrace overlooking global skyline"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
            />

            {/* Soft translucent overlay so the terrace skyline is bright and text is crisp */}
            <div className="absolute inset-0 bg-white/35 backdrop-blur-[0.5px] z-[1] pointer-events-none" />

            {/* Main Centered Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-indigo-700 font-bold text-[10px] sm:text-xs tracking-wide shadow-xs border border-indigo-100/80 mb-3">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>READY FOR A GLOBAL CAREER?</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-[2.25rem] font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                Be Part of a Borderless Tech Community
              </h2>

              {/* Subhead */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mx-auto mb-6">
                Join <strong className="font-semibold text-slate-900">Inayon</strong> and take your career beyond boundaries.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-105 active:scale-95"
                >
                  Talk to Our Team
                </Link>
              </div>

            </div>

            {/* Right Side: Script Handwritten Text with Curved Arrow pointing to the skyline */}
            <div className="hidden md:flex flex-col items-center absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none text-slate-700">
              <svg className="w-8 h-8 text-slate-700 mb-1" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 28 8 C 24 16, 12 18, 14 30" />
                <path d="M 10 26 L 14 30 L 18 26" />
              </svg>
              <div className="text-right font-serif italic text-xs lg:text-sm font-bold tracking-tight text-slate-800 drop-shadow-xs">
                <span>Global Careers</span>
                <span className="block text-indigo-700 font-sans not-italic text-[11px] font-bold">Start Here</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Evaluator CTA trigger button for evaluator role section */}
      <section id="for-evaluators" className="sr-only">
        <button onClick={handleOpenEvalModal}>Become an Evaluator</button>
      </section>
    </div>
  );
};
