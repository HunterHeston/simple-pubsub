// includes
const express = require("express");

// util
const { sendHttpMessage } = require("./util/sendHttpMessage");

// receiver
const { ReceiverRoutes } = require("./receiver");

////////////////////////////////////////////////////////////////////////////////
/// routes
////////////////////////////////////////////////////////////////////////////////
const Routes = {
  ROOT: "/",
  TOPICS: "/topics",
  TOPICS_LIST: "/topics/list",
  TOPIC_REGISTER: "/topics/register",
  TOPIC_PUBLISH: "/topics/publish",
};

////////////////////////////////////////////////////////////////////////////////
/// server class for processing messages and registrations
////////////////////////////////////////////////////////////////////////////////
class Server {
  constructor(port) {
    // express setup
    this.port = port;
    this.app = express();
    this.registerMiddleware(this.app);
    this.registerRoutes(this.app);

    // members
    this.topics = new Map();
  }

  //////////////////////////////////////////////////////////////////////////////
  /// start the server
  //////////////////////////////////////////////////////////////////////////////
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server: started express app on port: ${this.port}`);
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  /// register routes
  //////////////////////////////////////////////////////////////////////////////
  registerRoutes(app) {
    if (!app) {
      console.error("registerRoutes: express app not provided");
      throw new Error(
        "registerRoutes: app initialization failed, app not provided"
      );
    }

    // home
    app.get(Routes.ROOT, (req, res) => {
      res.send(`Welcome to pubsub.`);
    });

    // list all topics
    app.get(Routes.TOPICS_LIST, (req, res) => {
      console.log(
        `Server:: Request to list topics from ${req.connection.remoteAddress}`
      );

      const topics = [];
      const topicIter = this.topics.keys();

      for (const topic of topicIter) {
        topics.push(topic);
      }

      console.log(topics);

      res.send(topics);
    });

    // register new topics
    app.post(Routes.TOPIC_REGISTER, (req, res) => {
      const { topic, clientAddress, clientPort } = req.body;

      // todo parse clientAddress and clientPort.
      if (
        !topic ||
        typeof topic !== "string" ||
        !clientAddress ||
        typeof clientAddress !== "string" ||
        !clientPort ||
        typeof clientPort !== "number"
      ) {
        console.error(
          `Server::registerTopic: registration request without topic`
        );
        res.code = 300;
        res.send("no topic provided");
      }

      if (!this.topics.has(topic)) {
        this.topics.set(topic, []);
      }

      for (const client of this.topics.get(topic)) {
        if (
          clientAddress === client.clientAddress &&
          clientPort === client.clientPort
        ) {
          console.warn(
            `Server:: topic "${topic}" already registered by: ${clientAddress}:${clientPort}`
          );

          res.status = 200;
          res.send(`topic ${topic} already already registered at this address`);
          return;
        }
      }

      this.topics.get(topic).push({ clientAddress, clientPort });
      res.status = 200;
      res.send(`registered ${topic}`);
    });

    // process incoming messages
    app.post(Routes.TOPIC_PUBLISH, (req, res) => {
      const { topic, message } = req.body;

      console.log(req.body);

      if (this.routeMessage(topic, message)) {
        res.status = 200;
        res.send(`Message send on topic ${topic}`);
        return;
      }

      res.status = 400;
      res.send(`Topic not registered or not provided: ${topic}`);
      return;
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  /// Route published messages
  //////////////////////////////////////////////////////////////////////////////
  routeMessage(topic, message) {
    console.log(topic, message);
    if (!topic || !this.topics.has(topic)) {
      return false;
    }

    const data = { topic: topic, message: message };

    for (const client of this.topics.get(topic)) {
      console.log(
        `sending message to: ${client.clientAddress}:${client.clientPort}`
      );

      sendHttpMessage(
        client.clientAddress,
        client.clientPort,
        ReceiverRoutes.RECEIVE_MESSAGE,
        "POST",
        data
      );
    }

    return true;
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
} // server

////////////////////////////////////////////////////////////////////////////////
/// Exports
////////////////////////////////////////////////////////////////////////////////
module.exports.ServerRoutes = Routes;
module.exports.Server = Server;
