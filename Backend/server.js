let express = require("express");
let path = require("path");
let http = require("http");
let socketIo = require("socket.io");

// var mongoose = require("mongoose");

// Connection information.

// Define a scheme.
// var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//   a_string: String,
//   a_date: Date,
// });

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

server.listen(9000, () => {
  console.log("Listening on 9000");
});
