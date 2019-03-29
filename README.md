# crypto-convert-api
Simple node js api for converting cryptocurrencies to EUR.

## Usage

- Callbacks and request lib are used for first one.

 ```http://localhost:3000/convert?currency=ETH&amount=1```

- Promises and request-promise lib are used for second one.

 ```http://localhost:3000/convert/promise?currency=ETH&amount=1```
 
- ETH value logs feature. 
    
    Logging function written using callbacks logs every 25s, and function written using promises logs every 60s
    
   * Get all logs:

    ```http://localhost:3000/logs```
    
   * Get limited number of logs
    
    ```http://localhost:3000/logs?limit=2```
    
   * Get limited numbers of logs by starting page
    
    ```http://localhost:3000/logs?limit=5&start=1```

## Installing

Clone:

``` git clone https://github.com/andreyk22/crypto-convert-api.git```

Install:

```npm install```

Run:

```npm start```

## Dependencies

- [nodemon](https://www.npmjs.com/package/nodemon)

- [express](https://www.npmjs.com/package/express)

- [body-parser](https://www.npmjs.com/package/body-parser)

- [request](https://www.npmjs.com/package/request)

- [request-promise](https://www.npmjs.com/package/request-promise)

- [jest](https://www.npmjs.com/package/jest)

- [supertest](https://www.npmjs.com/package/supertest)
