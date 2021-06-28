<template>
  <div class="danger-main dangerWarehouse">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleWareCreate('入库', 2)">入库</el-button>
      <el-button class="record" @click="handleWareCreate('出库', 1)">出库</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableData"
        :table-height="'100%'"
        :border="false"
        @rowClick="handleWareView($event, '查看')"
      >
        <el-table-column label="操作" align="left" width="230" class-name="small-padding fixed-width">
          <template v-if="row.operation === 1 && row.returnableStorage" v-slot="{ row }">
            <el-tooltip content="归还" placement="top">
              <el-button
                icon="el-icon-sold-out"
                type="success"
                circle
                @click.stop="handleWareReturn(row, '归还', 3)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_handleWareList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <el-dialog
        v-if="dialogVisible"
        class="dark dangerWarehouse-dialog devSettingForm"
        width="840px"
        v-model:visible="dialogVisible"
        :destroy-on-close="true"
      >
        <div name="title" class="dialog-title">{{ title === '操作' ? '查看' : title }}</div>
        <div class="dialog-content">
          <el-scrollbar class="scroll">
            <el-form
              ref="dangerWarehouseForm"
              class="dangerWarehouse-form"
              :model="formData"
              :rules="rules"
              :disabled="operationStatus === 'view'"
            >
              <div class="form-content">
                <el-col :span="24">
                  <el-form-item label="危化品名称:" prop="storageId">
                    <DangerSelect
                      v-model:value="formData.storageId"
                      v-model:label="formData.name"
                      v-model:data="dangerData"
                      :disabled="formData.operation === 3"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="操作类型:" prop="operation">
                    <el-select v-model="formData.operation" placeholder="请选择" :disabled="true">
                      <el-option
                        v-for="item in operationList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${title}时间:`" prop="operateTime">
                    <el-date-picker
                      v-model="formData.operateTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="仓库储量:" prop="inventory">
                    <el-input
                      v-model="formData.inventory"
                      placeholder="仓库储量"
                      autocomplete="off"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="formData.operation !== 3 && operationStatus !== 'view'" :span="12">
                  <el-form-item label="单位:" prop="unitName">
                    <el-input
                      v-model="formData.unitName"
                      placeholder="单位"
                      autocomplete="off"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="formData.operation === 2 ? '入库数量:' : formData.operation === 1 ? '领取数量:' : '操作数量'"
                    prop="storage"
                  >
                    <el-input
                      v-model="formData.storage"
                      :placeholder="formData.operation === 2 ? '入库数量' : formData.operation === 1 ? '领取数量:' : '操作数量'"
                      autocomplete="off"
                      :disabled="formData.operation === 3"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="formData.operation !== 3" :span="12">
                  <el-form-item label="单位:" prop="unitName">
                    <el-input
                      v-model="formData.unitName"
                      placeholder="单位"
                      autocomplete="off"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="formData.operation === 3 && operationStatus !== 'view'" :span="12">
                  <el-form-item label="使用数量:" prop="userStorage">
                    <el-input v-model="formData.userStorage" placeholder="使用数量" autocomplete="off" />
                  </el-form-item>
                </el-col>
                <el-col v-if="formData.operation === 3 && operationStatus !== 'view'" :span="12">
                  <el-form-item label="可归还数量:" prop="returnableStorage">
                    <el-input
                      v-model="formData.returnableStorage"
                      placeholder="可归还数量"
                      autocomplete="off"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="formData.operation === 3 && operationStatus !== 'view'" :span="12">
                  <el-form-item label="归还数量:" prop="returnStorage">
                    <el-input
                      v-model="formData.returnStorage"
                      placeholder="归还数量"
                      autocomplete="off"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="operationStatus !== 'view'" :span="12">
                  <el-form-item label="操作人员:" prop="operator">
                    <DangerUserSelect
                      v-model:value="formData.operatorId"
                      v-model:label="formData.operator"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="formData.operation !== 2 && operationStatus !== 'view'" :span="12">
                  <el-form-item label="领取人员:" prop="receiver">
                    <DangerUserSelect
                      v-model:value="formData.receiverId"
                      v-model:label="formData.receiver"
                    />
                  </el-form-item>
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
            @click="handleCreateData()"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import { handleWareList, handleWareSave, handleWareInfo } from '@/api/danger'

import '../style/index.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import DangerSelect from '@/components/DangerSelect'
import DangerUserSelect from '@/components/DangerUserSelect'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  // 危化品出入库管理
  name: 'DangerWarehouse',
  components: {
    BaseTable,
    DangerSelect,
    SearchForm,
    DangerUserSelect,
    Pagination
  },
  mixins: [formAction],
  data () {
    var checkStorageNum = (rule, value, callback) => {
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (value.length > 8) {
        callback(new Error('最多输入8位有效数字'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字值或最多保留两位小数'))
      } else {
        if (this.formData.operation === 1) {
          if (value > this.formData.inventory) {
            callback(new Error('领取数量大于仓库数量'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    var checkUseNum = (rule, value, callback) => {
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字值或最多保留两位小数'))
      } else {
        if (value > this.formData.returnableStorage) {
          callback(new Error('使用数量不可大于可归还数量'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      dialogVisible: false,
      dialogReturnVisible: false,
      title: '',
      dangerData: {},
      operation: '',
      listQuery: {
        operation: '',
        name: '',
        operator: '',
        receiver: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10
      },
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '危化品名称:',
            name: 'name',
            placeholder: '请输入名称'
          },
          {
            type: 'text',
            label: '操作人员:',
            name: 'operator',
            placeholder: '请输入人员'
          },
          {
            type: 'text',
            label: '领取人员:',
            name: 'receiver',
            placeholder: '请输入人员'
          },
          {
            type: 'datetimerange',
            label: '操作时间:',
            name: 'operateTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            placeholder: '请输入时间'
          },
          {
            type: 'select',
            label: '操作类型:',
            name: 'operation',
            placeholder: '请选择类型',
            dataList: [
              {
                value: 1,
                label: '出库'
              },
              {
                value: 2,
                label: '入库'
              },
              {
                value: 3,
                label: '归还'
              }
            ]
          }
        ]
      },
      total: 0,
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'name',
          label: '危化品名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'operator',
          label: '操作人员',
          align: 'left',
          width: ''
        },
        {
          prop: 'receiver',
          label: '领取人员',
          align: 'left',
          width: ''
        },
        {
          prop: 'operateTime',
          label: '操作时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'operation',
          label: '操作类型',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            if (row.operation) {
              return row.operation === 1
                ? '出库'
                : row.operation === 2
                  ? '入库'
                  : '归还'
            }
          }
        },
        {
          prop: 'storage',
          label: '数量',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formData: {},
      rules: {
        storageId: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        operateTime: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        storage: [
          { required: true, validator: checkStorageNum, trigger: 'change' }
        ],
        userStorage: [
          { required: true, validator: checkUseNum, trigger: 'change' }
        ]
      },
      partList: [],
      operationList: [
        {
          value: 1,
          label: '出库'
        },
        {
          value: 2,
          label: '入库'
        },
        {
          value: 3,
          label: '归还'
        }
      ],
      tableReturnConfig: [
        {
          prop: 'name',
          label: '危化品名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'operator',
          label: '操作人员',
          align: 'left',
          width: ''
        }
      ],
      tableReturnData: []
    }
  },
  watch: {
    dangerData: {
      handler (newVal, oldVal) {
        this.formData.inventory = newVal.inventory
        this.formData.unit = newVal.unit
        this.formData.unitName = newVal.unitName
        if (this.formData.operation === 3) {
          this.formData.storage = newVal.storage
        }
      },
      deep: true
    },
    'formData.userStorage': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.formData.returnStorage = Math.round((this.formData.returnableStorage - newVal) * 100) / 100
        }
      },
      deep: true
    }
  },
  created () {
    this._handleWareList()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      const startTime = data.operateTime[0] || ''
      const endTime = data.operateTime[1] || ''
      delete data.operateTime
      this.listQuery = { ...this.listQuery, ...data, startTime, endTime }
      this._handleWareList()
    },
    // 获取列表
    _handleWareList () {
      handleWareList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.pageList.list.map(ele => {
            return { ...ele, storage: `${ele.storage}${ele.unitName}` }
          })
          this.total = res.data.pageList.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleWareInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增页面
    handleWareCreate (title, operation) {
      this.operationStatus = 'create'
      this.operation = operation
      this.title = title
      this.formData = {
        operation
      }
      this.handleShow()
    },
    // 新增页面
    async handleWareReturn (data, title, operation) {
      this.operationStatus = 'create'
      this.operation = operation
      this.title = title
      const info = await this._getListInfo(data)
      this.formData = Object.assign({}, info, {
        storageId: info.chemicalId || info.storageId,
        operation
      })
      this.handleShow()
    },
    // 查看页面
    async handleWareView (data, title, operation) {
      this.operationStatus = 'view'
      if (data.operation === 1) {
        this.operation = '出库'
      } else if (data.operation === 2) {
        this.operation = '入库'
      } else if (data.operation === 3) {
        this.operation = '归还'
      }
      this.title = '操作'
      const info = await this._getListInfo(data)
      this.formData = Object.assign({}, info, {
        storageId: info.chemicalId || info.storageId,
        operation: this.operation
      })
      this.handleShow()
    },
    // 新增数据
    handleCreateData () {
      this.$refs.dangerWarehouseForm.validate(valid => {
        if (valid) {
          const formData = Object.assign({}, this.formData, {
            chemicalId: this.formData.storageId
          })
          handleWareSave({
            operation: this.operation,
            formData
          }).then(res => {
            if (res.msg === 'ok') {
              this._handleWareList()
              this.$message({
                message: '成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '失败',
                type: 'error'
              })
            }
          })
          this.handleHide()
        }
      })
    },
    handleShow () {
      this.dialogVisible = true
    },
    handleHide () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
