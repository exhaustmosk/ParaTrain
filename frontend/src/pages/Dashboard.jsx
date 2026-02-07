import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Clock,
  Star,
  Flame,
  Play,
  Crown,
  FileText,
  History,
  Search,
} from "lucide-react";

import BodyFigure from "../components/BodyFigure";
import DoctorDashboard from "./DoctorDashboard";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { loadProgress, getRecentSessions, getEstimatedNextSessionMinutes } from "../utils/progressStorage";
import { ORDER } from "../utils/progressStorage";
import { getMotivationalMessage, getCurrentMilestone, getNextMilestone, getGreeting, formatSessionDate } from "../utils/patientQoL";

import armsImg from "../assets/arms.png";
import wristsImg from "../assets/wrists.png";
import legsImg from "../assets/legs.png";
import fullBodyImg from "../assets/fullbody.png";

const SIMPLE_ROUTES = {
  arms: "/dashboard/simple/arms",
  wrists: "/dashboard/simple/wrists",
  legs: "/dashboard/simple/legs",
  fullbody: "/dashboard/simple/fullbody",
};

function Dashboard() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { dark } = useTheme();

  if (role === "doctor") {
    return <DoctorDashboard />;
  }
  const [progress, setProgress] = useState(loadProgress());

  const refreshProgress = useCallback(() => setProgress(loadProgress()), []);

  useEffect(() => {
    refreshProgress();
    const onFocus = () => refreshProgress();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshProgress]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " " && !e.target.matches("input, textarea")) {
        e.preventDefault();
        navigate(nextSessionRoute);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSessionRoute, navigate]);

  const sessionsCompleted = progress.sessionsCompleted ?? 0;
  const nextIndex = Math.min(sessionsCompleted, ORDER.length - 1);
  const nextMode = ORDER[nextIndex];
  const nextSessionRoute = SIMPLE_ROUTES[nextMode] ?? "/dashboard/simple/arms";

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

  const progressSegments = [0, 1, 2, 3].map((i) => {
    if (i < sessionsCompleted) return "green";
    if (i === sessionsCompleted) return "yellow75";
    return "yellow35";
  });

  const handleStartNewSession = () => navigate(nextSessionRoute);

  const trainingTimeDisplay = progress.trainingTimeMinutes >= 60
    ? `${(progress.trainingTimeMinutes / 60).toFixed(1)}h`
    : `${progress.trainingTimeMinutes}m`;

  const stats = [
    { label: "Sessions Completed", value: String(progress.totalSessions ?? 0), icon: Trophy, iconClass: "text-blue-500", bgClass: "bg-blue-500/10" },
    { label: "Training Time", value: trainingTimeDisplay, icon: Clock, iconClass: "text-purple-500", bgClass: "bg-purple-500/10" },
    { label: "Accuracy Score", value: `${progress.accuracy ?? 0}%`, icon: Star, iconClass: "text-amber-500", bgClass: "bg-amber-500/10" },
    { label: "Day Streak", value: String(progress.streak ?? 0), icon: Flame, iconClass: "text-orange-500", bgClass: "bg-orange-500/10" },
  ];

  const allSimulations = [
    { id: "arms", title: "Arms", desc: "Practice arm examinations and procedures", image: armsImg, rating: 3, modules: "12 modules", route: "/dashboard/arms" },
    { id: "legs", title: "Legs", desc: "Master lower limb examination techniques", image: legsImg, rating: 3, modules: "10 modules", route: "/dashboard/legs" },
    { id: "wrists", title: "Wrists", desc: "Advanced hand and wrist diagnostics", image: wristsImg, rating: 4, modules: "15 modules", route: "/dashboard/wrists" },
    { id: "fullbody", title: "Full Body", desc: "Comprehensive full body examination", image: fullBodyImg, rating: 5, modules: "20 modules", route: "/dashboard/fullbody" },
  ];

  const [simSearch, setSimSearch] = useState("");
  const simulations = simSearch
    ? allSimulations.filter(
        (s) =>
          s.title.toLowerCase().includes(simSearch.toLowerCase()) ||
          s.desc.toLowerCase().includes(simSearch.toLowerCase())
      )
    : allSimulations;

  const recentSessions = getRecentSessions(5);
  const estimatedMins = getEstimatedNextSessionMinutes(nextMode);
  const motivationalMsg = getMotivationalMessage(progress);
  const currentMilestone = getCurrentMilestone(progress);
  const nextMilestone = getNextMilestone(progress);
  const greeting = getGreeting();
  const [sessionDetail, setSessionDetail] = useState(null);

  const bgMain = dark ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-para-bg to-para-teal/10";
  const cardBg = dark ? "bg-gray-800 border-gray-700" : "bg-white/95 backdrop-blur border-gray-100 shadow-sm";
  const textPrimary = dark ? "text-gray-100" : "text-gray-900";
  const textMuted = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bgMain} transition-colors`}>
      <div className="p-6 md:p-8">
        {/* Header row */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 animate-fadeIn">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} tracking-tight`}>
              {greeting}, {user}!
            </h1>
            <p className={`${textMuted} mt-1 text-sm md:text-base`}>
              Continue your medical training journey with our advanced simulations
            </p>
            {motivationalMsg && (
              <p className={`mt-2 text-sm ${dark ? "text-para-teal/90" : "text-para-teal"}`}>
                {motivationalMsg}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={handleStartNewSession}
              className="flex items-center gap-2 bg-gradient-to-r from-para-teal to-para-teal-dark hover:from-para-teal-dark hover:to-para-navy text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-para-teal/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Play size={20} /> Start New Session
            </button>
            <p className={`text-xs ${textMuted}`}>
              ~{estimatedMins} min · Next: {["Arms", "Wrists", "Legs", "Full Body"][nextIndex]}
            </p>
            <p className={`text-xs ${textMuted}`}>
              Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Space</kbd> to start
            </p>
          </div>
        </div>

        {/* Milestones */}
        {(currentMilestone || nextMilestone) && (
          <div className={`rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 ${dark ? "bg-gray-800/50 border border-gray-700" : "bg-para-teal/5 border border-para-teal/20"} animate-fadeIn`}>
            {currentMilestone && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentMilestone.emoji}</span>
                <div>
                  <p className={`font-medium ${textPrimary}`}>{currentMilestone.title}</p>
                  <p className={`text-xs ${textMuted}`}>{currentMilestone.message}</p>
                </div>
              </div>
            )}
            {nextMilestone && nextMilestone.sessionsNeeded != null && (
              <div className={`flex items-center gap-2 ${textMuted} text-sm`}>
                <span>{nextMilestone.sessionsNeeded} more session{nextMilestone.sessionsNeeded !== 1 ? "s" : ""} until {nextMilestone.title}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`rounded-2xl border ${cardBg} p-5 md:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn ${dark ? "hover:bg-gray-700/50" : ""}`}
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className={`w-12 h-12 rounded-xl ${s.bgClass} flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.iconClass}`} />
                </div>
              </div>
              <p className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>{s.value}</p>
              <p className={`text-sm ${textMuted} mt-0.5`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Sessions - Quick Resume */}
        {recentSessions.length > 0 && (
          <div className={`rounded-2xl border ${cardBg} p-4 mb-6 animate-fadeIn`}>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-para-teal" />
              <h2 className={`font-semibold ${textPrimary}`}>Recent Sessions</h2>
              <span className={`text-xs ${textMuted}`}>— Click to view details</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSessionDetail(s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${dark ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
                >
                  <span>{s.label}</span>
                  <span className={`text-xs ${textMuted}`}>{formatSessionDate(s.date)} · {s.score}%</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main grid: Humanoid + Progress | Simulations + Reports | Pro */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
          {/* Left: Humanoid + Progress bar */}
          <div className="xl:col-span-4 animate-fadeIn" style={{ animationDelay: "400ms" }}>
            <div className={`rounded-2xl border ${cardBg} p-6 sticky top-6 hover:shadow-lg transition-shadow duration-300`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-2`}>Training Progress</h2>
              <p className={`text-xs ${textMuted} mb-4`}>Next: {["Arms", "Wrists", "Legs", "Full Body"][nextIndex]}</p>
              <div className="flex flex-col items-center">
                <BodyFigure
                  bodyCompleted={bodyCompleted}
                  dark={dark}
                  className="w-full max-w-[220px] md:max-w-[260px] h-auto aspect-[240/420] flex-shrink-0 drop-shadow-lg"
                />
                <div className="w-full mt-4">
                  <div className="h-3 w-full rounded-full overflow-hidden flex gap-1" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
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
              </div>
            </div>
          </div>

          {/* Center: Simulations + Reports */}
          <div className="xl:col-span-5 space-y-8 animate-fadeIn" style={{ animationDelay: "320ms" }}>
            <div>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h2 className={`text-xl font-semibold ${textPrimary}`}>Simulation Modes</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search simulations..."
                      value={simSearch}
                      onChange={(e) => setSimSearch(e.target.value)}
                      className={`pl-9 pr-4 py-2 rounded-xl border text-sm w-48 ${dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/simulation-modes")}
                    className="text-para-teal text-sm font-medium hover:underline"
                  >
                    View All →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {simulations.map((sim, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${cardBg} group`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={sim.image} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className={`font-semibold mb-1 ${textPrimary}`}>{sim.title}</h3>
                      <p className={`text-sm ${textMuted} mb-3 line-clamp-2`}>{sim.desc}</p>
                      <button
                        type="button"
                        onClick={() => navigate(sim.route)}
                        className="w-full bg-gradient-to-r from-para-teal to-para-teal-dark hover:from-para-teal-dark hover:to-para-navy text-white py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md"
                      >
                        Start Training
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-6 ${cardBg} shadow-sm`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`font-semibold text-lg ${textPrimary}`}>AI Performance Reports</h2>
                <button type="button" onClick={() => navigate("/dashboard/reports")} className="text-para-teal text-sm font-medium hover:underline">View All</button>
              </div>
              {(recentSessions.length > 0
                ? recentSessions.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className={`flex justify-between items-center rounded-xl p-4 mb-3 last:mb-0 ${dark ? "bg-gray-700/50" : "bg-gray-50/80"} hover:bg-para-teal/5 transition cursor-pointer`}
                      onClick={() => setSessionDetail(s)}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-xl bg-para-teal/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="text-para-teal w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-medium ${textPrimary}`}>{s.label} Report</p>
                          <p className={`text-xs ${textMuted}`}>{formatSessionDate(s.date)} · {s.timeStamp || ""}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${s.score >= 90 ? "text-green-500" : s.score >= 75 ? "text-amber-500" : "text-gray-500"}`}>{s.score}%</span>
                    </div>
                  ))
                : (
                  <p className={`text-sm ${textMuted} py-4`}>No reports yet. Complete a session to see results.</p>
                )
              )}
            </div>
          </div>

          {/* Right: Pro card */}
          <div className="xl:col-span-3 animate-fadeIn" style={{ animationDelay: "480ms" }}>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white shadow-xl sticky top-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Pro</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Unlock Premium</h3>
              <p className="text-sm text-white/90 mb-5">Live doctor consultations and advanced training simulations</p>
              <ul className="text-sm space-y-2.5 mb-6">
                {["Real-time doctor consultations", "Advanced simulations", "Certified AI reports", "Unlimited access"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-300">✔</span> {item}
                  </li>
                ))}
              </ul>
              <div className="bg-white/15 rounded-xl p-4 mb-4 text-center backdrop-blur">
                <p className="text-3xl font-bold">$49</p>
                <p className="text-xs text-white/80">per month</p>
              </div>
              <button type="button" className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-white/95 transition">Upgrade to Pro</button>
              <p className="text-xs text-center mt-3 text-white/70">7-day free trial · No card required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session detail modal */}
      {sessionDetail && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSessionDetail(null)} aria-hidden />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-2xl shadow-xl max-w-sm w-full p-6 border`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Session Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className={textMuted}>Simulation</dt>
                  <dd className={`font-medium ${textPrimary}`}>{sessionDetail.label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={textMuted}>Date</dt>
                  <dd className={`font-medium ${textPrimary}`}>{formatSessionDate(sessionDetail.date)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={textMuted}>Time</dt>
                  <dd className={`font-medium ${textPrimary}`}>{sessionDetail.timeStamp || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={textMuted}>Duration</dt>
                  <dd className={`font-medium ${textPrimary}`}>{sessionDetail.durationMinutes || 5} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={textMuted}>Score</dt>
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

export default Dashboard;
