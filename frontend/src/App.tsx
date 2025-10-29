import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import AuthPage from "./app/auth/page";
import AuthCallbackPage from "./app/auth/callback/page";
import CleanupPage from "./app/auth/cleanup/page";
import WorkerOnboarding from "./app/worker/onboard/page";
import EmployerOnboarding from "./app/employer/onboard/page";
import JobsPage from "./app/worker/jobs/page";
import WorkerProfile from "./app/worker/profile/page";
import EmployerDashboard from "./app/employer/dashboard/page";
import EmployerMatches from "./app/employer/matches/page";
import Settings from "./app/employer/settings/page";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/cleanup" element={<CleanupPage />} />
        <Route path="/worker/onboard" element={<WorkerOnboarding />} />
        <Route path="/worker/jobs" element={<JobsPage />} />
        <Route path="/worker/profile" element={<WorkerProfile />} />
        <Route path="/employer/onboard" element={<EmployerOnboarding />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/matches" element={<EmployerMatches />} />
        <Route path="/employer/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
