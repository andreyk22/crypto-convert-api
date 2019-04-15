const axios = require('axios');

/**
 * Get request to passed url
 */
const get = (url) => {
	return axios.get(url)
		.then((response) => {
			if (response.data.Response === 'Error') {
				return Promise.reject(response.data.Message);
			}

			return Promise.resolve(response.data);
		})
		.catch((error) => {

			return Promise.reject(error);
		})
};

module.exports = {
	get
};
