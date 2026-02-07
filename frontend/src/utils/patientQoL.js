// Patient QoL utilities: motivational messages, milestones, tips

import { ORDER, MODE_LABELS } from "./progressStorage";

export const MOTIVATIONAL_MESSAGES = [
  "You're making great progress! Every session counts.",
  "Consistency is key. Keep up the excellent work!",
  "Your dedication to training is inspiring.",
  "Small steps lead to big improvements.",
  "You're building healthy habits. Well done!",
  "Each session brings you closer to your goals.",
  "Proud of you for showing up today!",
  "Your commitment to recovery is admirable.",
];

export const MILESTONES = [
  { sessions: 1, title: "First Session", emoji: "🎉", message: "You completed your first training session!" },
  { sessions: 5, title: "5 Sessions", emoji: "⭐", message: "You've completed 5 sessions. Keep it up!" },
  { sessions: 10, title: "10 Sessions", emoji: "🌟", message: "10 sessions done. You're building a strong habit!" },
  { sessions: 25, title: "25 Sessions", emoji: "🏆", message: "25 sessions completed. Great dedication!" },
  { sessions: 50, title: "50 Sessions", emoji: "💪", message: "50 sessions! You're a training regular!" },
  { sessions: 100, title: "100 Sessions", emoji: "👑", message: "100 sessions! You're a ParaTrain champion!" },
];

export function getMotivationalMessage(progress) {
  const total = progress?.totalSessions ?? 0;
  const idx = total % MOTIVATIONAL_MESSAGES.length;
  return MOTIVATIONAL_MESSAGES[idx];
}

export function getCurrentMilestone(progress) {
  const total = progress?.totalSessions ?? 0;
  const passed = MILESTONES.filter((m) => total >= m.sessions);
  return passed[passed.length - 1] || null;
}

export function getNextMilestone(progress) {
  const total = progress?.totalSessions ?? 0;
  const next = MILESTONES.find((m) => m.sessions > total);
  if (!next) return null;
  return { ...next, sessionsNeeded: next.sessions - total };
}

export function getSessionTips(mode) {
  const tips = {
    arms: ["Keep elbows slightly bent during exercises", "Maintain relaxed shoulders", "Breathe steadily"],
    wrists: ["Stretch gently before starting", "Avoid sudden movements", "Rest if you feel strain"],
    legs: ["Warm up with light walking", "Use support if needed for balance", "Stretch calves after"],
    fullbody: ["Follow the sequence: arms → wrists → legs", "Take breaks between sections", "Stay hydrated"],
  };
  return tips[mode] || tips.arms;
}

export function formatSessionDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} week(s) ago`;
  return d.toLocaleDateString();
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
