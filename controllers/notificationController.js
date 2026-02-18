// // const Notification = require("../models/notificationModel");

// // const getallnotifs = async (req, res) => {
// //   try {
// //     const notifs = await Notification.find({ userId: req.locals });
// //     return res.send(notifs);
// //   } catch (error) {
// //     res.status(500).send("Unable to get all notifications");
// //   }
// // };

// // module.exports = {
// //   getallnotifs,
// // };
// const Notification = require("../models/notificationModel");

// exports.getUserNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.userId })
//       .sort({ createdAt: -1 });
//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Unable to get notifications" });
//   }
// };

// exports.getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find()
//       .populate("userId", "firstname lastname email")
//       .sort({ createdAt: -1 });
//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: "Unable to get notifications" });
//   }
// };

// exports.markAsSeen = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { userId: req.userId, seen: false },
//       { seen: true }
//     );
//     res.json({ message: "Notifications marked as seen" });
//   } catch (error) {
//     res.status(500).json({ message: "Unable to update notifications" });
//   }
// };
const Notification = require("../models/notificationModel");

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Unable to get notifications" });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "firstname lastname email")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Unable to get notifications" });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, seen: false },
      { seen: true }
    );
    res.json({ message: "Notifications marked as seen" });
  } catch (error) {
    res.status(500).json({ message: "Unable to update notifications" });
  }
};