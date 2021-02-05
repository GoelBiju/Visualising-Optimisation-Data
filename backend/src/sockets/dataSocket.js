const { addData } = require("../controllers/DataController");

function dataConnection(socket) {
  console.log("Received data connection");

  socket.on("data", async function (optimiserMessage) {
    // console.log("Received", optimiserMessage.dataId);
    // Store the data received
    const added = await addData(
      optimiserMessage.dataId,
      optimiserMessage.generation,
      optimiserMessage.values
    );

    if (added) {
      console.log(
        "Added data for ",
        optimiserMessage.dataId,
        optimiserMessage.generation
      );

      // Check if the optimisation run is complete
    } else {
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
