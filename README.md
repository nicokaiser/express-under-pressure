# express-under-pressure

Measure process load with automatic handling of "Service Unavailable" plugin for Express. This is a very stripped down version of [fastify/under-pressure](https://github.com/fastify/under-pressure).

## Requirements

- Node.js ^12

## Usage

```js
const app = require('express')()

app.use(require('express-under-pressure')({
  maxEventLoopDelay: 1000,
  message: 'Under pressure!',
  retryAfter: 50
}))

app.get('/', (req, res, next) => {
  res.end('hello world')
})

app.listen(3000)
```

The default value for `maxEventLoopDelay` is `0`. If the value is `0` the check will not be performed.

### Sample interval

You can set a custom value for sampling the metrics using the sampleInterval option, which accepts a number that represents the interval in milliseconds.

The default value is `1000`.

## Acknowledgements

This is a very very simplified version of the [under-pressure](https://github.com/fastify/under-pressure) module for Fastify.
