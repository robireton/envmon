'use strict'

function chartCO2 () {
  Highcharts.chart('containerCO2', {
    chart: {
      type: 'spline'
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
      csvURL: 'http://rpi.local:8080/co2?hours=1.5',
      enablePolling: true,
      dataRefreshRate: 5
    },
    plotOptions: {
      area: {
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
    },
  })
}

function chartTemp () {
  Highcharts.chart('containerTemp', {
    chart: {
      type: 'spline'
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
      csvURL: 'http://rpi.local:8080/temp?hours=1.5',
      enablePolling: true,
      dataRefreshRate: 5
    },
    plotOptions: {
      area: {
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
    },
  })
}

window.addEventListener('DOMContentLoaded', _event => {
  Highcharts.setOptions({
    time: {
        timezoneOffset: +300 //EST is -05:00
    }
  })
  chartCO2()
  chartTemp()
})
