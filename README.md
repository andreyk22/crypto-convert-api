# crypto-convert-api
Simple node js api for converting cryptocurrencies to EUR.

## Usage
There are 2 API endpoints:
Callbacks and request lib are used for first one.

```http://localhost:3000/convert?currency=ETH&amount=1```

Promises and request-promise lib are used for second one.

```http://localhost:3000/convert/promise?currency=ETH&amount=1```

## Installing

```npm install```

## Dependencies

*[https://www.npmjs.com/package/nodemon](nodemon)

*[https://www.npmjs.com/package/express](express)

*[https://www.npmjs.com/package/body-parser](body-parser)

*[https://www.npmjs.com/package/request](request)

*[https://www.npmjs.com/package/request-promise](request-promise)

*[https://www.npmjs.com/package/jest](jest)

*[https://www.npmjs.com/package/supertest](supertest)
