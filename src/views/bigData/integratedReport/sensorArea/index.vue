<template>
  <div class="report-main">
    <div class="report-chart">
      <BarChart
        v-if="chartData"
        id="chartData"
        ref="chart"
        width="100%"
        height="100%"
        :chart-data="barChartData"
        @click="handleBarClick"
      />
    </div>
    <div
      v-loading="listLoading"
      class="report-table"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <BaseTable
        :table-height="436"
        :table-config="tableConfig"
        :table-data="tableData"
        :border="false"
      >
        <el-table-column label="重点部位巡检单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'poi')">{{ row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电气火灾联网单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'sae')">{{ row.electric }}</span>
          </template>
        </el-table-column>
        <el-table-column label="远程监控联网单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'sav')">{{ row.video }}</span>
          </template>
        </el-table-column>
        <el-table-column label="建筑消防用水设备单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'saw')">{{ row.water }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可视化单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'cam')">{{ row.cam }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可燃气体联网监测单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'gas')">{{ row.gas }}</span>
          </template>
        </el-table-column>
        <el-table-column label="独立烟感监测单位" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'smo')">{{ row.smoke }}</span>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <BigDataDetail
      ref="BigDataDetail"
      :is-reset-flag="isResetFlag"
      :view-obj="viewObj"
      url="device/api/formAnalyse/officeView"
    />
  </div>
</template>

<script type="text/javascript">
import { handleSensorAreaData } from '@/api/bigdata'

import '../style/index.scss'
import BarChart from '@/components/Charts/barChart'
import BaseTable from '@/components/baseTable'
import BigDataDetail from '@/components/BigDataDetail'

export default {
  // 按固定设施统计
  name: 'SensorArea',
  components: {
    BarChart,
    BaseTable,
    BigDataDetail
  },
  data() {
    return {
      isResetFlag: true,
      listLoading: true,
      chartData: null,
      tableConfig: [
        {
          prop: 'name',
          label: '行政区划',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      viewObj: {}
    }
  },
  computed: {
    barChartData() {
      const chartData = {
        title: '',
        yAxis: {
          color: '#97c1ff',
          unit: ''
        },
        xAxis: {
          color: '#97c1ff',
          data: this.chartData.xAxisData
        },
        grid: {
          left: '7px',
          top: '40px',
          right: '7px',
          bottom: '12px',
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
        serieList: [
          {
            name: '重点部位巡检单位',
            type: 'bar',
            id: this.chartData.ids[0],
            data: this.handleInitList(
              this.chartData.pointsAxisData,
              this.chartData.ids,
              'poi'
            ),
            itemStyle: {
              color: '#00b4b1'
            },
            barWidth: '10'
          },
          {
            name: '电气火灾联网单位',
            type: 'bar',
            id: this.chartData.ids[1],
            data: this.handleInitList(
              this.chartData.electricAxisData,
              this.chartData.ids,
              'sae'
            ),
            itemStyle: {
              color: '#0083b4'
            },
            barWidth: '10'
          },
          {
            name: '远程监控联网单位',
            type: 'bar',
            id: this.chartData.ids[2],
            data: this.handleInitList(
              this.chartData.videoAxisData,
              this.chartData.ids,
              'sav'
            ),
            itemStyle: {
              color: '#03a2de'
            },
            barWidth: '10'
          },
          {
            name: '建筑消防用水设备单位',
            type: 'bar',
            id: this.chartData.ids[3],
            data: this.handleInitList(
              this.chartData.waterAxisData,
              this.chartData.ids,
              'saw'
            ),
            itemStyle: {
              color: '#317cee'
            },
            barWidth: '10'
          },
          {
            name: '可视化单位',
            type: 'bar',
            id: this.chartData.ids[4],
            data: this.handleInitList(
              this.chartData.camAxisData,
              this.chartData.ids,
              'cam'
            ),
            itemStyle: {
              color: '#3147ee'
            },
            barWidth: '10'
          },
          {
            name: '可燃气体联网监测单位',
            type: 'bar',
            id: this.chartData.ids[5],
            data: this.handleInitList(
              this.chartData.gasAxisData,
              this.chartData.ids,
              'gas'
            ),
            itemStyle: {
              color: '#6064ff'
            },
            barWidth: '10'
          },
          {
            name: '独立烟感监测单位',
            type: 'bar',
            id: this.chartData.ids[6],
            data: this.handleInitList(
              this.chartData.smokeAxisData,
              this.chartData.ids,
              'smo'
            ),
            itemStyle: {
              color: '#3520ff'
            },
            barWidth: '10'
          }
        ],
        dataZoom: [
          {
            start: 0, // 默认为0
            end: 100 - 1500 / 31, // 默认为100
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
            end: 100 - 1500 / 31 // 默认为100
          }
        ]
      }
      return chartData
    }
  },
  created() {
    this._handleSensorAreaData()
  },
  methods: {
    // 列表
    _handleSensorAreaData() {
      this.listLoading = true
      handleSensorAreaData().then(res => {
        if (res.data) {
          this.chartData = res.data.echarts
          this.tableData = res.data.data
        }
        this.listLoading = false
      })
    },
    handleInitList(list, officeIds, name) {
      const array = []
      list.forEach((item, index) => {
        array.push({
          name,
          value: item,
          officeId: officeIds[index]
        })
      })
      return array
    },
    handleRowDataClick(data, type) {
      this.isResetFlag = !this.isResetFlag
      this.viewObj = {
        id: data.id,
        type
      }
      this.$refs.BigDataDetail.handleShow()
    },
    handleBarClick(data) {
      this.isResetFlag = !this.isResetFlag
      this.viewObj = {
        id: data.data.officeId,
        type: data.data.name
      }
      this.$refs.BigDataDetail.handleShow()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
