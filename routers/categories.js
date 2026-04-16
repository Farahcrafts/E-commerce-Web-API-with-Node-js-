//creer un miniserveur
const express = require("express");
const router = express();

//importer le model categorie
const { Category } = require("../models/category");

//methode GET
router.get("/", async (req, res) => {
  //recuperer la liste des categories
  const categoryList = await Category.find();

  //si on a une erreur
  if (!categoryList) {
    res.status(500).json({
      succes: false,
      erreur: "la liste des categories n'est pas trouvee",
    });
  }

  //pas d'erreur
  res.send(categoryList);
});

//methode POST
router.post("/", (req, res) => {
  //recuperer le produit du frontend
  const category = new Category({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  //save the category , send it to mongodb
  category
    .save()

    //recupere la category mise a jour envoye par mongodb
    .then((createdCategory) => {
      res.status(201).send(createdCategory);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
