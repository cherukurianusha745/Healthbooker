// // const User = require("../models/userModel");
// // const bcrypt = require("bcrypt");
// // const jwt = require("jsonwebtoken");
// // const Doctor = require("../models/doctorModel");
// // const Appointment = require("../models/appointmentModel");

// // const getuser = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.params.id).select("-password");
// //     return res.send(user);
// //   } catch (error) {
// //     res.status(500).send("Unable to get user");
// //   }
// // };

// // const getallusers = async (req, res) => {
// //   try {
// //     const users = await User.find()
// //       .find({ _id: { $ne: req.locals } })
// //       .select("-password");
// //     return res.send(users);
// //   } catch (error) {
// //     res.status(500).send("Unable to get all users");
// //   }
// // };

// // const login = async (req, res) => {
// //   try {
// //     const emailPresent = await User.findOne({ email: req.body.email });
// //     if (!emailPresent) {
// //       return res.status(400).send("Incorrect credentials");
// //     }
// //     const verifyPass = await bcrypt.compare(
// //       req.body.password,
// //       emailPresent.password
// //     );
// //     if (!verifyPass) {
// //       return res.status(400).send("Incorrect credentials");
// //     }
// //     const token = jwt.sign(
// //       { userId: emailPresent._id, isAdmin: emailPresent.isAdmin },
// //       process.env.JWT_SECRET,
// //       {
// //         expiresIn: "2 days",
// //       }
// //     );
// //     return res.status(201).send({ msg: "User logged in successfully", token });
// //   } catch (error) {
// //     res.status(500).send("Unable to login user");
// //   }
// // };

// // const register = async (req, res) => {
// //   try {
// //     const emailPresent = await User.findOne({ email: req.body.email });
// //     if (emailPresent) {
// //       return res.status(400).send("Email already exists");
// //     }
// //     const hashedPass = await bcrypt.hash(req.body.password, 10);
// //     const user = await User({ ...req.body, password: hashedPass });
// //     const result = await user.save();
// //     if (!result) {
// //       return res.status(500).send("Unable to register user");
// //     }
// //     return res.status(201).send("User registered successfully");
// //   } catch (error) {
// //     res.status(500).send("Unable to register user");
// //   }
// // };

// // const updateprofile = async (req, res) => {
// //   try {
// //     const hashedPass = await bcrypt.hash(req.body.password, 10);
// //     const result = await User.findByIdAndUpdate(
// //       { _id: req.locals },
// //       { ...req.body, password: hashedPass }
// //     );
// //     if (!result) {
// //       return res.status(500).send("Unable to update user");
// //     }
// //     return res.status(201).send("User updated successfully");
// //   } catch (error) {
// //     res.status(500).send("Unable to update user");
// //   }
// // };

// // const deleteuser = async (req, res) => {
// //   try {
// //     const result = await User.findByIdAndDelete(req.body.userId);
// //     const removeDoc = await Doctor.findOneAndDelete({
// //       userId: req.body.userId,
// //     });
// //     const removeAppoint = await Appointment.findOneAndDelete({
// //       userId: req.body.userId,
// //     });
// //     return res.send("User deleted successfully");
// //   } catch (error) {
// //     res.status(500).send("Unable to delete user");
// //   }
// // };

// // module.exports = {
// //   getuser,
// //   getallusers,
// //   login,
// //   register,
// //   updateprofile,
// //   deleteuser,
// // };// Login User
// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // ============ REGISTER USER ============
// exports.register = async (req, res) => {
//   try {
//     const { firstname, lastname, email, password } = req.body;

//     if (!firstname || !lastname || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       firstname,
//       lastname,
//       email,
//       password: hashedPassword,
//       role: "patient",
//       isAdmin: false,
//       isDoctor: false,
//       status: "accepted"
//     });

//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.error("Error in register:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ============ LOGIN USER ============
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const token = jwt.sign(
//       { 
//         userId: user._id, 
//         role: user.role,
//         isAdmin: user.isAdmin,
//         isDoctor: user.isDoctor 
//       },
//       process.env.JWT_SECRET || "SECRETKEY",
//       { expiresIn: "2d" }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//         role: user.role,
//         isAdmin: user.isAdmin,
//         isDoctor: user.isDoctor,
//       },
//     });
//   } catch (error) {
//     console.error("Error in login:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // ============ GET USER BY ID ============
// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error("Error in getUser:", error);
//     res.status(500).json({ message: "Unable to get user" });
//   }
// };

// // ============ GET ALL USERS ============
// exports.getAllUsers = async (req, res) => {
//   try {
//     // Check if user is admin
//     const currentUser = await User.findById(req.userId);
//     if (!currentUser || (currentUser.role !== "admin" && !currentUser.isAdmin)) {
//       return res.status(403).json({ message: "Access denied. Admin only." });
//     }

//     const users = await User.find({ _id: { $ne: req.userId } }).select("-password");
//     res.json(users);
//   } catch (error) {
//     console.error("Error in getAllUsers:", error);
//     res.status(500).json({ message: "Unable to get users" });
//   }
// };

// // ============ UPDATE PROFILE ============
// exports.updateProfile = async (req, res) => {
//   try {
//     const { password, ...updateData } = req.body;

//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10);
//     }

//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       updateData,
//       { new: true }
//     ).select("-password");

//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Error in updateProfile:", error);
//     res.status(500).json({ message: "Unable to update profile" });
//   }
// };
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || "patient",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "SECRETKEY",
      { expiresIn: "2d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Unable to get user" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to get users" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to update profile" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    await Doctor.findOneAndDelete({ userId: req.body.userId });
    await Appointment.findOneAndDelete({ patientId: req.body.userId });
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete user" });
  }
};