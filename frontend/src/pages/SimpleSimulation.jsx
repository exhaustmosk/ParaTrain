import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadProgress, saveProgress, ORDER, SIMPLE_STORAGE_KEY } from "./SimpleDashboard";

const MODE_LABELS = { arms: "Arms", wrists: "Wrists", legs: "Legs", fullbody: "Full Body" };

export default function SimpleSimulation() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const label = MODE_LABELS[mode] || mode;

  const handleComplete = () => {
    const progress = loadProgress();
    const idx = ORDER.indexOf(mode);
    if (idx === -1) {
      navigate("/dashboard/simple");
      return;
    }
    // Only advance if this is the next session in order (user completed the current one)
    if (progress.sessionsCompleted === idx) {
      progress.sessionsCompleted += 1;
      progress.totalSessions = (progress.totalSessions || 0) + 1;
      progress.trainingTimeMinutes = (progress.trainingTimeMinutes || 0) + 5;
      progress.streak = (progress.streak || 0) + 1;
      progress.lastReportTitle = `${label} Report`;
      progress.lastReportPercent = 85 + Math.floor(Math.random() * 14);
      saveProgress(progress);
    }
    navigate("/dashboard/simple");
  };

  const handleBack = () => {
    navigate("/dashboard/simple");
  };

  return (
    <div className="min-h-screen bg-para-bg flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Simulation: {label}</h1>
        <p className="text-gray-500 mb-8">This is a placeholder. Full simulation will be implemented later.</p>
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
            className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
