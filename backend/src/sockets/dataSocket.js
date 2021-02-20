const Run = require("../models/Run");

const { addBatchData } = require("../controllers/DataController");

function dataConnection(socket) {
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
      // console.log(
      //   "Added data for ",
      //   optimiser.dataId,
      //   optimiser.generation
      // );

      // Emit the updated generation to the frontend
      // room for the optimisation run
      const run = await Run.findOne({ _id: runId }).exec();
      if (run) {
        // Send to the frontend room for this run
        FrontendNamespace.to(runId).emit("nextGeneration", run.generation);
      }
    } else {
      socket.emit("save", {
        saved: false,
        message: "Failed to add the data",
      });
      console.log("Unable to add data for ", optimiser.runId);
    }
  });
}

module.exports = {
  dataConnection,
};
