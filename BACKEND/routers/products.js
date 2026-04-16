//creer un mini server
const express = require("express");
const router = express.Router();

//importer mongoose
const mongoose = require("mongoose");

//importer le model product.js , {Product} is an object
const { Product } = require("../models/product.js");
const { Category } = require("../models/category.js");

//importer multer pour uploader les images
const multer = require("multer");

//creer une map pour les types de fichiers autorises
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//configurer multer pour stocker les images dans le dossier public/uploads

//plan dyal l'Khizana (Storage) li ghatkoun f l'Disque Dur dyal l'PC (diskStorage), machi f l'mémoire vive.
const storage = multer.diskStorage({
  //req, file, cb (callback) : 3 arguments li kaykhdmo f multer
  destination: function (req, file, cb) {
    //check if the file type is valid
    const isValid = FILE_TYPE_MAP[file.mimetype];
    //si le type de fichier n'est pas valide, return an error message
    let uploadError = new Error("invalid image type");

    //uploadError = null if the file type is valid
    if (isValid) {
      uploadError = null;
    }

    //cb : callback function li kataccepta 2 arguments, l'error (uploadError) w le chemin (path) li ghatkoun fih l'image
    cb(uploadError, "public/uploads");
  },

  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

//Hadi hiya li ghatb9ay tkhdmi biha f l'Routers dyalk b7al uploadOptions.single('image').
const uploadOptions = multer({ storage: storage });

//get all products
router.get(`/`, async (req, res) => {
  try {
    //filter par defaut khaliha est vide
    let filter = {};

    //if the client sends a query parameter "categories" with a list of category ids, filter the products by those categories
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }

    //find all products in the db and populate the category field with the category name
    const productList = await Product.find(filter).populate("category");

    //no products in the db, return an error message
    if (!productList) {
      res.status(500).json({ success: false });
    }

    //return the products to the client
    res.send(productList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//get a product by id
router.get(`/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    //no product with the given id in the db
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
    }

    //return the product to the client
    res.send(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//create a new product
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  try {
    //check if the category id sent by the client in the request body is valid
    const category = await Category.findById(req.body.category);

    //no category with the given id in the db
    if (!category) return res.status(400).send("Invalid Category");

    //if the category id is valid, create a new product with the data sent by the client in the request body and the image path
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    //create a new product with the data sent by the client in the request body and the image path
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    //save the new product in the db
    product = await product.save();

    //if the product cannot be created
    if (!product) return res.status(500).send("The product cannot be created");

    //return the product to the client
    res.send(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//update a product by id
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  try {
    //check if the category id sent by the client in the request body is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }

    //check if the category id sent by the client in the request body is valid
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    //check if the product with the given id exists in the db
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) return res.status(400).send("Invalid Product!");

    //if the client sends an image in the request, update the image path, otherwise keep the old image path
    const file = req.file;
    let imagepath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = oldProduct.image;
    }

    //if the category id is valid, update the product with the data sent by the client in the request body and the image path
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true },
    );

    //if there is no product with the given id in the db, return an error message
    if (!product) return res.status(500).send("the product cannot be updated!");

    //return the updated product to the client
    res.send(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//delete a product by id
router.delete("/:id", async (req, res) => {
  try {
    //check if the product with the given id exists in the db
    const product = await Product.findByIdAndRemove(req.params.id);

    //product not found in the db
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found!" });
    }

    //product deleted successfully
    return res
      .status(200)
      .json({ success: true, message: "the product is deleted!" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

//comptes le nombre de produits dans la db
router.get(`/get/count`, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    //error while counting the products in the db
    if (!productCount) {
      res.status(500).json({ success: false });
    }

    //return the product count to the admin
    res.send({
      productCount: productCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//get featured products
router.get(`/get/featured/:count`, async (req, res) => {
  try {
    //if the client sends a query parameter "count", return that number of featured products, otherwise return all featured products
    const count = req.params.count ? req.params.count : 0;
    //find the featured products in the db and return them to the client
    const products = await Product.find({ isFeatured: true }).limit(+count);

    //no featured products in the db
    if (!products) {
      res.status(500).json({ success: false });
    }

    //return the featured products to the client
    res.send(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//update gallery images for a product
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    try {
      //check if the product with the given id exists in the db
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid Product Id");
      }

      //if the client sends multiple images in the request
      const files = req.files;
      let imagesPaths = [];
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

      //if there are images in the request, map the images paths and save them in the db
      if (files) {
        files.map((file) => {
          imagesPaths.push(`${basePath}${file.filename}`);
        });
      }

      //update the product with the new images paths
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagesPaths,
        },
        { new: true },
      );

      //no product with the given id in the db
      if (!product)
        return res.status(500).send("the gallery cannot be updated!");

      //return the updated product to the client
      res.send(product);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
);

module.exports = router;
