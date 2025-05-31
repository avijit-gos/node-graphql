/** @format */

const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");
const UserType = require("./user.types");
const createError = require("http-errors");
const logger = require("../../logger/index");
const { getUserById } = require("../../controllers/user.controller");

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: {
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      async resolve(parent, args, context) {
        const { ip } = context;
        try {
          return getUserById(parent.userId);
        } catch (error) {
          logger.error({ message: error.message, ip });
          createError.BadRequest(error.message);
        }
      },
    },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

module.exports = TaskType;