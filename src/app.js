const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const db = require("./config/db");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Lire toutes les routes depuis le dossier 'routes'
const fs = require("fs");
const routesDir = path.join(__dirname, "routes");
fs.readdirSync(routesDir).forEach((file) => {
  const routePath = path.join(routesDir, file);
  const route = require(routePath);
  app.use("/api", route);
});

module.exports = app;
