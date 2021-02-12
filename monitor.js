import ZGm053UKA from 'zgm053uka'
import fetch from 'node-fetch'

const urlCO2 = process.env.DATA_CO2 || 'http://localhost:3282/co2'
const urlTemp = process.env.DATA_TEMP || 'http://localhost:3282/temp'

const device = new ZGm053UKA()

device.on('co2', async value => {
  console.log(`CO₂: ${value}`)
  const response = await fetch(`${urlCO2}/${value}`, { method: 'POST' })
  if (!response.ok) console.log(response)
})

device.on('temp', async value => {
  console.log(`Temp: ${(value * 0.1125 - 459.67).toPrecision(3)}`)
  const response = await fetch(`${urlTemp}/${value}`, { method: 'POST' })
  if (!response.ok) console.log(response)
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
