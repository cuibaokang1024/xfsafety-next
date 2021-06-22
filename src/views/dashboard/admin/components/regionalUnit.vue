<template>
  <el-container
    v-domResize="domResize"
    class="home-box"
    :class="homeType==='emergency'?'emergency':''"
  >
    <el-header height="26px">
      <span class="block" />
      <span class="text">按行政区划统计单位和建筑</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <div class="select-wrapper">
        <el-select v-model="type" placeholder="请选择" @change="_getAreaList">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="chart">
        <BarChart
          v-if="chartData"
          id="unitAndBuilding"
          ref="chart"
          height="100%"
          width="100%"
          :chart-data="chartData"
          @click="barClick"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BarChart from '@/components/Charts/barChart'
import domResize from '@/directive/resize/index.js'
import {
  getAreaList,
  getAreaLeveloffice,
  getAreaBuildingOffice
} from '@/api/home'
import { getDirectAreaCount } from '@/api/emergencyHome'
import { deepClone } from '@/utils'
import './style/index.scss'
export default {
  components: {
    BarChart
  },
  directives: { domResize },
  props: {
    navigatList: {
      type: Array,
      default: () => []
    },
    homeType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      type: 1,
      navigatList_copy: [],
      typeOptions: [
        {
          label: '单位分级',
          value: 1
        },
        {
          label: '建筑分级',
          value: 2
        }
      ],
      chartData: null,
      chartOption: Object.freeze({
        title: '',
        yAxis: {
          color: '#97c1ff',
          unit: '家'
        },
        xAxis: {
          color: '#97c1ff',
          data: []
        },
        grid: {
          left: '7px',
          top: '40px',
          right: '7px',
          bottom: '10px',
          containLabel: true
        },
        legend: {
          textStyle: {
            color: '#97c1ff',
            fontSize: 12
          },
          position: {
            left: 'center',
            top: '10'
          },
          itemWidth: 13,
          itemHeight: 6
        },
        serieList: [],
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100 - 1500 / 32, // 默认为100
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 8, // 组件高度
            left: 0, // 左边的距离
            right: 0, // 右边的距离
            bottom: 0, // 右边的距离
            borderColor: '#000',
            fillerColor: '#269cdb',
            borderRadius: 5,
            backgroundColor: '#33384b', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            realtime: true, // 是否实时更新
            filterMode: 'filter'
          },
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, // 默认为1
            end: 100 // 默认为100
          }
        ]
      })
    }
  },
  created() {
    this._getAreaList()
  },
  methods: {
    domResize() {
      if (this.$refs.chart) {
        this.$refs.chart.resize()
      }
    },
    barClick(data) {
      const seriesName = data.seriesName
      this.navigatList_copy = []
      this.navigatList_copy.push(
        {
          level: 1,
          name: '按行政区划统计单位和建筑'
        },
        {
          level: 2,
          name: data.data.name
        },
        {
          level: 3,
          name: seriesName
        }
      )
      this.$emit('update:navigatList', this.navigatList_copy)
      const query = {
        areaId: data.data.areaId,
        type: data.seriesId
      }

      let officeList = []
      if (this.type === 1) {
        getAreaLeveloffice(query).then(res => {
          if (res.data) {
            officeList = res.data.list
            const data = {
              officeList,
              title: seriesName
            }
            this.$emit('areaFilterList', data)
          }
        })
      } else {
        getAreaBuildingOffice(query).then(res => {
          if (res.data) {
            officeList = res.data.list
            const data = {
              officeList,
              title: seriesName
            }
            this.$emit('areaFilterList', data)
          }
        })
      }
    },
    formatChartData(list) {
      const chartData = deepClone(this.chartOption)
      const xAxisData = []
      const highRiskList = []
      const importantList = []
      const normalList = []
      const firstLevel = []
      const superLevel = []
      const secondLevel = []
      list.forEach(item => {
        xAxisData.push(item.area_name)
        highRiskList.push({
          value: item.high_risk,
          areaId: item.area_id,
          name: item.area_name
        })
        importantList.push({
          value: item.important_count,
          areaId: item.area_id,
          name: item.area_name
        })
        normalList.push({
          value: item.normal_count,
          areaId: item.area_id,
          name: item.area_name
        })
        firstLevel.push({
          value: item.firstLevel,
          areaId: item.area_id,
          name: item.area_name
        })
        superLevel.push({
          value: item.superLevel,
          areaId: item.area_id,
          name: item.area_name
        })
        secondLevel.push({
          value: item.secondLevel,
          areaId: item.area_id,
          name: item.area_name
        })
      })
      chartData.xAxis.data = xAxisData
      chartData.serieList = [
        {
          name: this.type === 1 ? '火灾高危单位' : '超高层',
          type: 'bar',
          id: this.type === 1 ? 'highRisk' : 'superLevel',
          data: this.type === 1 ? highRiskList : superLevel,
          itemStyle: {
            color: '#eb4949'
          },
          barWidth: '9'
        },
        {
          name: this.type === 1 ? '重点单位' : '一类高层',
          type: 'bar',
          id: this.type === 1 ? 'importantCount' : 'firstLevel',
          data: this.type === 1 ? importantList : firstLevel,
          itemStyle: {
            color: '#ff7800'
          },
          barWidth: '9'
        },
        {
          name: this.type === 1 ? '一般单位' : '二类高层',
          type: 'bar',
          id: this.type === 1 ? 'normalCount' : 'secondLevel',
          data: this.type === 1 ? normalList : secondLevel,
          itemStyle: {
            color: '#03dd79'
          },
          barWidth: '9'
        }
      ]
      return chartData
    },
    _getAreaList() {
      if (this.homeType === 'emergency') {
        getDirectAreaCount({
          type: this.type
        }).then(res => {
          if (res.data && res.data.officeAreaList) {
            this.chartData = this.formatChartData(res.data.officeAreaList)
          }
        })
      } else {
        getAreaList({
          type: this.type
        }).then(res => {
          if (res.data && res.data.officeAreaList) {
            this.chartData = this.formatChartData(res.data.officeAreaList)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  &.emergency {
    padding: 10px 15px;
    background: rgba(0, 0, 0, 0.5);

    .el-main {
      background: transparent;
      border: none;
    }
  }

  .el-main {
    position: relative;
    padding: 11px 7px 0 7px;
    border: 1px solid #0180ff;
    background-color: #080d4f;
    overflow: hidden;

    .select-wrapper {
      display: flex;
      justify-content: flex-end;
      position: relative;
      top: -2px;
      left: 75%;
      width: 120px;
      z-index: 1;
    }

    .chart {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
}
</style>
