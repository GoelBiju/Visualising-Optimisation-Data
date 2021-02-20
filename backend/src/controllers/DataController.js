const Data = require("../models/Data");
const Run = require("../models/Run");

// Create a new data document for an optimisation run
const createData = async () => {
  let dataId = null;

  console.log("Creating data entry for run");
  const data = new Data();

  await data
    .save()
    .then(async (data) => {
      // Get the run information and create the generations objects
      // for (num in generations) {
      //   data.data[num] = {
      //     values: [],
      //   };
      // }
      // data.markModified("data");
      // await data.save();

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
  let added = false;

  // await getData(id).then(async (optimiserData) => {
  //   if (optimiserData) {
  //     // Add new data
  //     for (let i = 0; i < batch.length; i++) {
  //       optimiserData.data.push({
  //         // generation,
  //         values: batch[i],
  //       });
  //     }

  //     // Save the data
  //     await optimiserData.save();
  //     // console.log("Added new data for ", optimiserData._id);

  //     added = true;
  //   }
  // });

  // Find the run given the id
  console.log("querying for run: ", runId);
  const run = await Run.findById(runId).exec();
  if (run) {
    // Get the generation number
    const generations = run.generations;
    console.log("Current generation: ", generations);

    // Find the data given the ID
    const data = await Data.findById(dataId).exec();
    if (data) {
      // Add the new data as a new generation property.
      // console.log("retrieved data: ", data);
      const optimiserData = data.data;
      optimiserData.set(`${generations + 1}`, {
        values: batch,
      });

      data.markModified("data");
      console.log("optimiser data: ", optimiserData);

      await data.save().then(async () => {
        // Once updated increment the generation number
        run.generations++;
        run.markModified("generations");
        await run.save();
      });

      added = true;
    } else {
      console.log("addBatchData: Unable to get data by id: ", dataId);
    }
  } else {
    console.log("addBatchData: Unable to find run by ID: ", runId);
  }

  return added;
};

module.exports = {
  createData,
  addBatchData,
};
