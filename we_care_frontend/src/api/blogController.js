import api from "./api";

export const blogController = {
  // GET /blogs
  getAllBlogs: async ({ page = 1, perpage = 9 } = {}) => {
    try {
      const response = await api.get(`/blogs?pageNo=${page}&perpage=${perpage}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch blogs" };
    }
  },

  // GET /blogs/:id
  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch blog" };
    }
  },

  // GET /blogs/doctor/:doctorId
  getBlogsByDoctor: async (doctorId) => {
    try {
      const response = await api.get(`/blogs/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch doctor blogs" };
    }
  },

  // POST /blogs (doctor only)
  createBlog: async ({ title, category, image, shortDescription, description }) => {
    try {
      const response = await api.post("/blogs", { title, category, image, shortDescription, description });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to create blog" };
    }
  },

  // PUT /blogs/:id
  updateBlog: async (id, { title, category, image, shortDescription, description }) => {
    try {
      const response = await api.put(`/blogs/${id}`, { title, category, image, shortDescription, description });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update blog" };
    }
  },

  // DELETE /blogs/:id
  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete blog" };
    }
  },
};
