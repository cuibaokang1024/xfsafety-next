<template>
  <div class="safetyRecord buildingRecord">
    <div class="safetyRecord-left">
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="行政区划" name="division">
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="待维护" name="directly" disabled>
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
              <el-tooltip content="人员" placement="top">
                <el-button
                  icon="el-icon-user"
                  type="info"
                  circle
                  @click.stop="handleViewPersonnel(row)"
                />
              </el-tooltip>
              <el-tooltip content="住宅" placement="top">
                <el-button
                  icon="el-icon-office-building"
                  type="warning"
                  circle
                  @click.stop="handleViewResidenceRecord(row)"
                />
              </el-tooltip>
              <el-tooltip content="一人一档" placement="top">
                <el-button
                  icon="el-icon-document"
                  type="primary"
                  circle
                  @click.stop="handleViewPersonRecord(row)"
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
          @pagination="_handleBuildingRecordList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @createData="createData"
        @updateData="updateData"
        @formHide="formHide"
      >
        <template v-slot:uploadFile>
          <upload-file
            ref="upload-file"
            :limit="1"
            :size="50"
            :list-type="'picture-card'"
            :file-list="fileList"
            @uploadSuccess="uploadSuccess"
            @addDeleteFileList="addDeleteFileList"
            @removeFile="removeFile"
          />
        </template>
      </BaseForm>
      <!-- 弹出框 -->
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  handleRecordAreaTree,
  handleResidenceRecordType,
  handleBuildingRecordTreeData,
  handleHighBuildStructureList,
  handleHighBuildFireRatingList,
  handleHighBuildGasTypeList,
  handleBuildingRecordList,
  handleBuildingRecordInfo,
  handleBuildingRecordSave,
  handleBuildingRecordUpdate,
  handleBuildingRecordDelete
} from '@/api/safetyrecord'

import '../style/index.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import TreeNode from '@/components/treeNode'
import UploadFile from '@/components/uploadFile'

export default {
  // 一楼一档
  name: 'BuildingRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeNode,
    UploadFile,
    BaseForm
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        name: '',
        areaId: '',
        type: '0',
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
            label: '名称：',
            name: 'name',
            placeholder: '请输入字段'
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
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '地址',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '建筑名称:',
            name: 'name',
            type: 'text',
            labelWidth: '110px',
            colspan: true
          },
          {
            label: '产权单位:',
            name: 'ownerOffice',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '行政区划:',
            name: 'areaId',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择行政区划',
              name: 'areaName',
              request: {
                url: '/system/admin/division/getOfficeArea',
                params: {}
              }
            }
          },
          {
            type: 'select',
            label: '分类:',
            name: 'type',
            labelWidth: '110px',
            dataList: [],
            colspan: true
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
            label: '法人代表:',
            name: 'corporate',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '联系电话:',
            name: 'corTel',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '安全员:',
            name: 'safetyPersonne',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '联系电话:',
            name: 'safetyTel',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '建筑类型:',
            name: 'purposeType',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择建筑类型',
              name: 'purposeTypeName',
              request: {
                url: '/system/api/highbuilding/purposeTypeList',
                params: {}
              }
            }
          },
          {
            label: '楼层类别:',
            name: 'highLevel',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择楼层类别',
              name: 'highLevelName',
              request: {
                url: '/system/api/highbuilding/highBuiLdLevelList',
                params: {}
              }
            }
          },
          {
            label: '员工人数:',
            name: 'empNum',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '建造时间:',
            name: 'consTime',
            type: 'date',
            labelWidth: '110px'
          },
          {
            label: '建筑面积:',
            name: 'squareAll',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '占地面积:',
            name: 'areaCovered',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '建筑高度:',
            name: 'high',
            type: 'text',
            labelWidth: '110px'
          },
          {
            type: 'select',
            label: '建筑结构:',
            name: 'structure',
            labelWidth: '110px',
            dataList: []
          },
          {
            type: 'select',
            label: '建筑防火等级:',
            name: 'fireRating',
            labelWidth: '110px',
            dataList: []
          },
          {
            type: 'select',
            label: '使用燃气类型:',
            name: 'gasType',
            labelWidth: '110px',
            dataList: []
          },
          {
            label: '液化气罐数量:',
            name: 'gasNum',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '液化气详情:',
            name: 'gasRemark',
            type: 'text',
            labelWidth: '110px'
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ],
        rules: {
          name: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
          type: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
          areaId: [
            { required: true, message: '请选择归属区域', trigger: 'blur' }
          ]
        }
      }
    }
  },
  created () {
    this._handleResidenceRecordType()
    this._handleHighBuildStructureList()
    this._handleHighBuildFireRatingList()
    this._handleHighBuildGasTypeList()
    this._handleRecordAreaTree()
    this._handleBuildingRecordList()
  },
  methods: {
    // 分级
    _handleResidenceRecordType () {
      handleResidenceRecordType({ sub: 1 }).then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'type') {
              return { ...item, dataList: res.data }
            } else {
              return item
            }
          })
        }
      })
    },
    // 建筑结构列表
    _handleHighBuildStructureList () {
      handleHighBuildStructureList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'structure') {
              return { ...item, dataList: res.data }
            } else {
              return item
            }
          })
        }
      })
    },
    // 建筑防火等级列表
    _handleHighBuildFireRatingList () {
      handleHighBuildFireRatingList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'fireRating') {
              return { ...item, dataList: res.data }
            } else {
              return item
            }
          })
        }
      })
    },
    // 燃气类型列表
    _handleHighBuildGasTypeList () {
      handleHighBuildGasTypeList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'gasType') {
              return { ...item, dataList: res.data }
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
    _handleBuildingRecordTreeData () {
      handleBuildingRecordTreeData().then(res => {
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
        this._handleBuildingRecordTreeData()
      }
    },
    // 树状方法
    handleNodeClick (data, node) {
      const index = this.tabIndex
      if (index === '0') {
        this.listQuery.areaId = data.id
        this.listQuery.fireDeptId = ''
        this._handleBuildingRecordList()
      } else if (index === '1') {
        this.listQuery.fireDeptId = data.id
        this.listQuery.areaId = ''
        this._handleBuildingRecordList()
      }
    },
    // 查看一人一档列表页
    handleViewPersonRecord (data) {
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
            path: '/fireManage/safetyRecord/personRecord',
            query: {
              personId: personData.id,
              highBuildName: personData.name,
              routerName: 'buildingRecord'
            }
          })
        }
      } else {
        const personData = mulData
        this.$router.push({
          path: '/fireManage/safetyRecord/personRecord',
          query: {
            personId: personData.id,
            highBuildName: personData.name,
            routerName: 'buildingRecord'
          }
        })
      }
    },
    // 查看住宅列表页
    handleViewResidenceRecord (data) {
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
          const residenceData = mulData[0]
          this.$router.push({
            path: '/fireManage/safetyRecord/residenceRecord',
            query: {
              residenceId: residenceData.id,
              residenceIds: residenceData.parentIds,
              areaId: residenceData.areaId,
              areaName: residenceData.areaName,
              type: ++residenceData.type
            }
          })
        }
      } else {
        const residenceData = mulData
        this.$router.push({
          path: '/fireManage/safetyRecord/residenceRecord',
          query: {
            residenceId: residenceData.id,
            residenceIds: residenceData.parentIds,
            areaId: residenceData.areaId,
            areaName: residenceData.areaName,
            type: ++residenceData.type
          }
        })
      }
    },
    // 获取列表
    _handleBuildingRecordList () {
      this.listQuery.type = '0'
      handleBuildingRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 查看人员列表页
    handleViewPersonnel (data) {
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
            path: `${this.$route.path}/${personData.id}`,
            query: {
              routerName: 'buildingRecord',
              areaId: personData.areaId,
              highBuildId: personData.id,
              highBuildName: personData.name
            }
          })
        }
      } else {
        const personData = mulData
        this.$router.push({
          path: `${this.$route.path}/${personData.id}`,
          query: {
            routerName: 'buildingRecord',
            areaId: personData.areaId,
            highBuildId: personData.id,
            highBuildName: personData.name
          }
        })
      }
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery.name = data.name
      this.listQuery.level = data.level
      this._handleBuildingRecordList()
    },
    handleFileIdInit (array) {
      const arr = []
      array.forEach(item => {
        arr.push(item.fileId)
      })
      return String(arr)
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleBuildingRecordInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.fileList = []
              if (res.data.highbuilding.image) {
                this.fileList = [
                  Object.assign({}, res.data.highbuilding, {
                    fileId: res.data.highbuilding.image,
                    url: res.data.highbuilding.imageUrl
                  })
                ]
              }
              if (
                res.data.highbuilding.longitude &&
                res.data.highbuilding.latitude
              ) {
                var lnglat = `${res.data.highbuilding.longitude},${res.data.highbuilding.latitude}`
              }
              const data = Object.assign({}, res.data.highbuilding, {
                highLevel: parseInt(res.data.highbuilding.highLevel),
                purposeType: parseInt(res.data.highbuilding.purposeType),
                type: parseInt(res.data.highbuilding.type),
                structure: parseInt(res.data.highbuilding.structure),
                fireRating: parseInt(res.data.highbuilding.fireRating),
                gasType: parseInt(res.data.highbuilding.gasType),
                lnglat: lnglat || ''
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
    createData (data) {
      const formData = Object.assign({}, data, {
        longitude: data.lnglat ? data.lnglat.split(',')[0] : '',
        latitude: data.lnglat ? data.lnglat.split(',')[1] : '',
        image: this.handleFileIdInit(this.files),
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleBuildingRecordSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleBuildingRecordList()
          this.$message({
            message: '新增一楼一档成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增一楼一档失败',
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
        image: data.image || this.handleFileIdInit(this.files),
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleBuildingRecordUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleBuildingRecordList()
          this.$message({
            message: '修改一楼一档成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改一楼一档失败',
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
      handleBuildingRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleBuildingRecordList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
