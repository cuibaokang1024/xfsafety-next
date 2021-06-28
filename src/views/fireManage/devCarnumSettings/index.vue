<template>
  <div class="carnum-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加车牌号')">添加</el-button>
      <el-button class="edit" @click="handleEdit(multipleSelection, '修改车牌号')">修改</el-button>
      <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableList"
        :border="false"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button
              size="mini"
              type="primary"
              round
              @click="handleView(row, '查看车牌号')"
            >查看</el-button>
            <el-button
              size="mini"
              type="success"
              round
              @click="handleEdit(row, '修改车牌号')"
            >修改</el-button>
            <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_handleCarNumList"
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
      />
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handleCarNumList,
  handleCarNumInfo,
  handleCarNumDelete,
  handleCarNumUpdate,
  handleCarNumSave
} from '@/api/carnum'

import './index.scss'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'

export default {
  /* 车牌号管理 */
  name: 'CarNum',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm
  },
  mixins: [formAction],
  data () {
    var checkPhoneNum = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      listQuery: {
        officeName: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableList: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '车牌号:',
            name: 'carnum',
            placeholder: '请输入车牌号'
          },
          {
            type: 'text',
            label: '单位名称:',
            name: 'officeName',
            placeholder: '请输入单位名称'
          },
          {
            type: 'text',
            label: '车主姓名:',
            name: 'ownerName',
            placeholder: '请输入车主姓名'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'carnum',
          label: '车牌号',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '单位名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'ownerName',
          label: '车主姓名',
          align: 'left',
          width: ''
        },
        {
          prop: 'ownerTel',
          label: '车主电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'ownerAddr',
          label: '车主住址',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '车牌号:',
            name: 'carnum',
            type: 'text',
            labelWidth: '80px',
            placeholder: '可以多个且逗号分隔'
          },
          {
            label: '所属单位:',
            type: 'unitSelect',
            name: 'officeId',
            labelWidth: '80px',
            treeSelectOption: {
              name: 'officeName'
            }
          },
          {
            label: '车主姓名:',
            name: 'ownerName',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '车主电话:',
            name: 'ownerTel',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '车主住址:',
            name: 'ownerAddr',
            type: 'text',
            labelWidth: '80px',
            colspan: true
          }
        ],
        rules: {
          carnum: [
            {
              required: true,
              message: '请输入车牌号，可以多个且逗号分隔',
              trigger: 'blur'
            }
          ],
          ownerName: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          officeId: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          ownerTel: [
            { required: false, validator: checkPhoneNum, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created () {
    this._handleCarNumList()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleCarNumList()
    },
    // 获取列表
    _handleCarNumList () {
      handleCarNumList(this.listQuery).then(res => {
        if (res.data) {
          this.tableList = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleCarNumInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.carNum)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleCarNumSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleCarNumList()
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
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleCarNumUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleCarNumList()
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
      handleCarNumDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleCarNumList()
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
