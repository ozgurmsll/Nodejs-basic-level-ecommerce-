const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,

      minlength: 6,
    },
    isAdmin: Boolean,
  },
  { timestamps: true }
);

function validateUser(user) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}
function validateLogin(user) {
  const schema = new Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}
userSchema.methods.createLoginToken=function() {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email ,isAdmin:this.isAdmin},
    "jwtPrivateKey"
  );

}
const User = mongoose.model("User", userSchema);


module.exports = { User, validateUser,validateLogin };
