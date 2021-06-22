<template>
  <section :id="id" :class="className" :style="{width: width, height: height}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
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
    chartData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        if (newVal) {
          this.chart.dispose()
          this.chart = null
          this.handlerInitChart()
        }
      }
    }
  },
  mounted() {
    this.handlerInitChart()
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
    // 数据
    handlerSeries() {
      const series = []
      this.chartData.series.forEach(item => {
        series.push({
          name: item.name || '',
          type: 'pie',
          radius: item.radius,
          center: item.center,
          roseType: item.roseType || '',
          hoverAnimation: true,
          hoverOffset: 2,
          selectedMode: 'single',
          label: item.label || {
            show: false,
            formatter: `{c}${this.chartData.unit}\n{d}%`,
            position: 'center',
            color: '#fff'
          },
          data: item.data,
          color: item.color || null,
          emphasis: item.emphasis || {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          }
        })
      })
      return series
    },
    // 指示器
    handlerLegend() {
      var legend = {}
      if (this.chartData.legend) {
        legend = {
          orient: this.chartData.legend.orient || 'vertical',
          top: this.chartData.legend.top || 'auto',
          left: this.chartData.legend.left || 'auto',
          textStyle: this.chartData.legend.textStyle || '#fff',
          itemWidth: this.chartData.legend.itemWidth || 'auto',
          itemHeight: this.chartData.legend.itemHeight || 'auto',
          data: this.chartData.legend.data
        }
      } else {
        legend = {
          show: false
        }
      }
      return legend
    },
    // 初始化
    handlerInitChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.off('click')
      const _this = this
      this.chart.on('click', function(params) {
        _this.$emit('click', params)
      })
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: <br /> {c}' + this.chartData.unit + '{d}%',
          position: function(point, params, dom, rect, size) {
            // 固定在顶部
            return [point[0], '10%']
          }
        },
        grid: this.chartData.grid,
        legend: this.handlerLegend(),
        series: this.handlerSeries()
      }
      this.chart.setOption(option)
    }
  }
}
</script>

<style>
</style>
