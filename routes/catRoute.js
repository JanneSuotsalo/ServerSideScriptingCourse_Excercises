"use strict";
// catRoute
var express = require("express");
var router = express.Router();
const catController = require("../controllers/catController");

router.get("/", catController.cat_list_get);

router.get("/:id", catController.cat_get);

router.post("/", (req, res) => {
  res.send("With this endpoint you can add cats.");
});

router.put("/", (req, res) => {
  res.send("With this endpoint you can edit cats.");
});

router.delete("/", (req, res) => {
  res.send("With this endpoint you can delete cats.");
});

module.exports = router;
