<template>
  <div :style="{ height: '100%' }">
    <transition name="fade-transform" mode="out-in">
      <div v-show="!isShowUserManage" class="section-main unitrecord-container">
        <div class="left-container">
          <el-tabs v-if="isFire===1" v-model="activeTabName" @tab-click="handleTabClick">
            <el-tab-pane label="行政区划" name="division">
              <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
            </el-tab-pane>
            <el-tab-pane label="消防直属单位" name="directly">
              <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
            </el-tab-pane>
          </el-tabs>
          <div v-else class="division-tree">
            <div class="title">行政区划</div>
            <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
          </div>
        </div>
        <div class="right-container">
          <!-- 搜索框 -->
          <div class="search-box">
            <SearchForm :form-option="searchFormOption" @search="handleFilter" />
          </div>
          <!-- 搜索框 -->
          <!-- 条件框 -->
          <div class="filter-box">
            <el-button class="add" @click="handleCreate('新增')">添加</el-button>
          </div>
          <!-- 条件框 -->
          <!-- 列表框 -->
          <div class="table-box">
            <BaseTable
              :loading="listLoading"
              :table-height="'100%'"
              :table-config="tableConfig"
              :table-data="tableData"
              :border="false"
              @rowClick="handleView($event, '查看')"
              @handleSelectionChange="handleSelectionChange"
            >
              <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="200px">
                <template slot-scope="{ row }">
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
                  <el-tooltip content="人员" placement="top">
                    <el-button
                      icon="el-icon-user"
                      type="info"
                      circle
                      @click.stop="handleViewPersonnel(row)"
                    />
                  </el-tooltip>
                  <el-tooltip content="单位档案" placement="top">
                    <el-button
                      icon="el-icon-office-building"
                      type="warning"
                      circle
                      @click.stop="viewUnitArchives(row)"
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
              :page.sync="listQuery.page"
              :limit.sync="listQuery.pageSize"
              @pagination="_handlerUnitRecordList"
            />
          </div>
          <!-- 列表框 -->
        </div>
        <!-- 弹出框 -->
        <div class="dialog-container">
          <!--  -->
          <BaseForm
            ref="baseForm"
            :form-lading="formLading"
            :parent-instance="this"
            :form-option="formOption"
            :is-reset-form-flag="isResetFormFlag"
            @updateData="updateData"
            @createData="createData"
          />
          <!--  -->
          <el-dialog
            v-if="dialogVisible"
            class="dark unitArchives"
            :destroy-on-close="true"
            :visible.sync="dialogVisible"
            width="1240px"
            :close-on-click-modal="false"
          >
            <div name="title" class="dialog-title">单位档案</div>
            <div class="dialog-content">
              <unit-archives :office-id="viewOfficeId" />
            </div>
            <div name="footer" class="dialog-footer">
              <el-button @click="hide()">关闭</el-button>
            </div>
          </el-dialog>
          <!--  -->
        </div>
      </div>
      <!-- 弹出框 -->
    </transition>
    <transition name="fade-transform" mode="out-in">
      <UserManage
        v-if="isShowUserManage"
        :user-type="1"
        :office-id="viewUserOfficeId"
        :office-name="viewUserOfficeName"
        @hideUserManage="hideUserManage"
      />
    </transition>
  </div>
</template>

<script>
import {
  getDict,
  getOfficeLevelList,
  handlerUnitRecordMaintenanceList,
  handlerUnitRecordAreaTree,
  getFireTree,
  handlerUnitRecordList,
  handlerUnitRecordSave,
  handlerUnitRecordDetail,
  handlerUnitRecordUpdate,
  handlerUnitRecordDelete
} from '@/api/office'
import '../style/supervisionUnit.scss'
import './index.scss'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UserManage from '@/components/userManage'
import UnitArchives from '@/components/unitArchives'
import TreeNode from '@/components/treeNode'
import { upToTwoSignificantDigits, phoneAndTel } from '@/utils'
import { mapState } from 'vuex'

export default {
  /* 监管单位档案 */
  name: 'SupervisionUnitRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeNode,
    UserManage,
    UnitArchives,
    BaseForm
  },
  mixins: [formAction],
  data() {
    var checkNum = (rule, value, callback) => {
      const reg = /^(([1-9][0-9]*))$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var buildAreaCheck = (rule, value, callback) => {
      if (value) {
        if (!upToTwoSignificantDigits(value)) {
          callback(new Error('最多保留两位小数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var phoneAndTelCheck = (rule, value, callback) => {
      if (value) {
        if (!phoneAndTel(value)) {
          callback(new Error('请输入正确的手机号或者电话'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      listQuery: {
        name: '',
        level: '',
        areaId: '',
        fireDeptId: '',
        page: 1,
        pageSize: 10
      },
      formLading: true,
      total: 0,
      activeTabName: 'division',
      tabIndex: '0',
      dialogVisible: false,
      viewOfficeId: -1,
      treeData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '机构名称：',
            name: 'name',
            placeholder: '请输入机构名称'
          },
          {
            type: 'select',
            label: '单位分级：',
            name: 'level',
            placeholder: '请选择单位分级',
            dataList: []
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
          label: '机构名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'levelName',
          label: '单位分级',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '归属区域',
          align: 'left',
          width: ''
        },
        {
          prop: 'deputyTel',
          label: '联系电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'directDeptName',
          label: '行业主管部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'fireDeptName',
          label: '消防主管部门',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '单位名称：',
            name: 'name',
            type: 'text',
            labelWidth: '120px',
            maxlength: 64
          },
          {
            label: '组织结构代码：',
            name: 'orgCode',
            type: 'text',
            labelWidth: '120px',
            maxlength: 18
          },
          {
            label: '归属区域：',
            name: 'areaId',
            type: 'treeSelect',
            labelWidth: '120px',
            treeSelectOption: {
              title: '选择归属区域',
              name: 'areaName',
              request: {
                url: 'system/api/area/treeData',
                params: {
                  para: 'areaId'
                }
              }
            }
          },
          {
            label: '单位类别：',
            name: 'categoryId',
            type: 'treeSelect',
            labelWidth: '120px',
            treeSelectOption: {
              title: '选择单位类别',
              name: 'categoryName',
              request: {
                url: 'system/api/officetype/treeData',
                params: {}
              }
            }
          },
          {
            label: '消防主管部门：',
            name: 'fireDeptId',
            type: 'treeSelect',
            labelWidth: '120px',
            treeSelectOption: {
              title: '选择消防主管部门',
              name: 'fireDeptName',
              request: {
                url: 'system/api/office/fireTree',
                params: {
                  para: 'officeId'
                }
              }
            }
          },
          {
            label: '行业主管部门：',
            name: 'directDeptId',
            type: 'treeSelect',
            labelWidth: '120px',
            treeSelectOption: {
              title: '选择行业主管部门',
              name: 'directDeptName',
              request: {
                url: 'system/api/office/directTree',
                params: {
                  para: 'officeId'
                }
              }
            }
          },
          {
            label: '详细地址：',
            name: 'addr',
            type: 'text',
            labelWidth: '120px',
            colspan: true,
            maxlength: 225
          },
          {
            label: '经纬度：',
            name: 'lnglat',
            type: 'mapSelect',
            labelWidth: '120px',
            treeSelectOption: {
              name: 'addr'
            },
            colspan: true
          },
          {
            label: '消防安全责任人：',
            name: 'primaryName',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            label: '联系电话：',
            name: 'primaryTel',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '消防安全管理人：',
            name: 'deputyName',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            label: '联系电话：',
            name: 'deputyTel',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '物业值班人员：',
            name: 'officeDutyName',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            label: '物业值班电话：',
            name: 'officeDutyMobile',
            type: 'text',
            labelWidth: '120px'
          },
          {
            label: '建筑面积：',
            name: 'buildArea',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            label: '员工人数：',
            name: 'empNum',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            label: '所属行业：',
            name: 'industryId',
            type: 'treeSelect',
            labelWidth: '120px',
            treeSelectOption: {
              title: '选择所属行业',
              name: 'industryName',
              request: {
                url: 'system/api/officeindustry/treeData',
                params: {}
              }
            }
          },
          {
            type: 'select',
            label: '单位分级：',
            name: 'level',
            labelWidth: '120px',
            dataList: []
          },
          {
            type: 'select',
            label: '火灾高危单位：',
            name: 'isHighRisk',
            labelWidth: '120px',
            dataList: [
              {
                value: 0,
                label: '否'
              },
              {
                value: 1,
                label: '是'
              }
            ]
          },
          {
            label: '消防监督员：',
            name: 'fireMonitors',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            label: '社区站长：',
            name: 'commMaster',
            type: 'text',
            labelWidth: '120px',
            maxlength: 20
          },
          {
            type: 'text',
            label: '维保单位：',
            name: 'careOrg',
            labelWidth: '120px'
          }
        ],
        rules: {
          name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' }
          ],
          empNum: [{ validator: checkNum, trigger: 'blur' }],
          areaId: [
            { required: true, message: '请选择归属区域', trigger: 'blur' }
          ],
          fireDeptId: [
            { required: true, message: '选择行业主管部门', trigger: 'blur' }
          ],
          directDeptId: [
            { required: true, message: '选择消防主管部门', trigger: 'blur' }
          ],
          addr: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          lnglat: [
            { required: true, message: '请选择经纬度', trigger: 'blur' }
          ],
          buildArea: [{ validator: buildAreaCheck, trigger: 'blur' }],
          primaryTel: [{ validator: phoneAndTelCheck, trigger: 'blur' }],
          deputyTel: [{ validator: phoneAndTelCheck, trigger: 'blur' }],
          officeDutyMobile: [{ validator: phoneAndTelCheck, trigger: 'blur' }]
        }
      },
      viewUserOfficeId: '', // 查看人员officeId
      viewUserOfficeName: '', // 查看人员officeName
      isShowUserManage: false
    }
  },
  computed: {
    ...mapState({
      isFire: state => state.user.isFire
    })
  },
  created() {
    this._getDict()
    this._getOfficeLevelList()
    this._handlerUnitRecordAreaTree()
    this._handlerUnitRecordList()
    this._handlerUnitRecordMaintenanceList()
  },
  methods: {
    // 获取字典值
    _getDict() {
      getDict({
        type: 'sys_office_level'
      }).then(res => {
        if (res.data) {
          this.searchFormOption.config[1].dataList = res.data.dicts
        }
      })
    },
    _getOfficeLevelList() {
      getOfficeLevelList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'level') {
              return { ...item, dataList: res.data.officeLevels }
            } else {
              return item
            }
          })
        }
      })
    },
    _handlerUnitRecordMaintenanceList() {
      handlerUnitRecordMaintenanceList().then(res => {
        this.formOption.config[19].dataList = res.data
      })
    },
    // 获取tree
    _handlerUnitRecordAreaTree() {
      handlerUnitRecordAreaTree().then(res => {
        this.treeData = res.data
      })
    },
    _getFireTree() {
      getFireTree().then(res => {
        this.treeData = res.data
      })
    },
    // 获取列表
    _handlerUnitRecordList() {
      handlerUnitRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // tab
    handleTabClick(tab, event) {
      if (tab.index === '0') {
        this.tabIndex = tab.index
        this._handlerUnitRecordAreaTree()
      } else if (tab.index === '1') {
        this.tabIndex = tab.index
        this._getFireTree()
      }
    },
    // 树状方法
    handleNodeClick(data, node) {
      const index = this.tabIndex
      if (index === '0') {
        this.listQuery.areaId = data.id
        this.listQuery.fireDeptId = ''
        this._handlerUnitRecordList()
      } else if (index === '1') {
        this.listQuery.fireDeptId = data.id
        this.listQuery.areaId = ''
        this._handlerUnitRecordList()
      }
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerUnitRecordList()
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        handlerUnitRecordDetail({ id: data.id })
          .then(res => {
            if (res.data) {
              let lnglat = null
              if (
                res.data.officeInfo.longitude &&
                res.data.officeInfo.latitude
              ) {
                lnglat = `${res.data.officeInfo.longitude || ''},${res.data
                  .officeInfo.latitude || ''}`
              }
              const data = Object.assign({}, res.data.officeInfo, {
                lnglat
                // careOrg: parseInt(res.data.officeInfo.careOrg)
              })
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData(data) {
      const formData = Object.assign({}, data, {
        longitude: data.lnglat && data.lnglat.split(',')[0],
        latitude: data.lnglat && data.lnglat.split(',')[1],
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handlerUnitRecordSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handlerUnitRecordList()
          this.$message({
            message: '新增监管单位成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增监管单位失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData(data) {
      const formData = Object.assign({}, data, {
        longitude: data.lnglat && data.lnglat.split(',')[0],
        latitude: data.lnglat && data.lnglat.split(',')[1],
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handlerUnitRecordUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handlerUnitRecordList()
          this.$message({
            message: '修改监管单位成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改监管单位失败',
            type: 'error'
          })
        }
      })
    },
    // 删除数据
    deleteData(data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      handlerUnitRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handlerUnitRecordList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 查看人员列表页
    handleViewPersonnel(data) {
      this.viewUserOfficeId = data.id
      this.viewUserOfficeName = data.name
      this.isShowUserManage = true
    },
    // 隐藏人员
    hideUserManage() {
      this.isShowUserManage = false
    },
    // 打开单位详情页面
    viewUnitArchives(data) {
      const mulData = data
      if (Array.isArray(mulData)) {
        if (mulData.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (mulData.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          const personData = mulData[0]
          this.viewOfficeId = personData.id
          this.dialogVisible = true
        }
      } else {
        const personData = mulData
        this.viewOfficeId = personData.id
        this.dialogVisible = true
      }
    },
    hide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-child(even) {
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
