# crypto-convert-api
Simple node js api for converting cryptocurrencies to EUR.

## Installing

To run project you will need Redis installed. 

Run dockerized Redis:

```docker pull redis```

```docker run --name some-redis -d redis```


Clone:

``` git clone https://github.com/andreyk22/crypto-convert-api.git```

Install:

```npm install```

In ```.env``` specify ```REDIS_PORT``` and ```REDIS_HOST```.

Run:

```npm start```

## Usage

- Pass currency and amount query params.

 ```http://localhost:3000/convert?currency=ETH&amount=1```
 
- ETH value logs feature. 
    
    Logs every 60s
    
   * Get all logs:

    ```http://localhost:3000/logs```
    
   * Get limited number of logs
    
    ```http://localhost:3000/logs?limit=2```
    
   * Get limited numbers of logs by starting page
    
    ```http://localhost:3000/logs?limit=5&start=1```

## Dependencies

- [nodemon](https://www.npmjs.com/package/nodemon)

- [express](https://www.npmjs.com/package/express)

- [body-parser](https://www.npmjs.com/package/body-parser)

- [axios](https://www.npmjs.com/package/axios)

- [jest](https://www.npmjs.com/package/jest)

- [supertest](https://www.npmjs.com/package/supertest)
