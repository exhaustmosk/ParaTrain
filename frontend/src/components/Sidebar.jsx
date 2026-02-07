import React from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const linkClass = (path) =>
    `block cursor-pointer hover:text-[#00ACD8] ${location.pathname === path ? "text-[#00ACD8] font-medium" : ""}`;
  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#00ACD8]">
              ParaTrain
            </h2>

            <X
              className="cursor-pointer"
              onClick={onClose}
            />
          </div>

          <nav className="space-y-4 text-gray-700">
            <Link to="/dashboard" className={linkClass("/dashboard")} onClick={onClose}>
              Dashboard
            </Link>
            <Link to="/dashboard/simple" className={linkClass("/dashboard/simple")} onClick={onClose}>
              Simple Dashboard
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
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
