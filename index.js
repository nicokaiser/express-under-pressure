'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')
const createError = require('http-errors')

module.exports = (opts) => {
  opts = opts || {}

  const resolution = 10
  const sampleInterval = Math.max(resolution, opts.sampleInterval || 1000)
  const maxEventLoopDelay = opts.maxEventLoopDelay || 0

  const checkMaxEventLoopDelay = maxEventLoopDelay > 0

  if (checkMaxEventLoopDelay === false) {
    return (req, res, next) => next()
  }

  let eventLoopDelay = 0

  const histogram = monitorEventLoopDelay({ resolution })
  histogram.enable()

  const timer = setInterval(updateEventLoopDelay, sampleInterval)
  timer.unref()

  const underPressureError = opts.customError || createError(503, opts.message || 'Service Unavailable', { code: 'UNDER_PRESSURE' })
  const retryAfter = opts.reteryAfter || 10

  function updateEventLoopDelay () {
    eventLoopDelay = Math.max(0, histogram.mean / 1e6 - resolution)
    histogram.reset()
  }

  return (req, res, next) => {
    if (checkMaxEventLoopDelay && eventLoopDelay > maxEventLoopDelay) {
      res.status(503)
      res.set('Retry-After', retryAfter)
      next(underPressureError)
      return
    }

    next()
  }
}
