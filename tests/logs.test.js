const request = require('supertest');

require('../index');
const server = 'http://localhost:3000';

describe('GET /logs', () => {
	test('Wrong limit. Test should fail GET /logs', async () => {
		const response = await request(server)
			.get('/logs')
			.query({limit: 'mock'})
		expect(response.status).toEqual(200);
		expect(response.text).toContain(JSON.stringify({error: 'Limit value must be a number'}));
	});
});
describe('GET /logs', () => {
	test('Wrong start. Test should fail GET /logs', async () => {
		const response = await request(server)
			.get('/logs')
			.query({start: 'mock'})
		expect(response.status).toEqual(200);
		expect(response.text).toContain(JSON.stringify({error: 'Start value must be a number'}));
	});
});
describe('GET /logs', () => {
	test('Wrong start with limit. Test should fail GET /logs', async () => {
		const response = await request(server)
			.get('/logs?start=mock&limit=1')
			.query({start: 'mock'}, {limit: 1})
		expect(response.status).toEqual(200);
		expect(response.text).toContain(JSON.stringify({error: 'Query values must be numbers'}));
	});
});
describe('GET /logs', () => {
	test('Test should GET /logs', async () => {
		const response = await request(server)
			.get('/logs')
		expect(response.status).toEqual(200);
		expect(response.text).toMatch('total', 'logs');
	});
});
