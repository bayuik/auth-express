const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", { useNewURLParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const { username, password } = req.body;
    User.findOne({ email: username }, (err, foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) res.render("secrets");
          else res.send("Incorrect password");
        });
      } else res.send("User not found");
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      const newUser = User({
        email: username,
        password: hash,
      });

      newUser.save((err) => {
        if (err) res.send(err);
        else res.render("secrets");
      });
    });
  });

app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
