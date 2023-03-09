require('express-async-errors');

const express = require("express");
const Joi = require("joi");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const login=require("../middleware/login");
const {
  Product,
  Comment,
  validateProduct,
} = require("../models/product.model");
router.get("/products/search/:price", async (req, res) => {
  const price = parseFloat(req.params.price);
  try {
    const products = await Product.find({ price: price });
    if (products.length === 0)
      return res.status(404).send("No products found with the given price.");
    res.send(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while fetching products.");
  }
});

//ürün kayıt edeyrük
router.post("/products",[login,isAdmin], async (req, res) => {
  const { error } =  validateProduct(req.body);
  if(error) {
    return res.status(400).send(error.details[0].message);
}
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    image: req.body.image,
    dataCreated: req.body.dataCreated,
    meta: req.body.meta,
    guarantee: req.body.guarantee,
    comments: req.body.comments,
  });

  try {
    const result = await product.save();
    res.send(result);
    console.log(result);
  } catch (error) {
    console.log(error.message + "hata cıktı");
  }
});
// tüm ürünleri getirir
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error.message);
  }
});
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    res.send(product);
  } catch (error) {
    console.log(error.message);
  }
});
router.delete("/products/:id",[login,isAdmin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    res.send(product);
  } catch (error) {
    console.log(error.message);
  }
});
router.delete("/products/comment/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(!product) {
      return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  const comment = product.comments.id(req.body.commentid);
  comment.remove();

  const updatedProduct = await product.save();
  res.send(updatedProduct);
});




router.put("/products/comment/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  try {
    const comment = new Comment({
      text: req.body.text,
      username: req.body.username,
    });
    product.comments.push(comment);

    const updatedProduct = await product.save();
    res.send(updatedProduct);
  } catch (error) {
    console.log(error.message);
  }
});
router.put("/products/:id",[login,isAdmin], async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }

  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.image = req.body.image;
  product.category = req.body.category;

  const updatedProduct = await product.save();

  res.send(updatedProduct);
});

module.exports = router;
