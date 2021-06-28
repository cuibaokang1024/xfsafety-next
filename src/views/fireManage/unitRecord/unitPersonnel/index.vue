<template>
  <div class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add-user" @click="handlePersonnelCreate('添加人员')">添加人员</el-button>
      <el-button class="record" @click="handlerPersonnelBack">返回上级</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
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
        @pagination="_getUserList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        :append-to-body="true"
        @updateData="updateData"
        @createData="createData"
      >
        <template v-slot:uploadFile>
          <div class="appCode">
            <div class="title">APP下载:</div>
            <div class="upload">
              <upload-file
                ref="upload-file"
                :class="formOption.operationStatus === 'edit' ? 'appCode-upload' : ''"
                :limit="1"
                :size="50"
                :list-type="'picture-card'"
                :file-list="appCodeFile"
                :disabled="formOption.operationStatus === 'edit' ? true : false"
                @uploadSuccess="appCodeUploadSuccess"
                @addDeleteFileList="addDeleteFileList"
              />
            </div>
          </div>
          <div class="logo">
            <div class="title">头图标:</div>
            <div class="upload">
              <upload-file
                ref="upload-file"
                :class="formOption.operationStatus === 'edit' ? 'appLogo-upload' : ''"
                :limit="1"
                :size="50"
                :list-type="'picture-card'"
                :file-list="logoFile"
                :disabled="formOption.operationStatus === 'edit' ? true : false"
                @uploadSuccess="logoUploadSuccess"
                @addDeleteFileList="addDeleteFileList"
              />
            </div>
          </div>
        </template>
        <template v-slot:qrcodeFile>
          <span>二维码</span>
          <upload-file
            ref="upload-file"
            :limit="1"
            :size="50"
            :list-type="'picture-card'"
            :file-list="qrfileList"
            @uploadSuccess="uploadQRSuccess"
            @addDeleteFileList="addDeleteQRFileList"
            @removeFile="removeQRFile"
          />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getUserList,
  getRoleList,
  getUserOfficeList,
  saveUser,
  getUserInfo,
  updateUser,
  deleteUser
} from '@/api/office'
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 人员 */
  name: 'Personnel',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
  },
  mixins: [formAction],
  data () {
    var chkPassword = (rule, value, callback) => {
      if (!value && this.formOption.operationStatus === 'create') {
        callback(new Error('请输入密码'))
      } else if (!value && this.formOption.operationStatus === 'update') {
        callback(new Error('请输入密码'))
      } else {
        if (this.$refs.baseForm.formModel.isPassWord) {
          this.$refs.baseForm.validateField('isPassWord')
        }
        callback()
      }
    }
    return {
      listLoading: false,
      listQuery: {
        officeId: '', // 监管单位档案
        deptId: '', // 部门及人员
        loginName: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '登录名:',
            name: 'loginName',
            placeholder: '请输入登录名'
          }
        ]
      },
      formOption: {
        config: [
          {
            label: '姓名:',
            name: 'name',
            type: 'text',
            labelWidth: '100px',
            colspan: true
          },
          {
            label: '登录名:',
            name: 'loginName',
            type: 'text',
            labelWidth: '100px',
            disabled: false
          },
          {
            label: '密码:',
            name: 'password',
            type: 'password',
            labelWidth: '100px'
          },
          {
            label: '邮箱:',
            name: 'email',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '电话:',
            name: 'phone',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '手机:',
            name: 'mobile',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '用户角色:',
            name: 'roleId',
            type: 'select',
            labelWidth: '100px',
            dataList: []
          },
          {
            label: '头信息:',
            name: 'title',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '头图标名称:',
            name: 'titleLogo',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '是否允许登录:',
            name: 'loginFlag',
            type: 'select',
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
            label: '是否测试账号:',
            name: 'testFlag',
            type: 'select',
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
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '100px',
            colspan: true
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          },
          {
            type: 'slot',
            name: 'qrcodeFile',
            colspan: true
          }
        ],
        rules: {
          name: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            }
          ],
          loginFlag: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          testFlag: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          loginName: [
            {
              required: true,
              message: '请输入登录名',
              trigger: 'blur'
            }
          ],
          password: [{ validator: chkPassword, trigger: 'blur' }],
          roleId: [
            {
              required: true,
              message: '请输入用户角色',
              trigger: 'blur'
            }
          ],
          email: [
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur']
            }
          ]
        }
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'loginName',
          label: '登录名',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '姓名',
          align: 'left',
          width: ''
        },
        {
          prop: 'phone',
          label: '手机',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '归属公司',
          align: 'left',
          width: ''
        },
        {
          prop: 'deptName',
          label: '归属部门',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      appCode: '',
      logo: '',
      appCodeFile: [],
      logoFile: []
    }
  },
  created () {
    this._getRoleList()
    this._getUserList()
  },
  methods: {
    _getRoleList () {
      getRoleList().then(res => {
        this.formOption.config[6].dataList = res.data
      })
    },
    handlerPersonnelBack () {
      this.$router.back()
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getUserList()
    },
    // 人员列表
    _getUserList () {
      switch (this.$route.query.routerName) {
        case 'supervisionUnitRecord': // 监管单位档案
          this.listQuery.officeId = this.$route.params.id
          getUserOfficeList(this.listQuery).then(res => {
            this.tableData = res.data.list
            this.total = res.data.totalCount
          })
          break
        case 'departmentPersonnel': // 部门及人员
          this.listQuery.deptId = this.$route.params.id
          getUserList(this.listQuery).then(res => {
            this.tableData = res.data.list
            this.total = res.data.totalCount
          })
          break
        default:
          break
      }
    },
    // 编辑表单信息
    handleEdit (data, title) {
      const operationStatus = 'edit'
      this.formOption.config[1].disabled = true
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
          this.id = data[0].id
          this._getListInfo(data[0]).then(data => {
            this.formAction(title, operationStatus, data)
          })
        }
      } else {
        this.id = data.id
        this._getListInfo(data).then(data => {
          this.formAction(title, operationStatus, data)
        })
      }
    },
    // 新增数据
    createData (data) {
      const Base64 = require('js-base64').Base64
      var formData = {}
      if (this.$route.query.routerName === 'supervisionUnitRecord') {
        formData = Object.assign({}, data, {
          officeId: this.listQuery.officeId,
          password: Base64.encode(data.password),
          appCode: this.appCode,
          logo: this.logo
        })
      }
      if (this.$route.query.routerName === 'departmentPersonnel') {
        formData = Object.assign({}, data, {
          deptId: this.listQuery.deptId,
          password: Base64.encode(data.password),
          appCode: this.appCode,
          logo: this.logo
        })
      }
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      saveUser(formData).then(res => {
        this._getUserList()
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
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getUserInfo({ id: data.id }).then(res => {
          if (res.data) {
            this.fileList = []
            if (res.data.user.appCode) {
              this.appCodeFile = [
                Object.assign({}, res.data.user, {
                  fileId: res.data.user.appCode,
                  url: res.data.user.appCodeUrl
                })
              ]
            }
            if (res.data.user.logo) {
              this.logoFile = [
                Object.assign({}, res.data.user, {
                  fileId: res.data.user.logo,
                  url: res.data.user.logoUrl
                })
              ]
            }
            const data = Object.assign({}, res.data.user, {
              password: ''
            })
            resolve(data)
          }
        })
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
      deleteUser(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getUserList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      const Base64 = require('js-base64').Base64
      const formData = Object.assign({}, data, {
        files: this.files,
        id: this.id,
        appCode: this.appCode,
        logo: this.logo,
        password: Base64.encode(data.password)
      })
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      updateUser(formData).then(res => {
        this._getUserList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改部门成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改部门失败',
            type: 'error'
          })
        }
      })
    },
    // 新增表单数据
    handlePersonnelCreate (title) {
      this.appCode = ''
      this.logo = ''
      this.fileList = []
      this.appCodeFile = []
      this.logoFile = []
      const operationStatus = 'create'
      this.formAction(title, operationStatus, {})
    },
    appCodeUploadSuccess (data) {
      this.appCode = data.id
    },
    logoUploadSuccess (data) {
      this.logo = data.id
    }
  }
}
</script>

<style scoped lang="scss">
.section-main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.appCode {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo {
  display: flex;
  margin-top: 14px;
}

.title {
  width: 100px;
  text-align: right;
  color: #97c1ff;
  padding-right: 4px;
  font-weight: bold;
}

.upload {
  flex: 1;
}
</style>

<style lang="scss">
.appCode-upload,
.appLogo-upload {
  .el-upload-list__item-delete {
    display: none !important;
  }
}
</style>
