const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const createDoctorUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n👨‍⚕️ CREATING DOCTOR USER ACCOUNTS\n");
    console.log("=".repeat(60));

    // Get all orphaned doctor profiles
    const doctorProfiles = await Doctor.find({});
    console.log(`📊 Found ${doctorProfiles.length} doctor profiles\n`);

    let created = 0;
    let skipped = 0;

    for (const profile of doctorProfiles) {
      // Check if this profile already has a user
      if (profile.userId) {
        const existingUser = await User.findById(profile.userId);
        if (existingUser) {
          console.log(`✅ Profile ${profile._id} already has user: ${existingUser.email}`);
          skipped++;
          continue;
        }
      }

      // Generate email based on specialization
      let email = "";
      let firstname = "";
      let lastname = "";

      switch(profile.specialization) {
        case "Cardiologist":
          email = "cardiologist@healthbooker.com";
          firstname = "Heart";
          lastname = "Specialist";
          break;
        case "Neurologist":
          email = "neurologist@healthbooker.com";
          firstname = "Brain";
          lastname = "Expert";
          break;
        case "Pediatrician":
          email = "pediatrician@healthbooker.com";
          firstname = "Child";
          lastname = "Doctor";
          break;
        case "Dermatologist":
          email = "dermatologist@healthbooker.com";
          firstname = "Skin";
          lastname = "Care";
          break;
        case "Gynecologist":
          email = "gynecologist@healthbooker.com";
          firstname = "Women";
          lastname = "Health";
          break;
        case "Orthopedic Surgeon":
          email = "orthopedic@healthbooker.com";
          firstname = "Bone";
          lastname = "Specialist";
          break;
        case "Ophthalmologist":
          email = "ophthalmologist@healthbooker.com";
          firstname = "Eye";
          lastname = "Doctor";
          break;
        case "Neurosurgeon":
          email = "neurosurgeon@healthbooker.com";
          firstname = "Brain";
          lastname = "Surgeon";
          break;
        case "Dentist":
          email = "dentist@healthbooker.com";
          firstname = "Dental";
          lastname = "Expert";
          break;
        case "General Physician":
          email = "general@healthbooker.com";
          firstname = "General";
          lastname = "Doctor";
          break;
        case "Sports Medicine":
          email = "sports@healthbooker.com";
          firstname = "Sports";
          lastname = "Medicine";
          break;
        default:
          email = `doctor${created + 1}@healthbooker.com`;
          firstname = "Doctor";
          lastname = profile.specialization;
      }

      // Make email unique by adding timestamp
      email = email.replace('@', `${Date.now()}@`);
      
      // Create user
      const hashedPassword = await bcrypt.hash("doctor123", 10);
      
      const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: "doctor",
        isDoctor: true,
        isAdmin: false,
        status: "accepted"
      });

      await newUser.save();
      console.log(`\n✅ Created user for ${profile.specialization}:`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: doctor123`);
      console.log(`   User ID: ${newUser._id}`);

      // Link profile to user
      profile.userId = newUser._id;
      await profile.save();
      console.log(`   ✅ Linked to profile: ${profile._id}`);
      
      created++;
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ Created: ${created} doctor users`);
    console.log(`   ⏭️  Skipped: ${skipped} already linked`);
    console.log(`   🔑 All passwords: doctor123`);
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createDoctorUsers();