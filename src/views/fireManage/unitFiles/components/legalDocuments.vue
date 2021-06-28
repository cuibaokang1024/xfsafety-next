<template>
  <div class="form-box">
    <div name="title" class="dialog-title">合法性文件</div>
    <div class="dialog-content rulesForm">
      <el-form ref="rulesForm" label-width="130px">
        <div v-for="(item, index) in rulesForm" :key="index" class="form-content">
          <el-col :span="24">
            <el-form-item label="文书名称">
              <el-input v-model="rulesForm[index].name" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="培训文件" style="margin-bottom: 20px;">
              <el-table :data="rulesForm[index].files">
                <el-table-column
                  prop="icon"
                  label="图标"
                />
                <el-table-column
                  prop="fileName"
                  label="名称"
                />
                <el-table-column
                  prop="size"
                  label="大小"
                />
                <el-table-column
                  label="操作"
                  width="100"
                >
                  <template>
                    <el-button type="text" size="small">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
  </div>

</template>
<script>
export default {
  data () {
    return {
      rulesForm: [
        {
          name: '名称1',
          files: [
            {
              icon: '',
              fileName: '111',
              size: '2k'
            },
            {
              icon: '',
              fileName: '222',
              size: '3m'
            }
          ]
        },
        {
          name: '名称2',
          files: []
        }
      ]
    }
  }
}
</script>
<style lang="scss">
@import "../style/index";
</style>
