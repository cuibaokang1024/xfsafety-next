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
    status: {
      type: Number,
      default: 0
    },
    chartData: {
      type: Array,
      default: () => []
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
      handler(newVal, oldVal) {
        this.initChart()
      }
    }
  },
  mounted() {
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
      var flag = false
      if (this.chartData.length === 0) {
        flag = true
      }
      const color = this.status === 0 ? '#7FFF00' : '#888888'
      const option = {
        graphic: flag
          ? (this.status === 0 ? {
            type: 'text',
            top: 'center',
            left: 'center',
            z: 10,
            style: {
              text: '用电正常',
              font: 'bolder 23px fangSong',
              fill: '#fff'

            }

          } : {
            type: 'text',
            top: 'center',
            left: 'center',
            z: 10,
            style: {
              text: '设备离线',
              font: 'bolder 23px fangSong',
              fill: '#fff'

            }

          }) : { type: 'text',
            style: {}},
        tooltip: {
          show: !flag,
          confine: true,
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          left: '0%',
          top: '0%',
          bottom: '0%',
          right: '0%'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '65%',
            center: ['50%', '55%'],
            data: flag ? [{ name: '', value: '1', itemStyle: { color: color }}] : this.chartData,
            label: {
              normal: {
                show: !flag
              }
            }
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
