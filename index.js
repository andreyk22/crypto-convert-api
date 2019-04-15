require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");


const cryptoController = require("./src/crypto/crypto.controller");
const cryptoService = require("./src/crypto/crypto.service");

const app = express();
const port = process.env.PORT || 3000;

const start = () => {

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.get('/convert', cryptoController.cryptoConvertCb);
  app.get('/convert/promise', cryptoController.cryptoConvertPromise);
  app.get('/logs', cryptoController.getLogs);

  app.use((req, res) => {
    res.status(404).send({url: req.originalUrl + " not found"});
  });


cryptoService.logCurrentValueCb();
cryptoService.logCurrentValuePromise();

  return app.listen(port, () => console.log("Listening on port: " + port));
};

start();
