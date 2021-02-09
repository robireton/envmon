import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js'
import 'https://code.highcharts.com/es-modules/masters/modules/data.src.js'

function chartCO2 () {
  const url = new URL(window.location.href)
  const search = new URLSearchParams()
  search.append('hours', '1.5')
  url.pathname = '/co2'
  url.search = search.toString()

  Highcharts.chart('containerCO2', {
    chart: {
      type: 'areaspline'
    },
    title: {
      text: 'concentration of CO₂ over time'
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'concentration ppm'
      }
    },
    legend: {
      enabled: false
    },
    data: {
      csvURL: url.href,
      enablePolling: true,
      dataRefreshRate: 5
    },
    plotOptions: {
      series: {
        crisp: false
      },
      areaspline: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    }
  })
}

function chartTemp () {
  const url = new URL(window.location.href)
  const search = new URLSearchParams()
  search.append('hours', '1.5')
  url.pathname = '/temp'
  url.search = search.toString()

  Highcharts.chart('containerTemp', {
    chart: {
      type: 'areaspline'
    },
    title: {
      text: 'temperature over time'
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'degrees Farenheight'
      }
    },
    legend: {
      enabled: false
    },
    data: {
      csvURL: url.href,
      enablePolling: true,
      dataRefreshRate: 5
    },
    plotOptions: {
      series: {
        crisp: false
      },
      areaspline: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    }
  })
}

window.addEventListener('DOMContentLoaded', _event => {
  Highcharts.setOptions({
    time: {
      timezoneOffset: 300 // EST is -05:00
    }
  })
  chartCO2()
  chartTemp()
})
