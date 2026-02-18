const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    const adminEmail = "admin@healthbooker.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Password: admin123");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = new User({
      firstname: "Super",
      lastname: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      isDoctor: false,
      status: "accepted"
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@healthbooker.com");
    console.log("🔑 Password: admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();