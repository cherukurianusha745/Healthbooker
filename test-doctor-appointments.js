const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const Doctor = require("./models/doctorModel");
const User = require("./models/userModel");
require("dotenv").config();

const testDoctorAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔍 DOCTOR APPOINTMENT DIAGNOSTIC\n");

    // Find a doctor user
    const doctorUser = await User.findOne({ role: "doctor" });
    if (!doctorUser) {
      console.log("❌ No doctor user found");
      process.exit(1);
    }
    console.log(`👨‍⚕️ Found doctor: ${doctorUser.firstname} ${doctorUser.lastname} (${doctorUser._id})`);

    // Find doctor profile
    const doctorProfile = await Doctor.findOne({ userId: doctorUser._id });
    if (!doctorProfile) {
      console.log("❌ No doctor profile found for this user");
      process.exit(1);
    }
    console.log(`📋 Doctor Profile ID: ${doctorProfile._id}`);

    // Find appointments for this doctor
    const appointments = await Appointment.find({ doctorId: doctorProfile._id })
      .populate("patientId", "firstname lastname email")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname"
        }
      });

    console.log(`\n📊 Total appointments for this doctor: ${appointments.length}`);
    
    appointments.forEach((app, i) => {
      console.log(`\n[${i + 1}] Appointment:`);
      console.log(`   ID: ${app._id}`);
      console.log(`   Patient: ${app.patientId?.firstname} ${app.patientId?.lastname}`);
      console.log(`   Date: ${app.date}`);
      console.log(`   Time: ${app.time}`);
      console.log(`   Status: ${app.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testDoctorAppointments();