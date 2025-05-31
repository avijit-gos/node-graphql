/** @format */

const { kafka } = require("../configs/kafka.config");

async function kafkaProducer(TOPIC_NAME, MESSAGE, KEY, PARTITION) {
  const producer = kafka.producer();
  try {
    await producer.connect();
    console.log("Producer connected");

    await producer.send({
      topic: TOPIC_NAME,
      acks: -1,
      messages: [
        {
          value: JSON.stringify(MESSAGE),
          partition: PARTITION,
          key: KEY || null,
        },
      ],
    });
    console.log("Message send to TOPIC:", TOPIC_NAME);
  } catch (error) {
    console.log("Error:", error);
  } finally {
    await producer.disconnect();
  }
}

module.exports = kafkaProducer;
