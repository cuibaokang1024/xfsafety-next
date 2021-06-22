<template>
  <el-container>
    <el-header>消防平面图</el-header>
    <el-main>
      <el-button class="back" size="mini" type="primary" @click="back">返回</el-button>
      <el-table
        :data="dataList"
        style="width: 100%"
      >
        <el-table-column
          prop="location"
          label="位置"
          width="180"
        />
        <el-table-column label="平面图">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.url"
              :preview-src-list="scope.url"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
            >预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script type="text/javascript">

export default {
  name: 'FirePlan',
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    back() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-header{
    text-align: center;
    font-weight: bold;
  }
  .el-main{
    .back{
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
