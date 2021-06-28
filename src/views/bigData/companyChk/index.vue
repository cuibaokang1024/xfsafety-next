<template>
  <div class="inspect-main">
    <div class="search-box">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" @dateChange="dateChange" />
    </div>
    <div class="filter-box">
      <el-button
        class="record"
        :loading="exportLoading"
        type="primary"
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
      >导出</el-button>
    </div>
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :table-height="'100%'"
        :border="false"
        :sort="true"
        @sortChange="sortChange"
      />
    </div>
    <div class="pagination-box">
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="_handlerCheckList"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import '@/components/baseForm/style/index.scss'
import '@/views/systemSetup/styles/index.scss'
import formAction from '@/mixins/form.js'
import Pagination from '@/components/Pagination'
import { checkList } from '@/api/chk'

export default {
  name: 'IndustryDirectors',
  components: {
    SearchForm,
    BaseTable,
    Pagination
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      exportLoading: false,
      total: 0,
      listQuery: {
        name: '',
        page: 1,
        limit: 10,
        type: 1,
        startTime: '',
        endTime: ''
      },
      searchFormOption: {
        config: [
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
          },
          {
            type: 'select',
            label: '汇总口径:',
            name: 'type',
            placeholder: '请选择',
            defaultValue: 0,
            dataList: [
              {
                value: 1,
                label: '月'
              },
              {
                value: 2,
                label: '天'
              },
              {
                value: 3,
                label: '时'
              }
            ]
          },
          {
            type: 'text',
            label: '巡查人:',
            name: 'name',
            placeholder: '请输入',
            maxlength: 64
          }
        ]
      },
      tableData: [],
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'name',
          label: '巡查人',
          align: 'left',
          width: '',
          sortable: 'custom'
        },
        {
          prop: 'showDate',
          label: '月/天/时',
          align: 'left',
          width: '',
          sortable: 'custom'
        },
        {
          prop: 'chkNum',
          label: '计划数',
          align: 'left',
          width: ''
        },
        {
          prop: 'actualNum',
          label: '巡查实际数',
          align: 'left',
          width: ''
        },
        {
          prop: 'rate',
          label: '计划完成率',
          align: 'left',
          width: '',
          sortable: 'custom'
        }
      ]
    }
  },
  created() {
    this._handlerCheckList()
  },
  methods: {
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerCheckList()
    },
    _handlerCheckList() {
      this.listLoading = true
      checkList(this.listQuery).then((res) => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    dateChange(params) {
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
    sortChange(column) {
      let order = 'asc'
      if (!column.order) {
        this.listQuery = Object.assign({}, this.listQuery, {
          orderField: '',
          order: ''
        })
      } else {
        if (column.order === 'descending') {
          order = 'desc'
        } else if (column.order === 'ascending') {
          order = 'asc'
        }
        this.listQuery = Object.assign({}, this.listQuery, {
          orderField: column.prop,
          order: order
        })
      }
      this._handlerCheckList()
    },
    async handleExport() {
      this.exportLoading = true
      const tHeader = this.tableConfig.slice(1).map(item => {
        if (item.label) {
          return item.label
        }
      })
      const filterVal = this.tableConfig.map(item => {
        if (item.prop) {
          return item.prop
        }
      })
      const data = (await this.formatJson(filterVal.slice(1))) || []
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '单位履职统计表'
        })
        this.exportLoading = false
      })
    },
    formatJson(filterVal) {
      return new Promise((resolve, reject) => {
        let data = []
        const query = this.$refs.searchForm.getSearchQuery()
        const listQuery = { ...this.listQuery, ...query, page: -1, limit: 0 }
        checkList(listQuery).then(res => {
          if (res.data) {
            data = res.data.page.list
          }
          resolve(
            data.map(v =>
              filterVal.map(j => {
                return v[j]
              })
            )
          )
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    height: 100%;
  }
</style>
