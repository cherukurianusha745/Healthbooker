const mongoose = require("mongoose");
const Doctor = require("./models/doctorModel");
const User = require("./models/userModel");
require("dotenv").config();

const fixDoctorDisplay = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔧 FIXING DOCTOR DISPLAY ISSUES\n");
    console.log("=".repeat(60));

    // Step 1: Check all doctors
    const allDoctors = await Doctor.find({});
    console.log(`📊 Total doctors in DB: ${allDoctors.length}`);

    // Step 2: Update all doctors to have correct status and isDoctor flag
    console.log("\n🔄 Updating doctor records...");
    
    const updateResult = await Doctor.updateMany(
      {}, // Update all
      {
        $set: {
          status: "approved",
          isDoctor: true
        }
      }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} doctors`);
    console.log(`   Matched: ${updateResult.matchedCount}`);

    // Step 3: Check each doctor has a linked user
    console.log("\n🔍 Checking doctor-user links...");
    
    const doctors = await Doctor.find({}).populate("userId");
    let fixed = 0;

    for (const doctor of doctors) {
      if (!doctor.userId) {
        console.log(`\n⚠️ Doctor ${doctor._id} has no linked user`);
        
        // Find a user with matching email pattern
        const possibleUser = await User.findOne({ 
          email: { $regex: doctor.specialization.toLowerCase() } 
        });
        
        if (possibleUser) {
          doctor.userId = possibleUser._id;
          await doctor.save();
          console.log(`   ✅ Linked to user: ${possibleUser.email}`);
          fixed++;
        } else {
          console.log(`   ❌ Could not find matching user`);
        }
      } else {
        console.log(`✅ Doctor ${doctor._id} has user: ${doctor.userId.email}`);
      }
    }

    // Step 4: Final verification
    const approvedDoctors = await Doctor.find({ 
      status: "approved", 
      isDoctor: true 
    }).populate("userId");

    console.log("\n" + "=".repeat(60));
    console.log("📊 FINAL VERIFICATION:");
    console.log(`   Total doctors now: ${await Doctor.countDocuments()}`);
    console.log(`   Approved doctors ready for display: ${approvedDoctors.length}`);
    
    if (approvedDoctors.length > 0) {
      console.log("\n✅ DOCTORS READY TO DISPLAY:");
      approvedDoctors.forEach((doc, i) => {
        console.log(`\n${i+1}. Profile ID: ${doc._id}`);
        console.log(`   Name: Dr. ${doc.userId?.firstname || 'Unknown'} ${doc.userId?.lastname || ''}`);
        console.log(`   Email: ${doc.userId?.email || 'No email'}`);
        console.log(`   Specialization: ${doc.specialization}`);
        console.log(`   Status: ${doc.status}`);
        console.log(`   isDoctor: ${doc.isDoctor}`);
      });
    } else {
      console.log("\n❌ No doctors are qualified to display!");
      console.log("   Check that doctors have:");
      console.log("   - status: 'approved'");
      console.log("   - isDoctor: true");
      console.log("   - A valid userId linking to a user");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixDoctorDisplay();