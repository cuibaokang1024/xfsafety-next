<template>
  <div class="form-box">
    <div name="title" class="dialog-title">消防预案</div>
    <div class="dialog-content rulesForm">
      <el-form ref="fireFightingPlanForm" label-width="130px">
        <div v-for="(item, index) in fireFightingPlanForm" :key="index" class="form-content">
          <el-col :span="12">
            <el-form-item label="消防名称">
              <el-input v-model="fireFightingPlanForm[index].name" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制定时间">
              <el-date-picker
                v-model="fireFightingPlanForm[index].time"
                type="date"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简要">
              <el-input v-model="fireFightingPlanForm[index].summary" placeholder="请输入" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" style="margin-bottom: 20px;">
              <el-table :data="fireFightingPlanForm[index].files">
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
import { getFirePlanByOffice } from '@/api/office'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      fireFightingPlanForm: [
        {
          name: '名称1',
          time: '2012-09-10',
          summary: '摘要总则',
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
          summary: '爱的发声',
          files: []
        }
      ]
    }
  },
  created () {
    getFirePlanByOffice({ officeId: this.id }).then(res => {
      console.log('消防预案的结果', res)
    })
  }
}
</script>
<style lang="scss">
@import "../style/index";
</style>
