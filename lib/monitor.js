import ZGm053UKA from 'zgm053uka'
import datastore from './datastore.js'

const device = new ZGm053UKA()

export default {
  start: () => {
    device.on('co2', value => datastore.concentration(value))
    device.on('temp', value => datastore.temperature(value))
    device.on('error', error => console.log('error %O', error))

    process.on('exit', _code => {
      device.close()
    })
  },

  stop: () => {
    device.close()
  }
}
