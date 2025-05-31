/** @format */

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "todo-app",
});

async function kafkaInit() {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log("Kafka admin connected");
  } catch (error) {
    console.log("Error:", error);
    await admin.disconnect();
  }
}

module.exports = { kafka, kafkaInit };
