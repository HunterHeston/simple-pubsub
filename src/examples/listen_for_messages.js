// local
const { Receiver } = require("../receiver");
const { LOG_INFO, LOG_WARN } = require("../util/log");

////////////////////////////////////////////////////////////////////////////////
function main() {
  // ignore the first 2 arguments
  const args = process.argv.slice(2);

  // default to reasonable values
  let port = 3001;
  let serverAddress = "localhost";
  let serverPort = 3000;

  // parse command-line arguments
  //! This is fragile and for example purposes only.
  for (const arg of args) {
    const [command, value] = arg.split("=");

    switch (command) {
      case "--port":
      case "-p":
        port = parseInt(value);
        break;

      case "--server-address":
      case "-s":
        serverAddress = value;
        break;

      case "--server-port":
      case "-sp":
        serverPort = parseInt(value);
        break;

      case "--help":
      case "-h":
        LOG_INFO(
          `main: accepted arguments: --port=<port> -p=<port> --server-address=<ip of server> -s=<ip of server> --server-port-<server-port> -sp=<server-port>`
        );

        //* is help is requested we should not proceed with execution.
        return;

      default:
        LOG_WARN(
          `main: invalid argument '${arg}' will be ignored: use -h for help`
        );
        break;
    }
  }

  run(port, serverAddress, serverPort);
}

////////////////////////////////////////////////////////////////////////////////
function run(port, serverAddress, serverPort) {
  const receiver = new Receiver(port, serverAddress, serverPort);

  receiver.registerTopic("ping", (message) => {
    LOG_INFO(`run: received message on simple-topic`);
    LOG_INFO(message);
  });
  receiver.registerTopic("location", (message) => {
    LOG_INFO(`run: received message on location`);
    LOG_INFO(message);
  });
  receiver.registerTopic("like", (message) => {
    LOG_INFO(`run: received message on like`);
    LOG_INFO(message);
  });
  receiver.registerTopic("data", (message) => {
    LOG_INFO(`run: received message on data`);
    LOG_INFO(message);
  });

  receiver.start();
}

////////////////////////////////////////////////////////////////////////////////
/// start the main function
////////////////////////////////////////////////////////////////////////////////
main();
