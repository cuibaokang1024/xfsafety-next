<template>
  <section class="main-wrapper">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm
        ref="searchForm"
        :form-option="searchFormOption"
        @search="handleFilter"
      />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button
        v-if="isAgency !== 1"
        class="add"
        @click="handleCreate('设备注册')"
      >添加</el-button>
      <el-button
        v-if="isAgency !== 1"
        class="refresh"
        @click="handleDownloadFile"
      >模板下载</el-button>
      <div v-if="isAgency !== 1">
        <el-button
          v-show="isUpload"
          style="margin: 0 10px"
          class="record"
          @click="handleImportShow"
        >导入</el-button>
        <el-upload
          v-show="!isUpload"
          ref="iUpload"
          action="Fake Action"
          accept=".xls, xlsx"
          :multiple="false"
          :limit="1"
          :http-request="handleHttpRequest"
        >
          <el-button
            class="record"
            style="margin: 0 10px; font-size: 14px"
            size="small"
            type="primary"
          >导入</el-button>
          <UnitSelect
            ref="unitSelect"
            :is-agent="true"
            :is-show="false"
            v-model:value="listQuery.officeId"
          />
        </el-upload>
      </div>
      <el-button
        class="weichat"
        :loading="exportLoading"
        type="primary"
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
      >导出</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-height="'100%'"
        :table-data="list"
        :table-config="tableConfig"
        :border="false"
        :sort="true"
        @sortChange="sortChange"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{ row }">
            <el-button
              v-if="isAgency !== 1"
              size="mini"
              type="success"
              round
              @click.stop="handleEdit(row, '修改设备注册')"
            >修改</el-button>
            <el-button
              v-if="isAgency !== 1"
              size="mini"
              type="danger"
              round
              @click.stop="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="initDevRegisterList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :form-loading="formLoading"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
        @formHide="formHide"
      />
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import {
  getDevRegisterList,
  getDevRegisterInfo,
  getDeviceType,
  deleteDevRegister,
  updateDevRegister,
  saveDevRegister,
  handleImport,
  handleDownload
} from '@/api/devRegister'
import { mapGetters } from 'vuex'

import '@/styles/list.scss'
import UnitSelect from '@/components/UnitSelect'
import download from '@/utils/fileDownload'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'

export default {
  /* 设备注册 */
  name: 'DevRegister',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UnitSelect
  },
  mixins: [formAction],
  data () {
    var checkDevId = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]{1,50}$/
      if (!reg.test(value)) {
        callback(new Error('可输入数字和字母且最多不超过50位'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      dialogVisible: false,
      exportLoading: false,
      // 初始化列表查询参数
      listQuery: {
        page: 1,
        limit: 10,
        defaultOrderField: 'reg.update_date'
      },
      // 数据数量
      total: 0,
      // 列表数据
      list: [],
      // 列表排序字段  key为列表名 value为真实排序字段-------start
      orderObject: {
        devId: 'reg.dev_id',
        categoryName: 'reg.category',
        officeName: 'reg.office_id',
        isAdd: 'reg.is_add',
        unitName: 'o.id',
        updateDate: 'reg.update_date',
        updateByName: 'reg.update_by'
      },
      // 列表排序字段  key为列表名 value为真实排序字段-------end
      // 列表查询条件  start
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '设备ID:',
            name: 'devId',
            placeholder: '请输入设备ID',
            sortable: 'custom'
          },
          {
            type: 'select',
            label: '设备类型:',
            name: 'category',
            placeholder: '请选择设备类型',
            dataList: []
          },
          {
            type: 'text',
            label: '代理商名称:',
            name: 'officeName',
            placeholder: '请输入代理商名称'
          },
          {
            type: 'text',
            label: '单位名称:',
            name: 'unitName',
            placeholder: '请输入单位名称'
          },
          {
            type: 'select',
            label: '是否建点:',
            name: 'isAdd',
            placeholder: '请选择是否建点',
            dataList: [
              {
                label: '未建点',
                value: '0'
              },
              {
                label: '已建点',
                value: '1'
              }
            ]
          },
          {
            type: 'select',
            label: '运行状态:',
            name: 'devStatus',
            placeholder: '请选择运行状态',
            dataList: [
              {
                label: '离线',
                value: 0
              },
              {
                label: '在线',
                value: 1
              },
              {
                label: '报警',
                value: 2
              }
            ]
          }
        ]
      },
      // 列表查询条件  end
      categoryTypeList: [],
      // 列表字段-------start
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'devId',
          label: '设备ID',
          align: 'left',
          sortable: 'custom',
          width: ''
        },
        {
          prop: 'categoryName',
          label: '设备类型',
          align: 'left',
          sortable: 'custom',
          width: ''
        },
        {
          prop: 'officeName',
          label: '代理商名称',
          align: 'left',
          sortable: 'custom',
          width: ''
        },
        {
          prop: 'isAdd',
          label: '建点状态',
          align: 'left',
          sortable: 'custom',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.isAdd === 1 ? '已建点' : '未建点'
          }
        },
        {
          prop: 'devStatus',
          label: '运行状态',
          align: 'left',
          width: '',
          showOverflowTooltip: true,
          headerIcon: 'el-icon-question',
          headerTooltip: '运行状态为空的，表示该设备尚未建点',
          formatter: (row, column, cellValue, index) => {
            if (row.devStatus === 0) {
              return '离线'
            } else if (row.devStatus === 1) {
              return '在线'
            } else if (row.devStatus === 2) {
              return '报警'
            } else {
              return ''
            }
          }
        },
        {
          prop: 'unitName',
          label: '单位名称',
          align: 'left',
          sortable: 'custom',
          width: ''
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新日期',
          align: 'left',
          sortable: 'custom',
          width: ''
        },
        {
          prop: 'updateByName',
          label: '更新人',
          align: 'left',
          sortable: 'custom',
          width: ''
        }
      ],
      // 列表字段-------end
      // 表单字段-------start
      formOption: {
        config: [
          {
            label: '设备ID:',
            type: 'text',
            name: 'devId',
            placeholder: '请输入设备id',
            colspan: true
          },
          {
            label: '设备类型:',
            name: 'category',
            type: 'select',
            dataList: []
          },
          {
            label: '代理商:',
            type: 'unitSelect',
            name: 'officeId',
            isAgent: true,
            placeholder: '请选择代理商',
            treeSelectOption: {
              name: 'officeName'
            }
          },
          {
            label: '备注:',
            type: 'textarea',
            name: 'remarks',
            placeholder: '请填写备注',
            colspan: true
          }
        ],
        rules: {
          devId: [{ required: true, trigger: 'blur', message: '请输入设备Id' }, { validator: checkDevId, trigger: 'blur' }]
        }
      },
      // 表单字段-------end
      isUpload: true,
      uploadData: {
        officeId: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isAgency'])
  },
  watch: {
    'listQuery.officeId': {
      handler (newVal) {
        this.handleImportUpload()
      }
    }
  },
  created () {
    this.initDeviceType()
    this.initDevRegisterList()
  },
  methods: {
    // 获取设备类型
    initDeviceType () {
      getDeviceType().then((res) => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map((item) => {
            if (item.name === 'category') {
              return { ...item, dataList: res.data }
            } else {
              return item
            }
          })
          this.searchFormOption.config = this.searchFormOption.config.map(
            (item) => {
              if (item.name === 'category') {
                return { ...item, dataList: res.data }
              } else {
                return item
              }
            }
          )
        }
      })
    },
    sortChange (column) {
      let order = 'asc'
      if (column.order === 'descending') {
        order = 'desc'
      }
      this.listQuery = Object.assign({}, this.listQuery, {
        orderField: this.orderObject[column.prop],
        order: order
      })
      this.initDevRegisterList()
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this.initDevRegisterList()
    },
    // 获取列表
    initDevRegisterList () {
      getDevRegisterList(this.listQuery).then((res) => {
        if (res.data) {
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getDevRegisterInfo({ id: data.id }).then((res) => {
          if (res.data) {
            resolve(res.data.reg)
          }
        })
      })
    },
    renderHeader (h, { column }) {
      return h('div', [
        h('span', column.label),
        h(
          'el-tooltip',
          [
            h('i', {
              class: 'el-icon-question',
              style: 'color:#409eff;margin-left:5px;'
            })
          ],
          {
            content: '运行状态为空的，表示该设备尚未建点'
          }
        )
      ])
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      saveDevRegister(formData).then((res) => {
        if (res.msg === 'ok') {
          this.initDevRegisterList()
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增失败',
            type: 'error'
          })
        }
      })
    },
    // 编辑表单信息
    handleEdit (data, title) {
      const operationStatus = 'edit'
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (data.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          if (data.isAdd === 1) {
            this.formOption.config = this.formOption.config.map((item) => {
              if (item.name === 'remarks') {
                return item
              } else {
                return { ...item, disabled: true }
              }
            })
          }
          this.id = data[0].id
          this._getListInfo(data[0]).then((formData) => {
            this.formAction(title, operationStatus, formData)
          })
        }
      } else {
        if (data.isAdd === 1) {
          this.formOption.config = this.formOption.config.map((item) => {
            if (item.name === 'remarks') {
              return item
            } else {
              return { ...item, disabled: true }
            }
          })
        }
        this.id = data.id
        this._getListInfo(data).then((formData) => {
          this.formAction(title, operationStatus, formData)
        })
      }
    },
    // 更新数据
    updateData (data) {
      const formData = Object.assign({}, data, {
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      updateDevRegister(formData).then((res) => {
        if (res.msg === 'ok') {
          this.initDevRegisterList()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        }
      })
    },
    // 删除表单数据
    handleDelete (data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        if (data.isAdd === 1) {
          this.$message({
            type: 'warning',
            message: '系统只允许删除“未建点”状态的设备!'
          })
          return
        }
        this.$confirm('<p>您确定要删除如下设备吗？</p><p>设备ID：' + data.devId + '</p>设备类型：' + data.categoryName, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.deleteData(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 删除数据
    deleteData (data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach((item) => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      deleteDevRegister(list).then((res) => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initDevRegisterList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 文档下载
    handleDownloadFile () {
      handleDownload().then((res) => {
        if (!res) {
          this.$message.error('下载模板文件失败')
          return false
        }
        download(res.data, '设备注册模板.xls')
      })
    },
    // 导入
    handleImportShow () {
      this.$refs.unitSelect.handleShow()
      if (this.listQuery.officeId) {
        this.isUpload = false
      }
    },
    handleImportHide () {
      this.isUpload = true
    },
    handleImportUpload () {
      if (this.listQuery.officeId) {
        this.$refs.iUpload.$refs['upload-inner'].handleClick()
      }
      this.handleImportHide()
    },
    handleHttpRequest (files) {
      const officeId = this.listQuery.officeId
      const file = new FormData()
      file.append('excel', files.file)
      file.append('name', files.file.name)
      handleImport({
        officeId,
        params: file
      }).then((res) => {
        if (res.code === 200) {
          this.initDevRegisterList()
          this.listQuery.officeId = ''
          this.$refs.iUpload.clearFiles()
          this.handleImportHide()
          this.$message({
            message: 'Excel导入成功',
            type: 'success'
          })
        } else {
          this.initDevRegisterList()
          this.listQuery.officeId = ''
          this.$refs.iUpload.clearFiles()
          this.handleImportHide()
          this.$message({
            message: 'Excel导入失败',
            type: 'warning'
          })
        }
      })
    },
    async handleExport () {
      this.exportLoading = true
      const tHeader = this.tableConfig.map((item) => {
        if (item.label) {
          return item.label
        }
      })
      const filterVal = this.tableConfig.map((item) => {
        if (item.prop) {
          return item.prop
        }
      })
      const data = (await this.formatJson(filterVal.slice(1))) || []
      import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          header: tHeader.slice(1),
          data,
          filename: '设备注册列表'
        })
        this.exportLoading = false
      })
    },
    formatJson (filterVal) {
      return new Promise((resolve, reject) => {
        let data = []
        const query = this.$refs.searchForm.getSearchQuery()
        const listQuery = { ...this.listQuery, ...query, page: -1, limit: 0 }
        getDevRegisterList(listQuery).then((res) => {
          if (res.data) {
            data = res.data.page.list
          }
          resolve(
            data.map((v) =>
              filterVal.map((j) => {
                if (j === 'isAdd') {
                  return v.isAdd === 1 ? '已添加' : '未添加'
                } if (j === 'devStatus') {
                  if (v.devStatus === 0) {
                    return '离线'
                  } else if (v.devStatus === 1) {
                    return '在线'
                  } else if (v.devStatus === 2) {
                    return '报警'
                  } else {
                    return ''
                  }
                } else {
                  return v[j]
                }
              })
            )
          )
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
