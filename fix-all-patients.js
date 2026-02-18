const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
require("dotenv").config();

const fixAllPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 COMPREHENSIVE PATIENT FIX\n");
    console.log("=".repeat(60));

    // Find all patients
    const patients = await User.find({ role: "patient" });
    console.log(`📊 Total patients found: ${patients.length}\n`);

    let fixed = 0;
    let passwordReset = 0;

    for (const patient of patients) {
      console.log(`\n👤 Processing: ${patient.email}`);
      let changed = false;

      // Fix status if invalid
      if (!["pending", "accepted", "rejected"].includes(patient.status)) {
        console.log(`   ⚠️ Invalid status: "${patient.status}" -> fixing to "accepted"`);
        patient.status = "accepted";
        changed = true;
      }

      // Reset password to patient123
      const hashedPassword = await bcrypt.hash("patient123", 10);
      patient.password = hashedPassword;
      passwordReset++;
      changed = true;

      if (changed) {
        await patient.save();
        fixed++;
        console.log(`   ✅ Fixed: ${patient.email}`);
        console.log(`      Name: ${patient.firstname} ${patient.lastname}`);
        console.log(`      New password: patient123`);
        console.log(`      Status: ${patient.status}`);
      } else {
        console.log(`   ✅ No fixes needed`);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 FIX SUMMARY:");
    console.log(`   ✅ Patients processed: ${patients.length}`);
    console.log(`   🔧 Patients fixed: ${fixed}`);
    console.log(`   🔑 Passwords reset: ${passwordReset}`);
    console.log(`   🔐 All passwords now: patient123`);
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAllPatients();