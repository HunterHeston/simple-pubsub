// server
const { ServerRoutes } = require("./server");

// util
const { sendHttpMessage } = require("./util/sendHttpMessage");

////////////////////////////////////////////////////////////////////////////////
/// Writer class: used to send messages on a topic
////////////////////////////////////////////////////////////////////////////////
class Writer {
  //////////////////////////////////////////////////////////////////////////////
  /// must provide a valid server address and port
  //////////////////////////////////////////////////////////////////////////////
  constructor(serverAddress, serverPort) {
    if (!serverAddress || !serverAddress) {
      throw new Error("serverAddress(ip or url) and port are required");
    }

    this.serverAddress = serverAddress;
    this.serverPort = serverPort;
  }

  //////////////////////////////////////////////////////////////////////////////
  /// Send a message to the server
  ///
  /// return: false if no message was sent, true otherwise
  //////////////////////////////////////////////////////////////////////////////
  sendMessage(topic, message) {
    if (!topic || typeof topic !== "string") {
      console.error(
        "Writer::sendMessage: topic not provided, message will not be sent."
      );
      return false;
    }

    // convert to json
    const data = { topic: topic, message: message };

    sendHttpMessage(
      this.serverAddress,
      this.serverPort,
      ServerRoutes.TOPIC_PUBLISH,
      "POST",
      data
    );

    return true;
  }
}

////////////////////////////////////////////////////////////////////////////////
/// exports
////////////////////////////////////////////////////////////////////////////////
module.exports.Writer = Writer;
