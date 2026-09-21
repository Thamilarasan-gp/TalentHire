import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CompanyLayout } from './layouts/CompanyLayout';

// Public Experience
import { CompanyWelcome } from './pages/public/CompanyWelcome';
import { CompanyLogin } from './pages/CompanyLogin';
import { CompanyRegister } from './pages/auth/CompanyRegister';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { CompanyOnboarding } from './pages/onboarding/CompanyOnboarding';

// Workspace Pages
import { CompanyDashboard } from './pages/CompanyDashboard';
import { CompanyRequirements } from './pages/CompanyRequirements';
import { CreateRequirement } from './pages/CreateRequirement';
import { CompanyMatches } from './pages/CompanyMatches';
import { CompanyShortlists } from './pages/CompanyShortlists';
import { CompanyCandidateDetail } from './pages/CompanyCandidateDetail';
import { CompanyEvaluationReport } from './pages/CompanyEvaluationReport';
import { CompanyInterviews } from './pages/CompanyInterviews';
import { CompanyFeedback } from './pages/CompanyFeedback';
import { CompanyOffers } from './pages/CompanyOffers';
import { CompanyContracts } from './pages/CompanyContracts';
import { CompanyPlacements } from './pages/CompanyPlacements';
import { CompanyInvoices } from './pages/CompanyInvoices';
import { CompanyReplacements } from './pages/CompanyReplacements';
import { CompanyAnalytics } from './pages/CompanyAnalytics';
import { CompanyTeam } from './pages/CompanyTeam';
import { CompanyProfile } from './pages/CompanyProfile';
import { CompanySettings } from './pages/CompanySettings';
import { CompanySupport } from './pages/CompanySupport';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Authentication */}
        <Route path="/" element={<Navigate to="/company" replace />} />
        <Route path="/company" element={<CompanyWelcome />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/signup" element={<Navigate to="/company/register" replace />} />
        <Route path="/company/verify-email" element={<VerifyEmail />} />
        <Route path="/company/forgot-password" element={<ForgotPassword />} />
        <Route path="/company/reset-password" element={<ResetPassword />} />
        <Route path="/company/onboarding" element={<CompanyOnboarding />} />

        {/* Authenticated Workspace Pages (Scoped to Company) */}
        <Route element={<CompanyLayout />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/openings" element={<CompanyRequirements />} />
          <Route path="/company/openings/new" element={<CreateRequirement />} />
          <Route path="/company/openings/:id" element={<CompanyRequirements />} />
          <Route path="/company/requirements" element={<Navigate to="/company/openings" replace />} />
          <Route path="/company/requirements/new" element={<CreateRequirement />} />
          <Route path="/company/requirements/:id" element={<CompanyRequirements />} />
          <Route path="/company/matches" element={<CompanyMatches />} />
          <Route path="/company/matches/:id" element={<CompanyMatches />} />
          <Route path="/company/shortlists" element={<CompanyShortlists />} />
          <Route path="/company/shortlists/:id" element={<CompanyShortlists />} />
          <Route path="/company/candidates/:id" element={<CompanyCandidateDetail />} />
          <Route path="/company/evaluations/:id" element={<CompanyEvaluationReport />} />
          <Route path="/company/interviews" element={<CompanyInterviews />} />
          <Route path="/company/interviews/schedule" element={<CompanyInterviews />} />
          <Route path="/company/interviews/:id" element={<CompanyInterviews />} />
          <Route path="/company/feedback" element={<CompanyFeedback />} />
          <Route path="/company/offers" element={<CompanyOffers />} />
          <Route path="/company/contracts" element={<CompanyContracts />} />
          <Route path="/company/placements" element={<CompanyPlacements />} />
          <Route path="/company/billing" element={<CompanyInvoices />} />
          <Route path="/company/invoices" element={<CompanyInvoices />} />
          <Route path="/company/replacements" element={<CompanyReplacements />} />
          <Route path="/company/replacement-guarantee" element={<CompanyReplacements />} />
          <Route path="/company/analytics" element={<CompanyAnalytics />} />
          <Route path="/company/team" element={<CompanyTeam />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/settings" element={<CompanySettings />} />
          <Route path="/company/support" element={<CompanySupport />} />
        </Route>

        <Route path="*" element={<Navigate to="/company" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
