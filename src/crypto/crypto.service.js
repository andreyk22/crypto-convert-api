const request = require('request');
const path = require('path');
const requestPromise = require('request-promise');
const fs = require('fs');
const redis = require('redis');

const client = redis.createClient();

client.on('connect', () => {
	console.log(`connected to redis`);
});

client.on('error', err => {
	console.log(`Error: ${err}`);

});

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
 * Function that actually append logs to file
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
};

/**
 * Function with promises that logs every 5s
 * current value of ETH in Euros along with current date and time.
 * It logs to logs.txt file.
 */
const logCurrentValuePromise = () =>
	setInterval(() => cryptoConvertPromise(query)
		.then((res) => appendToFile(null, res))
		.catch(appendToFile), 60 * 1000);

/**
 * Function with callbacks that logs every 2s
 * current value of ETH in Euros along with current date and time.
 * It logs to logs.txt file.
 */
const logCurrentValueCb = () =>
	setInterval(() => cryptoConvertCb(query, appendToFile), 120 * 1000);

/**
 * Checks if lastModified key exists in redis
 * if does not exist, returns false
 * if there is a key, and is equal to fileLastModified, returns true,
 * else it will be false.
 */
const getAndCheckValue = (filepath, fileLastModified) => {
	return new Promise((resolve, reject) => {

		client.exists('lastModified', (err, lastModified) => {
			if (err || !lastModified) {
				return reject(null, false);
			}

			client.get('lastModified', (err, redisLastModified) => {
				if (err) {
					return reject(null, false);
				}

				return resolve(redisLastModified === fileLastModified);
			})

		});

	});

};

/**
 * Helper function that check if redis is up to date with logs.txt
 */
const updated = (filepath, fileLastModified) => {

	return getAndCheckValue(filepath, fileLastModified)
		.then((res) => res)
		.catch((err) => err.message);
};

/**
 * Get data from redis
 */
const getRedisData = () => {
	return new Promise((resolve, reject) => {

		let array = {total: 0, logs: []}
			client.get('logs', (err, logs) => {
				if (err) {

					return reject(err);
				}

				const parsedLogs = JSON.parse(logs)
				array.logs = parsedLogs;
				array.total = array.logs.length

				return resolve(array)
			})
	})
};

/**
 * Helper function that converts buffer to JSON
 */
const bufferToJSON = (content) => {
	return Buffer.from(content)
		.toString()
		.split('\n')
		.filter((e) => e)
		.map((e) => JSON.parse(e))
};

/**
 * Converts content form logs.txt to json and updates redis.
 */
const updateRedis = (content, fileLastModified) => {
	const logs = {total: 0, logs: []}
	logs.logs = bufferToJSON(content)
	logs.total = logs.logs.length

	client.set('total', logs.logs.length);
	client.set('lastModified', fileLastModified);
	client.set('logs', JSON.stringify(logs.logs));
}

/**
 * Simple helper function thats used in getLogs
 * to return logs based on query params.
 */
const paginate = (req, array, page_size = 5, page_number = 1) => {
	const numberOfPages = Math.ceil(array.logs.length / page_size);
	const previous = page_number > 1 ? parseInt(page_number) - 1 : 1;
	const next = page_number < numberOfPages ? parseInt(page_number) + 1 : 1;

	array.logs = array.logs.slice((page_number - 1) * page_size, page_number * page_size);

	if (page_number > numberOfPages) {
		return array;
	}
	array.pagination = {
		'total_pages': numberOfPages,
		'current_page': parseInt(page_number),
		'previous': previous,
		'next': next
	};

	return array;
}


/**
 * Function that returns logs from to JSON
 * based on query params (limit, start)
 * It uses paginate function
 */
const getLogs = async (req, callback) => {
	const filePath = path.normalize(path.resolve(__dirname, 'logs.txt'));
	const fileLastModified = fs.statSync(filePath).mtime.toISOString();

	const isUpdated = await updated(filePath, fileLastModified);

	if (isUpdated) {
		return getRedisData()
			.then(res => {
				if (isNaN(req.query.limit) && isNaN(req.query.start)) {
					return callback(null, paginate(req, res));
				}

				return callback(null, paginate(req, res, req.query.limit, req.query.start))
			}).catch(err => err)
	}
	fs.readFile(filePath, (err, content) => {
		if (err) {
			return callback(err)
		}

		updateRedis(content, fileLastModified);

		return getRedisData()
			.then(res => {
				if (isNaN(req.query.limit) && isNaN(query.start)) {

					return callback(null, paginate(req, res));
				}

				return callback(null, paginate(req, res, req.query.limit, req.query.start))
			}).catch(err => err)
	})
};

module.exports = {
	cryptoConvertCb,
	cryptoConvertPromise,
	logCurrentValuePromise,
	logCurrentValueCb,
	getLogs
};
