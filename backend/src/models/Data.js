const mongoose = require("mongoose");

// Create data schema
const DataSchema = mongoose.Schema({
  // data: [
  //   {
  //     // generation: {
  //     //   type: Number,
  //     //   required: true,
  //     // },
  //     // Support 2 objectives
  //     values: {
  //       type: [Number, Number],
  //       required: true,
  //     },
  //     time: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //   },
  // ],
  data: {
    type: mongoose.SchemaTypes.Map,
    of: [[Number, Number]],
    default: {},
  },
});

module.exports = mongoose.model("Data", DataSchema);
