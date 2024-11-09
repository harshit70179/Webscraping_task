const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static("public"));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/v1", require("./router/task"));

let port = process.env.port || 8085;

 app.listen(port, () => {
  console.log(`Server up and running on port ${port} !`);
});


