import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/ParaTrainLogo.png";
import { formatTimeStamp } from "../utils/progressStorage";

export default function Header({ onOpenSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [clock, setClock] = useState(formatTimeStamp());

  useEffect(() => {
    const t = setInterval(() => setClock(formatTimeStamp()), 1000);
    return () => clearInterval(t);
  }, []);
  const showSidebarToggle = location.pathname.startsWith("/dashboard") && !location.pathname.startsWith("/dashboard/simple");
  const showDashboardSlider = showSidebarToggle && role !== "doctor";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isSimple = location.pathname.startsWith("/dashboard/simple");

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        {showSidebarToggle && onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center">
          <img src={logo} alt="ParaTrain" className="h-11 object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Animated Dashboard slider: NORMAL | SIMPLE */}
        {showDashboardSlider && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Dashboard</span>
            <div
              className="relative flex w-[176px] rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-1 cursor-pointer select-none"
              onClick={() => navigate(isSimple ? "/dashboard" : "/dashboard/simple")}
              role="switch"
              aria-checked={isSimple}
            >
              {/* Sliding pill */}
              <div
                className="absolute top-1 left-1 h-8 w-[84px] rounded-lg bg-gradient-to-r from-para-teal to-para-teal-dark shadow-md transition-all duration-300 ease-out"
                style={{ transform: isSimple ? "translateX(84px)" : "translateX(0)" }}
              />
              <span className={`relative z-10 w-1/2 text-center text-sm font-medium py-1.5 transition-colors duration-200 ${!isSimple ? "text-white" : "text-gray-600 dark:text-gray-400"}`}>
                NORMAL
              </span>
              <span className={`relative z-10 w-1/2 text-center text-sm font-medium py-1.5 transition-colors duration-200 ${isSimple ? "text-white" : "text-gray-600 dark:text-gray-400"}`}>
                SIMPLE
              </span>
            </div>
          </div>
        )}

        {/* Clock */}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 tabular-nums" title="Current time">
          {clock}
        </span>

        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{role}</span>

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-para-teal hover:text-para-teal-dark font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
