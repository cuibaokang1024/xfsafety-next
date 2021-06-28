<template>
  <el-dialog
    v-if="dialogVisible"
    class="traceForm inspectedForm"
    v-model:visible="dialogVisible"
    width="1000px"
  >
    <div name="title" class="dialog-title">巡查报表</div>
    <div id="report" v-loading="loading" class="dialog-content" style="height: 800px">
      <div v-if="chkData" style="height: 100%;display: flex;flex-direction: column">
        <div class="header">
          <span>巡检任务：{{ chkData.plan.name }}</span>
          <span>巡检时间：{{ `${chkData.plan.startTime}-${chkData.plan.endTime}` }}</span>
          <span>应巡检：{{ chkData.plan.chkNum }}</span>
          <span>实际巡检：{{ chkData.plan.actualNum }}</span>
        </div>
        <div class="content" style="flex: 1;">
          <span v-if="chkData.totalUnCheck.length" class="inspected-title" style="margin: 15px 0;">未巡检</span>
          <BaseTable
            v-if="chkData.totalUnCheck.length"
            :loading="notInspectedLoading"
            :table-data="chkData.totalUnCheck"
            :table-config="inspectedTableConfig"
          />
          <span v-if="chkData.totalChecked.length" class="inspected-title" style="margin: 15px 0;">已巡检</span>
          <BaseTable
            v-if="chkData.totalChecked.length"
            :loading="inspectedLoading"
            :table-data="chkData.totalChecked"
            :table-config="inspectedTableConfig"
          />
          <div v-for="(mark,index) in chkData.marks" :key="mark.id" class="chkList">
            <el-divider />
            <div class="header">
              <span>{{ `第${index+1}次巡检` }}</span>
              <span>{{ `${mark.startTime}-${mark.endTime}` }}</span>
              <span>应巡检点数{{ mark.chkNum }}</span>
              <span>实际巡检点数{{ mark.actualNum }}</span>
              <el-button id="btn-detail" @click="getOnetraceData(mark)">详情</el-button>
            </div>
            <div class="markContent">
              <div v-if="mark.checked.length>0" class="chk">
                <header>已巡检</header>
                <div v-if="!mark.pureChecked">
                  <el-table
                    v-if="mark.checked.length"
                    class="el-table-white"
                    :data="mark.checked"
                    :border="true"
                    style="width: 100%;margin-top: 10px;"
                  >
                    <el-table-column
                      prop="num"
                      label="巡查点编号"
                    />
                    <el-table-column
                      prop="typeName"
                      label="巡查点类型"
                    />
                    <el-table-column
                      prop="part"
                      label="所在部位"
                    />
                    <el-table-column
                      prop="partAddr"
                      label="具体位置"
                    />
                    <el-table-column
                      prop="addr"
                      label="详细地址"
                    />
                    <el-table-column
                      prop="isDanger"
                      label="是否有隐患"
                      :formatter="function(row, column, cellValue, index){
                        return row.isDanger===1?'是':row.isDanger===0?'否':''
                      }"
                    />
                    <el-table-column
                      prop="chkUser"
                      label="巡检人"
                    />
                    <el-table-column
                      prop="chkDate"
                      label="巡检时间"
                    />
                  </el-table>
                </div>
                <div v-else>
                  <el-table
                    v-if="mark.noEquipArr&&mark.noEquipArr.length"
                    class="el-table-white"
                    :data="mark.noEquipArr"
                    :border="true"
                    style="width: 100%;margin-top: 10px;"
                  >
                    <el-table-column
                      prop="num"
                      label="巡查点编号"
                    />
                    <el-table-column
                      prop="typeName"
                      label="巡查点类型"
                    />
                    <el-table-column
                      prop="part"
                      label="所在部位"
                    />
                    <el-table-column
                      prop="partAddr"
                      label="具体位置"
                    />
                    <el-table-column
                      prop="addr"
                      label="详细地址"
                    />
                    <el-table-column
                      prop="isDanger"
                      label="是否有隐患"
                      :formatter="function(row, column, cellValue, index){
                        return row.isDanger===1?'是':row.isDanger===0?'否':''
                      }"
                    />
                    <el-table-column
                      prop="chkUser"
                      label="巡检人"
                    />
                    <el-table-column
                      prop="chkDate"
                      label="巡检时间"
                    />
                  </el-table>
                  <el-table
                    v-if="mark.hasEquipArr&&mark.hasEquipArr.length"
                    :span-method="arraySpanMethod"
                    class="el-table-white"
                    :data="mark.hasEquipArr"
                    :border="true"
                    style="width: 100%;margin-top: 10px;"
                  >
                    <el-table-column
                      prop="num"
                      label="巡查点编号"
                    />
                    <el-table-column
                      prop="typeName"
                      label="巡查点类型"
                    />
                    <el-table-column
                      prop="addr"
                      label="详细地址"
                    />
                    <el-table-column
                      prop="name"
                      label="设备名称"
                    />
                    <el-table-column
                      prop="content"
                      label="检查内容"
                    />
                    <el-table-column
                      prop="rangeType"
                      label="检查结果"
                      :formatter="function(row, column, cellValue, index){
                        return row.rangeType===1?row.value===0?'是':row.value===1?'否':'':row.value||''
                      }"
                    />
                    <el-table-column
                      prop="chkUser"
                      label="巡检人"
                    />
                    <el-table-column
                      prop="chkDate"
                      label="巡检时间"
                    />
                  </el-table>
                </div>

              </div>
              <div v-if="mark.notChecked.length>0" class="nochk">
                <header>未巡检</header>
                <div v-if="!mark.purenotChecked">
                  <el-table
                    v-if="mark.notChecked.length"
                    class="el-table-white"
                    :data="mark.notChecked"
                    :border="true"
                    style="width: 100%;margin-top: 10px;"
                  >
                    <el-table-column
                      prop="num"
                      label="巡查点编号"
                    />
                    <el-table-column
                      prop="typeName"
                      label="巡查点类型"
                    />
                    <el-table-column
                      prop="part"
                      label="所在部位"
                    />
                    <el-table-column
                      prop="partAddr"
                      label="具体位置"
                    />
                    <el-table-column
                      prop="addr"
                      label="详细地址"
                    />
                    <el-table-column
                      prop="isDanger"
                      label="是否有隐患"
                      :formatter="function(row, column, cellValue, index){
                        return ''
                      }"
                    />
                    <el-table-column
                      prop="chkUser"
                      label="巡检人"
                    />
                    <el-table-column
                      prop="chkDate"
                      label="巡检时间"
                    />
                  </el-table>
                </div>
                <div v-else>
                  <el-table
                    v-if="mark.noCheckNoEquipArr&&mark.noCheckNoEquipArr.length"
                    class="el-table-white"
                    :data="mark.noCheckNoEquipArr"
                    :border="true"
                    style="width: 100%;margin-top: 10px;"
                  >
                    <el-table-column
                      prop="num"
                      label="巡查点编号"
                    />
                    <el-table-column
                      prop="typeName"
                      label="巡查点类型"
                    />
                    <el-table-column
                      prop="part"
                      label="所在部位"
                    />
                    <el-table-column
                      prop="partAddr"
                      label="具体位置"
                    />
                    <el-table-column
                      prop="addr"
                      label="详细地址"
                    />
                    <el-table-column
                      prop="isDanger"
                      label="是否有隐患"
                      :formatter="function(row, column, cellValue, index){
                        return ''
                      }"
                    />
                    <el-table-column
                      prop="chkUser"
                      label="巡检人"
                    />
                    <el-table-column
                      prop="chkDate"
                      label="巡检时间"
                    />
                  </el-table>
                  <el-table
                    v-if="mark.noCheckHasEquipArr&&mark.noCheckHasEquipArr.length"
                    :span-method="arraySpanMethod"
                    class="el-table-white"
                    :data="mark.noCheckHasEquipArr"
                    :border="true"
                    style="width: 100%;margin-top: 10px;"
                  >
                    <el-table-column
                      prop="num"
                      label="巡查点编号"
                    />
                    <el-table-column
                      prop="typeName"
                      label="巡查点类型"
                    />
                    <el-table-column
                      prop="addr"
                      label="详细地址"
                    />
                    <el-table-column
                      prop="name"
                      label="设备名称"
                    />
                    <el-table-column
                      prop="content"
                      label="检查内容"
                    />
                    <el-table-column
                      prop="rangeType"
                      label="检查结果"
                      :formatter="function(row, column, cellValue, index){
                        return ''
                      }"
                    />
                    <el-table-column
                      prop="chkUser"
                      label="巡检人"
                    />
                    <el-table-column
                      prop="chkDate"
                      label="巡检时间"
                    />
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div name="footer" class="dialog-footer">
      <el-button @click="print()">打印</el-button>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import printJS from 'print-js'
import BaseTable from '@/components/baseTable'

export default {
  name: 'ChkTraceReport',
  components: {
    BaseTable
  },
  props: {
    chkData: {
      type: Object,
      default: () => null
    },
    merge: {
      type: Array,
      default: () => []
    },
    otherMerge: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      notInspectedLoading: false,
      inspectedLoading: false,
      inspectedTableConfig: [
        {
          prop: 'num',
          label: '巡检点编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '巡检点类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'partsName',
          label: '所在部位',
          align: 'left',
          width: ''
        },
        {
          prop: 'addrName',
          label: '具体位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '详细地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'isDanger',
          label: '是否有隐患',
          align: 'left',
          width: ''
        },
        {
          prop: 'shouldCheck',
          label: '应巡检',
          align: 'left',
          width: ''
        },
        {
          prop: 'checked',
          label: '实际巡检',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
    },
    getOnetraceData (data) {
      this.$emit('getOnetraceData', data)
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        const index = this.merge.findIndex((item) => {
          return rowIndex === item.rowIndex
        })
        if (index !== -1) {
          return {
            rowspan: this.merge[index].rowspan,
            colspan: 1
          }
        }
      } if (columnIndex === 4) {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
      if (columnIndex === 5) {
        return {
          rowspan: 1,
          colspan: 1
        }
      } else {
        const index = this.otherMerge.findIndex((item) => {
          return rowIndex === item.rowIndex
        })
        if (index !== -1) {
          return {
            rowspan: this.otherMerge[index].rowspan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    print () {
      printJS({
        printable: 'report',
        type: 'html',
        ignoreElements: ['btn-detail'],
        style: '#report{display: flex;flex-direction: column;}#report .header{font-size: 16px;display: flex;justify-content: space-between;align-items: center;font-weight: bold;}#report .content{display: flex;height: 100%;padding: 0;flex-direction: column;}#report .content .chkList{margin: 10px 0;}#report .content .chkList .header{font-size: 14px;}#report .content .chkList header{font-weight: bold;}.el-table--border th, .el-table--border td {border-right: 1px solid #000;}.el-table--border th, .el-table--border td {border-right: 1px solid #333;padding: 10px 0;border-bottom: 1px solid #333;text-align: center;}.el-table--border{border-left: 1px solid #333;}.el-table th {border-top: 1px solid #333;}',
        css: '../style/print.css',
        scanStyles: false
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import '../style/report.scss';
</style>
<style lang="scss">
.inspectedForm {
  .el-table {
    flex: none !important;
    color: #333;
    .el-dialog {
      margin-top: 5vh !important;
    }
    th, td {
      color: #333;
    }
  }
  .inspected-title {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .content {
    margin-top: 15px;
  }
  .el-table--border th, .el-table--border td {
    border-left: 1px solid #dfe6ec;
  }
  .el-table:not(.el-table-white) .el-table__body tr td {
    border-color: #dfe6ec;
  }
  .el-table:not(.el-table-white) th.is-leaf, .el-table:not(.el-table-white) th {
    border: 1px solid #dfe6ec;
  }
}
</style>
