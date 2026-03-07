//creer un miniserveur
const express = require("express");
const router = express();

//importer le model categorie
const { User } = require("../models/user");

//methode GET
router.get("/", async (req, res) => {
  //recuperer la liste des categories
  const userList = await User.find();

  //si on a une erreur
  if (!userList) {
    res.status(500).json({
      succes: false,
      erreur: "la liste des categories n'est pas trouvee",
    });
  }

  //pas d'erreur
  res.send(userList);
});

//methode POST
router.post("/", (req, res) => {
  //recuperer le produit du frontend
  const user = new User({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  //save the category , send it to mongodb
  user
    .save()

    //recupere la category mise a jour envoye par mongodb
    .then((createdUser) => {
      res.status(201).send(createdUser);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
