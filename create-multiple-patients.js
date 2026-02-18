const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
require("dotenv").config();

const createMultiplePatients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n👥 CREATING MULTIPLE PATIENT ACCOUNTS\n");

    const patients = [
      { firstname: "John", lastname: "Doe", email: "john.doe@test.com", password: "patient123" },
      { firstname: "Jane", lastname: "Smith", email: "jane.smith@test.com", password: "patient123" },
      { firstname: "Robert", lastname: "Johnson", email: "robert.j@test.com", password: "patient123" },
      { firstname: "Maria", lastname: "Garcia", email: "maria.g@test.com", password: "patient123" },
      { firstname: "David", lastname: "Brown", email: "david.b@test.com", password: "patient123" }
    ];

    let created = 0;
    let skipped = 0;

    for (const p of patients) {
      const existing = await User.findOne({ email: p.email });
      
      if (existing) {
        console.log(`⏭️  Already exists: ${p.email}`);
        skipped++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(p.password, 10);
      
      const patient = new User({
        firstname: p.firstname,
        lastname: p.lastname,
        email: p.email,
        password: hashedPassword,
        role: "patient",
        isAdmin: false,
        isDoctor: false,
        status: "accepted"
      });

      await patient.save();
      console.log(`✅ Created: ${p.email} (${p.firstname} ${p.lastname})`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   🔑 All passwords: patient123`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createMultiplePatients();