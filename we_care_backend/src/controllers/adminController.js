const User = require("../models/userModel");
const doctorModel = require("../models/doctorModel");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

// Get single user (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};

// Make user admin (Super Admin only)
exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User promoted to admin",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error making admin",
      error: error.message
    });
  }
};

// Get all doctors with filters (Admin only)
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, verified, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (verified) query.verified = verified === 'true';

    const doctors = await doctorModel.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await doctorModel.countDocuments(query);

    res.json({
      success: true,
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message
    });
  }
};

// Verify doctor (Admin only)
exports.verifyDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      message: "Doctor verified successfully",
      doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying doctor",
      error: error.message
    });
  }
};

// Unverify doctor (Admin only)
exports.unverifyDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      { verified: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      message: "Doctor unverified",
      doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating doctor",
      error: error.message
    });
  }
};

// Delete doctor (Admin only)
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }
    res.json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting doctor",
      error: error.message
    });
  }
};

// Dashboard stats (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await doctorModel.countDocuments();
    const verifiedDoctors = await doctorModel.countDocuments({ verified: true });
    const pendingDoctors = await doctorModel.countDocuments({ verified: false });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAdmins,
        verifiedDoctors,
        pendingDoctors,
        activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message
    });
  }
};


// Add this to your existing adminController.js
exports.adminLogout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    
    res.json({
      success: true,
      message: "Admin logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
};