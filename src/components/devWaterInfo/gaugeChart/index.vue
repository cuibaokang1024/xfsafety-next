<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '../../Charts/mixins/resize'

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

  watch: {
    chartData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        this.initChart()
      }
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
      const colorSet = {
        color: '#468EFD'
      }
      const data = this.chartData
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        tooltip: {
          formatter: `{a}<br/>{c}${data.ut}`
        },
        series: [{
          name: '当前水压',
          type: 'gauge',
          radius: '65%',
          min: 0, // 最小刻度
          max: data.rangeValue, // 最大刻度
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              color: [[data.minAlert / data.rangeValue, '#e64242'], [data.maxAlert / data.rangeValue, '#0661ee'], [1, '#e64242']],
              width: 8
            }
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false

          },
          splitLine: {
            show: false
          },
          itemStyle: {
            show: false
          },
          detail: {
            formatter: function(value) {
              return value + data.ut
            },
            offsetCenter: [0, 82],
            textStyle: {
              padding: [0, 0, 0, 0],
              fontSize: 18,
              fontWeight: '700',
              color: colorSet.color
            }
          },
          title: { // 标题
            show: true,
            offsetCenter: [0, 46], // x, y，单位px
            textStyle: {
              color: '#fff',
              fontSize: 14, // 表盘上的标题文字大小
              fontWeight: 400,
              fontFamily: 'PingFangSC'
            }
          },
          data: [{
            name: '水压',
            value: data.value || 0
          }],
          pointer: {
            show: true,
            length: '75%',
            radius: '20%',
            width: 8 // 指针粗细
          },
          animationDuration: 4000
        },
        {
          name: '外部刻度',
          type: 'gauge',
          //  center: ['20%', '50%'],
          radius: '90%',
          min: 0, // 最小刻度
          max: data.rangeValue, // 最大刻度
          splitNumber: 10, // 刻度数量
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
          axisLabel: {
            show: true,
            color: '#4d5bd1',
            distance: 25
          }, // 刻度标签。
          axisTick: {
            show: true,
            splitNumber: 10,
            lineStyle: {
              color: colorSet.color, // 用颜色渐变函数不起作用
              width: 1
            },
            length: -8
          }, // 刻度样式
          splitLine: {
            show: true,
            length: -20,
            lineStyle: {
              color: colorSet.color // 用颜色渐变函数不起作用
            }
          }, // 分隔线样式
          detail: {
            show: false
          },
          pointer: {
            show: false
          }
        }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
