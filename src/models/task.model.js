/** @format */

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Task title is required"],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "block", "done", "delete"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
