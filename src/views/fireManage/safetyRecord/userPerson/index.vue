<template>
  <div class="safetyRecord userPerson">
    <div class="safetyRecord-right" style="width: 100%;">
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="add-user" @click="handleCreate('添加人员')">添加人员</el-button>
        <el-button class="edit" @click="handleEdit(multipleSelection, '修改人员')">修改</el-button>
        <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
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
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            label="操作"
            align="left"
            width="320"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{row}">
              <el-button size="mini" type="primary" round @click="handleView(row, '查看用户管理')">查看</el-button>
              <el-button size="mini" type="success" round @click="handleEdit(row, '修改用户管理')">修改</el-button>
              <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
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
          @pagination="_handleUserList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
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
      <!-- 弹出框 -->
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  handleUserList,
  handleUserSave,
  handleUserInfo,
  handleUserUpdate,
  handleUserDelete
} from '@/api/safetyrecord'

import '../style/index.scss'
import formAction from '@/mixins/form.js'
import { isPhone, isCardNo } from '@/utils/validate'

import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  // 用户管理
  name: 'UserPerson',
  components: {
    BaseTable,
    Pagination,
    UploadFile,
    BaseForm
  },
  mixins: [formAction],
  data () {
    var chkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.$refs.baseForm.formModel.isPassWord) {
          this.$refs.baseForm.validateField('isPassWord')
        }
        callback()
      }
    }
    var chkIsPassWord = (rule, value, callback) => {
      if (!this.$refs.baseForm.formModel.password) {
        callback()
      } else {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.$refs.baseForm.formModel.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
    var chkPhone = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isPhone(value)) {
        callback(new Error('请输入正确格式的电话号码!'))
      } else {
        callback()
      }
    }
    var chkCardNo = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isCardNo(value)) {
        callback(new Error('请输入正确格式的身份证号!'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      listQuery: {
        officeId: '', // 监管单位档案
        highBuildId: '', // 一楼一档
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'login_name',
          label: '账号',
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
          prop: 'roleName',
          label: '角色',
          align: 'left',
          width: ''
        },
        {
          prop: 'highBuildName',
          label: '所属单位',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '单位名称:',
            name: 'highBuildName',
            type: 'text',
            labelWidth: '110px',
            disabled: true,
            colspan: true
          },
          {
            label: '登录账号:',
            name: 'loginName',
            type: 'text',
            labelWidth: '110px',
            colspan: true
          },
          {
            label: '登录密码:',
            name: 'password',
            type: 'password',
            labelWidth: '110px',
            colspan: true
          },
          {
            label: '真实姓名:',
            name: 'name',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '身份证号:',
            name: 'identity',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '手机号码:',
            name: 'mobile',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '办公电话:',
            name: 'phone',
            type: 'text',
            labelWidth: '110px'
          },
          {
            label: '主要负责人:',
            name: 'isPrincipal',
            type: 'radio',
            labelWidth: '110px',
            dataList: [
              {
                index: 1,
                text: '是'
              },
              {
                index: 0,
                text: '否'
              }
            ]
          },
          {
            label: '用户角色:',
            name: 'roleId',
            type: 'select',
            labelWidth: '100px',
            dataList: []
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
          loginName: [
            {
              required: true,
              message: '请输入登录名',
              trigger: 'blur'
            }
          ],
          roleId: [
            {
              required: true,
              message: '请输入用户角色',
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, validator: chkPassword, trigger: 'blur' }
          ],
          mobile: [{ validator: chkPhone, trigger: 'blur' }],
          identity: [{ validator: chkCardNo, trigger: 'blur' }],
          isPassword: [{ validator: chkIsPassWord, trigger: 'blur' }]
        }
      }
    }
  },
  created () {
    this._getRoleList()
    this._handleUserList()
  },
  methods: {
    handlerPersonnelBack () {
      this.$router.back()
    },
    _getRoleList () {
      getRoleList().then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'roleId') {
              return { ...item, dataList: res.data }
            } else {
              return item
            }
          })
        }
      })
    },
    // 人员列表
    _handleUserList () {
      switch (this.$route.query.routerName) {
        case 'buildingRecord': // 一楼一档
          this.listQuery.areaId = this.$route.query.areaId
          this.listQuery.highBuildId = this.$route.query.highBuildId
          handleUserList(this.listQuery).then(res => {
            this.tableData = res.data.list
            this.total = res.data.totalCount
          })
          break
        default:
          break
      }
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery.loginName = data.loginName
      this._handleUserList()
    },
    // 新增页面
    handleCreate (title) {
      const operationStatus = 'create'
      this.formAction(title, operationStatus, {
        highBuildName: this.$route.query.highBuildName
      })
    },
    handleFileIdInit (array) {
      const arr = []
      array.forEach(item => {
        arr.push(item.fileId)
      })
      return String(arr)
    },
    // 新增数据
    createData (data) {
      const Base64 = require('js-base64').Base64
      var formData = {}
      if (this.$route.query.routerName === 'enterpriseRecord') {
        formData = Object.assign({}, data, {
          officeId: this.listQuery.officeId,
          password: Base64.encode(data.password)
        })
      }
      if (this.$route.query.routerName === 'buildingRecord') {
        formData = Object.assign({}, data, {
          photo: this.handleFileIdInit(this.files),
          highBuildId: this.$route.query.highBuildId,
          password: Base64.encode(data.password),
          files: this.files
        })
      }
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleUserSave(formData).then(res => {
        this._handleUserList()
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
        handleUserInfo({ id: data.id }).then(res => {
          if (res.data) {
            this.fileList = res.data.user.photoFile.map(item => {
              return { ...item, url: res.data.user.photoUrl }
            })
            resolve(res.data.user)
          }
        })
      })
    },
    // 更新数据
    updateData (data) {
      const Base64 = require('js-base64').Base64
      const formData = Object.assign({}, data, {
        photo: data.photo,
        password: Base64.encode(data.password),
        highBuildId: this.$route.query.highBuildId,
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handleUserUpdate(formData).then(res => {
        this._handleUserList()
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
      handleUserDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleUserList()
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
