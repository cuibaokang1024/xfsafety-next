<template>
  <div class="content">
    <div class="left">
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
            :table-data="subjectList"
            :table-config="tableConfig"
            :table-height="'397px'"
            :border="true"
            :disabled-all-check="true"
            @select="select"
          />
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="listQuery.page"
            v-model:limit="listQuery.limit"
            @pagination="_getSubjectList"
          />
        </el-main>
        <el-aside>
          <div class="selected-list">
            <ul>
              <li
                v-for="subject in selectedList"
                :key="subject.id"
                @dblclick="delSelected(subject)"
              >{{ subject.name }}</li>
            </ul>
          </div>
        </el-aside>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getSubjectList } from '@/api/train'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
var idSeq = Date.now()
export default {
  name: 'SelectSubject',
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
  data () {
    return {
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      total: 20,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '题目名称:',
            name: 'name',
            placeholder: '请输入题目名称'
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
          label: '名称',
          align: 'center'

        },
        {
          prop: 'single',
          label: '单选题数',
          align: 'center'
        },
        {
          prop: 'multiple',
          label: '多选题数',
          align: 'center',
          width: ''
        },
        {
          prop: 'judge',
          label: '判断题数',
          align: 'center'
        }
      ],
      subjectList: [],
      selectedList: []
    }
  },
  created () {
    this.selectedList = this.initVal.map((item) => {
      return {
        ...item,
        _id: item.id || ++idSeq, // 回显过来的数据需要加上标记，原样返回
        name: item.questionTypeName,
        id: item.questionTypeId
      }
    })
    this._getSubjectList()
  },
  methods: {
    // 获取巡查点列表
    _getSubjectList () {
      getSubjectList(this.listQuery).then(res => {
        this.total = res.data.pageUtils.totalCount
        this.subjectList = res.data.pageUtils.list
        this.$nextTick(() => {
          this.selectInitVal()
        })
      })
    },
    // 回显选中项
    selectInitVal () {
      if (this.initVal) {
        if (this.subjectList.length > 0) {
          this.$refs.BaseTable.clearSelection()
          this.selectedList.forEach(item => {
            const index = this.subjectList.findIndex(point => {
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
      this._getSubjectList()
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
    delSelected (point) {
      // eslint-disable-next-line camelcase
      const index_subjectList = this.subjectList.findIndex(item => {
        return item.id === point.id
      })
      // eslint-disable-next-line camelcase
      const index_selectedList = this.selectedList.findIndex(item => {
        return item.id === point.id
      })
      this.selectedList.splice(index_selectedList, 1)
      // eslint-disable-next-line camelcase
      if (this.subjectList.length > 0 && index_subjectList !== -1) {
        this.$refs.BaseTable.toggleRowSelection(index_subjectList, false)
      }
    },
    getSelectedSubject () {
      return this.selectedList.map((item) => {
        if (item._id) {
          return {
            ...item,
            id: item._id,
            questionTypeId: item.id,
            questionTypeName: item.name
          }
        }
        return {
          choiceCount: null,
          choiceTotal: item.single,
          judgeCount: null,
          judgeTotal: item.judge,
          manyCount: null,
          manyTotal: item.multiple,
          questionTypeId: item.id,
          questionTypeName: item.name
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.subjectSelect {
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
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
        width: 200px !important;
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
.subjectSelect {
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
