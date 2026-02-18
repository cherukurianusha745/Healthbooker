const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const forceAppointmentsToSmith = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 FORCE ASSIGNING ALL APPOINTMENTS TO DR. SMITH\n");
    console.log("=".repeat(60));

    // STEP 1: Find Dr. John Smith
    console.log("🔍 Looking for Dr. John Smith...");
    
    const smithUser = await User.findOne({ 
      email: "dr.smith@healthbooker.com" 
    });

    if (!smithUser) {
      console.log("❌ Dr. Smith not found in users collection!");
      process.exit(1);
    }

    console.log(`✅ Found Dr. Smith:`);
    console.log(`   Name: ${smithUser.firstname} ${smithUser.lastname}`);
    console.log(`   User ID: ${smithUser._id}`);
    console.log(`   Email: ${smithUser.email}`);

    // STEP 2: Find or create his doctor profile
    let smithProfile = await Doctor.findOne({ userId: smithUser._id });
    
    if (!smithProfile) {
      console.log("\n⚠️ No doctor profile found! Creating one...");
      
      smithProfile = new Doctor({
        userId: smithUser._id,
        specialization: "Cardiologist",
        experience: 10,
        fees: 500,
        isDoctor: true,
        status: "approved"
      });
      
      await smithProfile.save();
      console.log(`✅ Created new profile with ID: ${smithProfile._id}`);
    } else {
      console.log(`\n✅ Found existing profile with ID: ${smithProfile._id}`);
    }

    // STEP 3: Count all appointments
    const totalApps = await Appointment.countDocuments();
    console.log(`\n📊 Total appointments in system: ${totalApps}`);

    // STEP 4: Count appointments currently assigned to Dr. Smith
    const smithApps = await Appointment.countDocuments({ doctorId: smithProfile._id });
    console.log(`📊 Currently assigned to Dr. Smith: ${smithApps}`);

    // STEP 5: Get all appointments not assigned to Dr. Smith
    const otherApps = await Appointment.find({ 
      doctorId: { $ne: smithProfile._id } 
    });

    console.log(`\n🔄 Found ${otherApps.length} appointments to reassign to Dr. Smith`);

    if (otherApps.length > 0) {
      console.log("\n📋 Appointments to reassign:");
      for (const app of otherApps) {
        const oldDoctor = await Doctor.findById(app.doctorId).populate("userId");
        console.log(`\n   Appointment ID: ${app._id}`);
        console.log(`   Currently assigned to: ${oldDoctor?.userId?.firstname || 'Unknown'} ${oldDoctor?.userId?.lastname || ''}`);
        console.log(`   Date: ${app.date} at ${app.time}`);
        console.log(`   Status: ${app.status}`);
        
        // Reassign to Dr. Smith
        app.doctorId = smithProfile._id;
        await app.save();
        console.log(`   ✅ REASSIGNED to Dr. Smith`);
      }
      
      console.log(`\n✅ Successfully reassigned ${otherApps.length} appointments to Dr. Smith`);
    } else {
      console.log("✅ All appointments already assigned to Dr. Smith");
    }

    // STEP 6: Final verification
    const finalCount = await Appointment.countDocuments({ doctorId: smithProfile._id });
    console.log(`\n📊 FINAL COUNT: Dr. Smith now has ${finalCount} appointments`);

    if (finalCount > 0) {
      console.log("\n🎉 SUCCESS! Dr. Smith now has appointments!");
      console.log("\n👉 Please login again to see them");
    } else {
      console.log("\n❌ No appointments found in system at all!");
      console.log("   Please book some appointments as a patient first.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

forceAppointmentsToSmith();