const { addBatchData } = require("../controllers/DataController");

function dataConnection(socket) {
  console.log("Received data connection");

  socket.on("data", async function (optimiser) {
    // console.log("Received data (ID)", optimiser.dataId);
    // console.log("Received data length:", optimiser.batch.length);

    // Store the data received
    const added = await addBatchData(
      optimiser.runId,
      optimiser.dataId,
      // optimiser.generation,
      optimiser.batch
    );

    if (added) {
      socket.emit("save", {
        saved: true,
        // generation: optimiser.generation,
      });
      // console.log(
      //   "Added data for ",
      //   optimiser.dataId,
      //   optimiser.generation
      // );
      // Check if the optimisation run is complete
    } else {
      socket.emit("save", {
        saved: false,
        message: "Failed to add the data",
      });
      console.log("Unable to add data for ", optmiser.runId);
    }

    // TODO: only emit if there is a connected frontend
    // Emit the datapoint to the frontend.
    // frontendNamespace.emit("data", msg);
  });
}

module.exports = {
  dataConnection,
};
