import express from 'express'
import config from './config.js'
import timestamp from './timestamp.js'
import datastore from './datastore.js'

const router = express.Router()

// Logging and setup
router.all('*', (req, res, next) => {
  res.set('X-UA-Compatible', 'IE=edge')
  const fields = []
  if (config.log.stamp) fields.push(timestamp())
  if (config.log.method) fields.push(req.method)
  if (config.log.path) fields.push(req.path)
  if (config.log.ip) fields.push(req.ip)
  if (config.log.ua) fields.push(req.get('user-agent') || '')
  if (fields.length) console.log(fields.join('\t'))

  req.proxyBase = req.get('x-script-name') || ''

  next()
})

router.get('/', (req, res, _next) => {
  res.render('chart', {
    page_title: 'CO₂ & Temperature Monitor',
    base_url: req.proxyBase,
    scripts: [`${req.proxyBase}/chart.js`],
    stylesheets: [`${req.proxyBase}/chart.css`]
  })
})

router.get('/live', (req, res, _next) => {
  res.render('chart', {
    page_title: 'Live CO₂ & Temperature',
    base_url: req.proxyBase,
    scripts: [`${req.proxyBase}/live.js`],
    stylesheets: [`${req.proxyBase}/chart.css`]
  })
})

router.get('/co2', (req, res) => {
  const hours = 'hours' in req.query ? Number.parseFloat(req.query.hours) : 36
  const stop = 'stop' in req.query ? Number.parseInt(req.query.stop, 10) : Date.now()
  const start = 'start' in req.query ? Number.parseInt(req.query.start, 10) : stop - Math.floor(hours * 60 * 60 * 1000)
  const data = datastore.co2(start, stop)
  if ('content-type' in req.headers && req.headers['content-type'] === 'application/json') {
    res.json(data)
  } else {
    res.set('Content-Type', 'text/plain')
    res.send(['timestamp,ppm', ...data.map(p => p.join(','))].join('\n'))
  }
})

router.get('/temp', (req, res) => {
  const hours = 'hours' in req.query ? Number.parseFloat(req.query.hours) : 36
  const stop = 'stop' in req.query ? Number.parseInt(req.query.stop, 10) : Date.now()
  const start = 'start' in req.query ? Number.parseInt(req.query.start, 10) : stop - Math.floor(hours * 60 * 60 * 1000)
  const data = datastore.fahrenheit(start, stop)
  if ('content-type' in req.headers && req.headers['content-type'] === 'application/json') {
    res.json(data)
  } else {
    res.set('Content-Type', 'text/plain')
    res.send(['timestamp,temp', ...data.map(p => p.join(','))].join('\n'))
  }
})

export default router
