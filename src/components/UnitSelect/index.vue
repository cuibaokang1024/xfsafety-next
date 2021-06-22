<template>
  <div class="unitSelect">
    <div v-if="isShow" class="select-wrapper">
      <el-select
        v-model="value"
        :popper-append-to-body="false"
        placeholder="请选择"
        :disabled="disabled"
        @focus="handleShow"
      >
        <el-option v-if="value !== -1" :value="value" :label="label" />
        <el-option v-else :value="-1" label="请选择" />
      </el-select>
      <el-button slot="append" class="select-btn" icon="el-icon-search" @click="handleShow" />
    </div>
    <el-dialog
      class="dark unitSelect-dialog"
      :visible.sync="dialogUnitVisible"
      append-to-body
      :show-close="false"
      width="1200px"
    >
      <div slot="title" class="dialog-title">社会单位选择</div>
      <div class="dialog-content">
        <div
          v-loading="listLoading"
          class="unit-content"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
        >
          <div class="left-content">
            <div class="title">行政区划</div>
            <TreeNode :tree-data="treeData" @handleNodeClick="handleNodeClick" />
          </div>
          <div class="right-content">
            <!-- 搜索框 -->
            <div class="search-box">
              <el-form
                ref="ruleForm"
                :inline="true"
                :model="ruleForm"
                class="demo-form-inline"
                label-width="80px"
              >
                <el-form-item label="机构名称:">
                  <el-input v-model="ruleForm.name" placeholder="请输入机构名称" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleFilter(ruleForm)">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-refresh-left"
                    @click="handleResetForm('ruleForm')"
                  >重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 搜索框 -->
            <!-- 列表框 -->
            <div class="table-box">
              <BaseTable
                ref="BaseTable"
                :table-data="tableData"
                :table-height="'450'"
                :table-config="tableConfig"
                :border="false"
                @handleSelectionChange="handleSelectionChange"
              />
            </div>
            <div class="pagination-box">
              <Pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="_handleUnitRecordList"
              />
            </div>
            <!-- 列表框 -->
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHide()">关 闭</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  handlerUnitRecordAreaTree,
  handlerUnitRecordList,
  handleAgentUnitList
} from '@/api/office'

import './index.scss'
import TreeNode from '@/components/treeNode'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  name: 'UnitSelect',
  components: {
    TreeNode,
    BaseTable,
    Pagination
  },
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    isAgent: {
      // 是否代理商
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    addr: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listLoading: false,
      dialogUnitVisible: false,
      ruleForm: {
        name: ''
      },
      listQuery: {
        name: '',
        officeName: '',
        areaId: '',
        page: 1,
        limit: 10
      },
      total: 0,
      treeData: [],
      multipleSelection: [],
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '机构名称',
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
      tableData: []
    }
  },
  created() {
    this._handleAreaTree()
    this._handleUnitRecordList()
  },
  methods: {
    // 获取tree
    _handleAreaTree() {
      handlerUnitRecordAreaTree().then(res => {
        this.treeData = res.data
      })
    },
    // 获取列表
    _handleUnitRecordList() {
      this.listLoading = true
      if (this.isAgent) {
        handleAgentUnitList(this.listQuery).then(res => {
          if (res.data) {
            this.tableData = res.data.list
            this.total = res.data.totalCount
          }
          this.listLoading = false
        })
      } else {
        handlerUnitRecordList(this.listQuery).then(res => {
          if (res.data) {
            this.tableData = res.data.list
            this.total = res.data.totalCount
          }
          this.listLoading = false
        })
      }
    },
    // 树状方法
    handleNodeClick(data, node) {
      this.listQuery.areaId = data.id
      this._handleUnitRecordList()
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data, officeName: data.name }
      this._handleUnitRecordList()
    },
    // 重置函数
    handleResetForm(formName) {
      this.ruleForm = {}
      this.listQuery.name = ''
      this.listQuery.officeName = ''
      this.$refs[formName].resetFields()
    },
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleShow() {
      if (this.disabled) {
        return
      }
      this.dialogUnitVisible = true
    },
    handleHide() {
      this.multipleSelection = []
      this.$refs.BaseTable.clearSelection()
      this.dialogUnitVisible = false
    },
    handleSubmit() {
      const data = this.multipleSelection
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
          const id = data[0].id
          const name = data[0].name
          const addr = data[0].addr
          if (id && name) {
            this.$emit('update:value', id)
            this.$emit('update:label', name)
            this.$emit('update:addr', addr)
          }
          this.handleHide()
        }
      } else {
        this.$message({
          message: '请选择数据!',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
