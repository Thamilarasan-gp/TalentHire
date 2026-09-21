import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';

import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCompanies } from './pages/AdminCompanies';
import { AdminCandidates } from './pages/AdminCandidates';
import { AdminEvaluators } from './pages/AdminEvaluators';
import { AdminRequirements } from './pages/AdminRequirements';
import { AdminAssignments } from './pages/AdminAssignments';
import { AdminEvaluationQueue } from './pages/AdminEvaluationQueue';
import { AdminQaCalibration } from './pages/AdminQaCalibration';
import { AdminMatchingEngine } from './pages/AdminMatchingEngine';
import { AdminShortlistBuilder } from './pages/AdminShortlistBuilder';
import { AdminInterviews } from './pages/AdminInterviews';
import { AdminPlacements } from './pages/AdminPlacements';
import { AdminFinance } from './pages/AdminFinance';
import { AdminPayouts } from './pages/AdminPayouts';
import { AdminFraudDetection } from './pages/AdminFraudDetection';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import { AdminUsersRoles } from './pages/AdminUsersRoles';
import { AdminSystemSettings } from './pages/AdminSystemSettings';
import { AdminFeatureFlags } from './pages/AdminFeatureFlags';
import { AdminHelp } from './pages/AdminHelp';
import { AdminLogin } from './pages/AdminLogin';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes with deep SaaS shell layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/candidates" element={<AdminCandidates />} />
          <Route path="/admin/evaluators" element={<AdminEvaluators />} />
          <Route path="/admin/requirements" element={<AdminRequirements />} />
          <Route path="/admin/assignments" element={<AdminAssignments />} />
          <Route path="/admin/evaluations/queue" element={<AdminEvaluationQueue />} />
          <Route path="/admin/qa-calibration" element={<AdminQaCalibration />} />
          <Route path="/admin/matching-engine" element={<AdminMatchingEngine />} />
          <Route path="/admin/shortlist-builder" element={<AdminShortlistBuilder />} />
          <Route path="/admin/interviews" element={<AdminInterviews />} />
          <Route path="/admin/placements" element={<AdminPlacements />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/payouts" element={<AdminPayouts />} />
          <Route path="/admin/fraud-detection" element={<AdminFraudDetection />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/users-roles" element={<AdminUsersRoles />} />
          <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
          <Route path="/admin/feature-flags" element={<AdminFeatureFlags />} />
          <Route path="/admin/help" element={<AdminHelp />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
};
