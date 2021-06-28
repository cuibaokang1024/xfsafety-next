<template>
  <div class="main baseInfo">
    <el-container>
      <el-header>基本信息</el-header>
      <el-main>
        <el-form v-if="form" ref="form" inline :rules="rules" :model="form">
          <el-col :span="8">
            <el-form-item label="单位名称：" prop="name">
              <el-input v-model="form.name" :maxlength="64" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属区域：" prop="areaId">
              <tree-select
                v-model:value="form.areaId"
                v-model:label="form.areaName"
                :tree-select-option="areaSelectOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构代码：" prop="orgCode">
              <el-input v-model="form.orgCode" :maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位类别：" prop="categoryId">
              <tree-select
                v-model:value="form.categoryId"
                v-model:label="form.categoryName"
                :tree-select-option="categoryOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="建筑面积：" prop="buildArea">
              <el-input v-model="form.buildArea" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：" prop="addr">
              <el-input v-model="form.addr" :maxlength="225" @input="addrChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="position" label="经纬度：" prop="lnglat">
              <el-input v-model="form.lnglat" disabled />
              <el-button icon="el-icon-location-outline" @click="show" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属行业：" prop="industryId">
              <tree-select
                v-model:value="form.industryId"
                v-model:label="form.industryName"
                :tree-select-option="industryOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工人数：" prop="empCount">
              <el-input v-model="form.empCount" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防安全责任人：" prop="primaryName">
              <el-input v-model="form.primaryName" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：" prop="primaryTel">
              <el-input v-model="form.primaryTel" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防安全管理人：" prop="deputyName">
              <el-input v-model="form.deputyName" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：" prop="deputyTel">
              <el-input v-model="form.deputyTel" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位分级：" prop="level">
              <el-select v-model="form.level" placeholder="请选择">
                <el-option
                  v-for="item in officeLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业主管部门：" prop="directDeptId">
              <tree-select
                v-model:value="form.directDeptId"
                v-model:label="form.directDeptName"
                :tree-select-option="directDeptOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防主管部门：" prop="fireDeptId">
              <tree-select
                v-model:value="form.fireDeptId"
                v-model:label="form.fireDeptName"
                :tree-select-option="fireDeptOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防监督员：" prop="fireMonitors">
              <el-input v-model="form.fireMonitors" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维保单位：" prop="careOrg">
              <el-input v-model="form.careOrg" :maxlength="64" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="火灾高危单位：" prop="isHighRisk">
              <el-select v-model="form.isHighRisk" placeholder="请选择">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社区站长：" prop="commMaster">
              <el-input v-model="form.commMaster" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全出口数：" prop="safetyExitCount">
              <el-input v-model="form.safetyExitCount" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疏散电梯数：" prop="evacuateElevatorCount">
              <el-input v-model="form.evacuateElevatorCount" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防车道数：" prop="fileLaneCount">
              <el-input v-model="form.fileLaneCount" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防电梯数：" prop="fireElevatorCount">
              <el-input v-model="form.fireElevatorCount" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消防车道位置：" prop="fileLanePosition">
              <el-input v-model="form.fileLanePosition" :maxlength="225" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="避难层数：" prop="refugeStoreyCount">
              <el-input v-model="form.refugeStoreyCount" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="避难层总面积：" prop="refugeStoreyArea">
              <el-input v-model="form.refugeStoreyArea" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="避难层位置：" prop="refugeStoreyPosition">
              <el-input v-model="form.refugeStoreyPosition" :maxlength="225" />
            </el-form-item>
          </el-col>
        </el-form>
        <el-col class="submit-wrapper" :span="24">
          <el-button type="success" round @click="saveBaseInfo">保存</el-button>
        </el-col>
      </el-main>
    </el-container>
    <!-- 地图弹窗 -->
    <el-dialog
      v-if="dialogVisible"
      class="dark PositionPicker"
      :destroy-on-close="true"
      v-model:visible="dialogVisible"
      width="930px"
    >
      <div name="title" class="dialog-title">地图定位</div>
      <div class="dialog-content">
        <position-picker
          ref="positionPicker"
          v-model:position="form.lnglat"
          v-model:address="form.addr"
        />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="refreshPosition">重新定位</el-button>
        <el-button @click="upDateLnglat">确定</el-button>
        <el-button @click="hide">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 地图弹窗 -->
  </div>
</template>

<script>
import { getArchivesInfo, updateArchives } from '@/api/archives'
import { getOfficeLevelList } from '@/api/office'
import TreeSelect from '@/components/treeSelect'
import PositionPicker from '@/components/bmap/positionPicker'
import { upToTwoSignificantDigits, phoneAndTel, isOnlyNumber } from '@/utils'

export default {
  // 基本信息
  name: 'EnterpriseUnitRecord',
  components: {
    TreeSelect,
    PositionPicker
  },
  data () {
    const EXITCheck = (rule, value, callback) => {
      if (value) {
        if (isOnlyNumber(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var buildAreaCheck = (rule, value, callback) => {
      if (value) {
        if (!upToTwoSignificantDigits(value)) {
          callback(new Error('最多保留两位小数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var phoneAndTelCheck = (rule, value, callback) => {
      if (value) {
        if (!phoneAndTel.test(value)) {
          callback(new Error('请输入正确的手机号或者电话'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {},
      officeLevelList: [],
      rules: {
        name: { required: true, message: '请输入单位名称', trigger: 'change' },
        areaId: { required: true, message: '请选区域', trigger: 'change' },
        fireDeptId: {
          required: true,
          message: '请选择消防主管部门',
          trigger: 'change'
        },
        lnglat: {
          required: true,
          message: '请选择位置',
          trigger: 'change'
        },
        safetyExitCount: [{ validator: EXITCheck, trigger: 'blur' }],
        buildArea: [{ validator: buildAreaCheck, trigger: 'blur' }],
        primaryTel: [{ validator: phoneAndTelCheck, trigger: 'blur' }],
        deputyTel: [{ validator: phoneAndTelCheck, trigger: 'blur' }],
        evacuateElevatorCount: [{ validator: EXITCheck, trigger: 'blur' }],
        fileLaneCount: [{ validator: EXITCheck, trigger: 'blur' }],
        fireElevatorCount: [{ validator: EXITCheck, trigger: 'blur' }],
        refugeStoreyCount: [{ validator: EXITCheck, trigger: 'blur' }],
        refugeStoreyArea: [{ validator: buildAreaCheck, trigger: 'blur' }]
      },
      areaSelectOption: {
        title: '选择区域',
        request: {
          url: 'system/api/area/treeData',
          params: {}
        }
      },
      directDeptOption: {
        title: '选择行业主管部门',
        request: {
          url: 'system/api/office/directTree',
          params: {}
        }
      },
      fireDeptOption: {
        title: '选择消防主管部门',
        request: {
          url: 'system/api/office/fireTree',
          params: {}
        }
      },
      categoryOption: {
        title: '选择单位类别',
        request: {
          url: 'system/api/officetype/treeData',
          params: {}
        }
      },
      industryOption: {
        title: '选择所属行业',
        request: {
          url: 'system/api/officeindustry/treeData',
          params: {}
        }
      },
      dialogVisible: false
    }
  },
  created () {
    this._getOfficeLevelList()
    this._getArchivesInfo()
  },
  methods: {
    _getArchivesInfo () {
      getArchivesInfo().then(res => {
        if (res.data) {
          const office = res.data.office
          this.form = Object.assign({}, office, {
            lnglat: `${office.longitude},${office.latitude}`,
            level: office.level === null ? '' : office.level + ''
          })
        }
      })
    },
    _getOfficeLevelList () {
      getOfficeLevelList().then(res => {
        if (res.data) {
          this.officeLevelList = res.data.officeLevels
        }
      })
    },
    // 详细地址改变时 清空经纬度
    addrChange () {
      this.form.lnglat = ''
    },
    saveBaseInfo () {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateArchives(
            Object.assign({}, this.form, {
              latitude: this.form.lnglat.split(',')[1],
              longitude: this.form.lnglat.split(',')[0]
            })
          ).then(res => {
            if (res.msg === 'ok') {
              this.$message({
                message: '修改单位基本信息成功',
                type: 'success'
              })
              this._getArchivesInfo()
            } else {
              this.$message({
                message: '修改单位基本信息失败',
                type: 'info'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 地图重新定位
    refreshPosition () {
      this.$refs.positionPicker.mapPosition()
    },
    // 获取地图定位坐标
    upDateLnglat () {
      this.$refs.positionPicker.upDateLnglat()
      this.dialogVisible = false
    },
    // 打开地图定位页
    show (data) {
      this.dialogVisible = true
    },
    // 关闭地图定位页
    hide () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
  .baseInfo {
    &.main {
      width: 100%;
      height: 100%;
      padding: 20px;
      background-color: #001647;
      .el-container {
        height: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        .el-header {
          font-size: 14px;
          line-height: 60px;
          font-weight: bold;
          color: #e0edff;
        }
        .el-main {
          padding: 0;
          .el-form {
            overflow: hidden;
            padding: 35px;
            .el-form-item {
              display: flex;
              margin-right: 0;
            }
            .position {
              position: relative;
              .el-button {
                position: absolute;
                right: 0;
                top: 0;
                color: #97c1ff;
                background: #00479d;
                border: 1px solid #00479d;
              }
            }
          }
          .submit-wrapper {
            text-align: center;
            .el-button {
              width: 144px;
            }
          }
        }
      }
      .dialog-content {
        height: 389px;
      }
    }
  }
</style>
<style lang="scss">
.baseInfo{
  &.main{
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      flex: 1;
    }
    .el-form-item__label {
      width: 125px;
      color: #97c1ff;
    }
    .el-input__inner {
      background-color: rgba(255, 255, 255, 0.1);
      border: none;
      color: #97c1ff;
    }
  }
}
</style>
