import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/" className="text-xl font-bold tracking-wide text-indigo-400">
          ATS PRO
        </Link>

        <div className="flex items-center gap-6 text-sm text-slate-300">

          {!user && (
            <>
              <Link to="/jobs" className="hover:text-white transition">Jobs</Link>
              <Link to="/login" className="hover:text-white transition">Login</Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Register
              </Link>
            </>
          )}

          {user && user.role === 'applicant' && (
            <>
              <Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link>
              <Link to="/my-applications" className="hover:text-white transition">My Applications</Link>
            </>
          )}

          {user && user.role === 'recruiter' && (
            <>
              <Link to="/recruiter/jobs" className="hover:text-white transition">My Jobs</Link>
              <Link to="/recruiter/jobs/create" className="hover:text-white transition">Post Job</Link>
              <Link to="/recruiter/interviews" className="hover:text-white transition">Interviews</Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-indigo-400 hover:text-indigo-300 font-medium">
                {user.name}
              </Link>

              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}