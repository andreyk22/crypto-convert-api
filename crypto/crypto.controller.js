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
  cryptoService.getLogs((err, content) => {
    if (req.query.start && req.query.limit) {
      if (isNaN(req.query.limit) || isNaN(req.query.start)) {
        return res.json({error : 'Query values must be numbers'});
      }
      return res.json(cryptoService.paginate(content['logs'], req.query.limit, req.query.start))
    }
    if (req.query.limit) {
      if (isNaN(req.query.limit)) {
        return res.json({error : 'Limit value must be a number'});
      }
      return res.json(content['logs'].slice(0, req.query.limit));
    }
    if (req.query.start) {
      if (isNaN(req.query.start)) {
        return res.json({error: 'Start value must be a number'});
      }
      return res.json(cryptoService.paginate(content['logs'], 5, req.query.start))
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
