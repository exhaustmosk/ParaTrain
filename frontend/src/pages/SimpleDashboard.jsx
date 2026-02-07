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
  History,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import armsImg from "../assets/arms.png";
import wristsImg from "../assets/wrists.png";
import legsImg from "../assets/legs.png";
import fullBodyImg from "../assets/fullbody.png";
import logo from "../assets/ParaTrainLogo.png";
import BodyFigure from "../components/BodyFigure";
import { loadProgress, ORDER, getDefaultProgress, getRecentSessions, getEstimatedNextSessionMinutes, formatTimeStamp, isModeCompletedToday } from "../utils/progressStorage";
import { getMotivationalMessage, getCurrentMilestone, getNextMilestone, getGreeting, formatSessionDate } from "../utils/patientQoL";

const MODES = [
  { id: "arms", label: "ARMS", image: armsImg, route: "/dashboard/simple/arms" },
  { id: "wrists", label: "WRISTS", image: wristsImg, route: "/dashboard/simple/wrists" },
  { id: "legs", label: "LEGS", image: legsImg, route: "/dashboard/simple/legs" },
  { id: "fullbody", label: "FULL BODY", image: fullBodyImg, route: "/dashboard/simple/fullbody" },
];

export default function SimpleDashboard() {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();
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

  const progressSegments = [0, 1, 2, 3].map((i) => {
    if (i < sessionsCompleted) return "green";
    if (i === sessionsCompleted) return "yellow75";
    return "yellow35";
  });

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

  const handleStartSession = () => navigate(nextRoute);
  const handleModeClick = (route) => navigate(route);

  const recentSessions = getRecentSessions(5);
  const estimatedMins = getEstimatedNextSessionMinutes(nextMode);
  const motivationalMsg = getMotivationalMessage(progress);
  const currentMilestone = getCurrentMilestone(progress);
  const nextMilestone = getNextMilestone(progress);
  const greeting = getGreeting();

  const [modeSearch, setModeSearch] = useState("");
  const [clock, setClock] = useState(() => formatTimeStamp());
  const [sessionDetail, setSessionDetail] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setClock(formatTimeStamp()), 1000);
    return () => clearInterval(t);
  }, []);

  const filteredModes = modeSearch
    ? MODES.filter((m) => m.label.toLowerCase().includes(modeSearch.toLowerCase()))
    : MODES;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " " && !e.target.matches("input, textarea")) {
        e.preventDefault();
        navigate(nextRoute);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextRoute, navigate]);

  const bgClass = dark ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-para-bg via-white to-para-teal/5";
  const cardClass = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-md";
  const mutedClass = dark ? "text-gray-400" : "text-gray-600";

  const statCards = [
    { Icon: Clock, value: `${progress.trainingTimeMinutes}m`, label: "Training Time", color: "text-purple-500", bg: "bg-purple-500/10", pos: "top-left" },
    { Icon: Flame, value: String(progress.streak), label: "Day Streak", color: "text-orange-500", bg: "bg-orange-500/10", pos: "top-right" },
    { Icon: Trophy, value: String(progress.totalSessions), label: "Sessions", color: "text-blue-500", bg: "bg-blue-500/10", pos: "bottom-left" },
    { Icon: Target, value: `${progress.accuracy}%`, label: "Accuracy", color: "text-red-500", bg: "bg-red-500/10", pos: "bottom-right" },
  ];

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col transition-colors`}>
      <header className={`flex items-center justify-between px-6 py-3 border-b ${dark ? "border-gray-700" : "border-gray-200"} flex-shrink-0 animate-fadeIn`}>
        <Link to="/dashboard/simple" className="flex items-center">
          <img src={logo} alt="ParaTrain" className="h-11 object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium tabular-nums opacity-90">{clock}</span>
          <div
            className={`relative flex w-[176px] rounded-xl p-1 cursor-pointer select-none border ${dark ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-gray-100"}`}
            onClick={() => navigate("/dashboard")}
          >
            <div
              className="absolute top-1 left-1 h-8 w-[84px] rounded-lg bg-gradient-to-r from-para-teal to-para-teal-dark shadow-md transition-all duration-300 ease-out"
              style={{ transform: "translateX(84px)" }}
            />
            <span className={`relative z-10 w-1/2 text-center text-sm font-medium py-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`}>NORMAL</span>
            <span className="relative z-10 w-1/2 text-center text-sm font-medium py-1.5 text-white">SIMPLE</span>
          </div>
          <button type="button" onClick={toggleTheme} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:opacity-80" title={dark ? "Light mode" : "Dark mode"}>
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span className="text-sm font-medium opacity-80 capitalize">{role}</span>
          <button type="button" onClick={handleLogout} className="text-sm font-medium opacity-80 hover:underline">Logout</button>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-8 grid grid-cols-12 gap-6 md:gap-8 min-h-0">
        {/* LEFT: Simulation Modes - larger */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-90 px-1 animate-fadeIn">Simulation Modes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search modes..."
              value={modeSearch}
              onChange={(e) => setModeSearch(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl border text-sm w-full ${dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}
            />
          </div>
          {filteredModes.map((mode, idx) => {
            const completedToday = isModeCompletedToday(mode.id);
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeClick(mode.route)}
                className={`flex items-center gap-4 w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] animate-fadeIn ${cardClass} ${
                  completedToday ? "border-green-500 ring-2 ring-green-500/30" : dark ? "border-gray-600 hover:border-para-teal" : "border-gray-200 hover:border-para-teal"
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <img src={mode.image} alt={mode.label} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                <span className="font-semibold text-base">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* CENTRE: Welcome, progress, figure, stats, Start Session */}
        <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-start min-h-0">
          <div className="w-full mb-5">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{greeting}, {user}</h1>
            {motivationalMsg && (
              <p className="text-sm text-para-teal mb-2">{motivationalMsg}</p>
            )}
            {(currentMilestone || nextMilestone) && (
              <div className={`rounded-lg px-3 py-2 mb-3 text-sm ${dark ? "bg-gray-800/50" : "bg-para-teal/10"}`}>
                {currentMilestone && <span>{currentMilestone.emoji} {currentMilestone.title}</span>}
                {nextMilestone && nextMilestone.sessionsNeeded != null && (
                  <span className={dark ? "text-gray-400" : "text-gray-600"}>
                    {currentMilestone && " · "}{nextMilestone.sessionsNeeded} more until {nextMilestone.title}
                  </span>
                )}
              </div>
            )}
            <div className="h-4 w-full rounded-full overflow-hidden flex gap-1" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}>
              {progressSegments.map((seg, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all"
                  style={{
                    background: seg === "green" ? "rgba(34, 197, 94, 1)" : seg === "yellow75" ? "rgba(234, 179, 8, 0.75)" : "rgba(234, 179, 8, 0.35)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Figure + stat cards around it */}
          <div className="relative flex-1 w-full flex items-center justify-center min-h-[380px] md:min-h-[440px]">
            {/* Stat cards - positioned at corners, larger */}
            {statCards.map((stat, i) => (
              <div
                key={i}
                className={`absolute z-10 flex flex-col items-center justify-center rounded-2xl border ${cardClass} px-5 py-4 min-w-[120px] md:min-w-[140px] ${
                  stat.pos === "top-left" ? "left-0 top-0 md:left-2 md:top-2" :
                  stat.pos === "top-right" ? "right-0 top-0 md:right-2 md:top-2" :
                  stat.pos === "bottom-left" ? "left-0 bottom-0 md:left-2 md:bottom-2" :
                  "right-0 bottom-0 md:right-2 md:bottom-2"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                  <stat.Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <span className="text-lg font-bold">{stat.value}</span>
                <span className={`text-xs font-medium ${mutedClass}`}>{stat.label}</span>
              </div>
            ))}

            <div className="relative z-0 flex items-center justify-center">
              <BodyFigure bodyCompleted={bodyCompleted} dark={dark} className="w-full max-w-[300px] md:max-w-[360px] h-auto aspect-[240/420] flex-shrink-0 drop-shadow-xl" />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleStartSession}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-para-teal to-para-teal-dark text-white font-semibold hover:from-para-teal-dark hover:to-para-navy transition-all duration-200 shadow-xl shadow-para-teal/20 text-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]"
            >
              Start Session
            </button>
            <p className={`text-xs ${mutedClass}`}>~{estimatedMins} min · Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Space</kbd> to start</p>
          </div>

          {/* Recent sessions - quick resume */}
          {recentSessions.length > 0 && (
            <div className={`mt-6 w-full rounded-xl border p-4 ${cardClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <History className="w-4 h-4 text-para-teal" />
                <span className="text-sm font-medium">Recent Sessions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSessionDetail(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${dark ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    {s.label} · {formatSessionDate(s.date)} · {s.score}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Doctor Connect, AI Report, utilities - larger */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
          <div className={`rounded-2xl border p-6 ${cardClass}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-90 mb-4">Doctor Connect</h2>
            <div className="flex justify-center py-6">
              <div className="w-20 h-20 rounded-2xl bg-para-teal/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-para-teal" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/doctor")}
              className="w-full py-3 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark transition"
            >
              Connect
            </button>
          </div>

          <div className={`rounded-2xl border p-6 ${cardClass}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-90 mb-4">AI Performance Report</h2>
            <div className={`rounded-xl p-4 mb-4 ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
              <p className="font-medium">{progress.lastReportTitle}</p>
              <p className="text-green-500 font-bold text-xl mt-1">{progress.lastReportPercent}%</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/reports")}
              className="w-full py-3 rounded-xl border-2 border-para-teal text-para-teal font-semibold hover:bg-para-teal/10 transition"
            >
              View
            </button>
          </div>

          <div className="mt-auto flex items-center justify-end gap-3">
            <button type="button" onClick={toggleTheme} className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 hover:opacity-80 transition" title={dark ? "Light mode" : "Dark mode"}>
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button type="button" onClick={() => navigate("/dashboard/settings")} className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 hover:opacity-80 transition" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => navigate("/dashboard/support")} className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 hover:opacity-80 transition" title="Support">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Session detail modal */}
      {sessionDetail && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSessionDetail(null)} aria-hidden />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className={`${cardClass} rounded-2xl shadow-xl max-w-sm w-full p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Session Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className={mutedClass}>Simulation</dt>
                  <dd className="font-medium">{sessionDetail.label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={mutedClass}>Date</dt>
                  <dd className="font-medium">{formatSessionDate(sessionDetail.date)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={mutedClass}>Time</dt>
                  <dd className="font-medium">{sessionDetail.timeStamp || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={mutedClass}>Duration</dt>
                  <dd className="font-medium">{sessionDetail.durationMinutes || 5} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={mutedClass}>Score</dt>
                  <dd className="font-semibold text-para-teal">{sessionDetail.score}%</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setSessionDetail(null)}
                className="mt-6 w-full py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark transition"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
