/** @format */

const { GraphQLObjectType } = require("graphql");
const UserMutation = require("./mutation/user.mutation");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...UserMutation,
  },
});

module.exports = Mutation;