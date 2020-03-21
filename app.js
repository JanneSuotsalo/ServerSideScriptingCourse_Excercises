"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let cats = require("./routes/catRoute");
let users = require("./routes/userRoute");

app.use("/cat", cats);
app.use("/user", users);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
