import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, ArrowLeft, Phone, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const FAQ_ITEMS = [
  {
    q: "What is ParaTrain and who is it for?",
    a: "ParaTrain is a medical training and simulation platform designed to help patients and caregivers learn and practice examination techniques for arms, wrists, legs, and full-body assessments. It is for anyone who wants to improve their understanding of basic physical examination and rehabilitation exercises, including patients in physiotherapy, caregivers, and students.",
  },
  {
    q: "How do I start a training session?",
    a: "From the Simple Dashboard, click 'Start Session' to begin. Sessions run in order: Arms, then Wrists, then Legs, then Full Body. After completing one session, return to the dashboard and click 'Start Session' again to move to the next. You can also open any simulation mode from the left panel to practice a specific area.",
  },
  {
    q: "What do the body colours and progress bar mean?",
    a: "The dummy figure shows which body parts you have practised: red (50% opacity) means not yet done, green (75% opacity) means completed for that session. The progress bar has four segments for the four simulation types; each segment turns green when you complete that session. Yellow segments show your current focus.",
  },
  {
    q: "How is my accuracy and performance measured?",
    a: "After each session, the app generates an AI performance report. Your overall accuracy is shown on the dashboard and reflects how well you followed the simulation steps. Training time and session count are also tracked so you can see your progress over time.",
  },
  {
    q: "Can I connect with a real doctor through the app?",
    a: "Yes. Use the 'Doctor Connect' section on the Simple Dashboard (or from the main menu) to see a list of doctors. You can view their profiles and consultation prices and book a consultation when you need professional guidance alongside your training.",
  },
  {
    q: "Is ParaTrain a replacement for real medical care?",
    a: "No. ParaTrain is for education and practice only. It does not replace a doctor, physiotherapist, or clinical diagnosis. Always follow your healthcare provider’s advice and see a professional for any medical concerns or before starting new exercises.",
  },
  {
    q: "How often should I do the training sessions?",
    a: "We recommend doing at least one session per day if possible. The day streak on your dashboard helps you track consistency. You can repeat any simulation (Arms, Wrists, Legs, Full Body) as many times as you like to build confidence.",
  },
  {
    q: "Where can I see my past reports?",
    a: "On the Simple Dashboard, the 'AI Performance Report' card shows your latest result. Click 'View' to open the full reports page where you can see all previous reports and track your progress over time.",
  },
  {
    q: "How do I turn on dark mode or change settings?",
    a: "On the Simple Dashboard, use the sun/moon icon in the bottom right to switch between light and dark mode. For notifications and session reminders, go to Settings from the menu or the settings icon on the Simple Dashboard.",
  },
  {
    q: "I have a question that isn’t listed here. How do I get help?",
    a: "You can reach our customer support team using the telephone icon on the Simple Dashboard or from the menu. We’re here to help with technical issues, account questions, and guidance on using ParaTrain.",
  },
];

export default function Support() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(0);
  const bg = dark ? "bg-gray-900" : "bg-para-bg";
  const card = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";

  const filtered = useMemo(() => {
    if (!search.trim()) return FAQ_ITEMS;
    const s = search.toLowerCase();
    return FAQ_ITEMS.filter(
      (item) => item.q.toLowerCase().includes(s) || item.a.toLowerCase().includes(s)
    );
  }, [search]);

  // Keep first result expanded when search changes; if none, collapse
  const effectiveOpen = openIndex >= filtered.length ? -1 : openIndex;

  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
      {/* Back button - above banner */}
      <div className={`${bg} border-b ${dark ? "border-gray-700" : "border-gray-200"} px-6 py-3`}>
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition ${dark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-para-navy via-para-teal-dark to-para-teal text-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Support</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">Frequently Asked Questions</h1>
          <p className="text-white/90 mt-2">Need help with something? Here are our most frequently asked questions.</p>
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      {/* Contact cards */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="tel:+18005551234"
            className={`flex items-center gap-4 p-5 rounded-2xl border ${card} hover:shadow-lg transition`}
          >
            <div className="w-12 h-12 rounded-xl bg-para-teal/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-para-teal" />
            </div>
            <div>
              <p className={`font-semibold ${text}`}>Call Support</p>
              <p className={`text-sm ${muted}`}>+1 (800) 555-1234</p>
            </div>
          </a>
          <a
            href="mailto:support@paratrain.com"
            className={`flex items-center gap-4 p-5 rounded-2xl border ${card} hover:shadow-lg transition`}
          >
            <div className="w-12 h-12 rounded-xl bg-para-teal/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-para-teal" />
            </div>
            <div>
              <p className={`font-semibold ${text}`}>Email Us</p>
              <p className={`text-sm ${muted}`}>support@paratrain.com</p>
            </div>
          </a>
        </div>
      </div>

      {/* FAQ content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:gap-12">
          <div className="md:w-72 flex-shrink-0 mb-8 md:mb-0">
            <h2 className={`text-lg font-bold ${text}`}>General FAQs</h2>
            <p className={`text-sm ${muted} mt-1`}>
              Everything you need to know about the app and your treatment. Can&apos;t find an answer?{" "}
              <button
                type="button"
                onClick={() => navigate("/dashboard/support")}
                className="text-para-teal font-medium hover:underline"
              >
                Chat to our team
              </button>
              .
            </p>
          </div>
          <div className="flex-1">
            {filtered.length === 0 ? (
              <p className={muted}>No questions match your search.</p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((item, index) => {
                  const isOpen = effectiveOpen === index;
                  return (
                    <li
                      key={index}
                      className={`${card} rounded-xl border overflow-hidden shadow-sm`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                        aria-expanded={isOpen}
                        className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition ${dark ? "hover:bg-gray-700/50" : "hover:bg-gray-50/80"}`}
                      >
                        <span className={`font-medium ${text}`}>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className={`px-5 pb-5 pt-0 ${dark ? "bg-gray-800/50" : ""}`}>
                          <p className={`text-sm leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>{item.a}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
