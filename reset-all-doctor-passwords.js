const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
require("dotenv").config();

const resetAllDoctorPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 RESETTING ALL DOCTOR PASSWORDS TO 'doctor123'\n");

    // First, fix any invalid status values
    await User.updateMany(
      { role: "doctor", status: { $nin: ["pending", "accepted", "rejected"] } },
      { $set: { status: "accepted" } }
    );
    console.log("✅ Fixed any invalid status values\n");

    // Find all doctors
    const doctors = await User.find({ role: "doctor" });
    
    console.log(`📊 Found ${doctors.length} doctors\n`);

    const hashedPassword = await bcrypt.hash("doctor123", 10);
    let resetCount = 0;

    for (const doctor of doctors) {
      try {
        // Ensure status is valid before saving
        if (!["pending", "accepted", "rejected"].includes(doctor.status)) {
          doctor.status = "accepted";
        }
        
        doctor.password = hashedPassword;
        await doctor.save();
        
        console.log(`✅ Reset: ${doctor.email}`);
        console.log(`   Name: ${doctor.firstname} ${doctor.lastname}`);
        console.log(`   Status: ${doctor.status}`);
        console.log("-".repeat(40));
        
        resetCount++;
      } catch (err) {
        console.log(`❌ Failed for: ${doctor.email}`);
        console.log(`   Error: ${err.message}`);
        console.log("-".repeat(40));
      }
    }

    console.log(`\n📊 Total passwords reset: ${resetCount}`);
    console.log("\n✅ All doctor passwords are now: doctor123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  }
};

resetAllDoctorPasswords();