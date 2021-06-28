<template>
  <div class="project-main keyCustom">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleKeyCreate('添加重点客户')">添加</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableData"
        :border="false"
        @rowClick="handleKeyView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleKeyEdit(row, '修改')"
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
        v-model:limit="listQuery.pageSize"
        @pagination="_handleKeyCustomList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <el-dialog
        v-if="dialogKeyVisible"
        class="violet keyCustom-dialog"
        width="1000px"
        v-model:visible="dialogKeyVisible"
        :destroy-on-close="true"
      >
        <div
          name="title"
          class="dialog-title"
        >{{ operationStatus === 'create' ? '新增重点客户' : operationStatus === 'edit' ? '修改重点客户' : '查看重点客户' }}</div>
        <div class="dialog-content">
          <el-scrollbar class="scroll">
            <el-form
              ref="keyCustomForm"
              class="keyCustom-form"
              :model="formKeyCustomOption"
              :rules="rules"
              :disabled="operationStatus === 'view'"
            >
              <el-col :span="12">
                <el-form-item label="公司名称:" prop="officeId">
                  <UnitSelect
                    v-model:value="formKeyCustomOption.officeId"
                    v-model:label="formKeyCustomOption.officeName"
                    v-model:addr="formKeyCustomOption.customerAddr"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责客服:" prop="customerService">
                  <el-input
                    v-model="formKeyCustomOption.customerService"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="单位地址:" prop="customerAddr ">
                  <el-input
                    v-model="formKeyCustomOption.customerAddr "
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签订合同时间:" prop="contractTime">
                  <el-date-picker
                    v-model="formKeyCustomOption.contractTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱地址:" prop="officeEmail">
                  <el-input
                    v-model="formKeyCustomOption.officeEmail"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人:" prop="contact">
                  <el-input
                    v-model="formKeyCustomOption.contact"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话:" prop="phoneNumber">
                  <el-input
                    v-model="formKeyCustomOption.phoneNumber"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="质保金:" prop="marginDeposit">
                  <el-input
                    v-model="formKeyCustomOption.marginDeposit"
                    placeholder="元"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同金额:" prop="contractDeposit">
                  <el-input
                    v-model="formKeyCustomOption.contractDeposit"
                    placeholder="元"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="服务费详情:" prop="serviceChargeDetail">
                  <el-input
                    v-model="formKeyCustomOption.serviceChargeDetail"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否微信:" prop="isWechat">
                  <el-select v-model="formKeyCustomOption.isWechat" placeholder="请选择">
                    <el-option
                      v-for="item in isWechatList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否重点客户:" prop="isKeyCustomer">
                  <el-select v-model="formKeyCustomOption.isKeyCustomer" placeholder="请选择">
                    <el-option
                      v-for="item in isKeyCustomerList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否试点:" prop="isTestPoint">
                  <el-select v-model="formKeyCustomOption.isTestPoint" placeholder="请选择">
                    <el-option
                      v-for="item in isTestPointList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div class="equipment-title">
                  <span>安装设备列表</span>
                </div>
                <div class="equipment-container">
                  <!-- 电设备 -->
                  <div v-if="electricList.length > 0" class="equip">
                    <div class="title">电设备</div>
                    <div class="list">
                      <div v-for="item in electricList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 电设备 -->
                  <!-- 水设备 -->
                  <div v-if="waterList.length > 0" class="equip">
                    <div class="title">水设备</div>
                    <div class="list">
                      <div v-for="item in waterList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 水设备 -->
                  <!-- 烟感设备 -->
                  <div v-if="smokeList.length > 0" class="equip">
                    <div class="title">烟感设备</div>
                    <div class="list">
                      <div v-for="item in smokeList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 烟感设备 -->
                  <!-- 燃气设备 -->
                  <div v-if="gasList.length > 0" class="equip">
                    <div class="title">燃气设备</div>
                    <div class="list">
                      <div v-for="item in gasList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 燃气设备 -->
                  <!-- 信息传输设备 -->
                  <div v-if="infotxList.length > 0" class="equip">
                    <div class="title">信息传输设备</div>
                    <div class="list">
                      <div v-for="item in infotxList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 信息传输设备 -->
                  <!-- 可视化设备 -->
                  <div v-if="camList.length > 0" class="equip">
                    <div class="title">可视化设备</div>
                    <div class="list">
                      <div v-for="item in camList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 可视化设备 -->
                  <!-- 重点部位检测设备 -->
                  <div v-if="alarmsList.length > 0" class="equip">
                    <div class="title">重点部位检测设备</div>
                    <div class="list">
                      <div v-for="item in alarmsList" :key="item.id" class="item">
                        <div class="text">
                          <div>{{ item.sensorName }}</div>
                          <div>{{ `${item.deviceTotalCount}台` }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 重点部位检测设备 -->
                </div>
              </el-col>
            </el-form>
          </el-scrollbar>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="dialogKeyVisible = false">取 消</el-button>
          <el-button
            v-if="operationStatus !== 'view'"
            type="primary"
            @click="operationStatus === 'create' ? handleCreateData() : handleUpdateData()"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handleKeyCustomList,
  handleKeyCustomSave,
  handleKeyCustomInfo,
  handleKeyCustomUpdate,
  handleKeyCustomDelete,
  handleKeyCustomDevList
} from '@/api/project'

import '../style/index.scss'
import formAction from '@/mixins/form'
import UnitSelect from '@/components/UnitSelect'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  // 重点客户
  name: 'KeyCustom',
  components: {
    SearchForm,
    BaseTable,
    UnitSelect,
    Pagination
  },
  mixins: [formAction],
  data () {
    var checkPhoneNum = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    var checkNum = (rule, value, callback) => {
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字值且保留两位小数'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      dialogKeyVisible: false,
      listQuery: {
        officeName: '',
        contractStartTime: '',
        contractEndTime: '',
        isKeyCustomer: '',
        isTestPoint: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '企业名称:',
            name: 'officeName',
            placeholder: '请输入企业名称'
          },
          {
            type: 'daterange',
            label: '签订合同时间:',
            name: 'contractTime',
            placeholder: '请选择签订合同时间',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          },
          {
            type: 'select',
            label: '是否重点客户:',
            name: 'isKeyCustomer',
            placeholder: '请选择是否',
            dataList: [
              {
                value: '0',
                label: '否'
              },
              {
                value: '1',
                label: '是'
              }
            ]
          },
          {
            type: 'select',
            label: '是否试点:',
            name: 'isTestPoint',
            placeholder: '请选择是否',
            dataList: [
              {
                value: '0',
                label: '否'
              },
              {
                value: '1',
                label: '是'
              }
            ]
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
          label: '公司名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'isWechatCh',
          label: '是否客户微信',
          align: 'left',
          width: '110'
        },
        {
          prop: 'customerAddr',
          label: '单位地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeEmail',
          label: '邮箱地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'customerService',
          label: '负责客服',
          align: 'left',
          width: ''
        },
        {
          prop: 'contact',
          label: '联系人',
          align: 'left',
          width: ''
        },
        {
          prop: 'phoneNumber',
          label: '电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'contractTime',
          label: '签订合同时间',
          align: 'left',
          width: '110'
        },
        {
          prop: 'marginDeposit',
          label: '质保金',
          align: 'left',
          width: ''
        },
        {
          prop: 'contractDeposit',
          label: '合同金额',
          align: 'left',
          width: ''
        },
        {
          prop: 'serviceChargeDetail',
          label: '服务费详情',
          align: 'left',
          width: ''
        },
        {
          prop: 'isKeyCustomerCh',
          label: '是否重点客户',
          align: 'left',
          width: '110'
        },
        {
          prop: 'isTestPointCh',
          label: '是否试点',
          align: 'left',
          width: ''
        }
      ],
      formKeyCustomOption: {},
      rules: {
        officeId: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: false, validator: checkPhoneNum, trigger: 'blur' }
        ],
        marginDeposit: [
          { required: false, validator: checkNum, trigger: 'blur' }
        ],
        contractDeposit: [
          { required: false, validator: checkNum, trigger: 'blur' }
        ]
      },
      isWechatList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      isKeyCustomerList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      isTestPointList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      devList: [], // 0 电设备 1 水设备 2 烟感设备 3 可燃气体 4 信息传输装置 5 视频可视化 6 重点部位检测
      electricList: [],
      waterList: [],
      smokeList: [],
      gasList: [],
      infotxList: [],
      camList: [],
      alarmsList: []
    }
  },
  watch: {
    'formKeyCustomOption.officeId': {
      handler: function (newVal) {
        this._handleKeyCustomDevList(newVal)
      },
      deep: true
    }
  },
  created () {
    this._handleKeyCustomList()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      const contractStartTime = data.contractTime[0] || ''
      const contractEndTime = data.contractTime[1] || ''
      delete data.contractTime
      this.listQuery = {
        ...this.listQuery,
        ...data,
        contractStartTime,
        contractEndTime
      }
      this._handleKeyCustomList()
    },
    // 获取列表
    _handleKeyCustomList () {
      handleKeyCustomList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleKeyCustomInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.keyCustomer)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增页面
    handleKeyCreate (title) {
      this.operationStatus = 'create'
      this.formKeyCustomOption = {}
      this.electricList = []
      this.waterList = []
      this.smokeList = []
      this.gasList = []
      this.infotxList = []
      this.camList = []
      this.alarmsList = []
      this.handleShow()
    },
    // 查看表单信息
    async handleKeyView (data, title) {
      this.operationStatus = 'view'
      const detaile = await this._getListInfo(data)
      this.formKeyCustomOption = detaile
      this.handleShow()
    },
    // 编辑页面
    async handleKeyEdit (data, title) {
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
          const detaile = await this._getListInfo(data[0])
          this.formKeyCustomOption = detaile
          this.handleShow()
        }
      } else {
        const detaile = await this._getListInfo(data)
        this.formKeyCustomOption = detaile
        this.handleShow()
      }
    },
    // 新增数据
    handleCreateData () {
      this.$refs.keyCustomForm.validate(valid => {
        if (valid) {
          const formData = Object.assign({}, this.formKeyCustomOption, {})
          handleKeyCustomSave(formData).then(res => {
            if (res.msg === 'ok') {
              this._handleKeyCustomList()
              this.$message({
                message: '新增重点客户成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '新增重点客户失败',
                type: 'error'
              })
            }
          })
          this.handleHide()
        }
      })
    },
    // 更新数据
    handleUpdateData () {
      this.$refs.keyCustomForm.validate(valid => {
        if (valid) {
          const formData = Object.assign({}, this.formKeyCustomOption, {
            id: this.formKeyCustomOption.id
          })
          handleKeyCustomUpdate(formData).then(res => {
            if (res.msg === 'ok') {
              this._handleKeyCustomList()
              this.$message({
                message: '修改重点客户成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '修改重点客户失败',
                type: 'error'
              })
            }
          })
          this.handleHide()
        }
      })
    },
    // 删除数据
    deleteData (data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      handleKeyCustomDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleKeyCustomList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    _handleKeyCustomDevList (_id) {
      if (_id) {
        handleKeyCustomDevList({ officeId: _id }).then(res => {
          this.devList = res.data
          // 电设备
          this.electricList = this.devList.filter(item => {
            return item.category === 0
          })
          // 水设备
          this.waterList = this.devList.filter(item => {
            return item.category === 1
          })
          // 烟感设备
          this.smokeList = this.devList.filter(item => {
            return item.category === 2
          })
          // 燃气设备
          this.gasList = this.devList.filter(item => {
            return item.category === 3
          })
          // 信息传输设备
          this.infotxList = this.devList.filter(item => {
            return item.category === 4
          })
          // 可视化设备
          this.camList = this.devList.filter(item => {
            return item.category === 5
          })
          // 重点部位检测设备
          this.alarmsList = this.devList.filter(item => {
            return item.category === 6
          })
        })
      }
    },
    handleShow () {
      this.dialogKeyVisible = true
    },
    handleHide () {
      this.dialogKeyVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
