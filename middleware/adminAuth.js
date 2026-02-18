// middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  // Check if user exists from auth middleware
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Check if user is admin
  if (req.user.role === "admin" || req.user.isAdmin) {
    return next();
  }

  // Not an admin
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only."
  });
};

module.exports = adminAuth;