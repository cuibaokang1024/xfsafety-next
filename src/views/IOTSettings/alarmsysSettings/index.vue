<template>
  <section class="main-wrapper keyPartMonitor">
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
        @pagination="_handleKeyPartsList"
      />
    </div>
    <div class="dialog-container">
      <el-dialog
        v-if="dialogVisible"
        v-model:visible="dialogVisible"
        class="devSettingForm keyPartMonitor-form dark"
        width="1000px"
      >
        <div name="title" class="dialog-title">{{ title }}</div>
        <div class="dialog-content scroll">
          <el-scrollbar>
            <el-form
              ref="form"
              label-width="100px"
              :inline="true"
              :model="formData"
              :rules="rules"
              :disabled="operationStatus === 'view'"
            >
              <div class="form-content">
                <el-col :span="12">
                  <el-form-item label="所属单位:" prop="officeId">
                    <UnitSelect v-model:value="formData.officeId" v-model:label="formData.officeName" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备ID:" prop="devId">
                    <DevIdSelect v-model:value="formData.devId" :dev-type="'6'" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="配置密码:" prop="password">
                    <el-input v-model="formData.password" show-password />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="配置手机号:" prop="phone">
                    <el-input v-model="formData.phone" />
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
                <el-col :span="24" class="devList">
                  <el-table :data="formData.alarmsysDtlList" style="width: 100%">
                    <el-table-column
                      label="防区编号"
                      align="left"
                      class-name="small-padding fixed-width"
                    >
                      <template v-slot="{ row, $index }">
                        <el-form-item
                          :prop="`alarmsysDtlList.${$index}.areaId`"
                          :rules="rules.areaId"
                        >
                          <el-input v-model.number="row.areaId" size="small" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="安装位置"
                      align="left"
                      class-name="small-padding fixed-width"
                    >
                      <template v-slot="{ row, $index }">
                        <el-form-item
                          :prop="`alarmsysDtlList.${$index}.location`"
                          :rules="rules.location"
                        >
                          <el-input v-model="row.location" size="small" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="设备名称"
                      align="left"
                      class-name="small-padding fixed-width"
                    >
                      <template v-slot="{ row, $index }">
                        <el-form-item
                          :prop="`alarmsysDtlList.${$index}.devName`"
                          :rules="rules.devName"
                        >
                          <el-input v-model="row.devName" size="small" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" align="right">
                      <template v-slot:header>
                        <el-button size="mini" type="primary" @click="handleAddRow">添加</el-button>
                      </template>
                      <template v-slot="{ row }">
                        <el-button size="mini" type="danger" @click="handleAddDelect(row)">删除</el-button>
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
    </div>
  </section>
</template>

<script>
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  handleKeyPartsList,
  handleKeyPartsInfo,
  handleKeyPartsSave,
  handleKeyPartsUpdate,
  handleKeyPartsDelete
} from '@/api/alarmsys'
import { parseTime } from '@/utils'

import '@/styles/list.scss'
import './index.scss'
import UnitSelect from '@/components/UnitSelect'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import DevIdSelect from '../components/devIdSelect'
import Pagination from '@/components/Pagination'

let idSeq = Date.now()

export default {
  /* 重点部位检测设备 */
  name: 'KeyPartsMonitor',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    DevIdSelect,
    UnitSelect
  },
  data () {
    var checkNum = (rule, value, callback) => {
      const index = parseInt(rule.field.split('.')[1])
      const { areaId } = this.formData.alarmsysDtlList[index]
      if (!Number.isInteger(areaId)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
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
            return row.status === null
              ? '离线'
              : row.status === 1
                ? '离线'
                : '在线'
          }
        }
      ],
      formData: { alarmsysDtlList: [] },
      camIdList: [],
      rules: {
        devId: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        officeId: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        areaId: [{ validator: checkNum, trigger: 'blur' }]
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
    this._handleKeyPartsList()
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
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
      this._handleKeyPartsList()
    },
    // 列表
    _handleKeyPartsList () {
      this.listLoading = true
      handleKeyPartsList(this.listQuery).then(res => {
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
        devId: '',
        password: '',
        phone: '',
        partId: '',
        partAddrId: '',
        location: '',
        alertTel: '',
        camId: '',
        expireTime: '',
        instalPerson: '',
        instalTime: '',
        alarmsysDtlList: []
      }
      this.handleShow()
    },
    // 获取详情
    _handleKeyPartsInfo (data) {
      return new Promise((resolve, reject) => {
        handleKeyPartsInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.alarmsys)
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
      const detaile = await this._handleKeyPartsInfo(data)
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
          const detaile = await this._handleKeyPartsInfo(data[0])
          this.formData = { ...detaile }
          this.handleShow()
        }
      } else {
        const detaile = await this._handleKeyPartsInfo(data)
        this.formData = { ...detaile }
        this.handleShow()
      }
    },
    // 新增
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          handleKeyPartsSave(this.formData).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.handleHide()
              this._handleKeyPartsList()
            }
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          handleKeyPartsUpdate(this.formData).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.handleHide()
              this._handleKeyPartsList()
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
            handleKeyPartsDelete(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this._handleKeyPartsList()
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
          filename: '重点部位检测设备注册列表'
        })
        this.exportLoading = false
      })
    },
    // 弹出框列表添加
    handleAddRow () {
      this.formData.alarmsysDtlList.push({
        id: ++idSeq
      })
    },
    // 弹出框列表删除
    handleAddDelect (row) {
      const index = row.id
      this.formData.alarmsysDtlList = this.formData.alarmsysDtlList.filter(
        item => {
          return item.id !== index
        }
      )
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
        handleKeyPartsList(listQuery)
          .then(res => {
            if (res.data) {
              data = res.data.page.list
            }
            resolve(
              data.map(v =>
                filterVal.map(j => {
                  if (j === 'status') {
                    return v.status === null
                      ? '离线'
                      : v.status === 1
                        ? '离线'
                        : '在线'
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
.keyPartMonitor-form {
  .el-form {
    padding: 10px 10px 10px 5px;

    .form-content {
      border-left: none !important;

      .el-form-item {
        border-left: 1px solid rgba(255, 255, 255, 0.3);
      }
    }

    .devList {
      .el-form-item {
        border: none !important;
      }
    }

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
</style>
