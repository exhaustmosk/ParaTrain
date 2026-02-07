import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NOTIFICATIONS_KEY = "paratrain_notifications";
const REMINDERS_KEY = "paratrain_reminders";

export default function Settings() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  useEffect(() => {
    const n = localStorage.getItem(NOTIFICATIONS_KEY);
    const r = localStorage.getItem(REMINDERS_KEY);
    if (n !== null) setNotifications(n === "true");
    if (r !== null) setReminders(r === "true");
  }, []);

  const handleNotifications = (value) => {
    setNotifications(value);
    localStorage.setItem(NOTIFICATIONS_KEY, String(value));
  };

  const handleReminders = (value) => {
    setReminders(value);
    localStorage.setItem(REMINDERS_KEY, String(value));
  };

  return (
    <div className="min-h-screen bg-para-bg p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {/* Dark mode */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">Dark mode</p>
                <p className="text-sm text-gray-500">Use a dark theme across the app</p>
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
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Receive in-app notifications for sessions and reports</p>
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

            {/* Session reminders */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">Session reminders</p>
                <p className="text-sm text-gray-500">Get reminded to continue your training sessions</p>
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
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">ParaTrain · Version V0.1</p>
      </div>
    </div>
  );
}
