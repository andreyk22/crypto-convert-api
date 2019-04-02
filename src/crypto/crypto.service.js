const request = require('request');
const path = require('path');
const requestPromise = require('request-promise');

const fs = require('fs');

/**
 * Function with callbacks which gets
 * current value of passed cryptocurrency in Euros.
 * It uses cryptocompare api.
 */
const cryptoConvertCb = (query, cb) => {

	const url = `https://min-api.cryptocompare.com/data/price?fsym=${query.currency}&tsyms=EUR`;

	return request(url, (error, response, body) => {
		const apiRes = JSON.parse(body);

		if (apiRes.Response === 'Error') {
			return cb(apiRes.Message);
		} else {
			return cb(null, apiRes.EUR * query.amount);
		}
	});
};

/**
 * Function with promises which gets
 * current value of passed cryptocurrency in Euros.
 * It uses cryptocompare api.
 */
const cryptoConvertPromise = (query) => {

	const url = `https://min-api.cryptocompare.com/data/price?fsym=${query.currency}&tsyms=EUR`;

	const options = {
		uri: url,
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

/**
 * Function with promises that logs every 5s
 * current value of ETH in Euros along with current date and time.
 * It logs to logs.txt file.
 */
const logCurrentValuePromise = () => {

	const interval = 5 * 1000;
	const filePath = path.normalize(__dirname + '/' + 'logs.txt');

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

				fs.appendFile(filePath, JSON.stringify(logData) + '\n', (err, data) => {
					if (err) {
						throw err;
					}
					console.log('logging with promises')
				});
			});
	}, interval);
};

/**
 * Function with callbacks that logs every 2s
 * current value of ETH in Euros along with current date and time.
 * It logs to logs.txt file.
 */
const logCurrentValueCb = () => {

	const interval = 2 * 1000;
	const filePath = path.normalize(__dirname + '/' + 'logs.txt');

	setInterval(() => {
		const query = {
			currency: 'ETH',
			amount: 1
		};

		cryptoConvertCb(query, (err, res) => {
			if (err) {
				throw err;
			}

			const logData = {
				priceCB: res,
				dateCB: new Date().toISOString()
			};

			fs.appendFile(filePath, JSON.stringify(logData) + '\n', (err, data) => {
				if (err) {
					throw err;
				}
				console.log('logging with cb')
			});
		})
	}, interval);
};

/**
 * Function that returns logs to JSON
 * based on query params (limit, start)
 * It uses paginate function
 */
const getLogs = (query, callback) => {
	const filePath = path.normalize(__dirname + '/' + 'logs.txt');

	fs.readFile(filePath, (err, content) => {
		if (err) {
			return callback(err)
		}

		const logs = {total: 0, logs: []}
		logs.logs = Buffer.from(content)
			.toString()
			.split('\n')
			.filter(e => e)
			.map((e) => JSON.parse(e));
		logs.total = logs.logs.length

		if (isNaN(query.limit) && isNaN(query.start)) {
			return callback(null, logs);
		}

		return callback(null,
			paginate(
				logs.logs,
				isNaN(query.limit) ? 3 : query.limit,
				isNaN(query.start) ? 1 : query.start))
	})
};

/**
 * Simple helper function thats used in getLogs
 * to return logs based on query params.
 */
const paginate = (array, page_size, page_number) => {
	--page_number;
	return array.slice(page_number * page_size, (page_number + 1) * page_size);
};

module.exports = {
	cryptoConvertCb,
	cryptoConvertPromise,
	logCurrentValuePromise,
	logCurrentValueCb,
	getLogs
};
