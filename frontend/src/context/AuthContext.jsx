import React, { createContext, useContext, useState, useEffect } from "react";

const AUTH_KEY = "paratrain_auth";
const USER_KEY = "paratrain_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("User");

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    const name = localStorage.getItem(USER_KEY);
    if (stored === "true") setIsAuthenticated(true);
    if (name) setUser(name);
  }, []);

  const login = (username, password) => {
    // Test-phase credentials
    if (String(username).trim() === "12345" && String(password).trim() === "12345") {
      setIsAuthenticated(true);
      const name = (username && String(username).trim()) || "User";
      setUser(name);
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(USER_KEY, name);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser("User");
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
