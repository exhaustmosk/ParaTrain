import React, { createContext, useContext, useState, useEffect } from "react";

const AUTH_KEY = "paratrain_auth";
const USER_KEY = "paratrain_user";
const ROLE_KEY = "paratrain_role";
const SESSION_KEY = "paratrain_session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("patient"); // patient | doctor
  const [session, setSession] = useState(null);

  // Restore auth on refresh
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedRole = localStorage.getItem(ROLE_KEY);
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (storedAuth === "true" && storedUser && storedSession) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setRole(storedRole || "patient");
      setSession(JSON.parse(storedSession));
    }
  }, []);

  /**
   * Called AFTER successful backend login
   * @param {object} session Supabase / backend session
   * @param {object} user User object from backend
   */
  const login = (sessionData, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setSession(sessionData);

    const resolvedRole = userData.role || "patient";
    setRole(resolvedRole);

    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(ROLE_KEY, resolvedRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole("patient");
    setSession(null);

    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
