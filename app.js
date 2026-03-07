//create the server
const express = require("express");
const app = express();

//importer l'environemental variable
require("dotenv/config");
const api = process.env.API_URL;

//install morgan to log http requests
const morgan = require("morgan");
app.use(morgan("tiny"));

//middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//import mongoose
const mongoose = require("mongoose");

//products router
// Pour toutes les requêtes (URL) qui commencent par /api/v1/products,
//  redirige-les vers le mini-programme productsRouter pour qu'il s'en occupe.
const productsRouter = require("./routers/products.js");
app.use(`${api}/products`, productsRouter);

//categories router
const categoriesRouter = require("./routers/categories.js");
app.use(`${api}/categories`, categoriesRouter);

//orders router
const ordersRouter = require("./routers/orders.js");
app.use(`${api}/orders`, ordersRouter);

//users router
const usersRouter = require("./routers/users.js");
app.use(`${api}/users`, usersRouter);

//we add connection to the database before starting the server
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//start the server
app.listen(8000, () => {
  console.log(api);
  console.log("server is running http://localhost:8000");
});
