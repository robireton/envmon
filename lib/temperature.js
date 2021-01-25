'use strict'

exports.fahrenheit = k16 => (k16 * 0.1125 - 459.67).toPrecision(3)
exports.celsius = k16 => (k16 * 0.0625 - 273.15).toPrecision(3)
