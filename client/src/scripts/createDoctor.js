const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
require("dotenv").config();

const createDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    const doctorEmail = "doctor@healthbooker.com";
    let doctorUser = await User.findOne({ email: doctorEmail });
    
    if (doctorUser) {
      console.log("✅ Doctor already exists");
      console.log("📧 Email:", doctorEmail);
      console.log("🔑 Password: doctor123");
      process.exit(0);
    }

    // Create doctor user
    const hashedPassword = await bcrypt.hash("doctor123", 10);
    
    doctorUser = new User({
      firstname: "John",
      lastname: "Smith",
      email: doctorEmail,
      password: hashedPassword,
      role: "doctor",
      isDoctor: true,
      isAdmin: false,
      status: "accepted"
    });

    await doctorUser.save();
    console.log("✅ Doctor user created");

    // Create doctor profile
    const doctorProfile = new Doctor({
      userId: doctorUser._id,
      specialization: "Cardiologist",
      experience: 10,
      fees: 500,
      isDoctor: true,
      status: "approved"
    });

    await doctorProfile.save();
    console.log("✅ Doctor profile created");
    console.log("📧 Email: doctor@healthbooker.com");
    console.log("🔑 Password: doctor123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating doctor:", error);
    process.exit(1);
  }
};

createDoctor();