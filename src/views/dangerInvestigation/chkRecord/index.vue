<template>
  <div class="main-wrapper chkRecord">
    <div class="left-container">
      <TreeNode
        height="722px"
        :expanded-key="expandedKey"
        :tree-data="treeData"
        @handleNodeClick="handleNodeClick"
      />
    </div>
    <div class="right-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
        <el-button class="record" @click="handleExport">导出检查记录</el-button>
      </div>
      <!-- 条件框 -->
      <!-- 列表框 -->
      <div class="table-box">
        <BaseTable
          :loading="listLoading"
          :table-data="tableData"
          :table-config="tableConfig"
          :table-height="'100%'"
          :border="false"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            label="操作"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{ row }">
              <el-tooltip content="预览检查表" placement="top">
                <el-button icon="el-icon-document" type="primary" circle @click.stop="previewChkList(row)" />
              </el-tooltip>
              <el-tooltip content="生成隐患报告" placement="top">
                <el-button icon="el-icon-c-scale-to-original" type="success" circle @click.stop="dangerReport(row)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  circle
                  @click.stop="handleDelete(row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
      <div class="pagination-box">
        <Pagination
          v-show="total > 0"
          :total="total"
          v-model:page="listQuery.page"
          v-model:limit="listQuery.pageSize"
          @pagination="_getChkListPlan"
        />
      </div>
      <el-dialog
        v-if="dialogVisible"
        class="chkPreview"
        :destroy-on-close="true"
        v-model:visible="dialogVisible"
        width="800px"
        :close-on-click-modal="false"
      >
        <div name="title" class="dialog-title">单位档案</div>
        <div
          id="chkPreview"
          class="dialog-content"
          style="height: 600px;overflow: auto;padding-right: 10px;"
        >
          <chk-preview :id="viewchkPreviewId" />
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="hide()">关闭</el-button>
          <el-button @click="print()">打印</el-button>
        </div>
      </el-dialog>
      <!-- 列表框 -->
      <!-- 隐患报告 -->
      <el-dialog
        class="dangerReport"
        width="950px"
        :visible="dangerReportVisible"
        :show-close="false"
      >
        <div class="top">
          <el-button type="primary" icon="el-icon-printer" @click="dangerReportPrint">打印</el-button>
          <span class="h2">生成隐患报告</span>
          <el-button class="free" type="success" @click="freeCombinationVisible=true">
            <img src="./images/filter.png" alt>
            <span>筛选自由组合</span>
          </el-button>
        </div>
        <el-table
          id="dangerReport"
          :data="dangerTable"
          class="danger-table"
          border
          :span-method="arraySpanMethod"
        >
          <el-table-column
            v-for="item in dangerTitle"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
          >
            <template v-slot="{ row }">
              <span v-if="row.title">{{ row.title }}</span>
              <!-- v-if="item.type === 'text'" -->
              <span>{{ row[item.prop] }}</span>
              <!-- <img v-if="item.type === 'img'" src="" alt=""> -->
            </template>
          </el-table-column>
        </el-table>
        <div name="footer" class="dialog-footer">
          <el-button @click="closeReport()">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 自由组合弹窗 -->
      <el-dialog
        class="freeCombination"
        width="600px"
        :visible="freeCombinationVisible"
        :show-close="false"
        title="请选择要显示的内容"
      >
        <ul>
          <li v-for="item in dangerTitle" :key="item.prop" @click="changeSelected(item)">
            <span>{{ item.label }}</span>
            <img v-if="item.isSelected" src="./images/gou.png" alt>
          </li>
        </ul>
        <div name="footer" class="dialog-footer">
          <el-button type="info" @click="reset()">重置</el-button>
          <el-button type="primary" @click="submit()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getChkListPlan, deleteChkListPlan } from '@/api/chkList'
import { getOfficeArea } from '@/api/areaManage'
import '@/styles/list.scss'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import TreeNode from '@/components/treeNode'
import ChkPreview from '../components/chkPreview'
import formAction from '@/mixins/form.js'
import printJS from 'print-js'
export default {
  /* 监管单位档案 */
  name: 'SupervisionUnitRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeNode,
    ChkPreview
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        areaId: '',
        name: '',
        officeName: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      dangerReportVisible: false,
      freeCombinationVisible: false,
      dialogVisible: false,
      viewchkPreviewId: '',
      treeData: [],
      expandedKey: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '名称：',
            name: 'name',
            placeholder: '请输名称'
          },
          {
            type: 'text',
            label: '单位：',
            name: 'officeName',
            placeholder: '请输入单位'
          },
          {
            type: 'date',
            label: '检查时间：',
            name: 'startTime',
            placeholder: '请选择检查时间'
          },
          {
            type: 'date',
            label: '检查结束时间：',
            name: 'endTime',
            placeholder: '请选择结束时间'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '检查计划',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkUser',
          label: '检查人员',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkTime',
          label: '检查时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkEndTime',
          label: '检查结束时间',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      dangerTitle: [
        {
          prop: 'sort',
          label: '排序',
          type: 'text',
          isSelected: false
        },
        {
          prop: 'describe',
          label: '隐患描述',
          type: 'text',
          isSelected: false
        },
        {
          prop: 'type',
          label: '隐患类型',
          type: 'text',
          isSelected: false
        },
        {
          prop: 'law',
          label: '法律法规',
          type: 'text',
          isSelected: false
        },
        {
          prop: 'picture',
          label: '隐患图片',
          type: 'img',
          isSelected: false
        },
        {
          prop: 'opinion',
          label: '整改意见',
          type: 'text',
          isSelected: false
        },
        {
          prop: 'status',
          label: '隐患状态',
          type: 'text',
          isSelected: false
        },
        {
          prop: 'content',
          label: '整改内容',
          type: 'img',
          isSelected: false
        }
      ],
      dangerTable: [
        {
          title: '重大安全隐患',
          id: 1
        },
        {
          sort: 1,
          id: 11,
          describe: '描述dfasdfasdf阿斯顿发送到发斯蒂芬',
          type: '类型发送到发送到发文发送到发送到发斯蒂芬',
          law: '法律法规SDFVZXCBTJSHFGSDFGS',
          picture: '隐患图片yfdresrtyuifdxzcsdtyu8oytresefyiu返回VB不能',
          opinion:
            '隐患意见欧艾斯活动范围并发包水电费卡价格了就无法，上面的你发没上班马上到回归法开始的复活卡无额话费马上答复',
          status: '状态安慰法师打发后提交入库的法规和地方规划的',
          content:
            '内容东方故事怒I欧赔模拟试题王企鹅SDASDSERTSDFG   SE SDFGSDFTWERTAWEAT'
        },
        {
          title: '一般安全隐患',
          id: 2
        },
        {
          sort: 2,
          id: 12,
          describe: '一般描述',
          type: '一般类型',
          law: '一般法律法规',
          picture: '一般隐患图片',
          opinion: '一般隐患意见',
          status: '一般状态',
          content: '一般内容'
        }
      ]
    }
  },
  created () {
    this._getChkListPlan()
    this._getOfficeArea()
  },
  methods: {
    _getChkListPlan () {
      getChkListPlan(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 获取tree
    _getOfficeArea () {
      getOfficeArea().then(res => {
        this.treeData = res.data
        this.expandedKey = [res.data[0].id]
      })
    },
    // 树状方法
    handleNodeClick (data, node) {
      this.listQuery.areaId = data.id
      this._getChkListPlan()
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getChkListPlan()
    },
    // 删除数据
    deleteData (data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      deleteChkListPlan(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getChkListPlan()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    previewChkList (data) {
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
          return
        } else if (data.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
          return
        } else {
          this.viewchkPreviewId = data[0].id
        }
      } else {
        this.viewchkPreviewId = data.id
      }
      this.dialogVisible = true
    },
    changeSelected (item) {
      if (item.isSelected) {
        item.isSelected = false
      } else {
        item.isSelected = true
      }
    },
    dangerReport () {
      this.dangerReportVisible = true
    },
    closeReport () {
      this.dangerReportVisible = false
    },
    dangerReportPrint () {
      printJS({
        printable: 'dangerReport',
        type: 'html',
        style: `@page{size:auto;margin: 0cm 1cm 0cm 1cm;}
            #dangerReport{margin-top: 50px;}
            #dangerReport .has-gutter tr{background-color: #D2D2D2}
            #dangerReport table{text-align: left;border-collapse: collapse;width: 100%;}
            th,td{border: 1px solid #E1E1E1;padding: 0 10px;word-wrap:break-word;}
            th{border:none}
            tr{border: 1px solid #E1E1E1;}`
      })
    },
    reset () {
      this.freeCombinationVisible = false
    },
    submit () {
      this.freeCombinationVisible = false
    },
    print () {
      printJS({
        printable: 'chkPreview',
        type: 'html',
        style:
          '.chkPreview >.title{font-size: 14px;text-align: center;}table,tr,th,td{border: 1px solid #d6d6d6;}table{border-collapse: collapse;width: 100%;color: #555;font-size: 14px;table-layout: fixed;}th,td{padding: 6px 12px}th,td.title{font-weight: bold;text-align: center;}th,td .img-wrapper{display: flex;flex-wrap: wrap}th,td .img-wrapper .el-image{margin-right: 15px}.checkbox-wrapper{display: flex;align-items: center;justify-content: space-around}'
      })
    },
    hide () {
      this.dialogVisible = false
    },
    handleExport () {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableConfig.map(item => {
          if (item.label) {
            return item.label
          }
        })
        const filterVal = this.tableConfig.map(item => {
          if (item.prop) {
            return item.prop
          }
        })
        const data = this.formatJson(filterVal.slice(1))
        excel.export_json_to_excel({
          header: tHeader.slice(1),
          data,
          filename: '检查记录'
        })
      })
    },
    formatJson (filterVal) {
      return this.tableData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.title) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 8
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chkRecord {
  display: flex;
  flex-direction: row;
  .left-container {
    width: 260px;
    padding: 15px;
    margin-right: 20px;
    overflow: hidden;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.07);
  }
  .right-container {
    width: calc(100% - 280px);
  }
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  :-webkit-scrollbar {
    width: 4px;
    height: 0px;
    border-radius: 4px;
    background-color: #c0c0c0;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #21345f;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #4c79eb;
  }

  ::-webkit-scrollbar-thumb:hover {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #287bbb;
  }
}
</style>
<style lang="scss">
@import "./printStyle.css";
.chkRecord {
  .el-dialog__body {
    padding-top: 10px;
  }
}
.dangerReport .top {
  display: flex;
  justify-content: space-between;
  .free > span {
    display: flex;
    align-items: center;
  }
  img {
    height: 18px;
    width: 18px;
    margin-right: 2px;
  }
}
.dangerReport .h2 {
  color: #001c85;
  font-size: 24px;
}
.freeCombination {
  .el-dialog {
    border: 16px solid #fff;
    color: #fff;
    background: #2c4586;
    .el-dialog__title {
      color: #fff;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  li {
    height: 38px;
    width: 123px;
    background: #213874;
    color: #fff;
    margin-bottom: 12px;
    line-height: 38px;
    text-align: center;
    position: relative;
    img {
      height: 20px;
      width: 25px;
      right: 0;
      bottom: 0;
      position: absolute;
    }
  }
  .el-dialog__footer {
    border-top: none;
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
