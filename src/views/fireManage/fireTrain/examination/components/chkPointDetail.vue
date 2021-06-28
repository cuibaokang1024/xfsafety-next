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
            <el-input :value="pointDetail.typeName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统编号：">
            <el-input :value="pointDetail.num" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在部位：">
            <el-input :value="pointDetail.part" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="具体位置：">
            <el-input :value="pointDetail.partAddr" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址：" style="flex: 0 1 100%;">
            <el-input :value="pointDetail.addr" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人：">
            <el-input :value="pointDetail.primaryName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任部门：">
            <el-input :value="pointDetail.deptName" />
          </el-form-item>
        </el-col>
      </el-form>
      <div class="record">
        <header>检查记录</header>
        <div class="content">
          <el-table
            :span-method="arraySpanMethod"
            class="el-table-white"
            :data="pointDetail.list"
            :border="true"
            style="width: 100%;margin-top: 10px;"
          >
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
    }
  }
}
</script>

<style>

</style>
