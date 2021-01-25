# Environment Monitor
_manage data from ZGm053UKA Mini CO₂ Monitor_

* reads CO₂ concentration and temperature readings from ZGm053UKA Mini CO₂ Monitor over USB
* stores readings in SQLite database
* presents readings as charts using Express and Highcharts

Only works with the one device I have:
idVendor: 0x04d9 (Holtek Semiconductor, Inc.)
idProduct: 0xa052 (USB-zyTemp)

c.f.
* https://hackaday.io/project/5301-reverse-engineering-a-low-cost-usb-co-monitor/log/17909-all-your-base-are-belong-to-us
* https://github.com/maddindeiss/co2-monitor
* https://ngoldbaum.github.io/posts/co2-monitor/
* https://github.com/vfilimonov/co2meter
* https://github.com/tessel/node-usb
* https://www.npmjs.com/package/node-hid
