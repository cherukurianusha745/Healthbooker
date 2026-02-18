const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const traceAppointmentFlow = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔍 TRACING APPOINTMENT FLOW\n");
    console.log("=".repeat(80));

    // STEP 1: Check all approved appointments
    const approvedApps = await Appointment.find({ status: "approved" });
    console.log(`📊 Approved appointments: ${approvedApps.length}`);

    if (approvedApps.length === 0) {
      console.log("❌ No approved appointments found!");
      process.exit(0);
    }

    // STEP 2: Check each approved appointment
    for (const app of approvedApps) {
      console.log(`\n📋 Appointment ID: ${app._id}`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Doctor ID in appointment: ${app.doctorId}`);

      // Find the doctor profile
      const doctorProfile = await Doctor.findById(app.doctorId).populate("userId");
      
      if (doctorProfile) {
        console.log(`   ✅ Doctor profile found:`);
        console.log(`      Profile ID: ${doctorProfile._id}`);
        console.log(`      Doctor Name: Dr. ${doctorProfile.userId?.firstname} ${doctorProfile.userId?.lastname}`);
        console.log(`      Doctor Email: ${doctorProfile.userId?.email}`);
        
        // Check if this doctor has a user account
        if (doctorProfile.userId) {
          console.log(`      ✅ Linked to user: ${doctorProfile.userId.email}`);
        } else {
          console.log(`      ❌ No user linked to this profile!`);
        }
      } else {
        console.log(`   ❌ No doctor profile found for ID: ${app.doctorId}`);
        
        // Try to find any doctor with this ID in users collection
        const anyDoctor = await User.findById(app.doctorId);
        if (anyDoctor) {
          console.log(`   ⚠️ This ID belongs to a USER, not a DOCTOR profile!`);
          console.log(`      User: ${anyDoctor.firstname} ${anyDoctor.lastname} (${anyDoctor.role})`);
        }
      }
    }

    // STEP 3: List all doctors who can receive appointments
    console.log("\n👨‍⚕️ DOCTORS AVAILABLE TO RECEIVE APPOINTMENTS:");
    const doctors = await Doctor.find({}).populate("userId");
    
    doctors.forEach((doc, i) => {
      if (doc.userId) {
        console.log(`\n${i+1}. Dr. ${doc.userId.firstname} ${doc.userId.lastname}`);
        console.log(`   Profile ID: ${doc._id}`);
        console.log(`   Email: ${doc.userId.email}`);
        console.log(`   Specialization: ${doc.specialization}`);
      } else {
        console.log(`\n${i+1}. ⚠️ Doctor profile with no user: ${doc._id}`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

traceAppointmentFlow();