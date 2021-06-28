<template>
  <div class="section-main unitrecord-container">
    <div class="left-container">
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="行政区划" name="division">
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="消防直属单位" name="directly">
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="add" @click="handleCreate('新增监管单位')">添加</el-button>
        <el-button class="edit" @click="handleEdit(multipleSelection, '修改监管单位')">修改</el-button>
        <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
        <el-button class="weichat" @click="handlerViewPersonnel">查看人员</el-button>
        <el-button class="record" @click="viewUnitArchives(multipleSelection)">单位档案</el-button>
      </div>
      <!-- 条件框 -->
      <!-- 列表框 -->
      <div class="table-box">
        <BaseTable
          :loading="listLoading"
          :table-data="tableData"
          :table-config="tableConfig"
          :table-height="'100%'"
          :border="false"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            label="操作"
            align="left"
            width="320"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{row}">
              <el-button size="mini" type="primary" round @click="handleView(row, '查看监管单位')">查看</el-button>
              <el-button size="mini" type="success" round @click="handleEdit(row, '修改监管单位')">修改</el-button>
              <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
              <el-button size="mini" type="warning" round @click="viewUnitArchives(row)">单位档案</el-button>
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
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
      />
      <!--  -->
      <el-dialog
        v-if="dialogOfficeVisible"
        class="dark unitFilesDialog"
        :destroy-on-close="true"
        v-model:visible="dialogOfficeVisible"
        width="1240px"
        :close-on-click-modal="false"
      >
        <div name="title" class="dialog-title">单位档案</div>
        <div class="dialog-content">
          <!-- <unit-archives :office-id="viewOfficeId" /> -->
          <pre class="descript">
            青岛大学附属医院
            监督员
          </pre>
          <ul class="content">
            <li style="background: #007cc6" @click="markShow('BaseInfo')">
              <span>基本信息</span>
            </li>
            <li style="background: #f04c91">
              <span>消防平面图</span>
              <span>2</span>
            </li>
            <li style="background: #eb591d" @click="markShow('fireFightingPlan')">
              <span>消防预案</span>
              <span>5</span>
            </li>
            <li style="background: #fb9527" @click="markShow('rules')">
              <span>规章制度</span>
              <span>6</span>
            </li>
            <li style="background: #3cc515" @click="markShow('fireFightingTrianing')">
              <span>消防培训</span>
              <span>12</span>
            </li>
            <li style="background: #dcc004" @click="markShow('legalDocuments')">
              <span>合法性文件</span>
              <span>3</span>
            </li>
            <li style="background: #28a49a" @click="markShow('fireMaintenance')">
              <span>消防维保</span>
              <span>2</span>
            </li>
          </ul>
          <div class="unitFilesBottom">
            <div class="unit-box">
              <span>安全巡检</span>
              <div>
                <ul>
                  <li @click="markShow('keyParts')">
                    <span>重点部位</span>
                    <span>10</span>
                  </li>
                  <li @click="markShow('hiddenDangerRecord')">
                    <span>隐患记录</span>
                    <span>12</span>
                  </li>
                  <li @click="markShow('checkPlan')">
                    <span>检查计划</span>
                    <span>10</span>
                  </li>
                  <!-- handleCheckTraceView(data) -->
                  <li @click="markShow('checkMarks')">
                    <span>检查痕迹</span>
                    <span>10</span>
                  </li>
                  <li @click="markShow('fireFightingFacilities')">
                    <span>消防设施</span>
                    <span>10</span>
                  </li>
                  <li @click="markShow('miniFireStation')">
                    <span>微型消防站</span>
                    <span>10</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="unit-box">
              <span>单位评估</span>
              <div>
                <PieChart
                  id="assessMentPieChart"
                  width="100%"
                  height="100%"
                  :chart-data="assessMentPieData"
                />
                <div class="assess">
                  <div class="assess-top">
                    <div>
                      <span>单位评估成绩</span>
                      <div class="tag">44.0</div>
                    </div>
                    <div>
                      <span>等级</span>
                      <div class="tag">c</div>
                    </div>
                  </div>
                  <el-divider />
                  <div>
                    <span>评估时间</span>
                    <div style="margin: 4px 0;">2018-08-17 08:57:03</div>
                  </div>
                  <el-button round type="primary" @click="assessment()">重新评估</el-button>
                </div>
              </div>
            </div>
            <div class="unit-box">
              <span>物联网设备</span>
              <div>
                <ul>
                  <li>
                    <span>智慧用电安全</span>
                    <span>监测系统</span>
                  </li>
                  <li>
                    <span>智慧消防用水</span>
                    <span>监测系统</span>
                  </li>
                  <li>
                    <span>智慧型独立烟感</span>
                    <span>预警系统</span>
                  </li>
                  <li>
                    <span>智慧型可燃气体</span>
                    <span>预警系统</span>
                  </li>
                  <li>
                    <span>重点部位</span>
                    <span>监测系统</span>
                  </li>
                  <li>
                    <span>火灾自动</span>
                    <span>联网报警系统</span>
                  </li>
                  <li style="flex: 2">
                    可视化监测系统
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="hide()">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="formDialog dark unitFilesDialog"
        v-model:visible="dialogContentVisible"
        width="1240px"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <component :is="isComponent" :id="viewOfficeId" />
        <div name="footer" class="dialog-footer">
          <el-button @click="close()">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
    <router-view />
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
import {
  handlerAssessScore
} from '@/api/companyHome'
import './style/supervisionUnit.scss'
import './index.scss'
import formAction from '@/mixins/form.js'
import PieChart from '@/components/Charts/pieChart'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
// import UnitArchives from '@/components/unitArchives'
import TreeNode from '@/components/treeNode'
import BaseInfo from './components/baseInfo'
import fireFightingPlan from './components/fireFightingPlan'
import rules from './components/rules'
import fireFightingTrianing from './components/fireFightingTrianing'
import legalDocuments from './components/legalDocuments'
import fireMaintenance from './components/fireMaintenance'
import keyParts from './components/keyParts'
import checkPlan from './components/checkPlan'
import fireFightingFacilities from './components/fireFightingFacilities'
import checkMarks from './components/checkMarks'
import hiddenDangerRecord from './components/hiddenDangerRecord'
import miniFireStation from './components/miniFireStation'

export default {
  /* 监管单位档案 */
  name: 'UnitFiles',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeNode,
    BaseInfo,
    // BasMap,
    // UnitArchives,
    BaseForm,
    PieChart,
    fireFightingPlan,
    rules,
    fireFightingTrianing,
    legalDocuments,
    fireMaintenance,
    keyParts,
    checkPlan,
    fireFightingFacilities,
    hiddenDangerRecord,
    checkMarks,
    miniFireStation
  },
  mixins: [formAction],
  data () {
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
    return {
      isComponent: 'BaseInfo',
      dialogContentVisible: false,
      listLoading: false,
      listQuery: {
        name: '',
        level: '',
        areaId: '',
        fireDeptId: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      activeTabName: 'division',
      tabIndex: '0',
      dialogOfficeVisible: false,
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
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '机构名称',
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
            labelWidth: '120px'
          },
          {
            label: '组织结构代码：',
            name: 'orgCode',
            type: 'text',
            labelWidth: '120px'
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
                url: 'system/api/area/getAreaList',
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
            colspan: true
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
            labelWidth: '120px'
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
            labelWidth: '120px'
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
            labelWidth: '120px'
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
            labelWidth: '120px'
          },
          {
            label: '员工人数：',
            name: 'empNum',
            type: 'text',
            labelWidth: '120px'
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
            labelWidth: '120px'
          },
          {
            label: '社区站长：',
            name: 'commMaster',
            type: 'text',
            labelWidth: '120px'
          },
          {
            type: 'select',
            label: '维保单位：',
            name: 'careOrg',
            labelWidth: '120px',
            dataList: []
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
          ]
        }
      }
    }
  },
  computed: {
    assessMentPieData () {
      const pieChart = {
        unit: '分',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: false,
        series: [
          {
            name: '评估成绩',
            radius: ['40%', '75%'],
            center: ['50%', '40%'],
            roseType: 'radius',
            label: {
              show: false,
              position: 'center'
            },
            data: this.scorePieList,
            color: ['#f5a72c', '#2cc8f5', '#f14545', '#08b948']
          }
        ]
      }
      return pieChart
    }
  },
  created () {
    this._getDict()
    this._getOfficeLevelList()
    this._handlerUnitRecordAreaTree()
    this._handlerUnitRecordList()
    this._handlerUnitRecordMaintenanceList()
  },
  methods: {
    // 获取字典值
    _getDict () {
      getDict({
        type: 'sys_office_level'
      }).then(res => {
        if (res.data) {
          this.searchFormOption.config[1].dataList = res.data.dicts
        }
      })
    },
    _getOfficeLevelList () {
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
    _handlerUnitRecordMaintenanceList () {
      handlerUnitRecordMaintenanceList().then(res => {
        this.formOption.config[19].dataList = res.data
      })
    },
    // 获取tree
    _handlerUnitRecordAreaTree () {
      handlerUnitRecordAreaTree().then(res => {
        this.treeData = res.data
      })
    },
    _getFireTree () {
      getFireTree().then(res => {
        this.treeData = res.data
      })
    },
    // 获取列表
    _handlerUnitRecordList () {
      handlerUnitRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // tab
    handleTabClick (tab, event) {
      if (tab.index === '0') {
        this.tabIndex = tab.index
        this._handlerUnitRecordAreaTree()
      } else if (tab.index === '1') {
        this.tabIndex = tab.index
        this._getFireTree()
      }
    },
    // 树状方法
    handleNodeClick (data, node) {
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
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerUnitRecordList()
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handlerUnitRecordDetail({ id: data.id })
          .then(res => {
            if (res.data) {
              let lnglat = null
              if (res.data.officeInfo.longitude && res.data.officeInfo.latitude) {
                lnglat = `${res.data.officeInfo.longitude || ''},${res.data.officeInfo.latitude || ''}`
              }
              const data = Object.assign({}, res.data.officeInfo, {
                lnglat,
                careOrg: parseInt(res.data.officeInfo.careOrg)
              })
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    handleCheckTraceView (data) {
      this.alertData = data
      this.$refs.staffworkalert.handlerShow()
    },
    // 查看人员列表页
    handlerViewPersonnel () {
      const mulData = this.multipleSelection
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
          this.$router.push({
            path: `${this.$route.path}/${personData.id}`,
            query: { routerName: 'supervisionUnitRecord' }
          })
        }
      } else {
        this.$message({
          message: '请选择数据!',
          type: 'warning'
        })
      }
    },
    // 重新评估
    assessment () {
      handlerAssessScore({ officeId: this.viewOfficeId }).then(res => {

      })
    },
    // 新增数据
    createData (data) {
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
    updateData (data) {
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
    deleteData (data) {
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
    // 打开单位详情页面
    viewUnitArchives (data) {
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
          this.dialogOfficeVisible = true
          handlerAssessScore({ officeId: data.id }).then(res => {
            if (res.data) {
              this.scorePieList = res.data.scorings
            }
          })
        }
      } else {
        const personData = mulData
        this.viewOfficeId = personData.id
        this.dialogOfficeVisible = true
        handlerAssessScore({ officeId: data.id }).then(res => {
          if (res.data) {
            this.scorePieList = res.data.scorings
          }
        })
      }
    },
    hide () {
      this.dialogOfficeVisible = false
    },
    markShow (com) {
      this.isComponent = com
      this.dialogContentVisible = true
    },
    close () {
      this.isComponent = ''
      this.dialogContentVisible = false
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
  border-right: 1px solid rgba(90, 47, 47, 0.3);
}
.unitFilesDialog {
  .dialog-title {
    font-size: 18px;
    color: #fff;
    margin-bottom: 15px;
  }
  .el-dialog .dialog-content .el-form:not(.search-form) {
    padding: 0;
  }
  .form-box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-dialog__body {
    padding-top: 0;
    overflow: hidden;
  }
  .descript {
    color: #fff;
    background: #112653;
    padding-top: 20px;
  }
  .unitFilesBottom {
    display:flex;
    justify-content: space-between;
    .unit-box {
      width: 32%;
      margin-top: 10px;
      color: #fff;
      display: flex;
      flex-direction: column;
      >span {
        background: #193d8b;
        margin-bottom: 10px;
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
      }
      >div {
        flex: 1;
        background: #193d8b;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 15px;
        .el-divider {
          margin: 8px 0;
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            height: 50px;
            width: 48%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: #3a7ade;
            border-radius: 4px;
            margin-top: 10px;
          }
        }
        .assess {
          width:100%;
          margin-left: 10px;
          .assess-top {
            display: flex;
            >div {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .tag {
                height: 20px;
                width: 50px;
                background:#d36c6d;
                border-radius: 20px;
                line-height: 20px;
                text-align: center;
                margin-top: 8px;
              }
            }
            >div:nth-of-type(2) {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    background: #112653;
    padding: 10px 20px;
    li {
      height: 120px;
      width: 120px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      span:nth-of-type(2) {
        margin-top: 5px;
        font-size: 20px;
      }
    }
  }
}
</style>
