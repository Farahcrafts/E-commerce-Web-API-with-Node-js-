//importer mongoose
const mongoose = require("mongoose");

//creer une schema
const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
});

exports.Category = mongoose.model("Category", categorySchema);
