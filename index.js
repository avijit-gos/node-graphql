/** @format */

require("dotenv").config();
require("./src/configs/mongo.config");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const { graphqlHTTP } = require("express-graphql");
const Schema = require("./src/schemas/schema");
const { kafkaInit } = require("./src/configs/kafka.config");

kafkaInit();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger("dev"));

app.use(
  "/graphql/v1/users",
  graphqlHTTP((req) => ({
    schema: Schema,
    graphiql: process.env.NODE_ENV === "development",
    context: {
      token: req.headers["x-access-token"],
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    },
  }))
);

// If route not found
app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});
// Error message
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
