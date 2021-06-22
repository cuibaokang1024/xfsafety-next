<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    chartData: {
      type: Object,
      default: () => {}
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const highlight = 'white'
      const color = this.chartData.minAlarmVal >= this.chartData || this.chartData.maxAlarmVal <= this.value ? 'rgba(76,175,80,0.6)' : 'rgba(193,136,244,0.9)'
      const data = [
        {
          name: this.chartData.name,
          value: this.chartData.value,
          unit: this.chartData.unit,
          min: this.chartData.min,
          max: this.chartData.max,
          pos: ['50%', '50%'],
          range: [0, 100],
          color: color
        }

      ]
      const option = {
        backgroundColor: '#212121',
        series: (function() {
          var result = []
          data.forEach(function(item) {
            result.push(
              // 内侧指针、数值显示
              {
                name: item.name,
                type: 'gauge',
                center: item.pos,
                radius: '95%',
                startAngle: 225,
                endAngle: -45,
                min: item.min,
                max: item.max,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 2,
                    color: [
                      [
                        item.value / item.max, item.color
                      ]
                    ]
                  }
                },
                axisTick: {
                  show: 0
                },
                splitLine: {
                  show: 0
                },
                axisLabel: {
                  show: 0
                },
                pointer: {
                  show: 0
                },
                detail: {
                  show: 0
                },
                data: [{
                  value: item.value
                }]
              },
              // 外围刻度
              {
                type: 'gauge',
                center: item.pos,
                radius: '85%', // 1行3个
                splitNumber: item.splitNum || 10,
                min: item.min,
                max: item.max,
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 1,
                    color: [
                      [1, 'rgba(0,0,0,0)']
                    ]
                  }
                }, // 仪表盘轴线
                axisTick: {
                  show: true,
                  lineStyle: {
                    color: 'rgba(255,255,255,0.6)',
                    width: 1
                  },
                  length: -6
                }, // 刻度样式
                splitLine: {
                  show: true,
                  length: 10,
                  lineStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  }
                }, // 分隔线样式
                axisLabel: {
                  show: true,
                  distance: 2,
                  textStyle: {
                    color: highlight,
                    fontSize: '12',
                    fontWeight: 'bold'
                  }
                },
                pointer: {
                  show: 0
                },
                detail: {
                  show: 0
                }
              },

              // 内侧指针、数值显示
              {
                name: item.name,
                type: 'gauge',
                center: item.pos,
                radius: '90%',
                startAngle: 225,
                endAngle: -45,
                min: item.min,
                max: item.max,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 30,
                    color: [
                      [
                        item.value / item.max,
                        item.color

                      ],
                      [
                        1, 'rgba(255,255,255, 0)'
                      ]
                    ]
                  }
                },
                axisTick: {
                  show: 0
                },
                splitLine: {
                  show: 0
                },
                axisLabel: {
                  show: 0
                },
                pointer: {
                  show: true,
                  length: '102%',
                  width: 3
                },
                title: {
                  show: true,
                  offsetCenter: [0, '65%'],
                  color: 'white',
                  fontSize: 20,
                  borderRadius: 21,
                  padding: 5
                },
                detail: {
                  show: true,
                  offsetCenter: [0, 0],
                  textStyle: {
                    fontSize: 25,
                    color: '#fff'
                  },
                  formatter: [
                    '{value}' + (item.unit || '')
                  ].join('\n'),

                  rich: {
                    name: {
                      fontSize: 20,
                      lineHeight: 10,
                      color: '#ddd',
                      padding: [30, 0, 0, 0]
                    }
                  }
                },
                data: [{
                  value: item.value,
                  name: item.name
                }]
              }
            )
          })
          return result
        })()
      }
      this.chart.setOption(option)
    }
  }
}
</script>
