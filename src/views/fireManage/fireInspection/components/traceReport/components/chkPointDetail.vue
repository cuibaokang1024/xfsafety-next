<template>
  <el-dialog
    v-if="dialogVisible"
    class="dark chkPointDetail"
    v-model:visible="dialogVisible"
    width="800px"
  >
    <div name="title" class="dialog-title">巡查点信息</div>
    <div class="dialog-content" style="height: 550px;">
      <el-form ref="form" disabled :model="pointDetail" label-width="100px">
        <el-col :span="12">
          <el-form-item label="巡查点类型：">
            <el-input v-model="pointDetail.typeName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统编号：">
            <el-input v-model="pointDetail.num" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在部位：">
            <el-input v-model="pointDetail.part" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="具体位置：">
            <el-input v-model="pointDetail.partAddr" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址：" style="flex: 0 1 100%;">
            <el-input v-model="pointDetail.addr" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人：">
            <el-input v-model="pointDetail.primaryName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任部门：">
            <el-input v-model="pointDetail.deptName" />
          </el-form-item>
        </el-col>
      </el-form>
      <div class="record">
        <header>检查记录</header>
        <div class="content">
          <el-table
            :span-method="arraySpanMethod"
            :data="pointDetail.list"
            :max-height="270"
            :border="true"
            style="margin-bottom: 1px;"
          >
            <el-table-column
              prop="name"
              label="设备名称"
              :formatter="function(row, column, cellValue, index){
                if(row.name){
                  return row.name
                }else{
                  return '未绑定设备设施'
                }
              }"
            />
            <el-table-column
              prop="content"
              label="检查内容"
              :formatter="function(row, column, cellValue, index){
                if(row.content){
                  return row.content
                }else{
                  return ''
                }
              }"
            />
            <el-table-column
              prop="rangeType"
              label="检查结果"
              :formatter="function(row, column, cellValue, index){
                if(!row.children){
                  return ''
                }
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
              :formatter="function(row, column, cellValue, index){
                if(row.chkDate){
                  return row.chkDate
                }else{
                  return ''
                }
              }"
            />
          </el-table>
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
  name: 'ChkPointDetail',
  props: {
    pointDetail: {
      type: Object,
      default: null
    },
    merge: {
      type: Array,
      default: () => []
    },
    otherMerge: {
      type: Array,
      default: () => []
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
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const index = this.merge.findIndex((item) => {
          return rowIndex === item.rowIndex
        })
        if (index !== -1) {
          return {
            rowspan: this.merge[index].rowspan,
            colspan: 1
          }
        } else if (row.children) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      } if (columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
      if (columnIndex === 2) {
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
        } else if (row.children) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .chkPointDetail{
    .dialog-content{
      display: flex;
      flex-direction: column;
      .record{
        flex:1;
        header{
          margin-bottom: 10px;
          text-align: center;
          color: #fff;
          font-weight: bold;
        }
        .content{
          .el-table__body-wrapper{
            padding-bottom: 1px;
          }
        }
      }
    }
  }
</style>
