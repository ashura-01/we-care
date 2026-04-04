import api from "./api";

export const hospitalController = {
  // Public
  getAllHospitals: async ({ page = 1, limit = 20, search = "", city = "", type = "" } = {}) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append("search", search);
      if (city) params.append("city", city);
      if (type) params.append("type", type);
      const response = await api.get(`/hospitals?${params}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch hospitals" };
    }
  },

  getHospitalById: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch hospital" };
    }
  },

  getHospitalNames: async () => {
    try {
      const response = await api.get("/hospitals/names");
      return response.data;
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  getNearbyHospitals: async (address) => {
    try {
      // Sends a POST request with the address in the body
      const response = await api.post("/hospitals/nearby", { address });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch nearby map data" };
    }
  },

  // Admin only
  addHospital: async (data) => {
    try {
      const response = await api.post("/admin/hospitals", data);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to add hospital" };
    }
  },

  updateHospital: async (id, data) => {
    try {
      const response = await api.put(`/admin/hospitals/${id}`, data);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update hospital" };
    }
  },

  deleteHospital: async (id) => {
    try {
      const response = await api.delete(`/admin/hospitals/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete hospital" };
    }
  },
};
