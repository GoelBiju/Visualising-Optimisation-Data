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
      generations,
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
        generations,
        graphs,
        dataId,
        completed: false,
      });

      // Save the run.
      run
        .save()
        .then((run) => {
          console.log("Created a run for: ", title);

          res.json({
            created: true,
            runId: run._id,
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

module.exports = {
  getRuns,
  createRun,
};
