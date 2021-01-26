'use strict'

exports.fahrenheit = k16 => Math.round(k16 * 0.5625 - 2298.35) / 5
exports.celsius = k16 => (k16 * 0.0625 - 273.15).toPrecision(3)
