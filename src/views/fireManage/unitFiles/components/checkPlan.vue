<template>
  <div class="form-box">
    <div name="title" class="dialog-title">检查计划</div>
    <div class="dialog-content rulesForm">
      <el-form ref="fireFightingPlanForm" label-width="130px">
        <div v-for="(item, index) in fireFightingPlanForm" :key="index" class="form-content">
          <el-col :span="12">
            <el-form-item label="计划名称">
              <el-input v-model="fireFightingPlanForm[index].name" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查周期">
              <el-input v-model="fireFightingPlanForm[index].week" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业开始时间">
              <el-date-picker
                v-model="fireFightingPlanForm[index].startTime"
                type="date"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业结束时间">
              <el-date-picker
                v-model="fireFightingPlanForm[index].endTime"
                type="date"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查开始日期">
              <el-date-picker
                v-model="fireFightingPlanForm[index].startCheckDate"
                type="date"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查结束日期">
              <el-date-picker
                v-model="fireFightingPlanForm[index].endCheckDate"
                type="date"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人员">
              <el-input v-model="fireFightingPlanForm[index].summary" placeholder="请输入" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查点" style="margin-bottom: 20px;">
              <el-table :data="fireFightingPlanForm[index].files">
                <el-table-column
                  prop="icon"
                  label="类型"
                />
                <el-table-column
                  prop="fileName"
                  label="编号"
                />
                <el-table-column
                  prop="size"
                  label="所在部位"
                />
                <el-table-column
                  prop="fileName"
                  label="具体位置"
                />
                <el-table-column
                  prop="size"
                  label="详细地址"
                />
              </el-table>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { handlerChkplanListByOffice } from '@/api/office'

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
          week: '',
          startTime: '',
          endTime: '',
          startCheckDate: '',
          endCheckDate: '',
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
    handlerChkplanListByOffice({ officeId: this.id }).then(res => {
      console.log('检查计划', res)
    })
  }
}
</script>
<style lang="scss">
@import "../style/index";
</style>
