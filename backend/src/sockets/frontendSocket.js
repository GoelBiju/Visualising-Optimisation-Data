function frontendConnection(socket) {
  console.log("Front-end connection established");

  // TODO: Connect frontend into rooms to allow different data connections
  socket.on("frontend", function (msg) {
    console.log("Frontend message: ", msg);
  });
}

module.exports = {
  frontendConnection,
};
