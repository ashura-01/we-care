import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { hospitalController } from "../../api/hospitalController";

const HOSPITAL_TYPES = ["General", "Specialized", "Clinic", "Diagnostic", "Emergency"];

const emptyForm = {
  name: "",
  address: "",
  city: "",
  phone: "",
  email: "",
  type: "General",
  image: "",
  description: "",
};

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-[20px] p-5 text-white shadow-md ${color}`}>
    <p className="text-[13px] font-semibold opacity-80">{label}</p>
    <p className="text-[32px] font-bold mt-1">{value ?? "—"}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  // Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Doctors
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // Hospitals
  const [hospitals, setHospitals] = useState([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [hospitalForm, setHospitalForm] = useState(emptyForm);
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [hospitalError, setHospitalError] = useState("");
  const [hospitalSuccess, setHospitalSuccess] = useState("");
  const [hospitalSaving, setHospitalSaving] = useState(false);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        if (res.data.success) setStats(res.data.stats);
      } catch (e) {
        // ignore
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch doctors
  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      const res = await api.get("/admin/doctors?limit=50");
      if (res.data.success) setDoctors(res.data.doctors || []);
    } catch (e) {}
    setDoctorsLoading(false);
  };

  // Fetch hospitals
  const fetchHospitals = async () => {
    setHospitalsLoading(true);
    const res = await hospitalController.getAllHospitals({ limit: 100 });
    if (res.success) setHospitals(res.data || []);
    setHospitalsLoading(false);
  };

  useEffect(() => {
    if (tab === "doctors") fetchDoctors();
    if (tab === "hospitals") fetchHospitals();
  }, [tab]);

  // Doctor verify/unverify/delete
  const verifyDoctor = async (id, verified) => {
    const endpoint = verified ? `/admin/doctors/${id}/unverify` : `/admin/doctors/${id}/verify`;
    await api.put(endpoint);
    fetchDoctors();
  };
  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await api.delete(`/admin/doctors/${id}`);
    fetchDoctors();
  };

  // Hospital form handlers
  const openAddHospital = () => {
    setHospitalForm(emptyForm);
    setEditingHospitalId(null);
    setHospitalError("");
    setHospitalSuccess("");
    setShowHospitalForm(true);
  };

  const openEditHospital = (h) => {
    setHospitalForm({
      name: h.name || "",
      address: h.address || "",
      city: h.city || "",
      phone: h.phone || "",
      email: h.email || "",
      type: h.type || "General",
      image: h.image || "",
      description: h.description || "",
    });
    setEditingHospitalId(h._id);
    setHospitalError("");
    setHospitalSuccess("");
    setShowHospitalForm(true);
  };

  const closeHospitalForm = () => {
    setShowHospitalForm(false);
    setHospitalError("");
    setHospitalSuccess("");
    setEditingHospitalId(null);
  };

  const handleHospitalFormChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    setHospitalError("");
    setHospitalSuccess("");

    if (!hospitalForm.name || !hospitalForm.address || !hospitalForm.city) {
      setHospitalError("Name, address, and city are required.");
      return;
    }

    setHospitalSaving(true);
    const res = editingHospitalId
      ? await hospitalController.updateHospital(editingHospitalId, hospitalForm)
      : await hospitalController.addHospital(hospitalForm);

    if (res.success) {
      setHospitalSuccess(editingHospitalId ? "Hospital updated!" : "Hospital added!");
      fetchHospitals();
      setTimeout(() => closeHospitalForm(), 1200);
    } else {
      setHospitalError(res.message || "Operation failed.");
    }
    setHospitalSaving(false);
  };

  const handleDeleteHospital = async (id) => {
    if (!window.confirm("Delete this hospital?")) return;
    await hospitalController.deleteHospital(id);
    fetchHospitals();
  };

  const inputCls =
    "w-full rounded-[12px] border border-[#b8d9d3] bg-white px-3 py-2.5 text-[#1d5f71] outline-none focus:border-[#00887f] transition-all text-[14px]";

  const tabBtn = (id, label) => (
    <button
      onClick={() => setTab(id)}
      className={`px-5 py-2.5 rounded-[12px] font-bold text-[14px] transition-colors ${
        tab === id
          ? "bg-[#2C6975] text-white shadow"
          : "text-[#2C6975] hover:bg-[#e8f4f1]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-20">
      {/* Top Bar */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-[22px] font-bold text-[#1d5f71]">Admin Dashboard</h1>
        <button
          onClick={() => navigate("/")}
          className="text-[14px] text-[#4f7f89] font-semibold hover:text-[#1d5f71] transition-colors"
        >
          ← Back to Site
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {tabBtn("overview", "Overview")}
          {tabBtn("doctors", "Doctors")}
          {tabBtn("hospitals", "Hospitals")}
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {tab === "overview" && (
          <div>
            {statsLoading ? (
              <div className="flex justify-center h-40 items-center">
                <div className="w-10 h-10 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <StatCard label="Total Users" value={stats?.totalUsers} color="bg-gradient-to-br from-[#2C6975] to-[#458b99]" />
                <StatCard label="Total Doctors" value={stats?.totalDoctors} color="bg-gradient-to-br from-[#68B2A0] to-[#3a8a78]" />
                <StatCard label="Verified Doctors" value={stats?.verifiedDoctors} color="bg-gradient-to-br from-[#4caf8a] to-[#2d7a5f]" />
                <StatCard label="Pending Verification" value={stats?.pendingDoctors} color="bg-gradient-to-br from-[#e6a817] to-[#b87e0a]" />
                <StatCard label="Admins" value={stats?.totalAdmins} color="bg-gradient-to-br from-[#7b5ea7] to-[#553d7a]" />
                <StatCard label="Active Users" value={stats?.activeUsers} color="bg-gradient-to-br from-[#e07060] to-[#b04535]" />
              </div>
            )}
          </div>
        )}

        {/* ===== DOCTORS TAB ===== */}
        {tab === "doctors" && (
          <div>
            <h2 className="text-[20px] font-bold text-[#1d5f71] mb-5">Manage Doctors</h2>
            {doctorsLoading ? (
              <div className="flex justify-center h-40 items-center">
                <div className="w-10 h-10 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-[20px] shadow-md overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-[#e8f4f1] text-[#2C6975]">
                      <th className="px-5 py-3 text-left font-bold">Doctor</th>
                      <th className="px-5 py-3 text-left font-bold">Specialization</th>
                      <th className="px-5 py-3 text-left font-bold">Hospital</th>
                      <th className="px-5 py-3 text-left font-bold">Status</th>
                      <th className="px-5 py-3 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-[#7a9aa2]">
                          No doctors found.
                        </td>
                      </tr>
                    ) : (
                      doctors.map((doc) => (
                        <tr key={doc._id} className="border-t border-[#e8f4f1] hover:bg-[#f8fdfc] transition-colors">
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-semibold text-[#1d5f71]">
                                {doc.userId?.name || "N/A"}
                              </p>
                              <p className="text-[12px] text-[#7a9aa2]">{doc.userId?.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-[#4f7f89]">{doc.specialization}</td>
                          <td className="px-5 py-3 text-[#4f7f89]">{doc.hospital}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                                doc.verified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {doc.verified ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => verifyDoctor(doc._id, doc.verified)}
                                className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-colors ${
                                  doc.verified
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                {doc.verified ? "Unverify" : "Verify"}
                              </button>
                              <button
                                onClick={() => deleteDoctor(doc._id)}
                                className="px-3 py-1.5 rounded-[10px] text-[12px] font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== HOSPITALS TAB ===== */}
        {tab === "hospitals" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[20px] font-bold text-[#1d5f71]">Manage Hospitals</h2>
              <button
                onClick={openAddHospital}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#2C6975] text-white font-bold text-[14px] hover:bg-[#1f4655] transition-colors shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                Add Hospital
              </button>
            </div>

            {/* Hospital Form Modal */}
            {showHospitalForm && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[20px] font-bold text-[#1d5f71]">
                      {editingHospitalId ? "Edit Hospital" : "Add New Hospital"}
                    </h3>
                    <button
                      onClick={closeHospitalForm}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {hospitalError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-[12px] px-4 py-3 text-red-600 text-[13px] font-medium">
                      {hospitalError}
                    </div>
                  )}
                  {hospitalSuccess && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-[12px] px-4 py-3 text-green-700 text-[13px] font-medium">
                      {hospitalSuccess}
                    </div>
                  )}

                  <form onSubmit={handleHospitalSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Hospital Name *</label>
                        <input name="name" value={hospitalForm.name} onChange={handleHospitalFormChange} placeholder="e.g. City General Hospital" className={inputCls} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Address *</label>
                        <input name="address" value={hospitalForm.address} onChange={handleHospitalFormChange} placeholder="Street address" className={inputCls} />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">City *</label>
                        <input name="city" value={hospitalForm.city} onChange={handleHospitalFormChange} placeholder="City" className={inputCls} />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Type</label>
                        <select name="type" value={hospitalForm.type} onChange={handleHospitalFormChange} className={inputCls}>
                          {HOSPITAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Phone</label>
                        <input name="phone" value={hospitalForm.phone} onChange={handleHospitalFormChange} placeholder="+880..." className={inputCls} />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Email</label>
                        <input name="email" type="email" value={hospitalForm.email} onChange={handleHospitalFormChange} placeholder="hospital@example.com" className={inputCls} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Image URL</label>
                        <input name="image" value={hospitalForm.image} onChange={handleHospitalFormChange} placeholder="https://..." className={inputCls} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-[13px] font-bold text-[#2C6975]">Description</label>
                        <textarea name="description" value={hospitalForm.description} onChange={handleHospitalFormChange} rows={3} placeholder="Brief description of the hospital..." className={inputCls} />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={hospitalSaving}
                        className={`flex-1 rounded-[12px] bg-[#2C6975] text-white py-3 font-bold text-[14px] hover:bg-[#1f4655] transition-colors ${hospitalSaving ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        {hospitalSaving ? "Saving..." : editingHospitalId ? "Update Hospital" : "Add Hospital"}
                      </button>
                      <button
                        type="button"
                        onClick={closeHospitalForm}
                        className="px-5 py-3 rounded-[12px] border border-[#b8d9d3] text-[#4f7f89] font-bold text-[14px] hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Hospitals List */}
            {hospitalsLoading ? (
              <div className="flex justify-center h-40 items-center">
                <div className="w-10 h-10 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hospitals.length === 0 ? (
              <div className="bg-white rounded-[20px] shadow-md p-12 text-center">
                <p className="text-[#7a9aa2] text-[16px] font-medium mb-4">No hospitals added yet.</p>
                <button
                  onClick={openAddHospital}
                  className="px-6 py-3 rounded-[12px] bg-[#2C6975] text-white font-bold hover:bg-[#1f4655] transition-colors"
                >
                  Add First Hospital
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[20px] shadow-md overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-[#e8f4f1] text-[#2C6975]">
                      <th className="px-5 py-3 text-left font-bold">Name</th>
                      <th className="px-5 py-3 text-left font-bold">City</th>
                      <th className="px-5 py-3 text-left font-bold">Type</th>
                      <th className="px-5 py-3 text-left font-bold">Phone</th>
                      <th className="px-5 py-3 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((h) => (
                      <tr key={h._id} className="border-t border-[#e8f4f1] hover:bg-[#f8fdfc] transition-colors">
                        <td className="px-5 py-3 font-semibold text-[#1d5f71]">{h.name}</td>
                        <td className="px-5 py-3 text-[#4f7f89]">{h.city}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 rounded-full bg-[#e8f4f1] text-[#2C6975] text-[11px] font-bold">
                            {h.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#4f7f89]">{h.phone || "—"}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditHospital(h)}
                              className="px-3 py-1.5 rounded-[10px] text-[12px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteHospital(h._id)}
                              className="px-3 py-1.5 rounded-[10px] text-[12px] font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
