const Run = require("../models/Run");
const Data = require("../models/Data");
const { addBatchData } = require("../controllers/DataController");

function setupNamespaces(io) {
  // Set up the namespaces
  const dataNamespace = io.of("/data");
  const frontendNamespace = io.of("/frontend");

  // Handle frontend connections
  frontendNamespace.on("connection", (socket) => {
    console.log("Front-end connection established");

    // When receiving a subscription message, join the room
    // based on the optimisation run ID
    socket.on("subscribe", (runId) => {
      socket.join(runId);
      console.log("Subscribed to: ", runId);

      // TODO: Handle subscribed
      socket.emit("subscribed", runId);
    });

    // Fetch generation data given the data ID
    // and generation number
    socket.on("data", async (dataRequest) => {
      // Get the dataId and generation from the request object
      const { dataId, generation } = dataRequest;

      // Get the data based on the run ID
      const data = await Data.findById(dataId).lean();
      if (data) {
        const optimiserData = data.data;
        if (optimiserData[generation]) {
          // Send the generation data to the client
          // console.log("Got data: ", optimiserData[generation]);
          socket.emit("data", {
            generation,
            data: optimiserData[generation].values,
            time: optimiserData[generation].time,
          });
        } else {
          console.log("Generation not present: ", generation);
        }
      } else {
        console.log(
          `Unable to find data for ${dataId} for generation ${generation}`
        );
      }
    });
  });

  // "On connection" handler
  dataNamespace.on("connection", (socket) => {
    console.log("Received data connection");

    socket.on("data", async function (optimiser) {
      // console.log("Received data (ID)", optimiser.dataId);
      // console.log("Received data length:", optimiser.batch.length);

      // Store the data received
      const runId = await addBatchData(
        optimiser.runId,
        optimiser.dataId,
        optimiser.batch
      );

      if (runId !== null) {
        // Emit save back to the client to show
        // we have added the data
        socket.emit("save", {
          saved: true,
        });
        console.log("Added data for ", optimiser.dataId);

        // Emit the updated generation to the frontend
        // room for the optimisation run
        const run = await Run.findOne({ _id: runId }).exec();
        console.log("Got run for emitting to frontend: ", run._id);
        if (run) {
          // Send to the frontend room for this run
          frontendNamespace.to(runId).emit("generation", run.currentGeneration);
          console.log("Emitted next generation: ", run.currentGeneration);
        }
      } else {
        socket.emit("save", {
          saved: false,
          message: "Failed to add the data",
        });
        console.log("Unable to add data for ", optimiser.runId);
      }
    });
  });
}

module.exports = {
  setupNamespaces,
};
