import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Clock,
  Star,
  Flame,
  Play,
  Crown,
  FileText,
  Menu,
} from "lucide-react";

// COMPONENTS
import Sidebar from "../components/Sidebar";

// IMAGES
import armsImg from "../assets/arms.png";
import wristsImg from "../assets/wrists.png";
import legsImg from "../assets/legs.png";
import fullBodyImg from "../assets/fullbody.png";

function Dashboard() {
  const navigate = useNavigate(); // ✅ for routing

  // -------------------------------
  // SIDEBAR STATE (CONTROLLED HERE)
  // -------------------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // -------------------------------
  // STATS DATA
  // -------------------------------
  const stats = [
    { label: "Sessions Completed", value: "15", change: "+12%", icon: <Trophy className="text-blue-500" /> },
    { label: "Training Time", value: "23.5h", change: "+8%", icon: <Clock className="text-purple-500" /> },
    { label: "Accuracy Score", value: "92%", change: "+5%", icon: <Star className="text-green-500" /> },
    { label: "Day Streak", value: "15", change: "7 days", icon: <Flame className="text-orange-500" /> },
  ];

  // -------------------------------
  // SIMULATIONS DATA
  // -------------------------------
  const simulations = [
    { title: "Arms", desc: "Practice arm examinations and procedures", image: armsImg, rating: 3, modules: "12 modules", route: "/dashboard/arms" },
    { title: "Legs", desc: "Master lower limb examination techniques", image: legsImg, rating: 3, modules: "10 modules", route: "/dashboard/legs" },
    { title: "Wrists", desc: "Advanced hand and wrist diagnostics", image: wristsImg, rating: 4, modules: "15 modules", route: "/dashboard/wrists" },
    { title: "Full Body", desc: "Comprehensive full body examination", image: fullBodyImg, rating: 5, modules: "20 modules", route: "/dashboard/fullbody" },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] relative overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div className="p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-start gap-4">
            <Menu className="cursor-pointer mt-1" onClick={() => setSidebarOpen(true)} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Chingga!</h1>
              <p className="text-gray-500 mt-1">
                Continue your medical training journey with our advanced simulations
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-[#00ACD8] text-white px-6 py-3 rounded-xl shadow hover:opacity-90">
            <Play size={18} /> Start New Session
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">{s.icon}</div>
                <span className="text-sm text-green-500 font-medium">{s.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="col-span-8">
            {/* SIMULATIONS */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Simulation Modes</h2>
              <span
                className="text-[#00ACD8] text-sm cursor-pointer hover:underline"
                onClick={() => navigate("/dashboard/simulation-modes")}
              >
                View All →
              </span>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-10">
              {simulations.map((sim, i) => (
                <div key={i} className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
                  <img src={sim.image} alt={sim.title} className="h-32 w-full object-cover" />

                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{sim.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{sim.desc}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className={idx < sim.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-2">{sim.modules}</span>
                    </div>

                    {/* ✅ Start Training Navigation */}
                    <button
                      onClick={() => navigate(sim.route)}
                      className="w-full bg-[#00ACD8] text-white py-2 rounded-lg text-sm"
                    >
                      Start Training
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI REPORTS */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">AI Performance Reports</h2>
                <span className="text-[#00ACD8] text-sm cursor-pointer">View All</span>
              </div>

              {[
                { title: "Arms Simulation Report", time: "Generated 2 hours ago", score: "95% Accuracy", color: "text-green-500" },
                { title: "Full Body Assessment", time: "Generated yesterday", score: "88% Accuracy", color: "text-green-500" },
                { title: "Hands Diagnostic Report", time: "Generated 3 days ago", score: "78% Accuracy", color: "text-orange-500" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#00ACD8]/10 flex items-center justify-center">
                      <FileText className="text-[#00ACD8]" size={18} />
                    </div>
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-gray-500">{r.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-semibold ${r.color}`}>{r.score}</span>
                    <button className="text-sm bg-white border px-4 py-1 rounded-lg">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-4">
            <div className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="text-yellow-300" />
                <span className="text-sm bg-white/20 px-2 py-1 rounded">PRO MODE</span>
              </div>

              <h3 className="text-2xl font-bold mb-2">Unlock Premium Features</h3>
              <p className="text-sm opacity-90 mb-6">
                Get access to live doctor consultations and advanced training simulations
              </p>

              <ul className="text-sm space-y-3 mb-6">
                <li>✔ Real-time doctor consultations</li>
                <li>✔ Advanced training simulations</li>
                <li>✔ Certified AI report generation</li>
                <li>✔ Unlimited simulation access</li>
              </ul>

              <div className="bg-white text-gray-900 rounded-lg p-4 mb-4 text-center">
                <p className="text-3xl font-bold">$49</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>

              <button className="w-full bg-white text-[#2563EB] font-semibold py-2 rounded-lg">Upgrade to Pro</button>

              <p className="text-xs text-center mt-3 opacity-80">7-day free trial • No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
