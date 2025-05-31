/** @format */

const { GraphQLObjectType } = require("graphql");
const UserQuery = require("./query/user.query");
const TaskQuery = require("./query/task.query");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQuery,
    ...TaskQuery,
  },
});

module.exports = RootQuery;
