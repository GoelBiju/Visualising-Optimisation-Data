const Data = require("../models/Data");

// Create a new data document for an optimisation run
const createData = async () => {
  let dataId = null;

  console.log("Creating data entry for run");
  const data = new Data();

  await data
    .save()
    .then((data) => {
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
const addData = async (id, generation, values) => {
  let added = false;

  await getData(id).then(async (optimiserData) => {
    if (optimiserData) {
      // Add new data
      optimiserData.data.push({
        generation,
        values,
      });

      // Save the data
      optimiserData.markModified("data");
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
  addData,
};