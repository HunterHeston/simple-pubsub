// local
const { Writer } = require("../writer");
const { LOG_INFO } = require("../util/log");

// debug and higher
process.env.log_level = 1;

////////////////////////////////////////////////////////////////////////////////
/// parse command-line args and call run
////////////////////////////////////////////////////////////////////////////////
function main() {
  // ignore the first 2 arguments
  const args = process.argv.slice(2);

  // default to reasonable values
  let serverAddress = "localhost";
  let serverPort = 3000;

  // parse command-line arguments
  //! This is fragile and for example purposes only.
  for (const arg of args) {
    const [command, value] = arg.split("=");

    switch (command) {
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
          `main: accepted arguments: --server-address=<ip of server> -s=<ip of server> --server-port-<server-port> -sp=<server-port>`
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

  run(serverAddress, serverPort);
}

////////////////////////////////////////////////////////////////////////////////
/// instantiate a writer and send messages to the server
////////////////////////////////////////////////////////////////////////////////
function run(serverAddress, serverPort) {
  const writer = new Writer(serverAddress, serverPort);

  setInterval(() => {
    writer.sendMessage("ping", {
      text: "I am pinging the server",
    });
  }, 10);

  setInterval(() => {
    writer.sendMessage("one-second", {
      text: "I am pinging the server",
    });
  }, 1000);
}

////////////////////////////////////////////////////////////////////////////////
/// execute main
////////////////////////////////////////////////////////////////////////////////
main();
