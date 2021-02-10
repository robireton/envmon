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
  const data = dedup(average(datastore.co2(start, stop), 1))
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
  const data = dedup(average(datastore.fahrenheit(start, stop), 15))
  if ('content-type' in req.headers && req.headers['content-type'] === 'application/json') {
    res.json(data)
  } else {
    res.set('Content-Type', 'text/plain')
    res.send(['timestamp,temp', ...data.map(p => p.join(','))].join('\n'))
  }
})

function dedup (rows) {
  return rows.filter((row, i, a) => (i > 0 && i < (a.length - 1)) ? (row[1] !== a[i - 1][1] || row[1] !== a[i + 1][1]) : true)
}

function average (rows, minutes = 1) {
  const ms = Math.floor(minutes * 60 * 1000)
  const buckets = new Map()
  for (const [stamp, value] of rows) {
    const key = Math.round(stamp / ms)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(value)
  }
  return Array.from(buckets.entries()).map(([k, v]) => [k * ms, Number.parseFloat((v.reduce((a, c) => a + c) / v.length).toPrecision(4))])
}

export default router
