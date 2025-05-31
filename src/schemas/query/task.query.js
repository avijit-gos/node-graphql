/** @format */

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const TaskType = require("../types/task.types");
const createError = require("http-errors");
const logger = require("../../logger/index");
const {
  getAllUserTasks,
  getTask,
} = require("../../controllers/task.controller");
const { validateMiddleware } = require("../../utils");

module.exports = {
  tasks: {
    type: new GraphQLList(TaskType),
    args: {
      page: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      status: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await getAllUserTasks(args, user._id);
        return data;
      } catch (error) {
        logger.error({ message: error.message, ip });
        throw createError.BadRequest(error.message);
      }
    },
  },

  task: {
    type: TaskType,
    args: { id: { type: GraphQLNonNull(GraphQLID) } },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await getTask(args, user._id);
        return data;
      } catch (error) {
        logger.error({ message: error.message, ip });
        throw createError.BadRequest(error.message);
      }
    },
  },
};
