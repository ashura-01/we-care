const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const auth = require("../middlewares/authVerification");
const reviewController = require("../controllers/reviewController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const upload = require("../middlewares/uploadMiddleware");
const aiChatController = require("../controllers/aiChatController");
const hospitalController = require("../controllers/hospitalController");

// Test route
router.get("/", (req, res) => {
  res.send("API v1 working 🚀");
});

// ------------ PUBLIC ROUTES------------
router.get("/doctors", doctorController.getAllDoctors);
router.get("/doctors/:id", doctorController.getDoctorById);
router.get("/specializations", doctorController.getSpecializations);
router.get("/hospitals-list", doctorController.getHospitals);

// ----------- HOSPITAL PUBLIC ROUTES -----------
router.get("/hospitals", hospitalController.getAllHospitals);
router.get("/hospitals/names", hospitalController.getHospitalNames);

router.post("/hospitals/nearby", hospitalController.getNearbyHospitals);

router.get("/hospitals/:id", hospitalController.getHospitalById);




// -------------- AUTH ROUTES -----------------
router.post("/register", userController.register);
router.post("/register-doctor", upload.single('image'), userController.registerDoctor);
router.post("/login", userController.login);
router.get("/logout", auth(), userController.logout);

// -------------- PROTECTED ROUTES -------------
router.get("/profile", auth(), userController.getProfile);
router.put("/profile", auth(), userController.updateProfile);
router.delete("/account", auth(), userController.deleteAccount);

// --------- DOCTOR ONLY ROUTES -----------
router.put("/doctor-profile", auth(), upload.single('image'), doctorController.updateDoctorProfile);

// --------- REVIEW ROUTES ---------------------
router.get("/reviews/:doctorId", reviewController.getDoctorReviews);
router.post("/reviews/:doctorId", reviewController.createReview);

// --------- PUBLIC BLOG ROUTES (Anyone can read) -----------
router.get("/blogs", blogController.getAllBlogs);
router.get("/blogs/:id", blogController.getSingleBlog);
router.get("/blogs/doctor/:doctorId", blogController.getBlogsByDoctor);

// --------- PROTECTED BLOG ROUTES (Doctor only via controller check) -----------
router.post("/blogs", auth(), blogController.createBlog);
router.put("/blogs/:id", auth(), blogController.updateBlog);
router.delete("/blogs/:id", auth(), blogController.deleteBlog);

// COMMENT ROUTES
router.post("/create-comment", auth(), commentController.createComment);
router.get("/all-comments", commentController.getAllComments);
router.get("/single-comment/:id", auth(), commentController.getSingleComment);
router.put("/delete-comment/:id", auth(), commentController.deleteComment);

// --------- AI CHAT ROUTE -----------
router.post("/ai-chat", auth(), aiChatController.chatWithAI);

// ADMIN ROUTES
const { isAdmin, isSuperAdmin } = require("../middlewares/adminAuth");
const adminController = require("../controllers/adminController");

router.get("/admin/dashboard", isAdmin, adminController.getDashboardStats);
router.get("/admin/users", isAdmin, adminController.getAllUsers);
router.get("/admin/users/:id", isAdmin, adminController.getUserById);
router.put("/admin/users/:id", isAdmin, adminController.updateUser);
router.delete("/admin/users/:id", isAdmin, adminController.deleteUser);
router.put("/admin/users/:id/make-admin", isSuperAdmin, adminController.makeAdmin);
router.get("/admin/doctors", isAdmin, adminController.getAllDoctors);
router.put("/admin/doctors/:id/verify", isAdmin, adminController.verifyDoctor);
router.put("/admin/doctors/:id/unverify", isAdmin, adminController.unverifyDoctor);
router.delete("/admin/doctors/:id", isAdmin, adminController.deleteDoctor);

// Admin - hospitals
router.post("/admin/hospitals", isAdmin, hospitalController.addHospital);
router.put("/admin/hospitals/:id", isAdmin, hospitalController.updateHospital);
router.delete("/admin/hospitals/:id", isAdmin, hospitalController.deleteHospital);

router.post("/admin/logout", isAdmin, adminController.adminLogout);

module.exports = router;
