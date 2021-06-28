<template>
  <div class="report-main">
    <div class="report-chart">
      <LineChart
        v-if="chartData"
        id="chartData"
        ref="chart"
        width="100%"
        height="100%"
        :chart-data="lineChartData"
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
        <el-table-column label="隐患数量" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'dt')">{{ row.value }}</span>
          </template>
        </el-table-column>
      </BaseTable>
      <BaseTable
        :table-config="tableConfig"
        :table-data="tableRightData"
        :border="false"
      >
        <el-table-column label="隐患数量" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <span class="pointer" @click="handleRowDataClick(row, 'dt')">{{ row.value }}</span>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <BigDataDetail
      ref="BigDataDetail"
      :is-reset-flag="isResetFlag"
      :view-obj="viewObj"
      flag="danger"
      url="device/api/formAnalyse/dangerView"
    />
  </div>
</template>

<script type="text/javascript">
import { handleDangerTrendData } from '@/api/bigdata'

import '../style/index.scss'
import LineChart from '@/components/Charts/lineChart'
import BaseTable from '@/components/baseTable'
import BigDataDetail from '@/components/BigDataDetail'

export default {
  // 按月统计火灾隐患
  name: 'DangerTrend',
  components: {
    LineChart,
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
          label: '月份',
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
    lineChartData() {
      const chartData = {
        unit: '',
        color: '#28BBAB',
        legend: false,
        legendPosition: {
          left: '60px'
        },
        grid: {
          left: '2%',
          right: '2%',
          top: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          lineColor: '#445478',
          textColor: '#97C1FF'
        },
        yAxis: {
          axisLine: false,
          textColor: '#97C1FF',
          lineColor: '#445478'
        },
        xAxisData: this.chartData.xAxisData,
        dataList: [{
          name: '临界值',
          data: this.chartData.yAxisData,
          style: {
            color: '#5f54c6' // 折线图颜色
          }
        }]
      }
      return chartData
    }
  },
  created() {
    this._handleDangerTrendData()
  },
  methods: {
    // 列表
    _handleDangerTrendData() {
      this.listLoading = true
      handleDangerTrendData().then(res => {
        console.log('获取echarts的结果', res.data.echarts)
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
    handleRowDataClick(data, type) {
      this.isResetFlag = !this.isResetFlag
      this.viewObj = {
        id: data.name,
        type
      }
      this.$refs.BigDataDetail.handleShow()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
