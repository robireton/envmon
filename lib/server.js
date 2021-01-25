'use strict'

const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')
const config = require('./config.js')
const timestamp = require('./timestamp.js')

const monitor = require('./monitor.js')
monitor.start()
process.on('exit', _code => {
  monitor.stop()
})

const app = express()
app.engine('.hbs', hbs({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')
app.set('trust proxy', ['loopback', 'uniquelocal'])

app.use(express.static(path.join(__dirname, '../static')))

app.use(require('./routes.js'))

const server = app.listen(config.http, () => {
  console.log(`${timestamp()}\tCO₂ Monitor listening on ${server.address().address}:${server.address().port}`)
})

server.on('close', () => console.log('web server closed'))

for (const signal of ['SIGUSR2', 'SIGINT', 'SIGTERM']) {
  process.on(signal, s => {
    console.log(`signal: ${s}`)
    server.close(err => {
      if (err) console.error(`error ${err} while closing web server`)
      process.exit()
    })
  })
}
