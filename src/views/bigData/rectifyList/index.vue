<template>
  <div class="rectify-box">
    <div class="report-main">
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" @dateChange="dateChange" />
      </div>
      <div class="report-chart">
        <LineChart
          v-if="chartData"
          id="chartData"
          ref="chart"
          width="100%"
          height="100%"
          :chart-data="lineChartData"
          @handleCilckgetZr="handleCilckgetZr"
          @handleLegendSelectChanged="handleLegendSelectChanged"
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
          :table-data="tableData"
          :border="false"
          max-height="500px"
          @handlerCellClick="handlerCellClick"
        />
      </div>
    </div>
    <el-dialog v-if="isShowComp" class="bigDataDetail-dialog dark" title="隐患整改进度详情" v-model:visible="isShowComp" width="1500px">
      <rectify-detail ref="rectifyDetail" :detail="detail" :query="listQuery" />
      <div name="footer" class="dialog-footer">
        <el-button @click="isShowComp = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import '@/views/bigData/integratedReport/style/index.scss'
import SearchForm from '@/components/searchForm'
import LineChart from '@/components/Charts/lineChart'
import RectifyDetail from './rectifyDetail'
import BaseTable from '@/components/baseTable'
import { rectifyList } from '@/api/chk'
import { deepClone } from '@/utils'

export default {
  name: 'IndustryDirectors',
  components: {
    SearchForm,
    LineChart,
    BaseTable,
    RectifyDetail
  },
  data () {
    return {
      listLoading: false,
      isShowComp: false,
      detail: null,
      listQuery: {
        type: 1,
        startTime: '',
        endTime: ''
      },
      chartData: {
        xAxisData: [],
        yAxisData: {
          newNum: [],
          processNum: [],
          auditingNum: [],
          doneNum: []
        }
      },
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '汇总口径:',
            name: 'type',
            placeholder: '请选择',
            defaultValue: 1,
            dataList: [
              {
                value: 0,
                label: '季度'
              },
              {
                value: 1,
                label: '月'
              },
              {
                value: 2,
                label: '天'
              }
            ]
          },
          {
            type: 'date',
            label: '开始日期:',
            name: 'startTime',
            placeholder: '请选择'
          },
          {
            type: 'date',
            label: '结束日期:',
            name: 'endTime',
            placeholder: '请选择',
            pickerOptions: {}
          }
        ]
      },
      tableConfig: [
        // {
        //   prop: 'danger',
        //   label: '隐患状态',
        //   align: 'center',
        //   width: ''
        // },
        // {
        //   prop: '2021年01月',
        //   label: '2021年01月',
        //   align: 'center',
        //   width: ''
        // },
        // {
        //   prop: '2021年02月',
        //   label: '2021年02月',
        //   align: 'center',
        //   width: ''
        // },
        // {
        //   prop: '2021年03月',
        //   label: '2021年03月',
        //   align: 'center',
        //   width: ''
        // }
        {
          prop: 'showDate',
          label: '月份',
          align: 'left',
          width: ''
        },
        {
          prop: 'newNum',
          label: '未整改',
          align: 'left',
          width: ''
        },
        {
          prop: 'processNum',
          label: '整改中',
          align: 'left',
          width: ''
        },
        {
          prop: 'auditingNum',
          label: '待审核',
          align: 'left',
          width: ''
        },
        {
          prop: 'doneNum',
          label: '已审核',
          align: 'left',
          width: ''
        }
      ],
      tableDataOrigin: [],
      tableData: [
        // {
        //   danger: '未整改',
        //   '2021年01月': 10,
        //   '2021年02月': 12,
        //   '2021年03月': 0
        // },
        // {
        //   danger: '整改中',
        //   '2021年01月': 1,
        //   '2021年02月': 19,
        //   '2021年03月': 10
        // },
        // {
        //   danger: '待审核',
        //   '2021年01月': 12,
        //   '2021年02月': 1,
        //   '2021年03月': 3
        // },
        // {
        //   danger: '已审核',
        //   '2021年01月': 0,
        //   '2021年02月': 23,
        //   '2021年03月': 8
        // }
      ]
    }
  },
  computed: {
    lineChartData () {
      const chartData = {
        unit: '',
        color: '#28BBAB',
        legend: true,
        legendPosition: {
          left: 'center',
          bottom: 0
        },
        legendNum: 'false',
        grid: {
          left: '2%',
          right: '2%',
          top: '5%',
          bottom: '10%',
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
          name: '未整改',
          data: this.chartData.yAxisData.newNum,
          smooth: 'false',
          style: {
            color: '#E63F00'
          }
        }, {
          name: '整改中',
          data: this.chartData.yAxisData.processNum,
          smooth: 'false',
          style: {
            color: '#FF8800'
          }
        }, {
          name: '待审核',
          data: this.chartData.yAxisData.auditingNum,
          smooth: 'false',
          style: {
            color: '#0066FF'
          }
        }, {
          name: '已存档',
          data: this.chartData.yAxisData.doneNum,
          smooth: 'false',
          style: {
            color: '#00FF00' // 折线图颜色
          }
        }]
      }
      return chartData
    }
  },
  created () {
    this._rectifyList()
  },
  methods: {
    _rectifyList () {
      this.listLoading = true
      rectifyList(this.listQuery).then(res => {
        this.chartData = {
          xAxisData: [],
          yAxisData: {
            newNum: [],
            processNum: [],
            auditingNum: [],
            doneNum: []
          }
        }
        this.tableDataOrigin = deepClone(res.data.page.list)
        this.tableData = deepClone(res.data.page.list)
        this.total = res.data.page.totalCount
        res.data.page.list.map((ele, index) => {
          this.chartData.xAxisData.push(ele.showDate)
          this.chartData.yAxisData.newNum.push(ele.newNum)
          this.chartData.yAxisData.processNum.push(ele.processNum)
          this.chartData.yAxisData.auditingNum.push(ele.auditingNum)
          this.chartData.yAxisData.doneNum.push(ele.doneNum)
          // this.tableConfig.push({
          //   prop: `date${index + 1}`,
          //   label: ele.showDate,
          //   align: 'center',
          //   width: ''
          // })
        })
        this.listLoading = false
      })
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._rectifyList()
    },
    dateChange (params) {
      this.searchFormOption.config.map(ele => {
        if (ele.name === 'endTime') {
          ele.pickerOptions = {
            disabledDate: time => {
              if (params.startTime) {
                return time.getTime() < new Date(params.startTime)
              }
            }
          }
        }
      })
    },
    handlerCellClick (row, column, cell, event) {
      this.detail = {
        chkDate: row.showDate,
        type: this.listQuery.type,
        status: column.property
      }
      this.isShowComp = true
    },
    handleCilckgetZr (params) {
      const month = params.op.xAxis[0].data[params.index]
      this.detail = {
        chkDate: month,
        type: this.listQuery.type
      }
      this.isShowComp = true
    },
    handleLegendSelectChanged (obj) {
      console.log('点击图例触发的事件', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    height: 100%;
  }
  .report-chart {
    margin-top: 20px;
  }
  .report-table {
    margin-top: 35px;
  }
  .rectify-box {
    height: 100%;
  }
</style>
