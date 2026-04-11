import api from "./api";

export const reviewController = {

  getDoctorReviews: async (doctorId) => {
    try {
      const response = await api.get(`/reviews/${doctorId}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch reviews" };
    }
  },

  // POST /reviews/:doctorId
  createReview: async (doctorId, { rating, comment, patientName }) => {
    try {
      const response = await api.post(`/reviews/${doctorId}`, {
        rating,
        comment,
        patientName
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to submit review" };
    }
  },
};