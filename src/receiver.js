// libraries
const express = require("express");

// server
const { ServerRoutes } = require("./server");

// util
const { sendHttpMessage } = require("./util/sendHttpMessage");

////////////////////////////////////////////////////////////////////////////////
/// constants
////////////////////////////////////////////////////////////////////////////////
const Routes = {
  ROOT: "/",
  RECEIVE_REGISTRATION: "/receive/registration",
  RECEIVE_MESSAGE: "/receive/message",
};

////////////////////////////////////////////////////////////////////////////////
/// receiver class
/// this class accepts registrations for topics and receives messages for those
/// registrations
////////////////////////////////////////////////////////////////////////////////
class Receiver {
  constructor(receiverPort, serverAddress, serverPort) {
    // express setup
    this.clientAddress = "localhost";
    this.port = receiverPort;
    this.app = express();
    this.registerMiddleware(this.app);
    this.registerRoutes(this.app);

    // message processing server configuration
    this.serverAddress = serverAddress;
    this.serverPort = serverPort;

    // topics mapped to callbacks
    this.topics = new Map();
  }

  //////////////////////////////////////////////////////////////////////////////
  /// start listening to for messages from the server
  //////////////////////////////////////////////////////////////////////////////
  start() {
    this.app.listen(this.port, () => {
      console.log(`Receiver::start: started express app on port: ${this.port}`);
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  /// stop the app thats listening for data
  //////////////////////////////////////////////////////////////////////////////
  stop() {
    // todo how do stop the express server??
  }

  //////////////////////////////////////////////////////////////////////////////
  /// Register express endpoints
  //////////////////////////////////////////////////////////////////////////////
  registerRoutes(app) {
    if (!app) {
      console.error("registerRoutes: express app not provided");
      throw new Error(
        "registerRoutes: app initialization failed, app not provided"
      );
    }

    // todo add ready flag?

    // handles successful or failed topic registrations
    app.post(Routes.RECEIVE_REGISTRATION, this.processRegistrationResponse);

    // handles incoming messages
    app.post(Routes.RECEIVE_MESSAGE, (req, res) => {
      const { topic, message } = req.body;

      console.log(req.body);

      if (this.processMessage(topic, message)) {
        res.status = 200;
        res.send(`Receiver: Message received on topic ${topic}`);
        return;
      }

      res.status = 400;
      res.send(`Topic not registered or not provided: ${topic}`);
      return;
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  /// register middleware
  //////////////////////////////////////////////////////////////////////////////
  registerMiddleware(app) {
    if (!app) {
      console.error("registerMiddleware: express app not provided");
      throw new Error(
        "registerMiddleware: app initialization failed, app not provided"
      );
    }

    app.use(express.json());
  }

  //////////////////////////////////////////////////////////////////////////////
  /// Register a new callback with a topic.
  //////////////////////////////////////////////////////////////////////////////
  async registerTopic(topic, callback) {
    const { topics } = this;

    // initialize an empty list of callbacks for a new topic
    if (!topics.has(topic)) {
      topics.set(topic, []);
    }

    // append the callback to the topic list
    topics.get(topic).push(callback);

    // topic to register for and where to send the data.
    const data = {
      topic: topic,
      clientAddress: this.clientAddress,
      clientPort: this.port,
    };

    sendHttpMessage(
      this.serverAddress,
      this.serverPort,
      ServerRoutes.TOPIC_REGISTER,
      "POST",
      data
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  /// process registration success/fail
  //////////////////////////////////////////////////////////////////////////////
  processRegistrationResponse(req, res) {
    if (!req || !req.body || !req.body.topic) {
      console.warn(
        "processRegistrationResponse: Received registration response without topic"
      );
      return;
    }

    const { topic } = req.body;
    console.log(
      `processRegistrationResponse:  Message topic: ${topic}, with message: ${message}`
    );

    res.code = 200;
    res.send();
  }

  //////////////////////////////////////////////////////////////////////////////
  /// receive message
  //////////////////////////////////////////////////////////////////////////////
  processMessage(topic, message) {
    console.log(`processMessage: Message: ${topic}, with message: `, message);

    if (!topic) {
      return false;
    }

    return true;
  }
} // Receiver

////////////////////////////////////////////////////////////////////////////////
/// exports
////////////////////////////////////////////////////////////////////////////////
module.exports.ReceiverRoutes = Routes;
module.exports.Receiver = Receiver;
