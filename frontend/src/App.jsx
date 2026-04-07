import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import CreateJob from "./pages/CreateJob";
import GenerateOffer from "./pages/GenerateOffer";
import Interviews from "./pages/Interviews";
import JobApplications from "./pages/JobApplications";
import JobDetail from "./pages/JobDetail";
import JobList from "./pages/JobList";
import Login from "./pages/Login";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import RecruiterJobs from "./pages/RecruiterJobs";
import Register from "./pages/Register";
import ScheduleInterview from "./pages/ScheduleInterview";

function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "recruiter" ? "/recruiter/jobs" : "/jobs"} replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === "recruiter" ? "/recruiter/jobs" : "/jobs"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute roles={["applicant", "recruiter"]} />}>
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute roles={["applicant"]} />}>
          <Route path="/my-applications" element={<MyApplications />} />
        </Route>

        <Route element={<ProtectedRoute roles={["recruiter"]} />}>
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/jobs/create" element={<CreateJob />} />
          <Route path="/recruiter/jobs/:jobId/applications" element={<JobApplications />} />
          <Route path="/recruiter/interviews" element={<Interviews />} />
          <Route path="/recruiter/schedule/:applicationId" element={<ScheduleInterview />} />
          <Route path="/recruiter/offer/:applicationId" element={<GenerateOffer />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
