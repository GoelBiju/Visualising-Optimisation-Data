const express = require("express");
const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const mongoose = require("mongoose");

const morgan = require("morgan");
const bodyParser = require("body-parser");

let runApiRoute = require("./src/routes/run");

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

// Configure app.
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "resources")));

// Define routes.
app.use("/api", runApiRoute);

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

// Set up routes.

server.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
