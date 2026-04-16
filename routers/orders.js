//creer un miniserveur
const express = require("express");
const router = express();

//importer le model categorie
const { Order } = require("../models/order");

//methode GET
router.get("/", async (req, res) => {
  //recuperer la liste des categories
  const orderList = await Order.find();

  //si on a une erreur
  if (!orderList) {
    res.status(500).json({
      succes: false,
      erreur: "la liste des orders n'est pas trouvee",
    });
  }

  //pas d'erreur
  res.send(orderList);
});

//methode POST
router.post("/", (req, res) => {
  //recuperer le produit du frontend
  const order = new Order({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  //save the category , send it to mongodb
  order
    .save()

    //recupere la category mise a jour envoye par mongodb
    .then((createdOrder) => {
      res.status(201).send(createdOrder);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
