const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const testAppointments = async () => {
  console.log("\n" + "=".repeat(60));
  console.log("🔍 APPOINTMENT SYSTEM DIAGNOSTIC");
  console.log("=".repeat(60));

  try {
    // Connect to MongoDB
    console.log("\n📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    console.log("✅ Connected to MongoDB successfully");

    // ============================================
    // 1. CHECK ALL APPOINTMENTS
    // ============================================
    console.log("\n" + "-".repeat(40));
    console.log("📊 1. APPOINTMENTS OVERVIEW");
    console.log("-".repeat(40));

    const appointments = await Appointment.find({});
    console.log(`\n📌 Total appointments in database: ${appointments.length}`);

    if (appointments.length === 0) {
      console.log("❌ No appointments found in database!");
      console.log("   This means appointments are not being created or saved.");
    } else {
      // Count by status
      const pending = appointments.filter(a => a.status === "pending");
      const approved = appointments.filter(a => a.status === "approved");
      const confirmed = appointments.filter(a => a.status === "confirmed");
      const completed = appointments.filter(a => a.status === "completed");
      const other = appointments.filter(a => !["pending", "approved", "confirmed", "completed"].includes(a.status));

      console.log(`\n📊 Status Breakdown:`);
      console.log(`   🟡 Pending: ${pending.length}`);
      console.log(`   🔵 Approved: ${approved.length}`);
      console.log(`   🟢 Confirmed: ${confirmed.length}`);
      console.log(`   ⚫ Completed: ${completed.length}`);
      if (other.length > 0) console.log(`   ⚪ Other: ${other.length}`);

      // Show sample appointments
      console.log("\n📋 Sample Appointments (first 3):");
      for (let i = 0; i < Math.min(3, appointments.length); i++) {
        const app = appointments[i];
        console.log(`\n   [${i + 1}] Appointment ID: ${app._id}`);
        console.log(`       Patient ID: ${app.patientId}`);
        console.log(`       Doctor ID: ${app.doctorId}`);
        console.log(`       Date/Time: ${app.date} at ${app.time}`);
        console.log(`       Status: ${app.status}`);
        console.log(`       Created: ${app.createdAt}`);
      }
    }

    // ============================================
    // 2. CHECK USERS (ADMINS, DOCTORS, PATIENTS)
    // ============================================
    console.log("\n" + "-".repeat(40));
    console.log("👥 2. USERS IN SYSTEM");
    console.log("-".repeat(40));

    const totalUsers = await User.countDocuments();
    const admins = await User.find({ role: "admin" });
    const doctors = await User.find({ role: "doctor" });
    const patients = await User.find({ role: "patient" });

    console.log(`\n📌 Total Users: ${totalUsers}`);
    console.log(`   👑 Admins: ${admins.length}`);
    console.log(`   👨‍⚕️ Doctors: ${doctors.length}`);
    console.log(`   👤 Patients: ${patients.length}`);

    if (admins.length === 0) {
      console.log("\n❌ WARNING: No admin users found!");
      console.log("   Run: npm run create-admin");
    } else {
      console.log("\n📋 Admin Users:");
      admins.forEach((admin, i) => {
        console.log(`   ${i + 1}. ${admin.email} (${admin.firstname} ${admin.lastname})`);
      });
    }

    // ============================================
    // 3. CHECK DOCTORS WITH PROFILES
    // ============================================
    console.log("\n" + "-".repeat(40));
    console.log("👨‍⚕️ 3. DOCTORS WITH PROFILES");
    console.log("-".repeat(40));

    const doctorProfiles = await Doctor.find({}).populate("userId", "firstname lastname email");

    console.log(`\n📌 Total doctor profiles: ${doctorProfiles.length}`);

    if (doctorProfiles.length === 0) {
      console.log("❌ No doctor profiles found!");
      console.log("   Create a doctor profile in MongoDB");
    } else {
      console.log("\n📋 Doctor List:");
      doctorProfiles.forEach((doc, i) => {
        console.log(`\n   [${i + 1}] Dr. ${doc.userId?.firstname} ${doc.userId?.lastname}`);
        console.log(`       Email: ${doc.userId?.email}`);
        console.log(`       Specialization: ${doc.specialization}`);
        console.log(`       Experience: ${doc.experience} years`);
        console.log(`       Fees: $${doc.fees}`);
        console.log(`       Status: ${doc.status}`);
        console.log(`       Profile ID: ${doc._id}`);
      });
    }

    // ============================================
    // 4. DETAILED APPOINTMENT ANALYSIS
    // ============================================
    console.log("\n" + "-".repeat(40));
    console.log("🔬 4. DETAILED APPOINTMENT ANALYSIS");
    console.log("-".repeat(40));

    if (appointments.length > 0) {
      console.log("\n📋 Fetching detailed appointment info...");

      for (let i = 0; i < Math.min(5, appointments.length); i++) {
        const app = appointments[i];
        
        try {
          const detailedApp = await Appointment.findById(app._id)
            .populate("patientId", "firstname lastname email")
            .populate({
              path: "doctorId",
              populate: {
                path: "userId",
                select: "firstname lastname email"
              }
            });

          console.log(`\n   [${i + 1}] APPOINTMENT DETAILS:`);
          console.log(`       ID: ${detailedApp._id}`);
          
          if (detailedApp.patientId) {
            console.log(`       PATIENT: ${detailedApp.patientId.firstname} ${detailedApp.patientId.lastname}`);
            console.log(`       Patient Email: ${detailedApp.patientId.email}`);
          } else {
            console.log(`       PATIENT: ❌ NOT FOUND (ID: ${app.patientId})`);
          }

          if (detailedApp.doctorId && detailedApp.doctorId.userId) {
            console.log(`       DOCTOR: Dr. ${detailedApp.doctorId.userId.firstname} ${detailedApp.doctorId.userId.lastname}`);
            console.log(`       Doctor Email: ${detailedApp.doctorId.userId.email}`);
            console.log(`       Specialization: ${detailedApp.doctorId.specialization}`);
          } else {
            console.log(`       DOCTOR: ❌ NOT FOUND (ID: ${app.doctorId})`);
          }

          console.log(`       DATE/TIME: ${detailedApp.date} at ${detailedApp.time}`);
          console.log(`       STATUS: ${detailedApp.status}`);
          console.log(`       CREATED: ${detailedApp.createdAt}`);

        } catch (err) {
          console.log(`   ❌ Error fetching details for appointment ${app._id}:`, err.message);
        }
      }
    }

    // ============================================
    // 5. CHECK RECENT NOTIFICATIONS
    // ============================================
    console.log("\n" + "-".repeat(40));
    console.log("📨 5. RECENT NOTIFICATIONS");
    console.log("-".repeat(40));

    const Notification = require("./models/notificationModel");
    const recentNotifs = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "email role");

    console.log(`\n📌 Recent notifications: ${recentNotifs.length}`);
    recentNotifs.forEach((notif, i) => {
      console.log(`\n   [${i + 1}] ${notif.content}`);
      console.log(`       To: ${notif.userId?.email} (${notif.userId?.role})`);
      console.log(`       Seen: ${notif.seen ? "✅" : "❌"}`);
      console.log(`       Time: ${notif.createdAt}`);
    });

    // ============================================
    // 6. DIAGNOSIS SUMMARY
    // ============================================
    console.log("\n" + "=".repeat(60));
    console.log("📋 DIAGNOSIS SUMMARY");
    console.log("=".repeat(60));

    const issues = [];

    if (appointments.length === 0) issues.push("❌ No appointments in database");
    if (admins.length === 0) issues.push("❌ No admin users found");
    if (doctorProfiles.length === 0) issues.push("❌ No doctor profiles found");
    
    // Check if any appointments have invalid references
    for (const app of appointments) {
      const patient = await User.findById(app.patientId);
      if (!patient) {
        issues.push(`❌ Appointment ${app._id} has invalid patientId`);
        break;
      }
      
      const doctor = await Doctor.findById(app.doctorId);
      if (!doctor) {
        issues.push(`❌ Appointment ${app._id} has invalid doctorId`);
        break;
      }
    }

    if (issues.length === 0) {
      console.log("\n✅ ALL SYSTEMS LOOK GOOD!");
      console.log("   Your database has appointments, admins, and doctors.");
      console.log("\n   If admin still can't see appointments, check:");
      console.log("   1. Admin dashboard API endpoint");
      console.log("   2. CORS configuration");
      console.log("   3. Browser console for errors");
    } else {
      console.log("\n🔴 ISSUES FOUND:");
      issues.forEach(issue => console.log(`   ${issue}`));
      
      console.log("\n🔧 RECOMMENDED FIXES:");
      if (issues.includes("❌ No admin users found")) {
        console.log("   • Run: npm run create-admin");
      }
      if (issues.includes("❌ No doctor profiles found")) {
        console.log("   • Create a doctor profile in MongoDB");
        console.log("   • Run: node scripts/createSampleDoctor.js");
      }
      if (issues.includes("❌ No appointments in database")) {
        console.log("   • Book an appointment as a patient");
      }
    }

    console.log("\n" + "=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ ERROR RUNNING DIAGNOSTIC:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run the diagnostic
testAppointments();