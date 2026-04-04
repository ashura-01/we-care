import api from "./api";

export const aiController = {
  // POST /ai-chat — requires auth (cookie-based)
  chatWithAI: async (message) => {
    try {
      const response = await api.post("/ai-chat", { message });
      return response.data;
    } catch (error) {
      console.error("AI chat error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "AI chat failed",
      };
    }
  },
};
