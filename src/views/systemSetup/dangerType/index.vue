<template>
  <div class="section-main dangerType">
    <!-- 列表框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="handleAdd()">新增</el-button>
    </div>
    <div
      v-loading="listLoading"
      class="table-box"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <BaseTable
        :table-config="tableConfig"
        :table-data="tableData"
        :default-expand-all="false"
        :border="false"
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
            <el-tooltip content="添加下级" placement="top">
              <el-button
                icon="el-icon-plus"
                type="warning"
                circle
                @click.stop="handleLowerCreate(row, '添加下级')"
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
        @createData="createData"
        @updateData="updateData"
        @formHide="formHide"
      />
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handleTypeList,
  handleTypeInfo,
  handleTypeSave,
  handleTypeUpdate,
  handleTypeDelete
} from '@/api/danger'

import '@/styles/list.scss'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import BaseForm from '@/components/baseForm'

export default {
  // 危化品类型
  name: 'DangerType',
  components: {
    BaseTable,
    BaseForm,
    SearchForm
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      id: '',
      parentId: '',
      listQuery: {
        name: ''
      },
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '危化品类型:',
            name: 'name',
            placeholder: '请输入危化品类型'
          }
        ]
      },
      tableConfig: [
        {
          prop: 'name',
          label: '危化品类型',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '上级类型:',
            name: 'parentName',
            type: 'text',
            labelWidth: '120px',
            disabled: true
          },
          {
            label: '危化品类型:',
            name: 'name',
            type: 'text',
            labelWidth: '120px',
            maxlength: 64
          }
        ],
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ]
        }
      },
      formAddOption: {
        config: [
          {
            label: '名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px'
          }
        ],
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  created () {
    this._handleTypeList()
  },
  methods: {
    handleAdd () {
      const operationStatus = 'create'
      this.formAction('新增', operationStatus, {})
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleTypeList()
    },
    // 列表
    _handleTypeList () {
      this.listLoading = true
      handleTypeList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
        this.listLoading = false
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleTypeInfo({
          id: data.id
        })
          .then(res => {
            if (res.data) {
              resolve(res.data.cheChemicalType)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增下级巡查点
    handleLowerCreate (data, title) {
      const operationStatus = 'create'
      this.id = data.id
      this.parentId = data.parentId
      this.formAction(title, operationStatus, {
        parentName: data.name
      })
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        id: this.id,
        parentId: this.parentId
      })
      handleTypeSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleTypeList()
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
    // 更新数据
    updateData (data) {
      const formData = Object.assign({}, data, {
        id: this.id
      })
      handleTypeUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleTypeList()
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
    handleFireDelete (data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否连下级单位一块删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteData(data)
          })
          .catch(() => {
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
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      const id = list[0]
      handleTypeDelete({ id }).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleTypeList()
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

<style lang="scss">
</style>
