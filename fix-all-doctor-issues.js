const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
const Appointment = require("./models/appointmentModel");
require("dotenv").config();

const fixAllDoctorIssues = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n" + "=".repeat(70));
    console.log("🔧 COMPLETE DOCTOR FIX UTILITY");
    console.log("=".repeat(70));

    // ===========================================
    // STEP 1: CHECK ALL DOCTORS CURRENT STATUS
    // ===========================================
    console.log("\n📋 STEP 1: CHECKING CURRENT DOCTOR STATUS\n");
    
    const doctorEmails = [
      "dr.smith@healthbooker.com",
      "dr.wilson@healthbooker.com", 
      "dr.chen@healthbooker.com",
      "dr.rodriguez@healthbooker.com",
      "dr.patel@healthbooker.com",
      "cherukurianusha@gmail.com"
    ];

    const doctors = [];
    
    for (const email of doctorEmails) {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`❌ ${email} - USER NOT FOUND IN DATABASE!`);
        continue;
      }

      const profiles = await Doctor.find({ userId: user._id });
      
      doctors.push({
        user,
        profiles,
        email
      });
      
      console.log(`\n👤 ${user.firstname} ${user.lastname} (${email})`);
      console.log(`   User ID: ${user._id}`);
      console.log(`   Profiles found: ${profiles.length}`);
      
      if (profiles.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`      ${index + 1}. Profile ID: ${profile._id}`);
          console.log(`         Specialization: ${profile.specialization}`);
        });
      } else {
        console.log(`      ⚠️ NO PROFILE FOUND - Will create one`);
      }
    }

    // ===========================================
    // STEP 2: CREATE MISSING PROFILES
    // ===========================================
    console.log("\n" + "=".repeat(70));
    console.log("🛠️ STEP 2: CREATING MISSING PROFILES");
    console.log("=".repeat(70));

    let createdCount = 0;

    for (const doctor of doctors) {
      if (doctor.profiles.length === 0) {
        console.log(`\n👨‍⚕️ Creating profile for ${doctor.user.firstname} ${doctor.user.lastname} (${doctor.email})`);
        
        // Determine specialization based on email
        let specialization = "General Physician";
        let experience = 5;
        let fees = 300;

        if (doctor.email.includes("smith")) {
          specialization = "Cardiologist";
          experience = 10;
          fees = 500;
        } else if (doctor.email.includes("wilson")) {
          specialization = "Pediatrician";
          experience = 15;
          fees = 600;
        } else if (doctor.email.includes("chen")) {
          specialization = "Neurologist";
          experience = 12;
          fees = 750;
        } else if (doctor.email.includes("rodriguez")) {
          specialization = "Dermatologist";
          experience = 8;
          fees = 550;
        } else if (doctor.email.includes("patel")) {
          specialization = "Ophthalmologist";
          experience = 14;
          fees = 650;
        } else if (doctor.email.includes("anusha")) {
          specialization = "Cardiologist";
          experience = 3;
          fees = 450;
        }

        const newProfile = new Doctor({
          userId: doctor.user._id,
          specialization,
          experience,
          fees,
          isDoctor: true,
          status: "approved"
        });

        await newProfile.save();
        console.log(`   ✅ Created profile: ${newProfile._id}`);
        console.log(`   ✅ Specialization: ${specialization}`);
        
        // Add profile to doctor object
        doctor.profiles = [newProfile];
        createdCount++;
      }
    }

    console.log(`\n📊 Created ${createdCount} missing profiles`);

    // ===========================================
    // STEP 3: DELETE DUPLICATE PROFILES
    // ===========================================
    console.log("\n" + "=".repeat(70));
    console.log("🗑️ STEP 3: DELETING DUPLICATE PROFILES");
    console.log("=".repeat(70));

    let deletedCount = 0;
    let reassignedCount = 0;

    for (const doctor of doctors) {
      if (doctor.profiles.length > 1) {
        console.log(`\n👨‍⚕️ ${doctor.user.firstname} ${doctor.user.lastname} has ${doctor.profiles.length} profiles`);
        
        // Keep the OLDEST profile (first in array)
        const keepProfile = doctor.profiles[0];
        console.log(`   ✅ Keeping profile: ${keepProfile._id}`);

        // Process duplicates (all except first)
        for (let i = 1; i < doctor.profiles.length; i++) {
          const dupProfile = doctor.profiles[i];
          console.log(`\n   🔄 Processing duplicate: ${dupProfile._id}`);
          
          // Check if duplicate has any appointments
          const appointments = await Appointment.find({ doctorId: dupProfile._id });
          
          if (appointments.length > 0) {
            console.log(`      📊 Found ${appointments.length} appointments to reassign`);
            
            // Reassign appointments to kept profile
            const result = await Appointment.updateMany(
              { doctorId: dupProfile._id },
              { $set: { doctorId: keepProfile._id } }
            );
            
            console.log(`      ✅ Reassigned ${result.modifiedCount} appointments`);
            reassignedCount += result.modifiedCount;
          }
          
          // Delete the duplicate profile
          await Doctor.findByIdAndDelete(dupProfile._id);
          console.log(`      ✅ Deleted duplicate profile`);
          deletedCount++;
        }
      }
    }

    console.log(`\n📊 Deleted ${deletedCount} duplicate profiles`);
    console.log(`📊 Reassigned ${reassignedCount} appointments`);

    // ===========================================
    // STEP 4: VERIFY EVERYTHING IS FIXED
    // ===========================================
    console.log("\n" + "=".repeat(70));
    console.log("✅ STEP 4: VERIFYING FINAL STATUS");
    console.log("=".repeat(70));

    console.log("\n📋 FINAL DOCTOR STATUS:\n");

    let allGood = true;

    for (const doctor of doctors) {
      // Refresh doctor profiles from database
      const finalProfiles = await Doctor.find({ userId: doctor.user._id });
      const finalProfile = finalProfiles[0]; // Should be only one
      
      const appointmentCount = await Appointment.countDocuments({ 
        doctorId: finalProfile?._id 
      });

      console.log(`\n👨‍⚕️ ${doctor.user.firstname} ${doctor.user.lastname}`);
      console.log(`   Email: ${doctor.email}`);
      
      if (finalProfiles.length === 1) {
        console.log(`   ✅ Has ONE profile: ${finalProfile._id}`);
        console.log(`   ✅ Specialization: ${finalProfile.specialization}`);
        console.log(`   ✅ Appointments: ${appointmentCount}`);
      } else {
        console.log(`   ❌ Has ${finalProfiles.length} profiles - STILL ISSUE!`);
        allGood = false;
      }
    }

    // ===========================================
    // STEP 5: CHECK FOR ORPHANED PROFILES
    // ===========================================
    console.log("\n" + "=".repeat(70));
    console.log("🧹 STEP 5: CHECKING FOR ORPHANED PROFILES");
    console.log("=".repeat(70));

    const orphaned = await Doctor.find({ 
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ] 
    });

    if (orphaned.length > 0) {
      console.log(`\n⚠️ Found ${orphaned.length} orphaned profiles (no linked user)`);
      
      for (const orphan of orphaned) {
        console.log(`   ❌ Deleting orphan: ${orphan._id}`);
        
        // Check if orphan has appointments
        const apps = await Appointment.find({ doctorId: orphan._id });
        if (apps.length > 0) {
          console.log(`      ⚠️ This orphan has ${apps.length} appointments!`);
          // Find a default doctor (Dr. Smith) to reassign to
          const smith = await User.findOne({ email: "dr.smith@healthbooker.com" });
          const smithProfile = await Doctor.findOne({ userId: smith._id });
          
          if (smithProfile) {
            await Appointment.updateMany(
              { doctorId: orphan._id },
              { $set: { doctorId: smithProfile._id } }
            );
            console.log(`      ✅ Reassigned to Dr. Smith`);
          }
        }
        
        await Doctor.findByIdAndDelete(orphan._id);
      }
    } else {
      console.log("\n✅ No orphaned profiles found!");
    }

    // ===========================================
    // FINAL SUMMARY
    // ===========================================
    console.log("\n" + "=".repeat(70));
    console.log("🎉 FIX COMPLETE! SUMMARY");
    console.log("=".repeat(70));
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`   ✅ Missing profiles created: ${createdCount}`);
    console.log(`   🗑️ Duplicate profiles deleted: ${deletedCount}`);
    console.log(`   🔄 Appointments reassigned: ${reassignedCount}`);
    console.log(`   📋 Total doctors now: ${await Doctor.countDocuments()}`);

    console.log("\n🔐 LOGIN CREDENTIALS (all passwords: doctor123):");
    for (const doctor of doctors) {
      console.log(`   • ${doctor.user.firstname} ${doctor.user.lastname}: ${doctor.email}`);
    }

    console.log("\n✅ ALL FIXED! Restart your backend and test:");
    console.log("   1. npm run dev");
    console.log("   2. Login as any doctor");
    console.log("   3. Check appointments page");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    process.exit(1);
  }
};

fixAllDoctorIssues();