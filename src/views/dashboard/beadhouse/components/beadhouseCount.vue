<template>
  <el-container>
    <el-header height="26px">
      <span class="block" />
      <span class="text">按行政区划统计养老机构数量</span>
    </el-header>
    <el-main>
      <div id="admin-chart" :style="{height: '100%',width: '100%'}" />
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { handlebeadhouseCount } from '@/api/beadhouse'

export default {
  mixins: [resize],
  data() {
    return {
      a: 10,
      b: 20,
      chart: null,
      beadhouseData: [],
      navigatList_copy: []
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    init() {
      handlebeadhouseCount().then(res => {
        this.beadhouseData = res.data
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('admin-chart'))
      const name = this.beadhouseData.map(ele => {
        return ele.statName
      })
      const value = this.beadhouseData.map(ele => {
        return ele.count
      })
      this.chart.on('click', (params) => {
        this.navigatList_copy = []
        this.navigatList_copy.push({
          level: 1,
          name: '按行政区划统计养老机构数量'
        }, {
          level: 1,
          name: params.name
        })
        const data = this.beadhouseData.find(e => e.statName === params.name)
        this.$emit('update:navigatList', this.navigatList_copy)
        this.$emit('filterBeadhouseCount', data)
      })
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: name,
          axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
              color: 'white',
              fontSize: 14
            }
          }
        },
        grid: {
          left: '0',
          right: '0',
          top: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'white'
          },
          splitLine: {
            lineStyle: {
              color: '#0D3B86'
            }
          }
        },
        series: [{
          data: value,
          type: 'bar',
          barWidth: 26,
          itemStyle: {
            barBorderRadius: [18, 18, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#03E9FC'
            }, {
              offset: 1,
              color: '#02AFF2'
            }])
          }
        }],
        dataZoom: [{
          backgroundColor: '#33384b',
          borderColor: '#000',
          borderRadius: 5,
          bottom: 0,
          end: 50,
          fillerColor: '#269cdb',
          filterMode: 'filter',
          handleSize: 0,
          height: 8,
          left: 0,
          realtime: true,
          right: 0,
          show: true,
          showDataShadow: false,
          showDetail: false,
          start: 0,
          type: 'slider'
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    position: relative;
    padding: 0;
    margin-bottom: 12px;
    align-items: center;
    border-bottom: none;
    .text {
      font-size: 16px;
      color: #fff;
      margin-left: 5px;
    }
    .block {
      display: inline-block;
      width: 6px;
      height: 13px;
      background-color: #0488ea;
      margin-left: 2px;
    }
  }
  .el-main {
    position: relative;
    display: flex;
    flex-direction: column;
    border: none;
    padding: 0;
    overflow: hidden;
    .chart {
      flex: 1;
    }
  }
}
</style>
