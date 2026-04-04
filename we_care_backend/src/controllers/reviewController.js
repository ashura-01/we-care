const reviewModel = require("../models/reviewModel");
const doctorModel = require("../models/doctorModel");

// POST: Add a new review
exports.createReview = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { patientName, rating, comment } = req.body;

    const doctorExists = await doctorModel.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const newReview = new reviewModel({
      doctorId,
      patientName,
      rating: Number(rating),
      comment,
    });

    await newReview.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create review", error: error.message });
  }
};

// GET: Fetch all reviews for a specific doctor
exports.getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await reviewModel.find({ doctorId }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
  }
};