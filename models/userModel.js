// // const mongoose = require("mongoose");

// // const schema = mongoose.Schema(
// //   {
// //     firstname: {
// //       type: String,
// //       required: true,
// //       minLength: 3,
// //     },
// //     lastname: {
// //       type: String,
// //       required: true,
// //       minLength: 3,
// //     },
// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //     },
// //     password: {
// //       type: String,
// //       required: true,
// //       minLength: 5,
// //     },
// //     isAdmin: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     isDoctor: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     age: {
// //       type: Number,
// //       default: "",
// //     },
// //     gender: {
// //       type: String,
// //       default: "neither",
// //     },
// //     mobile: {
// //       type: Number,
// //       default: "",
// //     },
// //     address: {
// //       type: String,
// //       default: "",
// //     },
// //     status: {
// //       type: String,
// //       default: "pending",
// //     },
// //     pic: {
// //       type: String,
// //       default:
// //         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // const User = mongoose.model("User", schema);

// // module.exports = User;
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     firstname: {
//       type: String,
//       required: true,
//       minLength: 3,
//     },
//     lastname: {
//       type: String,
//       required: true,
//       minLength: 3,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "doctor", "patient"],
//       default: "patient",
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     isDoctor: {
//       type: Boolean,
//       default: false,
//     },
//     age: {
//       type: Number,
//       default: null,
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "neither"],
//       default: "neither",
//     },
//     mobile: {
//       type: String,
//       default: "",
//     },
//     address: {
//       type: String,
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "accepted", "rejected"],
//       default: "pending",
//     },
//     pic: {
//       type: String,
//       default:
//         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "neither"],
      default: "neither",
    },
    mobile: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);