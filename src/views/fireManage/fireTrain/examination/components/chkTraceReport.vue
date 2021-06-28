<template>
  <el-dialog
    v-if="dialogVisible"
    class="traceForm"
    v-model:visible="dialogVisible"
    width="1000px"
  >
    <div name="title" class="dialog-title">巡查报表</div>
    <div v-loading="loading" class="dialog-content" style="height: 550px">
      <div v-if="chkData" style="height: 100%;">
        <div class="header">
          <span>巡检任务：{{ chkData.plan.name }}</span>
          <span>巡检时间：{{ `${chkData.plan.startTime}-${chkData.plan.endTime}` }}</span>
          <span>应巡检：{{ chkData.plan.chkNum }}</span>
          <span>实际巡检：{{ chkData.plan.actualNum }}</span>
        </div>
        <div class="content">
          <div v-for="(mark,index) in chkData.marks" :key="mark.id" class="chkList">
            <el-divider />
            <div class="header">
              <span>{{ `第${index+1}次巡检` }}</span>
              <span>{{ `${mark.startTime}-${mark.endTime}` }}</span>
              <span>应巡检点数{{ mark.chkNum }}</span>
              <span>实际巡检点数{{ mark.actualNum }}</span>
              <el-button @click="getOnetraceData(mark)">详情</el-button>
            </div>
            <div class="markContent">
              <div v-if="mark.checked.length>0" class="chk">
                <header>已巡检</header>
                <div v-if="!mark.pureChecked">
                  <el-table
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
                        return row.rangeType===1?row.isNormal===1?'是':row.isNormal===0?'否':'':row.value||''
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
                      ,
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
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChkTraceReport',
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
      dialogVisible: false
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
    }

  }
}
</script>

<style lang="scss" scoped>
.traceForm{
    .dialog-content{
    display: flex;
    flex-direction: column;
    .header{
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
    }
    .content{
        display: flex;
        height: 100%;
        padding: 0 10px;
        flex-direction: column;
        overflow: auto;
        .chkList{
        margin: 10px 0;
        .header{
            font-size: 14px;
        }
        header{
            font-weight: bold;
        }
        }
    }
    }
}
</style>
