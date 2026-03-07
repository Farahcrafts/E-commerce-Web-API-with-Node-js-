//creer un mini server
const express = require("express");
const router = express();

//importer le model product.js , {Product} is an object
const { Product } = require("../models/product.js");

//GET METHOD
//http://localhost:8000/api/v1/products

router.get("/", async (req, res) => {
  //bring the data from the database
  const productList = await Product.find();

  //pour attraper une erreur , si on a pas obtenu notre liste de la bdd
  if (!productList) {
    res.status(500).json({
      success: false,
      erreur: "La base de donnees n'est pas joignable",
    });
  }

  //pas d'erreur , son status par defaut c'est 200 "OK"
  res.send(productList);
});

//POST METHOD
router.post("/", (req, res) => {
  //le serveur prend le nouveau produit du front end
  // const newProduct = req.body;
  //le serveur retourne le produit sous forme de json grace au middleware
  // res.send(newProduct);

  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  //save() returns a promise , so we need .then and .catch
  //1. const product = new Product(...) (Le Brouillon)
  // Quand tu écris cette ligne, tu crées un simple objet JavaScript dans la mémoire de ton serveur Node.js.
  // À ce stade précis, MongoDB ne sait absolument pas que ce produit existe. C'est juste un brouillon local qui contient le nom, l'image et la quantité que tu as reçus de Postman.
  // 2. product.save() (L'envoi par la poste)
  // Cette commande prend ton brouillon (product) et l'envoie à travers Internet jusqu'à ta base de données MongoDB Atlas. Comme la fonction save() prend un peu de temps pour voyager sur le réseau, elle retourne une Promise (une promesse).
  // 3. .then((createdProduct) => ...) (Le Document Officiel)
  // Quand MongoDB reçoit le brouillon, il l'enregistre dans la base de données. Au passage, MongoDB ajoute automatiquement des informations supplémentaires que ton brouillon n'avait pas, comme un identifiant unique (le fameux _id) et un numéro de version (__v).
  // Ensuite, MongoDB renvoie ce document final et officiel à ton serveur Node.js.
  // C'est exactement ce document final qui atterrit à l'intérieur des parenthèses du .then() ! Le formateur a choisi de l'appeler createdProduct pour bien signifier "ceci est le produit tel qu'il vient d'être créé dans la base de données".
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
//ici on export la variable router tout seule
