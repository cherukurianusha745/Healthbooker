// // const mongoose = require("mongoose");

// // const schema = mongoose.Schema(
// //   {
// //     userId: {
// //       type: mongoose.SchemaTypes.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },
// //     specialization: {
// //       type: String,
// //       required: true,
// //     },
// //     experience: {
// //       type: Number,
// //       required: true,
// //     },
// //     fees: {
// //       type: Number,
// //       required: true,
// //     },
// //     isDoctor: {
// //       type: Boolean,
// //       default: false,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // const Doctor = mongoose.model("Doctor", schema);

// // module.exports = Doctor;
// const mongoose = require("mongoose");

// const doctorSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {  // ADD THIS FIELD
//       type: String,
//       required: true,
//     },
//     specialization: {
//       type: String,
//       required: true,
//     },
//     experience: {
//       type: Number,
//       required: true,
//     },
//     fees: {
//       type: Number,
//       required: true,
//     },
//     timing: {  // ADD THIS FIELD
//       type: String,
//       enum: ["morning", "afternoon", "evening", "night"],
//       default: "morning",
//     },
//     qualification: {  // ADD THIS FIELD
//       type: String,
//     },
//     hospital: {  // ADD THIS FIELD
//       type: String,
//     },
//     isDoctor: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Doctor", doctorSchema);
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);