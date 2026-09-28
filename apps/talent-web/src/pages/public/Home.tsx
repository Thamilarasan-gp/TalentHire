import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Code2,
  Server,
  Layers,
  Smartphone,
  Cpu,
  Database,
  Palette,
  CheckCircle2,
  Clock
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
      role: 'Senior Frontend Engineer',
      location: 'Stockholm, Sweden',
      remote: '100% Remote',
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
      salary: '€55K – €75K',
      posted: '2 days ago',
      category: 'Frontend',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-[#1DB954] flex items-center justify-center text-white shadow-xs shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.218.358-.68.472-1.038.254-2.846-1.74-6.428-2.133-10.648-1.17-.406.094-.808-.16-.902-.566-.094-.407.16-.809.566-.903 4.628-1.057 8.59-.61 11.768 1.348.358.218.47.68.254 1.037zm1.47-3.267c-.274.444-.86.586-1.304.312-3.257-2.002-8.223-2.584-12.076-1.413-.497.151-1.026-.134-1.177-.63-.151-.497.134-1.027.63-1.178 4.41-1.34 9.89-.693 13.615 1.605.444.274.586.86.312 1.304zm.126-3.41c-3.905-2.318-10.34-2.532-14.075-1.398-.598.182-1.233-.162-1.414-.76-.182-.598.162-1.234.76-1.415 4.3-1.306 11.414-1.05 15.892 1.608.537.319.715 1.018.396 1.555-.318.537-1.018.715-1.559.41z" />
          </svg>
        </div>
      ),
    },
    {
      company: 'Revolut',
      role: 'Distributed Backend Engineer',
      location: 'London, UK',
      remote: 'Remote',
      tags: ['Go', 'Node.js', 'PostgreSQL', 'Kafka'],
      salary: '€65K – €90K',
      posted: '3 days ago',
      category: 'Backend',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shadow-xs shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.89 4.22h-9.9c-.38 0-.69.31-.69.69v14.18c0 .38.31.69.69.69h3.45c.38 0 .69-.31.69-.69v-4.49h1.72l3.4 4.88c.21.3.55.48.91.48h3.81c.54 0 .86-.59.57-1.02l-4.14-5.85c2.47-.64 4.09-2.78 4.09-5.32 0-3.05-2.13-3.55-4.6-3.55zm-2.02 5.86h-3.92V7.12h3.92c1.23 0 2.05.69 2.05 1.48 0 .81-.82 1.48-2.05 1.48z" />
          </svg>
        </div>
      ),
    },
    {
      company: 'Klarna',
      role: 'Full Stack Product Engineer',
      location: 'Berlin, Germany',
      remote: 'Hybrid / Remote',
      tags: ['React', 'Node.js', 'TypeScript', 'AWS'],
      salary: '€60K – €85K',
      posted: '4 days ago',
      category: 'Full Stack',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-[#FFB3C7] flex items-center justify-center text-slate-950 shadow-xs shrink-0 font-serif font-black text-base">
          K.
        </div>
      ),
    },
    {
      company: 'N26',
      role: 'Senior Mobile Engineer (iOS & React Native)',
      location: 'Vienna, Austria',
      remote: 'Remote',
      tags: ['React Native', 'Swift', 'Kotlin'],
      salary: '€50K – €72K',
      posted: '5 days ago',
      category: 'Mobile',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-[#00897B] flex items-center justify-center text-white shadow-xs shrink-0 font-black text-xs tracking-tight">
          N26
        </div>
      ),
    },
    {
      company: 'Delivery Hero',
      role: 'Cloud Infrastructure & DevOps Engineer',
      location: 'Berlin, Germany',
      remote: 'Remote',
      tags: ['Kubernetes', 'Terraform', 'AWS', 'Docker'],
      salary: '€65K – €88K',
      posted: '1 day ago',
      category: 'DevOps',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-[#D70F64] flex items-center justify-center text-white shadow-xs shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-2.34-.14-4.24-1.92-4.54-4.24h2.06c.27 1.2 1.25 2.12 2.48 2.24v2zm0-4.93h-2.06c.3-2.32 2.2-4.1 4.54-4.24v2c-1.23.12-2.21 1.04-2.48 2.24zm2 4.93v-2c1.23-.12 2.21-1.04 2.48-2.24h2.06c-.3 2.32-2.2 4.1-4.54 4.24zm0-6.93v-2c2.34.14 4.24 1.92 4.54 4.24h-2.06c-.27-1.2-1.25-2.12-2.48-2.24z" />
          </svg>
        </div>
      ),
    },
    {
      company: 'SAP',
      role: 'Lead AI / ML Systems Engineer',
      location: 'Walldorf, Germany',
      remote: 'Remote',
      tags: ['Python', 'PyTorch', 'LLMs', 'MLOps'],
      salary: '€75K – €105K',
      posted: 'Just now',
      category: 'AI/ML',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-[#0070F2] flex items-center justify-center text-white shadow-xs shrink-0 font-black text-[11px] tracking-wider">
          SAP
        </div>
      ),
    },
    {
      company: 'Booking.com',
      role: 'Senior Data Platform Engineer',
      location: 'Amsterdam, Netherlands',
      remote: 'Remote',
      tags: ['Spark', 'Snowflake', 'Python', 'SQL'],
      salary: '€62K – €86K',
      posted: '3 days ago',
      category: 'Data',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-[#003580] flex items-center justify-center text-white shadow-xs shrink-0 font-black text-sm">
          B.
        </div>
      ),
    },
    {
      company: 'Zalando',
      role: 'Staff Product & Design System Architect',
      location: 'Berlin, Germany',
      remote: 'Remote',
      tags: ['Figma', 'Design Systems', 'UX Research', 'CSS'],
      salary: '€58K – €80K',
      posted: '4 days ago',
      category: 'Design',
      logo: (
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-[#FF6900] shadow-xs shrink-0 font-bold text-xs tracking-tight lowercase">
          zalando
        </div>
      ),
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
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Global Scroll Reveal Observer for smooth animations across all sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeCategory, billingCycle]);

  // ==============================================================
  // HOW IT WORKS - Klarna-style Scroll-Driven Step Data & Logic
  // ==============================================================
  const [activeHowStep, setActiveHowStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const howSteps = [
    {
      title: 'Create Profile',
      tagline: 'Showcase your real engineering ability',
      description:
        'Build your verified developer profile in minutes. Connect your GitHub, showcase past engineering work, set your tech stack, and define your international salary expectations.',
      badgeText: 'Step 01 • Create Profile',
      image: '/how-step1-profile.jpg',


    },
    {
      title: 'Get Evaluated',
      tagline: 'Unbiased technical validation from senior peers',
      description:
        'Undergo a focused 45-minute live technical evaluation conducted by verified Staff and Principal Engineers from leading European tech companies.',
      badgeText: 'Step 02 • Get Evaluated',
      image: '/how-step2-eval.jpg',

    },
    {
      title: 'Get Matched',
      tagline: 'Direct pipeline into top European tech teams',
      description:
        'Skip the resume black hole. Your verified score gets you fast-tracked directly to engineering hiring managers at Spotify, Revolut, Klarna, and 500+ top companies.',
      badgeText: 'Step 03 • Get Matched',
      image: '/how-step3-match.jpg',

    },
    {
      title: 'Hire / Get Hired',
      tagline: 'Global contracts with peace of mind',
      description:
        'Receive competitive international offers with transparent pay in EUR/USD, seamless compliance, and dedicated cross-border contract and payroll support.',
      badgeText: 'Step 04 • Get Hired',
      image: '/how-step4-hired.jpg',

    },
  ];

  // Scroll detection to update active step
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 1024;
      // On mobile, sticky image sits at top-[72px] with height ~285px (bottom at ~360px).
      // Reading threshold: step activates as its title enters the comfortable reading zone below the sticky image (~430px).
      // On desktop, threshold is 45% of viewport height.
      const threshold = isMobile ? 430 : window.innerHeight * 0.45;
      let newActiveIndex = 0;

      for (let i = 0; i < stepRefs.current.length; i++) {
        const el = stepRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          newActiveIndex = i;
        }
      }

      setActiveHowStep(newActiveIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = (idx: number) => {
    setActiveHowStep(idx);
    const el = stepRefs.current[idx];
    if (el) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        // Offset for mobile sticky navbar + taller sticky image (~365px)
        const yOffset = -365;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // ==============================================================
  // 7. TESTIMONIALS - Mobile Horizontal Auto + Manual Carousel Logic
  // ==============================================================
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTestimonialAutoPaused, setIsTestimonialAutoPaused] = useState(false);
  const testimonialScrollRef = useRef<HTMLDivElement | null>(null);

  const testimonials = [
    {
      id: 1,
      quote:
        'Inayon helped me land my dream remote job in just 2 weeks. The quality of talent is outstanding.',
      author: 'Lukas Weber',
      role: 'CTO, Berlin Startup',
      country: '🇩🇪',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
      color: 'text-indigo-400',
      badge: 'Verified Hire',
    },
    {
      id: 2,
      quote:
        'The evaluation process gave me confidence and helped me find the right talent for our team. Highly recommended!',
      author: 'Sophia Müller',
      role: 'Engineering Manager, London',
      country: '🇬🇧',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
      color: 'text-purple-400',
      badge: 'Verified Client',
    },
    {
      id: 3,
      quote:
        'A seamless experience from start to finish. The platform is transparent and efficient.',
      author: 'Thomas de Jong',
      role: 'Founder, Amsterdam',
      country: '🇳🇱',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
      color: 'text-blue-400',
      badge: 'Verified Founder',
    },
    {
      id: 4,
      quote:
        'Finding senior engineers who actually understand distributed systems took us months. With Inayon, we hired in 5 days.',
      author: 'Elena Rostova',
      role: 'VP Engineering, Stockholm',
      country: '🇸🇪',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop',
      color: 'text-emerald-400',
      badge: 'Fast Hire',
    },
  ];

  const scrollToTestimonial = (idx: number) => {
    setActiveTestimonial(idx);
    const container = testimonialScrollRef.current;
    if (container && container.children[idx]) {
      const card = container.children[idx] as HTMLElement;
      const scrollTarget = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  };

  const handlePrevTestimonial = () => {
    const prev = (activeTestimonial - 1 + testimonials.length) % testimonials.length;
    scrollToTestimonial(prev);
  };

  const handleNextTestimonial = () => {
    const next = (activeTestimonial + 1) % testimonials.length;
    scrollToTestimonial(next);
  };

  const handleTestimonialScroll = () => {
    const container = testimonialScrollRef.current;
    if (!container) return;
    const scrollCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const childCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(childCenter - scrollCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeTestimonial) {
      setActiveTestimonial(closestIndex);
    }
  };

  // Auto-scroll on mobile every 4 seconds
  useEffect(() => {
    if (isTestimonialAutoPaused) return;
    const timer = setInterval(() => {
      if (window.innerWidth >= 768) return;
      setActiveTestimonial((prev) => {
        const next = (prev + 1) % testimonials.length;
        const container = testimonialScrollRef.current;
        if (container && container.children[next]) {
          const card = container.children[next] as HTMLElement;
          const scrollTarget = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
          container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isTestimonialAutoPaused, testimonials.length]);

  const trustedCompanies = [
    {
      name: 'Spotify',
      content: (
        <div className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-950 transition-colors text-lg tracking-tight">
          <svg className="w-5 h-5 fill-current text-slate-800" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.218.358-.68.472-1.038.254-2.846-1.74-6.428-2.133-10.648-1.17-.406.094-.808-.16-.902-.566-.094-.407.16-.809.566-.903 4.628-1.057 8.59-.61 11.768 1.348.358.218.47.68.254 1.037zm1.47-3.267c-.274.444-.86.586-1.304.312-3.257-2.002-8.223-2.584-12.076-1.413-.497.151-1.026-.134-1.177-.63-.151-.497.134-1.027.63-1.178 4.41-1.34 9.89-.693 13.615 1.605.444.274.586.86.312 1.304zm.126-3.41c-3.905-2.318-10.34-2.532-14.075-1.398-.598.182-1.233-.162-1.414-.76-.182-.598.162-1.234.76-1.415 4.3-1.306 11.414-1.05 15.892 1.608.537.319.715 1.018.396 1.555-.318.537-1.018.715-1.559.41z" />
          </svg>
          <span>Spotify</span>
        </div>
      )
    },
    {
      name: 'Revolut',
      content: <div className="font-extrabold text-slate-800 hover:text-black transition-colors text-lg tracking-tight">Revolut</div>
    },
    {
      name: 'Zalando',
      content: <div className="font-bold text-slate-800 hover:text-black transition-colors text-lg tracking-tight lowercase">zalando</div>
    },
    {
      name: 'Delivery Hero',
      content: (
        <div className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-black transition-colors text-base">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span>delivery hero</span>
        </div>
      )
    },
    {
      name: 'Klarna',
      content: <div className="font-black text-slate-900 hover:text-black transition-colors text-xl tracking-tight">Klarna.</div>
    },
    {
      name: 'N26',
      content: <div className="border border-slate-800 px-2 py-0.5 rounded font-black text-slate-800 hover:text-black hover:border-black transition-colors text-sm">N26</div>
    },
    {
      name: 'SAP',
      content: <div className="bg-[#0070F2] text-white px-2 py-0.5 rounded font-black text-sm tracking-wider shadow-xs">SAP</div>
    },
    {
      name: 'Booking.com',
      content: <div className="font-black text-[#003580] hover:text-[#00224f] transition-colors text-base tracking-tight">Booking.com</div>
    },
    {
      name: 'Siemens',
      content: <div className="font-extrabold text-slate-800 hover:text-black transition-colors text-base tracking-wider">SIEMENS</div>
    },
    {
      name: 'Wise',
      content: <div className="font-black text-slate-800 hover:text-black transition-colors text-lg tracking-tight">WISE</div>
    }
  ];

  // "Why Inayon?" cards for mobile hero section matching Ixigo reference style
  const whyInayonCards = [
    {
      id: 'pre-vetted',
      bgColor: 'bg-[#F3E8FF]', // soft lavender matching reference
      borderColor: 'border-purple-200/90',
      text: 'Pre-vetted Indian tech talent, evaluated by global leaders',
      tile1: { bg: 'bg-[#0F172A]', icon: <Code2 className="w-3.5 h-3.5 text-cyan-300" /> },
      tile2: { bg: 'bg-[#1E40AF]', icon: <ShieldCheck className="w-5 h-5 text-white" /> },
      tile3: { bg: 'bg-[#EAB308]', icon: <Award className="w-3.5 h-3.5 text-white" /> },
    },
    {
      id: 'fast-hiring',
      bgColor: 'bg-[#FEF3C7]', // warm pastel cream/amber
      borderColor: 'border-amber-200/90',
      text: 'Fast-track hiring in under 48 hours with zero hiring risk',
      tile1: { bg: 'bg-[#065F46]', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-200" /> },
      tile2: { bg: 'bg-[#D97706]', icon: <Zap className="w-5 h-5 text-white fill-white" /> },
      tile3: { bg: 'bg-[#1E293B]', icon: <Clock className="w-3.5 h-3.5 text-amber-200" /> },
    },
    {
      id: 'global-remote',
      bgColor: 'bg-[#E0F2FE]', // soft pastel sky blue
      borderColor: 'border-sky-200/90',
      text: 'Direct interviews with top European & US tech enterprises',
      tile1: { bg: 'bg-[#312E81]', icon: <Building2 className="w-3.5 h-3.5 text-indigo-200" /> },
      tile2: { bg: 'bg-[#0284C7]', icon: <Globe2 className="w-5 h-5 text-white" /> },
      tile3: { bg: 'bg-[#4338CA]', icon: <Sparkles className="w-3.5 h-3.5 text-sky-200" /> },
    },
    {
      id: 'compliant-payroll',
      bgColor: 'bg-[#ECFDF5]', // soft pastel mint green
      borderColor: 'border-emerald-200/90',
      text: '100% remote global contracts with transparent payouts & perks',
      tile1: { bg: 'bg-[#134E4A]', icon: <FileCheck2 className="w-3.5 h-3.5 text-teal-200" /> },
      tile2: { bg: 'bg-[#059669]', icon: <Handshake className="w-5 h-5 text-white" /> },
      tile3: { bg: 'bg-[#0284C7]', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> },
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* ============================================================== */}
      {/* 1. HERO SECTION matching Image 2 with inayon-hero-bg.jpg       */}
      {/* ============================================================== */}
      <section
        id="hero"
        className="relative isolate w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-6 md:pb-14 bg-slate-950 text-white"
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

        {/* Top Hero Content - Starts from top with spacious vertical rhythm */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-2 sm:pt-4 md:pt-6">
          <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl space-y-4 sm:space-y-6">

            {/* Eyebrow Tag matching Image 2 */}
            <p className="text-[11px] sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.28em] text-white/90 uppercase select-none">
              CONNECT <span className="text-white/40 mx-1">•</span> EVALUATE <span className="text-white/40 mx-1">•</span> GROW
            </p>

            {/* Main Headline matching Image 2 */}
            <h1 className="text-3xl sm:text-5xl lg:text-[4.15rem] xl:text-[4.5rem] font-bold text-white tracking-tight leading-[1.12] sm:leading-[1.07] drop-shadow-sm">
              Global Opportunities <br />
              for Real Talent
            </h1>

            {/* Subhead matching Image 2 */}
            <p className="text-white/85 text-xs sm:text-base md:text-lg leading-relaxed max-w-xl font-normal pt-1">
              Inayon connects exceptional Indian talent with global companies, building careers, innovation and a borderless tomorrow.
            </p>

            {/* Elevated, Sleek & Compact Search Card (Reduced Desktop Width, Mobile Preserved) */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 sm:mt-8 md:mt-10 p-5 sm:p-6 md:p-2 lg:p-2.5 rounded-[2rem] md:rounded-full bg-white shadow-2xl border-2 border-white/90 flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-4.5 md:gap-1.5 w-full md:max-w-2xl lg:max-w-[720px] text-slate-900 ring-4 ring-black/10 transition-all"
            >
              {/* Search text input area: guaranteed spacious & click-anywhere to focus */}
              <div
                onClick={() => searchInputRef.current?.focus()}
                className="flex items-center gap-3.5 sm:gap-3.5 md:gap-2.5 px-4 sm:px-6 md:px-3.5 py-4 sm:py-4.5 md:py-1.5 flex-1 min-w-0 md:min-w-[180px] min-h-[70px] sm:min-h-[74px] md:min-h-[46px] cursor-text"
              >
                <Search className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-4.5 md:h-4.5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search jobs, skills, companies..."
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="w-full text-base sm:text-lg md:text-xs lg:text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 py-2 md:py-1 font-medium"
                />
              </div>

              {/* Mobile 2-column controls / Desktop inline selectors */}
              <div className="grid grid-cols-2 md:flex md:items-center gap-3 sm:gap-3.5 md:gap-1 border-t md:border-t-0 border-slate-100 pt-3.5 sm:pt-4 md:pt-0 shrink-0">
                {/* Location dropdown */}
                <div className="flex items-center gap-2.5 md:gap-1.5 px-4 md:px-2 py-3.5 sm:py-4 md:py-1 rounded-2xl md:rounded-none bg-slate-50 md:bg-transparent text-sm sm:text-base md:text-xs text-slate-700 shrink-0 relative min-h-[60px] sm:min-h-[64px] md:min-h-[42px]">
                  <MapPin className="w-5 h-5 md:w-3.5 md:h-3.5 text-slate-500 shrink-0" />
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full md:w-auto bg-transparent text-sm sm:text-base md:text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-6 appearance-none truncate max-w-[120px] lg:max-w-[135px]"
                  >
                    <option value="Anywhere">Anywhere</option>
                    <option value="Berlin, Germany">Berlin, Germany</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Amsterdam, Netherlands">Amsterdam</option>
                    <option value="Stockholm, Sweden">Stockholm</option>
                    <option value="Paris, France">Paris</option>
                    <option value="Remote">100% Remote</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 md:w-3 md:h-3 text-slate-400 pointer-events-none absolute right-1.5 md:right-1" />
                </div>

                <div className="hidden md:block h-6 w-px bg-slate-200 shrink-0 mx-0.5" />

                {/* Role dropdown */}
                <div className="flex items-center gap-2.5 md:gap-1.5 px-4 md:px-2 py-3.5 sm:py-4 md:py-1 rounded-2xl md:rounded-none bg-slate-50 md:bg-transparent text-sm sm:text-base md:text-xs text-slate-700 shrink-0 relative min-h-[60px] sm:min-h-[64px] md:min-h-[42px]">
                  <Briefcase className="w-5 h-5 md:w-3.5 md:h-3.5 text-slate-500 shrink-0" />
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full md:w-auto bg-transparent text-sm sm:text-base md:text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-6 appearance-none truncate max-w-[105px] lg:max-w-[120px]"
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
                  <ChevronDown className="w-3.5 h-3.5 md:w-3 md:h-3 text-slate-400 pointer-events-none absolute right-1.5 md:right-1" />
                </div>
              </div>

              {/* Search Button with Shimmer Sweep Hover */}
              <button
                type="submit"
                className="w-full md:w-auto px-8 sm:px-10 md:px-5 lg:px-6 py-4.5 sm:py-5 md:py-2.5 min-h-[64px] sm:min-h-[66px] md:min-h-[44px] rounded-2xl md:rounded-full bg-slate-950 hover:bg-slate-800 active:bg-slate-900 text-white text-base sm:text-lg md:text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-black/25 hover:shadow-2xl transition-all active:scale-[0.98] cursor-pointer shrink-0 shimmer-button"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4 md:w-3.5 md:h-3.5" />
              </button>
            </form>

            {/* Why Inayon? Horizontal Cards - Mobile Only */}
            <div className="md:hidden mt-7 sm:mt-8 pt-1">
              <div className="flex items-center justify-between mb-3 px-0.5">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Why Inayon?</span>
                
                </h3>
                <span className="text-[10px] sm:text-xs text-white/60 font-medium">Swipe to explore →</span>
              </div>

              {/* Horizontal Scroll Track - flush left with search card & right peek matching screenshot */}
              <div className="flex gap-3 overflow-x-auto pb-2.5 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {whyInayonCards.map((card) => (
                  <div
                    key={card.id}
                    className={`w-[78vw] max-w-[315px] min-h-[106px] sm:min-h-[112px] shrink-0 snap-start ${card.bgColor} ${card.borderColor} border rounded-2xl p-4 sm:p-4.5 flex items-center gap-3.5 shadow-md relative overflow-hidden`}
                  >
                    {/* Background subtle decorative watermark */}
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/40 pointer-events-none" />
                    <div className="absolute top-1.5 left-2.5 text-[10px] text-slate-400/50 pointer-events-none select-none">✦</div>

                    {/* Illustrated Cluster Badge matching Ixigo reference */}
                    <div className="relative w-16 h-13 shrink-0 flex items-center justify-center select-none">
                      {/* Left tilted background tile */}
                      <div className={`w-8 h-8 rounded-lg ${card.tile1.bg} shadow-sm flex items-center justify-center absolute left-0.5 top-1 -rotate-12 border border-white/20`}>
                        {card.tile1.icon}
                      </div>

                      {/* Main center badge */}
                      <div className={`w-10.5 h-10.5 rounded-xl ${card.tile2.bg} shadow-md flex items-center justify-center z-10 border border-white/30`}>
                        {card.tile2.icon}
                      </div>

                      {/* Right tilted trailing tile */}
                      <div className={`w-7 h-7 rounded-md ${card.tile3.bg} shadow-xs flex items-center justify-center absolute right-0.5 bottom-1 rotate-12 border border-white/20 z-20`}>
                        {card.tile3.icon}
                      </div>
                    </div>

                    {/* Card Text Content */}
                    <p className="flex-1 text-slate-900 font-bold text-xs sm:text-[13px] leading-snug select-none">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Stats Row (Unchanged for desktop) */}
            <div className="hidden md:flex pt-6 sm:pt-8 flex-wrap items-center gap-6 sm:gap-10 lg:gap-12 text-white">
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

            {/* Mobile Compact Stats Strip (Spacious padding & margin) */}
            <div className="grid grid-cols-3 gap-1 pt-5 sm:pt-6 mt-8 sm:mt-9 border-t border-white/15 text-white md:hidden">
              {/* Stat 1: 10M+ Talented Professionals */}
              <div className="flex flex-col items-center text-center py-2 sm:py-2.5">
                <div className="text-base font-black tracking-tight text-white leading-none">10M+</div>
                <div className="text-[10px] sm:text-xs text-white/75 font-medium leading-tight mt-1">Talented Pros</div>
              </div>

              {/* Stat 2: 50K+ Global Companies */}
              <div className="flex flex-col items-center text-center py-2 sm:py-2.5 border-x border-white/15">
                <div className="text-base font-black tracking-tight text-white leading-none">50K+</div>
                <div className="text-[10px] sm:text-xs text-white/75 font-medium leading-tight mt-1">Companies</div>
              </div>

              {/* Stat 3: 150+ Countries */}
              <div className="flex flex-col items-center text-center py-2 sm:py-2.5">
                <div className="text-base font-black tracking-tight text-white leading-none">150+</div>
                <div className="text-[10px] sm:text-xs text-white/75 font-medium leading-tight mt-1">Countries</div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: 3 Floating Glass Cards on Left + "Watch Our Story" on Right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-4 sm:pt-6 md:pt-12 pb-4 sm:pb-6 md:pb-0 shrink-0">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-4 sm:gap-6">

            {/* 3 Glass Cards matching Image 2 (Hidden on mobile per user request, visible on md+) */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full lg:max-w-3xl">

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

            {/* Bottom Right: "Watch Our Story" button */}
            <div className="shrink-0 mb-1 flex justify-center lg:justify-end w-full md:w-auto">
              <button
                type="button"
                onClick={() => setStoryModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2.5 rounded-full bg-slate-950/45 hover:bg-slate-950/65 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors shrink-0">
                  <Play className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white text-white ml-0.5" />
                </div>
                <span className="tracking-wide text-[11px] md:text-xs">Watch Our Story</span>
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
      {/* 2. TRUSTED BY INNOVATIVE COMPANIES ACROSS EUROPE (MARQUEE)     */}
      {/* ============================================================== */}
      <section className="py-8 sm:py-10 border-y border-slate-100 bg-white relative overflow-hidden reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trusted by innovative companies across Europe
          </p>
        </div>

        {/* Continuous Horizontal Marquee */}
        <div className="relative w-full overflow-hidden select-none">
          {/* Subtle gradient fades at left and right edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Marquee Track (Smooth Infinite Scroll) */}
          <div className="flex w-max animate-marquee items-center">
            {/* Primary Track */}
            <div className="flex items-center gap-10 sm:gap-14 lg:gap-16 pr-10 sm:pr-14 lg:pr-16 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
              {trustedCompanies.map((c, i) => (
                <div key={`c1-${i}`} className="shrink-0 flex items-center">
                  {c.content}
                </div>
              ))}
            </div>

            {/* Duplicate Track for Infinite Seamless Loop */}
            <div className="flex items-center gap-10 sm:gap-14 lg:gap-16 pr-10 sm:pr-14 lg:pr-16 shrink-0 opacity-80 hover:opacity-100 transition-opacity" aria-hidden="true">
              {trustedCompanies.map((c, i) => (
                <div key={`c2-${i}`} className="shrink-0 flex items-center">
                  {c.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FEATURED OPPORTUNITIES                                      */}
      {/* ============================================================== */}
      <section id="verified-jobs" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 reveal-on-scroll">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
             
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
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 reveal-on-scroll delay-100">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${active
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Premium Job Cards Grid - 1 Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredJobs.slice(0, 4).map((job, idx) => (
              <div
                key={idx}
                className={`group relative p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between reveal-on-scroll delay-${(idx % 4) * 100}`}
              >
                <div>
                  {/* Top Bar: Original Company Logo + Company & Remote Pill */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {job.logo}
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">{job.company}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Verified Partner</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {job.remote}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {job.role}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.location}</span>
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.tags.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-600 group-hover:border-slate-300 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Salary & Posted date & View button */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Compensation</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm">{job.salary}</span>
                  </div>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. WHY CHOOSE US                                               */}
      {/* ============================================================== */}
      <section id="for-talent" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Left Content & Right Globe Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Heading, intro, badge */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-5 sm:space-y-6 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] border border-purple-200/60 text-[#7C3AED] text-xs font-bold tracking-wide">
               
                <span>WHY CHOOSE US</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                A Modern Hiring Platform <br className="hidden sm:inline" />
                for a{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Borderless World.
                </span>
              </h2>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
                We combine verified talent, expert evaluations, and efficient matching to help global companies build world-class teams from India.
              </p>
            </div>

            {/* Right Column: Globe graphic */}
            <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center relative reveal-on-scroll delay-200">
              <div className="relative w-full max-w-lg lg:max-w-none">
                {/* Soft ambient backlight */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100/40 via-purple-100/30 to-indigo-100/30 rounded-full blur-2xl pointer-events-none -z-10" />
                <img
                  src="/global-talent-globe.jpg"
                  alt="A Modern Hiring Platform for a Borderless World"
                  className="w-full h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-sm transition-transform duration-500 hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            </div>

          </div>

          {/* 4 Key Stats Strip matching design */}
          <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-10 border-t border-slate-100 reveal-on-scroll delay-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
              {/* Stat 1: Developers */}
              <div className="flex flex-col items-start p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 lg:bg-transparent lg:border-0 lg:p-0 lg:pr-8 xl:pr-10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-blue-200/80 bg-blue-50/40 text-blue-600 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[1.8]" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  10K+
                </p>
                <p className="mt-1.5 sm:mt-2.5 text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
                  DEVELOPERS
                </p>
              </div>

              {/* Stat 2: Global Companies */}
              <div className="flex flex-col items-start p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 lg:bg-transparent lg:border-0 lg:p-0 lg:px-8 xl:px-10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-blue-200/80 bg-blue-50/40 text-blue-600 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[1.8]" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  500+
                </p>
                <p className="mt-1.5 sm:mt-2.5 text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
                  GLOBAL COMPANIES
                </p>
              </div>

              {/* Stat 3: Expert Evaluators */}
              <div className="flex flex-col items-start p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 lg:bg-transparent lg:border-0 lg:p-0 lg:px-8 xl:px-10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-blue-200/80 bg-blue-50/40 text-blue-600 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[1.8]" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  2K+
                </p>
                <p className="mt-1.5 sm:mt-2.5 text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
                  EXPERT EVALUATORS
                </p>
              </div>

              {/* Stat 4: Successful Placements */}
              <div className="flex flex-col items-start p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 lg:bg-transparent lg:border-0 lg:p-0 lg:pl-8 xl:pl-10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-blue-200/80 bg-blue-50/40 text-blue-600 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 stroke-[1.8]" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  95%
                </p>
                <p className="mt-1.5 sm:mt-2.5 text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
                  SUCCESSFUL PLACEMENTS
                </p>
              </div>
            </div>
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
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-8 sm:p-10 border border-indigo-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden reveal-on-scroll">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold">
               
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
      {/* 6. HOW IT WORKS: KLARNA-STYLE STICKY SPLIT SCROLL SECTION      */}
      {/* ============================================================== */}
      {/* 6. HOW IT WORKS (Sticky split view on both desktop & mobile)   */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-bold tracking-wide mb-3">
           
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Designed around your career.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
              Scroll through each step to see how verified engineering talent connects with leading global companies.
            </p>
          </div>

          {/* Sticky Split Grid */}
          <div className="relative flex flex-col lg:flex-row items-start gap-8 sm:gap-12 lg:gap-16">

            {/* Left Column: Sticky Visual Frame (Sticky on both mobile & desktop) */}
            <div
              style={{ position: 'sticky' }}
              className="w-full lg:w-1/2 sticky top-[72px] sm:top-20 lg:top-28 z-30 pt-1 pb-3 bg-white lg:bg-transparent transition-all"
            >
              <div className="relative h-[285px] sm:h-[350px] lg:h-[600px] w-full rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-xl lg:shadow-2xl border border-slate-200/90 bg-slate-950">
                {howSteps.map((step, idx) => {
                  const isVisible = activeHowStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${isVisible
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    >
                      {/* Photo Asset */}
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover object-center select-none pointer-events-none"
                      />

                      {/* Vignette Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent" />

                      {/* Floating UI Elements on top of image */}
                      <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-end pointer-events-none">
                        {/* Bottom Pill Badge */}
                        <div className="self-center">
                          <div className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold tracking-wide shadow-2xl">
                            {step.badgeText}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Scrolling Typographic Step List */}
            <div className="w-full lg:w-1/2 flex flex-col py-4 sm:py-6 lg:py-12 pb-20 lg:pb-36">
              {howSteps.map((step, idx) => {
                const isActive = activeHowStep === idx;
                return (
                  <div
                    key={idx}
                    ref={(el) => (stepRefs.current[idx] = el)}
                    onClick={() => scrollToStep(idx)}
                    className="min-h-[44vh] sm:min-h-[48vh] lg:min-h-[58vh] scroll-mt-96 lg:scroll-mt-36 flex flex-col justify-center cursor-pointer group transition-all duration-300 py-6 sm:py-8 border-b border-slate-100 last:border-b-0 lg:border-b-0"
                  >
                    {/* Big Step Title */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold tracking-widest uppercase transition-all px-2.5 py-1 rounded-full ${isActive
                            ? 'text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs'
                            : 'text-slate-400 bg-slate-100 group-hover:text-slate-600'
                          }`}
                      >
                        0{idx + 1}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                          Active Step
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] sm:leading-[1.1] mt-2.5 sm:mt-3 transition-all duration-300 ${isActive
                          ? 'text-slate-950 scale-100'
                          : 'text-slate-300 hover:text-slate-400 scale-[0.98] origin-left'
                        }`}
                    >
                      {step.title}
                    </h3>

                    {/* Expandable / Opacity-tuned Description */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out ${isActive
                          ? 'max-h-64 opacity-100 mt-4 sm:mt-5'
                          : 'max-h-24 opacity-35 mt-3 group-hover:opacity-70'
                        }`}
                    >
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
                        {step.description}
                      </p>

                      {isActive && (
                        <div className="pt-4 flex items-center gap-2 text-indigo-600 font-bold text-xs sm:text-sm group-hover:text-indigo-700">
                          <span>Get started with this step</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. TESTIMONIALS (Horizontal auto + manual scroll on mobile)    */}
      {/* ============================================================== */}
      <section id="testimonials" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Developers and Companies
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8 sm:mb-12">
            Hear what our community has to say.
          </p>

          {/* Desktop Grid Layout (visible on md+) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl ${item.color} font-serif leading-none`}>“</span>
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-10 h-10 rounded-full object-cover shadow-xs"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.author}</h4>
                      <p className="text-[10px] text-slate-500">{item.role}</p>
                    </div>
                  </div>
                  <span className="text-lg" title={item.role}>{item.country}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Horizontal Scroll Carousel with Left/Right Arrows + Auto/Manual Scroll */}
          <div className="md:hidden">
            {/* Scrollable Track */}
            <div
              ref={testimonialScrollRef}
              onScroll={handleTestimonialScroll}
              onTouchStart={() => setIsTestimonialAutoPaused(true)}
              onTouchEnd={() => {
                setTimeout(() => setIsTestimonialAutoPaused(false), 5000);
              }}
              onMouseEnter={() => setIsTestimonialAutoPaused(true)}
              onMouseLeave={() => setIsTestimonialAutoPaused(false)}
              className="flex gap-3.5 overflow-x-auto pb-3 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-smooth scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-left"
            >
              {testimonials.map((item, idx) => (
                <div
                  key={item.id}
                  className={`w-[84vw] max-w-[325px] shrink-0 snap-center p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between transition-all duration-300 ${activeTestimonial === idx
                      ? 'shadow-md border-blue-200 ring-2 ring-blue-500/15'
                      : 'shadow-xs opacity-90'
                    }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-3xl ${item.color} font-serif leading-none`}>“</span>
                      <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-10 h-10 rounded-full object-cover shadow-xs shrink-0"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{item.author}</h4>
                        <p className="text-[10px] text-slate-500">{item.role}</p>
                      </div>
                    </div>
                    <span className="text-lg">{item.country}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Carousel Controls: Left/Right Arrows + Indicator Dots */}
            <div className="flex items-center justify-between mt-4 px-2">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => {
                  setIsTestimonialAutoPaused(true);
                  handlePrevTestimonial();
                  setTimeout(() => setIsTestimonialAutoPaused(false), 5000);
                }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setIsTestimonialAutoPaused(true);
                      scrollToTestimonial(i);
                      setTimeout(() => setIsTestimonialAutoPaused(false), 5000);
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${activeTestimonial === i
                        ? 'w-5 h-1.5 bg-slate-900'
                        : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                  />
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => {
                  setIsTestimonialAutoPaused(true);
                  handleNextTestimonial();
                  setTimeout(() => setIsTestimonialAutoPaused(false), 5000);
                }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
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
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${billingCycle === 'monthly'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${billingCycle === 'yearly'
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
      {/* 9. BOTTOM CTA BANNER: READY FOR A GLOBAL CAREER? (COMPACT)     */}
      {/* ============================================================== */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Soft Premium Obsidian Black Banner Card */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#161922] via-[#0F1117] to-[#0B0C10] border border-white/[0.12] shadow-2xl shadow-black/50 px-4 sm:px-10 py-8 sm:py-10 text-center overflow-hidden reveal-on-scroll">

            {/* Subtle soft ambient light glow in background */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-3.5">



              {/* Main Headline */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Be Part of a Borderless{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Tech Community.
                </span>
              </h2>

              {/* Subhead */}
              <p className="text-xs sm:text-sm text-slate-300/90 max-w-lg mx-auto leading-relaxed font-normal">
                Join <strong className="text-white font-semibold">Inayon</strong> to get evaluated by senior engineers, access verified global roles, and accelerate your tech career.
              </p>

              {/* Action Buttons: Side-by-side on the same horizontal line for mobile */}
              <div className="pt-2 flex flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-md mx-auto">
                <Link
                  to="/register"
                  className="flex-1 sm:flex-initial px-3 sm:px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-[11px] sm:text-xs font-bold inline-flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap shimmer-button"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 shrink-0" />
                </Link>

                <Link
                  to="/contact"
                  className="flex-1 sm:flex-initial px-3 sm:px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.15] hover:border-white/30 text-[11px] sm:text-xs font-semibold backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap text-center justify-center inline-flex items-center"
                >
                  Talk to Our Team
                </Link>
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
