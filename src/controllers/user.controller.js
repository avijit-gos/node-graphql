/** @format */

const mongoose = require("mongoose");
const createError = require("http-errors");
const User = require("../models/user.model");
const {
  hashUserPassword,
  generateToken,
  comparePassword,
} = require("../utils");

const addUser = async (args) => {
  try {
    const { name, email, username, password } = args;
    if (!name) throw createError.BadRequest("Invalid name");
    if (!email) throw createError.BadRequest("Invalid email");
    if (!username) throw createError.BadRequest("Invalid username");
    if (!password) throw createError.BadRequest("Invalid password");

    const isUserExists = await User.findOne({
      $or: [{ email }, { username }],
    }).select("email username");
    if (isUserExists && isUserExists.email === email)
      throw createError.BadRequest("Email already taken");
    if (isUserExists && isUserExists.username === username)
      throw createError.BadRequest("Useername already taken");

    // hash password
    const hashPassword = await hashUserPassword(password);
    const newUser = new User({
      name,
      email,
      username,
      password: hashPassword,
    });
    const savedUser = await newUser.save();

    // generate user access token
    const token = await generateToken(savedUser);
    return {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      username: savedUser.username,
      status: savedUser.status,
      token,
    };
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const loginUser = async (args) => {
  try {
    const { userInfo, password } = args;
    if (!userInfo)
      throw createError.BadRequest("Please provide email or username");
    if (!password) throw createError.BadRequest("Please provide the password");

    const isUserExists = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });

    if (!isUserExists) throw createError.BadRequest("No user found");
    if (isUserExists && isUserExists.status !== "active")
      throw createError.BadRequest("User account is not active");

    const isPasswordCorrect = await comparePassword(
      password,
      isUserExists.password
    );
    if (!isPasswordCorrect)
      throw createError.BadRequest("Passowrd is not correct");
    console.log(isUserExists);

    // generate user access token
    const token = await generateToken(isUserExists);
    console.log(token);
    return {
      _id: isUserExists._id,
      name: isUserExists.name,
      email: isUserExists.email,
      username: isUserExists.username,
      status: isUserExists.status,
      token,
    };
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const updateUserAccountStatus = async (args, data) => {
  try {
    const user = await User.findById(data._id).select("status");
    if (!user) throw createError.BadRequest("No user data found");
    if (user && user.status === args.status)
      throw createError.BadRequest("Same status cannot be updated");
    const updatedUser = await User.findByIdAndUpdate(
      data._id,
      { $set: { status: args.status } },
      { new: true }
    ).select("-password");
    return updatedUser;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const updateUserInfo = async (args, data) => {
  try {
    const user = await User.findById(data._id).select("status");
    if (!user) throw createError.BadRequest("No user data found");
    const updatedUser = await User.findByIdAndUpdate(
      data._id,
      { $set: { name: args.name } },
      { new: true }
    ).select("-password");
    return updatedUser;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const getAllUsers = async (args) => {
  try {
    const { status, page = 1, limit = 10 } = args;
    console.log(args);
    let query = {};
    if (status) {
      query.status = status;
    }
    const data = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    return data;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const getUserById = async (user) => {
  try {
    const data = await User.findById(user._id).select("-password");
    if (!data) throw createError.BadRequest("No user found");
    if (data && data.status !== "active")
      throw createError.BadRequest("User profile is not active");
    return data;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

module.exports = {
  addUser,
  loginUser,
  updateUserAccountStatus,
  updateUserInfo,
  getAllUsers,
  getUserById,
};
