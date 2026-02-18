// // // const Doctor = require("../models/doctorModel");
// // // const User = require("../models/userModel");
// // // const Notification = require("../models/notificationModel");
// // // const Appointment = require("../models/appointmentModel");

// // // const getalldoctors = async (req, res) => {
// // //   try {
// // //     let docs;
// // //     if (!req.locals) {
// // //       docs = await Doctor.find({ isDoctor: true }).populate("userId");
// // //     } else {
// // //       docs = await Doctor.find({ isDoctor: true })
// // //         .find({
// // //           _id: { $ne: req.locals },
// // //         })
// // //         .populate("userId");
// // //     }

// // //     return res.send(docs);
// // //   } catch (error) {
// // //     res.status(500).send("Unable to get doctors");
// // //   }
// // // };

// // // const getnotdoctors = async (req, res) => {
// // //   try {
// // //     const docs = await Doctor.find({ isDoctor: false })
// // //       .find({
// // //         _id: { $ne: req.locals },
// // //       })
// // //       .populate("userId");

// // //     return res.send(docs);
// // //   } catch (error) {
// // //     res.status(500).send("Unable to get non doctors");
// // //   }
// // // };

// // // const applyfordoctor = async (req, res) => {
// // //   try {
// // //     const alreadyFound = await Doctor.findOne({ userId: req.locals });
// // //     if (alreadyFound) {
// // //       return res.status(400).send("Application already exists");
// // //     }

// // //     const doctor = Doctor({ ...req.body.formDetails, userId: req.locals });
// // //     const result = await doctor.save();

// // //     return res.status(201).send("Application submitted successfully");
// // //   } catch (error) {
// // //     res.status(500).send("Unable to submit application");
// // //   }
// // // };

// // // const acceptdoctor = async (req, res) => {
// // //   try {
// // //     const user = await User.findOneAndUpdate(
// // //       { _id: req.body.id },
// // //       { isDoctor: true, status: "accepted" }
// // //     );

// // //     const doctor = await Doctor.findOneAndUpdate(
// // //       { userId: req.body.id },
// // //       { isDoctor: true }
// // //     );

// // //     const notification = await Notification({
// // //       userId: req.body.id,
// // //       content: `Congratulations, Your application has been accepted.`,
// // //     });

// // //     await notification.save();

// // //     return res.status(201).send("Application accepted notification sent");
// // //   } catch (error) {
// // //     res.status(500).send("Error while sending notification");
// // //   }
// // // };

// // // const rejectdoctor = async (req, res) => {
// // //   try {
// // //     const details = await User.findOneAndUpdate(
// // //       { _id: req.body.id },
// // //       { isDoctor: false, status: "rejected" }
// // //     );
// // //     const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });

// // //     const notification = await Notification({
// // //       userId: req.body.id,
// // //       content: `Sorry, Your application has been rejected.`,
// // //     });

// // //     await notification.save();

// // //     return res.status(201).send("Application rejection notification sent");
// // //   } catch (error) {
// // //     res.status(500).send("Error while rejecting application");
// // //   }
// // // };

// // // const deletedoctor = async (req, res) => {
// // //   try {
// // //     const result = await User.findByIdAndUpdate(req.body.userId, {
// // //       isDoctor: false,
// // //     });
// // //     const removeDoc = await Doctor.findOneAndDelete({
// // //       userId: req.body.userId,
// // //     });
// // //     const removeAppoint = await Appointment.findOneAndDelete({
// // //       userId: req.body.userId,
// // //     });
// // //     return res.send("Doctor deleted successfully");
// // //   } catch (error) {
// // //     console.log("error", error);
// // //     res.status(500).send("Unable to delete doctor");
// // //   }
// // // };

// // // module.exports = {
// // //   getalldoctors,
// // //   getnotdoctors,
// // //   deletedoctor,
// // //   applyfordoctor,
// // //   acceptdoctor,
// // //   rejectdoctor,
// // // };
// // const Doctor = require("../models/doctorModel");
// // const User = require("../models/userModel");
// // const Notification = require("../models/notificationModel");

// // // ============ GET APPROVED DOCTORS (PUBLIC) ============
// // exports.getApprovedDoctors = async (req, res) => {
// //   try {
// //     console.log("🔍 Fetching approved doctors...");
    
// //     const doctors = await Doctor.find({ status: "approved", isDoctor: true })
// //       .populate("userId", "firstname lastname email pic");

// //     const formattedDoctors = doctors.map((doc) => ({
// //       _id: doc._id,
// //       name: `Dr. ${doc.userId?.firstname || ""} ${doc.userId?.lastname || ""}`.trim(),
// //       specialization: doc.specialization,
// //       experience: doc.experience,
// //       fees: doc.fees,
// //       email: doc.userId?.email,
// //       userId: doc.userId?._id,
// //     }));

// //     console.log(`✅ Found ${formattedDoctors.length} approved doctors`);
// //     res.status(200).json(formattedDoctors);
// //   } catch (error) {
// //     console.error("❌ Error in getApprovedDoctors:", error);
// //     res.status(500).json({ message: "Unable to get doctors" });
// //   }
// // };

// // // ============ GET PENDING DOCTORS (ADMIN ONLY) ============
// // exports.getPendingDoctors = async (req, res) => {
// //   try {
// //     console.log("🔍 Fetching pending doctors...");
    
// //     // Check if user is admin
// //     const user = await User.findById(req.userId);
// //     if (!user || (user.role !== "admin" && !user.isAdmin)) {
// //       return res.status(403).json({ message: "Access denied. Admin only." });
// //     }

// //     const doctors = await Doctor.find({ status: "pending" })
// //       .populate("userId", "firstname lastname email pic createdAt");
    
// //     console.log(`✅ Found ${doctors.length} pending applications`);
// //     res.status(200).json(doctors);
// //   } catch (error) {
// //     console.error("❌ Error in getPendingDoctors:", error);
// //     res.status(500).json({ message: "Unable to get pending doctors" });
// //   }
// // };

// // // ============ APPLY FOR DOCTOR (PATIENT) ============
// // // ============ APPLY FOR DOCTOR (PATIENT) ============
// // exports.applyForDoctor = async (req, res) => {
// //   try {
// //     console.log("🔍 ===== APPLY FOR DOCTOR =====");
// //     console.log("📧 User ID:", req.userId);
// //     console.log("📦 Request body:", req.body);
    
// //     const { specialization, experience, fees } = req.body;

// //     // Validation
// //     if (!specialization || !experience || !fees) {
// //       console.log("❌ Missing fields:", { specialization, experience, fees });
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "All fields are required" 
// //       });
// //     }

// //     // Check if user already has an application
// //     console.log("🔍 Checking existing applications...");
// //     const existingApplication = await Doctor.findOne({ userId: req.userId });
    
// //     if (existingApplication) {
// //       console.log("❌ Existing application found:", existingApplication._id);
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "You already have a pending application" 
// //       });
// //     }

// //     // Get user details
// //     const applicant = await User.findById(req.userId);
// //     if (!applicant) {
// //       console.log("❌ User not found:", req.userId);
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     // Create new doctor application
// //     console.log("📝 Creating new doctor application...");
// //     const doctor = new Doctor({
// //       userId: req.userId,
// //       specialization,
// //       experience: parseInt(experience),
// //       fees: parseInt(fees),
// //       status: "pending",
// //       isDoctor: false
// //     });

// //     await doctor.save();
// //     console.log("✅ Doctor application created:", doctor._id);

// //     // Update user status
// //     await User.findByIdAndUpdate(req.userId, { status: "pending" });
// //     console.log("✅ User status updated to pending");

// //     // Notify all admins
// //     console.log("🔍 Finding admins to notify...");
// //     const admins = await User.find({ role: "admin" });
// //     console.log(`👥 Found ${admins.length} admins`);
    
// //     for (const admin of admins) {
// //       await Notification.create({
// //         userId: admin._id,
// //         content: `New doctor application received from ${applicant.firstname} ${applicant.lastname} - ${specialization} (${experience} years, $${fees})`,
// //         type: "doctor_application",
// //         seen: false
// //       });
// //       console.log(`✅ Notification sent to admin: ${admin.email}`);
// //     }

// //     console.log("✅ Doctor application submitted successfully");
// //     res.status(201).json({ 
// //       success: true, 
// //       message: "Application submitted successfully. Waiting for admin approval." 
// //     });

// //   } catch (error) {
// //     console.error("❌ ERROR in applyForDoctor:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Unable to submit application",
// //       error: error.message 
// //     });
// //   }
// // };
// // // ============ ACCEPT DOCTOR (ADMIN ONLY) ============
// // exports.acceptDoctor = async (req, res) => {
// //   try {
// //     console.log("🔍 Accepting doctor application...");
// //     const { userId } = req.body;

// //     // Check if user is admin
// //     const admin = await User.findById(req.userId);
// //     if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
// //       return res.status(403).json({ message: "Access denied. Admin only." });
// //     }

// //     // Update user to doctor
// //     const user = await User.findByIdAndUpdate(
// //       userId,
// //       { 
// //         isDoctor: true, 
// //         status: "accepted", 
// //         role: "doctor" 
// //       },
// //       { new: true }
// //     );

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Update doctor application
// //     await Doctor.findOneAndUpdate(
// //       { userId },
// //       { 
// //         isDoctor: true, 
// //         status: "approved" 
// //       }
// //     );

// //     // Send notification
// //     await Notification.create({
// //       userId: userId,
// //       content: `Congratulations Dr. ${user.firstname} ${user.lastname}! Your doctor application has been approved.`,
// //       type: "doctor_application",
// //       seen: false
// //     });

// //     console.log("✅ Doctor approved successfully");
// //     res.status(200).json({ 
// //       success: true, 
// //       message: "Doctor approved successfully" 
// //     });
// //   } catch (error) {
// //     console.error("❌ Error in acceptDoctor:", error);
// //     res.status(500).json({ message: "Error while accepting doctor" });
// //   }
// // };

// // // ============ REJECT DOCTOR (ADMIN ONLY) ============
// // exports.rejectDoctor = async (req, res) => {
// //   try {
// //     console.log("🔍 Rejecting doctor application...");
// //     const { userId } = req.body;

// //     // Check if user is admin
// //     const admin = await User.findById(req.userId);
// //     if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
// //       return res.status(403).json({ message: "Access denied. Admin only." });
// //     }

// //     // Update user
// //     await User.findByIdAndUpdate(userId, { 
// //       isDoctor: false, 
// //       status: "rejected",
// //       role: "patient" 
// //     });

// //     // Delete doctor application
// //     await Doctor.findOneAndDelete({ userId });

// //     // Send notification
// //     await Notification.create({
// //       userId: userId,
// //       content: `Your doctor application has been rejected. Please contact admin for more information.`,
// //       type: "doctor_application",
// //       seen: false
// //     });

// //     console.log("✅ Doctor rejected successfully");
// //     res.status(200).json({ 
// //       success: true, 
// //       message: "Doctor rejected successfully" 
// //     });
// //   } catch (error) {
// //     console.error("❌ Error in rejectDoctor:", error);
// //     res.status(500).json({ message: "Error while rejecting doctor" });
// //   }
// // };

// // // ============ GET DOCTOR PROFILE (DOCTOR ONLY) ============
// // // ============ GET DOCTOR PROFILE ============
// // exports.getDoctorProfile = async (req, res) => {
// //   try {
// //     console.log("🔍 Fetching doctor profile for user:", req.userId);

// //     const doctor = await Doctor.findOne({ userId: req.userId })
// //       .populate("userId", "firstname lastname email pic mobile address");
    
// //     if (!doctor) {
// //       console.log("❌ Doctor profile not found for user:", req.userId);
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "Doctor profile not found" 
// //       });
// //     }
    
// //     console.log("✅ Doctor profile found:", doctor._id);
// //     res.status(200).json(doctor);
// //   } catch (error) {
// //     console.error("❌ Error in getDoctorProfile:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Unable to get doctor profile",
// //       error: error.message 
// //     });
// //   }
// // };

// // // ============ UPDATE DOCTOR PROFILE (DOCTOR ONLY) ============
// // exports.updateDoctorProfile = async (req, res) => {
// //   try {
// //     console.log("🔍 Updating doctor profile...");
// //     const { specialization, experience, fees } = req.body;
    
// //     const doctor = await Doctor.findOneAndUpdate(
// //       { userId: req.userId },
// //       { specialization, experience, fees },
// //       { new: true }
// //     );
    
// //     if (!doctor) {
// //       return res.status(404).json({ message: "Doctor profile not found" });
// //     }
    
// //     console.log("✅ Doctor profile updated successfully");
// //     res.status(200).json({ 
// //       success: true, 
// //       message: "Profile updated successfully",
// //       doctor 
// //     });
// //   } catch (error) {
// //     console.error("❌ Error in updateDoctorProfile:", error);
// //     res.status(500).json({ message: "Unable to update doctor profile" });
// //   }
// // };
// // controllers/doctorController.js
// // const Doctor = require("../models/Doctor");
// // const User = require("../models/User");

// // // ============ EXISTING METHODS ============
// // exports.applyForDoctor = async (req, res) => {
// //   // Your existing code
// // };

// // exports.getApprovedDoctors = async (req, res) => {
// //   try {
// //     const doctors = await Doctor.find({ status: "approved" });
// //     res.json(doctors);
// //   } catch (error) {
// //     res.status(500).json({ 
// //       success: false, 
// //       message: error.message 
// //     });
// //   }
// // };

// // // ============ NEW UPDATE METHODS ============

// // // 1. UPDATE DOCTOR BY ID (Full update - Admin only)
// // exports.updateDoctor = async (req, res) => {
// //   try {
// //     const doctorId = req.params.id;
// //     const updateData = req.body;
    
// //     // Remove fields that shouldn't be updated directly
// //     delete updateData._id;
// //     delete updateData.createdAt;
    
// //     // Validate required fields
// //     if (updateData.experience && isNaN(updateData.experience)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Experience must be a number"
// //       });
// //     }
    
// //     if (updateData.fees && isNaN(updateData.fees)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Fees must be a number"
// //       });
// //     }
    
// //     const updatedDoctor = await Doctor.findByIdAndUpdate(
// //       doctorId,
// //       { $set: updateData },
// //       { new: true, runValidators: true } // Return updated document
// //     );
    
// //     if (!updatedDoctor) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Doctor not found"
// //       });
// //     }
    
// //     res.json({
// //       success: true,
// //       message: "Doctor updated successfully",
// //       doctor: updatedDoctor
// //     });
    
// //   } catch (error) {
// //     console.error("Error updating doctor:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };

// // // 2. UPDATE DOCTOR PROFILE (Doctors updating their own profile)
// // exports.updateMyProfile = async (req, res) => {
// //   try {
// //     const userId = req.user.id; // From auth middleware
    
// //     const doctor = await Doctor.findOne({ userId });
    
// //     if (!doctor) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Doctor profile not found"
// //       });
// //     }
    
// //     // Fields doctors can update
// //     const allowedUpdates = {
// //       specialization: req.body.specialization,
// //       experience: req.body.experience,
// //       fees: req.body.fees,
// //       timing: req.body.timing,
// //       qualification: req.body.qualification,
// //       hospital: req.body.hospital,
// //       bio: req.body.bio
// //     };
    
// //     // Remove undefined fields
// //     Object.keys(allowedUpdates).forEach(key => 
// //       allowedUpdates[key] === undefined && delete allowedUpdates[key]
// //     );
    
// //     const updatedDoctor = await Doctor.findByIdAndUpdate(
// //       doctor._id,
// //       { $set: allowedUpdates },
// //       { new: true, runValidators: true }
// //     );
    
// //     res.json({
// //       success: true,
// //       message: "Profile updated successfully",
// //       doctor: updatedDoctor
// //     });
    
// //   } catch (error) {
// //     console.error("Error updating profile:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };

// // // 3. UPDATE DOCTOR STATUS (Admin only - PATCH)
// // exports.updateDoctorStatus = async (req, res) => {
// //   try {
// //     const doctorId = req.params.id;
// //     const { status } = req.body;
    
// //     if (!["pending", "approved", "rejected"].includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid status value"
// //       });
// //     }
    
// //     const updatedDoctor = await Doctor.findByIdAndUpdate(
// //       doctorId,
// //       { $set: { status } },
// //       { new: true }
// //     );
    
// //     // If approving, update user role
// //     if (status === "approved" && updatedDoctor.userId) {
// //       await User.findByIdAndUpdate(
// //         updatedDoctor.userId,
// //         { $set: { role: "doctor" } }
// //       );
// //     }
    
// //     res.json({
// //       success: true,
// //       message: `Doctor status updated to ${status}`,
// //       doctor: updatedDoctor
// //     });
    
// //   } catch (error) {
// //     console.error("Error updating status:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };

// // // 4. BULK UPDATE DOCTORS (Admin only)
// // exports.bulkUpdateDoctors = async (req, res) => {
// //   try {
// //     const { doctorIds, updateData } = req.body;
    
// //     if (!doctorIds || !Array.isArray(doctorIds) || doctorIds.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please provide an array of doctor IDs"
// //       });
// //     }
    
// //     const result = await Doctor.updateMany(
// //       { _id: { $in: doctorIds } },
// //       { $set: updateData },
// //       { runValidators: true }
// //     );
    
// //     res.json({
// //       success: true,
// //       message: `Updated ${result.modifiedCount} doctors`,
// //       result
// //     });
    
// //   } catch (error) {
// //     console.error("Error in bulk update:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };

// // // 5. GET SINGLE DOCTOR BY ID
// // exports.getDoctorById = async (req, res) => {
// //   try {
// //     const doctorId = req.params.id;
    
// //     const doctor = await Doctor.findById(doctorId);
    
// //     if (!doctor) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Doctor not found"
// //       });
// //     }
    
// //     res.json({
// //       success: true,
// //       doctor
// //     });
    
// //   } catch (error) {
// //     console.error("Error fetching doctor:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };
// const Doctor = require("../models/doctorModel");
// const User = require("../models/userModel");

// // ============ EXISTING METHODS ============
// exports.applyForDoctor = async (req, res) => {
//   try {
//     const { specialization, experience, fees, timing, qualification, hospital } = req.body;
//     const userId = req.user._id;
//     const user = req.user;

//     // Check if already applied
//     const existingDoctor = await Doctor.findOne({ userId });
//     if (existingDoctor) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already applied for doctor"
//       });
//     }

//     // Create doctor application with name from user
//     const newDoctor = new Doctor({
//       userId,
//       name: `${user.firstname} ${user.lastname}`.trim(),
//       specialization,
//       experience: Number(experience),
//       fees: Number(fees),
//       timing: timing || "morning",
//       qualification: qualification || "",
//       hospital: hospital || "",
//       status: "pending"
//     });

//     await newDoctor.save();

//     res.status(201).json({
//       success: true,
//       message: "Application submitted successfully"
//     });
//   } catch (error) {
//     console.error("Error applying for doctor:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// exports.getApprovedDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find({ status: "approved" })
//       .populate("userId", "firstname lastname email");
    
//     // Format the response to ensure name is always present
//     const formattedDoctors = doctors.map(doc => {
//       const docObj = doc.toObject();
      
//       // If name doesn't exist, construct from userId
//       if (!docObj.name && docObj.userId) {
//         docObj.name = `${docObj.userId.firstname || ''} ${docObj.userId.lastname || ''}`.trim();
//       }
      
//       // If still no name, use a default
//       if (!docObj.name || docObj.name === '') {
//         docObj.name = `Dr. ${docObj.specialization || 'Doctor'}`;
//       }
      
//       return docObj;
//     });
    
//     res.json(formattedDoctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// exports.getPendingDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find({ status: "pending" })
//       .populate("userId", "firstname lastname email");
    
//     const formattedDoctors = doctors.map(doc => {
//       const docObj = doc.toObject();
//       if (!docObj.name && docObj.userId) {
//         docObj.name = `${docObj.userId.firstname || ''} ${docObj.userId.lastname || ''}`.trim();
//       }
//       return docObj;
//     });
    
//     res.json(formattedDoctors);
//   } catch (error) {
//     console.error("Error fetching pending doctors:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// exports.acceptDoctor = async (req, res) => {
//   try {
//     const { userId } = req.body;
    
//     const doctor = await Doctor.findOne({ userId });
//     if (!doctor) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Doctor application not found" 
//       });
//     }

//     doctor.status = "approved";
//     await doctor.save();

//     // Update user role to doctor
//     await User.findByIdAndUpdate(userId, { role: "doctor" });

//     res.json({ 
//       success: true, 
//       message: "Doctor approved successfully" 
//     });
//   } catch (error) {
//     console.error("Error accepting doctor:", error);
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// exports.rejectDoctor = async (req, res) => {
//   try {
//     const { userId } = req.body;
    
//     const doctor = await Doctor.findOne({ userId });
//     if (!doctor) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Doctor application not found" 
//       });
//     }

//     doctor.status = "rejected";
//     await doctor.save();

//     res.json({ 
//       success: true, 
//       message: "Doctor application rejected" 
//     });
//   } catch (error) {
//     console.error("Error rejecting doctor:", error);
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// exports.getDoctorProfile = async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ userId: req.user._id })
//       .populate("userId", "firstname lastname email");
    
//     if (!doctor) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Doctor profile not found" 
//       });
//     }

//     res.json(doctor);
//   } catch (error) {
//     console.error("Error fetching doctor profile:", error);
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// // ============ NEW UPDATE METHODS ============

// // 1. GET SINGLE DOCTOR BY ID
// exports.getDoctorById = async (req, res) => {
//   try {
//     const doctorId = req.params.id;
    
//     const doctor = await Doctor.findById(doctorId)
//       .populate("userId", "firstname lastname email");
    
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found"
//       });
//     }
    
//     // Format the doctor object
//     const doctorObj = doctor.toObject();
//     if (!doctorObj.name && doctorObj.userId) {
//       doctorObj.name = `${doctorObj.userId.firstname || ''} ${doctorObj.userId.lastname || ''}`.trim();
//     }
    
//     res.json({
//       success: true,
//       doctor: doctorObj
//     });
    
//   } catch (error) {
//     console.error("Error fetching doctor:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // 2. UPDATE DOCTOR BY ID
// exports.updateDoctor = async (req, res) => {
//   try {
//     const doctorId = req.params.id;
//     const updateData = req.body;
    
//     // Remove fields that shouldn't be updated
//     delete updateData._id;
//     delete updateData.createdAt;
//     delete updateData.updatedAt;
    
//     // Validate numeric fields
//     if (updateData.experience && isNaN(updateData.experience)) {
//       return res.status(400).json({
//         success: false,
//         message: "Experience must be a number"
//       });
//     }
    
//     if (updateData.fees && isNaN(updateData.fees)) {
//       return res.status(400).json({
//         success: false,
//         message: "Fees must be a number"
//       });
//     }
    
//     const updatedDoctor = await Doctor.findByIdAndUpdate(
//       doctorId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).populate("userId", "firstname lastname email");
    
//     if (!updatedDoctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found"
//       });
//     }
    
//     res.json({
//       success: true,
//       message: "Doctor updated successfully",
//       doctor: updatedDoctor
//     });
    
//   } catch (error) {
//     console.error("Error updating doctor:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // 3. UPDATE DOCTOR STATUS
// exports.updateDoctorStatus = async (req, res) => {
//   try {
//     const doctorId = req.params.id;
//     const { status } = req.body;
    
//     if (!["pending", "approved", "rejected"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value"
//       });
//     }
    
//     const updatedDoctor = await Doctor.findByIdAndUpdate(
//       doctorId,
//       { $set: { status } },
//       { new: true }
//     ).populate("userId", "firstname lastname email");
    
//     if (!updatedDoctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found"
//       });
//     }
    
//     // If approving, update user role
//     if (status === "approved" && updatedDoctor.userId) {
//       await User.findByIdAndUpdate(
//         updatedDoctor.userId._id,
//         { $set: { role: "doctor" } }
//       );
//     }
    
//     res.json({
//       success: true,
//       message: `Doctor status updated to ${status}`,
//       doctor: updatedDoctor
//     });
    
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // 4. BULK UPDATE DOCTORS
// exports.bulkUpdateDoctors = async (req, res) => {
//   try {
//     const { doctorIds, updateData } = req.body;
    
//     if (!doctorIds || !Array.isArray(doctorIds) || doctorIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide an array of doctor IDs"
//       });
//     }
    
//     // Remove empty values
//     const cleanUpdateData = {};
//     Object.keys(updateData).forEach(key => {
//       if (updateData[key] !== "" && updateData[key] !== null && updateData[key] !== undefined) {
//         if (key === "fees" || key === "experience") {
//           cleanUpdateData[key] = Number(updateData[key]);
//         } else {
//           cleanUpdateData[key] = updateData[key];
//         }
//       }
//     });
    
//     const result = await Doctor.updateMany(
//       { _id: { $in: doctorIds } },
//       { $set: cleanUpdateData },
//       { runValidators: true }
//     );
    
//     res.json({
//       success: true,
//       message: `Updated ${result.modifiedCount} out of ${result.matchedCount} doctors`,
//       result
//     });
    
//   } catch (error) {
//     console.error("Error in bulk update:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

exports.getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved", isDoctor: true })
      .populate("userId", "firstname lastname email pic");

    const formattedDoctors = doctors.map((doc) => ({
      _id: doc._id,
      name: `${doc.userId?.firstname || ""} ${doc.userId?.lastname || ""}`.trim(),
      specialization: doc.specialization,
      experience: doc.experience,
      fees: doc.fees,
      email: doc.userId?.email,
      userId: doc.userId?._id,
    }));

    res.json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: "Unable to get doctors" });
  }
};

exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "pending" })
      .populate("userId", "firstname lastname email pic");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Unable to get pending doctors" });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "firstname lastname email pic");
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Unable to get all doctors" });
  }
};

exports.applyForDoctor = async (req, res) => {
  try {
    const { specialization, experience, fees } = req.body.formDetails || req.body;

    const existingApplication = await Doctor.findOne({ userId: req.userId });

    if (existingApplication) {
      return res.status(400).json({ message: "Application already exists" });
    }

    const doctor = new Doctor({
      userId: req.userId,
      specialization,
      experience,
      fees,
    });

    await doctor.save();

    const adminUsers = await User.find({ role: "admin" });
    for (const admin of adminUsers) {
      await Notification.create({
        userId: admin._id,
        content: `New doctor application received from ${req.user.firstname} ${req.user.lastname}`,
        type: "doctor_application",
      });
    }

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to submit application" });
  }
};

exports.acceptDoctor = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isDoctor: true, status: "accepted", role: "doctor" },
      { new: true }
    );

    await Doctor.findOneAndUpdate(
      { userId: id },
      { isDoctor: true, status: "approved" },
      { new: true }
    );

    await Notification.create({
      userId: id,
      content: `Congratulations! Your doctor application has been approved.`,
      type: "doctor_application",
    });

    res.json({ message: "Doctor approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while accepting doctor" });
  }
};

exports.rejectDoctor = async (req, res) => {
  try {
    const { id } = req.body;

    await User.findByIdAndUpdate(id, { isDoctor: false, status: "rejected" });
    await Doctor.findOneAndDelete({ userId: id });

    await Notification.create({
      userId: id,
      content: `Sorry, your doctor application has been rejected.`,
      type: "doctor_application",
    });

    res.json({ message: "Doctor rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while rejecting doctor" });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(userId, { isDoctor: false, role: "patient" });
    await Doctor.findOneAndDelete({ userId });

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete doctor" });
  }
};