const mongoose = require("mongoose");

// Create a optimisation run schema
const RunSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    algorithm: {
      type: String,
      required: true,
    },
    algorithmParameters: mongoose.Schema.Types.Mixed,
    populationSize: {
      type: Number,
      required: true,
    },
    // totalPopulationSize: {
    //   type: Number,
    //   default: 0,
    // },
    generations: {
      type: Number,
      default: 0,
    },
    // TODO: Needs to define what types of graph
    //       to plot it's data on
    graphs: [String],
    dataId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Run", RunSchema);
