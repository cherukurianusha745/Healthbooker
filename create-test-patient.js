const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
require("dotenv").config();

const createTestPatient = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n👤 CREATING TEST PATIENT ACCOUNT\n");

    const patientEmail = "patient@test.com";
    
    // Check if patient already exists
    const existingPatient = await User.findOne({ email: patientEmail });
    
    if (existingPatient) {
      console.log("✅ Patient already exists:");
      console.log(`   Email: ${patientEmail}`);
      console.log(`   Password: patient123`);
      console.log(`   Name: ${existingPatient.firstname} ${existingPatient.lastname}`);
      process.exit(0);
    }

    // Create new patient
    const hashedPassword = await bcrypt.hash("patient123", 10);
    
    const patient = new User({
      firstname: "Test",
      lastname: "Patient",
      email: patientEmail,
      password: hashedPassword,
      role: "patient",
      isAdmin: false,
      isDoctor: false,
      status: "accepted"
    });

    await patient.save();
    
    console.log("✅ Test patient created successfully!");
    console.log("   Email: patient@test.com");
    console.log("   Password: patient123");
    console.log("   Name: Test Patient");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createTestPatient();