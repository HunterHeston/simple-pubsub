const { Receiver } = require("../receiver");

const rec = new Receiver(3001, "localhost", 3000);

rec.registerTopic("registration", (message) => {
  console.log(`received message on topic test-topic: ${message}`);
});
rec.registerTopic("registration1", (message) => {
  console.log(`received message on topic test-topic: ${message}`);
});
rec.registerTopic("registration2", (message) => {
  console.log(`received message on topic test-topic: ${message}`);
});
rec.registerTopic("registration3", (message) => {
  console.log(`received message on topic test-topic: ${message}`);
});
