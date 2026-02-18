const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const auth = require("../middleware/auth");

// Public routes (require authentication)
router.post("/book", auth, appointmentController.bookAppointment);
router.get("/user-appointments", auth, appointmentController.getUserAppointments);
router.get("/doctor-appointments", auth, appointmentController.getDoctorAppointments);
router.get("/admin-appointments", auth, appointmentController.getAdminAppointments);
router.get("/:id", auth, appointmentController.getAppointmentById);

// Admin routes
router.put("/approve/:id", auth, appointmentController.approveAppointment);
router.put("/reject/:id", auth, appointmentController.rejectAppointment);

// Doctor routes
router.put("/confirm/:id", auth, appointmentController.confirmAppointment);
router.put("/complete/:id", auth, appointmentController.completeAppointment);

// Cancel route
router.put("/cancel/:id", auth, appointmentController.cancelAppointment);

module.exports = router;