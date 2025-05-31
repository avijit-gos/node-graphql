/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "User email is required"],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "delete", "restricted"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
