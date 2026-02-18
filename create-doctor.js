const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const createDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n👨‍⚕️ CREATING NEW DOCTOR\n");

    const doctorEmail = "dr.smith@healthbooker.com";
    
    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email: doctorEmail });
    if (existingDoctor) {
      console.log("❌ Doctor already exists with this email");
      console.log("   Email:", doctorEmail);
      console.log("   Password: doctor123 (try this)");
      
      // Reset password to known value
      const hashedPassword = await bcrypt.hash("doctor123", 10);
      existingDoctor.password = hashedPassword;
      await existingDoctor.save();
      console.log("✅ Password reset to: doctor123");
      
      process.exit(0);
    }

    // Create new doctor
    const hashedPassword = await bcrypt.hash("doctor123", 10);
    
    const doctorUser = new User({
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
    
    console.log("\n📋 DOCTOR LOGIN DETAILS:");
    console.log("   Email: dr.smith@healthbooker.com");
    console.log("   Password: doctor123");
    console.log("   Specialization: Cardiologist");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createDoctor();