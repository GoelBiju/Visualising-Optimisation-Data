const { addBatchData } = require("../controllers/DataController");

function dataConnection(socket) {
  console.log("Received data connection");

  socket.on("data", async function (optimiserMessage) {
    // console.log("Received data (ID)", optimiserMessage.dataId);
    // console.log("Received data length:", optimiserMessage.batch.length);

    // Store the data received
    const added = await addBatchData(
      optimiserMessage.dataId,
      // optimiserMessage.generation,
      optimiserMessage.batch
    );

    if (added) {
      socket.emit("save", {
        saved: true,
        // generation: optimiserMessage.generation,
      });
      // console.log(
      //   "Added data for ",
      //   optimiserMessage.dataId,
      //   optimiserMessage.generation
      // );
      // Check if the optimisation run is complete
    } else {
      socket.emit("save", {
        saved: false,
        message: "Failed to add the data",
      });
      console.log("Unable to add data for ", optmiserMessage.runId);
    }

    // TODO: only emit if there is a connected frontend
    // Emit the datapoint to the frontend.
    // frontendNamespace.emit("data", msg);
  });
}

module.exports = {
  dataConnection,
};
