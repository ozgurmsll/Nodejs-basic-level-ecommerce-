const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const commentSchema = new mongoose.Schema({
  username: String,
  email: String,
  comment: String,
  text: String,

  dataCreated: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  dataCreated: {
    type: Date,
    default: Date.now,
  },
  meta: {
    votes: Number,
    favs: Number,
  },
  guarantee: {
    type: Number,
  },
  comments: [commentSchema],
});
function validateProduct(product) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().required(),
    description: Joi.string(),
    imageUrl: Joi.string(),
    isActive: Joi.boolean(),
    category: Joi.string(),
    comments: Joi.array(),
  });

  return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Product, Comment, validateProduct };
