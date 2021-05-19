const express = require('express')
const app = express()

app.use(require('./')({
  maxEventLoopDelay: 1000,
  message: 'Under pressure!',
  retryAfter: 50
}))

app.get('/', (req, res, next) => {
  res.end(':)')
})

app.listen(3000)

setInterval(() => {
  block(1100)
}, 200)

function block (msec) {
  const start = Date.now()
  while (Date.now() - start < msec) {
    noop()
  }
}

function noop () {}
