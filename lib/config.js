'use strict'

function envbool (name) {
  if (!(name in process.env)) console.log(`Warning: environment variable ${name} is not set`)
  return String(process.env[name]).toLowerCase() === 'true'
}

// function envfloat (name, ifNaN) {
//   if (!(name in process.env)) console.log(`Warning: environment variable ${name} is not set`)
//   const x = Number.parseFloat(process.env[name])
//   return Number.isNaN(x) ? ifNaN : x
// }

// function datetag (now = new Date()) {
//   return [now.getFullYear().toString(), (now.getMonth() + 1).toString().padStart(2, '0'), now.getDate().toString().padStart(2, '0')].join('-')
// }

const config = {
  production: (process.env.NODE_ENV === 'production'),
  debug: (process.env.NODE_ENV === 'debug'),
  // db: `run/readings.${datetag()}.db`,
  db: `run/readings.db`,
  highcharts: process.env.HIGHCHARTS_URL || 'https://code.highcharts.com/highcharts.js',
  http: {
    port: process.env.HTTP_PORT || 8080,
    host: process.env.HTTP_HOST || (process.env.NODE_ENV === 'production' ? undefined : 'localhost')
  },
  log: {
    stamp: envbool('LOG_STAMP'),
    method: envbool('LOG_METHOD'),
    path: envbool('LOG_PATH'),
    ip: envbool('LOG_IP'),
    ua: envbool('LOG_UA')
  }
}

if (process.env.NODE_ENV === 'debug') console.debug(config)

module.exports = config
