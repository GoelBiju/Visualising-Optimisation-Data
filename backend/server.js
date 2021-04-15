const express = require("express");
const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const mongoose = require("mongoose");

const morgan = require("morgan");
const cors = require("cors");

const runApiRoute = require("./src/routes/run");
const { setupNamespaces } = require("./src/sockets/namespaces");

const Run = require("./src/models/Run");
const Data = require("./src/models/Data");
const {
  createData,
  addBatchData,
} = require("./src/controllers/DataController");

// Connection information (connects to custom MongoDB provided by
// environment variable "MONGO_URI" or just uses local).
let url = process.env.MONGODB_URI || "mongodb://localhost:27017/optimisation";
let PORT = process.env.PORT || 9000;

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    console.log("Backend - e2e testing: ", process.env.E2E_TESTING);
    if (process.env.E2E_TESTING) {
      // Test run information
      const runInfo = {
        title: "Test Run",
        problem: "Test Problem",
        algorithm: "Test Algorithm",
        algorithmParameters: {
          testParameter: 1,
        },
        populationSize: 100,
        totalGenerations: 100,
      };

      const testRun = await Run.findOne(runInfo).lean();
      console.log("Found: ", testRun);
      if (testRun) {
        // Delete for the existing test run
        Run.deleteOne(runInfo).then(() => {
          console.log("Found existing test run and removed");

          // Delete the test data that was associated with the run
          Data.deleteOne({ _id: testRun.dataId }).then(() => {
            console.log(
              "Deleted data related to run with ID: ",
              testRun.dataId
            );
          });
        });
      }

      // Create test data
      const dataId = await createData();
      console.log("Got dataID: ", dataId);

      // Create a test run
      let run = new Run({
        ...runInfo,
        graphs: ["pareto-front"],
        previousData: false,
        dataId,
        completed: false,
      });

      // Save the test run
      run.save().then(async (run) => {
        console.log("Created test run with ID: ", run._id);

        // Add test data
        const setOne = [
          [5, 5],
          [10, 10],
          [20, 20],
        ];

        const setTwo = [
          [2, 4],
          [15, 30],
          [25, 40],
        ];

        const addedOne = await addBatchData(run._id, dataId, setOne);
        console.log("Added set one: ", addedOne);

        const addedTwo = await addBatchData(run._id, dataId, setTwo);
        console.log("Added set two: ", addedTwo);
      });

      console.log("Added test data");
    }
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
