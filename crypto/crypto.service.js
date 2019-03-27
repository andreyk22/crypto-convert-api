"use strict";
const request = require('request');
const requestPromise = require('request-promise');

function cryptoConvert(params, cb) {
  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + params.currency + '&tsyms=EUR';

  return request(ccApi, (error, response, body) => {
    const apiRes = JSON.parse(body);
    if (apiRes.Response === 'Error') {
      return cb(apiRes.Message);
    } else {
      return cb(null, apiRes.EUR * params.amount);
    }
  });
}

function cryptoConvertPromise(params) {
  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + params.currency + '&tsyms=EUR';
  const options = {
    uri: ccApi,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return requestPromise(options)
      .then((data) => {
        if (data.Response === 'Error') {
          return Promise.reject(data.Message);
        }

        return Promise.resolve(data.EUR * params.amount);
      })
}

module.exports = {
  cryptoConvert,
  cryptoConvertPromise
};
