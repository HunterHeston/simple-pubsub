// includes
const express = require("express");

////////////////////////////////////////////////////////////////////////////////
/// routes
////////////////////////////////////////////////////////////////////////////////
const Routes = {
  ROOT: "/",
  TOPICS: "/topics",
  TOPICS_LIST: "/topics/list",
  TOPIC_REGISTER: "/topics/register",
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

    ////////////////////////////////////////////////////////////////////////////
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

    ////////////////////////////////////////////////////////////////////////////
    // register new topics
    app.post(Routes.TOPIC_REGISTER, (req, res) => {
      const { topic, clientAddress, clientPort } = req.body;

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
      res.send(`registered ${topic}`);
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
}

////////////////////////////////////////////////////////////////////////////////
/// Exports
////////////////////////////////////////////////////////////////////////////////
module.exports.ServerRoutes = Routes;
module.exports.Server = Server;
