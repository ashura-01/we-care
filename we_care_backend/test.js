// scripts/createAdmin.js
const mongoose = require("mongoose");
const userModel = require("./src/models/userModel");
require("dotenv").config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingAdmin = await userModel.findOne({ email: "admin@wecare.com" });
    
    if (existingAdmin) {
      console.log("✅ Super admin already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      process.exit();
    }

    // Create super admin
    const superAdmin = new userModel({
      name: "Super Admin",
      email: "admin@wecare.com",
      password: "Admin@123",
      phone: "9999999999",
      address: "Admin Office, WeCare Headquarters",
      gender: "Male",
      bloodgroup: "O+",
      role: "super_admin",
      isActive: true
    });

    await superAdmin.save();
    
    console.log("✅ Super Admin created successfully!");
    console.log("📧 Email: admin@wecare.com");
    console.log("🔑 Password: Admin@123");
    console.log("👑 Role: super_admin");
    
    process.exit();
  } catch (error) {
    console.error("❌ Error creating super admin:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();