# Environment Monitor · [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

_wrangle readings from a ZGm053UKA Mini CO₂ Monitor_

* receives CO₂ concentration and temperature readings from [ZGm053UKA Mini CO₂ Monitor](https://www.npmjs.com/package/zgm053uka) over USB
* sends those readings to a [datastore](https://github.com/robireton/envdata) via HTTP API

Only works with the one device I have:

    idVendor: 0x04d9 (Holtek Semiconductor, Inc.)
    idProduct: 0xa052 (USB-zyTemp)

## Config
environment variable | description | default
--- | --- | ---
DATA_CO2 | where to send the CO₂ data | http://localhost:3282/co2
DATA_TEMP | where to send the temperature data | http://localhost:3282/temp
VERBOSE | log readings | false

## Alsø Wik
* https://hackaday.io/project/5301-reverse-engineering-a-low-cost-usb-co-monitor/log/17909-all-your-base-are-belong-to-us
* https://github.com/maddindeiss/co2-monitor
* https://ngoldbaum.github.io/posts/co2-monitor/
* https://github.com/vfilimonov/co2meter
* https://github.com/tessel/node-usb
* https://www.npmjs.com/package/node-hid
