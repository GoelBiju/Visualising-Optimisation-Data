function dataConnection(socket) {
  // io.on("connection", function (socket) {
  console.log("Received data connection");

  socket.on("dataPoint", function (msg) {
    console.log("Received data: ", msg);

    // Store the data received
    // const added =

    // TODO: only emit if there is a connected frontend
    // Emit the datapoint to the frontend.
    // frontendNamespace.emit("data", msg);
  });
}

module.exports = {
  dataConnection,
};
