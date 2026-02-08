import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  loadDoctorProfile,
  saveDoctorProfile,
  getDefaultDoctorProfile,
  SPECIALTIES,
} from "../utils/doctorProfileStorage";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [data, setData] = useState(getDefaultDoctorProfile());

  useEffect(() => {
    setData(loadDoctorProfile());
  }, []);

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const bg = dark ? "bg-gray-900" : "bg-para-bg";
  const card = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const inputClass = dark
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400";

  const canSave =
    (data.firstName || "").trim() &&
    (data.lastName || "").trim() &&
    (data.specialty || "").trim() &&
    (data.qualifications || "").trim() &&
    (data.hospitalOrClinic || "").trim() &&
    ((data.contactEmail || "").trim() || (data.contactPhone || "").trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    saveDoctorProfile(data);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className={`min-h-screen ${bg} p-6 transition-colors`}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition ${dark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className={`text-xl font-bold ${text}`}>Profile settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`${card} rounded-2xl border shadow-sm overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-para-teal" />
                <h2 className={`font-semibold ${text}`}>Your details</h2>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${muted} mb-1.5`}>Title</label>
                  <select
                    value={data.title}
                    onChange={(e) => update("title", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>
                <div />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${muted} mb-1.5`}>First name *</label>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${muted} mb-1.5`}>Last name *</label>
                  <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Specialty *</label>
                <select
                  value={data.specialty}
                  onChange={(e) => update("specialty", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  required
                >
                  <option value="">Select specialty</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Qualifications *</label>
                <input
                  type="text"
                  value={data.qualifications}
                  onChange={(e) => update("qualifications", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="e.g. MBBS, MD, DNB"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Training & certifications</label>
                <input
                  type="text"
                  value={data.trainingAndCertifications}
                  onChange={(e) => update("trainingAndCertifications", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="e.g. Fellowship in Sports Medicine"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Hospital or clinic *</label>
                <input
                  type="text"
                  value={data.hospitalOrClinic}
                  onChange={(e) => update("hospitalOrClinic", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="e.g. City Medical Center"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Years of experience</label>
                <input
                  type="text"
                  value={data.yearsOfExperience}
                  onChange={(e) => update("yearsOfExperience", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Contact email</label>
                <input
                  type="email"
                  value={data.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Contact phone</label>
                <input
                  type="tel"
                  value={data.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <p className={`text-xs ${muted}`}>At least one of email or phone is required.</p>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>License number</label>
                <input
                  type="text"
                  value={data.licenseNumber}
                  onChange={(e) => update("licenseNumber", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${muted} mb-1.5`}>Short bio</label>
                <textarea
                  value={data.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                  rows={4}
                  placeholder="A brief description of your practice and approach"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="w-full py-3 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Save profile
          </button>
        </form>
      </div>
    </div>
  );
}
