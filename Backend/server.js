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

// "On connection" handler
dataNamespace.on("connection", function (socket) {
  console.log("Received data connection");

  // TODO: Send a message to the client.
  // socket.emit("server message", "Hello World");

  socket.on("dataPoint", function (msg) {
    console.log("Received data point: ", msg);

    // Emit the datapoint to the frontend.
    frontendNamespace.emit("data", { x: msg.x, y: msg.y });
  });
});

frontendNamespace.on("connection", function (socket) {
  console.log("Frontend connection established");

  socket.on("frontend-message", function (msg) {
    console.log("Frontend message: ", msg);
  });
});

server.listen(9000, () => {
  console.log("Listening on 9000");
});
