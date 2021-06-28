<template>
  <section class="inspect-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button v-permission="btn" class="add" @click="handleCreate('新增')">添加</el-button>
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
        :width="'1000px'"
        :height="'489px'"
        @createData="createData"
        @updateData="updateData"
        @formHide="formHide"
      >
        <template v-slot:uploadFile>
          <upload-file
            ref="upload-file"
            :limit="50"
            :is-download="true"
            :accept="'.doc,.docx'"
            :file-list="fileList"
            @uploadSuccess="uploadSuccess"
            @addDeleteFileList="addDeleteFileList"
            @removeFile="removeFile"
          />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import formAction from '@/mixins/form.js'
import {
  getLegalDocList,
  getLegaldocInfo,
  legaldocDelete,
  getDict,
  updateLegaldoc,
  saveLegaldoc
} from '@/api/office'

import '../style/supervisionUnit.scss'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 消防合法文书 */
  name: 'FireLegal',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
  },
  mixins: [formAction],
  data () {
    return {
      btn: '111',
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
          type: 'selection',
          width: '55'
        },
        {
          prop: 'officeName',
          label: '工作名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'docTypeName',
          label: '检查类别',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '检查要求',
          align: 'left',
          width: ''
        },
        {
          prop: 'docTypeName',
          label: '检查内容',
          align: 'left',
          width: ''
        },
        {
          prop: 'docTypeName',
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '工作名称:',
            name: 'name',
            type: 'text'
          },
          {
            label: '检查类别:',
            name: 'docType',
            type: 'select',
            dataList: []
          },
          {
            label: '开始日期:',
            name: 'startDate',
            type: 'date'
          },
          {
            label: '结束日期:',
            name: 'endDate',
            type: 'date'
          },
          {
            label: '检查表:',
            name: 'docType',
            type: 'select',
            dataList: []
          },
          {
            label: '检查要求:',
            name: 'name',
            type: 'textarea'
          },
          {
            label: '检查内容:',
            name: 'name',
            type: 'textarea'
          },
          {
            type: 'slot',
            name: 'uploadFile'
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
          ]
        }
      }
    }
  },
  created () {
    this._getDict()
    this._getLegalDocList()
  },
  methods: {
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
