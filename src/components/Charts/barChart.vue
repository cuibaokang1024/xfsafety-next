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
    },
    latestData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    latestData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        if (newVal) {
          this.chart.setOption({
            series: [
              {
                data: newVal.value
              }
            ]
          })
        }
      }
    },
    chartData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        if (newVal) {
          this.chart.dispose()
          this.chart = null
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
      this.chartData.serieList.forEach((item) => {
        series.push({
          name: item.name,
          id: item.id,
          type: 'bar',
          itemStyle: item.itemStyle,
          data: item.data,
          dataType: '45454',
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
    getLegend() {
      const chartData = this.chartData
      const dataList = []
      chartData.serieList.forEach((item) => {
        dataList.push({
          name: item.name,
          icon: item.icon
        })
      })
      var legend = {}
      if (chartData.legend) {
        legend = {
          icon: chartData.legend.icon || '',
          width: chartData.legend.width,
          itemWidth: chartData.legend.itemWidth || 25,
          itemHeight: chartData.legend.itemHeight || 14,
          left: chartData.legend.position.left || 'auto',
          botttom: chartData.legend.position.bottom || 'auto',
          right: chartData.legend.position.right || 'auto',
          top: chartData.legend.position.top || 'auto',
          data: dataList,
          textStyle: chartData.legend.textStyle
        }
      } else {
        legend = {
          show: false
        }
      }
      return legend
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.off('click')
      const _this = this
      this.chart.on('click', function(params) {
        _this.$emit('click', params)
      })
      const unit = this.chartData.yAxis && this.chartData.yAxis.unit || ''
      const option = {
        title: {
          text: this.chartData.title,
          x: '0',
          textStyle: {
            color: '#000',
            fontSize: '14'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#000'
            }
          },
          position: function(point, params, dom, rect, size) {
            return [point[0] + 12, point[1] - 110]
          }
        },
        grid: this.chartData.grid,
        legend: this.getLegend(),
        calculable: true,
        xAxis: [{
          type: this.chartData.xAxis.type || 'category',
          axisLine: {
            lineStyle: {
              color: this.chartData.xAxis.color || '#fff'
            }
          },
          splitLine: {
            show: this.chartData.xAxis.splitLine || false
          },
          axisTick: {
            show: this.chartData.xAxis.axisTick || false
          },
          splitArea: {
            show: this.chartData.xAxis.splitArea || false
          },
          axisLabel: {
            interval: 0
          },
          data: this.chartData.xAxis.data
        }],
        yAxis: [{
          type: this.chartData.yAxis.type || 'value',
          splitLine: {
            show: this.chartData.yAxis.splitLine || false
          },
          axisLine: {
            lineStyle: {
              color: this.chartData.yAxis.color || '#fff'
            }
          },
          axisTick: {
            show: this.chartData.yAxis.axisTick || false
          },
          axisLabel: {
            interval: 0,
            formatter: function(params) {
              return params + unit
            }
          },
          splitArea: {
            show: this.chartData.yAxis.splitArea || false
          },
          data: this.chartData.yAxis.data
        }],
        series: this.getSeries(),
        dataZoom: this.chartData.dataZoom || false
      }
      this.chart.setOption(option)
    }
  }
}
</script>
