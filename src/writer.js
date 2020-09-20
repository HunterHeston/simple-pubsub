// libraries
const http = require("http");

// server
const { ServerRoutes } = require("./server");

// util
const { sendHttpMessage } = require("./util/sendHttpMessage");

class Writer {
  constructor(serverAddress, serverPort) {
    this.serverAddress = serverAddress;
    this.serverPort = serverPort;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Send a message to the server
  ////////////////////////////////////////////////////////////////////////////////
  sendMessage(topic, message) {
    // check is topic registered?

    if (!message || !topic) {
      console.error("Writer::sendMessage: topic or message not provided");
      return new Error("invalid parameter values");
    }

    // convert to json
    const data = JSON.stringify({ topic: topic, message: message });

    sendHttpMessage(
      this.serverAddress,
      this.serverPort,
      ServerRoutes.TOPIC_PUBLISH,
      "POST",
      data
    );
  }
}
module.exports.Writer = Writer;
