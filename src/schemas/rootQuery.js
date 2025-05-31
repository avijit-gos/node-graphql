/** @format */

const { GraphQLObjectType } = require("graphql");
const UserQuery = require("./query/user.query");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQuery,
  },
});

module.exports = RootQuery;
