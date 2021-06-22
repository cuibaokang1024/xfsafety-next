<template>
  <el-dialog
    v-if="dialogVisible"
    class="dark consult-dialog"
    :visible.sync="dialogVisible"
    append-to-body
    width="1000px"
  >
    <div slot="title" class="dialog-title">查阅</div>
    <div class="dialog-content">
      <el-scrollbar>
        <el-main>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in activeList"
              :key="item.id"
              :label="item.label"
              :name="item.name"
            >
              <div class="tab-container-item">
                <el-button
                  v-if="activeName === 'unread'"
                  class="remind-btn"
                  size="mini"
                  round
                  @click="handleSendRemind"
                >一键发送短信提醒</el-button>
                <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
                  <el-tab-pane :label="`本单位 (${userList.length})`" name="unit">
                    <BaseTable
                      ref="unitTable"
                      :loading="listLoading"
                      :table-config="tableConfig"
                      :table-data="userList"
                      :border="false"
                      @handleSelectionChange="handleSelectionChange"
                      @selectAll="selectAll"
                    />
                  </el-tab-pane>
                  <el-tab-pane :label="`下级部门 (${deptList.length})`" name="department">
                    <BaseTable
                      ref="departmentTable"
                      :loading="listLoading"
                      :table-config="tableConfig"
                      :table-data="deptList"
                      :border="false"
                      @handleSelectionChange="handleSelectionChange"
                      @selectAll="selectAll"
                    />
                  </el-tab-pane>
                  <el-tab-pane :label="`下属单位 (${officeList.length})`" name="subordinate">
                    <BaseTable
                      ref="subordinateTable"
                      :loading="listLoading"
                      :table-config="tableConfig"
                      :table-data="officeList"
                      :border="false"
                      @handleSelectionChange="handleSelectionChange"
                      @selectAll="selectAll"
                    />
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-scrollbar>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  handleOfficeOanotifyRecords,
  handleOfficeOanotifyRemind
} from '@/api/companyHome'

import './index.scss'
import BaseTable from '@/components/baseTable'

export default {
  // 查阅
  name: 'Consult',
  components: {
    BaseTable
  },
  props: {
    notifyId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      listQuery: {
        notifyId: '',
        readFlag: 1 // 0 未读 1 已读
      },
      remindQuery: {
        notifyId: '',
        type: '1', // 用户类型1,2,3
        ids: []
      },
      activeName: 'readed',
      activeList: [
        {
          id: 1,
          name: 'readed',
          label: '已读'
        },
        {
          id: 0,
          name: 'unread',
          label: '未读'
        }
      ],
      listLoading: false,
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'revName',
          label: '接收人',
          align: 'left',
          width: ''
        },
        {
          prop: 'readDate',
          label: '阅读时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'readFlag',
          label: '阅读状态',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            if (row.readFlag) {
              return row.readFlag === '1' ? '已读' : '未读'
            }
          }
        }
      ],
      activeTabName: 'unit',
      userList: [],
      deptList: [],
      officeList: [],
      multipleSelection: []
    }
  },
  watch: {
    notifyId(newVal, oldVal) {
      this.listQuery.notifyId = newVal
      this.remindQuery.notifyId = newVal
      this._handleOfficeOanotifyRecords()
    }
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectAll(val) {
      this.multipleSelection = val
    },
    handleClick(tab, event) {
      if (tab.label === '已读') {
        this.listQuery.readFlag = 1
        const index = this.tableConfig.findIndex(item => {
          return item.prop === 'sdsmsFlag'
        })
        if (index !== -1) {
          this.tableConfig.pop()
        }
        this._handleOfficeOanotifyRecords()
      } else {
        this.listQuery.readFlag = 0
        const index = this.tableConfig.findIndex(item => {
          return item.prop === 'sdsmsFlag'
        })
        if (index === -1) {
          this.tableConfig.push({
            prop: 'sdsmsFlag',
            label: '发送短信状态',
            align: 'left',
            width: '',
            formatter: (row, column, cellValue, index) => {
              return row.sdsmsFlag ? '已发送' : '未发送'
            }
          })
        }
        this._handleOfficeOanotifyRecords()
      }
    },
    handleTabClick(tab, event) {
      if (tab.name === 'unit') {
        this.remindQuery.type = '1'
        this.multipleSelection = []
        this.$refs.unitTable[1].clearSelection()
      } else if (tab.name === 'department') {
        this.remindQuery.type = '2'
        this.multipleSelection = []
        this.$refs.departmentTable[1].clearSelection()
      } else if (tab.name === 'subordinate') {
        this.remindQuery.type = '3'
        this.multipleSelection = []
        this.$refs.subordinateTable[1].clearSelection()
      }
    },
    _handleOfficeOanotifyRecords() {
      handleOfficeOanotifyRecords(this.listQuery).then(res => {
        if (res.data) {
          this.userList = res.data.userList
          this.deptList = res.data.deptList
          this.officeList = res.data.officeList
        }
      })
    },
    handleSendRemind() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '至少选择一条数据',
          type: 'warning'
        })
      } else {
        this.remindQuery.ids = this.multipleSelection.map(item => {
          return item.id
        })
        const remindQuery = new FormData()
        remindQuery.append('notifyId', this.remindQuery.notifyId)
        remindQuery.append('type', this.remindQuery.type)
        remindQuery.append('ids', this.remindQuery.ids)
        handleOfficeOanotifyRemind(remindQuery).then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
        setTimeout(() => {
          this._handleOfficeOanotifyRecords()
        }, 500)
      }
    },
    handleShow() {
      this.dialogVisible = true
    },
    handleHide() {
      this.dialogVisible = false
      this.multipleSelection = []
    }
  }
}
</script>

<style scoped lang="scss">
</style>
