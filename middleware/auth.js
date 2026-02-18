// // const jwt = require("jsonwebtoken");

// // const auth = async (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader) {
// //       return res.status(401).json({ message: "No token provided" });
// //     }

// //     const token = authHeader.split(" ")[1];
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     req.userId = decoded.userId; // ✅ CORRECT
// //     next();

// //   } catch (error) {
// //     console.log("AUTH ERROR:", error);
// //     return res.status(401).json({ message: "Auth Failed" });
// //   }
// // };

// // module.exports = auth;
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
    
//     if (!token) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "No token, authorization denied" 
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRETKEY");
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }

//     req.user = user;
//     req.userId = user._id;
//     next();
//   } catch (error) {
//     console.error("Auth error:", error);
//     res.status(401).json({ 
//       success: false, 
//       message: "Token is not valid" 
//     });
//   }
// };

// module.exports = auth;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRETKEY");
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    req.locals = user._id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;