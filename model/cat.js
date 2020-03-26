const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const catSchema = new Schema({
  name: String,
  age: Number,
  owner: mongoose.ObjectId
});

module.exports = mongoose.model("cat", catSchema);
