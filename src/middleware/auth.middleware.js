/** @format */

const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    // if (!token) next(createError.Unauthorized("Permission denied"));
    console.log(token);
  } catch (error) {
    next(createError.Unauthorized("Invalid or expired token"));
  }
};
