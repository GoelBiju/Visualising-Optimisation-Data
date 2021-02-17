const express = require("express");
const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const mongoose = require("mongoose");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const runApiRoute = require("./src/routes/run");

const { frontendConnection } = require("./src/sockets/frontendSocket");
const { dataConnection } = require("./src/sockets/dataSocket");

// Connection information.
let url = process.env.MONGODB_URI || "mongodb://localhost:27017/optimisation";
let PORT = process.env.PORT || 9000;

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
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "resources")));

// Define routes.
app.use("/api", runApiRoute);

// Initialise the socket server.
let io = socketIo(server);

const dataNamespace = io.of("/data");
const frontendNamespace = io.of("/frontend");

frontendNamespace.on("connection", frontendConnection);

// "On connection" handler
dataNamespace.on("connection", dataConnection);

// Display the running port
app.get("/", (req, res) => {
  res.send(`Running on port ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Backend listening on ${PORT} (WebSocket)`);
});
