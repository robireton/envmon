'use strict'

const router = require('express').Router()
const config = require('./config.js')
const datastore = require('./datastore.js')
const timestamp = require('./timestamp.js')

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
    scripts: [config.highcharts.startsWith('http') ? config.highcharts : `${req.proxyBase}/${config.highcharts}`, `${req.proxyBase}/chart.js`],
    stylesheets: [`${req.proxyBase}/chart.css`]
  })
})

router.get('/co2', (_req, res) => {
  res.json(datastore.co2())
})

router.get('/temp', (_req, res) => {
  res.json(datastore.fahrenheit())
})

// router.get('/providers', async (req, res, _next) => {
//   if (datamart) {
//     try {
//       const providers = await datamart.getProviders()
//       res.render('providers', {
//         page_title: 'Arista Providers',
//         base_url: req.proxyBase,
//         scripts: [],
//         stylesheets: [],
//         providers: providers
//       })
//     } catch (err) {
//       console.error(err)
//       res.sendStatus(500) // Internal Server Error
//     }
//   } else {
//     res.sendStatus(501) // Not Implemented
//   }
// })

module.exports = router
