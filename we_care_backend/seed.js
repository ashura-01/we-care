require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./src/models/userModel");
const doctorModel = require("./src/models/doctorModel");

const seedDatabase = async () => {
  try {
    // Construct the MongoDB URI exactly like your index.js does
    const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(url);
    console.log("✅ Connected! Starting seed process...\n");

    // Our dummy data
    const doctorsToAdd = [
      {
        name: "Dr. Alan Bones", email: "alan@doctor.com", phone: "01811111111", password: "password123",
        specialization: "Orthopedic Surgeon", experience: 15, hospital: "City Bone & Joint", fees: 1200
      },
      {
        name: "Dr. Ellie Skin", email: "ellie@doctor.com", phone: "01822222222", password: "password123",
        specialization: "Dermatologist", experience: 8, hospital: "Skin Care Clinic", fees: 800
      },
      {
        name: "Dr. Ian Nerves", email: "ian@doctor.com", phone: "01833333333", password: "password123",
        specialization: "Neurologist", experience: 20, hospital: "Central Neuro Center", fees: 2500
      }
    ];

    for (const docData of doctorsToAdd) {
      // 1. Create the User account first
      const newUser = new userModel({
        name: docData.name,
        email: docData.email,
        phone: docData.phone,
        password: docData.password // Your UserSchema.pre('save') hook will hash this automatically!
      });
      const savedUser = await newUser.save();

      // 2. Create the Doctor profile linked to the User account
      const newDoctor = new doctorModel({
        userId: savedUser._id,
        specialization: docData.specialization,
        experience: docData.experience,
        hospital: docData.hospital,
        fees: docData.fees,
        verified: true 
      });
      await newDoctor.save();
      
      console.log(`🩺 Successfully added: ${docData.name} (${docData.specialization})`);
    }

    console.log("\n🎉 Database seeding complete!");
    process.exit(0); // Closes the script successfully
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1); // Closes the script with an error
  }
};

seedDatabase();