<template>
  <section class="main-wrapper devWaterSettings">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
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
        :table-data="sensorTemplateList"
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
        @pagination="_getSensorList"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="devSettingForm dark"
      width="1000px"
      v-model:visible="dialogVisible"
    >
      <div name="title" class="dialog-title">新增传感器模板</div>
      <div class="dialog-content" style="height: 350px; padding-right: 15px;overflow-y: auto;">
        <el-form ref="form" label-width="120px" :inline="true" :model="formData" :rules="rules">
          <div class="form-content">
            <el-col :span="12">
              <el-form-item label="传感器分类：" prop="category">
                <el-select v-model="formData.category">
                  <el-option
                    v-for="item in categoryTypeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传感器类型ID：" prop="sensorCat">
                <el-input v-model="formData.sensorCat" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传感器名称：" prop="sensor">
                <el-input v-model="formData.sensor" />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.category !== 5" :span="12">
              <el-form-item label="是否NB设备：" prop="isNb">
                <el-radio-group v-model="formData.isNb">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.category === 5" :span="12">
              <el-form-item label="是否含有通道：" prop="isHaveChanneL">
                <el-select v-model="formData.isHaveChanneL" placeholder="请选择">
                  <el-option
                    v-for="item in isHaveChanneList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.category === 5" :span="24">
              <el-form-item label="是否easyGBS：" prop="gbsEnable">
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
            <el-col v-if="formData.isNb === 1" :span="24">
              <el-form-item label="运营商：" :prop="formData.isNb===1?'networkOperatorArray':''">
                <el-checkbox-group v-model="formData.networkOperatorArray">
                  <el-checkbox
                    v-for="operators in operatorsList"
                    :key="operators.value"
                    :label="operators.value"
                  >{{ operators.label }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注信息：" prop="remarks">
                <el-input v-model="formData.remarks" type="textarea" />
              </el-form-item>
            </el-col>
          </div>
          <div v-show="formData.category===0" class="alertValue">
            <div class="header">
              报警值：
              <el-button type="primary" @click="addElectricDtl">新增</el-button>
            </div>

            <el-table :data="formData.sensorDetails" style="width: 100%">
              <el-table-column
                label="序号"
                width="100"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template v-slot="{row,$index }">
                  <el-form-item :prop="`sensorDetails.${$index}.sort`" :rules="rules.sort">
                    <el-input v-model.number="row.sort" class="edit-input" size="small" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="项目" align="center" class-name="small-padding fixed-width">
                <template v-slot="{row,$index }">
                  <el-form-item
                    :prop="`sensorDetails.${$index}.sensorType`"
                    :rules="rules.electricSensor"
                  >
                    <el-select v-model="row.sensorType" placeholder>
                      <el-option
                        v-for="item in sensorMappingList"
                        :key="item.id"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="单位" align="center" class-name="small-padding fixed-width">
                <template v-slot="{row,$index }">
                  <el-form-item :prop="`sensorDetails.${$index}.ut`" :rules="rules.ut">
                    <el-select v-model="row.ut" placeholder>
                      <el-option
                        v-for="item in utElectricFlagList"
                        :key="item.id"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="最低值" align="center" class-name="small-padding fixed-width">
                <template v-slot="{row,$index }">
                  <el-form-item :prop="`sensorDetails.${$index}.minAlert`" :rules="rules.minAlert">
                    <el-input v-model="row.minAlert" class="edit-input" size="small" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="最高值" align="center" class-name="small-padding fixed-width">
                <template v-slot="{row,$index }">
                  <el-form-item :prop="`sensorDetails.${$index}.maxAlert`" :rules="rules.maxAlert">
                    <el-input v-model="row.maxAlert" class="edit-input" size="small" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="APP报警间隔"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template v-slot="{row,$index}">
                  <el-form-item :prop="`sensorDetails.${$index}.appAlert`" :rules="rules.appAlert">
                    <el-select v-model="row.appAlert" placeholder>
                      <el-option
                        v-for="item in appIntervalList"
                        :key="item.id"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="短信报警间隔" align="center" class-name="small-padding fixed-width">
                <template v-slot="{row,$index}">
                  <el-form-item :prop="`sensorDetails.${$index}.smsAlert`" :rules="rules.smsAlert">
                    <el-select v-model="row.smsAlert" placeholder>
                      <el-option
                        v-for="item in smsIntervalList"
                        :key="item.id"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="删除"
                width="60"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template v-slot="{row}">
                  <el-button
                    size="mini"
                    style="background:transparent;border: none;"
                    @click="deleteElectricDtl(row)"
                  >
                    <i style="font-size: 20px;color: red" class="el-icon-remove" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hideElectricRegisterForm">取 消</el-button>
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
import {
  getSensorList,
  getSensorInfo,
  saveSensor,
  updateSensor,
  deleteSensor,
  getDeviceType,
  getAllUnitList,
  getAllList
} from '@/api/sensor.js'

import '@/styles/list.scss'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import SearchForm from '@/components/searchForm'

var idSeq = Date.now()

export default {
  /* 传感器类型设置 */
  name: 'SensorTemplate',
  components: {
    BaseTable,
    SearchForm,
    Pagination
  },
  data () {
    const validNumber = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,3})))$/
      if (!reg.test(value)) {
        callback(new Error('请输入三位小数以内数字值'))
      } else {
        callback()
      }
    }
    const checkSensor = (rule, value, callback) => {
      const reg = /^(\w){1,10}$/
      if (!reg.test(value)) {
        callback(new Error('请输入10位以内的字母数字组合'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      listLoading: true,
      operationStatus: '',
      multipleSelection: [],
      listQuery: {
        category: '',
        page: 1,
        limit: 10
      },
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '传感器类型:',
            name: 'category',
            placeholder: '请选择类型',
            dataList: []
          }
        ]
      },
      categoryTypeList: [],
      total: 0,
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'sensorCat',
          label: '传感器类型ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'categoryName',
          label: '传感器分类',
          align: 'left',
          width: ''
        },
        {
          prop: 'sensor',
          label: '传感器名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      formData: {
        id: '',
        category: '',
        sensorCat: '',
        sensor: '',
        remarks: '',
        sensorDetails: []
      },
      sensorTemplateList: [],
      appIntervalList: [],
      smsIntervalList: [],
      utElectricFlagList: [],
      sensorMappingList: [],
      operatorsList: [],
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
      isHaveChanneList: [
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
        category: [
          { required: true, message: '请选择传感器分类', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur' },
          { validator: validNumber, trigger: 'blur' }
        ],
        sensorCat: [
          { required: true, message: '请输入传感器类型ID', trigger: 'blur' },
          { validator: checkSensor, trigger: 'blur' }
        ],
        sensor: [
          { required: true, message: '请输入传感器名称', trigger: 'blur' }
        ],
        isNb: [
          { required: true, message: '请选择是否Nb设备', trigger: 'blur' }
        ],
        networkOperatorArray: [
          { required: true, message: '请选择运营商', trigger: 'blur' }
        ],
        minAlert: [{ validator: validNumber, trigger: 'blur' }],
        maxAlert: [{ validator: validNumber, trigger: 'blur' }],
        electricSensor: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        ut: [{ required: true, message: '请选择单位', trigger: 'blur' }],
        appAlert: [
          { required: true, message: '请选择app报警间隔', trigger: 'blur' }
        ],
        smsAlert: [
          { required: true, message: '请选择短信报警间隔', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this._getSensorList()
    this._getDict()
    this._getAllUnitList()
    this._getAllList()
    this._getDeviceType()
  },
  methods: {
    // 获取传感器模板列表
    _getSensorList () {
      this.listLoading = true
      getSensorList(this.listQuery).then(res => {
        if (res.data) {
          this.sensorTemplateList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取传感器模板详情
    _getSensorInfo (data) {
      return new Promise((resolve, reject) => {
        getSensorInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              const data = res.data.sensor
              delete data.updateDate
              delete data.networkOperatorsValue
              resolve({
                ...data,
                sensorDetails: data.sensorDetails || [],
                networkOperatorArray: data.networkOperatorArray || []
              })
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    _getDeviceType () {
      getDeviceType().then(res => {
        if (res.data) {
          this.categoryTypeList = res.data
          this.searchFormOption.config[0].dataList = res.data
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
        type: 'operator_type'
      }).then(res => {
        if (res.data) {
          this.operatorsList = res.data.dicts
        }
      })
    },
    //
    _getAllUnitList () {
      getAllUnitList().then(res => {
        if (res.data) {
          this.utElectricFlagList = res.data
        }
      })
    },
    _getAllList () {
      getAllList().then(res => {
        if (res.data) {
          this.sensorMappingList = res.data.map(item => {
            return {
              label: item.sensor,
              value: item.sensorType
            }
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
    // 新增传感器模板
    handleCreate (title) {
      this.operationStatus = 'create'
      this.formData = {
        id: '',
        category: '',
        sensorCat: '',
        sensor: '',
        gbsEnable: 0,
        isHaveChanneL: 0,
        isNb: 0,
        remarks: '',
        networkOperators: '',
        networkOperatorArray: [],
        sensorDetails: []
      }
      this.showElectricRegisterForm()
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 查看表单信息
    async handleView (data, title) {
      this.operationStatus = 'view'
      const detaile = await this._getSensorInfo(data)
      this.formData = { ...detaile }
      this.showElectricRegisterForm()
    },
    // 编辑表单信息
    async handleEdit (data, title) {
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
          const detaile = await this._getSensorInfo(data[0])
          this.formData = { ...detaile }
          this.showElectricRegisterForm()
        }
      } else {
        const detaile = await this._getSensorInfo(data)
        this.formData = { ...detaile }
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
            deleteSensor(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除传感器模板成功'
                })
                this._getSensorList()
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
      this._getSensorList()
    },
    // 新增传感器模板
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            ...this.formData,
            networkOperators: this.formData.networkOperatorArray.join(',')
          }
          saveSensor(data).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('新增传感器模板成功')
              this.hideElectricRegisterForm()
              this._getSensorList()
            }
          })
        }
      })
    },
    // 更新传感器模板
    updateData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            ...this.formData,
            networkOperators: this.formData.networkOperatorArray.join(',')
          }
          updateSensor(data).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('修改传感器模板成功')
              this.hideElectricRegisterForm()
              this._getSensorList()
            }
          })
        }
      })
    },
    addElectricDtl () {
      this.formData.sensorDetails.push({
        _id: ++idSeq,
        sort: '',
        sensor: '',
        ut: '',
        minAlert: '',
        maxAlert: '',
        appAlert: '',
        smsAlert: ''
      })
    },
    deleteElectricDtl (row) {
      this.formData.sensorDetails = this.formData.sensorDetails.filter(
        electricDtl => {
          if (row.id) {
            return electricDtl.id !== row.id
          } else {
            return electricDtl._id !== row._id
          }
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.devWaterSettings {
  .dark {
    &.devSettingForm {
      .alertValue {
        padding-top: 20px;
        .header {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
          color: #8cf6ff;
          .el-button {
            background: #0a82a5;
            border: none;
            font-size: 14px;
            font-weight: 400;
            color: #d4e5ff;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.alertValue {
  .el-table {
    .el-form-item {
      border: none !important;
    }
    .el-input__inner {
      color: #85a6d6;
      background-color: rgba(255, 255, 255, 0.1);
      border-color: transparent;
    }
  }
}
</style>
