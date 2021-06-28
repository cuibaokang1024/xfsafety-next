<template>
  <div class="unitSelect">
    <div class="select-wrapper">
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
      :visible.sync="dialogVisible"
      append-to-body
      :show-close="false"
      width="800px"
    >
      <div name="title" class="dialog-title">人员选择</div>
      <div class="dialog-content">
        <div
          v-loading="listLoading"
          class="unit-content"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
        >
          <div class="left-content">
            <div class="title">单位选择</div>
            <TreeNode :tree-data="treeData" @handleNodeClick="handleNodeClick" />
            <div class="all" @click="_handleUserList">查看全部</div>
          </div>
          <div class="right-content">
            <!-- 列表框 -->
            <div class="table-box">
              <BaseTable
                ref="BaseTable"
                :table-data="tableData"
                :table-height="560"
                :table-config="tableConfig"
                :border="false"
                @handleSelectionChange="handleSelectionChange"
              />
            </div>
            <!-- 列表框 -->
          </div>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide()">关 闭</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  handleSecDeptList,
  handleUserList,
  handleSecDeptUser
} from '@/api/danger'

import './index.scss'
import TreeNode from '@/components/treeNode'
import BaseTable from '@/components/baseTable'

export default {
  name: 'UnitSelect',
  components: {
    TreeNode,
    BaseTable
  },
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    label: {
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
      dialogVisible: false,
      listQuery: {
        deptId: ''
      },
      treeData: [],
      multipleSelection: [],
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        }
      ],
      tableData: []
    }
  },
  created() {
    this._handleAreaTree()
    this._handleUserList()
  },
  methods: {
    // 获取tree
    _handleAreaTree() {
      handleSecDeptList().then(res => {
        this.treeData = res.data
      })
    },
    // 树状方法
    handleNodeClick(data, node) {
      this.listQuery.deptId = data.value
      this._handleSecDeptUser()
    },
    // 获取列表
    _handleUserList() {
      this.listLoading = true
      handleUserList().then(res => {
        if (res.data) {
          this.tableData = res.data
        }
        this.listLoading = false
      })
    },
    _handleSecDeptUser() {
      this.listLoading = true
      handleSecDeptUser(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
        this.listLoading = false
      })
    },
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleShow() {
      if (this.disabled) {
        return
      }
      this.dialogVisible = true
    },
    handleHide() {
      this.multipleSelection = []
      this.$refs.BaseTable.clearSelection()
      this.dialogVisible = false
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
          if (id && name) {
            this.$emit('update:value', id)
            this.$emit('update:label', name)
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
