import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Clock,
  Flame,
  Trophy,
  Target,
  Sun,
  Moon,
  Settings,
  Phone,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import armsImg from "../assets/arms.png";
import wristsImg from "../assets/wrists.png";
import legsImg from "../assets/legs.png";
import fullBodyImg from "../assets/fullbody.png";

const SIMPLE_STORAGE_KEY = "paratrain_simple_progress";

const MODES = [
  { id: "arms", label: "ARMS", image: armsImg, route: "/dashboard/simple/arms" },
  { id: "wrists", label: "WRISTS", image: wristsImg, route: "/dashboard/simple/wrists" },
  { id: "legs", label: "LEGS", image: legsImg, route: "/dashboard/simple/legs" },
  { id: "fullbody", label: "FULL BODY", image: fullBodyImg, route: "/dashboard/simple/fullbody" },
];

const ORDER = ["arms", "wrists", "legs", "fullbody"];

function getDefaultProgress() {
  return {
    sessionsCompleted: 0,
    trainingTimeMinutes: 0,
    streak: 0,
    totalSessions: 0,
    accuracy: 90,
    lastReportPercent: 98,
    lastReportTitle: "Full Body Report",
  };
}

function loadProgress() {
  try {
    const s = localStorage.getItem(SIMPLE_STORAGE_KEY);
    if (s) return { ...getDefaultProgress(), ...JSON.parse(s) };
  } catch (_) {}
  return getDefaultProgress();
}

function saveProgress(p) {
  try {
    localStorage.setItem(SIMPLE_STORAGE_KEY, JSON.stringify(p));
  } catch (_) {}
}

export default function SimpleDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [progress, setProgress] = useState(getDefaultProgress());

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sessionsCompleted = progress.sessionsCompleted ?? 0;
  const nextIndex = Math.min(sessionsCompleted, ORDER.length - 1);
  const nextMode = ORDER[nextIndex];
  const nextRoute = MODES.find((m) => m.id === nextMode)?.route ?? "/dashboard/simple/arms";

  // Progress bar: 4 segments. Segment i: if i < sessionsCompleted -> green; if i === sessionsCompleted -> 75% yellow; else 35% yellow
  const progressSegments = [0, 1, 2, 3].map((i) => {
    if (i < sessionsCompleted) return "green";
    if (i === sessionsCompleted) return "yellow75";
    return "yellow35";
  });

  // Body parts: arms done after 1, hands after 2, legs+feet after 3, head+stomach after 4
  const bodyCompleted = {
    leftArm: sessionsCompleted >= 1,
    rightArm: sessionsCompleted >= 1,
    leftHand: sessionsCompleted >= 2,
    rightHand: sessionsCompleted >= 2,
    leftLeg: sessionsCompleted >= 3,
    rightLeg: sessionsCompleted >= 3,
    leftFoot: sessionsCompleted >= 3,
    rightFoot: sessionsCompleted >= 3,
    stomach: sessionsCompleted >= 4,
    head: sessionsCompleted >= 4,
  };

  const handleStartSession = () => {
    navigate(nextRoute);
  };

  const handleModeClick = (route) => {
    navigate(route);
  };

  const bgClass = dark ? "bg-gray-900 text-gray-100" : "bg-para-bg text-gray-900";
  const cardClass = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const mutedClass = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col`}>
      {/* Top bar: ParaTrain, link to main Dashboard, Logout */}
      <header className={`flex items-center justify-between px-6 py-3 border-b ${dark ? "border-gray-700" : "border-gray-200"}`}>
        <Link to="/dashboard/simple" className="text-xl font-bold text-para-teal">ParaTrain</Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium opacity-80 hover:underline">Main Dashboard</Link>
          <button type="button" onClick={handleLogout} className="text-sm font-medium opacity-80 hover:underline">Logout</button>
        </div>
      </header>

      <div className="flex-1 p-6 grid grid-cols-12 gap-6">
      {/* LEFT: Simulation Modes */}
      <div className="col-span-3 flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 px-1">Simulation Modes</h2>
        {MODES.map((mode) => {
          const completed = sessionsCompleted > ORDER.indexOf(mode.id);
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleModeClick(mode.route)}
              className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 text-left transition ${cardClass} ${
                completed ? "border-green-500 ring-2 ring-green-500/30" : dark ? "border-gray-600 hover:border-para-teal" : "border-gray-200 hover:border-para-teal"
              }`}
            >
              <img src={mode.image} alt={mode.label} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              <span className="font-semibold">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* CENTRE: Welcome, progress bar, dummy, stats, Start Session */}
      <div className="col-span-6 flex flex-col items-center">
        {/* Welcome + Progress bar */}
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user}</h1>
          <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
            {progressSegments.map((seg, i) => (
              <div
                key={i}
                className="flex-1 rounded transition-all"
                style={{
                  background:
                    seg === "green"
                      ? "rgba(34, 197, 94, 1)"
                      : seg === "yellow75"
                        ? "rgba(234, 179, 8, 0.75)"
                        : "rgba(234, 179, 8, 0.35)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Dummy + surrounding icons */}
        <div className="relative flex-1 flex items-center justify-center min-h-[320px] w-full">
          {/* Stats around figure */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center gap-8">
            <div className={`flex flex-col items-center ${mutedClass}`}>
              <Clock className="w-8 h-8 text-purple-500 mb-1" />
              <span className="text-xs font-medium">{progress.trainingTimeMinutes}m</span>
              <span className="text-xs">Training Time</span>
            </div>
            <div className={`flex flex-col items-center ${mutedClass}`}>
              <Flame className="w-8 h-8 text-orange-500 mb-1" />
              <span className="text-xs font-medium">{progress.streak}</span>
              <span className="text-xs">Day Streak</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center gap-8">
            <div className={`flex flex-col items-center ${mutedClass}`}>
              <Trophy className="w-8 h-8 text-blue-500 mb-1" />
              <span className="text-xs font-medium">{progress.totalSessions}</span>
              <span className="text-xs">Sessions Completed</span>
            </div>
            <div className={`flex flex-col items-center ${mutedClass}`}>
              <Target className="w-8 h-8 text-red-500 mb-1" />
              <span className="text-xs font-medium">{progress.accuracy}%</span>
              <span className="text-xs">Accuracy</span>
            </div>
          </div>

          {/* Body dummy SVG */}
          <svg
            viewBox="0 0 120 200"
            className="w-40 h-64 flex-shrink-0"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Head */}
            <circle cx="60" cy="18" r="14" stroke={bodyCompleted.head ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill={bodyCompleted.head ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"} />
            {/* Stomach / Torso */}
            <rect x="44" y="38" width="32" height="50" rx="4" stroke={bodyCompleted.stomach ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill={bodyCompleted.stomach ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"} />
            {/* Left arm */}
            <path d="M 44 50 L 20 50 L 16 75" stroke={bodyCompleted.leftArm ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill="none" />
            <circle cx="16" cy="75" r="6" stroke={bodyCompleted.leftHand ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill={bodyCompleted.leftHand ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"} />
            {/* Right arm */}
            <path d="M 76 50 L 100 50 L 104 75" stroke={bodyCompleted.rightArm ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill="none" />
            <circle cx="104" cy="75" r="6" stroke={bodyCompleted.rightHand ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill={bodyCompleted.rightHand ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"} />
            {/* Left leg */}
            <path d="M 52 88 L 52 140 L 44 175" stroke={bodyCompleted.leftLeg ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill="none" />
            <ellipse cx="44" cy="182" rx="8" ry="5" stroke={bodyCompleted.leftFoot ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill={bodyCompleted.leftFoot ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"} />
            {/* Right leg */}
            <path d="M 68 88 L 68 140 L 76 175" stroke={bodyCompleted.rightLeg ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill="none" />
            <ellipse cx="76" cy="182" rx="8" ry="5" stroke={bodyCompleted.rightFoot ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.5)"} fill={bodyCompleted.rightFoot ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"} />
          </svg>
        </div>

        {/* Start Session button */}
        <button
          type="button"
          onClick={handleStartSession}
          className="mt-6 px-10 py-3 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark transition shadow-lg"
        >
          Start Session
        </button>
      </div>

      {/* RIGHT: Doctor Connect, AI Report, utility icons */}
      <div className="col-span-3 flex flex-col gap-6">
        {/* Doctor Connect */}
        <div className={`rounded-xl border p-4 ${cardClass}`}>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-3">Doctor Connect</h2>
          <div className="flex justify-center py-4">
            <Users className="w-12 h-12 text-para-teal opacity-70" />
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/doctor")}
            className="w-full py-2 rounded-lg bg-para-teal text-white font-medium hover:bg-para-teal-dark transition"
          >
            Connect
          </button>
        </div>

        {/* AI Performance Report */}
        <div className={`rounded-xl border p-4 ${cardClass}`}>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-3">AI Performance Report</h2>
          <div className={`rounded-lg p-3 mb-3 ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className="font-medium text-sm">{progress.lastReportTitle}</p>
            <p className="text-green-500 font-semibold">{progress.lastReportPercent}%</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/reports")}
            className="w-full py-2 rounded-lg border border-para-teal text-para-teal font-medium hover:bg-para-teal/10 transition"
          >
            View
          </button>
        </div>

        {/* Bottom right: Theme, Settings, Support */}
        <div className="mt-auto flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/settings")}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/support")}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Customer support"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export { loadProgress, saveProgress, SIMPLE_STORAGE_KEY, ORDER, getDefaultProgress };
