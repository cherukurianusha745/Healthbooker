const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

const fixDoctorStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 FIXING DOCTOR STATUS ISSUES\n");

    // Find all doctors with invalid status
    const invalidDoctors = await User.find({ 
      role: "doctor",
      status: { $nin: ["pending", "accepted", "rejected"] }
    });
    
    console.log(`📊 Found ${invalidDoctors.length} doctors with invalid status\n`);

    for (const doctor of invalidDoctors) {
      console.log(`👨‍⚕️ Doctor: ${doctor.firstname} ${doctor.lastname}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Current status: "${doctor.status}" (INVALID)`);
      
      // Fix status
      doctor.status = "accepted";
      await doctor.save();
      
      console.log(`   ✅ Fixed to: "accepted"`);
      console.log("-".repeat(40));
    }

    if (invalidDoctors.length === 0) {
      console.log("✅ No invalid status found. All doctors have valid status.");
    }

    console.log("\n✅ Status fix completed! Now you can run the password reset script.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixDoctorStatus();