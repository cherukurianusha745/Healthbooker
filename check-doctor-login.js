const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const checkDoctorLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔍 CHECKING DOCTOR LOGIN STATUS\n");

    // Check all doctor users
    const doctorUsers = await User.find({ role: "doctor" });
    
    console.log(`📊 Total doctor users: ${doctorUsers.length}\n`);

    for (const user of doctorUsers) {
      console.log(`👨‍⚕️ Doctor: ${user.firstname} ${user.lastname}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   User ID: ${user._id}`);
      
      const doctorProfile = await Doctor.findOne({ userId: user._id });
      if (doctorProfile) {
        console.log(`   ✅ Has doctor profile: ${doctorProfile._id}`);
        console.log(`   Specialization: ${doctorProfile.specialization}`);
        
        // Count appointments for this doctor
        const Appointment = require("./models/appointmentModel");
        const appCount = await Appointment.countDocuments({ 
          doctorId: doctorProfile._id,
          status: { $in: ["approved", "confirmed", "completed"] }
        });
        console.log(`   📅 Appointments: ${appCount}`);
      } else {
        console.log(`   ❌ No doctor profile found!`);
      }
      console.log("   " + "-".repeat(40));
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDoctorLogin();