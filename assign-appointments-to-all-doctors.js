const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
require("dotenv").config();

const assignAppointmentsToAllDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthbooker");
    
    console.log("\n🔄 ASSIGNING APPOINTMENTS TO ALL DOCTORS\n");
    console.log("=".repeat(60));

    // Get all appointments
    const appointments = await Appointment.find({ status: "approved" });
    console.log(`📊 Total approved appointments: ${appointments.length}\n`);

    // Define doctor mapping based on specialization
    const doctorMapping = [
      { email: "dr.smith@healthbooker.com", specialty: "Cardiologist", count: 0 },
      { email: "dr.rodriguez@healthbooker.com", specialty: "Dermatologist", count: 0 },
      { email: "dr.chen@healthbooker.com", specialty: "Neurologist", count: 0 },
      { email: "dr.wilson@healthbooker.com", specialty: "Pediatrician", count: 0 },
      { email: "dr.patel@healthbooker.com", specialty: "Ophthalmologist", count: 0 },
      { email: "cherukurianusha@gmail.com", specialty: "Cardiologist", count: 0 }
    ];

    // Get doctor profiles
    const doctors = [];
    for (const doc of doctorMapping) {
      const user = await User.findOne({ email: doc.email });
      if (user) {
        let profile = await Doctor.findOne({ userId: user._id });
        
        if (!profile) {
          console.log(`⚠️ Creating profile for ${doc.email}`);
          profile = new Doctor({
            userId: user._id,
            specialization: doc.specialty,
            experience: 5,
            fees: 400,
            isDoctor: true,
            status: "approved"
          });
          await profile.save();
        }
        
        doctors.push({
          email: doc.email,
          name: `${user.firstname} ${user.lastname}`,
          profileId: profile._id,
          specialty: doc.specialty,
          count: 0
        });
        
        console.log(`✅ Loaded: ${doc.email} -> Profile ID: ${profile._id}`);
      } else {
        console.log(`❌ User not found: ${doc.email}`);
      }
    }

    console.log("\n📋 Doctors loaded:", doctors.length);

    // Distribute appointments round-robin
    let doctorIndex = 0;
    for (const appointment of appointments) {
      const doctor = doctors[doctorIndex % doctors.length];
      
      console.log(`\n🔄 Assigning appointment ${appointment._id}`);
      console.log(`   From doctor ID: ${appointment.doctorId}`);
      console.log(`   To doctor: ${doctor.name} (${doctor.email})`);
      console.log(`   Profile ID: ${doctor.profileId}`);
      
      appointment.doctorId = doctor.profileId;
      await appointment.save();
      
      doctor.count++;
      doctorIndex++;
    }

    console.log("\n📊 FINAL DISTRIBUTION:");
    doctors.forEach(doc => {
      console.log(`\n👨‍⚕️ ${doc.name} (${doc.email})`);
      console.log(`   Profile ID: ${doc.profileId}`);
      console.log(`   Appointments assigned: ${doc.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

assignAppointmentsToAllDoctors();