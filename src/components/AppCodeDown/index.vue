<template>
  <div class="appcodedown-container">
    <el-popover placement="bottom" width="120" trigger="hover">
      <div class="appcodedown-img">
        <el-image style="width: 100%; height: 100%" :src="require('@/components/AppCodeDown/images/QRcodeImg.png')" fit="fill" />
      </div>
      <div slot="reference" class="appcodedown-icon" />
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'AppCodeDown',
  data() {
    return {
      appCodeUrl: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.appcodedown-container {
  .appcodedown-icon {
    width: 20px;
    height: 20px;
    margin: 15px 8px 0px;
    background: url("./images/appcode.png") no-repeat;
    background-size: 100%;
  }

  .appcodedown-img {
    width: 120px;
    height: 100%;
  }
}
</style>
