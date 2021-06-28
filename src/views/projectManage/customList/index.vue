<template>
  <div class="project-main customList">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <!-- <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加客户列表')">添加</el-button>
    </div> -->
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableData"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <el-tooltip content="设备详情" placement="top">
              <el-button
                icon="el-icon-tickets"
                type="warning"
                circle
                @click.stop="handleDevice(row)"
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
        @pagination="_handleCustomListList"
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
      <!--  -->
      <CustomForm ref="customForm" :form-model="formModel" />
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handleOfficeLevelList,
  handleCustomListList,
  handleCustomListSave,
  handleCustomListInfo,
  handleCustomListUpdate,
  handleCustomListDelete
} from '@/api/project'

import '../style/index.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import CustomForm from '@/components/CustomForm'

export default {
  // 客户列表
  name: 'CustomList',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    CustomForm
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      listQuery: {
        officeName: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '单位名称:',
            name: 'officeName',
            placeholder: '请输入单位名称'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'id',
          label: '单位ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '单位名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '归属区域',
          align: 'left',
          width: ''
        },
        {
          prop: 'officePhone',
          label: '联系电话',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '单位名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '归属区域:',
            name: 'areaId',
            type: 'treeSelect',
            labelWidth: '80px',
            treeSelectOption: {
              title: '选择归属区域',
              name: 'areaName',
              request: {
                url: 'system/api/area/treeData',
                params: {}
              }
            }
          },
          {
            type: 'select',
            label: '单位类型:',
            name: 'officeType',
            labelWidth: '80px',
            dataList: []
          },
          {
            label: '负责人:',
            name: 'master',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '单位电话:',
            name: 'officePhone',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '单位邮箱:',
            name: 'email',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '详细地址:',
            name: 'addr',
            type: 'text',
            labelWidth: '80px',
            colspan: true
          },
          {
            label: '经纬度:',
            name: 'lnglat',
            type: 'mapSelect',
            labelWidth: '80px',
            treeSelectOption: {
              name: 'addr'
            },
            colspan: true
          }
        ],
        rules: {
          name: [{ required: true, message: '这是必填字段', trigger: 'blur' }]
        }
      },
      formModel: {
        isResetFormFlag: false,
        id: '',
        title: ''
      }
    }
  },
  created() {
    this._handleOfficeLevelList()
    this._handleCustomListList()
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
      this._handleCustomListList()
    },
    // 获取列表
    _handleCustomListList() {
      handleCustomListList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        handleCustomListInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data)
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
      handleCustomListSave(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增客户列表成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增客户列表失败',
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
      handleCustomListUpdate(formData).then(res => {
        this._getFireRuleList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改客户列表成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改客户列表失败',
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
      handleCustomListDelete(list).then(res => {
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
    // 查看设备详情
    handleDevice(data) {
      this.formModel = {
        isResetFormFlag: !this.formModel.isResetFormFlag,
        id: data.id,
        title: data.name
      }
      this.$refs.customForm.handleShow()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
