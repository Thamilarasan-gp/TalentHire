import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PortalSwitcher } from '@thamilarasan/ui';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Explore Jobs', path: '/jobs' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'For Engineers', path: '/for-engineers' },
    { label: 'For Evaluators', path: '/for-evaluators' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Stories', path: '/success-stories' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PortalSwitcher />

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-black text-lg">
              TG
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base block leading-none">
                THAMILARASAN GLOBAL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block mt-0.5">
                Find. Evaluate. Hire.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold tracking-tight transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold px-3.5 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/talent/dashboard"
              className="text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>Talent Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/talent/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium bg-blue-600 text-white rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-900 text-xs">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  TG
                </div>
                <span className="font-bold text-white text-sm tracking-tight">THAMILARASAN GLOBAL</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
                The global talent hiring infrastructure connecting international companies with vetted Indian software engineers through deterministic requirement matching and independent expert evaluators.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-blue-400 font-semibold bg-blue-950/60 border border-blue-900/80 px-3 py-1.5 rounded-full w-fit">
                <Globe className="w-3.5 h-3.5" />
                <span>INDIAN TALENT × GLOBAL OPPORTUNITIES</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 tracking-tight">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="hover:text-white transition-colors">Verified Jobs</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/for-engineers" className="hover:text-white transition-colors">For Engineers</Link></li>
                <li><Link to="/for-evaluators" className="hover:text-white transition-colors">For Evaluators</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 tracking-tight">Experience</h4>
              <ul className="space-y-2">
                <li><Link to="/talent/dashboard" className="hover:text-white transition-colors">Candidate Workspace</Link></li>
                <li><Link to="/evaluator/dashboard" className="hover:text-white transition-colors">Evaluator Workspace</Link></li>
                <li><a href="http://localhost:3002" className="hover:text-white transition-colors">Company Portal</a></li>
                <li><a href="http://localhost:3001" className="hover:text-white transition-colors">Admin Command</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 tracking-tight">Company & Trust</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} THAMILARASAN GLOBAL. People • Skills • Opportunities • Without Borders.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Confidentiality Agreement</span>
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Security Practices</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
