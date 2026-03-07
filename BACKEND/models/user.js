//importer mongoose
const mongoose = require("mongoose");

//creer schema
const userSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

//creer le modele
exports.User = mongoose.model("User", userSchema);
