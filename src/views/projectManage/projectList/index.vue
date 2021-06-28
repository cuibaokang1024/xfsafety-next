<template>
  <div class="project-main projectList">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加项目列表')">添加</el-button>
      <el-button class="edit" @click="handleEdit(multipleSelection, '修改项目列表')">修改</el-button>
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
            <el-button size="mini" type="primary" round @click="handleView(row, '查看项目列表')">查看</el-button>
            <el-button size="mini" type="success" round @click="handleEdit(row, '修改项目列表')">修改</el-button>
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
        @pagination="_handleProjectListList"
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
            :limit="4"
            :file-list="fileList"
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
  handleOfficeLevelList,
  handleProjectListList,
  handleProjectListSave,
  handleProjectListInfo,
  handleProjectListUpdate,
  handleProjectListDelete
} from '@/api/project'

import '../style/index.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  // 项目列表
  name: 'ProjectList',
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
      tableData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '项目名称:',
            name: 'name',
            placeholder: '请输入项目名称'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'typeName',
          label: '项目名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '项目负责人',
          align: 'left',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '联系电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '内容',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '状态',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '项目名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px',
            colspan: true
          },
          {
            label: '项目负责人:',
            type: 'unitSelect',
            name: 'officeId',
            labelWidth: '80px',
            placeholder: '请选择项目负责人',
            treeSelectOption: {
              name: 'officeName'
            }
          },
          {
            label: '联系电话:',
            name: 'name',
            type: 'text',
            labelWidth: '80px'
          },
          {
            type: 'select',
            label: '状态:',
            name: 'type',
            labelWidth: '80px',
            dataList: [],
            colspan: true
          },
          {
            label: '内容:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '80px',
            colspan: true
          }
          /* {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          } */
        ],
        rules: {
          name: [{ required: true, message: '这是必填字段', trigger: 'blur' }]
        }
      }
    }
  },
  created() {
    this._handleOfficeLevelList()
    this._handleProjectListList()
  },
  methods: {
    // 字段
    _handleOfficeLevelList() {
      handleOfficeLevelList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map((item) => {
            if (item.name === 'type') {
              return { ...item, dataList: res.data.officeLevels }
            } else {
              return item
            }
          })
        }
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleProjectListList()
    },
    // 获取列表
    _handleProjectListList() {
      handleProjectListList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        handleProjectListInfo({ id: data.id })
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
      handleProjectListSave(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增项目列表成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增项目列表失败',
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
      handleProjectListUpdate(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改项目列表成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改项目列表失败',
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
      handleProjectListDelete(list).then(res => {
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
