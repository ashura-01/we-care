const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validBloodGroups = [
  "A+", "A-", "B+", "B-",
  "AB+", "AB-", "O+", "O-"
]

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user'
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    bloodgroup: {
      type: String,
      required: true,
      enum: validBloodGroups,
      uppercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified("bloodgroup")) {
    this.bloodgroup = this.bloodgroup.toUpperCase();
  }
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("users", UserSchema);