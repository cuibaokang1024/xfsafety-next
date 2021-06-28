<template>
  <div class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add-user" @click="handleCreate('添加人员')">添加人员</el-button>
      <el-button class="edit" @click="handleEdit(multipleSelection, '修改人员')">修改</el-button>
      <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
      <el-button class="weichat" @click="handlerSupervisionUnitRecord">机构列表</el-button>
      <el-button class="refresh" @click="handleCreate('添加测试账号')">添加测试账号</el-button>
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
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" round @click="handleView(row, '查看人员')">查看</el-button>
            <el-button size="mini" type="success" round @click="handleEdit(row, '修改人员')">修改</el-button>
            <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="_handlerRecordPersonnelUserList"
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
        @updateData="updateData"
        @createData="createData"
        @formHide="formHide"
      >
        <template v-slot:uploadFile>
          <upload-file
            ref="upload-file"
            :limit="4"
            :file-list="fileList"
            @uploadSuccess="uploadSuccess"
            @addDeleteFileList="addDeleteFileList"
          />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handlerUnitRecordDeptList,
  handlerRecordPersonnelUserList,
  saveUser,
  handlerDepartmentPersonnelUserInfo,
  handlerDepartmentPersonnelUserUpdate,
  handlerDepartmentPersonnelUserDelete
} from '@/api/office'
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 监管单位档案の人员 */
  name: 'Personnel',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      listQuery: {
        officeId: '',
        office: '',
        loginName: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '机构名称:',
            name: 'office',
            placeholder: '请输入机构名称'
          },
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
            type: 'select',
            label: '所属部门:',
            name: 'deptId',
            labelWidth: '100px',
            dataList: []
          },
          {
            type: 'select',
            label: '是否测试账号:',
            name: 'testFlag',
            labelWidth: '100px',
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
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '确认密码:',
            name: 'ispassword',
            type: 'text',
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
            name: 'role',
            type: 'text',
            labelWidth: '100px'
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
            labelWidth: '100px',
            dataList: [
              {
                value: 0,
                label: '否'
              },
              {
                value: 1,
                label: '是'
              }
            ],
            formItemStyle: {
              flex: '0 1 100%'
            }
          },
          {
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '100px',
            formItemStyle: {
              flex: '0 1 100%'
            }
          },
          {
            type: 'slot',
            name: 'uploadFile',
            formItemStyle: {
              flex: '0 1 100%'
            }
          }
        ],
        rules: {
          deptId: [
            {
              required: true,
              message: '请选择所属部门',
              trigger: 'blur'
            }
          ],
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
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ],
          isPassword: [
            {
              required: true,
              message: '请确认密码',
              trigger: 'blur'
            }
          ],
          role: [
            {
              required: true,
              message: '请输入用户角色',
              trigger: 'blur'
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
      tableData: []
    }
  },
  created() {
    this.listQuery.officeId = this.$route.query.personData.id
    this._handlerRecordPersonnelUserList()
    this._handlerUnitRecordDeptList()
  },
  methods: {
    handlerSupervisionUnitRecord() {
      this.$router.push('/fireManage/unitRecord/supervisionUnitRecord')
    },
    _handlerUnitRecordDeptList() {
      const para = { officeId: this.listQuery.officeId }
      handlerUnitRecordDeptList(para).then(res => {
        res.data.forEach(item => {
          item = Object.assign({}, item, {
            value: item.deptId,
            label: item.deptName
          })
          this.formOption.config[0].dataList.push(item)
        })
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerRecordPersonnelUserList()
    },
    // 人员列表
    _handlerRecordPersonnelUserList() {
      handlerRecordPersonnelUserList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
      })
    },
    // 新增数据
    createData(data) {
      const Base64 = require('js-base64').Base64
      const formData = Object.assign({}, data, {
        password: Base64.encode(data.password),
        officeId: this.listQuery.officeId,
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      saveUser(formData).then(res => {
        this._handlerRecordPersonnelUserList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增消防预案和演练成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增消防预案和演练失败',
            type: 'error'
          })
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        handlerDepartmentPersonnelUserInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              // this.fileList = res.data.user.files;
              resolve(res.data.user)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除数据
    deleteData(data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      handlerDepartmentPersonnelUserDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handlerRecordPersonnelUserList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 更新数据
    updateData(data) {
      const formData = Object.assign({}, data, {
        files: this.files,
        id: this.id
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      handlerDepartmentPersonnelUserUpdate(formData).then(res => {
        this._handlerRecordPersonnelUserList()
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
    }
  }
}
</script>

<style>
</style>
