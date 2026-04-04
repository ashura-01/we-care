import api from "./api";

export const authController = {
  // Patient Registration
  registerPatient: async (userData) => {
    try {
      const response = await api.post("/register", userData);
      if (response.data.success) {
        localStorage.setItem("userRole", "patient");
        localStorage.setItem("userId", response.data.user._id);
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  },

  // Doctor Registration
  registerDoctor: async (doctorData) => {
    try {
      // doctorData can be a FormData (with image) or plain object
      const isFormData = doctorData instanceof FormData;
      const response = await api.post("/register-doctor", doctorData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      if (response.data.success) {
        localStorage.setItem("userRole", "doctor");
        localStorage.setItem("userId", response.data.user._id);
      }
      return response.data;
    } catch (error) {
      console.error("Doctor registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Doctor registration failed"
      };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      console.log("Login response:", response.data);

      if (response.data.success) {
        const userRole = response.data.user.isDoctor ? "doctor" : "patient";
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userId", response.data.user._id);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.get("/logout");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed"
      };
    }
  },

  // Get Current User Info
  getCurrentUser: () => {
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!userId) return null;

    return {
      role: userRole,
      userId: userId
    };
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("userId");
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem("userRole");
  }
};