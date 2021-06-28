<template>
  <section class="main-wrapper devWaterSettings">
    <div class="search-box">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">添加</el-button>
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
        :loading="listLoading"
        :table-height="'100%'"
        :table-config="tableConfig"
        :table-data="waterRegisterList"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
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
        @pagination="_getWaterRegisterList"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="devSettingForm dark"
      width="987px"
      v-model:visible="dialogVisible"
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
            <el-col :span="24">
              <el-form-item label="所属单位：" prop="officeId">
                <UnitSelect v-model:value="formData.officeId" v-model:label="formData.officeName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备ID：" prop="devid">
                <DevIdSelect v-model:value="formData.devid" :dev-type="'1'" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物联网卡号：" prop="iotCardId">
                <el-input v-model="formData.iotCardId" placeholder="仅限数字和字母，长度不能超过50个字符" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="app报警间隔：" prop="appInterval">
                <el-select v-model="formData.appInterval">
                  <el-option
                    v-for="item in appIntervalList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="短信间隔：" prop="smsInterval">
                <el-select v-model="formData.smsInterval">
                  <el-option
                    v-for="item in smsIntervalList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报警手机号：" prop="alertTel">
                <el-input v-model="formData.alertTel" placeholder="输入接收报警短信的手机号，最多七个，用逗号进行分割。" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="水设备类型：" prop="sensorCat">
                <el-select v-model="formData.sensorCat">
                  <el-option
                    v-for="item in sensorCatList"
                    :key="item.id"
                    :label="item.sensor"
                    :value="item.sensorCat"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传感器类型：" prop="sensorType">
                <el-select v-model="formData.sensorType">
                  <el-option
                    v-for="item in sensorTypeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="量程：" prop="rangeValue">
                <el-input v-model="formData.rangeValue" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位：" prop="ut">
                <el-select v-model="formData.ut">
                  <el-option
                    v-for="item in utList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="isNb" :span="12">
              <el-form-item label="运营商类型：" prop="operTyp">
                <el-select v-model="formData.operTyp">
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
              <el-form-item
                :label="formData.sensorType==='003'||formData.sensorType==='004'?'水位最低值：':'水压最低值'"
                prop="minAlert"
              >
                <el-input v-model="formData.minAlert" :placeholder="alertPlaceholder[0]" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="formData.sensorType==='003' || formData.sensorType==='004' ? '水位最高值：' : '水压最高值'"
                prop="maxAlert"
              >
                <el-input v-model="formData.maxAlert" :placeholder="alertPlaceholder[1]" />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.sensorType==='003'||formData.sensorType==='004'" :span="12">
              <el-form-item
                label="长度："
                :prop="formData.sensorType==='003'||formData.sensorType==='004'?'length':''"
              >
                <el-input v-model.number="formData.length" />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.sensorType==='003'||formData.sensorType==='004'" :span="12">
              <el-form-item
                label="宽度："
                :prop="formData.sensorType==='003'||formData.sensorType==='004'?'width':''"
              >
                <el-input v-model.number="formData.width" />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.sensorType==='003'||formData.sensorType==='004'" :span="12">
              <el-form-item
                label="高度："
                :prop="formData.sensorType==='003'||formData.sensorType==='004'?'high':''"
              >
                <el-input v-model.number="formData.high" />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.sensorType==='003'" :span="12">
              <el-form-item label="预警吨位：" :prop="formData.sensorType==='003'?'ton':''">
                <el-input v-model.number="formData.ton" />
              </el-form-item>
            </el-col>
            <el-col v-show="formData.sensorType==='004'" :span="12">
              <el-form-item label="建筑类型：" prop="buildingType">
                <el-select v-model="formData.buildingType">
                  <el-option
                    v-for="item in buildingTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
              <el-form-item label="具体位置：" prop="partAddrId">
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
            <el-col :span="isNb?24:12">
              <el-form-item label="详细位置：" prop="location">
                <el-input v-model="formData.location" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图位置：" prop="planContent">
                <PlanPosition
                  :part-addr-id="formData.partAddrId"
                  v-model:value="formData.devPosition"
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
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hideWaterRegisterForm">取 消</el-button>
        <el-button
          v-if="operationStatus!=='view'"
          type="primary"
          @click="operationStatus==='create' ? createData(): updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getDict } from '@/api/common'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  getWaterRegisterList,
  geWaterRegisterInfo,
  saveWaterRegister,
  updateWaterRegister,
  deleteWaterRegister
} from '@/api/water.js'
import { getSensorTypeList } from '@/api/sensor'
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
  /* 消防水设备设置 */
  name: 'DevWaterSettings',
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
    const validNumber = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,3})))$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字值且最多保留三位小数'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      listLoading: true,
      title: '',
      operationStatus: '',
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
      isNb: 0,
      operTypeList: [],
      partList: [],
      partAddrList: [],
      appAlertList: [],
      smsAlertList: [],
      sensorCatList: [],
      devSensorList: [],
      pressureUtList: [],
      levelUtList: [],
      waterRegisterList: [],
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
              : row.isAlert === 1
                ? '告警'
                : '正常'
          }
        }
      ],
      formData: {},
      sensorTypeList: [],
      appIntervalList: [],
      smsIntervalList: [],
      buildingTypeList: [
        {
          label: '一类高层住宅建筑',
          value: '0'
        },
        {
          label: '一类高层公共建筑',
          value: '1'
        },
        {
          label: '二类高层住宅建筑',
          value: '2'
        },
        {
          label: '二类高层公共建筑',
          value: '3'
        },
        {
          label: '多层公共建筑',
          value: '4'
        },
        {
          label: '高度大于21m的多层住宅',
          value: '5'
        }
      ],
      planContentList: [],
      camIdList: [],
      rules: {
        officeId: [
          { required: true, message: '请选择所属单位', trigger: 'blur' }
        ],
        devid: [{ required: true, trigger: 'blur', message: '请选择设备ID' }],
        iotCardId: [
          { required: true, trigger: 'blur', message: '请输入物联网卡号' },
          { validator: validIotCardId, trigger: 'blur' }
        ],
        rangeValue: [
          { required: true, trigger: 'blur', message: '请输入量程' },
          { validator: validNumber, trigger: 'blur' }
        ],
        minAlert: [
          { required: true, trigger: 'blur', message: '该项为必填项' },
          { validator: validNumber, trigger: 'blur' }
        ],
        length: [
          { required: true, trigger: 'blur', message: '该项为必填项' },
          { validator: validNumber, trigger: 'blur' }
        ],
        width: [
          { required: true, trigger: 'blur', message: '该项为必填项' },
          { validator: validNumber, trigger: 'blur' }
        ],
        high: [
          { required: true, trigger: 'blur', message: '该项为必填项' },
          { validator: validNumber, trigger: 'blur' }
        ],
        ton: [{ validator: validNumber, trigger: 'blur' }],
        maxAlert: [
          { required: true, trigger: 'blur', message: '该项为必填项' },
          { validator: validNumber, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    utList () {
      if (
        this.formData.sensorType === '001' ||
        this.formData.sensorType === '002'
      ) {
        return this.pressureUtList
      } else if (
        this.formData.sensorType === '003' ||
        this.formData.sensorType === '004'
      ) {
        return this.levelUtList
      } else {
        return []
      }
    },
    alertPlaceholder () {
      if (this.formData.sensorType === '001') {
        return ['0.07MPa', '0.5MPa']
      } else if (this.formData.sensorType === '002') {
        return ['0.05MPa', '0.1MPa']
      } else {
        return ['', '']
      }
    }
  },
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
            this.operTypeList = this.sensorCatList[
              index
            ].networkOperatorsValue.map((item, key) => {
              return {
                label: item,
                value: this.sensorCatList[index].networkOperatorArray[key]
              }
            })
          }
        }
      }
    }
  },
  created () {
    this._getWaterRegisterList()
    this._getDict()
    this._getSensorTypeList()
  },
  methods: {
    // 获取水设备注册列表
    _getWaterRegisterList () {
      this.listLoading = true
      getWaterRegisterList(this.listQuery).then(res => {
        if (res.data) {
          this.waterRegisterList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取水设备注册详情
    _geWaterRegisterInfo (data) {
      return new Promise((resolve, reject) => {
        geWaterRegisterInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              const data = Object.assign({}, res.data.water, {
                appInterval:
                  res.data.water.appInterval === null
                    ? ''
                    : String(res.data.water.appInterval),
                smsInterval: String(res.data.water.smsInterval)
              })
              resolve(data)
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
              value: item.id,
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
          this.appIntervalList = res.data.dicts
        }
      })
      getDict({
        type: 'sms_alert_interval'
      }).then(res => {
        if (res.data) {
          this.smsIntervalList = res.data.dicts
        }
      })
      getDict({
        type: 'dev_water_sensor'
      }).then(res => {
        if (res.data) {
          this.sensorTypeList = res.data.dicts
        }
      })
      getDict({
        type: 'ut_flag'
      }).then(res => {
        if (res.data) {
          this.pressureUtList = res.data.dicts
        }
      })
      getDict({
        type: 'length_ut_flag'
      }).then(res => {
        if (res.data) {
          this.levelUtList = res.data.dicts
        }
      })
    },
    // 获取水设备类型
    _getSensorTypeList () {
      getSensorTypeList({ devType: 1 }).then(res => {
        if (res.data) {
          this.sensorCatList = res.data
        }
      })
    },
    // 根据采集部位获取楼层
    _getPartsAddrList (id) {
      getPartsAddrList({ partsId: id }).then(res => {
        if (res.data) {
          this.partAddrList = res.data.map(partAddr => {
            return {
              value: partAddr.id,
              label: partAddr.name
            }
          })
        }
      })
    },
    showWaterRegisterForm () {
      this.$watch(
        'points',
        function () {
          this.drawPoints(this.points)
        },
        { deep: true }
      )
      this.dialogVisible = true
    },
    hideWaterRegisterForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.dialogVisible = false
      })
      this.pointsList = []
    },
    // 新增水设备注册
    handleCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formData = {
        id: '', // id存在更新、id不存在新增
        officeId: '',
        officeName: '',
        devid: '',
        iotCardId: '',
        partId: '',
        partAddrId: '',
        location: '',
        appInterval: '120',
        smsInterval: '1440',
        alertTel: '',
        sensorCat: '0',
        sensorType: '001',
        rangeValue: '',
        ut: '0',
        length: '',
        width: '',
        high: '',
        buildingType: '',
        minAlert: '',
        maxAlert: '',
        operTyp: '',
        planId: '',
        planX: '',
        planY: '',
        camId: '',
        expireTime: '',
        ton: '',
        instalPerson: '',
        instalTime: ''
      }
      this.showWaterRegisterForm()
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 查看表单信息
    async handleView (data, title) {
      this.title = title
      this.operationStatus = 'view'
      const detaile = await this._geWaterRegisterInfo(data)
      this.formData = { ...detaile }
      this.showWaterRegisterForm()
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
          const detaile = await this._geWaterRegisterInfo(data[0])
          this.formData = { ...detaile }
          this.pointsList = detaile.list
          this.showWaterRegisterForm()
        }
      } else {
        const detaile = await this._geWaterRegisterInfo(data)
        this.formData = { ...detaile }
        this.pointsList = detaile.list
        this.showWaterRegisterForm()
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
            deleteWaterRegister(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除水设备注册成功'
                })
                this._getWaterRegisterList()
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
      this._getWaterRegisterList()
    },
    // 新增水设备注册
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveWaterRegister(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('新增水设备注册成功')
              this.hideWaterRegisterForm()
              this._getWaterRegisterList()
            }
          })
        }
      })
    },
    // 更新水设备注册
    updateData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateWaterRegister(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('修改水设备注册成功')
              this.hideWaterRegisterForm()
              this._getWaterRegisterList()
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
          filename: '水设备注册列表'
        })
        this.exportLoading = false
      })
    },
    formatJson (filterVal) {
      return new Promise((resolve, reject) => {
        let data = []
        const query = this.$refs.searchForm.getSearchQuery()
        const listQuery = { ...this.listQuery, ...query, page: -1, limit: 0 }
        getWaterRegisterList(listQuery)
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
}
</style>
