const cryptoService = require("./crypto.service");

const cryptoConvert = (req, res) => {
  cryptoService.cryptoConvert(req.query, function (err, response) {
    if (err) {
      return res.json({'error:': err}).status(400);
    }
    return res.json({'price': response}).status(200);
  });
};

const cryptoConvertPromise = (req, res) => {
  cryptoService.cryptoConvertPromise(req.query)
      .then(response => res.json({'price': response}).status(200))
      .catch(err => res.json({'error': err}).status(400));
};
const logCurrentValue = () => {
  cryptoService.logCurrentValue();
};
const logCurrentValueCb = () => {
  cryptoService.logCurrentValueCb();
};
const getLogs = (req, res) => {
  if (req.query.start && req.query.limit) {
    if (isNaN(req.query.limit) || isNaN(req.query.start)) {
      if (isNaN(req.query.limit) && isNaN(req.query.start)) {
        return res.json({error: 'Query values must be numbers'})
      }
      if (isNaN(req.query.limit)) {
        return res.json({error: 'Limit value must be a number'});
      }
      if (isNaN(req.query.start)) {
        return res.json({error: 'Start value must be a number'});
      }
    }
  }
  if (req.query.limit) {
    if (isNaN(req.query.limit)) {
      return res.json({error: 'Limit value must be a number'});
    }
  }
  if (req.query.start) {
    if (isNaN(req.query.start)) {
      return res.json({error: 'Start value must be a number'});
    }
  }
  cryptoService.getLogs(req.query, (err, content) => {
    if (err) {
      return err;
    }
    return res.json(content);
  })
}


module.exports = {
  cryptoConvert,
  cryptoConvertPromise,
  logCurrentValue,
  logCurrentValueCb,
  getLogs
};
