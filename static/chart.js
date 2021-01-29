'use strict'

async function chartCO2 () {
  const response = await window.fetch('/co2', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    const data = await response.json()
    Highcharts.chart('containerCO2', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'concentration of CO₂ over time'
      },
      subtitle: {
        text: document.ontouchstart === undefined
          ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
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
      },

      series: [{
        type: 'areaspline',
        name: 'concentration of CO₂',
        data: data
      }]
    })
  }

}

async function chartTemp () {
  const response = await window.fetch('/temp', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    const data = await response.json()
    Highcharts.chart('containerTemp', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'temperature over time'
      },
      subtitle: {
        text: document.ontouchstart === undefined
          ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
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
      },

      series: [{
        type: 'areaspline',
        name: 'temperature',
        data: data
      }]
    })
  }

}

window.addEventListener('DOMContentLoaded', async _event => {
  Highcharts.setOptions({
    time: {
        timezoneOffset: +300 //EST is -05:00
    }
  })
  chartCO2()
  chartTemp()
})
