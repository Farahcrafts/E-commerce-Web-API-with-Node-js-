//importer le model
const { Category } = require("../models/category");

//importer express pour creer les routes
const express = require("express");
const router = express.Router();

//get all categories
router.get(`/`, async (req, res) => {
  try {
    //find all categories in the db
    const categoryList = await Category.find();

    //if there is no category in the db, return an error message
    if (!categoryList) {
      res.status(500).json({ success: false });
    }

    //if there are categories in the db, return them to the client
    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//get a category by id
router.get("/:id", async (req, res) => {
  try {
    //find the category with the given id in the db
    const category = await Category.findById(req.params.id);

    //if there is no category with the given id in the db, return an error message
    if (!category) {
      res
        .status(500)
        .json({ message: "The category with the given ID was not found." });
    }

    //if there is a category with the given id in the db, return it to the client
    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//create a new category
router.post("/", async (req, res) => {
  try {
    //create a new category with the data sent by the client in the request body
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    //save the new category in the db
    category = await category.save();

    //if the category cannot be created, return an error message
    if (!category) {
      return res.status(400).send("the category cannot be created!");
    }

    //if the category is created successfully, return it to the client
    res.send(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//update a category by id
router.put("/:id", async (req, res) => {
  try {
    //find the category with the given id in the db and update it with the data sent by the client in the request body
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      //return the updated category to the client
      { new: true },
    );

    //if there is no category with the given id in the db, return an error message
    if (!category) {
      return res.status(404).send("the category was not found!");
    }

    //if the category is updated successfully, return it to the client
    res.send(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//delete a category by id
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category not found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "the category is deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
