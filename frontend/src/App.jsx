import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import RecruiterJobs from './pages/RecruiterJobs';
import CreateJob from './pages/CreateJob';
import JobApplications from './pages/JobApplications';
import ScheduleInterview from './pages/ScheduleInterview';
import GenerateOffer from './pages/GenerateOffer';
import Interviews from './pages/Interviews';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-300">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? user.role === 'recruiter'
                      ? '/recruiter/jobs'
                      : '/jobs'
                    : '/login'
                }
                replace
              />
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Applicant Routes */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute role="applicant">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/jobs/create"
            element={
              <ProtectedRoute role="recruiter">
                <CreateJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/jobs/:jobId/applications"
            element={
              <ProtectedRoute role="recruiter">
                <JobApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/schedule/:applicationId"
            element={
              <ProtectedRoute role="recruiter">
                <ScheduleInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/offer/:applicationId"
            element={
              <ProtectedRoute role="recruiter">
                <GenerateOffer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/interviews"
            element={
              <ProtectedRoute role="recruiter">
                <Interviews />
              </ProtectedRoute>
            }
          />

          {/* NEW PROFILE ROUTE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}