//import the mongoose library
const mongoose = require("mongoose");

//create a schema
const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

//create a model, the model is always Capitalized
//exports.Product veut dire on prend l'objet vide et l'exporter avec l'etiquette produit
exports.Product = mongoose.model("Product", productSchema);
