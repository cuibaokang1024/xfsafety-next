<template>
  <div class="content">
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
        <div class="selected-list">
          <ul>
            <li
              v-for="user in selectedList"
              :key="user.id"
              @dblclick="delSelected(user)"
            >
              {{ user.name }}
            </li>
          </ul>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import { getUserList } from '@/api/chk'
export default {
  name: 'UserSelect',
  components: {
    SearchForm,
    BaseTable,
    Pagination
  },
  props: {
    initVal: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
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
    this.selectedList = this.initVal.slice()
    this._getUserList()
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
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getUserList()
    },
    select(selection, row) {
      const index = this.selectedList.findIndex((item) => {
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
      const index_userList = this.userList.findIndex((item) => {
        return item.id === user.id
      })
      const index_selectedList = this.selectedList.findIndex((item) => {
        return item.id === user.id
      })
      this.selectedList.splice(index_selectedList, 1)
      if (this.userList.length > 0 && index_userList !== -1) {
        this.$refs.BaseTable.toggleRowSelection(index_userList, false)
      }
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'disabledCheck'
      }
    },
    // 回显选中项
    selectInitVal() {
      if (this.initVal) {
        if (this.userList.length > 0) {
          this.$refs.BaseTable.clearSelection()
          this.selectedList.forEach((item) => {
            const index = this.userList.findIndex((user) => {
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
    }
  }
}
</script>

<style scoped lang="scss">
.userSelect {
  .content {
    width: 100%;
    height: 100%;
    .el-container {
      height: 100%;
      .el-main {
        padding: 0;
        height: 100%;
        overflow: hidden;
        .el-table{
          margin: 15px 0;
        }
      }
    }
    .el-aside {
      width: 180px !important;
      height: 100%;
      overflow: auto;
      margin-left: 15px;
      background: rgba(255, 255, 255, 0.17);
      .selected-list {
        ul {
          li {
            color: #b9d5ff;
            text-align: center;
            margin-top: 10px;
            box-shadow: inset 0px 0px 7px 0px #97c1ff;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.userSelect {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
