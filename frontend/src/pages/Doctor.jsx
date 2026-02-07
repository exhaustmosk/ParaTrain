import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const SPECIALTIES = [
  "General Physician",
  "Physiotherapy",
  "Orthopedic",
  "Sports Medicine",
  "Rehabilitation",
  "Neurology",
  "Pain Management",
  "Internal Medicine",
];

const HOSPITALS = [
  "City Medical Center",
  "Care Plus Hospital",
  "Metro Health",
  "Sunrise Clinic",
  "Prime Care",
  "Unity Hospital",
  "Wellness Medical",
  "First Care Clinic",
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildDoctors() {
  const firstNames = ["James", "Sarah", "Michael", "Emily", "David", "Priya", "Robert", "Anita", "Chris", "Lisa"];
  const lastNames = ["Wilson", "Chen", "Kumar", "Patel", "Brown", "Sharma", "Lee", "Johnson", "Garcia", "Singh"];
  const doctors = [];
  for (let i = 0; i < 10; i++) {
    const first = firstNames[i];
    const last = lastNames[i];
    const name = `${first} ${last}`;
    doctors.push({
      id: i + 1,
      name,
      initials: `${first[0]}${last[0]}`,
      specialty: SPECIALTIES[i % SPECIALTIES.length],
      hospital: HOSPITALS[i % HOSPITALS.length],
      experience: `${randomBetween(5, 20)} years`,
      rating: (3.8 + Math.random() * 1.2).toFixed(1),
      price: randomBetween(500, 1000),
      bio: `Dr. ${name} specializes in ${SPECIALTIES[i % SPECIALTIES.length].toLowerCase()} with experience at ${HOSPITALS[i % HOSPITALS.length]}. Available for consultations and follow-up care.`,
    });
  }
  return doctors;
}

const DOCTORS = buildDoctors();

function Avatar({ name, initials, size = "w-14 h-14" }) {
  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br from-para-teal to-para-navy flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function Doctor() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-para-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Connect</h1>
        </div>

        <p className="text-gray-500 mb-6">Choose a doctor for consultation. Click a row to view full profile.</p>

        <div className="space-y-3">
          {DOCTORS.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setSelected(doc)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-para-teal hover:shadow-md transition text-left"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                <p className="text-sm text-para-teal">{doc.specialty}</p>
                <p className="text-xs text-gray-500 mt-0.5">{doc.hospital} · {doc.experience}</p>
              </div>
              <span className="font-bold text-gray-900 flex-shrink-0">${doc.price}</span>
              <Avatar name={doc.name} initials={doc.initials} />
            </button>
          ))}
        </div>
      </div>

      {/* Popup */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelected(null)} aria-hidden />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={selected.name} initials={selected.initials} size="w-16 h-16" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-para-teal font-medium">{selected.specialty}</p>
                    <p className="text-sm text-gray-500">{selected.hospital}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-gray-600 text-sm mb-4">{selected.bio}</p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Experience</dt>
                    <dd className="font-medium">{selected.experience}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Rating</dt>
                    <dd className="font-medium">{selected.rating} / 5</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Consultation</dt>
                    <dd className="font-bold text-para-teal">${selected.price}</dd>
                  </div>
                </dl>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
