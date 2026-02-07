import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { loadProgress, getRecentSessions } from "../utils/progressStorage";
import { formatSessionDate } from "../utils/patientQoL";

export default function Reports() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    setProgress(loadProgress());
    const onFocus = () => setProgress(loadProgress());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const bg = dark ? "bg-gray-900" : "bg-gradient-to-br from-para-bg to-white";
  const card = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";

  const sessionHistory = (progress.sessionHistory || []).slice(0, 30);
  const [sessionDetail, setSessionDetail] = useState(null);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalSessions: progress.totalSessions ?? 0,
      trainingTimeMinutes: progress.trainingTimeMinutes ?? 0,
      streak: progress.streak ?? 0,
      accuracy: progress.accuracy ?? 0,
      lastReport: { title: progress.lastReportTitle, percent: progress.lastReportPercent },
      sessionHistory: sessionHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paratrain-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${bg} p-6 transition-colors`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition ${dark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className={`text-2xl font-bold ${text}`}>AI Reports</h1>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark transition"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-2xl border ${card} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-para-teal" />
              <span className={`text-sm font-medium ${muted}`}>Latest Report</span>
            </div>
            <p className={`text-xl font-bold ${text}`}>{progress.lastReportTitle || "N/A"}</p>
            <p className="text-para-teal font-semibold">{progress.lastReportPercent ?? 0}%</p>
          </div>
          <div className={`rounded-2xl border ${card} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-para-teal" />
              <span className={`text-sm font-medium ${muted}`}>Total Sessions</span>
            </div>
            <p className={`text-xl font-bold ${text}`}>{progress.totalSessions ?? 0}</p>
          </div>
          <div className={`rounded-2xl border ${card} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-para-teal" />
              <span className={`text-sm font-medium ${muted}`}>Avg Accuracy</span>
            </div>
            <p className={`text-xl font-bold ${text}`}>{progress.accuracy ?? 0}%</p>
          </div>
          <div className={`rounded-2xl border ${card} p-4`}>
            <span className={`text-sm font-medium ${muted}`}>Training Time</span>
            <p className={`text-xl font-bold ${text}`}>
              {(progress.trainingTimeMinutes ?? 0) >= 60
                ? `${((progress.trainingTimeMinutes ?? 0) / 60).toFixed(1)}h`
                : `${progress.trainingTimeMinutes ?? 0}m`}
            </p>
          </div>
        </div>

        {/* Session history */}
        <div className={`rounded-2xl border ${card} p-6 shadow-sm`}>
          <h2 className={`text-lg font-semibold ${text} mb-4`}>Session History</h2>
          {sessionHistory.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className={`w-12 h-12 mx-auto mb-4 ${muted}`} />
              <p className={muted}>No sessions yet. Complete a simulation to see your history here.</p>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mt-4 px-6 py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark transition"
              >
                Start Training
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sessionHistory.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSessionDetail(s)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left ${dark ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-50/80 hover:bg-gray-100"} transition`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-para-teal/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-para-teal" />
                    </div>
                    <div>
                      <p className={`font-medium ${text}`}>{s.label} Report</p>
                      <p className={`text-xs ${muted}`}>{formatSessionDate(s.date)} · {s.timeStamp || "—"} · {s.durationMinutes || 5} min</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${s.score >= 90 ? "text-green-500" : s.score >= 75 ? "text-amber-500" : "text-gray-500"}`}>
                    {s.score}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Session detail modal */}
      {sessionDetail && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSessionDetail(null)} aria-hidden />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className={`${card} rounded-2xl shadow-xl max-w-sm w-full p-6 border`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-lg font-semibold mb-4 ${text}`}>Session Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className={muted}>Simulation</dt>
                  <dd className={`font-medium ${text}`}>{sessionDetail.label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={muted}>Date</dt>
                  <dd className={`font-medium ${text}`}>{formatSessionDate(sessionDetail.date)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={muted}>Time</dt>
                  <dd className={`font-medium ${text}`}>{sessionDetail.timeStamp || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={muted}>Duration</dt>
                  <dd className={`font-medium ${text}`}>{sessionDetail.durationMinutes || 5} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={muted}>Score</dt>
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
