<template>
  <div class="dark">
    <el-dialog title="查看平面图" :visible.sync="dialogVisible" width="1200px">
      <div class="dialog-content">
        <div class="bg" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handlerShow() {
      this.dialogVisible = true
    },
    handlerHide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
  height: 600px;

  .bg {
    width: 100%;
    height: 100%;
    background: url(../image/0.jpg) 0 0 no-repeat;
    background-size: 100% 100%;
  }
}
</style>
