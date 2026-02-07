import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Star, Play, ArrowLeft } from "lucide-react";

import armsImg from "../../assets/arms.png";
import wristsImg from "../../assets/wrists.png";
import legsImg from "../../assets/legs.png";
import fullBodyImg from "../../assets/fullbody.png";

const simulations = [
  {
    title: "Arms",
    desc: "Practice arm examinations and procedures",
    image: armsImg,
    rating: 3,
    modules: "12 modules",
    route: "/dashboard/arms",
  },
  {
    title: "Legs",
    desc: "Master lower limb examination techniques",
    image: legsImg,
    rating: 3,
    modules: "10 modules",
    route: "/dashboard/legs",
  },
  {
    title: "Wrists",
    desc: "Advanced hand and wrist diagnostics",
    image: wristsImg,
    rating: 4,
    modules: "15 modules",
    route: "/dashboard/wrists",
  },
  {
    title: "Full Body",
    desc: "Comprehensive full body examination",
    image: fullBodyImg,
    rating: 5,
    modules: "20 modules",
    route: "/dashboard/fullbody",
  },
];

function SimulationModes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#00ACD8]/10 flex items-center justify-center">
          <FileText className="text-[#00ACD8]" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulation Modes</h1>
          <p className="text-sm text-gray-500">All available simulation modes in one place</p>
        </div>
      </div>

      {/* Row-based layout: one row per simulation */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {simulations.map((sim, i) => (
          <div
            key={sim.title}
            className={`flex items-center gap-6 p-6 ${
              i < simulations.length - 1 ? "border-b border-gray-100" : ""
            } hover:bg-gray-50/50 transition`}
          >
            {/* Thumbnail */}
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={sim.image}
                alt={sim.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {sim.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{sim.desc}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={
                        idx < sim.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{sim.modules}</span>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate(sim.route)}
              className="flex items-center gap-2 bg-[#00ACD8] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 flex-shrink-0"
            >
              <Play size={16} />
              Start Training
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimulationModes;
