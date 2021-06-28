<template>
  <el-dialog class="dark alarmHandle" title="告警处理" :visible.sync="dialogVisible" width="987px">
    <div name="title" class="dialog-title">报警记录</div>
    <div ref="content" v-loading="listLoading" class="dialog-content">
      <div class="item-wrapper">
        <div class="title">单位信息</div>
        <el-form ref="form" inline :model="form">
          <el-col :span="12">
            <el-form-item label="单位名称：">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类别：">
              <el-input v-model="form.categoryName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类分级：">
              <el-input v-model="form.levelName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区划：">
              <el-input v-model="form.areaName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细位置：">
              <el-input v-model="form.addr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业主管：">
              <el-input v-model="form.directDeptName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防主管：">
              <el-input v-model="form.fireDeptName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督员：">
              <el-input v-model="form.fireMonitorsName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社区站长：">
              <el-input v-model="form.commMasterName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全责任人：">
              <el-input v-model="form.primaryName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全管理人：">
              <el-input v-model="form.deputyName" />
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div class="item-wrapper">
        <div class="title">报警信息</div>
        <ul class="dayRecord">
          <li v-for="(item,index) in dayRecordList" :key="index">
            {{ `【${item.time||''}】${item.sensor||''}发生报警 ${item.msg||''}` }}
          </li>
        </ul>
      </div>
      <div class="item-wrapper">
        <ul class="serviceRecord">
          <li v-for="(item,index) in serviceRecordList" :key="index">
            <p>{{ `【${item.date||''}】` }}</p>
            <p>{{ item.content||'' }}</p>
          </li>
        </ul>
      </div>
      <div class="item-wrapper">
        <div class="title">督办意见</div>
        <el-form ref="suggestForm" :model="suggestForm" :rules="rules">
          <el-form-item prop="content">
            <el-input v-model="suggestForm.content" type="textarea" />
          </el-form-item>
        </el-form>

      </div>
    </div>
    <div name="footer" class="dialog-footer">
      <el-button type="primary" @click="_saveSuggest">提交处理</el-button>
      <el-button type="primary" @click="hide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import './style/index.scss'
import { getAlertDetail, saveSuggest } from '@/api/iot'
export default {
  name: 'AlarmHandle',
  components: {
  },
  props: {
    devId: {
      type: String,
      default: ''
    },
    officeId: {
      type: String,
      default: ''
    },
    devCategory: {
      type: Number,
      default: -1
    },
    // 是否更新数据
    isResetFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('督办意见不能为空'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      listLoading: false,
      total: 0,
      rules: {
        content: [
          { validator: validateContent, trigger: 'blur' }
        ]
      },
      suggestForm: {
        content: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10,
        devid: ''
      },
      dayRecordList: [],
      serviceRecordList: [],
      form: {
        name: '',
        categoryName: '',
        levelName: '',
        areaname: '',
        address: '',
        directDeptName: '',
        fireDeptName: '',
        fireMonitors: '',
        commMaster: '',
        primaryNameTel: '',
        deputyNameTel: ''
      }
    }
  },
  watch: {
    isResetFlag() {
      this._getAlertDetail()
    }
  },
  created() {},
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    _getAlertDetail() {
      // this.listLoading = true
      getAlertDetail({
        category: this.devCategory,
        data: {
          devId: this.devId,
          officeId: this.officeId
        }
      }).then((res) => {
        if (res.data) {
          const data = res.data.data
          this.dayRecordList = data.dayRecord
          this.serviceRecordList = data.serviceRecord
          this.form = Object.assign(this.form, data.officeDetail, {
            areaname: data.officeDetail.area.name,
            primaryNameTel: `${data.officeDetail.primaryName}(${data.officeDetail.primaryTel})`,
            deputyNameTel: `${data.officeDetail.deputyName}(${data.officeDetail.deputyTel})`
          })
          // this.listLoading = false
        }
      })
    },
    _saveSuggest() {
      this.$refs.suggestForm.validate((valid) => {
        if (valid) {
          saveSuggest({
            faultOfficeId: this.officeId,
            content: this.suggestForm.content
          }).then(res => {
            if (res.msg === 'ok') {
              this.$message({
                message: '提交督办意见成功',
                type: 'success'
              })
              this.hide()
            } else {
              this.$message({
                message: '提交督办意见失败',
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-dialog__header{
        text-align: left;
    }
</style>
