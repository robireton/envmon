
import path from 'path'
import express from 'express'
import hbs from 'express-handlebars'
import config from './config.js'
import timestamp from './timestamp.js'
import monitor from './monitor.js'
import routes from './routes.js'

monitor.start()

const app = express()
app.engine('.hbs', hbs({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')
app.set('trust proxy', ['loopback', 'uniquelocal'])
app.use(express.static(path.join(process.cwd(), 'static')))
app.use(routes)

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
