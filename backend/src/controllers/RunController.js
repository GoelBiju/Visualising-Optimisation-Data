const Run = require("../models/Run");

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

    // Create a optimisation run given the information
    let run = new Run({
      title,
      problem,
      algorithm,
      algorithmParameters,
      populationSize,
      generations,
      graphs,
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
