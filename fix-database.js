const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const fixDatabase = async () => {
  console.log("\n🔧 FIXING DATABASE ISSUES...\n");

  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    console.log("✅ Connected to MongoDB");

    // 1. Delete corrupted appointments
    const corruptedAppointments = await Appointment.deleteMany({
      $or: [
        { patientId: "65ffabc123456789abcd1234" },
        { doctorId: "698d63ebe1deee796c92bb36" }
      ]
    });
    console.log(`✅ Deleted ${corruptedAppointments.deletedCount} corrupted appointments`);

    // 2. Fix status names
    const updatedStatus = await Appointment.updateMany(
      { status: "admin_approved" },
      { $set: { status: "approved" } }
    );
    console.log(`✅ Fixed ${updatedStatus.modifiedCount} appointment status names`);

    // 3. Delete doctor profiles without valid userId
    const corruptedDoctors = await Doctor.deleteMany({
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });
    console.log(`✅ Deleted ${corruptedDoctors.deletedCount} corrupted doctor profiles`);

    // 4. Verify remaining data
    const appointments = await Appointment.countDocuments();
    const doctors = await Doctor.countDocuments();
    const users = await User.countDocuments();
    
    console.log("\n📊 DATABASE STATUS AFTER FIX:");
    console.log(`   Appointments: ${appointments}`);
    console.log(`   Doctors: ${doctors}`);
    console.log(`   Users: ${users}`);

    console.log("\n✅ Database fix completed successfully!");

  } catch (error) {
    console.error("❌ Error fixing database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixDatabase();