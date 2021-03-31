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
    currentGeneration: {
      type: Number,
      default: 0,
    },
    totalGenerations: {
      type: Number,
      default: 0,
    },
    graphs: {
      type: [String],
    },
    completed: {
      type: Boolean,
      required: true,
    },
    previousData: {
      type: Boolean,
      default: false,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Run", RunSchema);
