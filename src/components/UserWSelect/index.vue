<template>
  <div class="userSelect">
    <div class="select-wrapper">
      <el-input v-show="false" v-model="value" />
      <el-input v-model="label" placeholder="请选择人员" class="input-with-select" @focus="handleShow">
        <el-button slot="append" icon="el-icon-search" @click="handleShow" />
      </el-input>
    </div>
    <el-dialog
      class="dark userSelect-dialog"
      :visible.sync="dialogUserVisible"
      append-to-body
      width="1000px"
    >
      <div slot="title" class="dialog-title">人员选择</div>
      <div class="dialog-content">
        <el-container>
          <el-main>
            <SearchForm
              style="text-align: left; padding: 0"
              :form-option="searchFormOption"
              @search="handleFilter"
            />
            <BaseTable
              ref="BaseTable"
              :loading="listLoading"
              :table-data="userList"
              :table-config="tableConfig"
              :border="false"
              :table-height="'397px'"
              :disabled-all-check="true"
              @select="select"
              @select-all="selectAll"
            />
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.pageSize"
              @pagination="_getUserList"
            />
          </el-main>
          <el-aside>
            <el-scrollbar>
              <div class="selected-list">
                <ul>
                  <li
                    v-for="user in selectedList"
                    :key="user.id"
                    @dblclick="delSelected(user)"
                  >{{ user.name }}</li>
                </ul>
              </div>
            </el-scrollbar>
          </el-aside>
        </el-container>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHide()">关 闭</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/chk'
import './style/index.scss'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserSelect',
  components: {
    SearchForm,
    BaseTable,
    Pagination
  },
  props: {
    value: {
      type: String,
      default: () => ''
    },
    label: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      dialogUserVisible: false,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 30,
        name: ''
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '人员名称:',
            name: 'name',
            placeholder: '请输入名称'
          }
        ]
      },
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
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'left',
          width: ''
        }
      ],
      userList: [],
      selectedList: []
    }
  },
  created() {
    const userNameList = this.label.split(',')
    this.selectedList = this.value.split(',').map((item, index) => {
      return { id: parseInt(item), name: userNameList[index] }
    })
  },
  methods: {
    _getUserList() {
      getUserList(this.listQuery).then(res => {
        this.total = res.data.totalCount
        this.userList = res.data.list
        this.$nextTick(() => {
          this.selectInitVal()
        })
      })
    },
    handleShow() {
      this.dialogUserVisible = true
      this._getUserList()
    },
    handleHide() {
      this.dialogUserVisible = false
    },
    handleArrToStr(arr, obj) {
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
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getUserList()
    },
    select(selection, row) {
      const index = this.selectedList.findIndex(item => {
        return item.id === row.id
      })
      if (index === -1) {
        this.selectedList.push(row)
      } else {
        this.selectedList.splice(index, 1)
      }
    },
    selectAll() {},
    delSelected(user) {
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
    selectInitVal() {
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
    getSelectedUser() {
      return this.selectedList
    },
    handleSubmit() {
      const id = this.handleArrToStr(this.selectedList, 'id')
      const name = this.handleArrToStr(this.selectedList, 'name')
      this.$emit('update:value', id)
      this.$emit('update:label', name)
      this.handleHide()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
