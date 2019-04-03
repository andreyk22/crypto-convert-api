const request = require('supertest');

require('../index');
const server = 'http://localhost:3000';

// SERVER/CONVERT/ ROUTE
describe('GET /convert - Callbacks - request lib', () => {
	test('Wrong currency. Test should fail GET /convert', async () => {
		const response = await request(server)
			.get('/convert')
			.query({currency: 'mockETH', amount: 1});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('There is no data for the symbol mockETH .');
	});
});

describe('GET /convert - Callbacks - request lib', () => {
	test('Amount is not number. Test should fail GET /convert', async () => {
		const response = await request(server)
			.get('/convert')
			.query({currency: 'ETH', amount: 'mock123'});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Amount value must be a number');
	});
});

describe('GET /convert - Callbacks - request lib', () => {
	test('Currency is required. Test should fail GET /convert', async () => {
		const response = await request(server)
			.get('/convert')
			.query({amount: 1});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Currency parameter is required.');
	});
});

describe('GET /convert - Callbacks - request lib', () => {
	test('Amount is required. Test should fail GET /convert', async () => {
		const response = await request(server)
			.get('/convert')
			.query({currency: 'ETH'});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Amount parameter is required.');
	});
});

describe('GET /convert - Callbacks - request lib', () => {
	test('Test should convert crypto GET /convert', async () => {
		const response = await request(server)
			.get('/convert')
			.query({currency: 'ETH', amount: 1});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('price');
	});
});

// SERVER/CONVERT/PROMISE ROUTE
describe('GET /convert/promise - Promises - request-promise lib', () => {
	test('Wrong currency. Test should fail GET /convert/promise', async () => {
		const response = await request(server)
			.get('/convert/promise')
			.query({currency: 'mockETH', amount: 1});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('There is no data for the symbol mockETH .');
	});
});

describe('GET /convert/promise - Promises - request-promise lib', () => {
	test('Amount is not number. Test should fail GET /convert/promise', async () => {
		const response = await request(server)
			.get('/convert/promise')
			.query({currency: 'ETH', amount: 'mock123'});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Amount value must be a number');
	});
});

describe('GET /convert/promise - Promises - request-promise lib', () => {
	test('Currency is required. Test should fail GET /convert/promise', async () => {
		const response = await request(server)
			.get('/convert/promise')
			.query({amount: 1});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Currency parameter is required.');
	});
});

describe('GET /convert/promise - Promises - request-promise lib', () => {
	test('Amount is required. Test should fail GET /convert/promise', async () => {
		const response = await request(server)
			.get('/convert/promise')
			.query({currency: 'ETH'});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Amount parameter is required.');
	});
});

describe('GET /convert/promise - Promises - request-promise lib', () => {
	test('Test should convert crypto GET /convert/promise', async () => {
		const response = await request(server)
			.get('/convert/promise')
			.query({currency: 'ETH', amount: 1});
		expect(response.status).toEqual(200);
		expect(response.text).toContain('price');
	});
});
