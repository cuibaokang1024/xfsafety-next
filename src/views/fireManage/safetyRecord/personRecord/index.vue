<template>
  <div class="safetyRecord personRecord">
    <div v-if="!this.$route.query.personId" class="safetyRecord-left">
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
      <div v-if="this.$route.query.personId" class="filter-box">
        <el-button
          class="add-user"
          @click="handleCreate('新增')"
        >新增</el-button>
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
          @rowClick="handlePersonView($event, '查看')"
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
                  @click.stop="handlePersonEdit(row, '修改')"
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
          @pagination="_handlePersonRecordList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
      <el-dialog
        v-if="dialogVisible"
        class="dark person-dialog"
        width="860px"
        v-model:visible="dialogVisible"
        :destroy-on-close="true"
      >
        <div
          name="title"
          class="dialog-title"
        >{{ operationStatus === 'create' ? '新增一人一档' : operationStatus === 'edit' ? '修改一人一档' : '查看一人一档' }}</div>
        <div class="dialog-content">
          <el-scrollbar>
            <el-form
              ref="personForm"
              class="person-form"
              :model="formPersonOption"
              :rules="rules"
              :disabled="operationStatus === 'view'"
            >
              <el-col :span="12">
                <el-form-item label="姓名:" prop="name">
                  <el-input v-model="formPersonOption.name" placeholder="请输入内容" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分类:" prop="gender">
                  <el-select v-model="formPersonOption.gender" placeholder="请选择">
                    <el-option
                      v-for="item in genderList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属建筑:" prop="highBuildName">
                  <el-input
                    v-model="formPersonOption.highBuildName"
                    placeholder="请输入内容"
                    autocomplete="off"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="详细地址:" prop="addr">
                  <el-input v-model="formPersonOption.addr" placeholder="请输入内容" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号:" prop="identity">
                  <el-input
                    v-model="formPersonOption.identity"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="formPersonOption.phone" placeholder="请输入内容" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人员类型:" prop="type">
                  <el-select v-model="formPersonOption.type" placeholder="请选择">
                    <el-option
                      v-for="item in personTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人员状态:" prop="status">
                  <el-select v-model="formPersonOption.status" placeholder="请选择">
                    <el-option
                      v-for="item in personStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="房间号:" prop="roomNum">
                  <el-input
                    v-model="formPersonOption.roomNum"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否户主:" prop="isHouseholder">
                  <el-select v-model="formPersonOption.isHouseholder" placeholder="请选择">
                    <el-option
                      v-for="item in isHouseholderList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="formPersonOption.isHouseholder === '0'" :span="12">
                <el-form-item label="户主:" prop="householder">
                  <el-input
                    v-model="formPersonOption.householder"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="formPersonOption.isHouseholder === '0'" :span="12">
                <el-form-item label="户主电话:" prop="holderTel">
                  <el-input
                    v-model="formPersonOption.holderTel"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="formPersonOption.isHouseholder === '0'" :span="24">
                <el-form-item label="户主身份证:" prop="holderIdentity">
                  <el-input
                    v-model="formPersonOption.holderIdentity"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注信息:" prop="remarks">
                  <el-input
                    v-model="formPersonOption.remarks"
                    type="textarea"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
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
              </el-col>
            </el-form>
          </el-scrollbar>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            v-if="operationStatus !== 'view'"
            type="primary"
            @click="operationStatus === 'create' ? handleCreateData() : handleUpdateData()"
          >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出框 -->
    </div>
  </div>
</template>

<script>
import {
  handleRecordAreaTree,
  handleRecordFireTree,
  handleTypeList,
  handleStatusList,
  handlePersonRecordList,
  handlePersonRecordSave,
  handlePersonRecordInfo,
  handlePersonRecordUpdate,
  handlePersonRecordDelete
} from '@/api/safetyrecord'

import '../style/index.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import UploadFile from '@/components/uploadFile'
import TreeNode from '@/components/treeNode'

export default {
  // 一人一档
  name: 'PersonRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeNode,
    UploadFile
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        name: '',
        type: '',
        highBuildId: '',
        areaId: '',
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
            name: 'type',
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
          label: '姓名',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '人员类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'statusName',
          label: '人员状态',
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
      operationStatus: 'create',
      dialogVisible: false,
      formPersonOption: {},
      rules: {
        name: [{ required: true, message: '这是必填字段', trigger: 'blur' }]
      },
      genderList: [
        {
          value: '1',
          label: '男'
        },
        {
          value: '2',
          label: '女'
        }
      ],
      personTypeList: [],
      personStatusList: [],
      isHouseholderList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ]
    }
  },
  created () {
    this._handleTypeList()
    this._handleStatusList()
    this._handleRecordAreaTree()
    this._handlePersonRecordList()
  },
  methods: {
    // 人员类型列表
    _handleTypeList () {
      handleTypeList().then(res => {
        if (res.data) {
          this.searchFormOption.config[1].dataList = res.data.personTypeList
          this.personTypeList = res.data.personTypeList
        }
      })
    },
    // 人员状态列表
    _handleStatusList () {
      handleStatusList().then(res => {
        if (res.data) {
          this.personStatusList = res.data.personStatusList
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
        this._handlePersonRecordList()
      } else if (index === '1') {
        this.listQuery.fireDeptId = data.id
        this.listQuery.areaId = ''
        this._handlePersonRecordList()
      }
    },
    // 获取列表
    _handlePersonRecordList () {
      this.listQuery.highBuildId = this.$route.query.personId
      handlePersonRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlePersonRecordList()
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handlePersonRecordInfo({ id: data.id }).then(res => {
          if (res.data.person) {
            this.fileList = []
            if (res.data.person.image) {
              this.fileList = [
                Object.assign({}, res.data.person, {
                  fileId: res.data.person.image,
                  url: res.data.person.imageUrl
                })
              ]
            }
            const data = Object.assign({}, res.data.person, {
              highBuildName:
                this.$route.query.highBuildName ||
                res.data.person.highbuildingName,
              status: parseInt(res.data.person.status),
              gender: parseInt(res.data.person.gender),
              type: parseInt(res.data.person.type)
            })
            resolve(data)
          }
        })
      })
    },
    handleFileIdInit (array) {
      const arr = []
      array.forEach(item => {
        arr.push(item.fileId)
      })
      return String(arr)
    },
    // 新增页面
    handlePersonCreate (title) {
      this.operationStatus = 'create'
      this.formPersonOption = {
        isHouseholder: '1',
        highBuildName: this.$route.query.highBuildName
      }
      this.handleShow()
    },
    // 查看表单信息
    async handlePersonView (data, title) {
      this.operationStatus = 'view'
      const detaile = await this._getListInfo(data)
      this.formPersonOption = detaile
      this.handleShow()
    },
    // 编辑页面
    async handlePersonEdit (data, title) {
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
          this.formPersonOption = detaile
          this.handleShow()
        }
      } else {
        const detaile = await this._getListInfo(data)
        this.formPersonOption = detaile
        this.handleShow()
      }
    },
    // 新增数据
    handleCreateData () {
      this.$refs.personForm.validate(valid => {
        if (valid) {
          const Base64 = require('js-base64').Base64
          var formData = {}
          if (this.$route.query.routerName === 'enterpriseRecord') {
            formData = Object.assign({}, this.formPersonOption, {
              officeId: this.listQuery.officeId,
              password: Base64.encode(this.formPersonOption.password)
            })
          }
          if (this.$route.query.routerName === 'buildingRecord') {
            formData = Object.assign({}, this.formPersonOption, {
              highbuildingId: this.$route.query.personId,
              image: this.handleFileIdInit(this.files),
              password: Base64.encode(this.formPersonOption.password)
            })
          }
          if (this.deleteFileList && this.deleteFileList.length > 0) {
            this._deletedFile()
          }
          handlePersonRecordSave(formData).then(res => {
            this._handlePersonRecordList()
            if (res.msg === 'ok') {
              this.$message({
                message: '新增人员成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '新增人员失败',
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
          const formData = Object.assign({}, this.formPersonOption, {
            highbuildingId: this.$route.query.personId,
            image: this.formPersonOption.image,
            files: this.files,
            id: this.id
          })
          if (this.deleteFileList && this.deleteFileList.length > 0) {
            this._deletedFile()
          }
          handlePersonRecordUpdate(formData).then(res => {
            if (res.msg === 'ok') {
              this._handlePersonRecordList()
              this.$message({
                message: '修改一人一档成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '修改一人一档失败',
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
      handlePersonRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handlePersonRecordList()
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

<style scoped lang="scss">
</style>
