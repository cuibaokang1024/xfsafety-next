<template>
  <section class="main-wrapper">
    <div class="search-box">
      <el-form ref="ruleForm" class="search-devElect" :model="listQuery">
        <el-form-item label="设备编号:">
          <el-input v-model="listQuery.devid" />
        </el-form-item>
        <el-form-item label="物联网卡号:">
          <el-input v-model="listQuery.iotCardId" />
        </el-form-item>
        <el-form-item label="所属单位:">
          <el-input v-model="listQuery.officeName" />
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="listQuery.status">
            <el-option label="在线" :value="0" />
            <el-option label="离线" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="安装时间:">
          <el-date-picker
            v-model="listQuery.instalTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="instalTimeOptions"
          />
        </el-form-item>
        <el-form-item label="服务到期时间:">
          <el-date-picker
            v-model="listQuery.expireTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="expireTimeOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn-search"
            type="primary"
            @click="handleFilter('ruleForm')"
          >查询</el-button>
          <el-button
            type="primary"
            @click="resetForm('ruleForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
      class="table-box"
    >
      <BaseTable
        :table-height="'100%'"
        :table-config="tableConfig"
        :table-data="electricRegisterList"
        :border="false"
      >
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleEdit(row, '修改')"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="_handleElectricList"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="devSettingForm dark"
      width="987px"
      v-model:visible="dialogVisible"
      @close="hideElectricRegisterForm"
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div
        class="dialog-content"
        style="height: 500px; padding-right: 15px; overflow-y: auto"
      >
        <el-form
          ref="form"
          label-width="120px"
          :inline="true"
          :model="formData"
          :rules="rules"
          :disabled="operationStatus === 'view'"
        >
          <div class="form-content">
            <el-col :span="12">
              <el-form-item label="设备类型：" prop="sensorCat">
                <el-select v-model="formData.sensorCat" disabled>
                  <el-option
                    v-for="item in sensorCatList"
                    :key="item.id"
                    :value="item.sensorCat"
                    :label="item.sensor"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属单位：" prop="officeId">
                <UnitSelect
                  v-model:value="formData.officeId"
                  v-model:label="formData.officeName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备ID：" prop="devid">
                <el-input v-model="formData.devid" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物联网卡号：" prop="iotCardId">
                <el-input v-model="formData.iotCardId" disabled />
              </el-form-item>
            </el-col>
          </div>
        </el-form>
        <div class="alertValue">
          <el-table
            height="350px"
            :data="formData.electricDtlList"
            style="width: 100%"
          >
            <el-table-column
              label="项目"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="{ row }">
                <el-input
                  v-model="row.sensor"
                  disabled
                  class="edit-input"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="{ row }">
                <el-input
                  v-model="row.utName"
                  disabled
                  class="edit-input"
                  size="small"
                />
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="最低值"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.minAlert"
                  class="edit-input"
                  size="small"
                />
              </template>
            </el-table-column> -->
            <el-table-column
              label="最高值"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="{ row }">
                <el-input
                  v-model="row.maxAlert"
                  class="edit-input"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="APP报警间隔"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="{ row }">
                <el-select
                  v-model="row.appAlert"
                  disabled
                  placeholder="请选择APP报警间隔"
                >
                  <el-option
                    v-for="item in appIntervalList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="短信报警间隔"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="{ row }">
                <el-select
                  v-model="row.smsAlert"
                  disabled
                  placeholder="请选择短信报警间隔"
                >
                  <el-option
                    v-for="item in smsIntervalList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hideElectricRegisterForm">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getDict } from '@/api/common'
import { getSensorTypeList, getSensorDetail } from '@/api/sensor'
import {
  handleElectricList,
  geElectricRegisterInfo,
  handleElectricUpdate
} from '@/api/electric'

import { parseTime } from '@/utils'
import './index.scss'

import UnitSelect from '@/components/UnitSelect'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  /* 电设备注册 */
  name: 'DevElectricSettings',
  components: {
    BaseTable,
    Pagination,
    UnitSelect
  },
  data () {
    return {
      dialogVisible: false,
      listLoading: true,
      operationStatus: '',
      title: '',
      listQuery: {
        // 查询参数
        devid: '',
        iotCardId: '',
        officeName: '',
        status: '',
        instalTime: '',
        expireTime: '',
        page: 1,
        limit: 10
      },
      instalTimeOptions: {
        disabledDate: time => {
          if (this.listQuery.expireTime) {
            return time.getTime() > new Date(this.listQuery.expireTime)
          }
        }
      },
      expireTimeOptions: {
        disabledDate: time => {
          if (this.listQuery.instalTime) {
            return time.getTime() < new Date(this.listQuery.instalTime)
          }
        }
      },
      sensorCatList: [],
      electricRegisterList: [],
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '设备编号:',
            name: 'devid',
            placeholder: '请输入设备编号'
          },
          {
            type: 'text',
            label: '物联网卡号:',
            name: 'iotCardId',
            placeholder: '请输入物联网卡号'
          },
          {
            type: 'text',
            label: '所属单位:',
            name: 'officeName',
            placeholder: '请输入所属单位'
          },
          {
            type: 'select',
            label: '状态:',
            name: 'status',
            placeholder: '请选择状态',
            dataList: [
              {
                label: '在线',
                value: 1
              },
              {
                label: '离线',
                value: 0
              }
            ]
          },
          {
            type: 'date',
            label: '安装时间:',
            name: 'instalTime',
            valueFormat: 'yyyy-MM-dd',
            placeholder: '请选择安装时间'
          },
          {
            type: 'date',
            label: '服务到期时间:',
            name: 'expireTime',
            valueFormat: 'yyyy-MM-dd',
            placeholder: '请选择服务到期时间'
          }
        ]
      },
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'devid',
          label: '设备编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '安装位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'iotCardId',
          label: '物联网卡号',
          align: 'left',
          width: ''
        },
        {
          prop: 'sensor',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'instalTime',
          label: '安装时间',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            if (row.instalTime) {
              return parseTime(row.instalTime, '{yy}-{mm}-{dd}')
            }
          }
        },
        {
          prop: 'expireTime',
          label: '服务到期时间',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            if (row.expireTime) {
              return parseTime(row.expireTime, '{yy}-{mm}-{dd}')
            }
          }
        },
        {
          prop: 'maxAlert',
          label: '最高值',
          align: 'left',
          width: ''
        },
        {
          prop: 'status',
          label: '状态',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.status === 0 ? '在线' : '离线'
          }
        }
      ],
      formData: {},
      confCatList: [],
      sensorTypeList: [],
      appIntervalList: [],
      smsIntervalList: [],
      utList: [],
      rules: {}
    }
  },
  created () {
    this._handleElectricList()
    this._getSensorTypeList()
    this._getDict()
  },
  methods: {
    // 查询函数
    handleFilter (formName) {
      this._handleElectricList()
    },
    resetForm (formName) {
      this.listQuery = {
        // 查询参数
        devid: '',
        iotCardId: '',
        officeName: '',
        status: '',
        instalTime: '',
        expireTime: '',
        page: 1,
        limit: 10
      }
    },
    // 获取电设备注册列表
    _handleElectricList () {
      this.listLoading = true
      handleElectricList(this.listQuery).then((res) => {
        if (res.data) {
          this.electricRegisterList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取电设备注册详情
    _geElectricRegisterInfo (data) {
      return new Promise((resolve, reject) => {
        geElectricRegisterInfo({ id: data.id })
          .then((res) => {
            if (res.data) {
              const data = res.data.electric
              const electricDtlList = res.data.electric.electricDtlList.filter(
                (item) => {
                  return item.sensorType === '1011'
                }
              )
              resolve({
                ...data,
                electricDtlList,
                sensorCat: String(res.data.electric.sensorCat),
                partId: data.partId === -1 ? null : data.partId,
                partAddrId: data.partAddrId === -1 ? null : data.partAddrId
              })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取字典值
    _getDict () {
      getDict({
        type: 'app_alert_interval'
      }).then((res) => {
        if (res.data) {
          this.appIntervalList = res.data.dicts.map((item) => {
            return { ...item, value: Number(item.value) }
          })
        }
      })
      getDict({
        type: 'sms_alert_interval'
      }).then((res) => {
        if (res.data) {
          this.smsIntervalList = res.data.dicts.map((item) => {
            return { ...item, value: Number(item.value) }
          })
        }
      })
    },
    // 获取电设备传感器列表
    _getSensorTypeList () {
      getSensorTypeList({ devType: 0 }).then((res) => {
        if (res.data) {
          this.sensorCatList = res.data
        }
      })
    },
    // 获取传感器详情
    _getSensorDetail (sensorId) {
      getSensorDetail({ sensorId }).then((res) => {
        if (res.data) {
          this.formData.electricDtlList = res.data.filter((item) => {
            return item.sensorType === '1011'
          })
        }
      })
    },
    showElectricRegisterForm () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    hideElectricRegisterForm () {
      this.dialogVisible = false
      this.pointsList = []
    },
    // 编辑表单信息
    async handleEdit (data, title) {
      this.title = title
      this.operationStatus = 'edit'
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (data.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          const detaile = await this._geElectricRegisterInfo(data[0])
          this.formData = { ...detaile }
          this.pointsList = detaile.list
          this.showElectricRegisterForm()
        }
      } else {
        const detaile = await this._geElectricRegisterInfo(data)
        this.formData = { ...detaile }
        this.pointsList = detaile.list
        this.showElectricRegisterForm()
      }
    },
    // 更新电设备注册
    updateData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          handleElectricUpdate(this.formData.electricDtlList[0]).then((res) => {
            if (res.msg === 'ok') {
              this.$message.success('修改电设备注册成功')
              this.hideElectricRegisterForm()
              this._handleElectricList()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.devWaterSettings {
  .dark {
    &.devSettingForm {
      .alertValue {
        padding: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.alertValue {
  .el-table {
    .el-input__inner {
      color: #85a6d6;
      background-color: rgba(255, 255, 255, 0.1);
      border-color: transparent;
    }
  }
}
</style>
