// Doctor dashboard data - patients, appointments, revenue

const DOCTOR_STORAGE_KEY = "paratrain_doctor_data";

const DEFAULT_PATIENTS = [
  { id: "p1", name: "John Smith", email: "john@email.com", phone: "+1 555-0101", lastVisit: "2025-02-05", status: "Active", training: "Arms", notes: "" },
  { id: "p2", name: "Sarah Chen", email: "sarah@email.com", phone: "+1 555-0102", lastVisit: "2025-01-31", status: "Active", training: "Full Body", notes: "" },
  { id: "p3", name: "Michael Brown", email: "michael@email.com", phone: "+1 555-0103", lastVisit: "2025-02-04", status: "Active", training: "Legs", notes: "" },
  { id: "p4", name: "Emily Davis", email: "emily@email.com", phone: "+1 555-0104", lastVisit: "2025-02-02", status: "Active", training: "Wrists", notes: "" },
  { id: "p5", name: "Priya Patel", email: "priya@email.com", phone: "+1 555-0105", lastVisit: "2025-02-06", status: "Active", training: "Arms", notes: "" },
  { id: "p6", name: "David Wilson", email: "david@email.com", phone: "+1 555-0106", lastVisit: "2025-01-28", status: "Active", training: "Legs", notes: "" },
  { id: "p7", name: "Lisa Martinez", email: "lisa@email.com", phone: "+1 555-0107", lastVisit: "2025-02-01", status: "Active", training: "Full Body", notes: "" },
];

const DEFAULT_APPOINTMENTS = [
  { id: "a1", patientId: "p1", patientName: "John Smith", time: "10:00", type: "Follow-up", status: "scheduled", date: getToday() },
  { id: "a2", patientId: "p5", patientName: "Priya Patel", time: "11:30", type: "Initial", status: "scheduled", date: getToday() },
  { id: "a3", patientId: "p4", patientName: "Emily Davis", time: "14:00", type: "Checkup", status: "scheduled", date: getToday() },
  { id: "a4", patientId: "p2", patientName: "Sarah Chen", time: "15:30", type: "Follow-up", status: "scheduled", date: getToday() },
  { id: "a5", patientId: "p3", patientName: "Michael Brown", time: "16:00", type: "Follow-up", status: "scheduled", date: getToday() },
];

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDefaultData() {
  return {
    patients: DEFAULT_PATIENTS,
    appointments: DEFAULT_APPOINTMENTS,
    revenue: [
      { id: "r1", amount: 150, patientId: "p1", date: getToday(), type: "Consultation" },
      { id: "r2", amount: 200, patientId: "p5", date: getToday(), type: "Initial" },
    ],
    revenueHistory: [],
  };
}

export function loadDoctorData() {
  try {
    const s = localStorage.getItem(DOCTOR_STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      return { ...getDefaultData(), ...parsed, patients: parsed.patients ?? getDefaultData().patients, appointments: parsed.appointments ?? getDefaultData().appointments };
    }
  } catch (_) {}
  return getDefaultData();
}

export function saveDoctorData(data) {
  try {
    localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

export function addPatient(patient) {
  const data = loadDoctorData();
  const id = "p" + Date.now();
  const created = { ...patient, id, lastVisit: new Date().toISOString().slice(0, 10), status: "Active", notes: patient.notes || "" };
  data.patients = [...(data.patients || []), created];
  saveDoctorData(data);
  return created;
}

export function updatePatient(id, updates) {
  const data = loadDoctorData();
  data.patients = (data.patients || []).map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveDoctorData(data);
}

export function deletePatient(id) {
  const data = loadDoctorData();
  data.patients = (data.patients || []).filter((p) => p.id !== id);
  data.appointments = (data.appointments || []).filter((a) => a.patientId !== id);
  saveDoctorData(data);
}

export function addAppointment(apt) {
  const data = loadDoctorData();
  const id = "a" + Date.now();
  const patient = (data.patients || []).find((p) => p.id === apt.patientId);
  const created = { ...apt, id, patientName: patient?.name ?? apt.patientName, status: "scheduled", date: apt.date || getToday() };
  data.appointments = [...(data.appointments || []), created];
  saveDoctorData(data);
  return created;
}

export function updateAppointment(id, updates) {
  const data = loadDoctorData();
  data.appointments = (data.appointments || []).map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveDoctorData(data);
}

export function completeAppointment(id, amount = 150) {
  const data = loadDoctorData();
  const apt = (data.appointments || []).find((a) => a.id === id);
  if (apt) {
    data.revenue = data.revenue || [];
    data.revenue.push({
      id: "r" + Date.now(),
      amount,
      patientId: apt.patientId,
      patientName: apt.patientName,
      date: getToday(),
      type: apt.type || "Consultation",
    });
    data.appointments = (data.appointments || []).filter((a) => a.id !== id);
    saveDoctorData(data);
  }
}

export function deleteAppointment(id) {
  const data = loadDoctorData();
  data.appointments = (data.appointments || []).filter((a) => a.id !== id);
  saveDoctorData(data);
}

export function getTotalRevenue(data) {
  const rev = data?.revenue || [];
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  return rev.reduce((sum, r) => {
    const d = new Date(r.date);
    if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) return sum + (r.amount || 0);
    return sum;
  }, 0);
}

export function getTodaysAppointments(data) {
  const today = getToday();
  return (data?.appointments || []).filter((a) => a.date === today && a.status === "scheduled").sort((a, b) => a.time.localeCompare(b.time));
}

export function formatLastVisit(dateStr) {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} week(s) ago`;
  return `${Math.floor(diff / 30)} month(s) ago`;
}
