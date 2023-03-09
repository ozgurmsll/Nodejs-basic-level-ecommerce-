const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { User, validateUser, validateLogin } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    // kullanıcı kontrol varmı diye
    return res.status(400).send("User already exists");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();
  const token =user.createLoginToken();
  res.header("x-auth-token", token).send(user);

});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const isSuccess = await bcrypt.compare(req.body.password, user.password);
  if (!isSuccess) {
    return res.status(400).send("Wrong password");
  }
  const token =user.createLoginToken();

  res.send(token);
});

router.get("/user", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
