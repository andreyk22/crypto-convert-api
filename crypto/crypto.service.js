"use strict";
const request = require('request');
const requestPromise = require('request-promise');

const fs = require('fs');

// WITH CALLBACKS
const cryptoConvert = (query, cb) => {

  if (!query.currency) {
    return cb('Currency parameter is required.');
  }
  if (!query.amount) {
    return cb('Amount parameter is required.')
  }

  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + query.currency + '&tsyms=EUR';

  if (isNaN(query.amount)) {
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
};

// WITH PROMISES
const cryptoConvertPromise = (query) => {

  if (!query.currency) {
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
        if (isNaN(query.amount)) {
          return Promise.reject('Amount value must be a number');
        }
        return Promise.resolve(data.EUR * query.amount);
      })
}
// WITH PROMISES
const logCurrentValue = () => {

  const interval = 3 * 1000;

  setInterval(() => {
    const query = {
      currency: 'ETH',
      amount: 1
    };
    cryptoConvertPromise(query)
        .then((res) => {
          const dateTime = new Date().toISOString();
          const logData = {
            price: res,
            date: dateTime
          };
          fs.readFile('logs.json', (err, data) => {
            if (err) {
              throw err;
            } else {
              const currentJson = () => {
                const cJson = JSON.parse(JSON.stringify(Buffer.from(data).toString()));
                return cJson;
              }
              if (!currentJson().hasOwnProperty(0)) {
                console.log('Empty file, pushing json template into it.')
                const template = {
                  total: 0,
                  logs: []
                }
                const tmp = JSON.stringify(template, null, 2)
                fs.writeFile('logs.json', tmp, (err, res) => {
                  if (err) {
                    throw err;
                  }
                  console.log('Saved template')
                });
              }
              fs.readFile('logs.json', (err, data) => {
                const json = JSON.parse(data);
                json['logs'].push(logData);
                json['total']++;
                const logs = JSON.stringify(json, null, 2);
                fs.writeFile('logs.json', logs, (err, res) => {
                  if (err) {
                    throw err;
                  }
                  console.log('Saved with ETH Value with promise. Every 3s')
                });
              })
            }
          })
        });
  }, interval);
}

// WITH CALLBACKS
const logCurrentValueCb = () => {

  const interval = 10 * 1000;

  setInterval(() => {
    const query = {
      currency: 'ETH',
      amount: 1
    };
    cryptoConvert(query, (err, res) => {
      if (err) {
        throw err;
      }
      // console.log(res)
      const dateTime = new Date().toISOString();
      const logData = {
        priceCB: res,
        dateCB: dateTime
      };
      fs.readFile('logs.json', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const currentJson = () => {
            const cJson = JSON.parse(JSON.stringify(Buffer.from(data).toString()));
            return cJson;
          }
          if (!currentJson().hasOwnProperty(0)) {
            console.log('Empty file, pushing json template into it.')
            const template = {
              total: 0,
              logs: []
            }
            const tmp = JSON.stringify(template, null, 2)
            fs.writeFile('logs.json', tmp, (err, res) => {
              if (err) {
                throw err;
              }
              console.log('Saved template')
            });
          }
          fs.readFile('logs.json', (err, data) => {
            const json = JSON.parse(data);
            json['logs'].push(logData);
            json['total']++;
            const logs = JSON.stringify(json, null, 2);
            fs.writeFile('logs.json', logs, (err, res) => {
              if (err) {
                throw err;
              }
              console.log('Saved with ETH Value with callback. Every 10s')
            });
          })
        }
      })

    })
  }, interval);
};

const getLogs = (query, callback) => {
  fs.readFile('logs.json', function (err, content) {
    if (err) {
      return callback(err)
    }
    const json = JSON.parse(content);

    if (query.start && query.limit) {
      callback(null, paginate(json['logs'], query.limit, query.start))
    } else if (query.limit) {
      callback(null, paginate(json['logs'].slice(0, query.limit)))
    } else if (query.start) {
      callback(null, paginate(json['logs'], 5, query.start))
    } else {
      callback(null, json)
    }
  })
}

const paginate = (array, page_size, page_number) => {
  --page_number;
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

module.exports = {
  cryptoConvert,
  cryptoConvertPromise,
  logCurrentValue,
  logCurrentValueCb,
  getLogs
};
