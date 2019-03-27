const cryptoService = require("./crypto.service");

const cryptoConvert = (req, res) => {
  cryptoService.cryptoConvert(req.query, function (err, response) {
    if (err) {
      return res.json({'error:' : err}).status(400);
    }
    return res.json({'price' : response}).status(200);
  });
};

const cryptoConvertPromise = (req, res) => {
  cryptoService.cryptoConvertPromise(req.query)
      .then(response => res.json({'price' : response}).status(200))
      .catch(err => res.json({'error' : err}).status(400));
};

module.exports = {
  cryptoConvert,
  cryptoConvertPromise
};
