<template>
  <div class="report-main">
    <div class="report-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
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
        <el-table-column label="报警数量" align="center" class-name="small-padding fixed-width">
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
        <el-table-column label="报警数量" align="center" class-name="small-padding fixed-width">
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
      flag="police"
      url="device/api/formAnalyse/fixedFireView"
    />
  </div>
</template>

<script type="text/javascript">
import { handleFixedFireTrendData } from '@/api/bigdata'

import '../style/index.scss'
import SearchForm from '@/components/searchForm'
import LineChart from '@/components/Charts/lineChart'
import BaseTable from '@/components/baseTable'
import BigDataDetail from '@/components/BigDataDetail'

export default {
  // 固定消防设施报警分析
  name: 'FixedFireTrend',
  components: {
    SearchForm,
    LineChart,
    BaseTable,
    BigDataDetail
  },
  data() {
    return {
      isResetFlag: true,
      listLoading: true,
      chartData: null,
      listQuery: {
        eventType: '',
        startDate: '',
        endDate: ''
      },
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '报警类型：',
            name: 'eventType',
            placeholder: '请选择报警类型',
            dataList: [
              {
                value: 0,
                label: '全部'
              },
              {
                value: 1,
                label: '火警'
              },
              {
                value: 2,
                label: '故障'
              },
              {
                value: 3,
                label: '其他'
              }
            ]
          },
          {
            type: 'daterange',
            label: '报警时间:',
            name: 'date',
            placeholder: '请选择报警时间',
            valueFormat: 'yyyy-MM-dd'
          }
        ]
      },
      tableConfig: [
        {
          prop: 'name',
          label: '时间',
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
          right: '3%',
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
    this._handleFixedFireTrendData()
  },
  methods: {
    // 查询函数
    handleFilter(data) {
      this.listQuery.eventType = data.eventType
      this.listQuery.startDate = data.date[0]
      this.listQuery.endDate = data.date[1]
      this._handleFixedFireTrendData()
    },
    // 列表
    _handleFixedFireTrendData() {
      this.listLoading = true
      handleFixedFireTrendData(this.listQuery).then(res => {
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
        time: data.time,
        fmat: data.fmat,
        eventType: this.listQuery.eventType
      }
      this.$refs.BigDataDetail.handleShow()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
