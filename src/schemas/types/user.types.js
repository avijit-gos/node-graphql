/** @format */

const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    status: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

module.exports = UserType;
