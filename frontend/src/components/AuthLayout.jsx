import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function AuthLayout({ children, showNav = true }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isLogin = location.pathname === "/login" || location.pathname === "/";
  const isAdminTab = searchParams.get("admin") === "1";

  return (
    <div className="min-h-screen flex flex-col bg-para-bg bg-medical-pattern">
      {/* Medical-themed header */}
      <header className="bg-gradient-to-r from-para-navy via-para-teal-dark to-para-teal text-white shadow-lg">
        <div className="text-center py-5">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
            PARATRAIN
          </h1>
          <p className="text-sm text-white/90 mt-1.5 font-medium">
            Medical Training & Simulation Platform
          </p>
        </div>
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-para-teal-light to-white/40 w-full" />
        {/* Nav: User Login | Admin Login */}
        {showNav && (
          <nav className="bg-white/95 backdrop-blur shadow-sm flex justify-center gap-8 py-3">
            <Link
              to="/login"
              className={`font-medium transition ${
                isLogin && !isAdminTab ? "text-para-teal border-b-2 border-para-teal" : "text-gray-600 hover:text-para-teal"
              }`}
            >
              User Login
            </Link>
            <Link
              to="/login?admin=1"
              className={`font-medium transition ${
                isLogin && isAdminTab ? "text-para-teal border-b-2 border-para-teal" : "text-gray-600 hover:text-para-teal"
              }`}
            >
              Admin Login
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
