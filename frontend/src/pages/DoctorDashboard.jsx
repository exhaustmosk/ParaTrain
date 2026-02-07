import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  Settings,
  Phone,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Check,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  loadDoctorData,
  saveDoctorData,
  addPatient,
  updatePatient,
  deletePatient,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  completeAppointment,
  getTotalRevenue,
  getTodaysAppointments,
  formatLastVisit,
} from "../utils/doctorStorage";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dark } = useTheme();

  const [data, setData] = useState(loadDoctorData());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

  const refresh = useCallback(() => setData(loadDoctorData()), []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const patients = data.patients || [];
  const todaysAppointments = getTodaysAppointments(data);
  const totalRevenue = getTotalRevenue(data);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Patients",
      value: String(patients.length),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-500",
    },
    {
      label: "Today's Appointments",
      value: String(todaysAppointments.length),
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-500",
    },
    {
      label: "Revenue (This Month)",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-500",
    },
  ];

  const bgMain = dark ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-white to-blue-50/30";
  const cardBg = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm";
  const textPrimary = dark ? "text-gray-100" : "text-gray-900";
  const textMuted = dark ? "text-gray-400" : "text-gray-500";

  const handleAddPatient = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const patient = {
      name: fd.get("name")?.trim() || "",
      email: fd.get("email")?.trim() || "",
      phone: fd.get("phone")?.trim() || "",
      training: fd.get("training") || "Arms",
      notes: fd.get("notes")?.trim() || "",
    };
    if (!patient.name) return;
    addPatient(patient);
    refresh();
    setShowAddPatient(false);
  };

  const handleUpdatePatient = (e) => {
    e.preventDefault();
    if (!editPatient?.id) return;
    const fd = new FormData(e.target);
    updatePatient(editPatient.id, {
      name: fd.get("name")?.trim() || editPatient.name,
      email: fd.get("email")?.trim() || editPatient.email,
      phone: fd.get("phone")?.trim() || editPatient.phone,
      training: fd.get("training") || editPatient.training,
      notes: fd.get("notes")?.trim() || editPatient.notes,
    });
    refresh();
    setEditPatient(null);
    setSelectedPatient(null);
  };

  const handleDeletePatient = (id) => {
    if (window.confirm("Delete this patient? This will also remove their appointments.")) {
      deletePatient(id);
      refresh();
      setSelectedPatient(null);
      setEditPatient(null);
    }
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const patientId = fd.get("patientId");
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;
    addAppointment({
      patientId,
      patientName: patient.name,
      time: fd.get("time") || "10:00",
      type: fd.get("type") || "Follow-up",
      date: fd.get("date") || new Date().toISOString().slice(0, 10),
    });
    refresh();
    setShowAddAppointment(false);
  };

  const handleCompleteApt = (apt, amount) => {
    completeAppointment(apt.id, amount);
    refresh();
    setShowCompleteModal(null);
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Cancel this appointment?")) {
      deleteAppointment(id);
      refresh();
    }
  };

  return (
    <div className={`min-h-screen ${bgMain} transition-colors`}>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} tracking-tight`}>
            Welcome, Dr. {user}
          </h1>
          <p className={`${textMuted} mt-1 text-sm md:text-base`}>
            Manage your patients and appointments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`rounded-2xl border ${cardBg} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-fadeIn`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${s.color} opacity-60`} />
              </div>
              <p className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>{s.value}</p>
              <p className={`text-sm ${textMuted} mt-0.5`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
          {/* Left: Patients list */}
          <div className="xl:col-span-7">
            <div className={`rounded-2xl border ${cardBg} overflow-hidden animate-fadeIn`}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                <h2 className={`text-lg font-semibold ${textPrimary}`}>Patients</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-9 pr-4 py-2 rounded-xl border text-sm w-48 ${dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`px-3 py-2 rounded-xl border text-sm ${dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                  >
                    <option value="all">All status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddPatient(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-para-teal text-white text-sm font-medium hover:bg-para-teal-dark transition"
                  >
                    <Plus className="w-4 h-4" /> Add Patient
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[480px] overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className={`px-6 py-12 text-center ${textMuted}`}>
                    {searchQuery || filterStatus !== "all" ? "No patients match your filters" : "No patients yet. Add your first patient above."}
                  </div>
                ) : (
                  filteredPatients.map((p, i) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition cursor-pointer animate-fadeIn group`}
                      style={{ animationDelay: `${(i + 3) * 80}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-para-teal to-para-navy flex items-center justify-center text-white font-semibold text-sm">
                          {p.name?.split(" ").map((n) => n[0]).join("") || "?"}
                        </div>
                        <div>
                          <p className={`font-medium ${textPrimary}`}>{p.name}</p>
                          <p className={`text-xs ${textMuted}`}>Last visit: {formatLastVisit(p.lastVisit)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-para-teal bg-para-teal/10 px-2 py-1 rounded-full">{p.training || "Arms"}</span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{p.status || "Active"}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Appointments + Quick actions */}
          <div className="xl:col-span-5 space-y-6">
            {/* Appointments queue */}
            <div className={`rounded-2xl border ${cardBg} overflow-hidden animate-fadeIn`}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className={`text-lg font-semibold ${textPrimary}`}>Today's Schedule</h2>
                  <p className={`text-xs ${textMuted}`}>Next checkups & appointments</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAppointment(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-para-teal/10 text-para-teal text-sm font-medium hover:bg-para-teal/20 transition"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
                {todaysAppointments.length === 0 ? (
                  <div className={`py-8 text-center ${textMuted} text-sm`}>No appointments today</div>
                ) : (
                  todaysAppointments.map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${dark ? "bg-gray-700/50" : "bg-gray-50/80"} hover:bg-para-teal/5 transition`}
                    >
                      <div>
                        <p className={`font-medium ${textPrimary}`}>{a.patientName}</p>
                        <p className={`text-xs ${textMuted}`}>{a.time} · {a.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCompleteModal(a);
                          }}
                          className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAppointment(a.id);
                          }}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className={`rounded-2xl border ${cardBg} p-6 animate-fadeIn`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPatient(true)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-para-teal hover:bg-para-teal/5 transition"
                >
                  <Users className="w-5 h-5 text-para-teal" />
                  <span className="text-sm font-medium">Add Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAppointment(true)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-para-teal hover:bg-para-teal/5 transition"
                >
                  <Calendar className="w-5 h-5 text-para-teal" />
                  <span className="text-sm font-medium">Add Appointment</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/settings")}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-para-teal hover:bg-para-teal/5 transition"
                >
                  <Settings className="w-5 h-5 text-para-teal" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/support")}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-para-teal hover:bg-para-teal/5 transition"
                >
                  <Phone className="w-5 h-5 text-para-teal" />
                  <span className="text-sm font-medium">Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <Modal title="Add New Patient" onClose={() => setShowAddPatient(false)} dark={dark}>
          <form onSubmit={handleAddPatient} className="space-y-4">
            <Input label="Full Name" name="name" required placeholder="John Smith" dark={dark} />
            <Input label="Email" name="email" type="email" placeholder="john@email.com" dark={dark} />
            <Input label="Phone" name="phone" placeholder="+1 555-0100" dark={dark} />
            <Select label="Training Focus" name="training" options={["Arms", "Wrists", "Legs", "Full Body"]} dark={dark} />
            <Textarea label="Notes" name="notes" placeholder="Optional notes..." dark={dark} />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddPatient(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark">
                Add Patient
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Patient Modal */}
      {editPatient && (
        <Modal title="Edit Patient" onClose={() => { setEditPatient(null); setSelectedPatient(null); }} dark={dark}>
          <form onSubmit={handleUpdatePatient} className="space-y-4">
            <Input label="Full Name" name="name" defaultValue={editPatient.name} required dark={dark} />
            <Input label="Email" name="email" type="email" defaultValue={editPatient.email} dark={dark} />
            <Input label="Phone" name="phone" defaultValue={editPatient.phone} dark={dark} />
            <Select label="Training Focus" name="training" options={["Arms", "Wrists", "Legs", "Full Body"]} defaultValue={editPatient.training} dark={dark} />
            <Textarea label="Notes" name="notes" defaultValue={editPatient.notes} dark={dark} />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => handleDeletePatient(editPatient.id)} className="flex-1 py-2.5 rounded-xl border border-red-500 text-red-500 font-medium hover:bg-red-500/10">
                Delete
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <Modal title="Add Appointment" onClose={() => setShowAddAppointment(false)} dark={dark}>
          <form onSubmit={handleAddAppointment} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textMuted} mb-1`}>Patient</label>
              <select
                name="patientId"
                required
                className={`w-full px-4 py-2.5 rounded-xl border ${dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}
              >
                <option value="">Select patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <Input label="Date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} dark={dark} />
            <Input label="Time" name="time" type="time" defaultValue="10:00" dark={dark} />
            <Select label="Type" name="type" options={["Initial", "Follow-up", "Checkup", "Consultation"]} dark={dark} />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddAppointment(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark">
                Add Appointment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && !editPatient && (
        <Modal title={selectedPatient.name} onClose={() => setSelectedPatient(null)} dark={dark}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-para-teal to-para-navy flex items-center justify-center text-white font-semibold text-lg">
                {selectedPatient.name?.split(" ").map((n) => n[0]).join("") || "?"}
              </div>
              <div>
                <p className={`font-medium ${textPrimary}`}>{selectedPatient.status || "Active"}</p>
                <p className={`text-sm ${textMuted}`}>Last visit: {formatLastVisit(selectedPatient.lastVisit)}</p>
              </div>
            </div>
            <div className="space-y-2">
              {selectedPatient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-para-teal" />
                  <span className="text-sm">{selectedPatient.email}</span>
                </div>
              )}
              {selectedPatient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-para-teal" />
                  <span className="text-sm">{selectedPatient.phone}</span>
                </div>
              )}
              {selectedPatient.training && (
                <span className="inline-block text-xs font-medium text-para-teal bg-para-teal/10 px-2 py-1 rounded-full">{selectedPatient.training}</span>
              )}
            </div>
            {selectedPatient.notes && (
              <div>
                <p className={`text-xs font-medium ${textMuted} mb-1`}>Notes</p>
                <p className={`text-sm ${textPrimary}`}>{selectedPatient.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditPatient(selectedPatient)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-para-teal text-para-teal font-medium hover:bg-para-teal/5"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddAppointment(true);
                  setSelectedPatient(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-para-teal text-white font-medium hover:bg-para-teal-dark"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Complete Appointment Modal */}
      {showCompleteModal && (
        <Modal title="Complete Appointment" onClose={() => setShowCompleteModal(null)} dark={dark}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleCompleteApt(showCompleteModal, Number(fd.get("amount")) || 150);
            }}
            className="space-y-4"
          >
            <p className={`text-sm ${textMuted}`}>
              Mark <strong className={textPrimary}>{showCompleteModal.patientName}</strong> as completed and record payment.
            </p>
            <Input label="Amount ($)" name="amount" type="number" defaultValue="150" min="0" step="10" dark={dark} />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowCompleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium">
                Cancel
              </button>
              <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700">
                <Check className="w-4 h-4" /> Complete
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children, dark }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`${dark ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`px-6 py-4 border-b ${dark ? "border-gray-700" : "border-gray-100"} flex justify-between items-center`}>
            <h2 className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{title}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}

function Input({ label, name, type = "text", required, placeholder, defaultValue, min, step, dark }) {
  const textMuted = dark ? "text-gray-400" : "text-gray-500";
  const inputClass = dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  return (
    <div>
      <label className={`block text-sm font-medium ${textMuted} mb-1`}>{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        step={step}
        className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
      />
    </div>
  );
}

function Textarea({ label, name, placeholder, defaultValue, dark }) {
  const textMuted = dark ? "text-gray-400" : "text-gray-500";
  const inputClass = dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  return (
    <div>
      <label className={`block text-sm font-medium ${textMuted} mb-1`}>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={3}
        className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}
      />
    </div>
  );
}

function Select({ label, name, options, defaultValue, dark }) {
  const textMuted = dark ? "text-gray-400" : "text-gray-500";
  const inputClass = dark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  return (
    <div>
      <label className={`block text-sm font-medium ${textMuted} mb-1`}>{label}</label>
      <select name={name} defaultValue={defaultValue} className={`w-full px-4 py-2.5 rounded-xl border ${inputClass}`}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
