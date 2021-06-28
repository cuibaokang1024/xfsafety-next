<template>
  <section class="main-wrapper devWaterSettings">
    <div class="search-box">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
      <el-button
        class="record"
        :loading="exportLoading"
        type="primary"
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
      >导出</el-button>
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
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleEdit(row, '修改')"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                icon="el-icon-delete"
                type="danger"
                circle
                @click.stop="handleDelete(row)"
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
        @pagination="_getElectricRegisterList"
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
      <div class="dialog-content" style="height: 500px; padding-right: 15px; overflow-y: auto;">
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
                <el-select v-model="formData.sensorCat">
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
                <UnitSelect v-model:value="formData.officeId" v-model:label="formData.officeName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备ID：" prop="devid">
                <DevIdSelect :dev-type="'0'" v-model:value="formData.devid" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物联网卡号：" prop="iotCardId">
                <el-input v-model="formData.iotCardId" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报警手机号：" prop="alertTel">
                <el-input v-model="formData.alertTel" placeholder="输入接收报警短信的手机号，最多七个，用逗号进行分割。" />
              </el-form-item>
            </el-col>
            <el-col v-show="isNb" :span="12">
              <el-form-item label="运营商类型：" prop="operType">
                <el-select v-model="formData.operType">
                  <el-option
                    v-for="item in operTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="控制密码：" prop="password">
                <el-input v-model="formData.password" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装时间:" prop="instalTime">
                <el-date-picker
                  v-model="formData.instalTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务到期时间:" prop="expireTime">
                <el-date-picker
                  v-model="formData.expireTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装人员：" prop="instalPerson">
                <el-input v-model="formData.instalPerson" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在部位：" prop="partId">
                <el-select v-model="formData.partId" placeholder="请选择">
                  <el-option
                    v-for="item in partList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="具体位置：" prop="buildingType">
                <el-select v-model="formData.partAddrId" placeholder="请选择">
                  <el-option
                    v-for="item in partAddrList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isNb?12:24">
              <el-form-item label="详细位置：" prop="location">
                <el-input v-model="formData.location" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图位置：" prop="planContent">
                <PlanPosition
                  :part-addr-id="formData.partAddrId"
                  :init-position="{x: formData.planX||0,y: formData.planY||0}"
                  @getPosition="getPosition"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="摄像头：" prop="camId">
                <CameraSelect
                  :office-id="formData.officeId"
                  v-model:value="formData.camId"
                  v-model:label="formData.camName"
                />
              </el-form-item>
            </el-col>
          </div>
        </el-form>
        <div class="alertValue">
          <el-table height="350px" :data="formData.electricDtlList" style="width: 100%">
            <el-table-column
              label="序号"
              width="80"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="{row}">
                <el-input v-model="row.sort" disabled class="edit-input" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="项目" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">
                <el-input v-model="row.sensor" disabled class="edit-input" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="单位" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">
                <el-input v-model="row.utName" disabled class="edit-input" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="最低值" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">
                <el-input v-model="row.minAlert" class="edit-input" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="最高值" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">
                <el-input v-model="row.maxAlert" class="edit-input" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="APP报警间隔" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">
                <el-select v-model="row.appAlert" placeholder="请选择APP报警间隔">
                  <el-option
                    v-for="item in appIntervalList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="短信报警间隔" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">
                <el-select v-model="row.smsAlert" placeholder="请选择短信报警间隔">
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
        <el-button
          v-if="operationStatus!=='view'"
          type="primary"
          :disabled="btnFlag"
          @click="operationStatus==='create' ? createData(): updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getDict } from '@/api/common'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import { getSensorTypeList, getSensorDetail } from '@/api/sensor'
import {
  getElectricRegisterList,
  geElectricRegisterInfo,
  saveElectricRegister,
  deleteElectricRegister
} from '@/api/electric.js'

import { parseTime } from '@/utils'
import '@/styles/list.scss'

import UnitSelect from '@/components/UnitSelect'
import DevIdSelect from '../components/devIdSelect'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import PlanPosition from '@/components/planPosition'
import CameraSelect from '@/components/CameraSelect'

export default {
  /* 电设备注册 */
  name: 'DevElectricSettings',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    UnitSelect,
    DevIdSelect,
    CameraSelect,
    PlanPosition
  },
  data () {
    const validIotCardId = (rule, value, callback) => {
      const reg = /^(\w){1,50}$/
      if (!reg.test(value)) {
        callback(new Error('物联网卡号必须是由1-50位字母+数字组合'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      listLoading: true,
      btnFlag: false,
      operationStatus: '',
      title: '',
      multipleSelection: [],
      listQuery: {
        // 查询参数
        page: 1,
        limit: 10,
        devid: '',
        iotCardId: '',
        officeName: '',
        status: '',
        instalTime: '',
        expireTime: ''
      },
      partList: [],
      partAddrList: [],
      sensorCatList: [],
      electricRegisterList: [],
      total: 0,
      exportLoading: false,
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
                value: 0
              },
              {
                label: '离线',
                value: 1
              }
            ]
          },
          {
            type: 'date',
            label: '启用时间:',
            name: 'instalTime',
            valueFormat: 'yyyy-MM-dd',
            placeholder: '请选择启用时间'
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
          type: 'selection',
          width: '55'
        },
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'officeName',
          label: '所属单位',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '所属区划',
          align: 'left',
          width: ''
        },
        {
          prop: 'devid',
          label: '设备编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'location',
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
          label: '启用时间',
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
          prop: 'status',
          label: '状态',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.status === 1
              ? '离线'
              : row.isTrip === 1
                ? '脱扣'
                : row.isAlert === 1
                  ? '告警'
                  : '正常'
          }
        }
      ],
      formData: {},
      confCatList: [],
      sensorTypeList: [],
      appIntervalList: [],
      smsIntervalList: [],
      utList: [],
      buildingTypeList: [],
      planContentList: [],
      camIdList: [],
      rules: {
        officeId: [
          { required: true, message: '请选择所属单位', trigger: 'blur' }
        ],
        sensorCat: [
          { required: true, trigger: 'blur', message: '请选择devid' }
        ],
        devid: [{ required: true, trigger: 'blur', message: '请选择devid' }],
        // operType: [
        //   { required: true, trigger: 'blur', message: '请选择运营商类型' }
        // ],
        iotCardId: [
          { required: true, trigger: 'blur', message: '请输入物联网卡号' },
          { validator: validIotCardId, trigger: 'blur' }
        ]
      },
      unWatch: null,
      isNb: 0,
      operTypeList: []
    }
  },
  computed: {},
  watch: {
    'formData.officeId': {
      handler (newVal, oldVal) {
        if (oldVal) {
          this.formData.partId = ''
          this.formData.partAddrId = ''
          this.partAddrList = []
        }
        if (newVal) {
          this._getPartsList(newVal)
        }
      }
    },
    'formData.partId': {
      handler (newVal, oldVal) {
        if (oldVal) {
          this.formData.partAddrId = ''
        }
        if (newVal !== -1 && newVal) {
          this._getPartsAddrList(newVal)
        }
      }
    },
    'formData.sensorCat': {
      handler (newVal, oldVal) {
        if (newVal !== -1 && newVal) {
          const index = this.sensorCatList.findIndex(item => {
            return newVal === item.sensorCat
          })
          if (index !== -1) {
            this.isNb = this.sensorCatList[index].isNb
            const networkOperatorsValue = this.sensorCatList[index].networkOperatorsValue
            if (networkOperatorsValue && Array.isArray(networkOperatorsValue)) {
              this.operTypeList = networkOperatorsValue.map((item, key) => {
                return {
                  label: item,
                  value: this.sensorCatList[index].networkOperatorArray[key]
                }
              })
            }
          }
        }
      }
    }
  },
  created () {
    this._getElectricRegisterList()
    this._getSensorTypeList()
    this._getDict()
  },
  methods: {
    // 获取电设备注册列表
    _getElectricRegisterList () {
      this.listLoading = true
      getElectricRegisterList(this.listQuery).then(res => {
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
          .then(res => {
            if (res.data) {
              const data = res.data.electric
              resolve({
                ...data,
                sensorCat: String(res.data.electric.sensorCat),
                partId: data.partId === -1 ? null : data.partId,
                partAddrId: data.partAddrId === -1 ? null : data.partAddrId
              })
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取采集部位列表
    _getPartsList (id) {
      getPartsList({ officeId: id }).then(res => {
        if (res.data) {
          this.partList = res.data.map(item => {
            return {
              value: parseInt(item.id),
              label: item.name
            }
          })
        }
      })
    },
    // 获取字典值
    _getDict () {
      getDict({
        type: 'app_alert_interval'
      }).then(res => {
        if (res.data) {
          this.appIntervalList = res.data.dicts.map(item => {
            return { ...item, value: Number(item.value) }
          })
        }
      })
      getDict({
        type: 'sms_alert_interval'
      }).then(res => {
        if (res.data) {
          this.smsIntervalList = res.data.dicts.map(item => {
            return { ...item, value: Number(item.value) }
          })
        }
      })
    },
    // 根据采集部位获取楼层
    _getPartsAddrList (id) {
      getPartsAddrList({ partsId: id }).then(res => {
        if (res.data) {
          this.partAddrList = res.data.map(partAddr => {
            return {
              value: parseInt(partAddr.id),
              label: partAddr.name
            }
          })
        }
      })
    },
    // 获取电设备传感器列表
    _getSensorTypeList () {
      getSensorTypeList({ devType: 0 }).then(res => {
        if (res.data) {
          this.sensorCatList = res.data
        }
      })
    },
    // 获取传感器详情
    _getSensorDetail (sensorId) {
      getSensorDetail({ sensorId }).then(res => {
        if (res.data) {
          this.formData.electricDtlList = res.data
        }
      })
    },
    // 获取点在平面图上的位置
    getPosition (data) {
      this.formData.planX = data.x
      this.formData.planY = data.y
    },
    showElectricRegisterForm () {
      this.dialogVisible = true
      this.unWatch = this.$watch(
        'formData.sensorCat',
        function (newVal, oldVal) {
          if (newVal !== -1 && newVal) {
            this.formData.electricDtlList = []
            this._getSensorDetail(newVal)
          }
        },
        { deep: true }
      )
    },
    hideElectricRegisterForm () {
      if (this.unWatch) {
        this.unWatch()
      }
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.dialogVisible = false
      })
      this.pointsList = []
    },
    // 新增电设备注册
    handleCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formData = {
        id: '', // id存在更新、id不存在新增
        officeId: '',
        officeName: '',
        alertTel: '',
        sensorCat: '',
        password: '',
        partId: '',
        partAddrId: '',
        location: '',
        planId: '',
        planX: '',
        planY: '',
        camId: '',
        camName: '',
        devid: '',
        iotCardId: '',
        instalPerson: '',
        instalTime: '',
        operType: '',
        expireTime: '',
        electricDtlList: []
      }
      this.showElectricRegisterForm()
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 查看表单信息
    async handleView (data, title) {
      this.title = title
      this.operationStatus = 'view'
      const detaile = await this._geElectricRegisterInfo(data)
      this.formData = { ...detaile }
      this.showElectricRegisterForm()
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
    // 删除表单数据
    handleDelete (data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let list = []
            if (Array.isArray(data)) {
              data.forEach(item => {
                list.push(item.id)
              })
            } else {
              list = [data.id]
            }
            deleteElectricRegister(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除电设备注册成功'
                })
                this._getElectricRegisterList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败'
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getElectricRegisterList()
    },
    // 新增电设备注册
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveElectricRegister(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('新增电设备注册成功')
              this.hideElectricRegisterForm()
              this._getElectricRegisterList()
            }
          })
        }
      })
    },
    // 更新电设备注册
    updateData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveElectricRegister(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('修改电设备注册成功')
              this.hideElectricRegisterForm()
              this._getElectricRegisterList()
            }
          })
        }
      })
    },
    async handleExport () {
      this.exportLoading = true
      const tHeader = this.tableConfig.map(item => {
        if (item.label) {
          return item.label
        }
      })
      const filterVal = this.tableConfig.map(item => {
        if (item.prop) {
          return item.prop
        }
      })
      const data = (await this.formatJson(filterVal.slice(1))) || []
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader.slice(1),
          data,
          filename: '电设备注册列表'
        })
        this.exportLoading = false
      })
    },
    formatJson (filterVal) {
      return new Promise((resolve, reject) => {
        let data = []
        const query = this.$refs.searchForm.getSearchQuery()
        const listQuery = { ...this.listQuery, ...query, page: 0, limit: 0 }
        getElectricRegisterList(listQuery)
          .then(res => {
            if (res.data) {
              data = res.data.page.list
            }
            resolve(
              data.map(v =>
                filterVal.map(j => {
                  if (j === 'status') {
                    return v.status === 1
                      ? '离线'
                      : v.isAlert === 1
                        ? '告警'
                        : '正常'
                  } else {
                    return v[j]
                  }
                })
              )
            )
          })
          .catch(reject)
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
