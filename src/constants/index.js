/** @format */

const DB_URL = process.env.DB_URL;
const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY;


// Kafka Topics
const TOPIC_LOG_APP = "app_log";

module.exports = {
  DB_URL,
  JWT_ACCESS_TOKEN_KEY,
  TOPIC_LOG_APP,
};
