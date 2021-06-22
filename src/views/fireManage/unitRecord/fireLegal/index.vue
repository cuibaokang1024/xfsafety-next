<template>
  <section class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">添加</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="list"
        :table-config="tableConfig"
        :border="false"
        :sort="true"
        :max-height="'100%'"
        @sortChange="sortChange"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleEdit(row, '修改')"
              />
            </el-tooltip>
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
        v-show="total>0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_getLegalDocList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        :addition-flag="false"
        @createData="createData"
        @updateData="updateData"
        @formHide="formHide"
      >
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>

import {
  getLegalDocList,
  getLegaldocInfo,
  legaldocDelete,
  getDict,
  updateLegaldoc,
  saveLegaldoc
} from '@/api/office'

import '@/styles/list.scss'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
// import UploadFile from '@/components/uploadFile'

export default {
  /* 消防合法文书 */
  name: 'FireLegal',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm
    // UploadFile
  },

  data () {
    var numCheck = (rule, value, callback) => {
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
        this.deleteFileList = []
      }
      if (!this.files.length) {
        callback(new Error('请上传文件'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      listQuery: {
        docType: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '消防合法文书类型:',
            name: 'docType',
            placeholder: '请选择文书类型',
            dataList: []
          }
        ]
      },
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'fileName',
          label: '消防合法文书名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '机构名称',
          align: 'left',
          width: '',
          sortable: 'custom',
          'class-name': 'AAA'
        },
        {
          prop: 'docTypeName',
          label: '消防合法文书类型',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '消防合法文书类型:',
            name: 'docType',
            type: 'select',
            labelWidth: '140px',
            dataList: []
          },
          {
            label: '所属单位:',
            type: 'unitSelect',
            name: 'officeId',
            placeholder: '请选择所属单位',
            treeSelectOption: {
              name: 'officeName'
            }
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ],
        rules: {
          docType: [
            {
              required: true,
              message: '请选择消防合法文书类型',
              trigger: 'blur'
            }
          ],
          officeId: [
            {
              required: true,
              message: '请选择所属单位',
              trigger: 'blur'
            }
          ],
          uploadFile: [{ validator: numCheck, trigger: 'blur' }]
        }
      }
    }
  },
  created () {
    this._getDict()
    this._getLegalDocList()
  },
  methods: {
    // 排序
    sortChange (column) {
      var order = 'asc'
      if (column.order === 'descending') {
        order = 'desc'
      }
      this.listQuery = Object.assign({}, this.listQuery, {
        sidx: column.prop,
        order: order
      })
      // eslint-disable-next-line no-sequences
      this._getLegalDocList()
    },
    // 查询函数
    async handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getLegalDocList()
    },
    // 获取字典值
    _getDict () {
      getDict({
        type: 'sys_legal_doc_type'
      }).then(res => {
        if (res.data) {
          this.searchFormOption.config[0].dataList = res.data.dicts
          this.formOption.config[0].dataList = res.data.dicts
        }
      })
    },
    // 获取列表
    _getLegalDocList () {
      getLegalDocList(this.listQuery).then(res => {
        if (res.data) {
          this.list = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getLegaldocInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.fileList = res.data.legalDoc.files.map(item => {
                return { ...item }
              })
              resolve(res.data.legalDoc)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data, callback) {
      const formData = Object.assign({}, data, {
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      saveLegaldoc(formData).then(res => {
        if (res.msg === 'ok') {
          this.resFlag = true // 连续添加成功或失败标志
          this._getLegalDocList()
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this.resFlag = false // 连续添加成功或失败标志
          this._getLegalDocList()
          this.$message({
            message: '新增失败',
            type: 'error'
          })
        }
        callback(this.resFlag) // 返回标志
      })
    },
    // 更新数据
    updateData (data) {
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      const formData = Object.assign({}, data, {
        files: this.files,
        id: this.id
      })
      updateLegaldoc(formData).then(res => {
        if (res.msg === 'ok') {
          this._getLegalDocList()
          this.$message({
            message: '修改消防合法文书成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改消防合法文书失败',
            type: 'error'
          })
        }
      })
    },
    // 删除数据
    deleteData (data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      legaldocDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getLegalDocList()
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

<style scoped lang="scss">
</style>
