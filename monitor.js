import env from '@robireton/environment'
import fetch from 'node-fetch'
import ZGm053UKA from 'zgm053uka'

const urlCO2 = process.env.DATA_CO2 || 'http://localhost:3282/co2'
const urlTemp = process.env.DATA_TEMP || 'http://localhost:3282/temp'
const verbose = env.parseBool('VERBOSE')

const device = new ZGm053UKA()

async function post (url, body) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  })
  if (!response.ok) throw response
}

device.on('co2', async value => {
  if (verbose) console.log(`CO₂: ${value} ppm`)
  try {
    await post(urlCO2, { ppm: value })
  } catch (err) {
    console.log('co2 post error: %O', err)
  }
})

device.on('temp', async value => {
  if (verbose) console.log(`Temp: ${Math.round(value * 0.5625 - 2298.35) / 5} °F`)
  try {
    await post(urlTemp, { k16: value })
  } catch (err) {
    console.log('temp post error: %O', err)
  }
})

device.on('error', error => {
  console.log('device error %O', error)
  process.exit()
})

for (const signal of ['SIGUSR2', 'SIGINT', 'SIGTERM']) {
  process.on(signal, s => {
    console.log(`signal: ${s}`)
    device.close()
    process.exit()
  })
}
