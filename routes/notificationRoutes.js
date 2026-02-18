// // const express = require("express");
// // const auth = require("../middleware/auth");
// // const notificationController = require("../controllers/notificationController");

// // const notificationRouter = express.Router();

// // notificationRouter.get(
// //   "/getallnotifs",
// //   auth,
// //   notificationController.getallnotifs
// // );

// // module.exports = notificationRouter;
// const express = require("express");
// const router = express.Router();
// const notificationController = require("../controllers/notificationController");
// const auth = require("../middleware/auth");

// router.get("/getallnotifs", auth, notificationController.getUserNotifications);
// router.put("/mark-seen", auth, notificationController.markAsSeen);

// module.exports = router;
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

router.get("/getallnotifs", auth, notificationController.getUserNotifications);
router.get("/getall", auth, notificationController.getAllNotifications);
router.put("/mark-seen", auth, notificationController.markAsSeen);

module.exports = router;