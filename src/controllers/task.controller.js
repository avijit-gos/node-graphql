/** @format */

const Task = require("../models/task.model");
const createError = require("http-errors");

const createTask = async (args, userID) => {
  try {
    const { title, description, userId } = args;
    if (!title) throw createError.BadRequest("Task title is required");
    if (!description)
      throw createError.BadRequest("Task description is required");

    const newTask = new Task({
      title,
      description,
      userId: userID,
    });
    const task = await newTask.save();
    return task;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const updateTaskStatus = async (args) => {
  try {
    const { status, id } = args;
    if (!id) throw createError.BadRequest("Task ID is required");
    if (!status) throw createError.BadRequest("Task status is required");

    const task = await Task.findById(id).select("status");
    if (!task) throw createError.BadRequest("No task data found");
    if (task && task.userId === userId)
      throw createError.BadRequest("Permission denied");
    if (task && task.status === "delete")
      throw createError.BadRequest("Task has already been deleted");
    if (task && task.status === status)
      throw createError.BadRequest("Cannot update same status");

    const data = await Task.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );
    return data;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const updateTaskInfo = async (args, userId) => {
  try {
    const task = await Task.findById(args.id);
    if (!task) throw createError.BadRequest("No task data found");
    if (task && task.status === "delete")
      throw createError.BadRequest("Task has alreaady been deleted");
    if (task && task.userId === userId)
      throw createError.BadRequest("Permission denied");
    const data = await Task.findByIdAndUpdate(
      args.id,
      {
        $set: {
          title: args.title || task.title,
          description: args.description || task.description,
        },
      },
      { new: true }
    );
    return data;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const getAllUserTasks = async (args, userId) => {
  try {
    console.log(args);
    const { page = 1, status, limit = 10 } = args;
    const queryValue = status
      ? {
          $and: [{ status: status }, { userId: userId }],
        }
      : {
          $and: [{ userId }],
        };
    const tasks = await Task.find(queryValue)
      .skip(limit * (page - 1))
      .limit(limit);
    return tasks;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

const getTask = async (args, userId) => {
  try {
    const { id } = args;
    console.log(id);
    if (!id) throw createError.BadRequest("Task ID is not provided");

    const task = await Task.findById(id);
    if (!task) throw createError.BadRequest("Task data is not defined");
    if (task && task.status === "delete")
      throw createError.BadRequest("Task has already been deleted");
    if (task && task.userId === userId)
      throw createError.BadRequest("Permission denied to view");
    return task;
  } catch (error) {
    throw createError.BadRequest(error.message);
  }
};

module.exports = {
  createTask,
  updateTaskStatus,
  updateTaskInfo,
  getAllUserTasks,
  getTask,
};
