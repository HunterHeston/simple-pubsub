const { json } = require("express");
const { write } = require("fs");
// libraries
const http = require("http");
const { send } = require("process");

// server
const { ServerRoutes } = require("./server");

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
      console.error("Sender::sendMessage: topic or message not provided");
      return new Error("invalid parameter values");
    }

    // convert to json
    const postData = JSON.stringify({ topic: topic, message: message });

    const options = {
      hostname: this.serverAddress,
      port: this.serverPort,
      path: ServerRoutes.TOPIC_PUBLISH,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length,
      },
    };

    const request = http.request(options, (res) => {
      console.log(`Sender::publish: status code: ${res.statusCode}`);
      res.on("data", (data) => {
        console.log(new String(data));
      });
    });

    request.on("error", (error) => console.error(error));

    request.write(postData);
    request.end();
  }
}
module.exports.Writer = Writer;
