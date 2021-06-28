<template>
  <div class="section-main">
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
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
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
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="_getFireRuleList"
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
        @updateData="updateData"
        @createData="createData"
        @formHide="formHide"
      >
        <template v-slot:uploadFile>
          <upload-file
            ref="upload-file"
            :is-download="true"
            :limit="4"
            :file-size="10"
            :file-list="fileList"
            :accept="'.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx'"
            @uploadSuccess="uploadSuccess"
            @addDeleteFileList="addDeleteFileList"
            @removeFile="removeFile"
          />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getFireRuleList,
  fireRuleDelete,
  getDict,
  getFireRuleInfo,
  updateFireRule,
  saveFireRule
} from '@/api/office'

import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 规章制度  */
  name: 'FireRule',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
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
      list: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '名称:',
            name: 'name',
            placeholder: '请输入名称'
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
          prop: 'typeName',
          label: '制度类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '制订时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px',
            maxlength: 64
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
            type: 'select',
            label: '制度类型:',
            name: 'type',
            labelWidth: '80px',
            dataList: []
          },
          {
            label: '制定时间:',
            name: 'ruleDate',
            type: 'date',
            labelWidth: '80px',
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > new Date()
              }
            }
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ],
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          officeId: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          type: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          ruleDate: [{ required: true, message: '请选择日期', trigger: 'blur' }]
        }
      }
    }
  },
  created() {
    this._getFireRuleList()
    this._getDict()
  },
  methods: {
    // 获取列表
    _getFireRuleList() {
      getFireRuleList(this.listQuery).then(res => {
        if (res.data) {
          this.list = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        getFireRuleInfo({ id: data.id })
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
    // 获取字典值
    _getDict() {
      getDict({
        type: 'sys_rule_type'
      }).then(res => {
        if (res.data) {
          this.formOption.config[2].dataList = res.data.dicts
        }
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getFireRuleList()
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
      fireRuleDelete(list).then(res => {
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
      updateFireRule(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改规章制度成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改规章制度失败',
            type: 'error'
          })
        }
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
      saveFireRule(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增规章制度成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增规章制度失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
