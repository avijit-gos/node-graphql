/** @format */
require("dotenv").config({ path: "../../../.env" });
const { default: mongoose } = require("mongoose");
const { kafka } = require("../../configs/kafka.config");
const { DB_URL, TOPIC_LOG_APP } = require("../../constants");
const AppLog = require("../../models/log.model");

async function mongoDBInit() {
  mongoose.connect(DB_URL);
  mongoose.connection.on("error", () => console.log("DB is not connected"));
  mongoose.connection.on("connected", () => console.log("DB is connected"));
}
mongoDBInit();

async function logConsumer() {
  const consumer = kafka.consumer({ groupId: "log-group" });
  try {
    await consumer.connect();
    console.log("Consumer connected");

    await consumer.subscribe({ topic: TOPIC_LOG_APP, fromBeginning: true });
    console.log("Consumer successfully subscribed topic from beginning");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const key = message.key?.toString();
        const value = message.value?.toString();
        const parsedKey = key ? JSON.parse(key) : null;
        const parsedValue = value ? JSON.parse(value) : null;
        if (topic === TOPIC_LOG_APP) {
          const logData = new AppLog({
            message: parsedValue.message,
            log_level: parsedValue.level,
            ip: parsedValue.ip,
            timestamp: parsedValue.timestamp,
          });
          await logData.save();
          console.log("log data saved in DB...");
        }
      },
    });
  } catch (error) {
    console.log("error");
    await consumer.disconnect();
  }
}

logConsumer();
