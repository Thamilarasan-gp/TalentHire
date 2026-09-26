import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { TalentLayout } from './layouts/TalentLayout';
import { EvaluatorLayout } from './layouts/EvaluatorLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Jobs } from './pages/public/Jobs';
import { JobDetails } from './pages/public/JobDetails';
import { HowItWorks } from './pages/public/HowItWorks';
import { ForEngineers } from './pages/public/ForEngineers';
import { ForEvaluators } from './pages/public/ForEvaluators';
import { Pricing } from './pages/public/Pricing';
import { About } from './pages/public/About';
import { SuccessStories } from './pages/public/SuccessStories';
import { Faq } from './pages/public/Faq';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';

// Candidate Pages
import { TalentDashboard } from './pages/talent/TalentDashboard';
import { TalentProfile } from './pages/talent/TalentProfile';
import { RecommendedJobs } from './pages/talent/RecommendedJobs';
import { Applications } from './pages/talent/Applications';
import { TalentEvaluations } from './pages/talent/TalentEvaluations';
import { TalentInterviews } from './pages/talent/TalentInterviews';
import { TalentOffers } from './pages/talent/TalentOffers';
import { TalentFeedback } from './pages/talent/TalentFeedback';
import { TalentSettings } from './pages/talent/TalentSettings';
import { StackPassHub } from './pages/talent/StackPassHub';

// Evaluator Pages
import { EvaluatorDashboard } from './pages/evaluator/EvaluatorDashboard';
import { AvailableAssignments } from './pages/evaluator/AvailableAssignments';
import { MyAssignments } from './pages/evaluator/MyAssignments';
import { InterviewRoom } from './pages/evaluator/InterviewRoom';
import { Scorecard } from './pages/evaluator/Scorecard';
import { Earnings } from './pages/evaluator/Earnings';
import { Availability } from './pages/evaluator/Availability';
import { History } from './pages/evaluator/History';
import { Calibration } from './pages/evaluator/Calibration';
import { EvaluatorSettings } from './pages/evaluator/EvaluatorSettings';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackTitle="Application Display Exception">
        <Routes>
        {/* Public Experience */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-engineers" element={<ForEngineers />} />
          <Route path="/for-evaluators" element={<ForEvaluators />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
        </Route>

        {/* Candidate Experience */}
        <Route path="/talent" element={<TalentLayout />}>
          <Route index element={<Navigate to="/talent/dashboard" replace />} />
          <Route path="dashboard" element={<TalentDashboard />} />
          <Route path="profile" element={<TalentProfile />} />
          <Route path="recommended-jobs" element={<RecommendedJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="evaluations" element={<TalentEvaluations />} />
          <Route path="stack-passes" element={<StackPassHub />} />
          <Route path="interviews" element={<TalentInterviews />} />
          <Route path="offers" element={<TalentOffers />} />
          <Route path="feedback" element={<TalentFeedback />} />
          <Route path="settings" element={<TalentSettings />} />
        </Route>

        {/* Evaluator Experience */}
        <Route path="/evaluator" element={<EvaluatorLayout />}>
          <Route index element={<Navigate to="/evaluator/dashboard" replace />} />
          <Route path="dashboard" element={<EvaluatorDashboard />} />
          <Route path="assignments" element={<AvailableAssignments />} />
          <Route path="my-assignments" element={<MyAssignments />} />
          <Route path="interview-room/:id" element={<InterviewRoom />} />
          <Route path="scorecard/:id" element={<Scorecard />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="availability" element={<Availability />} />
          <Route path="history" element={<History />} />
          <Route path="calibration" element={<Calibration />} />
          <Route path="settings" element={<EvaluatorSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
