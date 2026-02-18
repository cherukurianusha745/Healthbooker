const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");

// ============ BOOK APPOINTMENT (PATIENT) ============
// Patient books -> Admin notified
exports.bookAppointment = async (req, res) => {
  try {
    console.log("🔍 Booking appointment - User:", req.userId);
    const { doctorId, date, time } = req.body;

    // Validation
    if (!doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID, date and time are required"
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId).populate("userId");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Check if patient exists
    const patient = await User.findById(req.userId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Check for existing appointment at same date/time
    const existingAppointment = await Appointment.findOne({
      doctorId: doctorId,
      date: date,
      time: time,
      status: { $in: ["pending", "approved", "confirmed"] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: req.userId,
      doctorId: doctorId,
      date,
      time,
      status: "pending" // Initial status
    });

    await appointment.save();
    console.log("✅ Appointment created:", appointment._id);

    // Get all admins
    const admins = await User.find({ $or: [{ role: "admin" }, { isAdmin: true }] });
    console.log(`📨 Notifying ${admins.length} admins`);

    // Notify all admins
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        content: `New appointment request from ${patient.firstname} ${patient.lastname} with Dr. ${doctor.userId?.firstname} ${doctor.userId?.lastname} on ${date} at ${time}`,
        type: "appointment",
        relatedId: appointment._id,
        seen: false
      });
    }

    // Notify patient
    await Notification.create({
      userId: req.userId,
      content: `Your appointment request with Dr. ${doctor.userId?.firstname} ${doctor.userId?.lastname} for ${date} at ${time} has been submitted. Waiting for admin approval.`,
      type: "appointment",
      relatedId: appointment._id,
      seen: false
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully! Waiting for admin approval.",
      appointmentId: appointment._id
    });

  } catch (error) {
    console.error("❌ Error in bookAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ GET ADMIN APPOINTMENTS ============
exports.getAdminAppointments = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.role !== "admin" && !user.isAdmin)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const appointments = await Appointment.find({})
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      })
      .populate("patientId", "firstname lastname email mobile")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {
    console.error("❌ Error in getAdminAppointments:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ APPROVE APPOINTMENT (ADMIN) ============
// Admin approves -> Doctor & Patient notified
exports.approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patientId")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Update status
    appointment.status = "approved";
    await appointment.save();

    // Notify doctor
    await Notification.create({
      userId: appointment.doctorId.userId._id,
      content: `New appointment request from ${appointment.patientId.firstname} ${appointment.patientId.lastname} for ${appointment.date} at ${appointment.time}. Please confirm.`,
      type: "appointment",
      relatedId: appointment._id,
      seen: false
    });

    // Notify patient
    await Notification.create({
      userId: appointment.patientId._id,
      content: `Your appointment for ${appointment.date} at ${appointment.time} has been approved by admin and sent to the doctor for confirmation.`,
      type: "appointment",
      relatedId: appointment._id,
      seen: false
    });

    res.status(200).json({
      success: true,
      message: "Appointment approved successfully and sent to doctor"
    });

  } catch (error) {
    console.error("❌ Error in approveAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ CONFIRM APPOINTMENT (DOCTOR) ============
// Doctor confirms -> Admin & Patient notified
exports.confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patientId")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Verify doctor
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to confirm this appointment"
      });
    }

    // Update status
    appointment.status = "confirmed";
    await appointment.save();

    // Notify patient
    await Notification.create({
      userId: appointment.patientId._id,
      content: `Your appointment with Dr. ${appointment.doctorId.userId.firstname} ${appointment.doctorId.userId.lastname} for ${appointment.date} at ${appointment.time} has been confirmed.`,
      type: "appointment",
      relatedId: appointment._id,
      seen: false
    });

    // Notify admins
    const admins = await User.find({ $or: [{ role: "admin" }, { isAdmin: true }] });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        content: `Appointment confirmed by Dr. ${appointment.doctorId.userId.firstname} ${appointment.doctorId.userId.lastname} for ${appointment.date} at ${appointment.time}`,
        type: "appointment",
        relatedId: appointment._id,
        seen: false
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment confirmed successfully"
    });

  } catch (error) {
    console.error("❌ Error in confirmAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ COMPLETE APPOINTMENT (DOCTOR) ============
exports.completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required"
      });
    }

    const appointment = await Appointment.findById(id)
      .populate("patientId")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Verify doctor
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this appointment"
      });
    }

    // Update status
    appointment.status = "completed";
    await appointment.save();

    // Notify patient
    await Notification.create({
      userId: appointment.patientId._id,
      content: `Your appointment with Dr. ${appointment.doctorId.userId.firstname} ${appointment.doctorId.userId.lastname} has been completed.`,
      type: "appointment",
      relatedId: appointment._id,
      seen: false
    });

    res.status(200).json({
      success: true,
      message: "Appointment completed successfully"
    });

  } catch (error) {
    console.error("❌ Error in completeAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ GET USER APPOINTMENTS (PATIENT) ============
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.userId })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email specialization"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {
    console.error("❌ Error in getUserAppointments:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ GET DOCTOR APPOINTMENTS ============
exports.getDoctorAppointments = async (req, res) => {
  try {
    // Find doctor profile
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    // Get appointments for this doctor
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("patientId", "firstname lastname email mobile")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {
    console.error("❌ Error in getDoctorAppointments:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ GET APPOINTMENT BY ID ============
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      })
      .populate("patientId", "firstname lastname email mobile");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("❌ Error in getAppointmentById:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ CANCEL APPOINTMENT ============
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patientId")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if user is authorized to cancel
    if (appointment.patientId._id.toString() !== req.userId) {
      const user = await User.findById(req.userId);
      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to cancel this appointment"
        });
      }
    }

    // Only allow cancellation of pending or approved appointments
    if (!["pending", "approved"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel appointment at this stage"
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Notify relevant parties
    if (appointment.patientId._id.toString() === req.userId) {
      // Patient cancelled - notify doctor and admin
      const admins = await User.find({ $or: [{ role: "admin" }, { isAdmin: true }] });
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          content: `Appointment cancelled by patient ${appointment.patientId.firstname} ${appointment.patientId.lastname}`,
          type: "appointment",
          relatedId: appointment._id,
          seen: false
        });
      }

      await Notification.create({
        userId: appointment.doctorId.userId._id,
        content: `Appointment cancelled by patient ${appointment.patientId.firstname} ${appointment.patientId.lastname}`,
        type: "appointment",
        relatedId: appointment._id,
        seen: false
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    console.error("❌ Error in cancelAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ REJECT APPOINTMENT ============
exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patientId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    appointment.status = "rejected";
    await appointment.save();

    // Notify patient
    await Notification.create({
      userId: appointment.patientId._id,
      content: `Your appointment on ${appointment.date} at ${appointment.time} has been rejected.`,
      type: "appointment",
      relatedId: appointment._id,
      seen: false
    });

    res.status(200).json({
      success: true,
      message: "Appointment rejected successfully"
    });

  } catch (error) {
    console.error("❌ Error in rejectAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}