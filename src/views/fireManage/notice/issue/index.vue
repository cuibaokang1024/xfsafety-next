<template>
  <div class="inspect-main notice">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="record" @click="handleNoticeCreate('下发')">下发</el-button>
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
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="状态" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <span>{{ row.status === "0" ? "草稿" : "发布" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查阅状态(已读/未读)" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <span>{{ row.readNum + "/" + row.unReadNum }}</span>
            <span
              v-if="row.status === '1'"
              style="color: #1584ec; cursor: pointer;"
              @click="handleInitConsult(row)"
            >详情</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-tooltip content="查看" placement="top">
              <el-button
                v-if="row.status === '1'"
                icon="el-icon-search"
                type="primary"
                circle
                @click="handleNoticeView(row, '查看')"
              />
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button
                v-if="row.status === '0'"
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click="handleNoticeEdit(row, '修改')"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button icon="el-icon-delete" type="danger" circle @click="handleDelete(row)" />
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
        @pagination="_handleOfficeOanotifyList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <el-dialog
      v-if="dialogVisible"
      class="dark notice-dialog"
      width="1000px"
      v-model:visible="dialogVisible"
      :destroy-on-close="true"
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div class="dialog-content scrollbar">
        <el-scrollbar>
          <el-form
            ref="noticeForm"
            class="notice-form"
            :model="formData"
            :rules="rules"
            :disabled="operationStatus === 'view'"
          >
            <el-col :span="24">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="formData.title" placeholder="请输入标题" autocomplete="off" maxlength="200" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型:" prop="type">
                <el-select v-model="formData.type" placeholder="请选择">
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio label="0">草稿</el-radio>
                  <el-radio label="1">发布</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容:" prop="content">
                <el-input v-model="formData.content" type="textarea" maxlength="2000" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="选择图片:">
                <upload-file
                  ref="upload-file"
                  :limit="100"
                  :file-size="10"
                  :file-list="imageList"
                  @uploadSuccess="handleImageUploadSuccess"
                  @addDeleteFileList="handleImageRemoveFile"
                  @removeFile="handleImageRemove"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="选择附件:">
                <upload-file
                  ref="upload-file"
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt"
                  :is-dialog="false"
                  :limit="100"
                  :file-size="10"
                  :file-list="fileList"
                  @uploadSuccess="handleFileUploadSuccess"
                  @addDeleteFileList="handleFileRemoveFile"
                  @removeFile="handleFileRemove"
                />
              </el-form-item>
            </el-col>
            <el-col class="btn" :span="24">
              <el-form-item label="选择接收人:" align="left">
                <el-button size="small" @click="handleBtnClick('unit')">本单位</el-button>
                <!-- <el-button size="small" @click="handleBtnClick('department')">下级部门</el-button> -->
                <!-- <el-button size="small" @click="handleBtnClick('subordinate')">下属单位</el-button> -->
              </el-form-item>
            </el-col>
            <el-col class="divider" :span="24">
              <el-divider />
            </el-col>
            <el-col class="tab" :span="24">
              <el-tabs v-model="activeName">
                <el-tab-pane :label="`本单位 (${userList.length})`" name="unit">
                  <div class="tag-container">
                    <el-tag
                      v-for="tag in userList"
                      :key="tag.id"
                      closable
                      @close="handleTagClose(tag, userList)"
                    >{{ tag.name }}</el-tag>
                  </div>
                </el-tab-pane>
                <!-- <el-tab-pane :label="`下级部门 (${deptList.length})`" name="department">
                  <div class="tag-container">
                    <el-tag
                      v-for="tag in deptList"
                      :key="tag.id"
                      closable
                      @close="handleTagClose(tag, deptList)"
                    >{{ tag.name }}</el-tag>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="`下属单位 (${officeList.length})`" name="subordinate">
                  <div class="tag-container">
                    <el-tag
                      v-for="tag in officeList"
                      :key="tag.id"
                      closable
                      @close="handleTagClose(tag, officeList)"
                    >{{ tag.name }}</el-tag>
                  </div>
                </el-tab-pane> -->
              </el-tabs>
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
    <Unit ref="Unit" v-model:select-list="userList" />
    <Subordinate ref="Subordinate" v-model:select-list="officeList" />
    <TreeSelect
      ref="TreeSelect"
      :show-select="false"
      v-model:value="departVal"
      v-model:label="departName"
      :checkbox="true"
      :tree-select-option="departmentOption"
    />
    <NoticeView ref="NoticeView" :view-id="viewId" />
    <Consult ref="Consult" :notify-id="notifyId" />
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getDict,
  handleOfficeOanotifyList,
  handleOfficeOanotifyDelete,
  handleOfficeOanotifySave,
  handleOfficeOanotifyInfo,
  handleOfficeOanotifyUpdate
} from '@/api/companyHome'
import { deletedFile } from '@/api/uploadFile'

import '../style/index.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import UploadFile from '@/components/uploadFile'
import TreeSelect from '@/components/treeSelect'
import NoticeView from '@/components/NoticeView'
import Unit from '../component/unit'
import Subordinate from '../component/subordinate'
import Consult from '@/components/Consult'

export default {
  // 下发
  name: 'Issue',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    UploadFile,
    TreeSelect,
    Unit,
    Consult,
    NoticeView,
    Subordinate
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      dialogVisible: false,
      title: '',
      operationStatus: 'create',
      activeName: 'unit',
      listQuery: {
        title: '',
        type: '',
        status: '',
        page: 1,
        limit: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '标题:',
            name: 'title',
            placeholder: '请输入标题',
            maxlength: 64
          },
          {
            type: 'select',
            label: '类型:',
            name: 'type',
            placeholder: '请选择类型',
            dataList: []
          },
          {
            type: 'radio',
            label: '查阅状态:',
            name: 'status',
            dataList: [
              {
                index: 0,
                text: '草稿'
              },
              {
                index: 1,
                text: '发布'
              }
            ]
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
          prop: 'title',
          label: '标题',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formData: {},
      rules: {
        title: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ]
      },
      typeList: [],
      userList: [],
      deptList: [],
      officeList: [],
      departVal: '',
      departName: '',
      viewId: '',
      notifyId: '',
      departmentOption: {
        title: '选择下级部门',
        request: {
          url: 'system/api/dept/findList',
          params: {}
        }
      },
      imageList: [],
      imageRemove: [],
      fileList: [],
      fileRemove: []
    }
  },
  computed: {
    imageLists () {
      const data = []
      this.imageList.forEach(item => {
        data.push({
          fileId: String(item.fileId),
          name: item.name
        })
      })
      return data
    },
    fileLists () {
      const data = []
      this.fileList.forEach(item => {
        data.push({
          fileId: String(item.fileId),
          name: item.name
        })
      })
      return data
    }
  },
  watch: {
    departVal (newVal, oldVal) {
      this.deptList = this.departVal.split(',').map((id, i) => ({
        id,
        name: this.departName.split(',')[i]
      }))
    }
  },
  created () {
    this._getDict()
    this._handleOfficeOanotifyList()
  },
  methods: {
    // 获取字典值
    _getDict () {
      getDict({
        type: 'oa_notify_type'
      }).then(res => {
        if (res.data) {
          this.searchFormOption.config[1].dataList = res.data.dicts
          this.typeList = res.data.dicts
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleOfficeOanotifyList()
    },
    // 获取列表
    _handleOfficeOanotifyList () {
      handleOfficeOanotifyList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleOfficeOanotifyInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.userList = res.data.userList
              this.deptList = res.data.deptList
              this.departVal = res.data.deptList
                .map(item => {
                  return item.id
                })
                .join(',')
              this.departName = res.data.deptList
                .map(item => {
                  return item.name
                })
                .join(',')
              this.officeList = res.data.officeList
              this.imageList = res.data.imageList
              this.fileList = res.data.fileList
              resolve(res.data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增页面
    handleNoticeCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formData = {}
      this.userList = []
      this.deptList = []
      this.officeList = []
      this.imageList = []
      this.imageRemove = []
      this.fileList = []
      this.fileRemove = []
      this.handleShow()
    },
    // 查看表单信息
    async handleNoticeView (data, title) {
      this.operationStatus = 'view'
      this.$refs.NoticeView.handleShow()
      this.viewId = data.id
    },
    // 编辑表单信息
    async handleNoticeEdit (data, title) {
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
      this.$refs.noticeForm.validate(async valid => {
        if (valid) {
          if (this.imageRemove.length > 0) {
            this.imageRemove.forEach(item => {
              const index = this.imageLists.findIndex(file => {
                return file.fileId === item
              })
              this.imageLists.splice(index, 1)
            })
            await deletedFile(this.imageRemove)
          }
          if (this.fileRemove.length > 0) {
            this.fileRemove.forEach(item => {
              const index = this.fileLists.findIndex(file => {
                return file.fileId === item
              })
              this.fileLists.splice(index, 1)
            })
            await deletedFile(this.fileRemove)
          }
          const images = this.handleFileIdInit(this.imageLists)
          const files = this.handleFileIdInit(this.fileLists)
          const formData = Object.assign({}, this.formData, {
            userList: this.userList,
            deptList: this.deptList,
            officeList: this.officeList,
            images,
            files
          })
          handleOfficeOanotifySave(formData).then(res => {
            this._handleOfficeOanotifyList()
            if (res.msg === 'ok') {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.handleHide()
            } else {
              this.$message({
                message: '新增失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 更新数据
    handleUpdateData () {
      this.$refs.noticeForm.validate(async valid => {
        if (valid) {
          if (this.imageRemove.length > 0) {
            this.imageRemove.forEach(item => {
              const index = this.imageLists.findIndex(file => {
                return file.fileId === item
              })
              this.imageLists.splice(index, 1)
            })
            await deletedFile(this.imageRemove)
          }
          if (this.fileRemove.length > 0) {
            this.fileRemove.forEach(item => {
              const index = this.fileLists.findIndex(file => {
                return file.fileId === item
              })
              this.fileLists.splice(index, 1)
            })
            await deletedFile(this.fileRemove)
          }
          const images = this.handleFileIdInit(this.imageLists)
          const files = this.handleFileIdInit(this.fileLists)
          const formData = Object.assign({}, this.formData, {
            id: this.formData.id,
            userList: this.userList,
            deptList: this.deptList,
            officeList: this.officeList,
            images,
            files
          })
          handleOfficeOanotifyUpdate(formData).then(res => {
            this._handleOfficeOanotifyList()
            this.imageList = []
            this.imageRemove = []
            this.fileList = []
            this.fileRemove = []
            if (res.msg === 'ok') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.handleHide()
            } else {
              this.$message({
                message: '修改失败',
                type: 'error'
              })
            }
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
      handleOfficeOanotifyDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleOfficeOanotifyList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    handleBtnClick (flag) {
      switch (flag) {
        case 'unit':
          this.$refs.Unit.handleShow()
          break
        case 'department':
          this.departVal = this.deptList
            .map(item => {
              return item.id
            })
            .join(',')
          this.$refs.TreeSelect.show()
          break
        case 'subordinate':
          this.$refs.Subordinate.handleShow()
          break
        default:
          break
      }
    },
    handleTagClose (tag, list) {
      list.splice(list.indexOf(tag), 1)
    },
    handleInitConsult (data) {
      this.notifyId = data.id
      this.$refs.Consult.handleShow()
    },
    handleImageUploadSuccess (data) {
      this.imageLists.push({
        fileId: String(data.id),
        name: data.name
      })
    },
    handleImageRemoveFile (data) {
      const id = data.fileId
      this.imageRemove.push(id)
    },
    handleImageRemove (data) {
      const index = this.imageLists.findIndex(item => {
        return item.fileId === String(data.id)
      })
      this.imageLists.splice(index, 1)
    },
    handleFileUploadSuccess (data) {
      this.fileLists.push({
        fileId: String(data.id),
        name: data.name
      })
    },
    handleFileRemoveFile (data) {
      const id = data.fileId
      this.fileRemove.push(id)
    },
    handleFileRemove (data) {
      const index = this.fileLists.findIndex(item => {
        return item.fileId === String(data.id)
      })
      this.fileLists.splice(index, 1)
    },
    handleFileIdInit (array) {
      return array
        .map(item => {
          return item.fileId
        })
        .join(',')
    },
    handleShow () {
      this.dialogVisible = true
    },
    handleHide () {
      this.dialogVisible = false
      this.imageList = []
      this.imageRemove = []
      this.fileList = []
      this.fileRemove = []
    }
  }
}
</script>

<style lang="scss">
.notice-dialog {
  .el-upload-list__item.is-ready,
  .el-upload-list__item.is-uploading {
    display: none !important;
  }
}
</style>
