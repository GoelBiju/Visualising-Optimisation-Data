const mongoose = require("mongoose");

// Create data schema
const DataSchema = mongoose.Schema({
  data: [
    {
      // Support 2 objectives
      values: [Number, Number],
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Data", DataSchema);
