import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe,
  ArrowRight,
  Menu,
  X,
  Award,
  ShieldCheck,
  Clock,
  LogOut,
  ChevronDown,
  User,
  Zap,
  Briefcase,
  Calendar,
  Gift,
  Settings,
  FileCheck,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Send
} from 'lucide-react';
import { BecomeEvaluatorModal } from '../components/BecomeEvaluatorModal';
import { api } from '@thamilarasan/api-client';

export const PublicLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evaluatorStatus, setEvaluatorStatus] = useState<string>('NONE');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('tg_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for transparent vs white navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuKey);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Close profile dropdown and nav menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setLanguageDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setActiveDropdown(null);
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const loadStatus = async () => {
    try {
      const candId = currentUser?.candidateId || 'cand-1';
      const res = await api.getEvaluatorAppStatus(candId);
      if (res.success && res.data) {
        setEvaluatorStatus(res.data.status);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadStatus();

    const handleAuthChange = () => {
      try {
        const stored = localStorage.getItem('tg_user');
        const user = stored ? JSON.parse(stored) : null;
        setCurrentUser(user);
        if (user?.evaluatorStatus) {
          setEvaluatorStatus(user.evaluatorStatus);
        }
      } catch {
        setCurrentUser(null);
      }
      loadStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tg_user');
    localStorage.removeItem('tg_token');
    api.logout();
    setCurrentUser(null);
    setEvaluatorStatus('NONE');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const isApprovedEvaluator =
    evaluatorStatus === 'APPROVED' ||
    currentUser?.isEvaluator ||
    currentUser?.evaluatorStatus === 'APPROVED' ||
    currentUser?.role === 'EVALUATOR';

  const [activeSection, setActiveSection] = useState<string>('hero');

  const navLinks = [
    { label: 'Home', sectionId: 'hero' },
    { label: 'For Talent', sectionId: 'for-talent' },
    { label: 'For Companies', sectionId: 'for-companies' },
    { label: 'For Evaluators', sectionId: 'for-evaluators' },
    { label: 'Resources', sectionId: 'how-it-works' },
    { label: 'Pricing', sectionId: 'pricing' },
  ];

  const scrollToSection = (sectionId: string) => {
    setMobileOpen(false);
    if (sectionId === 'hero') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('hero');
        window.history.pushState(null, '', '/');
      } else {
        navigate('/');
      }
      return;
    }

    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -72;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
        setActiveSection(sectionId);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  // Scroll to hash on page load or navigation to /
  useEffect(() => {
    if (location.pathname === '/') {
      const hash = location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const yOffset = -72;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(hash);
          }
        }, 120);
      }
    }
  }, [location.pathname, location.hash]);

  // Track active section on scroll when on landing page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = ['hero', 'for-talent', 'for-companies', 'for-evaluators', 'how-it-works', 'pricing'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Listen to open-eval-modal custom event from home page buttons
  useEffect(() => {
    const handleOpenEvalModal = () => setEvalModalOpen(true);
    window.addEventListener('open-eval-modal', handleOpenEvalModal);
    return () => window.removeEventListener('open-eval-modal', handleOpenEvalModal);
  }, []);

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubscribed(false);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Floating Header: Fixed top container, takes 0px in flow so hero covers 100% from top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-3 sm:py-4 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto" ref={navContainerRef}>
          <div
            className={`transition-all duration-300 rounded-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-7 py-2 sm:py-2.5 ${
              isScrolled
                ? 'bg-white/95 border border-slate-200/90 backdrop-blur-xl shadow-xl shadow-slate-900/10 text-slate-800'
                : 'bg-slate-950/60 border border-white/20 backdrop-blur-xl shadow-2xl shadow-black/25 text-white'
            }`}
          >
            {/* 1. Brand Logo: Smooth cross-fade between Image 1 (White) and Image 2 (Dark) */}
            <Link
              to="/"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveSection('hero');
                  window.history.pushState(null, '', '/');
                }
              }}
              className="flex items-center gap-2 shrink-0 group focus:outline-none"
              aria-label="Inayon Home"
            >
              <div className="relative h-9 sm:h-10 md:h-11 w-36 sm:w-44 flex items-center">
                {/* 1st Image Logo: Pure White for transparent/dark backdrop */}
                <img
                  src="/inayon-white.png"
                  alt="Inayon"
                  className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${
                    isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                />
                {/* 2nd Image Logo: Pure Dark for white backdrop */}
                <img
                  src="/inayon-dark.png"
                  alt="Inayon"
                  className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${
                    isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                />
              </div>
            </Link>

            {/* 2. Desktop Navigation matching Design 3: Jobs, Talent ˅, Companies ˅, About ˅, Resources ˅ */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* Jobs */}
              <Link
                to="/jobs"
                className={`text-xs xl:text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:text-slate-950'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Jobs
              </Link>

              {/* Talent Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('talent')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('for-talent')}
                  className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                    isScrolled
                      ? 'text-slate-700 hover:text-slate-950'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Talent</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'talent' ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}
                  />
                </button>

                {activeDropdown === 'talent' && (
                  <div className="absolute left-0 top-full pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div
                      className={`rounded-2xl p-2.5 shadow-2xl border ${
                        isScrolled
                          ? 'bg-white/98 backdrop-blur-xl border-slate-200/90 text-slate-800 ring-1 ring-black/5'
                          : 'bg-slate-950/95 backdrop-blur-2xl border-white/20 text-white ring-1 ring-white/10'
                      }`}
                    >
                      <Link
                        to="/jobs"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col p-2.5 rounded-xl text-left transition-colors ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Browse Remote Jobs</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Explore verified European and global remote tech positions
                        </span>
                      </Link>

                      <Link
                        to="/talent/stack-passes"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col p-2.5 rounded-xl text-left transition-colors ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Domain Stack Passes</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Verified skill passes for React, Node.js, Python, and AI/ML
                        </span>
                      </Link>

                      <Link
                        to="/talent/evaluations"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col p-2.5 rounded-xl text-left transition-colors ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Evaluations Dossier</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Comprehensive benchmark scores, code rubrics and radar charts
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          setEvalModalOpen(true);
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold text-indigo-400">Become an Evaluator</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Earn compensation evaluating peer code submissions and interviews
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Companies Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('companies')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('for-companies')}
                  className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                    isScrolled
                      ? 'text-slate-700 hover:text-slate-950'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Companies</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'companies' ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}
                  />
                </button>

                {activeDropdown === 'companies' && (
                  <div className="absolute left-0 top-full pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div
                      className={`rounded-2xl p-2.5 shadow-2xl border ${
                        isScrolled
                          ? 'bg-white/98 backdrop-blur-xl border-slate-200/90 text-slate-800 ring-1 ring-black/5'
                          : 'bg-slate-950/95 backdrop-blur-2xl border-white/20 text-white ring-1 ring-white/10'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          scrollToSection('for-companies');
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Hire Vetted Talent</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Pre-evaluated Indian senior developers ready for instant interview
                        </span>
                      </button>

                      <a
                        href="http://localhost:3002"
                        className={`flex flex-col p-2.5 rounded-xl text-left transition-colors ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Company Portal</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Access company dashboard, post requirements and manage pipelines
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          scrollToSection('how-it-works');
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Evaluation Standards</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Learn how our 3-stage validation process ensures top 2% engineering
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('about')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                    isScrolled
                      ? 'text-slate-700 hover:text-slate-950'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'about' ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}
                  />
                </button>

                {activeDropdown === 'about' && (
                  <div className="absolute left-0 top-full pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div
                      className={`rounded-2xl p-2.5 shadow-2xl border ${
                        isScrolled
                          ? 'bg-white/98 backdrop-blur-xl border-slate-200/90 text-slate-800 ring-1 ring-black/5'
                          : 'bg-slate-950/95 backdrop-blur-2xl border-white/20 text-white ring-1 ring-white/10'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          scrollToSection('how-it-works');
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">How It Works</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          From initial tech challenge to evaluated dossier and placement
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          scrollToSection('for-evaluators');
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Peer Evaluator Network</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Senior tech leads conducting standardized, fair evaluations
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          scrollToSection('pricing');
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Pricing & Packages</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Transparent candidate passes and company subscription options
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('resources')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                    isScrolled
                      ? 'text-slate-700 hover:text-slate-950'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'resources' ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}
                  />
                </button>

                {activeDropdown === 'resources' && (
                  <div className="absolute left-0 top-full pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div
                      className={`rounded-2xl p-2.5 shadow-2xl border ${
                        isScrolled
                          ? 'bg-white/98 backdrop-blur-xl border-slate-200/90 text-slate-800 ring-1 ring-black/5'
                          : 'bg-slate-950/95 backdrop-blur-2xl border-white/20 text-white ring-1 ring-white/10'
                      }`}
                    >
                      <Link
                        to="/talent/stack-passes"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col p-2.5 rounded-xl text-left transition-colors ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Tech Stack Standards</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Standardized benchmarks for frontend, backend, AI & DevOps
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          scrollToSection('for-evaluators');
                        }}
                        className={`w-full flex flex-col p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Evaluator Rubrics</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          Open scoring criteria: code quality, architecture & problem solving
                        </span>
                      </button>

                      <Link
                        to="/jobs"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex flex-col p-2.5 rounded-xl text-left transition-colors ${
                          isScrolled ? 'hover:bg-slate-50' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">Salary Index</span>
                        <span className={`text-[11px] leading-snug mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                          European remote compensation ranges and currency benchmarks
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* 3. Action CTAs matching Design 3: Globe EN ˅, Login (outline), Get Started -> */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language Selector: Globe EN ˅ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isScrolled
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  title="Select Language"
                >
                  <Globe className="w-4 h-4" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {languageDropdownOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-36 rounded-xl p-1.5 shadow-xl border z-50 animate-in fade-in slide-in-from-top-1 ${
                      isScrolled
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-950/95 border-white/20 text-white backdrop-blur-xl'
                    }`}
                  >
                    {[
                      { code: 'EN', label: 'English' },
                      { code: 'DE', label: 'Deutsch' },
                      { code: 'FR', label: 'Français' },
                      { code: 'ES', label: 'Español' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setLanguageDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                          selectedLanguage === lang.code
                            ? isScrolled
                              ? 'bg-slate-100 text-slate-900 font-bold'
                              : 'bg-white/20 text-white font-bold'
                            : isScrolled
                            ? 'hover:bg-slate-50 text-slate-700'
                            : 'hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] opacity-60 font-mono">{lang.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentUser ? (
                <div className="relative pl-1" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none ${
                      isScrolled
                        ? profileDropdownOpen
                          ? 'bg-slate-100 border-slate-300 shadow-sm ring-2 ring-blue-500/10'
                          : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-xs'
                        : profileDropdownOpen
                        ? 'bg-white/20 border-white/40 shadow-sm ring-2 ring-white/20'
                        : 'bg-white/10 hover:bg-white/15 border-white/20 text-white shadow-xs'
                    }`}
                    aria-expanded={profileDropdownOpen}
                    aria-label="User profile menu"
                  >
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {currentUser.fullName?.charAt(0) || 'K'}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="hidden xl:block text-left pr-0.5">
                      <span className={`text-xs font-bold block leading-tight truncate max-w-[110px] ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                        {currentUser.fullName || 'User'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        profileDropdownOpen ? 'rotate-180 text-blue-500' : isScrolled ? 'text-slate-400' : 'text-white/60'
                      }`}
                    />
                  </button>

                  {/* Profile & Features Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-84 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden ring-1 ring-black/5 text-slate-900">
                      <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                              {currentUser.fullName?.charAt(0) || 'K'}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="font-bold text-slate-900 text-sm truncate leading-tight">
                              {currentUser.fullName || 'Karthik Iyer'}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {currentUser.email || 'candidate@example.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/talent/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-800">My Profile</span>
                              <span className="text-[10px] text-slate-400 block font-normal">Skills, Experience & Verification</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          to="/talent/stack-passes"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                              <Zap className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-800">Domain Stack Passes</span>
                              <span className="text-[10px] text-slate-400 block font-normal">Active Tech Stacks & Verification</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          to="/talent/evaluations"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                              <FileCheck className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-800">Evaluations Dossier</span>
                              <span className="text-[10px] text-slate-400 block font-normal">Scores, Rubrics & Reports</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          to="/talent/applications"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                              <Briefcase className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-800">Job Applications</span>
                              <span className="text-[10px] text-slate-400 block font-normal">Submitted & Active Pipelines</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          to="/talent/interviews"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-800">Scheduled Interviews</span>
                              <span className="text-[10px] text-slate-400 block font-normal">Video Rounds & Calendar</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          to="/talent/offers"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                              <Gift className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-bold text-slate-800">Job Offers</span>
                              <span className="text-[10px] text-slate-400 block font-normal">Compensation & Contracts</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </div>

                      {/* Dual Role Evaluator Access if approved */}
                      {isApprovedEvaluator ? (
                        <div className="p-2 pt-0">
                          <Link
                            to="/evaluator/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck className="w-4 h-4 text-purple-600" />
                              <div>
                                <span className="block">Evaluator Workstation</span>
                                <span className="text-[10px] text-purple-600/80 block font-normal">Dual-Role Peer Evaluations</span>
                              </div>
                            </div>
                            <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-mono font-bold">
                              Active
                            </span>
                          </Link>
                        </div>
                      ) : (
                        <div className="p-2 pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              setEvalModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Award className="w-3.5 h-3.5 text-purple-600" />
                              <span>Become an Evaluator</span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-purple-400" />
                          </button>
                        </div>
                      )}

                      {/* Account Settings & Sign Out */}
                      <div className="p-2 pt-1 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <Link
                          to="/talent/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Settings</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login and Get Started Buttons matching Design 3 */
                <>
                  <Link
                    to="/login"
                    className={`text-xs xl:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border transition-all ${
                      isScrolled
                        ? 'border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-100'
                        : 'border-white/35 hover:border-white/60 text-white hover:bg-white/10'
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className={`text-xs xl:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm group ${
                      isScrolled
                        ? 'bg-slate-950 hover:bg-slate-800 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-950'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden max-w-7xl mx-auto px-4 mt-2">
            <div
              className={`rounded-2xl p-4 space-y-4 shadow-2xl border ${
                isScrolled
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-slate-950/95 border-white/20 text-white backdrop-blur-2xl'
              }`}
            >
              {currentUser && (
                <div className={`p-3 rounded-xl border space-y-2.5 ${isScrolled ? 'bg-slate-50 border-slate-200' : 'bg-white/10 border-white/10'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {currentUser.fullName?.charAt(0) || 'K'}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className={`text-xs font-bold truncate ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                        {currentUser.fullName || 'Karthik Iyer'}
                      </p>
                      <p className={`text-[10px] truncate ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                        {currentUser.email || 'candidate@example.com'}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-2 border-t flex flex-col gap-1 text-xs ${isScrolled ? 'border-slate-200' : 'border-white/10'}`}>
                    <Link
                      to="/talent/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-1.5 font-semibold hover:opacity-80"
                    >
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/talent/stack-passes"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-1.5 font-semibold hover:opacity-80"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Domain Stack Passes</span>
                    </Link>
                    <Link
                      to="/talent/evaluations"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-1.5 font-semibold hover:opacity-80"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Evaluations Dossier</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 py-1.5 font-semibold text-rose-500 text-left pt-2 border-t border-slate-200/50 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Links on Mobile */}
              <div className="space-y-1">
                <Link
                  to="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span>Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection('for-talent')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span>For Talent</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('for-companies')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span>For Companies</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span>About & How It Works</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('pricing')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span>Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </div>

              {/* Language Switcher on Mobile */}
              <div className={`pt-2 border-t flex items-center justify-between px-3 ${isScrolled ? 'border-slate-200 text-slate-700' : 'border-white/10 text-white'}`}>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Globe className="w-4 h-4" />
                  <span>Language:</span>
                </div>
                <div className="flex items-center gap-1">
                  {['EN', 'DE', 'FR', 'ES'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer ${
                        selectedLanguage === lang
                          ? isScrolled
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-950'
                          : isScrolled
                          ? 'text-slate-500 hover:text-slate-900'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {!currentUser && (
                <div className={`pt-2 border-t flex flex-col gap-2 ${isScrolled ? 'border-slate-200' : 'border-white/10'}`}>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full text-center py-2 text-xs font-semibold rounded-full border ${
                      isScrolled
                        ? 'border-slate-300 text-slate-800'
                        : 'border-white/30 text-white'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full text-center py-2 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 shadow-sm ${
                      isScrolled
                        ? 'bg-slate-950 text-white'
                        : 'bg-white text-slate-950'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${location.pathname !== '/' ? 'pt-24 sm:pt-28 bg-[#F8FAFC]' : 'bg-white'}`}>
        <Outlet />
      </main>

      {/* Global Footer matching reference screenshot */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
            
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/inayon-dark.png"
                  alt="Inayon"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
                Connecting global companies with India's top tech talent.
              </p>
              
              {/* Social icons */}
              <div className="flex items-center gap-4 text-slate-400 pt-1">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => scrollToSection('for-talent')} className="hover:text-blue-600 transition-colors cursor-pointer text-left">For Talent</button></li>
                <li><button onClick={() => scrollToSection('for-companies')} className="hover:text-blue-600 transition-colors cursor-pointer text-left">For Companies</button></li>
                <li><button onClick={() => scrollToSection('for-evaluators')} className="hover:text-blue-600 transition-colors cursor-pointer text-left">For Evaluators</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors cursor-pointer text-left">Pricing</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="hover:text-blue-600 transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }} className="hover:text-blue-600 transition-colors cursor-pointer">Success Stories</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="hover:text-blue-600 transition-colors cursor-pointer">Help Center</a></li>
                <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Company & Newsletter */}
            <div>
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-blue-600 transition-colors">Press</Link></li>
              </ul>
            </div>

            {/* Subscribe to newsletter */}
            <div className="lg:col-span-1 space-y-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribeNewsletter} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Get the latest opportunities and updates"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full text-xs pl-3 pr-9 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-7 h-7 bg-slate-900 hover:bg-slate-800 text-white rounded-md flex items-center justify-center transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="text-[11px] text-emerald-600 font-medium">Thank you for subscribing!</p>
              )}
            </div>

          </div>

          {/* Bottom sub-footer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
            <p>© 2026 THAMILARASAN GLOBAL. All rights reserved.</p>
            <p className="text-slate-400">First Evaluator: Win</p>
          </div>
        </div>
      </footer>

      {/* Become an Evaluator Modal */}
      <BecomeEvaluatorModal
        isOpen={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        onApplicationUpdated={loadStatus}
        currentStatus={evaluatorStatus}
      />
    </div>
  );
};
