<template>
  <div class="content">
    <div class="left">
      <TreeNode :tree-data="treeData" @handleNodeClick="handleNodeClick" />
    </div>
    <div class="right">
      <el-container>
        <el-main>
          <BaseTable
            ref="BaseTable"
            :loading="listLoading"
            :table-data="fireOfficerList"
            :table-config="tableConfig"
            :table-height="'397px'"
            :border="true"
            @select="select"
            @selectAll="selectAll"
          />
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="listQuery.page"
            v-model:limit="listQuery.pageSize"
            @pagination="_getFireOfficerList"
          />
        </el-main>
        <el-aside>
          <div class="selected-list">
            <ul>
              <li v-for="fireOfficer in selectedList" :key="fireOfficer.id" @dblclick="delSelected(fireOfficer)">
                {{ fireOfficer.name }}
              </li>
            </ul>
          </div>
        </el-aside>
      </el-container>
    </div>

  </div>

</template>

<script>
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import TreeNode from '@/components/treeNode'
import { getFireTree, getFireOfficerList } from '@/api/emergencyCommand'
export default {
  name: 'FireOfficerSelect',
  components: {
    BaseTable,
    Pagination,
    TreeNode
  },
  props: {
    initVal: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        officeId: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      total: 0,
      treeData: [],
      tableConfig: [
        {
          type: 'selection',
          width: '45',
          'reserve-selection': true
        },
        {
          type: 'index',
          width: '45'
        },
        {
          prop: 'loginName',
          label: '账号',
          align: 'center',
          width: '82'
        },
        {
          prop: 'name',
          label: '姓名',
          align: 'center',
          width: ''
        },
        {
          prop: 'officeName',
          label: '所属单位',
          align: 'center',
          width: ''
        }
      ],
      fireOfficerList: [],
      selectedList: []
    }
  },
  created () {
    this.selectedList = this.initVal.slice()
    this._getFireTree()
    this._getFireOfficerList()
  },
  methods: {
    // 获取巡查点列表
    _getFireOfficerList () {
      getFireOfficerList(this.listQuery).then(res => {
        this.total = res.data.totalCount
        this.fireOfficerList = res.data.list
      })
    },
    _getFireTree () {
      getFireTree().then((res) => {
        if (res.data) {
          this.treeData = res.data
        }
      })
    },
    handleNodeClick (data, node) {
      this.listQuery.officeId = data.id
      this._getFireOfficerList()
    },
    select (selection, row) {
      const index = this.selectedList.findIndex((item) => {
        return item.id === row.id
      })
      if (index === -1) {
        this.selectedList.push(row)
      } else {
        this.selectedList.splice(index, 1)
      }
    },
    selectAll (selection) {
      if (selection.length === 0) {
        this.fireOfficerList.forEach((k) => {
          const index = this.selectedList.findIndex((j) => {
            return k.id === j.id
          })
          if (index !== -1) {
            this.selectedList.splice(index, 1)
          }
        })
      }
      selection.forEach((k) => {
        const index = this.selectedList.findIndex((j) => {
          return k.id === j.id
        })
        if (index === -1) {
          this.selectedList.push(k)
        } else {
          this.selectedList.splice(index, 1)
        }
      })
    },
    delSelected (fireOfficer) {
      const index_fireOfficerList = this.fireOfficerList.findIndex((item) => {
        return item.id === fireOfficer.id
      })
      const index_selectedList = this.selectedList.findIndex((item) => {
        return item.id === fireOfficer.id
      })
      this.selectedList.splice(index_selectedList, 1)
      if (this.fireOfficerList.length > 0 && index_fireOfficerList !== -1) {
        this.$refs.BaseTable.toggleRowSelection(index_fireOfficerList, false)
      }
    },
    getSelectedfireOfficer () {
      return this.selectedList.map((fireOfficer) => {
        return { id: fireOfficer.id, name: fireOfficer.name }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.fireOfficerSelect {
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    .left{
        width: 218px;
        height: 100%;
        overflow-y: auto;
        overflow-x: auto;
        margin-right: 10px;
    }
    .right{
        flex: 1;
        display: flex;
        flex-direction: column;
        .el-container {
            height: 100%;
            .el-main {
                padding: 0;
                height: 100%;
                .el-table{
                    margin: 15px 0;
                }
            }
        }
        .el-aside {
            width: 198px !important;
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
                    cursor: fireOfficerer;
                }
                }
            }
        }
    }

  }
}
</style>
<style lang="scss">
.fireOfficerSelect {
  .el-dialog__body {
    padding-top: 0;
    .el-table--medium td {
        padding: 5px 0;
    }
    .el-table--group::after, .el-table--border::after {
        width: 0;
    }
    .dialog-content .el-form .el-form-item__content .el-input__inner {
        height: 30px;
        line-height: 30px;
    }
  }
}
</style>
