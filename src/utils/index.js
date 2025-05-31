/** @format */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { JWT_ACCESS_TOKEN_KEY } = require("../constants");

const hashUserPassword = async (password) => {
  try {
    if (!password)
      throw createError.BadRequest("Did not provide the password...");
    const result = await bcrypt.hash(password, 10);
    return result;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const comparePassword = async (password, userPassword) => {
  try {
    if (!password)
      throw createError.BadRequest("Did not provide the password...");
    if (!userPassword)
      throw createError.BadRequest("Did not provide the user password...");

    const result = await bcrypt.compare(password, userPassword);
    return result;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const generateToken = async (user) => {
  try {
    if (!user)
      throw createError.BadRequest("Did not provide the user information..");
    const result = await jwt.sign(
      {
        _id: user._id,
        status: user.status,
      },
      JWT_ACCESS_TOKEN_KEY,
      { expiresIn: "365d" }
    );
    return result;
    return result;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const validateMiddleware = async (token) => {
  try {
    const authUser = await jwt.verify(token, JWT_ACCESS_TOKEN_KEY);
    if (authUser.status !== "active")
      throw createError.BadRequest("User account is not active");
    return authUser;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

module.exports = {
  hashUserPassword,
  generateToken,
  comparePassword,
  validateMiddleware,
};
