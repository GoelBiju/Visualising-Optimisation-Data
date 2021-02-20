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
            runId: run._id,
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

    // Get the run by id.
    Run.findOne({ _id: runId })
      .exec()
      .then((run) => {
        if (run) {
          console.log("Found optimisation run: ", run);
          res.json({
            run,
          });
        }
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

const getProperty = async (req, res, next) => {
  try {
    // Get the property name
    const runId = req.params.runId;
    const property = req.params.property;
    console.log("Got runId: ", runId, property);

    // Get the run by id
    Run.findOne({ _id: runId })
      .exec()
      .then((run) => {
        if (run && run[property]) {
          console.log("Found optimisation run: ", run);
          res.json({
            [property]: run[property],
          });
        } else {
          res.json({
            message: `Cannot get run or find property in run ${runId} with property ${property}`,
          });
        }
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
  createRun,
  getRuns,
  getRun,
  getProperty,
};
