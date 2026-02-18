const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const checkDoctorsList = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔍 CHECKING DOCTORS IN DATABASE\n");
    console.log("=".repeat(60));

    // Check users with role doctor
    const doctorUsers = await User.find({ role: "doctor" });
    console.log(`📊 Doctors in users collection: ${doctorUsers.length}`);
    
    doctorUsers.forEach((doc, i) => {
      console.log(`\n${i+1}. Dr. ${doc.firstname} ${doc.lastname}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Status: ${doc.status}`);
    });

    // Check doctor profiles
    const doctorProfiles = await Doctor.find({})
      .populate("userId", "firstname lastname email");
    
    console.log(`\n📊 Doctor profiles in doctors collection: ${doctorProfiles.length}`);
    
    doctorProfiles.forEach((profile, i) => {
      console.log(`\n${i+1}. Profile ID: ${profile._id}`);
      console.log(`   Specialization: ${profile.specialization}`);
      console.log(`   Status: ${profile.status}`);
      if (profile.userId) {
        console.log(`   Linked to: Dr. ${profile.userId.firstname} ${profile.userId.lastname}`);
      } else {
        console.log(`   ❌ No linked user!`);
      }
    });

    // Check approved doctors for frontend
    const approvedDoctors = await Doctor.find({ 
      status: "approved", 
      isDoctor: true 
    }).populate("userId", "firstname lastname email");

    console.log(`\n📊 Approved doctors ready for frontend: ${approvedDoctors.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDoctorsList();