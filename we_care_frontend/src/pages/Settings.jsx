import React, { useEffect, useState } from "react";
import LeafDecor from "../components/LeafDecor";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../contexts/AuthContext";
import { doctorController } from "../api/doctorController";
import { hospitalController } from "../api/hospitalController";

const Settings = () => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalNames, setHospitalNames] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const res = await hospitalController.getHospitalNames();
      if (res.success) setHospitalNames(res.data || []);
    };
    fetchHospitals();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    bloodgroup: "",
    role: "",
    specialization: "",
    experience: "",
    hospital: "",
    fees: "",
    profilePicture: "",
    profilePictureFile: null,
  });

  const isDoctor =
    (user?.role || localStorage.getItem("userRole")) === "doctor";

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user?.user?.name || user?.name || "",
        email: user?.user?.email || user?.email || "",
        phone: user?.user?.phone || user?.phone || "",
        address: user?.address || "",
        gender: user?.gender || "",
        bloodgroup: user?.bloodgroup || "",
        role: user?.user?.role || user?.role || localStorage.getItem("userRole") || "",
        specialization: user?.specialization || "",
        experience: user?.experience || "",
        hospital: user?.hospital || "",
        fees: user?.fees || "",
        profilePicture: user?.profileImage || user?.profilePicture || user?.photoURL || "",
        profilePictureFile: null,
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: imageUrl,
        profilePictureFile: file,
      }));
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    try {
      const data = await doctorController.updateDoctorProfile(formData, isDoctor);

      if (data.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        
        if (data.doctor?.profileImage) {
          setFormData((prev) => ({
            ...prev,
            profilePicture: data.doctor.profileImage,
            profilePictureFile: null,
          }));
        }
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch {
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const inputClassName = `w-full rounded-[16px] px-4 py-3 outline-none transition-all ${
    isEditing
      ? "border border-[#00887f]/20 bg-white/90 text-[#1d5f71] placeholder:text-[#7a9aa2] focus:border-[#00887f]"
      : "border border-transparent bg-white/40 text-[#4f7f89] cursor-not-allowed"
  }`;

  // Helper function to get profile image URL
  const getProfileImageUrl = () => {
    if (formData.profilePicture) {
      return formData.profilePicture;
    }
    // Fallback to UI Avatars API
    const userName = formData.name || user?.name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=68B2A0&color=fff`;
  };

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-20 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute left-[-2%] top-[-2%] z-[0] w-[180px] -rotate-12 pointer-events-none opacity-80">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>
      <div className="absolute right-[-2%] bottom-[-5%] z-[0] w-[220px] rotate-[210deg] pointer-events-none opacity-60">
        <LeafDecor style={{ "--fill-0": "#003a46" }} />
      </div>
      <div className="absolute left-[-3%] top-[45%] z-[0] w-[160px] rotate-[20deg] pointer-events-none opacity-50">
        <LeafDecor style={{ "--fill-0": "#2d6a4f" }} />
      </div>
      <div className="absolute right-[5%] top-[12%] z-[0] w-[120px] rotate-[160deg] pointer-events-none opacity-60">
        <LeafDecor style={{ "--fill-0": "#00887f" }} />
      </div>
      <div className="absolute left-[50%] top-[35%] -translate-x-1/2 z-[0] w-[140px] rotate-[45deg] pointer-events-none opacity-40">
        <LeafDecor style={{ "--fill-0": "#00887f" }} />
      </div>
      <div className="absolute left-[40%] top-[60%] z-[0] w-[180px] rotate-[90deg] pointer-events-none opacity-20">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>

      <section className="relative z-[10] pt-[60px]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-[clamp(28px,4vw,42px)] font-bold text-[#1d5f71]">
              Settings
            </h1>
            <p className="mt-2 text-[15px] font-semibold text-[#4f7f89]">
              Manage your profile information and account settings.
            </p>
          </div>

          <GlassCard className="mb-8 rounded-[32px] border-white/80 bg-white/60 px-5 py-6 shadow-xl backdrop-blur-xl md:px-8 md:py-8">
            
            {/* Header with Edit Button */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[24px] font-bold text-[#1d5f71]">
                  {isDoctor ? "Doctor Profile Settings" : "Profile Settings"}
                </h2>
                <p className="mt-1 text-[14px] font-medium text-[#4f7f89]">
                  {isEditing
                    ? "Update your details below and click Save."
                    : "Your current profile information."}
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-[14px] border border-[#00887f] bg-transparent px-5 py-2.5 text-[14px] font-bold text-[#00887f] transition-all hover:bg-[#00887f] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Picture Section */}
            {isDoctor && (
              <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white/80 shadow-md">
                  <img
                    src={getProfileImageUrl()}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                {isEditing && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-picture-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="inline-block cursor-pointer rounded-[14px] border border-[#00887f] bg-transparent px-5 py-2.5 text-[14px] font-bold text-[#00887f] transition-all hover:bg-[#00887f] hover:text-white"
                    >
                      {formData.profilePicture ? "Change Picture" : "Add Profile Picture"}
                    </label>
                    <p className="mt-2 text-[12px] text-[#7a9aa2]">
                      Recommended size: 500x500px (JPG or PNG)
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your name"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-[16px] border border-transparent bg-white/40 px-4 py-3 text-[#4f7f89] outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  disabled
                  className="w-full rounded-[16px] border border-transparent bg-white/40 px-4 py-3 capitalize text-[#4f7f89] outline-none cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Enter your address"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClassName}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                  Blood Group
                </label>
                <select
                  name="bloodgroup"
                  value={formData.bloodgroup}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClassName}
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {isDoctor && (
                <>
                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter specialization"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                      Experience (Years)
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter experience"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                      Hospital
                    </label>
                    {isEditing && hospitalNames.length > 0 ? (
                      <select
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select hospital</option>
                        {hospitalNames.map((h) => (
                          <option key={h._id} value={h.name}>
                            {h.name} — {h.city}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Select hospital"
                        className={inputClassName}
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#2C6975]">
                      Consultation Fees
                    </label>
                    <input
                      type="text"
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter consultation fee"
                      className={inputClassName}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Save & Cancel Buttons */}
            {isEditing && (
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  className={`rounded-[14px] bg-gradient-to-r from-[#046ea3] to-[#68B2A0] px-6 py-3 text-[15px] font-bold text-white shadow-md transition-all hover:opacity-90 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="rounded-[14px] border border-[#7a9aa2] bg-transparent px-6 py-3 text-[15px] font-bold text-[#4f7f89] transition-all hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </GlassCard>

          {/* Delete Account Section */}
          <GlassCard className="rounded-[32px] border border-red-200/60 bg-white/60 px-5 py-6 shadow-xl backdrop-blur-xl md:px-8 md:py-8">
            <div className="mb-4">
              <p className="mt-1 text-[14px] font-medium text-[#4f7f89]">
                Remove your profile and all related account data.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-[20px] border border-red-200/60 bg-red-50/50 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-[24px] font-bold text-red-600">
                  Delete Account
                </h2>
                <p className="mt-1 text-[14px] text-[#4f7f89]">
                  Deleting your account is permanent and cannot be undone.
                </p>
              </div>

              <button
                type="button"
                className="rounded-[14px] border border-red-500 px-5 py-3 text-[15px] font-bold text-red-600 transition-all hover:bg-red-500 hover:text-white"
              >
                Delete Account
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Settings;