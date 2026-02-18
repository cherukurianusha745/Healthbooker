const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
const Appointment = require("./models/appointmentModel");
require("dotenv").config();

const consolidateDoctorProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔄 CONSOLIDATING DUPLICATE DOCTOR PROFILES\n");
    console.log("=".repeat(80));

    // Group doctors by email
    const doctorEmails = [
      "dr.smith@healthbooker.com",
      "dr.wilson@healthbooker.com",
      "dr.chen@healthbooker.com", 
      "dr.rodriguez@healthbooker.com",
      "dr.patel@healthbooker.com",
      "cherukurianusha@gmail.com",
      "dr.rajesh@example.com",
      "doctor@healthbooker.com"
    ];

    for (const email of doctorEmails) {
      console.log(`\n🔍 Processing: ${email}`);
      
      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`   ❌ User not found for email: ${email}`);
        continue;
      }

      console.log(`   ✅ Found user: ${user.firstname} ${user.lastname} (ID: ${user._id})`);

      // Find ALL doctor profiles for this user
      const profiles = await Doctor.find({ userId: user._id });
      
      if (profiles.length <= 1) {
        console.log(`   ℹ️ No duplicates found (${profiles.length} profile)`);
        continue;
      }

      console.log(`   ⚠️ Found ${profiles.length} duplicate profiles:`);
      
      // Keep the first profile, delete others and reassign appointments
      const keepProfile = profiles[0];
      console.log(`   ✅ Keeping profile: ${keepProfile._id}`);

      for (let i = 1; i < profiles.length; i++) {
        const dupProfile = profiles[i];
        console.log(`   🔄 Processing duplicate: ${dupProfile._id}`);
        
        // Reassign appointments from duplicate to kept profile
        const result = await Appointment.updateMany(
          { doctorId: dupProfile._id },
          { $set: { doctorId: keepProfile._id } }
        );
        
        console.log(`      📊 Reassigned ${result.modifiedCount} appointments`);
        
        // Delete the duplicate profile
        await Doctor.findByIdAndDelete(dupProfile._id);
        console.log(`      ✅ Deleted duplicate profile`);
      }
    }

    // Clean up profiles with no user
    console.log("\n🧹 Cleaning up orphaned profiles...");
    const orphaned = await Doctor.find({ userId: { $exists: false } });
    for (const orphan of orphaned) {
      console.log(`   ❌ Deleting orphaned profile: ${orphan._id}`);
      await Doctor.findByIdAndDelete(orphan._id);
    }

    console.log("\n✅ Consolidation complete!");
    
    // Show final doctor list
    console.log("\n📋 FINAL DOCTOR LIST:");
    const finalDoctors = await Doctor.find({}).populate("userId");
    finalDoctors.forEach((doc, i) => {
      if (doc.userId) {
        console.log(`\n${i+1}. Dr. ${doc.userId.firstname} ${doc.userId.lastname}`);
        console.log(`   Profile ID: ${doc._id}`);
        console.log(`   Email: ${doc.userId.email}`);
        
        // Count appointments
        Appointment.countDocuments({ doctorId: doc._id }).then(count => {
          console.log(`   Appointments: ${count}`);
        });
      }
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

consolidateDoctorProfiles();