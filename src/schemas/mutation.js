/** @format */

const { GraphQLObjectType } = require("graphql");
const UserMutation = require("./mutation/user.mutation");
const TaskMutation = require("./mutation/task.mutation");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...UserMutation,
    ...TaskMutation,
  },
});

module.exports = Mutation;
