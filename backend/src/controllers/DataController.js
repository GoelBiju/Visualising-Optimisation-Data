const Data = require("../models/Data");

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

// Get a data document by its id
const getData = async (id) => {
  const data = await Data.findById(id).exec();
  return data;
};

// Add optimisation data to the document
const addBatchData = async (id, batch) => {
  // generation
  let added = false;

  await getData(id).then(async (optimiserData) => {
    if (optimiserData) {
      // Add new data
      for (let i = 0; i < batch.length; i++) {
        optimiserData.data.push({
          // generation,
          values: batch[i],
        });
      }

      // Save the data
      await optimiserData.save();
      // console.log("Added new data for ", optimiserData._id);

      added = true;
    }
  });

  return added;
};

module.exports = {
  createData,
  getData,
  addBatchData,
};
