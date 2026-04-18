//creer un miniserveur
const express = require("express");
const router = express.Router();

//importer le model categorie
const { User } = require("../models/user");

//importer bcrypt pour hasher les mots de passe
const bcrypt = require("bcryptjs");

//importer jwt pour generer des tokens d'authentification
const jwt = require("jsonwebtoken");

//methode GET
router.get(`/`, async (req, res) => {
  try {
    //find all users in the db and return them to the admin, but exclude the passwordHash field
    const userList = await User.find().select("-passwordHash");

    //no users in the db
    if (!userList) {
      return res.status(500).json({ success: false });
    }

    //send the list of users to the admin
    res.status(200).send(userList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//get a user by id
router.get("/:id", async (req, res) => {
  try {
    //find the user with the id and exclude the passwordHash field
    const user = await User.findById(req.params.id).select("-passwordHash");

    //no user with the given id in the db
    if (!user) {
      return res
        .status(404)
        .json({ message: "The user with the given ID was not found." });
    }

    //return the user to the admin
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//create a new user
router.post("/", async (req, res) => {
  try {
    // Basic validation
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    //create a new user with the data sent by the client in the request body, but hash the password before saving it in the db
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      // Had 10 katgoul l'Serveur: "Khoud dak l'mot de passe, w bqa katrewwen w tchffer fih $2^{10}$ mra (ya3ni 1024 mra).
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin !== undefined ? req.body.isAdmin : false,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    //save the new user in the db
    user = await user.save();

    //if the user cannot be created, return an error message
    if (!user) return res.status(400).send("the user cannot be created!");

    //user created successfully, exclude passwordHash
    res.send(user);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists." });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

//update a user by id
router.put("/:id", async (req, res) => {
  try {
    //find the user with the given id in the db
    const userExist = await User.findById(req.params.id);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "The user with the given ID was not found.",
      });
    }

    //prepare the password: use the existing hash when the client does not send a new password
    let newPassword = userExist.passwordHash;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    }

    //update the user with the new data sent by the client in the request body, but hash the password before saving it in the db
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name ?? userExist.name,
        email: req.body.email ?? userExist.email,
        passwordHash: newPassword,
        phone: req.body.phone ?? userExist.phone,
        isAdmin: req.body.isAdmin ?? userExist.isAdmin,
        street: req.body.street ?? userExist.street,
        apartment: req.body.apartment ?? userExist.apartment,
        zip: req.body.zip ?? userExist.zip,
        city: req.body.city ?? userExist.city,
        country: req.body.country ?? userExist.country,
      },
      { new: true },
    );

    //user cannot be updated
    if (!user) return res.status(400).send("the user cannot be updated!");

    //return the updated user to the client
    res.send(user);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//login a user
router.post("/login", async (req, res) => {
  try {
    //find the user with the given email in the db
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("The user not found");
    }

    const secret = process.env.secret;
    if (!secret) {
      return res.status(500).send("Authentication secret is not configured.");
    }

    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "1d" },
      );

      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("password or email is wrong!");
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//register a new user
router.post("/register", async (req, res) => {
  try {
    // Basic validation
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: false,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    //save the new user in the db
    user = await user.save();

    //user created successfully
    res.status(201).json({ success: true, message: "the user is created!" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists." });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

//get the number of users in the db
router.get(`/get/count`, async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    //send the users count to the admin
    res.send({
      userCount: userCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    //find the user with the given id in the db and delete it
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }

    res.status(200).json({ success: true, message: "the user is deleted!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
