<template>
  <section class="main-wrapper devCameraSettings">
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
        :loading="listLoading"
        :table-height="'100%'"
        :table-config="tableConfig"
        :table-data="infotxRegisterList"
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
        @pagination="_handleCameraRegisterList"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="devSettingForm devCamera-from dark"
      width="1200px"
      v-model:visible="dialogVisible"
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div class="dialog-content scroll">
        <el-scrollbar>
          <el-form
            ref="form"
            label-width="140px"
            :inline="true"
            :model="formData"
            :rules="rules"
            :disabled="operationStatus === 'view'"
          >
            <div class="form-content">
              <el-col :span="24">
                <el-form-item label="设备类型:" prop="sensorCat">
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
                <el-form-item label="所属单位:" prop="officeId">
                  <UnitSelect v-model:value="formData.officeId" v-model:label="formData.officeName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备ID:" prop="devId">
                  <DevIdSelect v-model:value="formData.devId" :dev-type="'5'" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录用户名:" prop="loginName">
                  <el-input v-model="formData.loginName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录密码:" prop="loginPass">
                  <el-input v-model="formData.loginPass" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="IP:" prop="ip">
                  <el-input v-model="formData.ip" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="端口:" prop="port">
                  <el-input v-model="formData.port" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否推送:" prop="isSysPush">
                  <el-select v-model="formData.isSysPush">
                    <el-option
                      v-for="item in isSysPushList"
                      :key="item.id"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否推送即打开:" prop="isSysPushOpen">
                  <el-select v-model="formData.isSysPushOpen">
                    <el-option
                      v-for="item in isSysPushOpenList"
                      :key="item.id"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所在部位:" prop="partId">
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
                <el-form-item label="具体位置:" prop="partAddrId">
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
              <el-col :span="24">
                <el-form-item label="详细位置:" prop="location">
                  <el-input v-model="formData.location" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="报警手机号:" prop="alertTel">
                  <el-input v-model="formData.alertTel" placeholder="输入接收报警短信的手机号，最多七个，用逗号进行分割。" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="平面图位置:" prop="planContent">
                  <PlanPosition
                    :part-addr-id="formData.partAddrId"
                    v-model:value="formData.devPosition"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安装人员:" prop="installPerson">
                  <el-input v-model="formData.installPerson" />
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
                <el-form-item label="安装时间:" prop="installTime">
                  <el-date-picker
                    v-model="formData.installTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS" :span="12">
                <el-form-item label="协议sessionkey:" prop="sessionKey">
                  <el-input v-model="formData.sessionKey" />
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS" :span="12">
                <el-form-item label="是否可easyGBS:" prop="gbsEnable">
                  <el-select v-model="formData.gbsEnable" placeholder="请选择">
                    <el-option
                      v-for="item in gbsEnableList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS && isGbsEnable" :span="12">
                <el-form-item label="GBS服务地址:" prop="gbsServer">
                  <el-input v-model="formData.gbsServer" />
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS && isGbsEnable" :span="12">
                <el-form-item label="GBS设备标识:" prop="gbsDeviceid">
                  <el-input v-model="formData.gbsDeviceid" />
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS && isGbsEnable" :span="12">
                <el-form-item label="GBS服务用户:" prop="gbsUser">
                  <el-input v-model="formData.gbsUser" />
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS && isGbsEnable" :span="12">
                <el-form-item label="GBS服务密码:" prop="gbsPassword">
                  <el-input v-model="formData.gbsPassword" />
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS && isGbsEnable" :span="24">
                <el-form-item label="设备供应商类型:" prop="supplier">
                  <el-select v-model="formData.supplier" placeholder="请选择">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="isShowGBS" :span="24" class="channelList">
                <el-table :data="formData.channelList" style="width: 100%">
                  <el-table-column label="通道序号" align="left" class-name="small-padding fixed-width">
                    <template v-slot="{ row, $index }">
                      <el-form-item :prop="`channelList.${$index}.num`" :rules="rules.num">
                        <el-input v-model="row.num" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="通道类型" align="left" class-name="small-padding fixed-width">
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`channelList.${$index}.channelType`"
                        :rules="rules.channelType"
                      >
                        <el-select v-model="row.channelType">
                          <el-option
                            v-for="item in channelTypeList"
                            :key="item.id"
                            :value="parseInt(item.value)"
                            :label="item.label"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="通道名称" align="left" class-name="small-padding fixed-width">
                    <template v-slot="{ row, $index }">
                      <el-form-item :prop="`channelList.${$index}.name`" :rules="rules.name">
                        <el-input v-model="row.name" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="通道位置" align="left" class-name="small-padding fixed-width">
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`channelList.${$index}.location`"
                        :rules="rules.location"
                      >
                        <el-input v-model="row.location" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="GBS通道标识"
                    align="left"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`channelList.${$index}.channelGbsId`"
                        :rules="rules.channelGbsId"
                      >
                        <el-input v-model="row.channelGbsId" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="安装时间" align="left" class-name="small-padding fixed-width">
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`channelList.${$index}.installTime`"
                        :rules="rules.installTime"
                      >
                        <el-date-picker
                          v-model="row.installTime"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column width="100" align="right">
                    <template v-slot:header>
                      <el-button size="mini" type="primary" @click="handleCamListAddRow">添加</el-button>
                    </template>
                    <template v-slot="{ row }">
                      <el-button size="mini" type="danger" @click="handleCamListDelect(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide">取 消</el-button>
        <el-button
          v-if="operationStatus !== 'view'"
          type="primary"
          @click="operationStatus === 'create' ? createData() : updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  handleSensorList,
  handleSupplierDict,
  handleChannelTypeDict,
  handleCameraRegisterList,
  handleCameraRegisterInfo,
  handleCameraRegisterSave,
  handleCameraRegisterUpdate,
  handleCameraRegisterDelete
} from '@/api/camera'
import { parseTime } from '@/utils'

import '@/styles/list.scss'
import UnitSelect from '@/components/UnitSelect'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import DevIdSelect from '../components/devIdSelect'
import PlanPosition from '@/components/planPosition'
import Pagination from '@/components/Pagination'

let idSeq = Date.now()

export default {
  /* 可视化设备 */
  name: 'DevCameraSettings',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    DevIdSelect,
    PlanPosition,
    UnitSelect
  },
  data () {
    return {
      dialogVisible: false,
      listLoading: true,
      exportLoading: false,
      title: '',
      operationStatus: '',
      multipleSelection: [],
      listQuery: {
        devId: '',
        officeName: '',
        installTime: '',
        expireTime: '',
        page: 1,
        limit: 10
      },
      partList: [],
      partAddrList: [],
      infotxRegisterList: [],
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '设备编号:',
            name: 'devId',
            placeholder: '请输入设备编号'
          },
          {
            type: 'text',
            label: '所属单位:',
            name: 'officeName',
            placeholder: '请输入所属单位'
          },
          {
            type: 'date',
            label: '安装时间:',
            name: 'instalTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            placeholder: '请选择安装时间'
          },
          {
            type: 'date',
            label: '服务到期时间:',
            name: 'expireTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
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
          prop: 'devId',
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
          prop: 'sensor',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'installTime',
          label: '启用时间',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            if (row.installTime) {
              return parseTime(row.installTime, '{yy}-{mm}-{dd}')
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
        }
      ],
      formData: {},
      sensorCatList: [],
      sensorList: [],
      isSysPushList: [
        {
          value: 0,
          label: '是'
        },
        {
          value: 1,
          label: '否'
        }
      ],
      isSysPushOpenList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      rules: {
        sensorCat: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        officeId: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        devId: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        ip: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        port: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        loginName: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        loginPass: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        gbsEnable: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        gbsServer: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        gbsDeviceid: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        gbsUser: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        gbsPassword: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        supplier: [{ required: true, message: '这是必填字段', trigger: 'blur' }]
      },
      gbsEnableList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      supplierList: [],
      channelTypeList: []
    }
  },
  computed: {
    isShowGBS () {
      const sensor = this.formData.sensorCat
      const index = this.sensorCatList.findIndex(item => {
        return item.sensorCat === sensor
      })
      if (index !== -1) {
        return this.sensorCatList[index].isHaveChanneL !== 0
      }
      return false
    },
    isGbsEnable () {
      return this.formData.gbsEnable === 1
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
    }
  },
  created () {
    this._handleCameraRegisterList()
    this._handleSensorList()
    this._handleSupplierDict()
    this._handleChannelTypeDict()
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 设备类型
    _handleSensorList () {
      const params = { category: 5 }
      handleSensorList(params).then(res => {
        this.sensorCatList = res.data.sensorList
      })
    },
    // 设备供应商类型
    _handleSupplierDict () {
      handleSupplierDict().then(res => {
        this.supplierList = res.data
      })
    },
    // 通道类型
    _handleChannelTypeDict () {
      handleChannelTypeDict().then(res => {
        this.channelTypeList = res.data
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
    // 查询
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleCameraRegisterList()
    },
    // 列表
    _handleCameraRegisterList () {
      this.listLoading = true
      handleCameraRegisterList(this.listQuery)
        .then(res => {
          if (res.data) {
            this.infotxRegisterList = res.data.page.list
            this.total = res.data.page.totalCount
          }
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 新增
    handleCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formData = {
        id: '',
        officeId: '',
        officeName: '',
        sensorCat: '',
        devId: '',
        loginName: '',
        loginPass: '',
        isSysPush: '',
        isSysPushOpen: '',
        ip: '',
        port: '',
        partId: '',
        partAddrId: '',
        location: '',
        alertTel: '',
        planContent: '',
        expireTime: '',
        installPerson: '',
        installTime: '',
        channelList: []
      }
      this.handleShow()
    },
    // 获取详情
    _handleCameraRegisterInfo (data) {
      return new Promise((resolve, reject) => {
        handleCameraRegisterInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              const data = Object.assign({}, res.data.cam, {
                supplier: String(res.data.cam.supplier)
              })
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 查看
    async handleView (data, title) {
      this.operationStatus = 'view'
      this.title = title
      const detaile = await this._handleCameraRegisterInfo(data)
      this.formData = { ...detaile }
      this.handleShow()
    },
    // 编辑
    async handleEdit (data, title) {
      this.operationStatus = 'edit'
      this.title = title
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
          const detaile = await this._handleCameraRegisterInfo(data[0])
          this.formData = { ...detaile }
          this.handleShow()
        }
      } else {
        const detaile = await this._handleCameraRegisterInfo(data)
        this.formData = { ...detaile }
        this.handleShow()
      }
    },
    // 新增
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          handleCameraRegisterSave(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('新增成功')
              this.handleHide()
              this._handleCameraRegisterList()
            }
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          handleCameraRegisterUpdate(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('修改成功')
              this.handleHide()
              this._handleCameraRegisterList()
            }
          })
        }
      })
    },
    // 删除
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
            handleCameraRegisterDelete(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this._handleCameraRegisterList()
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
    handleCamListAddRow () {
      this.formData.channelList.push({
        id: ++idSeq
      })
    },
    handleCamListDelect (row) {
      const index = row.id
      this.formData.channelList = this.formData.channelList.filter(item => {
        return item.id !== index
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
          filename: '可视化设备注册列表'
        })
        this.exportLoading = false
      })
    },
    handleShow () {
      this.dialogVisible = true
    },
    handleHide () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.dialogVisible = false
      })
    },
    arrToStr (arr, obj) {
      let str = ''
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          if (obj) {
            str += `${item[obj] || ''},`
          } else {
            str += `${item || ''},`
          }
        })
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    formatJson (filterVal) {
      return new Promise((resolve, reject) => {
        let data = []
        const query = this.$refs.searchForm.getSearchQuery()
        const listQuery = { ...this.listQuery, ...query, page: -1, limit: 0 }
        handleCameraRegisterList(listQuery)
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
.devCameraSettings {
  .dark {
    &.devCamera-from {
      .dialog-content {
        height: 500px;
        padding-right: 15px;

        .el-form {
          padding: 15px 10px;

          .el-form-item {
            display: flex;
            flex: 0 1 50%;
            margin: 0;
            padding: 14px 10px;

            .el-form-item__content {
              flex: 1;

              .el-input-number--medium {
                width: 100%;

                input {
                  text-align: left;
                }
              }

              .el-input {
                width: 100%;
              }

              .el-select {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.devCamera-from {
  .scroll {
    > .el-scrollbar {
      height: 100%;

      .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: scroll;
      }

      .el-scrollbar__bar {
        &.is-vertical {
          width: 4px; // 滚动条宽度
        }
      }

      .el-scrollbar__thumb {
        background-color: #4c79eb; // 可设置滚动条颜色
      }
    }
  }

  .form-content {
    border-left: none !important;

    .el-form-item {
      border-left: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  .channelList {
    margin-top: 10px;

    .el-form-item {
      border: none !important;
    }

    .el-table__header-wrapper {
      .cell {
        padding-left: 15px;
      }
    }

    .el-form-item__content {
      width: 100% !important;

      .el-input__inner {
        width: 110% !important;
      }
    }
  }
}
</style>
