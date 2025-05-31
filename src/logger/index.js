/** @format */

// logger/index.js
const winston = require("winston");
const KafkaTransport = require("./kafkaTransport");
const { TOPIC_LOG_APP } = require("../constants");

const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return JSON.stringify({
      message,
      timestamp,
      status: level,
    });
  })
);

const logger = winston.createLogger({
  level: "info",
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new KafkaTransport({
      topic: TOPIC_LOG_APP,
      partition: 0,
    }),
  ],
});

module.exports = logger;
