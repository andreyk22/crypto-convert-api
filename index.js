const bodyParser = require("body-parser");
const express = require("express");

const cryptoController = require("./crypto/crypto.controller");

const app = express();
const port = process.env.PORT || 3000;

const start = async () => {

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/convert', cryptoController.cryptoConvert);
  app.get('/convert/promise', cryptoController.cryptoConvertPromise);
  app.get('/logs', cryptoController.getLogs);

  app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + " not found" });
  });

  cryptoController.logCurrentValue();
  cryptoController.logCurrentValueCb();

  return app.listen(port, () => console.log("Listening on port: " + port));
};

start();

