const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const createMissingDoctorProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 CREATING MISSING DOCTOR PROFILES\n");
    console.log("=".repeat(60));

    // Find all users with role doctor
    const doctorUsers = await User.find({ role: "doctor" });
    console.log(`📊 Found ${doctorUsers.length} doctor users\n`);

    let created = 0;
    let skipped = 0;

    for (const user of doctorUsers) {
      // Check if doctor profile already exists
      const existingProfile = await Doctor.findOne({ userId: user._id });
      
      if (existingProfile) {
        console.log(`✅ Profile already exists for: ${user.email}`);
        skipped++;
        continue;
      }

      // Create default specialization based on name or email
      let specialization = "General Physician";
      let experience = 5;
      let fees = 300;

      // Assign specializations based on email patterns
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
      } else if (user.email.includes("anusha")) {
        specialization = "Cardiologist";
        experience = 3;
        fees = 450;
      } else if (user.email.includes("rajesh")) {
        specialization = "Cardiologist";
        experience = 15;
        fees = 1200;
      }

      // Create doctor profile
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
      console.log(`   Profile ID: ${newProfile._id}`);
      console.log("-".repeat(40));
      
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Created: ${created} new profiles`);
    console.log(`   ⏭️  Skipped: ${skipped} existing profiles`);
    console.log(`   📋 Total doctor profiles now: ${await Doctor.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createMissingDoctorProfiles();