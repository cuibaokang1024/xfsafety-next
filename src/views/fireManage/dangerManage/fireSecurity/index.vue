<template>
  <div class="danger-main fireSecurity">
    <div class="fireSecurity-tree">
      <div class="title">设备类型</div>
      <TreeNode
        height="722px"
        :tree-data="treeData"
        @handleNodeClick="handleNodeClick"
      />
    </div>
    <div class="fireSecurity-content">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="add" @click="handleSecCreate('新增')">添加</el-button>
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
          @rowClick="handleSecView($event, '查看')"
        >
          <el-table-column
            label="操作"
            align="left"
            width="320"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{ row }">
              <el-tooltip content="修改" placement="top">
                <el-button
                  icon="el-icon-edit-outline"
                  type="success"
                  circle
                  @click.stop="handleSecEdit(row, '修改')"
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
        <Pagination
          v-show="total > 0"
          :total="total"
          v-model:page="listQuery.page"
          v-model:limit="listQuery.pageSize"
          @pagination="_handleSecList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
      <div class="dialog-container">
        <el-dialog
          v-if="dialogVisible"
          class="dark fireSecurity-dialog devSettingForm"
          width="1000px"
          v-model:visible="dialogVisible"
          :destroy-on-close="true"
        >
          <div name="title" class="dialog-title">
            {{
              operationStatus === "create"
                ? "新增"
                : operationStatus === "edit"
                ? "修改"
                : "查看"
            }}
          </div>
          <div class="dialog-content">
            <el-scrollbar class="scroll">
              <el-form
                ref="fireSecurityForm"
                class="fireSecurity-form"
                :model="formData"
                :rules="rules"
                :disabled="operationStatus === 'view'"
              >
                <div class="form-content">
                  <el-col :span="12">
                    <el-form-item label="设备类型:" prop="type">
                      <TreeSelect
                        v-model:level="formData.type"
                        v-model:label="formData.typeName"
                        :tree-select-option="typeOption"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="code">
                    <el-form-item label="系统自动编号:" prop="num">
                      <el-input
                        v-model="formData.num"
                        placeholder="请输入内容"
                        autocomplete="off"
                        :disabled="operationStatus === 'edit'"
                      >
                        <template #append>
                          <el-button
                            :disabled="operationStatus === 'edit'"
                            :icon="
                              createNo
                                ? 'el-icon-loading'
                                : 'el-icon-refresh-left'
                            "
                            @click="_handleSecCreateNo"
                          ></el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="名称:" prop="name">
                      <el-input
                        v-model="formData.name"
                        placeholder="请输入内容"
                        autocomplete="off"
                        :maxlength="64"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="设备设施类型:" prop="facilityType">
                      <tree-select
                        v-model:value="formData.facilityType"
                        v-model:label="formData.facilityName"
                        :tree-select-option="facilityTypeOption"
                      />
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
                      <el-select
                        v-model="formData.partAddrId"
                        placeholder="请选择"
                      >
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
                    <el-form-item label="详细地址:" prop="addr">
                      <el-input
                        v-model="formData.addr"
                        placeholder="请输入内容"
                        autocomplete="off"
                        :maxlength="225"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="设施品牌:" prop="brand">
                      <el-input
                        v-model="formData.brand"
                        placeholder="请输入内容"
                        autocomplete="off"
                        :maxlength="200"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="购入时间:" prop="buyTime">
                      <el-date-picker
                        v-model="formData.buyTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="下次维保时间:" prop="qualityTime">
                      <el-date-picker
                        v-model="formData.qualityTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="{
                          disabledDate(time) {
                            if (formData.buyTime) {
                              return (
                                time.getTime() < new Date(formData.buyTime)
                              );
                            }
                          },
                        }"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="过期时间:" prop="outTime">
                      <el-date-picker
                        v-model="formData.outTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="{
                          disabledDate(time) {
                            if (formData.buyTime) {
                              return (
                                time.getTime() < new Date(formData.buyTime)
                              );
                            }
                          },
                        }"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="剩余天数提醒:" prop="surplusDay">
                      <el-input
                        v-model="formData.surplusDay"
                        placeholder="请输入内容"
                        autocomplete="off"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任部门:" prop="dutyDept">
                      <tree-select
                        v-model:value="formData.dutyDept"
                        v-model:label="formData.dutyDeptName"
                        :tree-select-option="departOptions"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任人:" prop="dutyUser">
                      <el-select
                        v-model="formData.dutyUser"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in dutyUserList"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        />
                      </el-select>
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
              @click="
                operationStatus === 'create'
                  ? handleCreateData()
                  : handleUpdateData()
              "
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
      <!-- 弹出框 -->
    </div>
  </div>
</template>

<script>
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  getDict,
  handleSecCreateNo,
  handleSecTypeTree,
  handleSecDeptList,
  handleSecDeptUser,
  handleSecList,
  handleSecInfo,
  handleSecSave,
  handleSecUpdate,
  handleSecDelete
} from '@/api/danger'

import '../style/index.scss'
import formAction from '@/mixins/form.js'
import { isOnlyNumber } from '@/utils'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import TreeNode from '@/components/treeNode'
import TreeSelect from '@/components/treeSelect'

export default {
  /* 消防和安保设施录入 */
  name: 'FireSecurity',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeSelect,
    TreeNode
  },
  mixins: [formAction],
  data () {
    const numCheck = (rule, value, callback) => {
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
    return {
      listLoading: false,
      dialogVisible: false,
      createNo: false,
      listQuery: {
        name: '',
        type: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      treeData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '名称:',
            name: 'name',
            placeholder: '请输入名称'
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
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'num',
          label: '系统编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '详细地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'dutyUserName',
          label: '责任人',
          align: 'left',
          width: ''
        },
        {
          prop: 'dutyDeptName',
          label: '责任部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'outTime',
          label: '过期时间',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formData: {
        buyTime: '',
        qualityTime: '',
        outTime: ''
      },
      rules: {
        type: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        addr: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        name: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        surplusDay: [{ validator: numCheck, trigger: 'blur' }]
      },
      partList: [],
      partAddrList: [],
      dutyDeptList: [],
      dutyUserList: [],
      facilityTypeList: [],
      typeOption: {
        title: '选择类型',
        request: {
          url: 'device/api/facilityinput/getDeviceType',
          params: {}
        }
      },
      facilityTypeOption: {
        title: '选择类型',
        request: {
          url: 'fire/api/pointstype/getTree',
          params: {}
        }
      },
      departOptions: {
        title: '选择所属部门',
        name: 'dutyDeptName',
        request: {
          url: '/system/api/dept/findList',
          params: {}
        }
      }
    }
  },
  watch: {
    'formData.partId': {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this._getPartsAddrList(newVal)
        }
      }
    },
    'formData.dutyDept': {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this._handleSecDeptUser(newVal)
        }
      }
    }
  },
  created () {
    this._getDict()
    this._getPartsList()
    this._handleSecDeptList()
    this._handleSecTypeTree()
    this._handleSecList()
  },
  methods: {
    // 设备设施类型
    _getDict () {
      getDict({
        type: 'facility_type'
      }).then((res) => {
        if (res.data) {
          this.facilityTypeList = res.data.dicts
        }
      })
    },
    // 生成编号
    _handleSecCreateNo () {
      handleSecCreateNo().then((res) => {
        this.createNo = true
        if (res.code === 200) {
          this.$message({
            message: '生成系统编号成功',
            type: 'success'
          })
          this.formData.num = res.msg
          this.createNo = false
        } else {
          this.$message({
            message: '生成系统编号失败',
            type: 'error'
          })
        }
      })
    },
    // 责任部门
    _handleSecDeptList () {
      handleSecDeptList().then((res) => {
        if (res.data) {
          this.dutyDeptList = res.data
        }
      })
    },
    // 责任人
    _handleSecDeptUser (deptId) {
      handleSecDeptUser({ deptId }).then((res) => {
        if (res.data) {
          this.dutyUserList = res.data
        }
      })
    },
    // 获取采集部位列表
    _getPartsList () {
      getPartsList().then((res) => {
        if (res.data) {
          this.buildingList = res.data
          this.partList = res.data.map((item) => {
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
      getPartsAddrList({ partsId: id }).then((res) => {
        if (res.data) {
          this.partAddrList = res.data.map((partAddr) => {
            return {
              value: partAddr.id,
              label: partAddr.name
            }
          })
        }
      })
    },
    // 获取tree
    _handleSecTypeTree () {
      handleSecTypeTree().then((res) => {
        res.data.unshift({
          label: '全部',
          value: ''
        })
        this.treeData = res.data
      })
    },
    // 树状方法
    handleNodeClick (data, node) {
      this.listQuery.type = data.value
      this._handleSecList()
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleSecList()
    },
    // 获取列表
    _handleSecList () {
      handleSecList(this.listQuery).then((res) => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleSecInfo({ id: data.id })
          .then((res) => {
            if (res.data) {
              resolve(res.data.facilityInput)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 新增页面
    handleSecCreate (title) {
      this.operationStatus = 'create'
      this.formData = {
        num: '',
        facilityType: '',
        facilityName: '',
        partId: '',
        partAddrId: '',
        dutyDept: '',
        dutyUser: ''
      }
      this.handleShow()
    },
    // 查看表单信息
    async handleSecView (data, title) {
      this.operationStatus = 'view'
      const detaile = await this._getListInfo(data)
      this.formData = detaile
      this.handleShow()
    },
    // 编辑页面
    async handleSecEdit (data, title) {
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
          this.formData = detaile
          this.handleShow()
        }
      } else {
        const detaile = await this._getListInfo(data)
        this.formData = detaile
        this.handleShow()
      }
    },
    // 新增数据
    handleCreateData () {
      this.$refs.fireSecurityForm.validate((valid) => {
        if (valid) {
          const formData = Object.assign({}, this.formData, {})
          handleSecSave(formData).then((res) => {
            if (res.msg === 'ok') {
              this._handleSecList()
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '新增失败',
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
      this.$refs.fireSecurityForm.validate((valid) => {
        if (valid) {
          const formData = Object.assign({}, this.formData, {
            id: this.formData.id
          })
          handleSecUpdate(formData).then((res) => {
            if (res.msg === 'ok') {
              this._handleSecList()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '修改失败',
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
        data.forEach((item) => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      handleSecDelete(list).then((res) => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleSecList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
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

<style lang="scss">
</style>
