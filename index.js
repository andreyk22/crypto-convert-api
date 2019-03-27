const bodyParser = require("body-parser");
const express = require("express");

const cryptoController = require("./crypto/crypto.controller");

const app = express();
const port = process.env.PORT || 3000;

const start = async () => {

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/convert/:currency/:amount', cryptoController.cryptoConvert);
  app.post('/convert/promise/:currency/:amount', cryptoController.cryptoConvertPromise);

  app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
  });

  app.listen(port, () => console.log("Listening on port: " + port));
};

start();

