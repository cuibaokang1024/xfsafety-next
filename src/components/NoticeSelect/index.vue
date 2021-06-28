<template>
  <div class="noticeSelect">
    <div class="select-wrapper">
      <el-input v-show="false" v-model="value" />
      <el-input v-model="label" placeholder="请选择人员" class="input-with-select" :disabled="true" />
      <el-button class="select-btn" icon="el-icon-search" @click="handleShow" />
    </div>
    <el-dialog
      class="dark noticeSelect-dialog"
      v-model:visible="dialogUserVisible"
      append-to-body
      width="1200px"
    >
      <div name="title" class="dialog-title">人员选择</div>
      <div class="dialog-content">
        <el-container>
          <el-aside class="noticeSelect-left">
            <TreeNode height="500px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
          </el-aside>
          <el-main>
            <BaseTable
              ref="BaseTable"
              :loading="listLoading"
              :table-data="userList"
              :table-config="tableConfig"
              :border="false"
              :table-height="'456px'"
              :disabled-all-check="true"
              @select="select"
              @select-all="selectAll"
            />
          </el-main>
          <el-aside class="noticeSelect-right">
            <el-scrollbar>
              <div class="selected-list">
                <ul>
                  <li
                    v-for="user in selectedList"
                    :key="user.id"
                    @dblclick="delSelected(user)"
                  >{{ user.label }}</li>
                </ul>
              </div>
            </el-scrollbar>
          </el-aside>
        </el-container>
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
  handleOfficeOanotifyTree,
  handleOfficeOanotifyUser
} from '@/api/companyHome'
import './index.scss'

import BaseTable from '@/components/baseTable'
import TreeNode from '@/components/treeNode'

export default {
  name: 'NoticeSelect',
  components: {
    BaseTable,
    TreeNode
  },
  props: {
    value: {
      type: [Number, String, Array],
      default: null
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogUserVisible: false,
      listLoading: true,
      listQuery: {
        id: ''
      },
      total: 0,
      tableConfig: [
        {
          type: 'selection',
          width: '55',
          'reserve-selection': true
        },
        {
          prop: 'loginName',
          label: '人员名称',
          align: 'left',
          width: ''
        }
      ],
      userList: [],
      selectedList: [],
      treeData: []
    }
  },
  created () {
    const userNameList = this.label.split(',')
    if (Array.isArray(this.value)) {
      this.selectedList = this.value
        .toString()
        .split(',')
        .map((item, index) => {
          return { id: parseInt(item), label: userNameList[index] }
        })
    } else if (!this.value) {
      this.selectedList = []
    } else {
      this.selectedList = this.value.split(',').map((item, index) => {
        return { id: parseInt(item), label: userNameList[index] }
      })
    }
    this._handleOfficeOanotifyTree()
  },
  methods: {
    // 获取tree
    _handleOfficeOanotifyTree () {
      handleOfficeOanotifyTree().then(res => {
        this.treeData = res.data
      })
    },
    // 树状方法
    handleNodeClick (data, node) {
      this.listQuery.id = data.id
      this._handleOfficeOanotifyUser()
    },
    // 列表
    _handleOfficeOanotifyUser () {
      handleOfficeOanotifyUser(this.listQuery).then(res => {
        this.total = res.data.totalCount
        this.userList = res.data
        this.$nextTick(() => {
          this.selectInitVal()
        })
      })
    },
    handleArrToStr (arr, obj) {
      let str = ''
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          if (obj) {
            str += `${item[obj] || ''},`
          } else {
            str += `${item || ''},`
          }
        })
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    handleShow () {
      this.dialogUserVisible = true
      this._handleOfficeOanotifyUser()
    },
    handleHide () {
      this.dialogUserVisible = false
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
    delSelected (user) {
      const index_userList = this.userList.findIndex(item => {
        return item.id === user.id
      })
      const index_selectedList = this.selectedList.findIndex(item => {
        return item.id === user.id
      })
      this.selectedList.splice(index_selectedList, 1)
      if (this.userList.length > 0 && index_userList !== -1) {
        this.$refs.BaseTable.toggleRowSelection(index_userList, false)
      }
    },
    // 回显选中项
    selectInitVal () {
      if (this.value) {
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
      }
    },
    getSelectedUser () {
      return this.selectedList
    },
    handleSubmit () {
      const id = this.handleArrToStr(this.selectedList, 'id').split(',')
      const label = this.handleArrToStr(this.selectedList, 'label')
      this.$emit('update:value', id)
      this.$emit('update:label', label)
      this.handleHide()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
