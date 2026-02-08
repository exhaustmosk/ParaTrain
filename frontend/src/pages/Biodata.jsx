import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, User, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  loadBiodata,
  saveBiodata,
  getDefaultBiodata,
  GENDER_OPTIONS,
  BLOOD_GROUPS,
  REASON_BODY_AREAS,
  REASON_CONDITIONS,
} from "../utils/biodataStorage";

export default function Biodata() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromDoctor = searchParams.get("from") === "doctor";
  const { dark } = useTheme();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(getDefaultBiodata());

  useEffect(() => {
    setData(loadBiodata());
  }, []);

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const toggleReason = (item) => {
    setData((prev) => {
      const arr = prev.reasonsForUsingApp || [];
      const has = arr.includes(item);
      return { ...prev, reasonsForUsingApp: has ? arr.filter((x) => x !== item) : [...arr, item] };
    });
  };

  const bg = dark ? "bg-gray-900" : "bg-para-bg";
  const card = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const inputClass = dark
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400";

  const canProceedPage1 =
    (data.firstName || "").trim() &&
    (data.lastName || "").trim() &&
    (data.dateOfBirth || "").trim() &&
    (data.gender || "").trim() &&
    ((data.contactPhone || "").trim() || (data.contactEmail || "").trim()) &&
    (data.emergencyName || "").trim() &&
    (data.emergencyPhone || "").trim();

  const canSavePage2 =
    (data.height || "").trim() &&
    (data.weight || "").trim() &&
    (data.bloodGroup || "").trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBiodata(data);
    if (fromDoctor) navigate("/dashboard/doctor", { replace: true });
    else navigate("/dashboard", { replace: true });
  };

  return (
    <div className={`min-h-screen ${bg} p-6 transition-colors`}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => (page === 1 ? navigate(-1) : setPage(1))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition ${dark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            <ArrowLeft className="w-4 h-4" /> {page === 1 ? "Back" : "Previous"}
          </button>
          <h1 className={`text-xl font-bold ${text}`}>Health Profile</h1>
          <div className="w-24" />
        </div>

        {fromDoctor && (
          <div className={`rounded-xl px-4 py-3 mb-6 ${dark ? "bg-para-teal/20 border border-para-teal/30" : "bg-para-teal/10 border border-para-teal/20"}`}>
            <p className={`text-sm ${dark ? "text-para-teal" : "text-para-navy"}`}>
              Please complete your profile to book a consultation with a doctor.
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${page >= 1 ? "bg-para-teal" : dark ? "bg-gray-700" : "bg-gray-200"}`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${page >= 2 ? "bg-para-teal" : dark ? "bg-gray-700" : "bg-gray-200"}`}
          />
        </div>
        <p className={`text-xs ${muted} mb-6`}>Step {page} of 2</p>

        <form onSubmit={page === 2 ? handleSubmit : (e) => { e.preventDefault(); setPage(2); }} className="space-y-6">
          <div className={`${card} rounded-2xl border shadow-sm overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                {page === 1 ? <User className="w-5 h-5 text-para-teal" /> : <Heart className="w-5 h-5 text-para-teal" />}
                <h2 className={`font-semibold ${text}`}>{page === 1 ? "Personal details" : "Health & reasons for care"}</h2>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {page === 1 && (
                <>
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
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Date of birth *</label>
                    <input
                      type="date"
                      value={data.dateOfBirth}
                      onChange={(e) => update("dateOfBirth", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Gender *</label>
                    <select
                      value={data.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      required
                    >
                      <option value="">Select</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
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
                  <p className={`text-xs ${muted}`}>At least one of phone or email is required.</p>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Emergency contact name *</label>
                    <input
                      type="text"
                      value={data.emergencyName}
                      onChange={(e) => update("emergencyName", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Emergency contact phone *</label>
                    <input
                      type="tel"
                      value={data.emergencyPhone}
                      onChange={(e) => update("emergencyPhone", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      placeholder="+1 555 000 0000"
                      required
                    />
                  </div>
                </>
              )}

              {page === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${muted} mb-1.5`}>Height *</label>
                      <input
                        type="text"
                        value={data.height}
                        onChange={(e) => update("height", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                        placeholder="e.g. 170 cm or 5 ft 7 in"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${muted} mb-1.5`}>Weight *</label>
                      <input
                        type="text"
                        value={data.weight}
                        onChange={(e) => update("weight", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                        placeholder="e.g. 70 kg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Blood group *</label>
                    <select
                      value={data.bloodGroup}
                      onChange={(e) => update("bloodGroup", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      required
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Existing medical conditions</label>
                    <textarea
                      value={data.medicalConditions}
                      onChange={(e) => update("medicalConditions", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      rows={3}
                      placeholder="e.g. Hypertension, Asthma"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-1.5`}>Current medications</label>
                    <textarea
                      value={data.currentMedications}
                      onChange={(e) => update("currentMedications", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
                      rows={3}
                      placeholder="List any medications you take regularly"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${muted} mb-2`}>Reasons for using the app</label>
                    <p className={`text-xs ${muted} mb-3`}>Select all that apply (body areas and conditions)</p>
                    <div className="space-y-3">
                      <p className={`text-xs font-medium ${text}`}>Body areas</p>
                      <div className="flex flex-wrap gap-2">
                        {REASON_BODY_AREAS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleReason(item)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                              (data.reasonsForUsingApp || []).includes(item)
                                ? "bg-para-teal text-white"
                                : dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${text} mt-4`}>Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {REASON_CONDITIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleReason(item)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                              (data.reasonsForUsingApp || []).includes(item)
                                ? "bg-para-teal text-white"
                                : dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {page === 1 ? (
              <button
                type="submit"
                disabled={!canProceedPage1}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  className={`flex-1 py-3 rounded-xl border font-medium transition ${dark ? "border-gray-600 text-gray-200 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={!canSavePage2}
                  className="flex-1 py-3 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Save profile
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
