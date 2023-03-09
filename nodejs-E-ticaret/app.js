const express = require("express");
const mongoose = require("mongoose");
const products = require("./routers/productRouter");
const users = require("./routers/userRouter");
const error = require("./middleware/error");
const logger = require("./middleware/logger");
const config=require("config");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const username=config.get("db.username");
const password = config.get("db.password");

const database = config.get("db.name");

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.i4rwnsk.mongodb.net/etc?retryWrites=true&w=majority`
    );
    logger.info("Connected to MongoDB...");
  } catch (error) {
    console.log(error.message);
  }
})();
app.use("/api", products);
app.use("/api/users", users);

console.log(config.get("name"));
console.log(process.env.DB_PASSWORD);

app.use(error);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
