"use strict";
require("dotenv").config();

const express = require("express");
const db = require("./model/db");
const cat = require("./model/cat");
const cors = require("cors");
const passport = require("./utils/pass");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

let cats = require("./routes/catRoute");
let users = require("./routes/userRoute");
let authRoutes = require("./routes/authRoute.js");

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

/*app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/form" }),
  (req, res) => {
    console.log("success");
    res.redirect("/secret");
  }
);*/

app.get("/", async (req, res) => {
  console.log("someone visited my url");
  res.send(await cat.find());
});

// temp
app.post("/catCreate", async (req, res) => {
  const mycat = await cat.create({ name: "kitty", age: 12 });
  res.send("cat created with id: " + mycat._id);
});

app.get("/secret", loggedIn, (req, res) => {
  res.render("secret");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.use("/cat", passport.authenticate("jwt", { session: false }), cats);
app.use("/user", passport.authenticate("jwt", { session: false }), users);
app.use("/auth", authRoutes);

db.on("connected", () => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
