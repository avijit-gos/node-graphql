/** @format */

const { GraphQLSchema } = require("graphql");
const RootQuery = require("./rootQuery");
const Mutation = require("./mutation");

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = Schema;
