<template>
  <div class="detail-wrapper">
    <div v-if="Object.keys(watLevelsData).length>0" class="changeUnit">
      <span>水位视图</span>
      <el-button :class="unit==='%'?'select':''" @click="changeUnit(unit='%')">百分比%</el-button>
      <el-button :class="unit==='m'?'select':''" @click="changeUnit(unit='m')">高度m</el-button>
      <el-button :class="unit==='m³'?'select':''" @click="changeUnit(unit='m³')">立方米m³</el-button>
      <span>警戒线</span>
      <span>{{ cordon+unit }}</span>
    </div>
    <div class="chart-wrapper">
      <GaugeChart
        v-if="Object.keys(hydraulicData).length>0"
        id="watPress"
        height="100%"
        width="100%"
        :chart-data="hydraulicData"
      />
      <LiquidfillChart v-else id="watLevel" height="100%" width="100%" :chart-data="watLevelsData" />
    </div>
    <div class="chart-wrapper">
      <LineChart
        v-if="Object.keys(lineChartData).length>0"
        id="watWeek"
        height="100%"
        width="100%"
        :chart-data="lineChartData"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
import GaugeChart from './gaugeChart'
import LiquidfillChart from '../Charts/liquidfillChart'
import LineChart from '../Charts/lineChart'
import { getHydraulic, getWaterLevel } from '@/api/water'
export default {
  name: 'DevInfo',
  components: {
    GaugeChart,
    LiquidfillChart,
    LineChart
  },
  props: {
    devData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogTreeVisible: false,
      cordon: 0,
      unit: '%',
      waterData: {},
      hydraulicData: {},
      watLevelsData: {},
      lineChartData: {},
      lineChartOption: Object.freeze({
        unit: '',
        color: '#28BBAB',
        grid: {
          left: '40',
          right: '40',
          bottom: '10',
          containLabel: true
        },
        dataList: [],
        yAxis: {
          axisLine: true
        },
        xAxisData: []
      })
    }
  },
  created() {
    this.getWaterData()
  },
  methods: {
    changeUnit(unit) {
      this.unit = unit
      this.formatChartData(this.waterData)
    },
    // 格式化数据位水位图表格式
    formatChartData(data) {
      var value = ''
      let cordon = 0
      switch (this.unit) {
        case '%':
          value = data.upDataPercent
          cordon = data.minAlertPercent
          break
        case 'm':
          value = data.upDataValue
          cordon = data.minAlertValue
          break
        case 'm³':
          value = data.upDataVolume
          cordon = data.minAlertVolume
      }
      this.cordon = cordon
      this.watLevelsData = {
        waterLevel: data.upDataPercent / 100,
        value,
        unit: this.unit
      }
    },
    getWaterData() {
      if (
        this.devData.sensorType === '001' ||
        this.devData.sensorType === '002'
      ) {
        getHydraulic({
          devId: this.devData.devid
        }).then(res => {
          if (res.data) {
            this.hydraulicData = Object.assign({}, res.data, {
              value: res.data.dataList[res.data.dataList.length - 1]
            })
            this.lineChartData = Object.assign({}, this.lineChartOption, {
              unit: res.data.ut || 'kpa',
              dataList: [
                {
                  name: '水压',
                  data: res.data.dataList,
                  style: {
                    color: '#28BBAB' // 折线图颜色
                  }
                }
              ],
              xAxis: {
                lineColor: '#293D5A',
                textColor: '#97C1FF'
              },
              yAxis: {
                axisLine: true,
                lineColor: '#293D5A',
                textColor: '#97C1FF'
              },
              xAxisData: res.data.timeList.map(item => {
                return item.replace(' ', '\n')
              })
            })
          }
        })
      } else {
        getWaterLevel({
          devId: this.devData.devid
        }).then(res => {
          if (res.data) {
            this.waterData = res.data
            this.formatChartData(this.waterData)
            this.lineChartData = Object.assign({}, this.lineChartOption, {
              unit: 'm',
              dataList: [
                {
                  name: '水位',
                  data: res.data.dataList,
                  style: {
                    color: '#28BBAB' // 折线图颜色
                  }
                }
              ],
              xAxis: {
                lineColor: '#293D5A',
                textColor: '#97C1FF'
              },
              yAxis: {
                axisLine: true,
                lineColor: '#293D5A',
                textColor: '#97C1FF'
              },
              xAxisData: res.data.timeList.map(item => {
                return item.replace(' ', '\n')
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .changeUnit {
    position: absolute;
    right: 20px;
    top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    span {
      margin-bottom: 5px;
      text-align: center;
      color: #97c1ff;
    }
    .el-button {
      width: 102px;
      display: inline-block;
      margin: 0 0 5px 0;
      background-color: #1b2474;
      color: #fff;
      border: none;
      &.select {
        color: #fff;
        background-color: #2130b3;
      }
    }
  }
  .chart-wrapper {
    flex: 1;
  }
}
</style>

