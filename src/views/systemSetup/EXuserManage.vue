<template>
  <div class="section-main">
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add-user" @click="handleCreate(`添加${isAreaPersonnel?'人员':'用户'}`)">{{ `添加${isAreaPersonnel?'人员':'用户'}` }}</el-button>
      <el-button class="edit" @click="handleEdit(multipleSelection, `修改${isAreaPersonnel?'人员':'用户'}`)">修改</el-button>
      <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
      <el-button v-if="isAreaPersonnel" class="weichat" @click="handlerPersonnelBack">区域管理</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :border="false"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button size="mini" type="primary" round @click="handleView(row, `查看${isAreaPersonnel?'人员':'用户'}`)">查看</el-button>
            <el-button size="mini" type="success" round @click="handleEdit(row, `修改${isAreaPersonnel?'人员':'用户'}`)">修改</el-button>
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
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getUserList,
  saveUser,
  getUserInfo,
  updateUser,
  delUser
} from '@/api/userManage'
import '@/styles/list.scss'
import formAction from '@/mixins/form.js'
import BaseTable from '@/components/baseTable'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'
import { isPhone, isCardNo } from '@/utils/validate'
export default {
  /* 用户管理 */
  name: 'UserManage',
  components: {
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
        page: 1,
        pageSize: 10
      },
      total: 0,
      formOption: {
        config: [
          {
            label: '单位名称:',
            name: 'areaName',
            type: 'text',
            labelWidth: '100px',
            disabled: true
          },
          {
            label: '所属单位:',
            name: 'belongUnit',
            type: 'text',
            labelWidth: '100px',
            disabled: true,
            colspan: true
          },
          {
            label: '姓名:',
            name: 'name',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '登录名:',
            name: 'loginName',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '密码:',
            name: 'password',
            type: 'password',
            labelWidth: '100px'
          },
          {
            label: '确认密码:',
            name: 'isPassword',
            type: 'password',
            labelWidth: '100px'
          },
          {
            label: '监管区域:',
            name: 'superviseArea',
            type: 'treeSelect',
            checkbox: true,
            labelWidth: '100px',
            treeSelectOption: {
              title: '选择监管区域',
              name: 'superAreaName',
              request: {
                url: 'system/admin/division/getOfficeArea',
                params: {}
              }
            }
          },
          {
            label: '手机号码:',
            name: 'mobile',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '办公电话:',
            name: 'phone',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '身份证号:',
            name: 'identity',
            type: 'text',
            labelWidth: '100px'
          },
          // {
          //   label: '主要负责人:',
          //   name: 'isPrincipal',
          //   type: 'radio',
          //   labelWidth: '100px',
          //   disabled: true,
          //   dataList: [
          //     {
          //       index: 1,
          //       text: '是'
          //     },
          //     {
          //       index: 2,
          //       text: '否'
          //     }
          //   ]
          // },
          {
            label: '所属角色:',
            name: 'roleId',
            type: 'select',
            labelWidth: '100px',
            disabled: true,
            dataList: [
              {
                label: '党委政府',
                value: 1008
              }
            ]
          },
          {
            type: 'slot',
            name: 'uploadFile',
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
          password: [{ required: true, validator: chkPassword, trigger: 'blur' }],
          mobile: [{ validator: chkPhone, trigger: 'blur' }],
          identity: [{ validator: chkCardNo, trigger: 'blur' }],
          isPassword: [{ validator: chkIsPassWord, trigger: 'blur' }]
        }
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'loginName',
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
          prop: 'areaName',
          label: '所属单位',
          align: 'left',
          width: ''
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'userName'
    ]),
    isAreaPersonnel () {
      if (this.$route.name && this.$route.name === 'AreaPersonnel') {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    if (this.isAreaPersonnel) {
      this.listQuery.areaId = this.$route.params.id
      this.formOption.config = this.formOption.config.filter((item) => {
        return item.name !== 'belongUnit'
      })
    } else {
      this.formOption.config = this.formOption.config.filter((item) => {
        return item.name !== 'areaName' && item.name !== 'superviseArea'
      })
    }
    this._getUserList()
  },
  methods: {
    handlerPersonnelBack () {
      this.$router.back()
    },
    // 人员列表
    _getUserList () {
      getUserList({ isAreaPersonnel: this.isAreaPersonnel, params: this.listQuery }).then((res) => {
        this.tableData = res.data.list
        if (!this.isAreaPersonnel) {
          this.tableData = res.data.list.map((item) => {
            return { ...item, areaName: item.affUnit }
          })
        }
        this.total = res.data.totalCount
      })
    },
    // 打开新增页面
    handleCreate (title) {
      const operationStatus = 'create'
      this.fileList = []
      this.formAction(title, operationStatus, { areaName: this.$route.query.name, roleId: 1008, belongUnit: this.userName })
    },
    // 新增数据
    createData (data) {
      const Base64 = require('js-base64').Base64
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      let params
      let photo = ''
      if (this.files[0] && this.files[0].fileId) {
        photo = this.files[0].fileId
      }
      if (this.isAreaPersonnel) {
        params = Object.assign({}, data, { password: Base64.encode(data.password), photo, areaId: this.$route.params.id })
      } else {
        params = Object.assign({}, data, { password: Base64.encode(data.password), photo })
      }
      saveUser({ isAreaPersonnel: this.isAreaPersonnel, params }).then(res => {
        this._getUserList()
        if (res.msg === 'ok') {
          this.$message({
            message: `新增${this.isAreaPersonnel ? '人员' : '用户'}成功`,
            type: 'success'
          })
        } else {
          this.$message({
            message: `新增${this.isAreaPersonnel ? '人员' : '用户'}失败`,
            type: 'error'
          })
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getUserInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              const userData = { ...res.data.user, password: '', belongUnit: this.userName }
              this.fileList = []
              if (userData.photo) {
                this.fileList = [Object.assign({}, userData.photoFile, {
                  fileId: userData.photo,
                  url: userData.photoUrl
                })]
              }
              resolve(userData)
            }
          })
          .catch(error => {
            reject(error)
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
      delUser(list).then(res => {
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
      if (this.deleteFileList && this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      let photo = ''
      let params
      if (this.files[0] && this.files[0].fileId) {
        photo = this.files[0].fileId
      }
      if (this.isAreaPersonnel) {
        params = Object.assign({}, data, { id: this.id, password: Base64.encode(data.password), photo, areaId: this.$route.params.id })
      } else {
        params = Object.assign({}, data, { id: this.id, password: Base64.encode(data.password), photo })
      }
      updateUser(params).then(res => {
        this._getUserList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: `修改${this.isAreaPersonnel ? '人员' : '用户'}成功`,
            type: 'success'
          })
        } else {
          this.$message({
            message: `修改${this.isAreaPersonnel ? '人员' : '用户'}失败`,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.inspect-main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  padding: 20px;
  background-color: #001647;
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
