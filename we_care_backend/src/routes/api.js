const reviewController = require("../controllers/reviewController");
const blogController = require("../controllers/blogController");
const hospitalController = require("../controllers/hospitalController");






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