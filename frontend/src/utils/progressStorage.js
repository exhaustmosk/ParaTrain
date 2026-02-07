// Shared progress/stats for both Normal and Simple Dashboard

export const SIMPLE_STORAGE_KEY = "paratrain_simple_progress";

export const ORDER = ["arms", "wrists", "legs", "fullbody"];

export const MODE_LABELS = { arms: "Arms", wrists: "Wrists", legs: "Legs", fullbody: "Full Body" };

export function formatTimeStamp(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function getDefaultProgress() {
  return {
    sessionsCompleted: 0,
    trainingTimeMinutes: 0,
    streak: 0,
    totalSessions: 0,
    accuracy: 0,
    lastReportPercent: 0,
    lastReportTitle: "Full Body Report",
    sessionHistory: [],
    lastSessionDate: null,
    dailyCompletionByMode: {}, // { arms: "2025-02-07", wrists: "2025-02-07" }
  };
}

export function loadProgress() {
  try {
    const s = localStorage.getItem(SIMPLE_STORAGE_KEY);
    if (s) return { ...getDefaultProgress(), ...JSON.parse(s) };
  } catch (_) {}
  return getDefaultProgress();
}

export function saveProgress(p) {
  try {
    localStorage.setItem(SIMPLE_STORAGE_KEY, JSON.stringify(p));
  } catch (_) {}
}

function recomputeStatsFromHistory(p) {
  const history = p.sessionHistory || [];
  p.totalSessions = history.length;
  p.trainingTimeMinutes = history.reduce((sum, h) => sum + (h.durationMinutes || 5), 0);
  if (history.length > 0) {
    const totalScore = history.reduce((sum, h) => sum + (h.score || 0), 0);
    p.accuracy = Math.round(totalScore / history.length);
  } else {
    p.accuracy = 0;
  }
  // Streak: consecutive days with at least one session
  const dates = [...new Set(history.map((h) => (h.date || "").slice(0, 10)))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let check = today;
  for (let i = 0; i < 365; i++) {
    if (dates.includes(check)) {
      streak++;
      const d = new Date(check);
      d.setDate(d.getDate() - 1);
      check = d.toISOString().slice(0, 10);
    } else break;
  }
  p.streak = streak;
  return p;
}

export function addSessionRecord(mode, durationMinutes = 5, score = null) {
  const p = loadProgress();
  const now = new Date();
  const scoreVal = score ?? 85 + Math.floor(Math.random() * 14);
  const record = {
    id: Date.now(),
    mode,
    label: MODE_LABELS[mode] || mode,
    date: now.toISOString(),
    timeStamp: formatTimeStamp(now),
    durationMinutes,
    score: scoreVal,
  };
  p.sessionHistory = (p.sessionHistory || []).slice(0, 100);
  p.sessionHistory.unshift(record);
  p.lastSessionDate = now.toISOString().slice(0, 10);
  p.dailyCompletionByMode = p.dailyCompletionByMode || {};
  p.dailyCompletionByMode[mode] = now.toISOString().slice(0, 10);
  p.lastReportTitle = `${record.label} Report`;
  p.lastReportPercent = scoreVal;
  const idx = ORDER.indexOf(mode);
  if (idx >= 0 && p.sessionsCompleted === idx) {
    p.sessionsCompleted = Math.min(idx + 1, ORDER.length);
  }
  recomputeStatsFromHistory(p);
  saveProgress(p);
  return record;
}

export function getRecentSessions(limit = 5) {
  const p = loadProgress();
  return (p.sessionHistory || []).slice(0, limit);
}

export function getEstimatedNextSessionMinutes(mode) {
  const p = loadProgress();
  const history = p.sessionHistory || [];
  const sameMode = history.filter((h) => h.mode === mode);
  if (sameMode.length === 0) return 5;
  const avg = sameMode.slice(0, 10).reduce((s, h) => s + (h.durationMinutes || 5), 0) / sameMode.length;
  return Math.round(Math.max(3, Math.min(15, avg)));
}

export function isModeCompletedToday(mode) {
  const p = loadProgress();
  const today = new Date().toISOString().slice(0, 10);
  return (p.dailyCompletionByMode || {})[mode] === today;
}

export function resetSessionForModeToday(mode) {
  const p = loadProgress();
  const today = new Date().toISOString().slice(0, 10);
  p.sessionHistory = (p.sessionHistory || []).filter(
    (h) => !(h.mode === mode && (h.date || "").slice(0, 10) === today)
  );
  p.dailyCompletionByMode = { ...(p.dailyCompletionByMode || {}), [mode]: null };
  delete p.dailyCompletionByMode[mode];
  recomputeStatsFromHistory(p);
  if (p.lastReportTitle === `${(MODE_LABELS[mode] || mode)} Report` && p.sessionHistory.length > 0) {
    const last = p.sessionHistory[0];
    p.lastReportTitle = `${last.label} Report`;
    p.lastReportPercent = last.score || 0;
  } else if (p.sessionHistory.length === 0) {
    p.lastReportTitle = "Full Body Report";
    p.lastReportPercent = 0;
  }
  saveProgress(p);
}
