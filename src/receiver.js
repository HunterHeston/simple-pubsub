// libraries
const express = require("express");
const v8 = require("v8");

// server
const { ServerRoutes } = require("./server");

// util
const { sendHttpMessage } = require("./util/sendHttpMessage");
const { LOG_INFO, LOG_ERROR, LOG_DEBUG, LOG_WARN } = require("./util/log");

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
    LOG_INFO(
      `Receiver::constructor: receiverPort: ${receiverPort}, serverAddress: ${serverAddress}, serverPort: ${serverPort}`
    );

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
      LOG_INFO(`Receiver::start: started express app on port: ${this.port}`);
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  /// stop the app thats listening for data
  //////////////////////////////////////////////////////////////////////////////
  stop() {
    // todo how do we stop the express server??
  }

  //////////////////////////////////////////////////////////////////////////////
  /// Register express endpoints
  //////////////////////////////////////////////////////////////////////////////
  registerRoutes(app) {
    if (!app) {
      LOG_ERROR("registerRoutes: express app not provided");
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

      LOG_DEBUG(req.body);

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
      LOG_ERROR("registerMiddleware: express app not provided");
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
      LOG_WARN(
        "processRegistrationResponse: Received registration response without topic"
      );
      return;
    }

    const { topic } = req.body;
    LOG_DEBUG(
      `processRegistrationResponse:  Message topic: ${topic}, with message: ${message}`
    );

    res.code = 200;
    res.send();
  }

  //////////////////////////////////////////////////////////////////////////////
  /// receive message
  //////////////////////////////////////////////////////////////////////////////
  processMessage(topic, message) {
    LOG_DEBUG(`processMessage: Message: ${topic}, with message: `, message);

    if (!topic) {
      LOG_ERROR(`processMessage: received message without topic.`);
      return false;
    }

    const callbacks = this.topics.get(topic);

    callbacks.forEach((callback) => {
      callback(v8.deserialize(v8.serialize(message)));
    });

    return true;
  }
} // Receiver

////////////////////////////////////////////////////////////////////////////////
/// exports
////////////////////////////////////////////////////////////////////////////////
module.exports.ReceiverRoutes = Routes;
module.exports.Receiver = Receiver;
