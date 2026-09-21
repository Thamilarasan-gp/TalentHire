import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  User,
  Star,
  Globe,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  FileCheck2,
  Lock,
  Users2,
  DollarSign,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — 8 TALENT CARDS (HORMN LUXURY PALETTE, HIGH-RES PORTRAITS, CRISP ROLES)
───────────────────────────────────────────────────────────────────────────── */
const TALENT_CARDS = [
  {
    id: 1,
    category: 'Core Infrastructure',
    title: 'Scale your\ninfrastructure',
    bg: '#52749A', // Slate Blue
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    skills: 'Kubernetes · Terraform · AWS Cloud',
  },
  {
    id: 2,
    category: 'Backend Architecture',
    title: 'Boost your\nsystem speed',
    bg: '#587E60', // Sage Moss Green
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    skills: 'Node.js · Go · Distributed Systems',
  },
  {
    id: 3,
    category: 'Full-stack & Cloud',
    title: 'Sustainable\nscale & growth',
    bg: '#8F6D54', // Warm Tan / Camel
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    skills: 'React · TypeScript · GraphQL · Next.js',
  },
  {
    id: 4,
    category: 'AI & Machine Learning',
    title: 'Take back\ntech velocity',
    bg: '#776891', // Soft Lavender Mauve
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    skills: 'Python · PyTorch · LLM Agents · RAG',
  },
  {
    id: 5,
    category: 'Mobile & iOS Systems',
    title: 'Craft native\nperfection',
    bg: '#9E6054', // Deep Terracotta
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    skills: 'Swift · React Native · Android · Kotlin',
  },
  {
    id: 6,
    category: 'Data Engineering',
    title: 'Accelerate deep\npipeline speed',
    bg: '#477682', // Nordic Ocean Teal
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    skills: 'Spark · Kafka · Snowflake · BigQuery',
  },
  {
    id: 7,
    category: 'Platform & SRE',
    title: 'Achieve 99.99%\nsystem uptime',
    bg: '#917A4D', // Warm Amber Ochre
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    skills: 'Observability · Datadog · Chaos Eng',
  },
  {
    id: 8,
    category: 'Cloud Security',
    title: 'Lock down core\nenterprise cloud',
    bg: '#5A6475', // Slate Graphite
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    skills: 'Zero Trust · IAM · SOC2 · DevSecOps',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TALENT CARD COMPONENT (HORMN LUXURY CARD)
───────────────────────────────────────────────────────────────────────────── */
interface TalentCardProps {
  card: typeof TALENT_CARDS[0];
  style?: React.CSSProperties;
}

const TalentCard: React.FC<TalentCardProps> = ({ card, style }) => (
  <div
    className="relative shrink-0 rounded-[32px] overflow-hidden cursor-pointer group select-none transition-all duration-500 hover:-translate-y-2.5 hover:shadow-2xl"
    style={{
      width: 310,
      height: 395,
      background: card.bg,
      boxShadow: '0 16px 36px -12px rgba(0,0,0,0.24)',
      ...style,
    }}
  >
    {/* Card Header */}
    <div className="absolute top-6 left-6 right-6 z-20 flex items-start justify-between">
      <div>
        <p className="text-[11.5px] font-medium text-white/75 tracking-wider uppercase">
          {card.category}
        </p>
        <h3 className="text-[23px] font-bold text-white leading-tight mt-1 whitespace-pre-line tracking-tight">
          {card.title}
        </h3>
      </div>

      {/* Up-Right Diagonal Arrow Button */}
      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-all duration-300 shadow-sm shrink-0 mt-0.5">
        <ArrowUpRight className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>

    {/* Portrait Photo at Bottom with Gradient Dissolve */}
    <div className="absolute bottom-0 left-0 right-0 h-[68%] overflow-hidden flex items-end justify-center pointer-events-none">
      <img
        src={card.image}
        alt={card.category}
        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>

    {/* Subtle Darkening Overlay on Hover */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none rounded-[32px]" />
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const CompanyWelcome: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  // Track scroll for horizontal card translation
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute smooth horizontal offset for cards on vertical scroll
  const cardOffset = scrollY * 0.65;

  return (
    <div
      className="min-h-screen font-sans bg-white text-[#0F172A] antialiased selection:bg-slate-900 selection:text-white"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── STYLES ────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .card-track {
          will-change: transform;
          transition: transform 0.08s linear;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -8px rgba(0,0,0,0.08);
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .live-pulse {
          animation: pulseDot 2s ease-in-out infinite;
        }
      `}</style>

      {/* ── HEADER (CLEAN, FROSTED GLASS, MINIMALIST LUXURY) ──────────────── */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-black/[0.05] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[72px] flex items-center justify-between gap-6">
          {/* Brand Mark */}
          <Link to="/company" className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-black text-sm text-white tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              TH
            </div>
            <span className="font-extrabold text-[#0F172A] text-[15.5px] tracking-wider uppercase">
              Talent Hire
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-950 transition-colors flex items-center gap-1">
              Specializations <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a href="#how-it-works" className="hover:text-slate-950 transition-colors">
              How it works
            </a>
            <a href="#comparison" className="hover:text-slate-950 transition-colors">
              Why We
            </a>
            <a href="#evidence" className="hover:text-slate-950 transition-colors">
              Evaluation Dossier
            </a>
          </div>

          {/* Right Action: Profile Circle + "Get started ›" Pill Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/company/login"
              className="w-10 h-10 rounded-full border border-slate-200/90 flex items-center justify-center text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all"
              title="Company Portal Login"
            >
              <User className="w-4 h-4 text-slate-700" />
            </Link>

            <Link to="/company/register">
              <button className="px-5 py-2.5 rounded-full border border-slate-900 bg-slate-900 hover:bg-black text-white text-[13px] sm:text-[14px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]">
                Get started <ChevronRight className="w-3.5 h-3.5 text-white/80" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (HORMN STYLE, STRICTLY 2-LINE HEADLINE, 4 CENTERED CARDS) ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-6 sm:pt-8 pb-0"
        style={{ background: '#FFFFFF' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] mb-5">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Member"
                className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Member"
                className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Member"
                className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
              />
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse shrink-0"></span>
            <span className="text-[12.5px] font-semibold text-slate-700">
              Join 6,000+ top engineering teams
            </span>
          </div>

          {/* Main Headline (Strictly 2 lines as specified) */}
          <h1
            className="font-extrabold tracking-tight text-[#0F172A] text-center leading-[1.12] mb-4"
            style={{ fontSize: 'clamp(38px, 5.5vw, 48px)', letterSpacing: '-0.035em' }}
          >
            <span className="block">Zero fluff. Pure signal</span>
            <span className="block">Engineering powerhouses, delivered on demand.</span>
          </h1>

          {/* Subtext */}
          <p className="text-center text-slate-500 text-[16px] sm:text-[17px] max-w-xl mx-auto leading-relaxed mb-4 font-normal">
            The world's highest rated technical talent network, helping modern teams build stronger, faster systems.
          </p>

          {/* Trust Rating Row */}
          <div className="flex items-center justify-center gap-1.5 text-[13px] sm:text-[14px] text-slate-700 mb-12 sm:mb-14">
            <span className="text-[#00B67A] text-lg font-black leading-none">★</span>
            <span className="font-extrabold text-[#0F172A] tracking-tight">Google review</span>
            <span className="font-bold text-slate-900 ml-1">4.9</span>
            <span className="text-slate-500">out of 5</span>
            <span className="text-slate-400 font-normal underline decoration-slate-300 underline-offset-2">(520+ reviews)</span>
          </div>
        </div>

        {/* ── 8 CARDS ROW (HORIZONTALLY DRIFTING ON SCROLL) ──── */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 425, userSelect: 'none' }}
        >
          {/* Subtle side fade masks */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{ width: 80, background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, transparent 100%)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{ width: 80, background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, transparent 100%)' }}
          />

          {/* Cards Track — First 4 cards centered initially, 5th+ cards reveal ONLY on scroll */}
          <div
            ref={cardsTrackRef}
            className="card-track flex items-end gap-6 sm:gap-7 shrink-0"
            style={{
              paddingLeft: 'max(24px, calc(50vw - 650px))',
              paddingRight: 40,
              bottom: 0,
              transform: `translateX(-${cardOffset}px)`,
              willChange: 'transform',
            }}
          >
            {TALENT_CARDS.map((card, idx) => {
              // The 5th card and beyond (idx >= 4) are strictly hidden at initial state,
              // and ONLY reveal and slide in when the user scrolls down
              const isBeyondFour = idx >= 4;
              const isRevealed = scrollY > 15;
              const cardOpacity = isBeyondFour
                ? isRevealed
                  ? Math.min(1, (scrollY - 15) / 50)
                  : 0
                : 1;
              const cardVisibility = isBeyondFour && !isRevealed ? 'hidden' : 'visible';

              return (
                <TalentCard
                  key={card.id}
                  card={card}
                  style={{
                    opacity: cardOpacity,
                    visibility: cardVisibility,
                    transition: isBeyondFour ? 'opacity 0.35s ease-out' : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 flex flex-wrap justify-center gap-6 sm:gap-10 text-slate-500 text-xs sm:text-sm font-medium">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pre-evaluated by Principal Architects</span>
          </span>
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Vetted talent from 30+ countries</span>
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Matched and interview-ready in 72 hours</span>
          </span>
        </div>
      </section>

      {/* ── HOW IT WORKS (ARCHITECTURAL VETTING JOURNEY) ───────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-100 bg-[#FAFBFD]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> End-to-End Orchestration
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Direct Path from Hiring Need to Productive Engineer
            </h2>
            <p className="text-slate-500 text-[15px] mt-3 leading-relaxed">
              Your engineering leadership maintains 100% final decision authority while eliminating hundreds of hours of resume screening.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Role Specification',
                desc: 'Define your exact tech stack, concurrency tolerances, timezone overlap, and compensation bounds.',
                icon: Layers,
                highlight: '72hr Kickoff',
              },
              {
                step: '02',
                title: 'Smart Calibration',
                desc: 'Algorithmic matching against active pre-evaluated engineers who already passed hard technical filters.',
                icon: Cpu,
                highlight: 'Top 1.2% Filter',
              },
              {
                step: '03',
                title: 'Principal Architect Vetting',
                desc: 'Independent Staff & Principal Engineers conduct deep live architecture, code audit, and system design rounds.',
                icon: Terminal,
                highlight: 'Conflict-Free',
              },
              {
                step: '04',
                title: 'QA Verified Dossiers',
                desc: 'Only candidates receiving unanimous pass verdicts advance with complete rubric scores and video evidence.',
                icon: FileCheck2,
                highlight: 'Full Scorecard',
              },
              {
                step: '05',
                title: 'Team Interview & Fit',
                desc: 'Conduct your final cultural & system alignment interview directly with pre-cleared finalists.',
                icon: Users2,
                highlight: 'Direct Invite',
              },
              {
                step: '06',
                title: 'Offer & 90-Day Guarantee',
                desc: 'Seamless onboarding supported by our contractual 90-day guarantee with zero-cost replacements.',
                icon: Award,
                highlight: '100% Guaranteed',
              },
            ].map(({ step, title, desc, icon: Icon, highlight }) => (
              <div
                key={step}
                className="hover-lift bg-white rounded-2xl p-7 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                      STEP {step}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      {highlight}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-900 mb-2">{title}</h3>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY COMPANIES (MEASURABLE ADVANTAGE) ───────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Measurable Impact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Engineered to Eliminate Recruiting Overhead
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Clock,
                title: 'Zero Screening Workload',
                tag: 'Save 40+ Engineering Hours',
                desc: 'Never sift through 300+ buzzword-heavy resumes again. Our Principal-vetted benchmarks ensure every interview is with a candidate capable of shipping on day one.',
              },
              {
                Icon: Award,
                title: 'Architect-Grade Vetting',
                tag: 'By Principal Engineers',
                desc: 'Technical evaluations are executed by practicing Principal Architects who built high-scale systems at global tech enterprises — not non-technical recruiters.',
              },
              {
                Icon: FileCheck2,
                title: 'Evidence-Backed Dossiers',
                tag: '100% Scorecard Transparency',
                desc: 'Inspect exact rubric breakdowns, code reviews, and architectural trade-off evaluations before you spend even 15 minutes of internal team interview time.',
              },
            ].map(({ Icon, title, tag, desc }) => (
              <div
                key={title}
                className="hover-lift p-8 rounded-3xl bg-[#FAFBFD] border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    {tag}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                </div>
                <p className="text-[14px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON (TRADITIONAL VS THAMILARASAN GLOBAL) ───────────────── */}
      <section id="comparison" className="py-24 px-6 bg-[#FAFBFD] border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">The Hiring Transformation</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Traditional Recruitment vs. Talent Hire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional */}
            <div className="p-8 rounded-3xl bg-white border border-rose-100/90 shadow-[0_4px_20px_rgba(244,63,94,0.04)] space-y-6">
              <div className="flex items-center gap-2.5 text-rose-600 font-bold text-base">
                <XCircle className="w-5 h-5" />
                <span>Traditional Tech Staffing</span>
              </div>
              <ul className="space-y-4 text-[13.5px] text-slate-600">
                {[
                  'Inundation of 100+ unvetted resumes matching mere keywords',
                  'Engineering team wastes 35+ hours on initial screening calls',
                  'Unverified claims on microservices and concurrent database locks',
                  'Astronomical recruitment fees with zero warranty after 30 days',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TG Premium */}
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-900 shadow-[0_12px_36px_rgba(0,0,0,0.06)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                CALIBRATED STANDARD
              </div>
              <div className="flex items-center gap-2.5 text-slate-950 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Talent Hire Engine</span>
              </div>
              <ul className="space-y-4 text-[13.5px] text-slate-700">
                {[
                  'Hand-selected shortlist of top verified candidates matching all parameters',
                  'Independent Principal Engineers perform rigorous technical audits',
                  'Comprehensive scorecard with full rubric metrics and recorded discussions',
                  'Contractual 90-Day Placement Guarantee with $0 replacement warranty',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVIDENCE DOSSIER MOCKUP (ZERO GUESSWORK) ───────────────────────── */}
      <section id="evidence" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Zero Guesswork</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Evaluation Quality Built on Hard Evidence
            </h2>
            <p className="text-slate-500 text-[15px] mt-3">
              Review full architectural rubrics, code samples, and verified evaluations before ever scheduling your interview.
            </p>
          </div>

          {/* Dossier Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FAFBFD] border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-extrabold text-xl text-slate-900">Sample Candidate Dossier</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                    QA VERIFIED PASS
                  </span>
                </div>
                <p className="text-[13.5px] text-slate-500">
                  Lead Distributed Systems Architect · 8+ Years Experience · 30 Days Notice
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Match Score</span>
                  <span className="text-2xl font-black text-slate-900">94%</span>
                </div>
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Technical Score</span>
                  <span className="text-2xl font-black text-emerald-600">88/100</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Evaluator Notes */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Principal Evaluator Observations
                </p>
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-[13.5px] text-slate-700 italic leading-relaxed shadow-sm">
                  "Candidate demonstrated deep mastery of Node.js cluster performance, memory heap profiling, and distributed locking with Redis Redlock under multi-region replication. Clean code modularity with zero memory leaks."
                  <span className="text-[11.5px] text-blue-600 font-semibold not-italic block mt-3">
                    — Arun Subramanian, Principal Architect (Ex-Fintech Lead)
                  </span>
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Evaluated Criteria
                </p>
                <div className="space-y-2.5 text-[13.5px]">
                  {[
                    { label: 'Concurrency & Event Loop Mechanics', score: '35/35' },
                    { label: 'Distributed System Design & Caching', score: '28/30' },
                    { label: 'AWS Microservices Architecture', score: '25/25' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200/80 shadow-sm"
                    >
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBAL INFRASTRUCTURE & GUARANTEES ────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAFBFD] border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Global Operations</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-12 tracking-tight">
            Designed for International Scale
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 text-left">
            {[
              {
                icon: Clock,
                title: 'Timezone Overlap',
                desc: 'Minimum 4 hours daily synchronous team overlap guaranteed across EST, PST, GMT, or CET.',
              },
              {
                icon: DollarSign,
                title: 'Transparent USD Billing',
                desc: 'Predictable annual and monthly USD billing benchmarks ($65,000–$120,000+ USD) with zero hidden currency fees.',
              },
              {
                icon: ShieldCheck,
                title: '90-Day Guarantee',
                desc: 'Contractual 90-day placement warranty with instant $0 re-match support if performance criteria are not satisfied.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="hover-lift p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{title}</h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGH-CONVERTING LUXURY CTA BANNER ──────────────────────────────── */}
      <section className="py-24 px-6 text-center relative overflow-hidden bg-[#0A0E17] text-white">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.18) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to hire your next senior engineer?
          </h2>

          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Set up your company workspace and access calibrated pre-vetted engineers in under 5 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/company/register">
              <button className="px-8 py-3.5 rounded-full font-bold text-[14.5px] bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                Create Enterprise Account
              </button>
            </Link>

            <Link to="/company/login">
              <button className="px-8 py-3.5 rounded-full font-bold text-[14.5px] text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all">
                Sign In to Portal
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── LUXURY FOOTER ─────────────────────────────────────────────────── */}
      <footer className="py-16 px-6 bg-[#070A10] text-[#94A3B8] text-[13px] border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-10">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs">
                TH
              </div>
              <span className="font-extrabold text-white text-[15px] tracking-wider">
                Talent Hire
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm text-[13px]">
              Independent technical evaluation and recruitment infrastructure connecting global engineering teams with verified, senior software talent.
            </p>

            <div className="flex items-center gap-2 text-[12px] text-emerald-400 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse"></span>
              <span>All evaluation pipelines active · 99.9% uptime</span>
            </div>
          </div>

          {[
            {
              heading: 'Platform',
              links: [
                ['Start Hiring', '/company/register'],
                ['Sign In', '/company/login'],
                ['How It Works', '#how-it-works'],
                ['Evaluation Dossier', '#evidence'],
              ],
            },
            {
              heading: 'Security & Legal',
              links: [
                ['90-Day Guarantee', '#'],
                ['SOC2 Verification', '#'],
                ['GDPR & Privacy', '#'],
                ['Terms of Service', '#'],
              ],
            },
            {
              heading: 'Enterprise Contact',
              links: [
                ['support@thamilarasanglobal.com', 'mailto:support@thamilarasanglobal.com'],
                ['Schedule Consultation', '/company/register'],
                ['Engineering FAQ', '#how-it-works'],
              ],
            },
          ].map(({ heading, links }) => (
            <div key={heading} className="space-y-3.5">
              <span className="font-bold text-slate-200 uppercase text-[10.5px] tracking-widest block">
                {heading}
              </span>
              <ul className="space-y-2.5">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <span>© {new Date().getFullYear()} THAMILARASAN GLOBAL. All rights reserved.</span>
          <span className="text-slate-600">Enterprise Technical Recruitment System</span>
        </div>
      </footer>
    </div>
  );
};
