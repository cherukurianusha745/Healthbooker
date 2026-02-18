const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

const fixPatientStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 FIXING PATIENT STATUS ISSUES\n");

    // Find all patients with invalid status
    const invalidPatients = await User.find({ 
      role: "patient",
      status: { $nin: ["pending", "accepted", "rejected"] }
    });
    
    console.log(`📊 Found ${invalidPatients.length} patients with invalid status\n`);

    for (const patient of invalidPatients) {
      console.log(`👤 Patient: ${patient.firstname} ${patient.lastname}`);
      console.log(`   Email: ${patient.email}`);
      console.log(`   Current status: "${patient.status}" (INVALID)`);
      
      // Fix status
      patient.status = "accepted";
      await patient.save();
      
      console.log(`   ✅ Fixed to: "accepted"`);
      console.log("-".repeat(40));
    }

    if (invalidPatients.length === 0) {
      console.log("✅ No invalid patient status found. All patients have valid status.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixPatientStatus();