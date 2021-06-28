<template>
  <div class="safetyRecord residenceRecord">
    <div class="safetyRecord-left">
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="住宅管理" name="division">
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="待维护" name="directly" disabled>
          <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="safetyRecord-right">
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="add" @click="handleAddCreate('新增')">新增</el-button>
        <el-button class="weichat" @click="handlerPersonnelBack">返回上级</el-button>
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
          @rowClick="handleAddView($event, '查看')"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            label="操作"
            align="left"
            width="420"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{ row }">
              <el-tooltip content="修改" placement="top">
                <el-button
                  icon="el-icon-edit-outline"
                  type="success"
                  circle
                  @click.stop="handleAddEdit(row, '修改')"
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
              <el-tooltip content="一人一档" placement="top">
                <el-button
                  icon="el-icon-document"
                  type="primary"
                  circle
                  @click.stop="handleViewPersonRecord(row)"
                />
              </el-tooltip>
              <el-tooltip content="添加下级单位" placement="top">
                <el-button
                  icon="el-icon-plus"
                  type="warning"
                  circle
                  @click.stop="handleAddUnit(row, '添加下级单位')"
                />
              </el-tooltip>
              <el-tooltip content="住宅档案" placement="top">
                <el-button
                  icon="el-icon-office-building"
                  class="el-button--build"
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
          @pagination="_handleBuildingRecordList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
      <!-- 住宅弹窗 -->
      <el-dialog
        v-if="dialogResidenceVisible"
        class="dark residence-dialog"
        width="860px"
        v-model:visible="dialogResidenceVisible"
        :destroy-on-close="true"
      >
        <div
          name="title"
          class="dialog-title"
        >{{ operationStatus === 'create' ? '新增住宅管理' : operationStatus === 'edit' ? '修改住宅管理' : '查看住宅管理' }}</div>
        <div class="dialog-content">
          <el-form
            ref="residenceForm"
            class="residence-form"
            :model="formResidenceOption"
            :rules="rules"
            :disabled="operationStatus === 'view'"
          >
            <el-col :span="12">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="formResidenceOption.name"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分类:" prop="type">
                <el-select v-model="formResidenceOption.type" placeholder="请选择">
                  <el-option
                    v-for="item in residenceTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划:" prop="areaId">
                <el-input
                  v-model="formResidenceOption.areaName"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行业主管部门:" prop="directDeptId">
                <tree-select
                  v-model:value="formResidenceOption.directDeptId"
                  v-model:label="formResidenceOption.directDeptName"
                  :tree-select-option="directDeptOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址:" prop="addr">
                <el-input
                  v-model="formResidenceOption.addr"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <!-- type为1 -->
            <el-col v-if="formResidenceOption.type === '1'" :span="12">
              <el-form-item label="楼长:" prop="buildmanager">
                <el-input
                  v-model="formResidenceOption.buildmanager"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '1'" :span="12">
              <el-form-item label="联系电话:" prop="buildmanagerTel">
                <el-input
                  v-model="formResidenceOption.buildmanagerTel"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '1'" :span="12">
              <el-form-item label="建筑面积:" prop="areaCovered">
                <el-input
                  v-model="formResidenceOption.areaCovered"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '1'" :span="12">
              <el-form-item label="建筑高度:" prop="high">
                <el-input
                  v-model="formResidenceOption.high"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '1'" :span="12">
              <el-form-item label="建筑层数:" prop="floors">
                <el-input
                  v-model="formResidenceOption.floors"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '1'" :span="12">
              <el-form-item label="单元数:" prop="unitNum">
                <el-input
                  v-model="formResidenceOption.unitNum"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <!-- type为1 -->
            <!-- type为2 -->
            <el-col v-if="formResidenceOption.type === '2'" :span="12">
              <el-form-item label="负责人:" prop="buildmanager">
                <el-input
                  v-model="formResidenceOption.buildmanager"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '2'" :span="12">
              <el-form-item label="联系电话:" prop="buildmanagerTel">
                <el-input
                  v-model="formResidenceOption.buildmanagerTel"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '2'" :span="12">
              <el-form-item label="建筑层数:" prop="floors">
                <el-input
                  v-model="formResidenceOption.floors"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '2'" :span="12">
              <el-form-item label="户数:" prop="unitNum">
                <el-input
                  v-model="formResidenceOption.unitNum"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <!-- type为2 -->
            <!-- type为3 -->
            <el-col v-if="formResidenceOption.type === '3'" :span="12">
              <el-form-item label="业主:" prop="buildmanager">
                <el-input
                  v-model="formResidenceOption.buildmanager"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '3'" :span="12">
              <el-form-item label="联系电话:" prop="buildmanagerTel">
                <el-input
                  v-model="formResidenceOption.buildmanagerTel"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '3'" :span="12">
              <el-form-item label="所在楼层:" prop="floors">
                <el-input
                  v-model="formResidenceOption.floors"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formResidenceOption.type === '3'" :span="12">
              <el-form-item label="人数:" prop="unitNum">
                <el-input
                  v-model="formResidenceOption.unitNum"
                  placeholder="请输入内容"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <!-- type为3 -->
          </el-form>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="dialogResidenceVisible = false">取 消</el-button>
          <el-button
            v-if="operationStatus !== 'view'"
            type="primary"
            @click="operationStatus === 'create' ? handleCreateData() : handleUpdateData()"
          >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 住宅档案 -->
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
      <!-- 弹出框 -->
    </div>
    <router-view />
  </div>
</template>

<script>
import {
  handleResidenceRecordType,
  handleResidenceTreeData,
  handleBuildingRecordTreeData,
  handleBuildingRecordList,
  handleBuildingRecordInfo,
  handleBuildingRecordSave,
  handleBuildingRecordUpdate,
  handleBuildingRecordDelete
} from '@/api/safetyrecord'

import '../style/index.scss'
import formAction from '@/mixins/form.js'

import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import UnitArchives from '@/components/unitArchives'
import TreeNode from '@/components/treeNode'
import TreeSelect from '@/components/treeSelect'

export default {
  // 住宅管理
  name: 'ResidenceRecord',
  components: {
    BaseTable,
    Pagination,
    TreeSelect,
    TreeNode,
    UnitArchives
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        name: '',
        type: '',
        areaId: '',
        parentId: '',
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
          },
          {
            type: 'select',
            label: '类型：',
            name: 'level',
            placeholder: '请选择字段',
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
          label: '住宅名称',
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
          prop: 'deputyTel',
          label: '联系电话',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      operationStatus: 'create',
      dialogResidenceVisible: false,
      formResidenceOption: {},
      rules: {
        name: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        type: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        areaId: [{ required: true, message: '这是必填字段', trigger: 'blur' }]
      },
      residenceTypeList: [],
      directDeptOption: {
        title: '选择行业主管部门',
        request: {
          url: '/system/api/office/directTree',
          params: {}
        }
      },
      dialogVisible: false,
      viewOfficeId: -1,
      parentId: '',
      parentIds: ''
    }
  },
  created () {
    this.listQuery.type = this.$route.query.type
    this._handleResidenceTreeData()
    this._handleBuildingRecordList(this.$route.query.residenceId)
  },
  methods: {
    // 分级
    _handleResidenceRecordType (_id) {
      handleResidenceRecordType().then(res => {
        if (res.data) {
          const index = res.data.findIndex(item => {
            return Number(item.value) === Number(_id)
          })
          this.residenceTypeList = res.data.splice(index)
        }
      })
    },
    handleFindTreeData (_id, _array) {
      _array.forEach(item => {
        if (item.id === _id) {
          this.treeData = [item]
        } else if (item.children) {
          this.handleFindTreeData(_id, item.children)
        }
      })
    },
    // 获取tree
    _handleResidenceTreeData () {
      handleResidenceTreeData().then(res => {
        const Index = this.$route.query.residenceId
        this.handleFindTreeData(parseInt(Index), res.data)
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
        this._handleResidenceTreeData()
      } else if (tab.index === '1') {
        this.tabIndex = tab.index
        this._handleBuildingRecordTreeData()
      }
    },
    // 树状方法
    handleNodeClick (data, node) {
      const index = this.tabIndex
      if (index === '0') {
        if (node.childNodes.length > 0) {
          this.listQuery.parentId = data.id
          this.listQuery.areaId = data.areaId
          this.listQuery.type = node.childNodes[0].data.type
          this._handleBuildingRecordList(data.id)
        } else {
          this.$message({
            message: '已选择到最后一级别!',
            type: 'warning'
          })
        }
      }
    },
    // 获取列表
    _handleBuildingRecordList (_id) {
      this.listQuery.parentId = _id
      handleBuildingRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleBuildingRecordList(this.$route.query.residenceId)
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleBuildingRecordInfo({ id: data.id })
          .then(res => {
            if (res.data.highbuilding) {
              this._handleResidenceRecordType(0)
              const data = Object.assign({}, res.data.highbuilding, {
                type: res.data.highbuilding.type
              })
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
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
            path: `${this.$route.path}/${personData.id}`,
            query: { routerName: 'supervisionUnitRecord' }
          })
        }
      } else {
        const personData = mulData
        this.$router.push({
          path: `${this.$route.path}/${personData.id}`,
          query: { routerName: 'supervisionUnitRecord' }
        })
      }
    },
    // 新增页面
    handleAddCreate (title) {
      this.operationStatus = 'create'
      this.formResidenceOption = {
        areaId: this.$route.query.areaId,
        areaName: this.$route.query.areaName
      }
      this.parentId = this.$route.query.residenceId
      this.parentIds = `${this.$route.query.residenceIds}${this.$route.query.residenceId},`
      this._handleResidenceRecordType(this.$route.query.type)
      this.handleShow()
    },
    // 添加下级单位
    handleAddUnit (data, title) {
      this.operationStatus = 'create'
      this.formResidenceOption = {
        areaId: data.areaId,
        areaName: data.areaName
      }
      this.parentId = data.id
      this.parentIds = `${data.parentIds}${data.id},`
      this._handleResidenceRecordType(++data.type)
      this.handleShow()
    },
    // 查看表单信息
    async handleAddView (data, title) {
      this.operationStatus = 'view'
      const detaile = await this._getListInfo(data)
      this.formResidenceOption = detaile
      this.handleShow()
    },
    // 编辑页面
    async handleAddEdit (data, title) {
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
          this.formResidenceOption = detaile
          this.handleShow()
        }
      } else {
        const detaile = await this._getListInfo(data)
        this.formResidenceOption = detaile
        this.handleShow()
      }
    },
    // 新增数据
    handleCreateData () {
      this.$refs.residenceForm.validate(valid => {
        if (valid) {
          const formData = Object.assign({}, this.formResidenceOption, {
            longitude: this.formResidenceOption.lnglat,
            latitude: this.formResidenceOption.lnglat,
            parentId: this.parentId,
            parentIds: this.parentIds,
            files: this.files
          })
          handleBuildingRecordSave(formData).then(res => {
            if (res.msg === 'ok') {
              this._handleBuildingRecordList(this.$route.query.residenceId)
              this._handleResidenceTreeData()
              this.$message({
                message: '新增住宅管理成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '新增住宅管理失败',
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
      this.$refs.residenceForm.validate(valid => {
        if (valid) {
          const formData = Object.assign({}, this.formResidenceOption, {
            longitude: this.formResidenceOption.lnglat,
            latitude: this.formResidenceOption.lnglat,
            parentId: this.parentId,
            parentIds: this.parentIds,
            files: this.files,
            id: this.formResidenceOption.id
          })
          handleBuildingRecordUpdate(formData).then(res => {
            if (res.msg === 'ok') {
              this._handleBuildingRecordList(this.$route.query.residenceId)
              this._handleResidenceTreeData()

              this.$message({
                message: '修改住宅管理成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '修改住宅管理失败',
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
      handleBuildingRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleBuildingRecordList(this.$route.query.residenceId)
          this._handleResidenceTreeData()
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
          this.dialogVisible = true
        }
      } else {
        const personData = mulData
        this.viewOfficeId = personData.id
        this.dialogVisible = true
      }
    },
    handleShow () {
      this.dialogResidenceVisible = true
    },
    handleHide () {
      this.dialogResidenceVisible = false
    },
    hide () {
      this.dialogVisible = false
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
    handlerPersonnelBack () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
