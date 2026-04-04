const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const { EncodeToken } = require("../utility/tokenHelper");

// ----------------- REGISTER PATIENT -----------------
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      gender,
      bloodgroup
    } = req.body;

    if (!name || !email || !phone || !password || !address || !gender || !bloodgroup) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodgroup.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "invalid blood group",
      });
    }
    const validGenders = ["Male", "Female"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = await userModel.create({
      name,
      email,
      phone,
      password,
      address,
      gender,
      bloodgroup: bloodgroup.toUpperCase(),
    });

    const token = EncodeToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        bloodgroup: user.bloodgroup
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ----------------- REGISTER DOCTOR -----------------
exports.registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      gender,
      bloodgroup,
      specialization,
      experience,
      hospital,
      fees,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !gender ||
      !bloodgroup ||
      !specialization ||
      !experience ||
      !hospital ||
      !fees
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodgroup.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }


    const validGenders = ["Male", "Female"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create user
    const user = await userModel.create({
      name,
      email,
      phone,
      password,
      address,
      gender,
      bloodgroup: bloodgroup.toUpperCase(),
    });

    // Create doctor profile
    const doctorData = {
      userId: user._id,
      specialization,
      experience: Number(experience),
      hospital,
      fees: Number(fees),
    };
    if (req.file && req.file.path) {
      doctorData.profileImage = req.file.path;
    }
    const doctor = await doctorModel.create(doctorData);

    const token = EncodeToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        bloodgroup: user.bloodgroup
      },
      doctor,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Doctor registration failed",
      error: error.message,
    });
  }
};

// ----------------- LOGIN -----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = EncodeToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Check if user is doctor
    const doctor = await doctorModel.findOne({ userId: user._id });

    // Update user response object
    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        bloodgroup: user.bloodgroup,
        isDoctor: doctor ? true : false,
      },
      doctor: doctor || null,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ----------------- LOGOUT -----------------
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// ----------------- GET PROFILE -----------------
exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const doctor = await doctorModel.findOne({ userId: user._id });

    res.json({
      success: true,
      user,
      doctor: doctor || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// ----------------- UPDATE PROFILE -----------------
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await userModel
      .findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// ----------------- DELETE ACCOUNT -----------------
exports.deleteAccount = async (req, res) => {
  try {
    // Delete doctor profile if exists
    await doctorModel.findOneAndDelete({ userId: req.user._id });

    // Delete user
    const user = await userModel.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("token");
    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Account deletion failed",
      error: error.message,
    });
  }
};