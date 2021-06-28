<template>
  <div class="project-main reportPush">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
    </div>
    <!-- 条件框 -->
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
          <template slot-scope="{row}">
            <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="_handleReportPushList"
      />
    </div>
    <!-- 列表框 -->
  </div>
</template>

<script>
import {
  handleReportPushList,
  handleReportPushSave,
  handleReportPushInfo,
  handleReportPushUpdate,
  handleReportPushDelete
} from '@/api/project'

import '../style/index.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  // 周报月报推送
  name: 'ReportPush',
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
        name: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '企业名称:',
            name: 'name',
            placeholder: '请输入企业名称'
          },
          {
            type: 'date',
            label: '发生时间:',
            name: 'trainTime',
            placeholder: '请输入发生时间',
            valueFormat: 'yyyy-MM-dd'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: '公司名称',
          label: '制度类型',
          align: 'left',
          width: ''
        },
        {
          prop: '单位地址',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '邮箱地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '联系人',
          align: 'left',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '发生日期',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  created() {
    this._handleReportPushList()
  },
  methods: {
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleReportPushList()
    },
    // 获取列表
    _handleReportPushList() {
      handleReportPushList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        handleReportPushInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.fileList = res.data.fireRule.files.map(item => {
                return { ...item, name: item.fileName }
              })
              resolve(res.data.fireRule)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData(data) {
      const formData = Object.assign({}, data, {
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleReportPushSave(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增周报月报推送成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增周报月报推送失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData(data) {
      const formData = Object.assign({}, data, {
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleReportPushUpdate(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改周报月报推送成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改周报月报推送失败',
            type: 'error'
          })
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
      handleReportPushDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getFireRuleList()
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
