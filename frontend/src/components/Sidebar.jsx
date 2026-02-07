import React from "react";
import { Link, useLocation } from "react-router-dom";
import { X, LayoutDashboard, Settings, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ParaTrainLogo.png";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { role } = useAuth();
  const pathname = location.pathname;

  const isActive = (path) => pathname === path || (path !== "/dashboard" && pathname.startsWith(path));

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
      isActive(path)
        ? "bg-para-teal/10 text-para-teal dark:bg-para-teal/20 dark:text-para-teal font-medium"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-para-teal dark:hover:text-para-teal"
    }`;

  if (role === "doctor") {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <img src={logo} alt="ParaTrain" className="h-10 object-contain" />
              <X
                className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                onClick={onClose}
              />
            </div>
            <nav className="space-y-1">
              <Link to="/dashboard" className={linkClass("/dashboard")} onClick={onClose}>
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/dashboard/settings" className={linkClass("/dashboard/settings")} onClick={onClose}>
                <Settings className="w-5 h-5" /> Settings
              </Link>
              <Link to="/dashboard/support" className={linkClass("/dashboard/support")} onClick={onClose}>
                <Phone className="w-5 h-5" /> Support
              </Link>
            </nav>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <img src={logo} alt="ParaTrain" className="h-10 object-contain" />
            <X
              className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={onClose}
            />
          </div>
          <nav className="space-y-1">
            <Link to="/dashboard" className={linkClass("/dashboard")} onClick={onClose}>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/dashboard/simulation-modes" className={linkClass("/dashboard/simulation-modes")} onClick={onClose}>
              Simulations
            </Link>
            <Link to="/dashboard/reports" className={linkClass("/dashboard/reports")} onClick={onClose}>
              AI Reports
            </Link>
            <Link to="/dashboard/doctor" className={linkClass("/dashboard/doctor")} onClick={onClose}>
              Doctor Connect
            </Link>
            <Link to="/dashboard/settings" className={linkClass("/dashboard/settings")} onClick={onClose}>
              <Settings className="w-5 h-5" /> Settings
            </Link>
            <Link to="/dashboard/support" className={linkClass("/dashboard/support")} onClick={onClose}>
              <Phone className="w-5 h-5" /> Support
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
