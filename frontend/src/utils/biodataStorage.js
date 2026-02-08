// Biodata for patients - personal and health info

const BIODATA_KEY = "paratrain_biodata";
const PENDING_BIODATA_KEY = "paratrain_pending_biodata";

export const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Body areas and conditions for "reasons for using the app"
export const REASON_BODY_AREAS = [
  "Lower back",
  "Neck",
  "Mid-back",
  "Shoulder",
  "Knee",
  "Ankle",
  "Foot",
  "Hip",
  "Elbow",
  "Wrist",
  "Hand",
  "Pelvis",
  "Jaw",
  "Brain",
  "Spinal cord",
  "Peripheral nerves",
  "Vestibular system",
  "Heart",
  "Lungs",
];

export const REASON_CONDITIONS = [
  "Strains",
  "Sprains",
  "Fractures",
  "Tendonitis",
  "Arthritis",
  "Disc herniation",
  "Ligament tears",
  "Frozen shoulder",
  "Post-surgical rehab",
];

export function getDefaultBiodata() {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactPhone: "",
    contactEmail: "",
    emergencyName: "",
    emergencyPhone: "",
    height: "",
    weight: "",
    bloodGroup: "",
    medicalConditions: "",
    currentMedications: "",
    reasonsForUsingApp: [], // array of strings from REASON_BODY_AREAS + REASON_CONDITIONS
  };
}

export function loadBiodata() {
  try {
    const s = localStorage.getItem(BIODATA_KEY);
    if (s) return { ...getDefaultBiodata(), ...JSON.parse(s) };
  } catch (_) {}
  return getDefaultBiodata();
}

export function saveBiodata(data) {
  try {
    localStorage.setItem(BIODATA_KEY, JSON.stringify(data));
    clearPendingBiodata();
  } catch (_) {}
}

export function isBiodataComplete() {
  const b = loadBiodata();
  const hasPage1 =
    (b.firstName || "").trim() &&
    (b.lastName || "").trim() &&
    (b.dateOfBirth || "").trim() &&
    (b.gender || "").trim() &&
    ((b.contactPhone || "").trim() || (b.contactEmail || "").trim()) &&
    (b.emergencyName || "").trim() &&
    (b.emergencyPhone || "").trim();
  const hasPage2 =
    (b.height || "").trim() &&
    (b.weight || "").trim() &&
    (b.bloodGroup || "").trim();
  return !!(hasPage1 && hasPage2);
}

export function setPendingBiodata() {
  try {
    localStorage.setItem(PENDING_BIODATA_KEY, "1");
  } catch (_) {}
}

export function clearPendingBiodata() {
  try {
    localStorage.removeItem(PENDING_BIODATA_KEY);
  } catch (_) {}
}

export function hasPendingBiodata() {
  return localStorage.getItem(PENDING_BIODATA_KEY) === "1";
}
