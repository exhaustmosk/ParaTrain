import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadProgress, saveProgress, ORDER, addSessionRecord, resetSessionForModeToday } from "../utils/progressStorage";
import { useTheme } from "../context/ThemeContext";

const MODE_LABELS = { arms: "Arms", wrists: "Wrists", legs: "Legs", fullbody: "Full Body" };

const SESSION_TIPS = {
  arms: [
    "Focus on smooth, controlled movements. Avoid jerky motions.",
    "Keep your posture upright throughout the session.",
    "Take short breaks if you feel fatigue in your shoulders.",
  ],
  wrists: [
    "Wrist exercises are gentle—don't overexert.",
    "Stretch before and after to prevent strain.",
    "Keep your fingers relaxed during wrist movements.",
  ],
  legs: [
    "Warm up with light stretches before starting.",
    "Maintain balance by holding onto a surface if needed.",
    "Breathe steadily during leg exercises.",
  ],
  fullbody: [
    "This is your most comprehensive session. Pace yourself.",
    "Follow the sequence: arms → wrists → legs for best results.",
    "Stay hydrated and take breaks as needed.",
  ],
};

export default function SimpleSimulation() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const label = MODE_LABELS[mode] || mode;
  const tips = SESSION_TIPS[mode] || SESSION_TIPS.arms;

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") navigate("/dashboard/simple");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const [showComplete, setShowComplete] = useState(false);
  const [completeScore, setCompleteScore] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleComplete = () => {
    const durationMinutes = Math.max(1, Math.floor(elapsed / 60));
    const score = 85 + Math.floor(Math.random() * 14);
    setCompleteScore(score);
    addSessionRecord(mode, durationMinutes, score);
    setShowComplete(true);
  };

  const handleContinue = () => navigate("/dashboard/simple");

  const handleResetConfirm = () => {
    resetSessionForModeToday(mode);
    setShowResetConfirm(false);
    navigate("/dashboard/simple");
  };

  const handleBack = () => {
    navigate("/dashboard/simple");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const bgClass = dark ? "bg-gray-900" : "bg-para-bg";
  const cardClass = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textClass = dark ? "text-gray-100" : "text-gray-900";
  const mutedClass = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center justify-center p-8 transition-colors`}>
      <div className={`${cardClass} rounded-2xl shadow-xl border p-10 max-w-md w-full`}>
        <h1 className={`text-2xl font-bold mb-2 ${textClass}`}>Simulation: {label}</h1>
        <p className={`${mutedClass} mb-4`}>This is a placeholder. Full simulation will be implemented later.</p>

        {/* Session timer */}
        <div className={`rounded-xl p-4 mb-6 text-center ${dark ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <p className={`text-sm ${mutedClass}`}>Session duration</p>
          <p className="text-2xl font-bold text-para-teal">{formatTime(elapsed)}</p>
        </div>

        {/* Tips */}
        <div className="mb-6 text-left">
          <p className={`text-sm font-medium ${textClass} mb-2`}>Quick tips for this session:</p>
          <ul className="space-y-1.5 text-sm">
            {tips.map((tip, i) => (
              <li key={i} className={`flex items-start gap-2 ${mutedClass}`}>
                <span className="text-para-teal mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Keyboard shortcut hint */}
        <p className={`text-xs ${mutedClass} mb-4`}>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Esc</kbd> to go back</p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleComplete}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            Complete Session
          </button>
          <button
            type="button"
            onClick={handleBack}
            className={`w-full py-3 rounded-xl border font-medium transition ${dark ? "border-gray-600 text-gray-200 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Restart Session (Reset Today)
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`${cardClass} rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-scaleIn`}>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className={`text-xl font-bold ${textClass} mb-2`}>Reset Today&apos;s Progress?</h2>
            <p className={`${mutedClass} mb-6 text-sm`}>
              This will remove all {label} sessions completed today. Your stats (training time, sessions, accuracy, streak) will be recalculated and the green completion border will disappear. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl border font-medium ${dark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-700"}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion modal */}
      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`${cardClass} rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-scaleIn`}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className={`text-2xl font-bold ${textClass} mb-1`}>Session Complete!</h2>
            <p className={`${mutedClass} mb-4`}>Great job finishing your {label} training.</p>
            <div className={`rounded-xl p-4 mb-6 ${dark ? "bg-gray-700/50" : "bg-para-teal/10"}`}>
              <p className={`text-sm ${mutedClass}`}>Your score</p>
              <p className={`text-4xl font-bold ${completeScore >= 90 ? "text-green-500" : completeScore >= 75 ? "text-amber-500" : "text-para-teal"}`}>
                {completeScore}%
              </p>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
