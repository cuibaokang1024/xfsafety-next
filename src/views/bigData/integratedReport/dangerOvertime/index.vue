<template>
  <div class="report-main">
    <div class="report-box">
      <el-select v-model="listQuery.day" class="report-select" placeholder="请选择" @change="handleSelectChange">
        <el-option
          v-for="item in noCheckDayList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
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
        :table-config="tableConfig"
        :table-data="tableLeftData"
        :border="false"
      >
        <el-table-column label="单位数" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'do')">{{ row.value }}</span>
          </template>
        </el-table-column>
      </BaseTable>
      <BaseTable
        :table-height="396"
        :table-config="tableConfig"
        :table-data="tableRightData"
        :border="false"
      >
        <el-table-column label="单位数" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'do')">{{ row.value }}</span>
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
import { handleDangerOvertimeData } from '@/api/bigdata'

import '../style/index.scss'
import BarChart from '@/components/Charts/barChart'
import BaseTable from '@/components/baseTable'
import BigDataDetail from '@/components/BigDataDetail'

export default {
  // 超时未检查单位分析
  name: 'DangerOvertime',
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
      listQuery: {
        day: '1'
      },
      noCheckDayList: [
        {
          value: '1',
          label: '当天'
        },
        {
          value: '2',
          label: '两天内'
        },
        {
          value: '3',
          label: '三天内'
        },
        {
          value: '7',
          label: '七天内'
        },
        {
          value: '15',
          label: '十五天'
        },
        {
          value: '30',
          label: '三十天'
        }
      ],
      tableConfig: [
        {
          prop: 'name',
          label: '行政区划',
          align: 'center',
          width: ''
        }
      ],
      tableData: [],
      tableLeftData: [],
      tableRightData: [],
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
            name: '单位数',
            type: 'bar',
            id: this.chartData.ids[0],
            data: this.handleInitList(
              this.chartData.yAxisData,
              this.chartData.ids,
              'do'
            ),
            itemStyle: {
              color: '#00b4b1'
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
            end: 100 // 默认为100
          }
        ]
      }
      return chartData
    }
  },
  created() {
    this._handleDangerOvertimeData()
  },
  methods: {
    // 查询函数
    handleFilter(data) {
      this.listQuery.day = data.day
      this._handleDangerOvertimeData()
    },
    // 列表
    _handleDangerOvertimeData() {
      this.listLoading = true
      handleDangerOvertimeData(this.listQuery).then(res => {
        if (res.data) {
          this.chartData = res.data.echarts
          this.tableData = res.data.data
          this.handleArrayChunk(this.tableData)
        }
        this.listLoading = false
      })
    },
    // 分割数组
    handleArrayChunk(array) {
      this.tableLeftData = array.filter((item, index) => index % 2 === 0)
      this.tableRightData = array.filter((item, index) => index % 2 !== 0)
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
        type,
        day: this.listQuery.day
      }
      this.$refs.BigDataDetail.handleShow()
    },
    handleBarClick(data) {
      this.isResetFlag = !this.isResetFlag
      this.viewObj = {
        id: data.data.officeId,
        type: data.data.name,
        day: this.listQuery.day
      }
      this.$refs.BigDataDetail.handleShow()
    },
    handleSelectChange(val) {
      this._handleDangerOvertimeData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
