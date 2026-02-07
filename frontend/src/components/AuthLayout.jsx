import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import logo from "../assets/ParaTrainLogo.png";

export default function AuthLayout({ children, showNav = true }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isLogin = location.pathname === "/login" || location.pathname === "/" || location.pathname === "/login/doctor";
  const isDoctorTab = searchParams.get("admin") === "1" || location.pathname === "/login/doctor";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-para-bg via-white to-para-teal/5 bg-medical-pattern">
      {/* Medical-themed header */}
      <header className="bg-gradient-to-r from-para-navy via-para-teal-dark to-para-teal text-white shadow-xl">
        <div className="text-center py-5">
          <img src={logo} alt="ParaTrain" className="h-12 md:h-14 mx-auto object-contain" />
          <p className="text-sm text-white/90 mt-1.5 font-medium">
            Medical Training & Simulation Platform
          </p>
        </div>
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-para-teal-light to-white/40 w-full" />
        {/* Nav: Patient Login | Doctor Login */}
        {showNav && (
          <nav className="bg-white/95 backdrop-blur shadow-sm flex justify-center gap-8 py-3">
            <Link
              to="/login"
              className={`font-medium transition ${
                isLogin && !isDoctorTab ? "text-para-teal border-b-2 border-para-teal" : "text-gray-600 hover:text-para-teal"
              }`}
            >
              Patient Login
            </Link>
            <Link
              to="/login/doctor"
              className={`font-medium transition ${
                isLogin && isDoctorTab ? "text-para-teal border-b-2 border-para-teal" : "text-gray-600 hover:text-para-teal"
              }`}
            >
              Doctor Login
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
