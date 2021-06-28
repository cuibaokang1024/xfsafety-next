<template>
  <div class="content">
    <div class="left">
      <TreeNode
        :model="'childClick'"
        :lazy="true"
        :load="loadNode"
        @handleNodeClick="handleNodeClick"
      />
    </div>
    <div class="right">
      <el-container>
        <el-main>
          <SearchForm
            style="text-align: left;padding: 0;"
            :form-option="searchFormOption"
            @search="handleFilter"
          />
          <BaseTable
            ref="BaseTable"
            :loading="listLoading"
            :table-data="pointList"
            :table-config="tableConfig"
            :table-height="'397px'"
            :border="true"
            :disabled-all-check="true"
            @select="select"
            @selectAll="selectAll"
          />
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="listQuery.page"
            v-model:limit="listQuery.pageSize"
            @pagination="_getPointList"
          />
        </el-main>
        <el-aside>
          <div class="selected-list">
            <ul>
              <li
                v-for="point in selectedList"
                :key="point.id"
                @dblclick="delSelected(point)"
              >{{ point.num }}</li>
            </ul>
          </div>
        </el-aside>
      </el-container>
    </div>
  </div>
</template>

<script>
import { handlerPointList, getLabel } from '@/api/chk'
import { getPartsList, getPartsAddrList } from '@/api/partsList'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import TreeNode from '@/components/treeNode'

export default {
  name: 'PointSelect',
  components: {
    SearchForm,
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
        num: '',
        partId: '',
        partAddrId: '',
        typeId: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      total: 20,
      partsList: [],
      pointsType: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '巡查点编号:',
            name: 'num',
            placeholder: '请输入编号'
          },
          {
            type: 'select',
            label: '巡查点类型:',
            name: 'typeId',
            placeholder: '请选择类型',
            dataList: []
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
          prop: 'num',
          label: '编号',
          align: 'center',
          width: '120'
        },
        {
          prop: 'typeName',
          label: '类型',
          align: 'center',
          width: '82'
        },
        {
          prop: 'partAddr',
          label: '具体位置',
          align: 'center',
          width: ''
        },
        {
          prop: 'addr',
          label: '详细地址',
          align: 'center',
          width: '102'
        },
        {
          prop: 'partName',
          label: '所在部位',
          align: 'center',
          width: ''
        },

        {
          prop: 'dutyUser',
          label: '责任人',
          align: 'center',
          width: '115'
        },
        {
          prop: 'deptName',
          label: '责任部门',
          align: 'center',
          width: ''
        }
      ],
      pointList: [],
      selectedList: []
    }
  },
  mounted () {},
  created () {
    this.selectedList = this.initVal.slice()
    this._getPointList()
    this._getLabel()
  },
  methods: {
    // 获取巡查点列表
    _getPointList () {
      handlerPointList(this.listQuery).then(res => {
        this.total = res.data.totalCount
        this.pointList = res.data.list
        this.$nextTick(() => {
          this.selectInitVal()
        })
      })
    },
    // 获取检查点类型
    _getLabel () {
      getLabel().then(res => {
        if (res.data.length > 0) {
          this.searchFormOption.config = this.searchFormOption.config.map(
            item => {
              if (item.name === 'typeId') {
                return { ...item, dataList: res.data }
              } else {
                return { ...item }
              }
            }
          )
        }
      })
    },
    // 获取楼座列表
    _getPartsList (resolve) {
      getPartsList()
        .then(res => {
          if (res.data) {
            resolve(res.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 根据楼座查询楼层
    _getPartsAddrList (node, resolve) {
      getPartsAddrList({ partsId: node.data.id })
        .then(res => {
          if (res.data) {
            resolve(res.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadNode (node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
        this._getPartsList(resolve)
      }
      // 其余节点处理
      if (node.level === 1) {
        // 把resolve传到自己的异步中去
        this._getPartsAddrList(node, resolve)
      } else {
        // (当前逻辑只有二级节点)
        resolve([])
      }
    },
    handleNodeClick (data, node) {
      if (node.level === 1) {
        this.listQuery.partId = data.id
        this.listQuery.partAddrId = ''
      } else {
        this.listQuery.partId = ''
        this.listQuery.partAddrId = data.id
      }
      this._getPointList()
    },
    // 回显选中项
    selectInitVal () {
      if (this.initVal) {
        if (this.pointList.length > 0) {
          this.$refs.BaseTable.clearSelection()
          this.selectedList.forEach(item => {
            const index = this.pointList.findIndex(point => {
              return point.id === item.id
            })
            if (index !== -1) {
              this.$refs.BaseTable.toggleRowSelection(index, true)
            }
          })
        }
      }
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getPointList()
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
    selectAll (selection) {
      if (selection.length === 0) {
        this.pointList.forEach(k => {
          const index = this.selectedList.findIndex(j => {
            return k.id === j.id
          })
          if (index !== -1) {
            this.selectedList.splice(index, 1)
          }
        })
      }
      selection.forEach(k => {
        const index = this.selectedList.findIndex(j => {
          return k.id === j.id
        })
        if (index === -1) {
          this.selectedList.push(k)
        } else {
          this.selectedList.splice(index, 1)
        }
      })
    },
    delSelected (point) {
      const index_pointList = this.pointList.findIndex(item => {
        return item.id === point.id
      })
      const index_selectedList = this.selectedList.findIndex(item => {
        return item.id === point.id
      })
      this.selectedList.splice(index_selectedList, 1)
      if (this.pointList.length > 0 && index_pointList !== -1) {
        this.$refs.BaseTable.toggleRowSelection(index_pointList, false)
      }
    },
    getSelectedPoint () {
      return this.selectedList
    }
  }
}
</script>

<style scoped lang="scss">
.pointSelect {
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: 218px;
      height: 100%;
      overflow-y: auto;
      margin-right: 10px;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .el-container {
        height: 100%;
        .el-main {
          padding: 0;
          height: 100%;
          .el-table {
            margin: 15px 0;
          }
        }
      }
      .el-aside {
        width: 168px !important;
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
}
</style>
<style lang="scss">
.pointSelect {
  .el-dialog__body {
    padding-top: 0;
    .el-table--medium td {
      padding: 5px 0;
    }
    .el-table--group::after,
    .el-table--border::after {
      width: 0;
    }
    .dialog-content .el-form .el-form-item__content .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
