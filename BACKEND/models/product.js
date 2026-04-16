//import the mongoose library
const mongoose = require("mongoose");

//create a schema
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  desciption: { type: String, required: true },
  richDescription: { type: String, default: "" },
  image: { type: String, required: true },
  images: [{ type: String }],
  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now, // Automatically stamps the current date when created
  },
});

//create a model, the model is always Capitalized
//exports.Product veut dire on prend l'objet vide et l'exporter avec l'etiquette produit
exports.Product = mongoose.model("Product", productSchema);
