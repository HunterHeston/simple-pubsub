// local
const { Server } = require("../server");
const { LOG_INFO, LOG_WARN } = require("../util/log");

////////////////////////////////////////////////////////////////////////////////
/// parse command line args and call the run function
////////////////////////////////////////////////////////////////////////////////
function main() {
  // ignore first 2 arguments
  const args = process.argv.slice(2);

  // default to reasonable values
  let port = 3000;

  // parse command-line arguments
  //! This is fragile and for example purposes only.
  for (const arg of args) {
    const [command, value] = arg.split("=");

    switch (command) {
      case "--port":
      case "-p":
        port = parseInt(value);
        break;

      case "--help":
      case "-h":
        LOG_INFO(`main: accepted arguments: --port=<port> -p=<port>`);

        //* is help is requested we should not proceed with execution.
        return;

      default:
        LOG_WARN(
          `main: invalid argument '${arg}' will be ignored: use -h for help`
        );
        break;
    }
  }

  // run the server
  run(port);
}

////////////////////////////////////////////////////////////////////////////////
/// start a server on a given port
////////////////////////////////////////////////////////////////////////////////
function run(port) {
  const server = new Server(port);
  server.start();
}

////////////////////////////////////////////////////////////////////////////////
/// execute main
////////////////////////////////////////////////////////////////////////////////
main();
