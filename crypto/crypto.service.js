"use strict";
const request = require('request');
const requestPromise = require('request-promise');

const fs = require('fs');

// WITH CALLBACKS
const cryptoConvert = (query, cb) => {

  const ccApi = 'https://min-api.cryptocompare.com/data/price?fsym=' + query.currency + '&tsyms=EUR';

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
};

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
              console.log(err);
            } else {
              const cJson = Buffer.from(data).toString();
              const parsed = (cJson && JSON.parse(cJson)) || {};
              let logs = '';
              if (!parsed || !parsed.logs) {
                console.log('Empty file, pushing json template into it.')
                logs = JSON.stringify({
                  total: 1,
                  logs: [logData]
                });
              } else {
                parsed['logs'].push(logData);
                parsed['total']++;
                logs = JSON.stringify(parsed, null, 2);
              }
              fs.writeFile('logs.json', logs, (err, res) => {
                if (err) {
                  throw err;
                }
                console.log('Logging with promises.')
              });
            }
          })
        });
  }, interval);
};

// WITH CALLBACKS
const logCurrentValueCb = () => {

  const interval = 2 * 1000;

  setInterval(() => {
    const query = {
      currency: 'ETH',
      amount: 1
    };
    cryptoConvert(query, (err, res) => {
      if (err) {
        throw err;
      }
      const dateTime = new Date().toISOString();
      const logData = {
        priceCB: res,
        dateCB: dateTime
      };
      fs.readFile('logs.json', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const cJson = Buffer.from(data).toString();
          const parsed = (cJson && JSON.parse(cJson)) || {};
          let logs = '';
          if (!parsed || !parsed.logs) {
            console.log('Empty file, pushing json template into it.')
            logs = JSON.stringify({
              total: 1,
              logs: [logData]
            });
          } else {
            parsed['logs'].push(logData);
            parsed['total']++;
            logs = JSON.stringify(parsed, null, 2);
          }
          fs.writeFile('logs.json', logs, (err, res) => {
            if (err) {
              throw err;
            }
            console.log('Logging with callbacks')
          });
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
      callback(null, paginate(json['logs'], query.limit, 1))
    } else if (query.start) {
      callback(null, paginate(json['logs'], 5, query.start))
    } else {
      callback(null, json)
    }
  })
};

const paginate = (array, page_size, page_number) => {
  --page_number;
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
};

module.exports = {
  cryptoConvert,
  cryptoConvertPromise,
  logCurrentValue,
  logCurrentValueCb,
  getLogs
};
