"use strict";
const request = require('request');
const requestPromise = require('request-promise');

function cryptoConvert(query, cb) {
  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + query.currency + '&tsyms=EUR';

  return request(ccApi, (error, response, body) => {
    const apiRes = JSON.parse(body);
    if (apiRes.Response === 'Error') {
      return cb(apiRes.Message);
    } else {
      return cb(null, apiRes.EUR * query.amount);
    }
  });
}

function cryptoConvertPromise(query) {
  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + query.currency + '&tsyms=EUR';
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

        return Promise.resolve(data.EUR * query.amount);
      })
}

module.exports = {
  cryptoConvert,
  cryptoConvertPromise
};
