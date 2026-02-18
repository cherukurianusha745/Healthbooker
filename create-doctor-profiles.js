const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const createDoctorProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 CREATING DOCTOR PROFILES\n");

    // Find all users with role doctor
    const doctorUsers = await User.find({ role: "doctor" });
    console.log(`📊 Found ${doctorUsers.length} doctor users\n`);

    let created = 0;

    for (const user of doctorUsers) {
      // Check if profile already exists
      const existing = await Doctor.findOne({ userId: user._id });
      
      if (existing) {
        console.log(`✅ Profile already exists for: ${user.email}`);
        continue;
      }

      // Determine specialization based on email or name
      let specialization = "General Physician";
      let experience = 5;
      let fees = 300;

      if (user.email.includes("smith")) {
        specialization = "Cardiologist";
        experience = 10;
        fees = 500;
      } else if (user.email.includes("wilson")) {
        specialization = "Pediatrician";
        experience = 15;
        fees = 600;
      } else if (user.email.includes("chen")) {
        specialization = "Neurologist";
        experience = 12;
        fees = 750;
      } else if (user.email.includes("rodriguez")) {
        specialization = "Dermatologist";
        experience = 8;
        fees = 550;
      } else if (user.email.includes("patel")) {
        specialization = "Ophthalmologist";
        experience = 14;
        fees = 650;
      }

      // Create profile
      const newProfile = new Doctor({
        userId: user._id,
        specialization,
        experience,
        fees,
        isDoctor: true,
        status: "approved"
      });

      await newProfile.save();
      console.log(`✅ Created profile for: ${user.email}`);
      console.log(`   Name: ${user.firstname} ${user.lastname}`);
      console.log(`   Specialization: ${specialization}`);
      console.log("-".repeat(40));
      
      created++;
    }

    console.log(`\n📊 Created ${created} new doctor profiles`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createDoctorProfiles();