<template>
  <div class="project-main alarmRecord">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableData"
        :border="false"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <el-tooltip content="删除" placement="top">
              <el-button
                icon="el-icon-delete"
                type="danger"
                circle
                @click.stop="handleDelete(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="_handleAlarmRecordList"
      />
    </div>
    <!-- 列表框 -->
  </div>
</template>

<script>
import {
  handleGetDeviceType,
  handleAlarmRecordList,
  handleAlarmRecordDelete
} from '@/api/project'

import '../style/index.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  // 值守报警记录
  name: 'AlarmRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      listQuery: {
        officeName: '',
        addr: '',
        alertDate: '',
        cat: '',
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '企业名称:',
            name: 'officeName',
            placeholder: '请输入企业名称'
          },
          {
            type: 'text',
            label: '报警位置:',
            name: 'addr',
            placeholder: '请输入报警位置'
          },
          {
            type: 'date',
            label: '报警时间:',
            name: 'alertDate',
            placeholder: '请输入报警时间',
            valueFormat: 'yyyy-MM-dd'
          },
          {
            type: 'select',
            label: '设备类型:',
            name: 'cat',
            placeholder: '请选择设备类型',
            dataList: []
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'officeName',
          label: '公司名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeAddr',
          label: '单位地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'contacts',
          label: '联系人',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeTel',
          label: '联系电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '报警位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'alertDate',
          label: '报警时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'count',
          label: '报警次数',
          align: 'left',
          width: ''
        },
        {
          prop: 'alertReason',
          label: '报警原因',
          align: 'left',
          width: ''
        },
        {
          prop: 'cat',
          label: '设备型号',
          align: 'left',
          width: '',
          formatter: row => {
            switch (row.cat) {
              case 0:
                return '智慧用电设备'
              case 1:
                return '智慧用水设备'
              case 2:
                return '烟感设备'
              case 3:
                return '燃气检测设备"'
              case 4:
                return '信息传输装置'
              case 5:
                return '视频监控设备'
              case 6:
                return '重点部位监测报警'
              default:
                break
            }
          }
        },
        {
          prop: 'sensorCatName',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'handleName',
          label: '处理人',
          align: 'left',
          width: ''
        },
        {
          prop: 'handleResult',
          label: '处理结果',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  created() {
    this._handleGetDeviceType()
    this._handleAlarmRecordList()
  },
  methods: {
    // 获取设备类型
    _handleGetDeviceType() {
      handleGetDeviceType().then(res => {
        if (res.data) {
          this.searchFormOption.config[3].dataList = res.data
        }
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleAlarmRecordList()
    },
    // 获取列表
    _handleAlarmRecordList() {
      handleAlarmRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 删除数据
    deleteData(data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      handleAlarmRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleAlarmRecordList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
