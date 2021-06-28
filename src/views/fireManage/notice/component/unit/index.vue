<template>
  <el-dialog
    class="dark unitNotice-dialog"
    v-model:visible="dialogVisible"
    append-to-body
    width="800px"
    :show-close="false"
  >
    <div name="title" class="dialog-title">人员选择</div>
    <div class="dialog-content">
      <el-container>
        <el-aside>
          <TreeNode :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-aside>
        <el-main>
          <BaseTable
            ref="BaseTable"
            :loading="listLoading"
            :table-config="tableConfig"
            :table-data="userList"
            :table-height="474"
            :border="false"
            :disabled-all-check="true"
            @select="select"
            @select-all="selectAll"
          />
          <br>
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="listQuery.page"
            v-model:limit="listQuery.pageSize"
            @pagination="_handleOfficeOanotifyUser"
          />
        </el-main>
      </el-container>
    </div>
    <div name="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  handleOfficeOanotifyDept,
  handleOfficeOanotifyUser
} from '@/api/companyHome'

import BaseTable from '@/components/baseTable'
import TreeNode from '@/components/treeNode'
import Pagination from '@/components/Pagination'

export default {
  // 单位
  name: 'Unit',
  components: {
    BaseTable,
    TreeNode,
    Pagination
  },
  props: {
    selectList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false,
      listLoading: true,
      listQuery: {
        deptId: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableConfig: [
        {
          type: 'selection',
          width: '55',
          'reserve-selection': true
        },
        {
          prop: 'name',
          label: '人员名称',
          align: 'left',
          width: ''
        }
      ],
      treeData: [],
      userList: [],
      selectedList: []
    }
  },
  methods: {
    // 树状方法
    handleNodeClick (data, node) {
      this.listQuery.deptId = data.id
      this._handleOfficeOanotifyUser()
    },
    // 获取tree
    _handleOfficeOanotifyDept () {
      handleOfficeOanotifyDept().then(res => {
        res.data.unshift({
          id: '',
          label: '全部'
        })
        this.treeData = res.data
      })
    },
    // 列表
    _handleOfficeOanotifyUser () {
      handleOfficeOanotifyUser(this.listQuery).then(res => {
        this.userList = res.data.list
        this.total = res.data.totalCount
        this.$nextTick(() => {
          this.selectInitVal()
        })
      })
    },
    select (selection, row) {
      const index = this.selectedList.findIndex(item => {
        return item.id === row.id
      })
      if (index === -1) {
        this.selectedList.push(row)
      } else {
        this.selectedList.splice(index, 1)
      }
    },
    selectAll () {},
    // 回显选中项
    selectInitVal () {
      if (this.userList.length > 0) {
        this.$refs.BaseTable.clearSelection()
        this.selectedList.forEach(item => {
          const index = this.userList.findIndex(user => {
            return user.id === item.id
          })
          if (index !== -1) {
            this.$refs.BaseTable.toggleRowSelection(index, true)
          }
        })
      }
    },
    handleSubmit () {
      this.handleHide()
    },
    handleShow () {
      this.selectedList = this.selectList
      this.dialogVisible = true
      this._handleOfficeOanotifyDept()
      this._handleOfficeOanotifyUser()
    },
    handleHide () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.unitNotice-dialog {
  .el-dialog__body {
    padding-top: 0;
  }

  .dialog-content {
    width: 100%;
    height: 520px;

    .el-container {
      height: 100%;

      .el-aside {
        width: 240px !important;
        height: 100%;
        background: #122654;
        margin-right: 20px;
      }

      .el-main {
        padding: 0;
        height: 100%;
        overflow: hidden;

        .el-table {
          background: #122654;
        }
      }
    }
  }
}
</style>
