const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
require("dotenv").config();

const resetPatientPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 RESETTING ALL PATIENT PASSWORDS\n");

    const patients = await User.find({ role: "patient" });
    console.log(`📊 Found ${patients.length} patients\n`);

    const hashedPassword = await bcrypt.hash("patient123", 10);
    let resetCount = 0;

    for (const patient of patients) {
      patient.password = hashedPassword;
      await patient.save();
      console.log(`✅ Reset password for: ${patient.email}`);
      resetCount++;
    }

    console.log(`\n📊 Total passwords reset: ${resetCount}`);
    console.log("\n✅ All patient passwords are now: patient123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetPatientPasswords();