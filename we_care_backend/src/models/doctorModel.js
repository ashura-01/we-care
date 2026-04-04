const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    fees: {
      type: Number,
      required: true,
      min: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
    type: String,
    // placeholder image
    default: "https://res.cloudinary.com/donp4617w/image/upload/default_doctor_fwuqrw.png"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("doctors", DoctorSchema);