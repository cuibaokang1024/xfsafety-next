<template>
  <div :id="id" :class="className" :style="{ width: width, height: height }" />
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
  watch: {
    chartData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        if (newVal) {
          this.initChart()
        }
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
    resize() {
      this.chart.resize()
    },
    getSeries() {
      const series = []
      this.chartData.serieList.forEach(item => {
        series.push({
          name: item.name,
          id: item.id,
          type: 'bar',
          itemStyle: item.itemStyle,
          data: item.data,
          barGap: item.barGap || '0',
          stack: item.stack,
          barWidth: item.barWidth || '',
          showBackground: item.showBackground,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          label: item.label
        })
      })
      return series
    },
    handleInitColor(array) {
      if (array.length > 0) {
        return function(params) {
          var num = array.length
          return array[params.dataIndex % num]
        }
      } else {
        return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          {
            offset: 0,
            color: '#0EFED6'
          },
          {
            offset: 1,
            color: '#01C1CB'
          }
        ])
      }
    },
    initChart() {
      if (!this.chartData) {
        return
      }
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.off('click')
      const _this = this
      this.chart.on('click', function(params) {
        _this.$emit('click', params)
      })
      var myColor = this.chartData.colors || [] // ['#1890ff', '#d99503', '#4da01f']
      const option = {
        grid: this.chartData.grid || {},
        xAxis: {
          show: false
        },
        yAxis: [
          {
            type: 'category',
            axisLabel: {
              show: true,
              // color: this.chartData.axisLabel.color || '#97c1ff',
              color: '#97c1ff',
              fontSize: 12,
              width: 50,
              overflow: 'truncate',
              ellipsis: '...'
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {},
            axisLine: {
              show: false
            },
            data: this.chartData.name,
            offset: 0
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            data: this.chartData.data,
            barWidth: this.chartData.barWidth || 10,
            itemStyle: {
              normal: {
                color: this.handleInitColor(myColor),
                barBorderRadius: 5
              }
            },
            label: {
              normal: {
                show: true,
                // color: this.chartData.label.color || '#97c1ff',
                color: '#97c1ff',
                position: 'right',
                formatter: '{c}'
              }
            },
            z: 2
          },
          {
            name: '背景',
            type: 'bar',
            barGap: '-100%',
            data: this.chartData.total,
            barWidth: this.chartData.barWidth || 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: this.chartData.bgClor || 'rgba(255,255,255,0.13)'
              }
            },
            z: 1
          }
        ]
      }
      this.chart.setOption(option)
      console.log(this.chart.getOption())
    }
  }
}
</script>
