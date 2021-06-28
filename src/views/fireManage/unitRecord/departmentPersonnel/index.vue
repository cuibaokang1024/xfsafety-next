<template>
  <div class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add-ment" @click="handleDepartmentCreate('添加部门')">添加部门</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div
      v-loading="listLoading"
      class="table-box"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :border="false"
        @rowClick="handleDepartView($event, '查看')"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleDepartEdit(row, '修改')"
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
            <el-tooltip content="添加下级" placement="top">
              <el-button
                icon="el-icon-plus"
                type="warning"
                circle
                @click.stop="handlePointTypeSetCreate(row, '添加下级')"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
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
      />
    </div>
    <!-- 弹出框 -->
    <router-view />
  </div>
</template>

<script>
import {
  getDeptList,
  saveDept,
  getDeptInfo,
  updateDept,
  deleteDept
} from '@/api/office'
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import BaseForm from '@/components/baseForm'

export default {
  /* 部门及人员 */
  name: '',
  components: {
    SearchForm,
    BaseTable,
    BaseForm
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        deptName: ''
      },
      total: 0,
      detail: '',
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '部门名称:',
            name: 'deptName',
            placeholder: '请输入部门名称'
          }
        ]
      },
      formOption: {
        config: [
          {
            label: '部门名称:',
            name: 'deptName',
            type: 'text',
            labelWidth: '100px',
            colspan: true,
            disabled: false
          },
          {
            label: '部门职责:',
            name: 'deptDuty',
            type: 'text',
            labelWidth: '100px',
            colspan: true,
            maxlength: 64
          },
          {
            label: '备注信息:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '100px',
            colspan: true,
            maxlength: 225
          }
        ],
        rules: {
          deptName: [
            {
              required: true,
              message: '请输入部门名称',
              trigger: 'blur'
            }
          ]
        }
      },
      tableConfig: [
        {
          prop: 'deptName',
          label: '部门名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'deptDuty',
          label: '部门职责',
          align: 'left',
          width: ''
        },
        {
          prop: 'remarks',
          label: '备注信息',
          align: 'left',
          width: ''
        }
      ],
      tableData: []
    }
  },
  created () {
    this._getDeptList()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getDeptList()
    },
    // 部门列表
    _getDeptList () {
      this.listLoading = true
      getDeptList(this.listQuery).then(res => {
        this.tableData = res.data
        this.listLoading = false
      })
    },
    // 新增部门表单数据
    handleDepartmentCreate (title) {
      this.detail = ''
      const operationStatus = 'create'
      this.formAction(title, operationStatus, {})
    },
    // 查看表单信息
    handleDepartView (data, title) {
      const operationStatus = 'view'
      this._getListInfo(data).then((formData) => {
        this.formAction(title, operationStatus, formData)
      })
    },
    // 编辑表单信息
    handleDepartEdit (data, title) {
      this.detail = data
      const operationStatus = 'edit'
      this.id = data.id
      this._getListInfo(data).then((formData) => {
        this.formAction(title, operationStatus, formData)
      })
    },
    // 新增数据
    createData (data) {
      let formData = {}
      if (this.detail) {
        formData = Object.assign({}, data, {
          parentId: this.detail.id
        })
      } else {
        formData = Object.assign({}, data, {
          parentId: -1
        })
      }
      saveDept(formData).then(res => {
        this._getDeptList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增部门成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增部门失败',
            type: 'error'
          })
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getDeptInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.dept)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除数据
    deleteData (data) {
      deleteDept([data.id]).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getDeptList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      let formData = {}
      formData = Object.assign({}, data, {
        parentId: this.detail.parentId,
        id: this.id
      })
      updateDept(formData).then(res => {
        this._getDeptList()
        if (res.msg === 'ok') {
          this.$message({
            message: '修改部门成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改部门失败',
            type: 'error'
          })
        }
      })
    },
    handlePointTypeSetCreate (data, title) {
      const operationStatus = 'create'
      this.detail = data
      this.formAction(title, operationStatus, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.appCode {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo {
  display: flex;
  margin-top: 14px;
}

.title {
  width: 100px;
  text-align: right;
  color: #97c1ff;
  padding-right: 4px;
  font-weight: bold;
}

.upload {
  flex: 1;
}
</style>

<style lang="scss">
.formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
