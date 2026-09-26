import React, { useState } from 'react';
import { api } from '@thamilarasan/api-client';
import { Button } from '@thamilarasan/ui';
import {
  ShieldCheck,
  X,
  Award,
  Briefcase,
  Linkedin,
  Github,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface BecomeEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationUpdated: () => void;
  currentStatus?: string;
  applicationData?: any;
}

export const BecomeEvaluatorModal: React.FC<BecomeEvaluatorModalProps> = ({
  isOpen,
  onClose,
  onApplicationUpdated,
  currentStatus = 'NONE',
  applicationData,
}) => {
  const [formData, setFormData] = useState(() => {
    let defaultName = 'Karthik Iyer';
    let defaultEmail = 'karthik.iyer1@example.com';
    try {
      const stored = localStorage.getItem('tg_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) defaultName = u.fullName;
        if (u.email) defaultEmail = u.email;
      }
    } catch {}

    return {
      fullName: defaultName,
      email: defaultEmail,
      currentCompany: 'Google India',
      currentRole: 'Senior Staff Software Engineer',
      totalExperienceYears: 8,
      linkedinUrl: 'https://linkedin.com/in/karthik-iyer-tech',
      githubUrl: 'https://github.com/karthik-iyer',
      primaryDomain: 'SDE',
      expertStacks: 'React, Node.js, TypeScript, Distributed Systems, Redis',
      professionalSummary: 'Full-stack engineering leader specializing in high-throughput microservices and distributed systems architectures.',
    };
  });

  const [loading, setLoading] = useState(false);
  const [adminSimulating, setAdminSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.applyBecomeEvaluator({
        candidateId: 'cand-1',
        fullName: formData.fullName,
        email: formData.email,
        currentCompany: formData.currentCompany,
        currentRole: formData.currentRole,
        totalExperienceYears: Number(formData.totalExperienceYears),
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        primaryDomain: formData.primaryDomain,
        expertStacks: formData.expertStacks.split(',').map((s) => s.trim()).filter(Boolean),
        professionalSummary: formData.professionalSummary,
      });

      if (res.success) {
        setSuccessMessage(res.message || 'Application submitted successfully!');
        const stored = localStorage.getItem('tg_user');
        if (stored) {
          try {
            const u = JSON.parse(stored);
            u.evaluatorStatus = 'PENDING_ADMIN_VERIFICATION';
            localStorage.setItem('tg_user', JSON.stringify(u));
          } catch {}
        }
        window.dispatchEvent(new Event('auth-change'));
        onApplicationUpdated();
      } else {
        setError(res.error || 'Failed to submit application.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminApproveDemo = async () => {
    setAdminSimulating(true);
    try {
      // Find pending app ID
      const pendingRes = await api.getAdminPendingEvaluators();
      const myApp = pendingRes.data?.find((a) => a.candidateId === 'cand-1') || pendingRes.data?.[0];
      if (myApp) {
        await api.adminApproveEvaluator(myApp.id);
      } else {
        // Fallback approve with custom id
        await api.adminApproveEvaluator('eval-app-cand-1');
      }
      setSuccessMessage('🎉 Verified! Inayon Admin has approved your credentials. Evaluator Workstation is now unlocked in the navbar!');
      const stored = localStorage.getItem('tg_user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          u.isEvaluator = true;
          u.evaluatorStatus = 'APPROVED';
          localStorage.setItem('tg_user', JSON.stringify(u));
        } catch {}
      }
      window.dispatchEvent(new Event('auth-change'));
      onApplicationUpdated();
    } catch (err: any) {
      setError('Admin verification simulation error: ' + err.message);
    } finally {
      setAdminSimulating(false);
    }
  };

  const isPending = currentStatus === 'PENDING_ADMIN_VERIFICATION' || Boolean(successMessage);
  const isApproved = currentStatus === 'APPROVED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isApproved ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verification Active</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                You are a Verified Inayon Evaluator!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Your professional credentials have been validated by our engineering audit team. You can conduct 60-minute technical evaluations and earn payouts.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-left space-y-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Evaluator Compensation Structure:
              </span>
              <ul className="text-xs text-purple-800 space-y-1 list-disc list-inside">
                <li><strong>Placement Bounty:</strong> Earn ₹2,000 when a candidate you pass gets hired by a company!</li>
                <li><strong>Scratch Cards:</strong> Unlock ₹1–₹20 instant cash scratch cards even when a candidate does not pass.</li>
              </ul>
            </div>
            <div className="pt-2">
              <a
                href="/evaluator/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <span>Open Evaluator Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : isPending ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                Verification in Progress • 24-48h SLA
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
                Application Under Admin Review
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Thank you for applying to join the Inayon Independent Evaluator Network! Our engineering committee is auditing your company pedigree, technical seniority, and LinkedIn credentials.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="text-slate-400 font-medium">Applied As:</span>
                <span className="font-bold text-slate-900">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="text-slate-400 font-medium">Current Employer:</span>
                <span className="font-bold text-slate-900">{formData.currentCompany || 'Google / Senior Engineer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Domain:</span>
                <span className="font-bold text-blue-600">{formData.primaryDomain}</span>
              </div>
            </div>

            {/* Admin Demo Approval Action */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/70 text-left space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Admin Instant Verification Demo</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Test the admin approval workflow live. Clicking this simulates the Inayon Admin Team approving your credentials and unlocks the Evaluator Dashboard immediately.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-white hover:bg-blue-600 hover:text-white border-blue-300 text-blue-700 font-bold transition-all"
                onClick={handleAdminApproveDemo}
                isLoading={adminSimulating}
              >
                Simulate Admin Approval & Unlock Evaluator Portal
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600">Dual-Role Program</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Start as an Independent Evaluator
                </h2>
                <p className="text-xs text-slate-500">
                  Assess candidate Stack Cards, earn placement bounties of ₹2,000 & scratch card rewards.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Corporate / Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Current Employer / Company</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google, Amazon, Swiggy, Startup"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Years of Exp</label>
                  <input
                    type="number"
                    min="3"
                    max="35"
                    required
                    value={formData.totalExperienceYears}
                    onChange={(e) => setFormData({ ...formData, totalExperienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={formData.currentRole}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Tech Domain</label>
                  <select
                    value={formData.primaryDomain}
                    onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50 font-medium"
                  >
                    <option value="SDE">Software Engineering (SDE)</option>
                    <option value="AI_ML">AI & Machine Learning</option>
                    <option value="DATA_ENGINEERING">Data Engineering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">LinkedIn Profile URL</label>
                  <div className="relative">
                    <Linkedin className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GitHub / Tech Portfolio</label>
                  <div className="relative">
                    <Github className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expert Stacks (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. MERN, React, Node.js, Spring Boot, Microservices, Python"
                  value={formData.expertStacks}
                  onChange={(e) => setFormData({ ...formData, expertStacks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Professional Verification Statement
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Highlight your system design experience, code review pedigree, and interviewing background..."
                  value={formData.professionalSummary}
                  onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.99]"
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Submit Application for Admin Review
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Evaluator Workstation unlocks strictly after Admin identity and employment verification.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
