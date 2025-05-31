/** @format */

const mongoose = require("mongoose");

const LoggerSchema = new mongoose.Schema({
  message: {
    type: String,
    trim: true,
    required: [true, "Log message is required"],
  },
  log_level: {
    type: String,
    trim: true,
    required: [true, "Log level is required"],
  },
  ip: {
    type: String,
    trim: true,
    required: [true, "IP is required"],
  },
  timestamp: {
    type: Date,
  },
});

module.exports = mongoose.model("AppLog", LoggerSchema);
