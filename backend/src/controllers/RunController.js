const Run = require("../models/Run");
const { createData } = require("./DataController");

const createRun = async (req, res, next) => {
  try {
    console.log("Request: ", req.body);
    // Get the relevant information.
    const {
      title,
      problem,
      algorithm,
      algorithmParameters,
      populationSize,
      // generations,
      graphs,
    } = req.body;

    // Get a created data document
    const dataId = await createData();
    if (dataId != null) {
      // Create a optimisation run given the information
      let run = new Run({
        title,
        problem,
        algorithm,
        algorithmParameters,
        populationSize,
        // generations,
        graphs,
        dataId,
        completed: false,
      });

      // Save the run.
      run
        .save()
        .then((run) => {
          console.log("Created a run for: ", run.title);

          // Send back the run and  data IDs.
          res.json({
            created: true,
            runId,
            dataId,
          });
        })
        .catch((error) => {
          res.json({
            created: false,
            message: `An error occurred: ${error}`,
          });
        });
    } else {
      res.json({
        created: false,
        message: `The optimisation data document could not be created`,
      });
    }
  } catch (err) {
    res.json({
      message: `An error occurred: ${err}`,
    });
  }
};

const getRunByDataId = async (dataId) => {
  const run = await Run.find({ dataId }).exec();
  return run;
};

const getRuns = async (req, res, next) => {
  await Run.find()
    .exec()
    .then((runs) => {
      console.log("Found optimisation runs: ", runs);
      res.json({
        runs,
      });
    })
    .catch((err) => {
      res.json({
        message: `An error occurred: ${err}`,
      });
    });
};

const getRun = async (req, res, next) => {
  try {
    const runId = req.params.runId;

    await Run.findOne({ _id: runId })
      .exec()
      .then((run) => {
        console.log("Found optimisation runs: ", run);
        res.json({
          run,
        });
      })
      .catch((err) => {
        res.json({
          message: `An error occurred: ${err}`,
        });
      });
  } catch (err) {
    res.json({
      message: `An error occurred: ${err}`,
    });
  }
};

module.exports = {
  getRuns,
  getRun,
  getRunByDataId,
  createRun,
};
