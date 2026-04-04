import api from "./api";

export const doctorController = {
  // Update doctor profile (doctor-specific fields + image via /doctor-profile)
  updateDoctorProfile: async (formData, isDoctor) => {
    try {
      // Step 1: Update common user profile fields via /profile
      const userPayload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        bloodgroup: formData.bloodgroup,
      };
      await api.put("/profile", userPayload);

      // Step 2: If doctor, update doctor-specific fields + image via /doctor-profile
      if (isDoctor) {
        const submitData = new FormData();
        if (formData.specialization) submitData.append("specialization", formData.specialization);
        if (formData.experience) submitData.append("experience", formData.experience);
        if (formData.hospital) submitData.append("hospital", formData.hospital);
        if (formData.fees) submitData.append("fees", formData.fees);
        if (formData.profilePictureFile) submitData.append("image", formData.profilePictureFile);

        const response = await api.put("/doctor-profile", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      }

      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  },

  // GET all doctors with filters
  getAllDoctors: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set("pageNo", params.page);
      if (params.perpage) query.set("perpage", params.perpage);
      if (params.search) query.set("search", params.search);
      if (params.specialization) query.set("specialization", params.specialization);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.verified !== undefined) query.set("verified", params.verified);

      const response = await api.get(`/doctors?${query.toString()}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch doctors" };
    }
  },

  // GET single doctor by id
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch doctor" };
    }
  },

  // GET specializations list
  getSpecializations: async () => {
    try {
      const response = await api.get("/specializations");
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch specializations" };
    }
  },

  // GET hospitals list
  getHospitals: async () => {
    try {
      const response = await api.get("/hospitals");
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch hospitals" };
    }
  },
};
