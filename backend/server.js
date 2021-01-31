let express = require("express");
let path = require("path");
let http = require("http");
let socketIo = require("socket.io");
let mongoose = require("mongoose");

// Connection information.
let url = "mongodb://localhost:27017/optimisationdb";
let PORT = 9000;

// Connect
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Set up the app and server.
let app = express();
let server = http.createServer(app);

// Configure statics.
app.use(express.static(path.join(__dirname, "resources")));

// Initialise the socket server.
let io = socketIo(server);

const dataNamespace = io.of("/data");
const frontendNamespace = io.of("/frontend");

frontendNamespace.on("connection", function (socket) {
  console.log("Front-end connection established");

  // TODO: Send a message to the client.

  socket.on("frontend", function (msg) {
    console.log("Frontend message: ", msg);
  });
});

// "On connection" handler
dataNamespace.on("connection", function (socket) {
  // io.on("connection", function (socket) {
  console.log("Received data connection");

  socket.on("dataPoint", function (msg) {
    console.log("Received data point: ", msg);

    // Emit the datapoint to the frontend.
    frontendNamespace.emit("data", msg);
  });
});

server.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
