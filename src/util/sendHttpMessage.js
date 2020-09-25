const http = require("http");

////////////////////////////////////////////////////////////////////////////////
/// helper message for sending http requests
////////////////////////////////////////////////////////////////////////////////
function sendHttpMessage(address, port, route, method, data) {
  if (!address || !port || !route || !method || !data) {
    console.error(`sendHttpMessage: invalid input provided`);
    return false;
  }

  console.log(`sendHttpMessage: sending`, data);

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
    console.log(`sendHttpMessage::publish: status code: ${res.statusCode}`);
    res.on("data", (data) => {
      console.log(new String(data));
    });
  });

  request.on("error", (error) => console.error(error));
  request.write(serializedData);
  request.end();

  return true;
}

////////////////////////////////////////////////////////////////////////////////
/// exports
////////////////////////////////////////////////////////////////////////////////
module.exports.sendHttpMessage = sendHttpMessage;
