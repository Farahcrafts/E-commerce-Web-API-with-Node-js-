//create the server
const express = require("express");
const app = express();

//importer l'environemental variable
require("dotenv/config");
const api = process.env.API_URL;

//install morgan to log http requests
const morgan = require("morgan");
app.use(morgan("tiny"));

//middlewares
//body parser pour parser les données envoyées par le client dans le corps de la requête HTTP, et les rendre accessibles dans req.body
app.use(express.json());

//cors pour permettre les requêtes cross-origin, c'est-à-dire les requêtes provenant de domaines différents de celui du serveur. Cela est nécessaire pour permettre à des applications front-end hébergées sur des domaines différents d'accéder à l'API.
const cors = require("cors");
app.use(cors());
app.options(/.*/, cors());

//jwt pour sécuriser les routes de l'API en vérifiant que les requêtes contiennent un token d'authentification valide. Le middleware authJwt va intercepter les requêtes entrantes, vérifier le token et autoriser ou refuser l'accès aux ressources protégées en fonction de la validité du token.
const authJwt = require("./helpers/jwt.js");
app.use(authJwt());

//import mongoose
const mongoose = require("mongoose");

//error handler pour gérer les erreurs de manière centralisée. Si une erreur se produit dans l'une des routes ou des middlewares, elle sera capturée par ce gestionnaire d'erreurs, qui pourra ensuite formater la réponse d'erreur de manière cohérente et informative pour le client.
const errorHandler = require("./helpers/error-handler.js");

// Pour toutes les requêtes (URL) qui commencent par /api/v1/products,
//  redirige-les vers le mini-programme productsRouter pour qu'il s'en occupe.

//products router
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
//error handler
app.use(errorHandler);

//we add connection to the database before starting the server
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database connection is ready...");
    //start the server
    app.listen(3000, () => {
      console.log(api);
      console.log("server is running http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
