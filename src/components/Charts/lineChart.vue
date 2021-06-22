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
    getSeries() {
      const series = []
      this.chartData.dataList.forEach(item => {
        if (item.markLine) {
          series.push({
            name: item.name,
            type: 'line',
            markLine: item.markLine
          })
        } else {
          series.push({
            name: item.name,
            type: 'line',
            smooth: item.smooth ? null : true,
            data: item.data,
            lineStyle: {},
            itemStyle: {
              normal: {
                color: item.style.color, // 图例的颜色
                lineStyle: {
                  color: item.style.color,
                  width: 2
                }
              }
            }
          })
        }
      })
      return series
    },
    getLegend(isUpadte, data) {
      const dataList = []
      this.chartData.dataList.forEach(item => {
        if (item.markLine) {
          return
        }
        dataList.push({
          name: item.name,
          textStyle: {
            color: item.style.color
          }
        })
      })
      const chartData = this.chartData
      var legend = {}
      if (chartData.legend && chartData.legendNum) {
        legend = Object.assign({}, legend, {
          data: dataList,
          left: chartData.legendPosition.left,
          right: chartData.legendPosition.right,
          top: chartData.legendPosition.top,
          bottom: chartData.legendPosition.bottom
        })
      } else if (chartData.legend) {
        legend = Object.assign({}, legend, {
          data: dataList,
          formatter: function(name) {
            const index = chartData.dataList.findIndex(item => {
              return item.name === name
            })
            const length = chartData.dataList[index].data.length
            let val = chartData.dataList[index].data[length - 1]
            if (isUpadte) {
              val = data[index]
            }
            return name + ' ' + val + chartData.unit
          },
          left: chartData.legendPosition.left,
          right: chartData.legendPosition.right,
          top: chartData.legendPosition.top,
          bottom: chartData.legendPosition.bottom
        })
      } else {
        legend = {
          show: false
        }
      }
      return legend
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const lineUnit = this.chartData.unit
      // const color = this.chartData.color
      const minNum = this.chartData.minNum
      const maxNum = this.chartData.maxNum
      const interval = this.chartData.interval
      const option = {
        // color: color, // 折线图颜色
        // 提示框组件设置
        legend: this.getLegend(),
        tooltip: {
          backgroundColor: 'rgba(46, 126, 139, 0.90)',
          padding: [10, 20, 10, 8],
          textStyle: {
            fontSize: 12,
            lineHeight: 24
          },
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed'
              // color: color
            }
          },
          formatter: function(params, ticket, callback) {
            callback
            let htmlStr = ''
            for (let i = 0; i < params.length; i++) {
              const param = params[i]
              const xName = param.name
              const seriesName = param.seriesName
              const value = param.value
              // var color = param.color;
              if (value.length === 0) {
                continue
              }
              htmlStr += xName
              htmlStr += '<br/><div>'
              htmlStr += seriesName + '：' + value + lineUnit
              htmlStr += '</div>'
            }
            return htmlStr
          }
        },
        // 折线图位置设置
        grid: this.chartData.grid || {
          left: '40',
          right: '14',
          bottom: '20',
          top: '10'
        },
        // x轴设置
        xAxis: {
          type: 'category',
          boundaryGap: false,
          interval: 0,
          // 标注字设置
          axisLabel: {
            textStyle: {
              color: this.chartData.xAxis.textColor || '#000'
            }
          },
          // 坐标轴轴线相关设置
          axisLine: {
            lineStyle: {
              color: this.chartData.xAxis.lineColor || '#000'
            }
          },
          minInterval: 1,
          data: this.chartData.xAxisData
        },
        // y轴设置
        yAxis: {
          type: 'value',
          // 轴数值单位
          // name: '单位/' + lineUnit,
          // 标注字设置
          axisLabel: {
            formatter: function(params) {
              return params + lineUnit
            },
            textStyle: {
              color: this.chartData.yAxis.textColor || '#000'
            }
          },
          // 分隔线设置
          splitLine: {
            lineStyle: {
              color: this.chartData.yAxis.lineColor || '#000'
            }
          },
          // 坐标轴轴线相关设置
          axisLine: {
            show: this.chartData.yAxis.axisLine,
            lineStyle: {
              color: this.chartData.yAxis.lineColor || '#000'
            }
          },
          max: maxNum,
          min: minNum,
          interval: interval
        },
        animationEasing: 'linear', // 初始动画
        animationEasingUpdate: 'quarticInOut', // 数据更新的动画效果
        animationDurationUpdate: 800, // 数据更新动画的时长
        series: this.getSeries()
      }
      this.chart.setOption(option)
      this.chart.on('click', params => {
        this.$emit('handleCilck', params)
      })
    }
  }
}
</script>
