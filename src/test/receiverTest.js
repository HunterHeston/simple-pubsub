const { Receiver } = require("../receiver");

const rec = new Receiver(3001, "localhost", 3000);

rec.registerTopic("data-topic", (message) => {
  console.log(`received message on topic test-topic: ${message}`);
});
