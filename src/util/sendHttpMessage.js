const http = require("http");
const { LOG_DEBUG, LOG_ERROR } = require("./log");

////////////////////////////////////////////////////////////////////////////////
/// helper message for sending http requests
////////////////////////////////////////////////////////////////////////////////
function sendHttpMessage(address, port, route, method, data) {
  if (!address || !port || !route || !method || !data) {
    LOG_ERROR(`sendHttpMessage: invalid input provided`);
    return false;
  }

  LOG_DEBUG(`sendHttpMessage: sending`, data);

  const serializedData = JSON.stringify(data);

  const options = {
    hostname: address,
    port: port,
    path: route,
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": serializedData.length,
    },
  };

  const request = http.request(options, (res) => {
    LOG_DEBUG(`sendHttpMessage::publish: status code: ${res.statusCode}`);
    res.on("data", (data) => {
      LOG_DEBUG(new String(data));
    });
  });

  request.on("error", (error) => LOG_ERROR(error));
  request.write(serializedData);
  request.end();

  return true;
}

////////////////////////////////////////////////////////////////////////////////
/// exports
////////////////////////////////////////////////////////////////////////////////
module.exports.sendHttpMessage = sendHttpMessage;
