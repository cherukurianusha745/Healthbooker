// // const express = require("express");
// // const auth = require("../middleware/auth");
// // const userController = require("../controllers/userController");
// // const userRouter = express.Router();

// // userRouter.get("/getuser/:id", auth, userController.getuser);

// // userRouter.get("/getallusers", auth, userController.getallusers);

// // userRouter.post("/login", userController.login);

// // userRouter.post("/register", userController.register);

// // userRouter.put("/updateprofile", auth, userController.updateprofile);

// // userRouter.delete("/deleteuser", auth, userController.deleteuser);

// // module.exports = userRouter;
// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const auth = require("../middleware/auth");

// router.post("/register", userController.register);
// router.post("/login", userController.login);
// router.get("/getuser/:id", auth, userController.getUser);
// router.get("/getallusers", auth, userController.getAllUsers);
// router.put("/updateprofile", auth, userController.updateProfile);

// module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getuser/:id", auth, userController.getUser);
router.get("/getallusers", auth, userController.getAllUsers);
router.put("/updateprofile", auth, userController.updateProfile);
router.delete("/deleteuser", auth, userController.deleteUser);

module.exports = router;