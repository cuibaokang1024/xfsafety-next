<template>
  <el-container>
    <el-header height="26px">
      <span class="block" />
      <span class="text">按行政区划统计设备安装单位</span>
    </el-header>
    <el-main>
      <bar-percent-chart
        id="alarm-chart"
        height="100%"
        width="100%"
        :chart-data="chartData"
        @click="chartClick"
      />
    </el-main>
  </el-container>
</template>

<script>
import { handleAlarmArea } from '@/api/beadhouse'

import BarPercentChart from '@/components/Charts/barPercentChart'

export default {
  components: {
    BarPercentChart
  },
  data() {
    return {
      chartData: null
    }
  },
  mounted() {
    this._handleAlarmArea()
  },
  methods: {
    _handleAlarmArea() {
      handleAlarmArea().then(res => {
        if (res.data) {
          this.chartData = this.handleInitChart(res.data)
        }
      })
    },
    chartClick(params) {
      this.navigatList_copy = []
      this.navigatList_copy.push({
        level: 1,
        name: '按行政区划统计设备安装单位'
      }, {
        level: 1,
        name: params.name
      })
      this.$emit('update:navigatList', this.navigatList_copy)
      this.$emit('handleFilterAreaAlert', params)
    },
    handleInitChart(data) {
      const total = []
      JSON.parse(JSON.stringify(data)).map(item => {
        total.push({
          value: Math.max.apply(
            null,
            data.map(item => {
              return item.value
            })
          ) + 50,
          id: item.id
        })
      })
      const chartData = {
        colors: [],
        axisLabel: {
          color: '#fff'
        },
        label: {
          color: '#fff'
        },
        barWidth: 13,
        grid: {
          top: '10px',
          left: '60px',
          right: '0',
          bottom: '0'
        },
        name: data.map(item => {
          return item.name
        }),
        data,
        total
      }
      return chartData
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
