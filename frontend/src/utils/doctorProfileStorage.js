// Doctor profile/settings - for doctors only (not called biodata)

const DOCTOR_PROFILE_KEY = "paratrain_doctor_profile";
const PENDING_DOCTOR_PROFILE_KEY = "paratrain_pending_doctor_profile";

export const SPECIALTIES = [
  "General Physician",
  "Physiotherapy",
  "Orthopedic",
  "Sports Medicine",
  "Rehabilitation",
  "Neurology",
  "Pain Management",
  "Internal Medicine",
];

export function getDefaultDoctorProfile() {
  return {
    firstName: "",
    lastName: "",
    title: "Dr.",
    specialty: "",
    qualifications: "",
    trainingAndCertifications: "",
    hospitalOrClinic: "",
    yearsOfExperience: "",
    contactEmail: "",
    contactPhone: "",
    bio: "",
    licenseNumber: "",
  };
}

export function loadDoctorProfile() {
  try {
    const s = localStorage.getItem(DOCTOR_PROFILE_KEY);
    if (s) return { ...getDefaultDoctorProfile(), ...JSON.parse(s) };
  } catch (_) {}
  return getDefaultDoctorProfile();
}

export function saveDoctorProfile(data) {
  try {
    localStorage.setItem(DOCTOR_PROFILE_KEY, JSON.stringify(data));
    clearPendingDoctorProfile();
  } catch (_) {}
}

export function isDoctorProfileComplete() {
  const p = loadDoctorProfile();
  return !!(
    (p.firstName || "").trim() &&
    (p.lastName || "").trim() &&
    (p.specialty || "").trim() &&
    (p.qualifications || "").trim() &&
    (p.hospitalOrClinic || "").trim() &&
    ((p.contactEmail || "").trim() || (p.contactPhone || "").trim())
  );
}

export function setPendingDoctorProfile() {
  try {
    localStorage.setItem(PENDING_DOCTOR_PROFILE_KEY, "1");
  } catch (_) {}
}

export function clearPendingDoctorProfile() {
  try {
    localStorage.removeItem(PENDING_DOCTOR_PROFILE_KEY);
  } catch (_) {}
}

export function hasPendingDoctorProfile() {
  return localStorage.getItem(PENDING_DOCTOR_PROFILE_KEY) === "1";
}
