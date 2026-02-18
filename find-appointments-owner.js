const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const Doctor = require("./models/doctorModel");
const User = require("./models/userModel");
require("dotenv").config();

const findAppointmentsOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔍 FINDING WHO OWNS THE APPOINTMENTS\n");

    // Get all approved appointments
    const approvedApps = await Appointment.find({ status: "approved" });
    console.log(`📊 Total approved appointments: ${approvedApps.length}`);

    if (approvedApps.length === 0) {
      console.log("❌ No approved appointments found");
      process.exit(0);
    }

    // Check each appointment's doctorId
    for (const app of approvedApps) {
      console.log(`\n📋 Appointment ID: ${app._id}`);
      console.log(`   Doctor ID in appointment: ${app.doctorId}`);
      
      // Find the doctor profile
      const doctorProfile = await Doctor.findById(app.doctorId).populate("userId");
      
      if (doctorProfile) {
        console.log(`   ✅ Found doctor profile:`);
        console.log(`      Profile ID: ${doctorProfile._id}`);
        console.log(`      Doctor Name: Dr. ${doctorProfile.userId?.firstname} ${doctorProfile.userId?.lastname}`);
        console.log(`      Doctor Email: ${doctorProfile.userId?.email}`);
      } else {
        console.log(`   ❌ No doctor profile found for ID: ${app.doctorId}`);
      }
    }

    // List all doctors for reference
    console.log("\n📋 ALL DOCTORS IN SYSTEM:");
    const allDoctors = await Doctor.find({}).populate("userId");
    allDoctors.forEach((doc, i) => {
      console.log(`\n[${i + 1}] Doctor Profile ID: ${doc._id}`);
      console.log(`    Name: Dr. ${doc.userId?.firstname} ${doc.userId?.lastname}`);
      console.log(`    Email: ${doc.userId?.email}`);
      console.log(`    Specialization: ${doc.specialization}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

findAppointmentsOwner();