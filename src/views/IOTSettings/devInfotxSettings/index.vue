<template>
  <section class="main-wrapper devSmokeSettings">
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
        @pagination="_handleInfotxRegisterList"
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
            <el-col :span="12">
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
                <DevIdSelect v-model:value="formData.devId" :dev-type="'4'" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物联网卡号:" prop="iotCardId">
                <el-input v-model="formData.iotCardId" />
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
              <el-form-item label="设备名称:" prop="devName">
                <el-input v-model="formData.devName" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报警手机号:" prop="alertTel">
                <el-input v-model="formData.alertTel" placeholder="输入接收报警短信的手机号，最多七个，用逗号进行分割。" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否主机:" prop="isMaster">
                <el-radio v-model="formData.isMaster" :label="0">否</el-radio>
                <el-radio v-model="formData.isMaster" :label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否匹配主机号:" prop="isMatch">
                <el-radio v-model="formData.isMatch" :label="0">否</el-radio>
                <el-radio v-model="formData.isMatch" :label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="!formData.isMaster" :span="12">
              <el-form-item label="所属主机:" prop="masterDevId">
                <el-input v-model="formData.masterDevId" />
              </el-form-item>
            </el-col>
            <el-col v-if="!formData.isMaster" :span="12">
              <el-form-item label="从机编号:" prop="slaveNum">
                <el-select v-model="formData.slaveNum">
                  <el-option
                    v-for="item in slaveNumList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
              <el-form-item label="安装时间:" prop="instalTime">
                <el-date-picker
                  v-model="formData.instalTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="安装人员:" prop="instalPerson">
                <el-input v-model="formData.instalPerson" />
              </el-form-item>
            </el-col>
          </div>
        </el-form>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide">取 消</el-button>
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
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  handleSensorList,
  handleInfotxRegisterList,
  handleInfotxRegisterInfo,
  handleInfotxRegisterSave,
  handleInfotxRegisterUpdate,
  handleInfotxRegisterDelete
} from '@/api/infotx'
import { parseTime } from '@/utils'

import '@/styles/list.scss'
import UnitSelect from '@/components/UnitSelect'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import DevIdSelect from '../components/devIdSelect'
import Pagination from '@/components/Pagination'

export default {
  /* 消防用户传输设备设置 */
  name: 'DevSmokeSettings',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    DevIdSelect,
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
        iotCardId: '',
        officeName: '',
        status: '',
        instalTime: '',
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
      sensorCatList: [],
      camIdList: [],
      slaveNumList: [
        {
          value: 1,
          label: '1'
        },
        {
          value: 2,
          label: '2'
        },
        {
          value: 3,
          label: '3'
        },
        {
          value: 4,
          label: '4'
        },
        {
          value: 5,
          label: '5'
        },
        {
          value: 6,
          label: '6'
        },
        {
          value: 7,
          label: '7'
        },
        {
          value: 8,
          label: '8'
        },
        {
          value: 9,
          label: '9'
        },
        {
          value: 10,
          label: '10'
        }
      ],
      rules: {
        sensorCat: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        devId: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        officeId: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        iotCardId: [
          { required: true, trigger: 'blur', message: '这是必填字段' }
        ],
        masterDevId: [
          { required: true, trigger: 'blur', message: '这是必填字段' }
        ],
        slaveNum: [{ required: true, trigger: 'blur', message: '这是必填字段' }]
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
    }
  },
  created () {
    this._handleInfotxRegisterList()
    this._handleSensorList()
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 设备类型
    _handleSensorList () {
      const params = { category: 4 }
      handleSensorList(params).then(res => {
        this.sensorCatList = res.data.sensorList
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
      this._handleInfotxRegisterList()
    },
    // 列表
    _handleInfotxRegisterList () {
      this.listLoading = true
      handleInfotxRegisterList(this.listQuery).then(res => {
        if (res.data) {
          this.infotxRegisterList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 新增
    handleCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formData = {
        id: '', // id存在更新、id不存在新增
        officeId: '',
        officeName: '',
        sensorCat: '',
        devId: '',
        iotCardId: '',
        partId: '',
        partAddrId: '',
        location: '',
        devName: '',
        alertTel: '',
        isMaster: '',
        isMatch: '',
        masterDevId: '',
        slaveNum: '',
        camId: '',
        expireTime: '',
        instalPerson: '',
        instalTime: ''
      }
      this.handleShow()
    },
    // 获取详情
    _handleInfotxRegisterInfo (data) {
      return new Promise((resolve, reject) => {
        handleInfotxRegisterInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.devInfotx)
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
      const detaile = await this._handleInfotxRegisterInfo(data)
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
          const detaile = await this._handleInfotxRegisterInfo(data[0])
          this.formData = { ...detaile }
          this.handleShow()
        }
      } else {
        const detaile = await this._handleInfotxRegisterInfo(data)
        this.formData = { ...detaile }
        this.handleShow()
      }
    },
    // 新增
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          handleInfotxRegisterSave(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('新增成功')
              this.handleHide()
              this._handleInfotxRegisterList()
            }
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          handleInfotxRegisterUpdate(this.formData).then(res => {
            if (res.msg === 'ok') {
              this.$message.success('修改成功')
              this.handleHide()
              this._handleInfotxRegisterList()
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
            handleInfotxRegisterDelete(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this._handleInfotxRegisterList()
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
          filename: '用户传输设备注册列表'
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
        handleInfotxRegisterList(listQuery)
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
.devSmokeSettings {
  .dark {
    &.devSettingForm {
      .el-form {
        padding: 15px 20px;

        .form-content {
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-right: none;
          border-bottom: none;
          display: flex;
          flex-wrap: wrap;
        }

        .el-form-item {
          display: flex;
          flex: 0 1 50%;
          margin: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.3);
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
</style>
