const { Receiver } = require("../receiver");
const { LOG_INFO } = require("../util/log");

const rec = new Receiver(3001, "localhost", 3000);

rec.registerTopic("data-topic", (message) => {
  LOG_INFO(`received message on topic test-topic: `, message);
});

rec.start();
