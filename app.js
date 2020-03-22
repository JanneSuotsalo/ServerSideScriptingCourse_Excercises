"use strict";
const express = require("express");
const cors = require("cors");
const passport = require("./utils/pass");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/form");
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/form" }),
  (req, res) => {
    console.log("success");
    res.redirect("/secret");
  }
);

app.get("/secret", loggedIn, (req, res) => {
  res.render("secret");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

let cats = require("./routes/catRoute");
let users = require("./routes/userRoute");

app.use("/cat", cats);
app.use("/user", users);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
