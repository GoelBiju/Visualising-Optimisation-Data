const mongoose = require("mongoose");

// Create data schema
const DataSchema = mongoose.Schema(
  {
    // data: [
    //   {
    //     // generation: {
    //     //   type: Number,
    //     //   required: true,
    //     // },
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
      of: {
        values: [Number] | [[Number]] ,
        time: { type: Date, default: Date.now },
      },
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
