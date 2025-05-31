/** @format */

const { kafka } = require("../configs/kafka.config");

async function createKafkaTopic(TOPIC_NAME, NO_PARTITION, NO_REPLICATION) {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log("Admin connected");
    await admin.createTopics({
      topics: [
        {
          topic: TOPIC_NAME,
          numPartitions: NO_PARTITION,
          replicationFactor: NO_REPLICATION,
        },
      ],
    });
    console.log(`Kafka successfully created TOPIC:${TOPIC_NAME}`);
  } catch (error) {
    console.log("Error:", error);
  } finally {
    await admin.disconnect();
  }
}

createKafkaTopic("test", 2, 1);
