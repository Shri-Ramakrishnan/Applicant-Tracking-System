import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ats_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
      } catch {
        localStorage.removeItem("ats_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("ats_user", JSON.stringify(userData));
    api.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ats_user");
    delete api.defaults.headers.common.Authorization;
  };

  const value = useMemo(() => ({ user, login, logout, loading }), [loading, user]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
