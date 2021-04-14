const express = require("express");
const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const mongoose = require("mongoose");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const runApiRoute = require("./src/routes/run");
const { setupNamespaces } = require("./src/sockets/namespaces");

console.log("Backend - e2e testing: ", process.env.E2E_TESTING);

// Connection information (connects to custom MongoDB provided by
// environment variable "MONGO_URI" or just uses local).
let url = process.env.MONGODB_URI || "mongodb://localhost:27017/optimisation";
let PORT = process.env.PORT || 9000;

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Set up the app and server.
let app = express();
let server = http.createServer(app);

// Configure app.
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "resources")));

// Define routes.
app.use("/api", runApiRoute);

// Initialise the socket server
// and set up the namespaces.
let io = socketIo(server);
setupNamespaces(io);

// Display the running port
app.get("/", (req, res) => {
  res.send(`Backend running on port ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Backend listening on ${PORT} (WebSocket)`);
});
