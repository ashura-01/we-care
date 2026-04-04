const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["General", "Specialized", "Clinic", "Diagnostic", "Emergency"],
      default: "General",
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hospitals", HospitalSchema);
