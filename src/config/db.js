const mongoose = require("mongoose");

const { DBNAME } = process.env;
const url = "mongodb://localhost:27017/E-ToursimDB" ;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connecté à MongoDB");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB: ", err);
    process.exit(1);
  });

module.exports = mongoose;
