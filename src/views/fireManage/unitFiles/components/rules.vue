<template>
  <div class="form-box">
    <div name="title" class="dialog-title">规章制度</div>
    <div class="dialog-content rulesForm">
      <el-form ref="rulesForm" label-width="130px">
        <div v-for="(item, index) in rulesForm" :key="index" class="form-content">
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="rulesForm[index].name" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制定时间">
              <el-date-picker
                v-model="rulesForm[index].time"
                type="date"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
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
          <el-col :span="24">
            <el-form-item label="图片">
              <div v-if="rulesForm[index].images" class="img">
                <img :src="rulesForm[index].images" width="120px" height="120px" alt="">
              </div>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getFireRuleByOffice } from '@/api/office'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      rulesForm: [
        {
          name: '名称1',
          time: '2012-09-10',
          images: '../images/logo.png',
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
          time: '2020-09-08',
          images: '',
          files: []
        }
      ]
    }
  },
  created () {
    getFireRuleByOffice({ officeId: this.id }).then(res => {
      console.log('规章制度', res)
    })
  }
}
</script>
<style lang="scss">
@import "../style/index";
</style>
