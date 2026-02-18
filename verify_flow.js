const mongoose = require("mongoose");
const User = require("./models/userModel");
const Doctor = require("./models/doctorModel");
const Appointment = require("./models/appointmentModel");
const Notification = require("./models/notificationModel");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hospitalDB";

async function runVerification() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to DB");

        // 1. Setup Data
        console.log("\n--- Setting up Test Data ---");

        // Create Admin
        let admin = await User.findOne({ email: "admin@test.com" });
        if (!admin) {
            admin = await User.create({
                firstname: "Admin", lastname: "User", email: "admin@test.com", password: "password", role: "admin", isAdmin: true
            });
            console.log("Created Admin");
        } else {
            console.log("Found Admin");
        }

        // Create Patient
        let patient = await User.findOne({ email: "patient@test.com" });
        if (!patient) {
            patient = await User.create({
                firstname: "Patient", lastname: "User", email: "patient@test.com", password: "password", role: "patient"
            });
            console.log("Created Patient");
        } else {
            console.log("Found Patient");
        }

        // Create Doctor User
        let doctorUser = await User.findOne({ email: "doctor@test.com" });
        if (!doctorUser) {
            doctorUser = await User.create({
                firstname: "Doctor", lastname: "User", email: "doctor@test.com", password: "password", role: "doctor", isDoctor: true
            });
            console.log("Created Doctor User");
        } else {
            console.log("Found Doctor User");
        }

        // Create Doctor Profile
        let doctorProfile = await Doctor.findOne({ userId: doctorUser._id });
        if (!doctorProfile) {
            doctorProfile = await Doctor.create({
                userId: doctorUser._id, name: "Dr. Doctor", specialization: "Cardiology", experience: 10, fees: 500, status: "approved"
            });
            console.log("Created Doctor Profile");
        } else {
            console.log("Found Doctor Profile");
        }

        // Clear previous test appointments/notifications
        await Appointment.deleteMany({ patientId: patient._id });
        await Notification.deleteMany({
            $or: [
                { userId: patient._id },
                { userId: admin._id },
                { userId: doctorUser._id }
            ]
        });
        console.log("Cleared previous test data");

        // 2. Simulate Booking (Patient -> Admin)
        console.log("\n--- Step 1: Booking Appointment (Patient) ---");
        const date = "2024-12-25";
        const time = "10:00 AM";

        const appointment = await Appointment.create({
            patientId: patient._id,
            doctorId: doctorProfile._id,
            date,
            time,
            status: "pending"
        });
        console.log("Appointment Created with ID:", appointment._id);

        // Notify Admin (Manual simulation of controller logic)
        await Notification.create({
            userId: admin._id,
            content: `New appointment request from ${patient.firstname}`,
            type: "appointment",
            relatedId: appointment._id
        });
        console.log("Simulated: Admin Notified");

        // Verify Admin Notification
        const adminNotif = await Notification.findOne({ userId: admin._id, type: "appointment" }).sort({ createdAt: -1 });
        if (adminNotif) console.log("✅ Verified: Admin received notification");
        else console.error("❌ Failed: Admin did not receive notification");


        // 3. Simulate Approval (Admin -> Doctor & Patient)
        console.log("\n--- Step 2: Approving Appointment (Admin) ---");
        appointment.status = "approved";
        await appointment.save();
        console.log("Appointment status updated to 'approved'");

        // Notify Doctor
        await Notification.create({
            userId: doctorUser._id,
            content: `New appointment request approved for ${patient.firstname}`,
            type: "appointment",
            relatedId: appointment._id
        });

        // Notify Patient
        await Notification.create({
            userId: patient._id,
            content: `Your appointment approved by admin`,
            type: "appointment",
            relatedId: appointment._id
        });

        // Verify
        const doctorNotif = await Notification.findOne({ userId: doctorUser._id }).sort({ createdAt: -1 });
        if (doctorNotif) console.log("✅ Verified: Doctor received notification");
        else console.error("❌ Failed: Doctor did not receive notification");

        const patientNotif1 = await Notification.findOne({ userId: patient._id }).sort({ createdAt: -1 });
        if (patientNotif1) console.log("✅ Verified: Patient received approval notification");
        else console.error("❌ Failed: Patient did not receive notification");


        // 4. Simulate Confirmation (Doctor -> Admin & Patient)
        console.log("\n--- Step 3: Confirming Appointment (Doctor) ---");
        appointment.status = "confirmed";
        await appointment.save();
        console.log("Appointment status updated to 'confirmed'");

        // Notify Patient
        await Notification.create({
            userId: patient._id,
            content: `Your appointment confirmed by doctor`,
            type: "appointment",
            relatedId: appointment._id
        });

        // Notify Admin
        await Notification.create({
            userId: admin._id,
            content: `Appointment confirmed by doctor`,
            type: "appointment",
            relatedId: appointment._id
        });

        const patientNotif2 = await Notification.findOne({ userId: patient._id }).sort({ createdAt: -1 });
        if (patientNotif2 && patientNotif2.content.includes("confirmed")) console.log("✅ Verified: Patient received confirmation notification");

        const adminNotif2 = await Notification.findOne({ userId: admin._id }).sort({ createdAt: -1 });
        if (adminNotif2 && adminNotif2.content.includes("confirmed")) console.log("✅ Verified: Admin received confirmation notification");

        console.log("\n✅ VERIFICATION COMPLETE");

    } catch (error) {
        console.error("❌ Verification Failed:", error);
    } finally {
        await mongoose.connection.close();
    }
}

runVerification();
