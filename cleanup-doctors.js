const mongoose = require("mongoose");
const Doctor = require("./models/doctorModel");
const User = require("./models/userModel");
require("dotenv").config();

const cleanupDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🧹 CLEANING UP DOCTOR PROFILES\n");

    // 1. Delete doctors with undefined user data
    const brokenDocs = await Doctor.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });

    console.log(`📊 Found ${brokenDocs.length} broken doctor profiles`);
    for (const doc of brokenDocs) {
      await Doctor.findByIdAndDelete(doc._id);
      console.log(`✅ Deleted broken profile: ${doc._id}`);
    }

    // 2. Find duplicate doctors (same email)
    const allUsers = await User.find({ role: "doctor" });
    const emailMap = {};

    for (const user of allUsers) {
      if (!emailMap[user.email]) {
        emailMap[user.email] = [];
      }
      emailMap[user.email].push(user);
    }

    console.log("\n📋 Checking for duplicates:");
    for (const [email, users] of Object.entries(emailMap)) {
      if (users.length > 1) {
        console.log(`\n⚠️ Duplicate email: ${email} (${users.length} users)`);
        
        // Keep the first one, delete others
        for (let i = 1; i < users.length; i++) {
          const dupUser = users[i];
          await Doctor.findOneAndDelete({ userId: dupUser._id });
          await User.findByIdAndDelete(dupUser._id);
          console.log(`✅ Deleted duplicate: ${dupUser.email} (${dupUser._id})`);
        }
      }
    }

    // 3. Verify final list
    const finalDoctors = await Doctor.find({}).populate("userId");
    console.log("\n📋 FINAL DOCTOR LIST:");
    finalDoctors.forEach((doc, i) => {
      if (doc.userId) {
        console.log(`\n[${i + 1}] ✅ Dr. ${doc.userId.firstname} ${doc.userId.lastname}`);
        console.log(`    Email: ${doc.userId.email}`);
        console.log(`    Specialization: ${doc.specialization}`);
        console.log(`    Profile ID: ${doc._id}`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

cleanupDoctors();