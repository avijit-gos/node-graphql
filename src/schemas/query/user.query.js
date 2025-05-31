/** @format */

const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const UserType = require("../types/user.types");
const createError = require("http-errors");
const User = require("../../models/user.model");
const {
  getAllUsers,
  getUserById,
} = require("../../controllers/user.controller");
const logger = require("../../logger/index");
const { validateMiddleware } = require("../../utils");

module.exports = {
  users: {
    type: new GraphQLList(UserType),
    args: {
      status: { type: GraphQLString },
      page: { type: GraphQLInt },
      limit: { type: GraphQLInt },
    },
    async resolve(parent, args, context) {
      const { ip } = context;
      try {
        const data = await getAllUsers(args);
        logger.info({ message: "Success in getting all users", ip });
        return data;
      } catch (error) {
        logger.error({ message: "Error in getting all users", ip });
        throw createError.BadRequest(error.message);
      }
    },
  },

  findUser: {
    type: UserType,
    args: {},
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await getUserById(user);
        // console.log(data);
        logger.info({ message: "Success in getting a specific users", ip });
        return data;
      } catch (error) {
        logger.error({ message: "Error in getting all users", ip });
        throw createError.BadRequest(error.message);
      }
    },
  },
};
