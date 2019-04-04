const cryptoService = require("./crypto.service");

const cryptoConvertCb = (req, res) => {
	if (!req.query.currency) {
		return res.json({error: 'Currency parameter is required.'}).status(400);
	}

	if (!req.query.amount || isNaN(req.query.amount)) {
		return res.json({error: 'Amount parameter is required and must be a number'}).status(400);
	}

	cryptoService.cryptoConvertCb(req.query, (err, response) => {
		if (err) {
			return res.json({'error:': err}).status(400);
		}
		return res.json({'price': response}).status(200);
	});
};

const cryptoConvertPromise = (req, res) => {
	if (!req.query.currency) {
		return res.json({error: 'Currency parameter is required.'}).status(400);
	}

	if (!req.query.amount || isNaN(req.query.amount) !== 'number') {
		return res.json({error: 'Amount parameter is required and must be a number'}).status(400);
	}

	cryptoService.cryptoConvertPromise(req.query)
		.then(response => res.json({'price': response}).status(200))
		.catch(err => res.json({'error': err}).status(400));
};

const getLogs = (req, res) => {
	cryptoService.getLogs(req.query, (err, content) => {
		if (err) {
			return res.json({error: err.message}).status(400);
		}

		return res.json(content).status(200);
	})
};

module.exports = {
	cryptoConvertCb,
	cryptoConvertPromise,
	getLogs
};
