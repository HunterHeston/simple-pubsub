const { Writer } = require("../sender");

const writer = new Writer("localhost", 3000);

writer.sendMessage("data-topic", { text: "hello from home" });
