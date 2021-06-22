<template>
  <div class="section-main user-container">
    <div class="right-container" :style="{ width: '100%' }">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button
          class="add-user"
          @click="handleCreate('添加')"
        >添加</el-button>
        <el-button
          v-if="backBtnFlag"
          class="record"
          @click="handlerPersonnelBack"
        >返回上级</el-button>
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
            </template>
          </el-table-column>
        </BaseTable>
      </div>
      <div class="pagination-box">
        <Pagination
          v-show="total > 0"
          :total="total"
          v-model:page="listQuery.page"
          v-model:limit="listQuery.limit"
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
          @formHide="formHide"
        >
          <template v-slot:uploadFile>
            <span>头像</span>
            <upload-file
              ref="upload-file"
              :limit="1"
              :size="50"
              :list-type="'picture-card'"
              :accept="'.png,.jpg,.jpeg'"
              :file-list="fileList"
              @uploadSuccess="uploadSuccess"
              @addDeleteFileList="addDeleteFileList"
              @removeFile="removeFile"
            />
          </template>
          <template v-slot:qrcodeFile>
            <span>二维码</span>
            <upload-file
              ref="upload-file"
              :limit="1"
              :size="50"
              :list-type="'picture-card'"
              :accept="'.png,.jpg,.jpeg'"
              :file-list="qrfileList"
              @uploadSuccess="uploadQRSuccess"
              @addDeleteFileList="addDeleteRQFileList"
              @removeFile="removeQRFile"
            />
          </template>
        </BaseForm>
      </div>
      <!-- 弹出框 -->
    </div>
  </div>
</template>

<script>
import {
  getUserList,
  getRolelist,
  getUserInfo,
  saveUser,
  updateUser,
  deleteUser
} from '@/api/user'
import { handleTreeAreaList } from '@/api/systemSet'

import { mapGetters } from 'vuex'
import { isPhone, validEmail } from '@/utils/validate'
import { phoneAndTel } from '@/utils'

import '@/styles/list.scss'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseForm from '@/components/baseForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import UploadFile from '@/components/uploadFile'

export default {
  /* 人员 */
  name: 'UserManage',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
  },
  mixins: [formAction],
  props: {
    backBtnFlag: {
      type: Boolean,
      default: true
    },
    userType: {
      type: Number,
      default: -1
    },
    officeId: {
      type: [Number, String],
      default: null
    },
    officeName: {
      type: String,
      default: ''
    }
  },
  data () {
    var chkPhone = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isPhone(value)) {
        callback(new Error('请输入正确格式的电话号码!'))
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
    var emailCheck = (rule, value, callback) => {
      if (value) {
        if (!validEmail(value)) {
          callback(new Error('请输入正确的邮箱地址'))
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
      listQuery: {
        officeId: this.officeId,
        page: 1,
        limit: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '登录名:',
            name: 'loginName',
            placeholder: '请输入登录名'
          },
          {
            type: 'text',
            label: '所属单位:',
            name: 'officeName',
            placeholder: '请输入所属单位'
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
          prop: 'mobile',
          label: '手机号码',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '所属单位',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '所属单位:',
            type: 'unitSelect',
            name: 'officeId',
            labelWidth: '110px',
            treeSelectOption: {
              name: 'officeName',
              request: {
                url: 'system/api/dept/findList'
              }
            },
            disabled: true,
            colspan: true
          },
          {
            label: '所属部门:',
            name: 'deptId',
            type: 'treeSelect',
            labelWidth: '110px',
            treeSelectOption: {
              title: '选择所属部门',
              name: 'deptName',
              request: {
                url: '/system/api/dept/findList',
                params: {}
              }
            }
          },
          {
            label: '是否部门负责人:',
            name: 'deptPrincipal',
            type: 'radio',
            labelWidth: '110px',
            dataList: [
              {
                index: '0',
                text: '否'
              },
              {
                index: '1',
                text: '是'
              }
            ]
          },
          {
            label: '姓名:',
            name: 'name',
            type: 'text',
            labelWidth: '110px',
            maxlength: 50
          },
          {
            label: '登录名:',
            name: 'loginName',
            type: 'text',
            labelWidth: '110px',
            maxlength: 50
          },
          {
            label: '密码:',
            name: 'password',
            type: 'password',
            labelWidth: '110px',
            maxlength: 30
          },
          {
            label: '邮箱:',
            name: 'email',
            type: 'text',
            labelWidth: '110px',
            maxlength: 50
          },
          {
            label: '办公电话:',
            name: 'phone',
            type: 'text',
            labelWidth: '110px',
            maxlength: 50
          },
          {
            label: '手机号码:',
            name: 'mobile',
            type: 'text',
            labelWidth: '110px',
            maxlength: 50
          },
          {
            label: '角色:',
            name: 'roleId',
            type: 'select',
            labelWidth: '110px',
            dataList: []
          },
          {
            label: '头信息:',
            name: 'title',
            type: 'text',
            labelWidth: '110px',
            maxlength: 100
          },
          {
            label: '头图标名称:',
            name: 'titleLogo',
            type: 'text',
            labelWidth: '110px',
            maxlength: 100
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
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '110px',
            maxlength: 200,
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
          officeId: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          mobile: [{ validator: chkPhone, trigger: 'blur' }],
          phone: [{ validator: phoneAndTelCheck, trigger: 'blur' }],
          loginFlag: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          loginName: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          roleId: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          email: [
            {
              validator: emailCheck,
              trigger: 'blur'
            }
          ]
        }
      },
      treeData: []
    }
  },
  computed: {
    ...mapGetters({
      currentOfficeName: 'officeName',
      currentOfficeId: 'officeId'
    })
  },
  watch: {
    'formOption.operationStatus': {
      handler (newVal, oldVal) {
        if (newVal && newVal === 'edit') {
          this.formOption.config = this.formOption.config.map((item) => {
            // 修改表单数据时登录名禁止修改
            if (item.name === 'loginName') {
              return { ...item, disabled: true }
            }
            return { ...item }
          })
          this.formOption.rules.password = [] // 修改表单数据时不显示密码，同时不做必填校验
        } else if (newVal && newVal === 'create') {
          this.formOption.config = this.formOption.config.map((item) => {
            if (item.name === 'loginName') {
              return { ...item, disabled: false }
            }
            return { ...item }
          })
        }
      }
    }
  },
  created () {
    this.handleUserType()
    this._handleTreeAreaList()
    this._getRolelist()
    this._getUserList()
  },
  methods: {
    handleUserType () {
      // 监管单位 SOCIAL 1 消防主管单位 FIRE 2 行业主管单位 INDUSTRY 3 下级政府 GOV 4 合作商 AGENCY 5 子账号 CHILDREN  6
      let treeUrl = ''
      switch (this.userType) {
        case 2:
          treeUrl = 'system/api/office/fireTree'
          break
        case 3:
          treeUrl = '/system/api/office/directTree'
          break
        case 4:
          treeUrl = 'system/api/office/governmentTree'
          break
        case 5:
          treeUrl = '/system/api/area/areaTree'
          break
        default:
          treeUrl = ''
          break
      }
      if (treeUrl && this.userType !== 5) {
        this.formOption.config.splice(0, 1, {
          label: '所属单位:',
          name: 'officeId',
          type: 'treeSelect',
          labelWidth: '100px',
          disabled: true,
          treeSelectOption: {
            title: '选择所属单位',
            name: 'officeName',
            request: {
              url: treeUrl,
              params: {
                para: 'officeId'
              }
            }
          },
          colspan: true
        })
      } else if (this.userType === 5) {
        this.formOption.config = this.formOption.config.map((item) => {
          if (item.name === 'officeId') {
            return { ...item, isAgent: true, disabled: false }
          }
          return { ...item }
        })
      }
      this.treeUrl = treeUrl
    },
    _getRolelist () {
      getRolelist({ type: this.userType }).then((res) => {
        if (res.data) {
          const roleList = res.data.map((role) => {
            return { label: role.name, value: role.id }
          })
          this.formOption.config = this.formOption.config.map((item) => {
            if (item.name === 'roleId') {
              return { ...item, dataList: roleList }
            }
            return { ...item }
          })
        }
      })
    },
    // 返回上级
    handlerPersonnelBack () {
      this.$emit('hideUserManage')
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getUserList()
    },
    _handleTreeAreaList () {
      const userQuery = { userType: this.userType }
      handleTreeAreaList(userQuery).then((res) => {
        if (res.data) {
          this.treeData = res.data
        }
      })
    },
    // 人员列表
    _getUserList () {
      getUserList({ ...this.listQuery, type: this.userType }).then((res) => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    loadNodes (node, resolve) {
      if (node.level === 0) {
        const userQuery = { userType: this.userType }
        handleTreeAreaList(userQuery).then((res) => {
          if (res.data) {
            const data = res.data.map((data) => {
              return {
                ...data,
                hasChildren: data.hasChildren !== '1' && !data.children
              }
            })
            resolve(data)
          }
        })
      } else if (node.data.children) {
        resolve(
          node.data.children.map((data) => {
            return {
              ...data,
              hasChildren: data.hasChildren !== '1' && !data.children
            }
          })
        )
      } else {
        const userQuery = {
          userType: this.userType,
          params: node.data.id
        }
        handleTreeAreaList(userQuery).then((res) => {
          if (res.data) {
            const data = res.data.map((data) => {
              return {
                ...data,
                hasChildren: data.hasChildren !== '1' && !data.children
              }
            })
            resolve(data)
          }
        })
      }
    },
    handleNodeClick (data) {
      if (this.userType === 5) {
        this.listQuery.areaId = data.id
        this._getUserList()
        return
      }
      this.listQuery.officeId = data.id
      this._getUserList()
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getUserInfo({ id: data.id }).then((res) => {
          if (res.data) {
            const userData = { ...res.data.user, password: '', roleId: res.data.user.roleId }
            this.fileList = []
            this.qrfileList = []
            if (userData.photo) {
              this.fileList = [
                Object.assign({}, userData.photoFile, {
                  roleId: userData.roleId,
                  fileId: userData.photo,
                  url: userData.photoUrl
                })
              ]
            }
            if (userData.appCode) {
              this.qrfileList = [
                Object.assign({}, userData.appCodeFile, {
                  roleId: userData.roleId,
                  fileId: userData.appCode,
                  url: userData.appCodeUrl
                })
              ]
            }
            resolve(userData)
          }
        })
      })
    },
    // 打开新增页面
    handleCreate (title) {
      const operationStatus = 'create'
      this.fileList = []
      this.qrfileList = []
      if (this.userType === 6) {
        // 如果建子账号则默认所属单位为当前登陆用户
        this.formAction(title, operationStatus, {
          deptPrincipal: '0',
          officeName: this.currentOfficeName,
          officeId: this.currentOfficeId
        })
      } else {
        this.formAction(title, operationStatus, {
          deptPrincipal: '0',
          officeName: this.officeName,
          officeId: this.officeId
        })
      }
    },
    // 新增数据
    createData (data) {
      const Base64 = require('js-base64').Base64
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      if (this.deleteQRFileList && this.deleteQRFileList.length > 0) {
        this._deletedQRFile()
      }
      let photo = ''
      let appCode = ''
      if (this.files[0] && this.files[0].fileId) {
        photo = this.files[0].fileId
      }
      if (this.qrFiles[0] && this.qrFiles[0].fileId) {
        appCode = this.qrFiles[0].fileId
      }
      const params = {
        ...data,
        password: Base64.encode(data.password),
        photo,
        appCode
      }
      saveUser(params).then((res) => {
        this._getUserList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增用户成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增用户失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      const Base64 = require('js-base64').Base64
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      if (this.deleteQRFileList && this.deleteQRFileList.length > 0) {
        this._deletedQRFile()
      }
      let photo = ''
      let appCode = ''
      if (this.files[0] && this.files[0].fileId) {
        photo = this.files[0].fileId
      }
      if (this.qrFiles[0] && this.qrFiles[0].fileId) {
        appCode = this.qrFiles[0].fileId
      }
      const params = {
        ...data,
        id: this.id,
        password: data.password ? Base64.encode(data.password) : null,
        photo,
        appCode
      }
      updateUser(params).then((res) => {
        this._getUserList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.deleteQRFileList = []
          this.$message({
            message: '修改用户成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改用户失败',
            type: 'error'
          })
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
      deleteUser(list).then((res) => {
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
    }
  }
}
</script>

<style scoped lang="scss">
.user-container {
  display: flex;
  flex-direction: row !important;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  .left-container {
    width: 260px;
    padding: 15px;
    margin-right: 20px;
    overflow: hidden;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.07);

    .title {
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 16px;
      color: #f2f6ff;
      background: linear-gradient(90deg, #30e2fd, #4d55e5);
    }
  }

  .right-container {
    width: calc(100% - 280px);

    .table-box {
      height: calc(100% - 137px);
    }
  }
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
