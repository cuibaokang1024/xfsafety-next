<template>
  <div class="safetyRecord enterpriseRecord">
    <div class="safetyRecord-left">
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="行政区划" name="division">
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="消防直属单位" name="directly">
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="safetyRecord-right">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="add" @click="handleCreate('新增')">新增</el-button>
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
          @rowClick="handleView($event, '查看')"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            label="操作"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{row}">
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
                  @click.stop="handlerViewPersonnel(row)"
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
          v-model:page="listQuery.page"
          v-model:limit="listQuery.pageSize"
          @pagination="_handleEnterpriseRecordList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
      />
      <el-dialog
        v-if="dialogVisible"
        class="dark unitArchives"
        :destroy-on-close="true"
        v-model:visible="dialogVisible"
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
      <!-- 导入 -->
      <el-dialog
        v-if="dialogImport"
        class="dark unitArchives"
        :destroy-on-close="true"
        v-model:visible="dialogImport"
        width="900px"
      >
        <div name="title" class="dialog-title">单位批量导入</div>
        <div class="dialog-content">
          <el-form ref="importForm" class="import-form" :model="formImportOption" :rules="rules">
            <el-col :span="24">
              <el-form-item label="行政区划:" prop="areaId">
                <tree-select
                  v-model:value="formImportOption.areaId"
                  v-model:label="formImportOption.areaName"
                  :tree-select-option="areaSelectOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属类别:" prop="categoryId">
                <tree-select
                  v-model:value="formImportOption.categoryId"
                  v-model:label="formImportOption.categoryName"
                  :tree-select-option="categorySelectOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位分级:" prop="level">
                <el-select v-model="formImportOption.level" placeholder="请选择">
                  <el-option
                    v-for="item in officeLevelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="消防主管部门:" prop="fireDeptId">
                <tree-select
                  v-model:value="formImportOption.fireDeptId"
                  v-model:label="formImportOption.fireDeptName"
                  :tree-select-option="fireDeptOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行业主管部门:" prop="directDeptId">
                <tree-select
                  v-model:value="formImportOption.directDeptId"
                  v-model:label="formImportOption.directDeptName"
                  :tree-select-option="directDeptOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用燃气类型:" prop="level">
                <el-select v-model="formImportOption.level" placeholder="请选择">
                  <el-option
                    v-for="item in officeLevelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位类别:" prop="categoryId">
                <tree-select
                  v-model:value="formImportOption.categoryId"
                  v-model:label="formImportOption.categoryName"
                  :tree-select-option="categorySelectOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Excel:" prop="upload">
                <upload-file
                  ref="upload-file"
                  :limit="4"
                  :file-list="fileList"
                  @uploadSuccess="uploadSuccess"
                  @addDeleteFileList="addDeleteFileList"
                  @removeFile="removeFile"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="模板:" prop="name">
                <el-button size="mini" type="danger" round>导入模板下载</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div
                style="color: #f44336; padding-right: 100px;"
              >注意：导入单位是地址不允许带特殊符号（例如：四楼132#，5栋5-16），否则将会导入失败</div>
            </el-col>
            <el-col :span="24">
              <div class="import-title">
                <p>提示：</p>
                <span>
                  <p>1、模板中各项均不允许为空，为空项该条数据不导入</p>
                  <p>2、导入后请关闭并点击刷新按钮</p>
                  <p>3、导入多个单位时注意单位所属类别，消防主管部门，行业主管部门，单位分级,单位类别都是一致的</p>
                </span>
              </div>
            </el-col>
          </el-form>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button type="primary" @click="handleImportSave">确定</el-button>
          <el-button @click="dialogImport = false">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 弹出框 -->
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  getDict,
  getOfficeLevelList,
  getMaintenanceList,
  handleRecordAreaTree,
  handleRecordFireTree,
  handleEnterpriseRecordList,
  handleEnterpriseRecordSave,
  handleEnterpriseRecordInfo,
  handleEnterpriseRecordUpdate,
  handleEnterpriseRecordDelete
} from '@/api/safetyrecord'

import '../style/index.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UnitArchives from '@/components/unitArchives'
import TreeSelect from '@/components/treeSelect'
import TreeNode from '@/components/treeNode'
import UploadFile from '@/components/uploadFile'

export default {
  // 一企一档
  name: 'EnterpriseRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeSelect,
    TreeNode,
    UnitArchives,
    UploadFile,
    BaseForm
  },
  mixins: [formAction],
  data () {
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
      total: 0,
      activeTabName: 'division',
      tabIndex: '0',
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
            label: '单位名称:',
            name: 'name',
            type: 'text',
            labelWidth: '110px',
            colspan: true
          },
          {
            label: '组织结构代码:',
            name: 'orgCode',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '归属区域:',
            name: 'areaId',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择归属区域',
              name: 'areaName',
              request: {
                url: 'system/api/area/treeData',
                params: {}
              }
            }
          },
          {
            label: '单位类别:',
            name: 'categoryId',
            type: 'treeSelect',
            labelWidth: '110px',
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
            type: 'select',
            label: '单位分级:',
            name: 'level',
            labelWidth: '110px',
            dataList: []
          },
          {
            label: '所属行业:',
            name: 'industryId',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择所属行业',
              name: 'industryName',
              request: {
                url: '/system/api/officeindustry/treeData',
                params: {}
              }
            }
          },
          {
            label: '行业关联类别:',
            name: 'categoryIndustry',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择行业关联类别',
              name: 'categoryIndustryName',
              request: {
                url: '/system/api/officeinfo/officeTypeList',
                params: {}
              }
            }
          },
          {
            label: '消防主管部门:',
            name: 'fireDeptId',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择消防主管部门',
              name: 'fireDeptName',
              request: {
                url: 'system/api/office/fireTree',
                params: {}
              }
            }
          },
          {
            label: '行业主管部门:',
            name: 'directDeptId',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择行业主管部门',
              name: 'directDeptName',
              request: {
                url: 'system/api/office/directTree',
                params: {}
              }
            }
          },
          {
            label: '详细地址:',
            name: 'addr',
            type: 'text',
            labelWidth: '110px',
            colspan: true
          },
          {
            label: '经纬度:',
            name: 'lnglat',
            type: 'mapSelect',
            labelWidth: '110px',
            treeSelectOption: {
              name: 'addr'
            },
            colspan: true
          },
          {
            label: '消防安全责任人:',
            name: 'primaryName',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '联系电话:',
            name: 'primaryTel',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '消防安全管理人:',
            name: 'deputyName',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '联系电话:',
            name: 'deputyTel',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '建筑面积:',
            name: 'buildArea',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '员工人数:',
            name: 'empNum',
            type: 'text',
            labelWidth: '110px'
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
            label: '火灾高危单位:',
            name: 'isHighRisk',
            labelWidth: '110px',
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
            label: '消防监督员:',
            name: 'fireMonitors',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '社区站长:',
            name: 'commMaster',
            type: 'text',
            labelWidth: '110px'
          },
          {
            type: 'select',
            label: '维保单位:',
            name: 'careOrg',
            labelWidth: '110px',
            dataList: []
          }
        ],
        rules: {
          name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '请选择归属区域', trigger: 'blur' }
          ]
        }
      },
      dialogVisible: false, // 档案弹窗
      viewOfficeId: -1,
      dialogImport: false, // 导入弹窗
      formImportOption: {},
      rules: {
        id: [{ required: true, message: '这是必填字段', trigger: 'change' }]
      },
      areaSelectOption: {
        title: '选择行政区划',
        request: {
          url: 'system/api/area/treeData',
          params: {}
        }
      },
      categorySelectOption: {
        title: '选择所属类别',
        request: {
          url: 'system/api/area/treeData',
          params: {}
        }
      },
      directDeptOption: {
        title: '选择行业主管部门',
        request: {
          url: 'system/api/office/directTree',
          params: {}
        }
      },
      fireDeptOption: {
        title: '选择消防主管部门',
        request: {
          url: 'system/api/office/fireTree',
          params: {}
        }
      },
      officeLevelList: []
    }
  },
  created () {
    this._getDict()
    this._getOfficeLevelList()
    this._getMaintenanceList()
    this._handleRecordAreaTree()
    this._handleEnterpriseRecordList()
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
    _getMaintenanceList () {
      getMaintenanceList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'careOrg') {
              return { ...item, dataList: res.data }
            } else {
              return item
            }
          })
        }
      })
    },
    _getOfficeLevelList () {
      getOfficeLevelList().then(res => {
        if (res.data) {
          this.officeLevelList = res.data.officeLevels
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
    // 获取tree
    _handleRecordAreaTree () {
      handleRecordAreaTree().then(res => {
        this.treeData = res.data
      })
    },
    _handleRecordFireTree () {
      handleRecordFireTree().then(res => {
        this.treeData = res.data
      })
    },
    // tab
    handleTabClick (tab, event) {
      if (tab.index === '0') {
        this.tabIndex = tab.index
        this._handleRecordAreaTree()
      } else if (tab.index === '1') {
        this.tabIndex = tab.index
        this._handleRecordFireTree()
      }
    },
    // 树状方法
    handleNodeClick (data, node) {
      const index = this.tabIndex
      if (index === '0') {
        this.listQuery.areaId = data.id
        this.listQuery.fireDeptId = ''
        this._handleEnterpriseRecordList()
      } else if (index === '1') {
        this.listQuery.fireDeptId = data.id
        this.listQuery.areaId = ''
        this._handleEnterpriseRecordList()
      }
    },
    // 获取列表
    _handleEnterpriseRecordList () {
      handleEnterpriseRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery.name = data.name
      this.listQuery.level = data.level
      this._handleEnterpriseRecordList()
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleEnterpriseRecordInfo({ id: data.id }).then(res => {
          if (res.data) {
            if (res.data.officeInfo.longitude && res.data.officeInfo.latitude) {
              var lnglat = `${res.data.officeInfo.longitude},${res.data.officeInfo.latitude}`
            }
            const data = Object.assign({}, res.data.officeInfo, {
              lnglat: lnglat || '',
              careOrg: parseInt(res.data.officeInfo.careOrg)
            })
            resolve(data)
          }
        })
      })
    },
    // 查看人员列表页
    handlerViewPersonnel (data) {
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
          this.$router.push({
            path: `/fireManage/unitRecord/supervisionUnitRecord/${personData.id}`,
            query: { routerName: 'supervisionUnitRecord' }
          })
        }
      } else {
        const personData = mulData
        this.$router.push({
          path: `/fireManage/unitRecord/supervisionUnitRecord/${personData.id}`,
          query: { routerName: 'supervisionUnitRecord' }
        })
      }
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        longitude: data.lnglat.split(',')[0],
        latitude: data.lnglat.split(',')[1],
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleEnterpriseRecordSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleEnterpriseRecordList()
          this.$message({
            message: '新增一企一档成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增一企一档失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      const formData = Object.assign({}, data, {
        longitude: data.lnglat.split(',')[0],
        latitude: data.lnglat.split(',')[1],
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleEnterpriseRecordUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleEnterpriseRecordList()
          this.$message({
            message: '修改一企一档成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改一企一档失败',
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
      handleEnterpriseRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleEnterpriseRecordList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 导入文件
    handleImport (data) {
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
          this.dialogImport = true
        }
      } else {
        const personData = mulData
        this.viewOfficeId = personData.id
        this.dialogImport = true
      }
    },
    handleImportSave () {},
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
          this.dialogVisible = true
        }
      } else {
        const personData = mulData
        this.viewOfficeId = personData.id
        this.dialogVisible = true
      }
    },
    hide () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
</style>
