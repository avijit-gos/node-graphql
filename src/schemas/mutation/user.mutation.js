/** @format */

const { GraphQLNonNull, GraphQLString } = require("graphql");
const UserType = require("../types/user.types");
const createError = require("http-errors");
const {
  addUser,
  loginUser,
  updateUserAccountStatus,
  updateUserInfo,
} = require("../../controllers/user.controller");
const { validateMiddleware } = require("../../utils");
const logger = require("../../logger/index");

module.exports = {
  // Register user
  register: {
    type: UserType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      username: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, context) {
      const { ip } = context;
      try {
        const data = await addUser(args);
        logger.info({ message: "A new user registered", ip });
        return data;
      } catch (error) {
        logger.error({ message: "Error in register API", ip });
        throw createError.BadRequest(error.message);
      }
    },
  },

  // Login user
  login: {
    type: UserType,
    args: {
      userInfo: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, context) {
      const { ip } = context;
      try {
        const data = await loginUser(args);
        logger.info({ message: "User loggedIn", ip });
        return data;
      } catch (error) {
        logger.error({ message: "Login API error", ip });
        throw createError.BadRequest(error.message);
      }
    },
  },

  // Update status
  updateUserStatus: {
    type: UserType,
    args: {
      status: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        if (!token) throw createError.BadGateway("Invalid token");
        const auth = await validateMiddleware(token);
        const data = await updateUserAccountStatus(args, auth);
        logger.error({
          message: "Success in update user account status API",
          ip,
        });
        return data;
      } catch (error) {
        logger.error({
          message: "Error in update user account status API",
          ip,
        });
        throw createError.BadRequest(error.message);
      }
    },
  },

  // Update user info
  updateUserDetails: {
    type: UserType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, context) {
      const { token, ip } = context;
      try {
        const user = await validateMiddleware(token);
        const data = await updateUserInfo(args, user);
        logger.info({
          message: "Success in update profile information API",
          ip,
        });
        return data;
      } catch (error) {
        logger.error({
          message: "Error in update profile information API",
          ip,
        });
        throw createError.BadRequest(error.message);
      }
    },
  },
};
