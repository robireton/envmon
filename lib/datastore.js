import { dirname } from 'path'
import fs from 'fs-extra'
import sqlite from 'better-sqlite3'
import config from './config.js'
import temperature from './temperature.js'

fs.ensureDirSync(dirname(config.db))
const db = sqlite(config.db)

process.on('exit', () => {
  console.log('closing sqlite readings database')
  db.close()
})

db.prepare('CREATE TABLE IF NOT EXISTS "co2" ("timestamp" INTEGER NOT NULL, "ppm" INTEGER NOT NULL)').run()
db.prepare('CREATE TABLE IF NOT EXISTS "temp" ("timestamp" INTEGER NOT NULL, "k16" INTEGER NOT NULL)').run()
db.prepare('CREATE TABLE IF NOT EXISTS "other" ("timestamp" INTEGER NOT NULL, "reading" TEXT NOT NULL)').run()
db.prepare('CREATE INDEX IF NOT EXISTS "concentration_at_time" ON "co2" ("timestamp")').run()
db.prepare('CREATE INDEX IF NOT EXISTS "temperature_at_time" ON "temp" ("timestamp")').run()

const insertConcentration = db.prepare('INSERT INTO "co2" ("timestamp", "ppm") VALUES (:timestamp, :ppm)')
const insertTemperature = db.prepare('INSERT INTO "temp" ("timestamp", "k16") VALUES (:timestamp, :k16)')
const insertReading = db.prepare('INSERT INTO "other" ("timestamp", "reading") VALUES (:timestamp, :reading)')

const selectConcentration = db.prepare('SELECT "timestamp", "ppm" FROM "co2" WHERE "timestamp" BETWEEN :start AND :stop ORDER BY "timestamp"')
const selectTemperature = db.prepare('SELECT "timestamp", "k16" FROM "temp" WHERE "timestamp" BETWEEN :start AND :stop ORDER BY "timestamp"')

export default {
  concentration: ppm => {
    try {
      const entry = {
        timestamp: Date.now(),
        ppm: ppm
      }
      console.log(config.log.stamp ? `ppm: ${entry.ppm} at ${Date(entry.timestamp)}` : `${entry.ppm} ppm CO₂`)
      return insertConcentration.run(entry)
    } catch (err) {
      console.error(err)
      return false
    }
  },

  temperature: k16 => {
    // k16 has units 1/16th Kelvin
    try {
      const entry = {
        timestamp: Date.now(),
        k16: k16
      }
      console.log(config.log.stamp ? `temp: ${temperature.fahrenheit(entry.k16)} °F at ${Date(entry.timestamp)}` : `${temperature.fahrenheit(entry.k16)} °F`)
      return insertTemperature.run(entry)
    } catch (err) {
      console.error(err)
      return false
    }
  },

  other: reading => {
    try {
      return insertReading.run({
        timestamp: Date.now(),
        reading: reading
      })
    } catch (err) {
      console.error(err)
      return false
    }
  },

  co2: (start, stop) => selectConcentration.all({ start: start, stop: stop }).filter((row, i, rs) => (i > 0 && i < (rs.length - 1)) ? (row.ppm !== rs[i - 1].ppm || row.ppm !== rs[i + 1].ppm) : true).map(row => [row.timestamp, row.ppm]),
  fahrenheit: (start, stop) => selectTemperature.all({ start: start, stop: stop }).filter((row, i, rs) => (i > 0 && i < (rs.length - 1)) ? (row.k16 !== rs[i - 1].k16 || row.k16 !== rs[i + 1].k16) : true).map(row => [row.timestamp, temperature.fahrenheit(row.k16)])
}
