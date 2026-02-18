// // const mongoose = require("mongoose");

// // const schema = mongoose.Schema(
// //   {
// //     userId: {
// //       type: mongoose.SchemaTypes.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },
// //     isRead: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     content: {
// //       type: String,
// //       default: "",
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // const Notification = mongoose.model("Notification", schema);

// // module.exports = Notification;
// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["appointment", "system", "message"],
//       default: "appointment",
//     },
//     seen: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Notification", notificationSchema);
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["appointment", "doctor_application", "system"],
      default: "system",
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);