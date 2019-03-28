"use strict";
const request = require('request');
const requestPromise = require('request-promise');

function cryptoConvert(query, cb) {

  if(!query.currency) {
    return cb('Currency parameter is required.')
  }
  if (!query.amount) {
    return cb('Amount parameter is required.')
  }

  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + query.currency + '&tsyms=EUR';

  if (isNaN(query.amount)){
    return cb('Amount value must be a number.');
  }
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

  if(!query.currency) {
    return Promise.reject('Currency parameter is required.')
  }
  if (!query.amount) {
    return Promise.reject('Amount parameter is required.')
  }

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
        if (isNaN(query.amount)){
          return Promise.reject('Amount value must be a number');
        }
        return Promise.resolve(data.EUR * query.amount);
      })
}

module.exports = {
  cryptoConvert,
  cryptoConvertPromise
};
