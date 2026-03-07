//importer mongoose
const mongoose = require("mongoose");

//creer schema
const orderShema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

//creer le model
exports.Order = mongoose.model("Order", orderShema);
