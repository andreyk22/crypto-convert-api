const cryptoService = require("./crypto.service");

const cryptoConvertCb = (req, res) => {
  if (!req.query.currency) {
    return res.json({error: 'Currency parameter is required.'});
  }
  if (!req.query.amount || isNaN(req.query.amount) !== 'number') {
    return res.json({error: 'Amount parameter is required and must be a number'});
  }
  cryptoService.cryptoConvertCb(req.query, function (err, response) {
    if (err) {
      return res.json({'error:': err}).status(400);
    }
    return res.json({'price': response}).status(200);
  });
};

const cryptoConvertPromise = (req, res) => {
  if (!req.query.currency) {
    return res.json({error: 'Currency parameter is required.'});
  }
  if (!req.query.amount || isNaN(req.query.amount) !== 'number') {
    return res.json({error: 'Amount parameter is required and must be a number'});
  }
  cryptoService.cryptoConvertPromise(req.query)
      .then(response => res.json({'price': response}).status(200))
      .catch(err => res.json({'error': err}).status(400));
};

const logCurrentValuePromise = () => {
  cryptoService.logCurrentValuePromise();
};

const logCurrentValueCb = () => {
  cryptoService.logCurrentValueCb();
};

const getLogs = (req, res) => {
  if (req.query.start && isNaN(req.query.start)) {
    return res.json({error: 'Query values must be numbers'});
  }
  if (req.query.limit && isNaN(req.query.limit)) {
    return res.json({error: 'Query values must be numbers'});
  }
  cryptoService.getLogs(req.query, (err, content) => {
    if (err) {
      return err;
    }
    return res.json(content);
  })
};

module.exports = {
  cryptoConvertCb,
  cryptoConvertPromise,
  logCurrentValuePromise,
  logCurrentValueCb,
  getLogs
};
