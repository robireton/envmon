'use strict'

const hid = require('node-hid')
const usb = require('usb')

const codeCO2 = 0x50
const codeTemp = 0x42
const magicTable = [0, 0, 0, 0, 0, 0, 0, 0]
const idVendor = 0x04d9 // Holtek Semiconductor, Inc.
const idProduct = 0xa052 // USB-zyTemp

let current = false

process.on('exit', code => {
  console.log(`exit with code ${code}`)
  if (current) current.close()
})
const datastore = require('./datastore.js')

usb.on('attach', device => {
  console.log('\n*** device attached ***')
  for (const [name, value] of Object.entries(device)) {
    console.log('\t%s: %O', name, value)
  }
  if (device.deviceDescriptor.idVendor === idVendor && device.deviceDescriptor.idProduct === idProduct) {
    console.log('waiting for device to initialize…')
    setTimeout(() => {
      if (!current) current = Monitor()
    }, 30000)
  }
})

usb.on('detach', device => {
  console.log('\n*** device detached ***')
  for (const [name, value] of Object.entries(device)) {
    console.log('\t%s: %O', name, value)
  }
  if (current && device.deviceDescriptor.idVendor === idVendor && device.deviceDescriptor.idProduct === idProduct) {
    current.close()
    current = false
  }
})

function Monitor () {
  try {
    const device = new hid.HID(idVendor, idProduct)
    device.on('error', error => {
      console.error(error)
      process.exit()
    })

    device.on('data', data => {
      const message = decrypt(data)
      const value = (message[1] << 8) | message[2]
      switch (message[0]) {
        case codeCO2:
          datastore.concentration(value)
          break

        case codeTemp:
          datastore.temperature(value)
          break

        default:
          datastore.other(message.map(n => n.toString(16)).join(':'))
      }
    })

    device.sendFeatureReport(magicTable)
    console.log('start monitoring')

    return {
      close: () => {
        console.log('stop monitoring')
        device.removeAllListeners()
        device.close()
      }
    }
  } catch (error) {
    console.error(error)
  }
  return false
}

function truncateU64 (n) {
  const s = n.toString(2)
  const b = s.substring(s.length - 64)
  return BigInt(`0b${b}`)
}

function decrypt (b) {
  // Decode buffer received from CO2 monitor.

  const magicWord = [132, 71, 86, 214, 7, 147, 147, 86] // b'Htemp99e'
  // Rearrange bytes and convert to long int
  let res = Buffer.from([2, 4, 0, 7, 1, 6, 5, 3].map(i => b[i])).readBigUInt64BE()
  // # Cyclic shift by 3 to the right
  res = truncateU64(res >> BigInt(3) | res << BigInt(61))
  // # Convert to list
  res = [56, 48, 40, 32, 24, 16, 8, 0].map(i => Number((res >> BigInt(i)) & BigInt(255)))
  // # Subtract and convert to uint8
  return res.map((n, i) => (n - magicWord[i]) & 0xFF)
}

exports.start = () => {
  current = Monitor()
}

exports.stop = () => {
  if (current) {
    current.close()
    current = false
  }
}
