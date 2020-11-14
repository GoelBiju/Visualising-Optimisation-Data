var mongoose = require("mongoose");

// Connection information.

// Define a scheme.
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});
