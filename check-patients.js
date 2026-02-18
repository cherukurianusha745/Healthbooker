const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

const checkPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔍 CHECKING PATIENT ACCOUNTS\n");
    console.log("=".repeat(60));

    const patients = await User.find({ role: "patient" });
    
    console.log(`📊 Total patients found: ${patients.length}\n`);

    if (patients.length === 0) {
      console.log("❌ No patient accounts found!");
      console.log("   You need to create a patient account first.");
    } else {
      patients.forEach((patient, index) => {
        console.log(`\n👤 Patient ${index + 1}:`);
        console.log(`   Name: ${patient.firstname} ${patient.lastname}`);
        console.log(`   Email: ${patient.email}`);
        console.log(`   Password: (hashed - use "patient123" if created by script)`);
        console.log(`   User ID: ${patient._id}`);
        console.log("-".repeat(40));
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkPatients();