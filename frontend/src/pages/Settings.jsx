import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

const NOTIFICATIONS_KEY = "paratrain_notifications";
const REMINDERS_KEY = "paratrain_reminders";
const REMINDER_TIME_KEY = "paratrain_reminder_time";

export default function Settings() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const { role } = useAuth();
  const isDoctor = role === "doctor";
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");

  useEffect(() => {
    const n = localStorage.getItem(NOTIFICATIONS_KEY);
    const r = localStorage.getItem(REMINDERS_KEY);
    const t = localStorage.getItem(REMINDER_TIME_KEY);
    if (n !== null) setNotifications(n === "true");
    if (r !== null) setReminders(r === "true");
    if (t) setReminderTime(t);
  }, []);

  const handleNotifications = (value) => {
    setNotifications(value);
    localStorage.setItem(NOTIFICATIONS_KEY, String(value));
  };

  const handleReminders = (value) => {
    setReminders(value);
    localStorage.setItem(REMINDERS_KEY, String(value));
  };

  const handleReminderTime = (value) => {
    setReminderTime(value);
    localStorage.setItem(REMINDER_TIME_KEY, value);
  };

  const bg = dark ? "bg-gray-900" : "bg-para-bg";
  const card = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bg} p-6 transition-colors`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-4 py-2.5 rounded-xl border font-medium transition ${dark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            Back
          </button>
          <h1 className={`text-2xl font-bold ${text}`}>Settings</h1>
        </div>

        <div className={`${card} rounded-2xl border shadow-sm overflow-hidden`}>
          <div className={`divide-y ${dark ? "divide-gray-700" : "divide-gray-100"}`}>
            {/* Profile & Biodata - patients only */}
            {!isDoctor && (
              <button
                type="button"
                onClick={() => navigate("/dashboard/biodata")}
                className={`w-full flex items-center justify-between px-6 py-5 text-left transition ${dark ? "hover:bg-gray-700/50" : "hover:bg-gray-50/80"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-para-teal/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-para-teal" />
                  </div>
                  <div>
                    <p className={`font-medium ${text}`}>Profile & biodata</p>
                    <p className={`text-sm ${muted}`}>Edit your health profile and personal details</p>
                  </div>
                </div>
                <span className={`text-sm ${muted}`}>Edit →</span>
              </button>
            )}

            {/* Dark mode */}
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className={`font-medium ${text}`}>Dark mode</p>
                <p className={`text-sm ${muted}`}>Use a dark theme across the app</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={dark}
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-para-teal focus:ring-offset-2 ${
                  dark ? "bg-para-teal" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    dark ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className={`font-medium ${text}`}>Notifications</p>
                <p className={`text-sm ${muted}`}>{isDoctor ? "Receive notifications for new appointments and patient updates" : "Receive in-app notifications for sessions and reports"}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                onClick={() => handleNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-para-teal focus:ring-offset-2 ${
                  notifications ? "bg-para-teal" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    notifications ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Session reminders - patients only */}
            {!isDoctor && (
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className={`font-medium ${text}`}>Session reminders</p>
                <p className={`text-sm ${muted}`}>Get reminded to continue your training sessions</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={reminders}
                onClick={() => handleReminders(!reminders)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-para-teal focus:ring-offset-2 ${
                  reminders ? "bg-para-teal" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    reminders ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            )}

            {/* Reminder time - patients only, when reminders on */}
            {!isDoctor && reminders && (
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className={`font-medium ${text}`}>Reminder time</p>
                  <p className={`text-sm ${muted}`}>When to receive your daily session reminder</p>
                </div>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => handleReminderTime(e.target.value)}
                  className={`px-4 py-2 rounded-xl border text-sm ${dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}
                />
              </div>
            )}

            {/* Accessibility - patients only */}
            {!isDoctor && (
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className={`font-medium ${text}`}>Reduce motion</p>
                <p className={`text-sm ${muted}`}>Minimize animations for sensitivity</p>
              </div>
              <span className={`text-sm ${muted}`}>Coming soon</span>
            </div>
            )}
          </div>
        </div>

        <p className={`mt-8 text-center text-sm ${muted}`}>ParaTrain · Version V0.1</p>
      </div>
    </div>
  );
}
