const request = require('request');
const path = require('path');
const requestPromise = require('request-promise');
const fs = require('fs');

const query = {
	currency: 'ETH',
	amount: 1
};

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
const logCurrentValuePromise = () =>
	setInterval(() => cryptoConvertPromise(query)
			.then((res) => appendToFile(null, res))
			.catch(appendToFile), 5 * 1000);

/**
 * Function with callbacks that logs every 2s
 * current value of ETH in Euros along with current date and time.
 * It logs to logs.txt file.
 */
const logCurrentValueCb = () => setInterval(() => cryptoConvertCb(query, appendToFile), 2 * 1000);

/**
 * Function that returns logs to JSON
 * based on query params (limit, start)
 * It uses paginate function
 */
const getLogs = (query, callback) => {
	const filePath = path.normalize(path.resolve(__dirname, 'logs.txt'));

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

		return callback(null, paginate(logs.logs, query.limit, query.start))
	})
};

/**
 * Function that actually appendToFile
 * and its called in logCurrentValuePromise and logCurrentValueCb
 * It logs to logs.txt file.
 */
const appendToFile = (err, res) => {
	const filePath = path.normalize(path.resolve(__dirname, 'logs.txt'));

	if (err) {
		console.warn(err.message);
		return;
	}

	const logData = {
		price: res,
		date: new Date().toISOString()
	};

	fs.appendFile(filePath, JSON.stringify(logData) + '\n', (err, data) => {
		if (err) {
			console.warn(err.message);
			return;
		}
		console.info('logging')
	});
}

/**
 * Simple helper function thats used in getLogs
 * to return logs based on query params.
 */
const paginate = (array, page_size = 5, page_number = 0) =>
	array.slice((page_number - 1) * page_size, page_number * page_size);

module.exports = {
	cryptoConvertCb,
	cryptoConvertPromise,
	logCurrentValuePromise,
	logCurrentValueCb,
	getLogs
};
