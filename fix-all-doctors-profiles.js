const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
const Appointment = require("./models/appointmentModel");
require("dotenv").config();

const fixAllDoctorsProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 FIXING ALL DOCTOR PROFILES\n");
    console.log("=".repeat(80));

    const doctorEmails = [
      "dr.smith@healthbooker.com",
      "dr.wilson@healthbooker.com",
      "dr.chen@healthbooker.com",
      "dr.rodriguez@healthbooker.com",
      "dr.patel@healthbooker.com",
      "cherukurianusha@gmail.com"
    ];

    for (const email of doctorEmails) {
      console.log(`\n🔍 Processing: ${email}`);
      
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`   ❌ User not found!`);
        continue;
      }

      console.log(`   ✅ User: ${user.firstname} ${user.lastname} (ID: ${user._id})`);

      // Find or create profile
      let profile = await Doctor.findOne({ userId: user._id });
      
      if (!profile) {
        console.log(`   ⚠️ No profile found. Creating one...`);
        
        // Assign specialization based on email
        let specialization = "General Physician";
        let experience = 5;
        let fees = 300;

        if (email.includes("smith")) {
          specialization = "Cardiologist";
          experience = 10;
          fees = 500;
        } else if (email.includes("wilson")) {
          specialization = "Pediatrician";
          experience = 15;
          fees = 600;
        } else if (email.includes("chen")) {
          specialization = "Neurologist";
          experience = 12;
          fees = 750;
        } else if (email.includes("rodriguez")) {
          specialization = "Dermatologist";
          experience = 8;
          fees = 550;
        } else if (email.includes("patel")) {
          specialization = "Ophthalmologist";
          experience = 14;
          fees = 650;
        } else if (email.includes("anusha")) {
          specialization = "Cardiologist";
          experience = 3;
          fees = 450;
        }

        profile = new Doctor({
          userId: user._id,
          specialization,
          experience,
          fees,
          isDoctor: true,
          status: "approved"
        });
        
        await profile.save();
        console.log(`   ✅ Created profile: ${profile._id}`);
      } else {
        console.log(`   ✅ Found profile: ${profile._id}`);
      }

      // Count appointments for this doctor
      const appCount = await Appointment.countDocuments({ doctorId: profile._id });
      console.log(`   📊 Appointments: ${appCount}`);
    }

    console.log("\n✅ All doctor profiles fixed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAllDoctorsProfiles();