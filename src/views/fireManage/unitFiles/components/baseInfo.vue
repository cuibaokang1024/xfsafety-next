<template>
  <div class="form-box">
    <div name="title" class="dialog-title">基本信息</div>
    <div class="dialog-content baseInfoForm">
      <el-form ref="baseInfoForm" :model="baseInfoForm" label-width="130px" disabled>
        <div class="form-content">
          <el-col v-for="item in baseformOption.config" :key="item.name" :span="12">
            <el-form-item :label="item.label">
              <el-input v-model="baseInfoForm[item.name]" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
  </div>

</template>
<script>
import '@/components/baseForm/style/index.scss'
// import { getOfficeDetail } from '@/api/office'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      baseformOption: {
        config: [
          {
            label: '单位性质：',
            name: 'nature',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '组织结构代码：',
            name: 'orgCode',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '单位名称：',
            name: 'name',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '单位类别：',
            name: 'type',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '行政区域：',
            name: 'region',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '详细地址：',
            name: 'address',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '建筑面积：',
            name: 'area',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '员工人数：',
            name: 'number',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '消防安全责任人：',
            name: 'primaryName',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '联系电话：',
            name: 'primaryTel',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '消防安全管理人：',
            name: 'deputyName',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '联系电话：',
            name: 'deputyTel',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '消防主管部门：',
            name: 'department',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '单位分级：',
            name: 'level',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '维保单位：',
            name: 'careOrg',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '消防监督员',
            name: 'fireMonitors',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '社区站长：',
            name: 'commMaster',
            type: 'text',
            labelWidth: '120px'
          }
        ]
      },
      baseInfoForm: {
        nature: '',
        orgCode: '',
        name: '',
        type: '',
        region: '',
        address: '',
        area: '',
        number: '',
        primaryName: '',
        primaryTel: '',
        department: '',
        level: '',
        careOrg: '',
        fireMonitors: '',
        commMaster: ''
      }
    }
  },
  mounted () {
    // getOfficeDetail({ officeId: this.id }).then(res => {
    //   if (res.data) {
    //     this.baseInfoForm = res.data.officeDetail
    //   }
    // })
  }
}
</script>
<style lang="scss">
.baseInfoForm {
  flex: 1;
  overflow: auto;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
