const Run = require("../models/Run");
const Data = require("../models/Data");

// Create a new data document for an optimisation run
const createData = async () => {
  let dataId = null;

  console.log("Creating data entry for run");
  const data = new Data();

  await data
    .save()
    .then(async (data) => {
      console.log("Created data store: ", data._id);
      dataId = data._id;
    })
    .catch((error) => {
      console.log("An error occurred: ", error);
    });

  return dataId;
};

// Add optimisation data to the document
// We need the runId to update the generation number afterwards
const addBatchData = async (runId, dataId, batch) => {
  let added = null;

  // Find the run given the id
  console.log("querying for run: ", runId);
  const run = await Run.findById(runId).exec();
  if (run) {
    if (!run.completed) {
      // Get the generation number
      const generation = run.currentGeneration;
      console.log("Current generation: ", generation);

      // Find the data given the ID
      const data = await Data.findById(dataId).exec();
      if (data) {
        // Add the new data as a new generation property.
        // console.log("retrieved data: ", data);
        const optimiserData = data.data;
        // console.log("Batch received: ", batch);
        optimiserData.set(`${generation + 1}`, {
          values: batch,
        });

        data.markModified("data");
        // console.log("optimiser data: ", optimiserData);

        await data.save().then(async () => {
          // Once updated increment the generation number
          run.currentGeneration++;
          run.markModified("currentGeneration");

          // Check to see if the run is complete.
          if (run.currentGeneration === run.totalGenerations) {
            run.completed = true;
            console.log("Completed run: ", run._id);
          }

          await run.save();
        });

        added = run._id;
      } else {
        console.log("addBatchData: Unable to get data by id: ", dataId);
      }
    } else {
      console.log("addBatchData: The run is already complete: ", runId);
    }
  } else {
    console.log(
      "addBatchData: Unable to find run by id or the run is complete: ",
      runId
    );
  }

  return added;
};

module.exports = {
  createData,
  addBatchData,
};
