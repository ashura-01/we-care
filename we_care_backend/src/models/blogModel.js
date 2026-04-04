const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },


    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const blogModel = mongoose.model("blogs", DataSchema);
module.exports = blogModel;