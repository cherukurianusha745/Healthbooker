// // const express = require("express");
// // const doctorController = require("../controllers/doctorController");
// // const auth = require("../middleware/auth");

// // const doctorRouter = express.Router();

// // doctorRouter.get("/getalldoctors", doctorController.getalldoctors);

// // doctorRouter.get("/getnotdoctors", auth, doctorController.getnotdoctors);

// // doctorRouter.post("/applyfordoctor", auth, doctorController.applyfordoctor);

// // doctorRouter.put("/deletedoctor", auth, doctorController.deletedoctor);

// // doctorRouter.put("/acceptdoctor", auth, doctorController.acceptdoctor);

// // doctorRouter.put("/rejectdoctor", auth, doctorController.rejectdoctor);

// // module.exports = doctorRouter;
// // routes/doctorRoutes.js
// // const express = require("express");
// // const router = express.Router();
// // const doctorController = require("../controllers/doctorController");
// // const auth = require("../middleware/auth");
// // // const adminAuth = require("../middleware/adminAuth"); // Comment this out temporarily

// // // ============ EXISTING ROUTES ============
// // router.get("/get-doctors", doctorController.getApprovedDoctors);
// // router.get("/get-pending-doctors", auth, doctorController.getPendingDoctors);
// // router.post("/apply-for-doctor", auth, doctorController.applyForDoctor);
// // router.post("/acceptdoctor", auth, doctorController.acceptDoctor);
// // router.post("/rejectdoctor", auth, doctorController.rejectDoctor);
// // router.get("/get-doctor-profile", auth, doctorController.getDoctorProfile);

// // // ============ NEW UPDATE ROUTES ============

// // // Get single doctor by ID
// // router.get("/get-doctor/:id", auth, doctorController.getDoctorById);

// // // Update single doctor (Admin only) - Use just auth for testing
// // router.put("/update-doctor/:id", auth, doctorController.updateDoctor);

// // // Update doctor status (Admin only) - Use just auth for testing
// // router.patch("/update-doctor-status/:id", auth, doctorController.updateDoctorStatus);

// // // BULK UPDATE ROUTE - Use just auth for testing
// // router.put("/bulk-update-doctors", auth, doctorController.bulkUpdateDoctors);

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const doctorController = require("../controllers/doctorController");
// const auth = require("../middleware/auth");

// // ============ PUBLIC ROUTES ============
// router.get("/get-doctors", doctorController.getApprovedDoctors);

// // ============ PROTECTED ROUTES ============
// router.post("/apply-for-doctor", auth, doctorController.applyForDoctor);
// router.get("/get-pending-doctors", auth, doctorController.getPendingDoctors);
// router.post("/acceptdoctor", auth, doctorController.acceptDoctor);
// router.post("/rejectdoctor", auth, doctorController.rejectDoctor);
// router.get("/get-doctor-profile", auth, doctorController.getDoctorProfile);

// // ============ UPDATE ROUTES ============
// router.get("/get-doctor/:id", auth, doctorController.getDoctorById);
// router.put("/update-doctor/:id", auth, doctorController.updateDoctor);
// router.patch("/update-doctor-status/:id", auth, doctorController.updateDoctorStatus);
// router.put("/bulk-update-doctors", auth, doctorController.bulkUpdateDoctors);

// module.exports = router;
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/auth");

router.get("/get-doctors", doctorController.getApprovedDoctors);
router.get("/get-pending-doctors", auth, doctorController.getPendingDoctors);
router.get("/get-all-doctors", auth, doctorController.getAllDoctors);
router.post("/applyfordoctor", auth, doctorController.applyForDoctor);
router.post("/acceptdoctor", auth, doctorController.acceptDoctor);
router.post("/rejectdoctor", auth, doctorController.rejectDoctor);
router.delete("/deletedoctor", auth, doctorController.deleteDoctor);

module.exports = router;