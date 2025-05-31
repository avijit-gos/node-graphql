/** @format */

const TaskType = require("../types/task.types");
const createError = require("http-errors");
const logger = require("../../logger/index");
const { GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");
const { validateMiddleware } = require("../../utils");
const {
  createTask,
  updateTaskStatus,
  updateTaskInfo,
} = require("../../controllers/task.controller");

module.exports = {
  createNewTask: {
    type: TaskType,
    args: {
      title: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await createTask(args, user._id);
        return data;
      } catch (error) {
        logger.error({ message: error.message, ip });
        throw createError.BadRequest(error.message);
      }
    },
  },

  updateTaskStatus: {
    type: TaskType,
    args: {
      status: { type: GraphQLNonNull(GraphQLString) },
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await updateTaskStatus(args, user._id);
        return data;
      } catch (error) {
        logger.error({ message: error.message, ip });
        throw createError.BadRequest(error.message);
      }
    },
  },

  updateTaskInfo: {
    type: TaskType,
    args: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await updateTaskInfo(args, user._id);
        return data;
      } catch (error) {
        logger.error({ message: error.message, ip });
        throw createError.BadRequest(error.message);
      }
    },
  },
};
