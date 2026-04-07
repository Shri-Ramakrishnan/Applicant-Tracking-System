import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight">
          ATS PRO
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {!user && (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Register
              </Link>
            </>
          )}

          {user?.role === "applicant" && (
            <>
              <Link to="/jobs" className="btn-secondary text-sm">
                Jobs
              </Link>
              <Link to="/my-applications" className="btn-secondary text-sm">
                Applications
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <>
              <Link to="/recruiter/jobs" className="btn-secondary text-sm">
                Jobs
              </Link>
              <Link to="/recruiter/interviews" className="btn-secondary text-sm">
                Interviews
              </Link>
            </>
          )}

          <button onClick={() => setDark(!dark)} className="btn-secondary text-sm" type="button">
            {dark ? "Light" : "Dark"}
          </button>

          {user && (
            <>
              <Link to="/profile" className="btn-secondary text-sm">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-danger text-sm" type="button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
