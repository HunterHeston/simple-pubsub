const { Writer } = require("../writer");

const writer = new Writer("localhost", 3000);

writer.sendMessage("data-topic", { text: "hello there from home" });
