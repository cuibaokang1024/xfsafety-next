<template>
  <div class="inspect-main">
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="create()">添加</el-button>
    </div>
    <div
      v-loading="listLoading"
      class="table-box"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
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
              <el-button icon="el-icon-edit-outline" type="success" circle @click.stop="update(row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button icon="el-icon-delete" type="danger" circle @click.stop="deleteData(row)" />
            </el-tooltip>
            <el-tooltip content="配置菜单" placement="top">
              <el-button
                icon="el-icon-set-up"
                type="primary"
                circle
                @click.stop="handleConfigure(row, '修改')"
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
        v-model:page="listQuery.pageNum"
        v-model:limit="listQuery.pageSize"
        @pagination="_handlerAgentManaList"
      />
    </div>
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
      />
    </div>
    <el-dialog
      :visible="treeSelectVisible"
      class="dark"
      :append-to-body="true"
      width="400px"
      @close="hide()"
    >
      <div name="title" class="dialog-title">配置菜单</div>
      <div class="dialog-content">
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          node-key="id"
          :default-checked-keys="selectedMenuList"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
          show-checkbox
          class="el-tree-dark role-tree"
          :data="treeData"
        />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="submitData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import '../styles/index.scss'
import '@/components/baseForm/style/index.scss'
import formAction from '@/mixins/form.js'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import {
  roleList, roleCreate, roleUpdate, roleDelete, roleDetail,
  roleMenuList, roleMenuSave, roleTypeList, roleDataScope
} from '@/api/menu'

export default {
  name: 'RoleManagement',
  components: {
    Pagination,
    BaseForm,
    SearchForm,
    BaseTable
  },
  mixins: [formAction],
  data () {
    return {
      treeLoading: false,
      treeSelectVisible: false,
      listLoading: false,
      listQuery: {
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      selectedMenuList: [],
      saveLoading: false,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '角色名称:',
            name: 'name',
            placeholder: '请输入角色名'
          }
        ]
      },
      selectData: [],
      roleId: '',
      treeData: [],
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'id',
          label: '角色ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '角色名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '角色类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'createDate',
          label: '创建时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '修改时间',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '角色名称：',
            name: 'name',
            type: 'text',
            labelWidth: '120px',
            maxlength: 100
          },
          {
            label: '英文名称：',
            name: 'enname',
            type: 'text',
            labelWidth: '120px',
            maxlength: 255
          },
          {
            label: '数据范围：',
            name: 'dataScope',
            type: 'select',
            labelWidth: '120px',
            dataList: []
          },
          {
            label: '是否可用：',
            name: 'enable',
            defaultValue: 1,
            type: 'radio',
            labelWidth: '120px',
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
            label: '备注：',
            name: 'remarks',
            type: 'text',
            labelWidth: '120px',
            maxlength: 255
          }
        ],
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          dataScope: [
            { required: true, message: '请选择数据范围', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入类型', trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapState({
      officeName: state => state.user.officeName,
      officeType: state => state.user.officeType,
      roleName: state => state.user.roleName,
      isCentralOffice: state => state.user.isCentralOffice
    })
  },
  created () {
    const typeName = this.formOption.config.find(e => {
      return e.name === 'typeName' || e.name === 'type'
    })
    // 管理员角色类型为下拉列表，非管理员默认
    if (!typeName) {
      if (this.isCentralOffice) {
        this.formOption.config.push({
          label: '角色类型：',
          name: 'type',
          type: 'select',
          labelWidth: '120px',
          dataList: []
        })
      } else {
        this.formOption.config.push({
          label: '角色类型：',
          name: 'typeName',
          type: 'text',
          disabled: true,
          labelWidth: '120px'
        })
      }
    }
    if (this.isCentralOffice) {
      this._roleTypeList()
    }
    this._roleDataScope()
    this._roleList()
  },
  methods: {
    _roleDataScope () {
      roleDataScope().then(res => {
        this.formOption.config.map(val => {
          if (val.name === 'dataScope') {
            val.dataList = res.data
          }
        })
      })
    },
    _roleTypeList () {
      roleTypeList().then(res => {
        this.formOption.config.map(val => {
          if (val.name === 'typeName' || val.name === 'type') {
            val.dataList = res.data
          }
        })
      })
    },
    _roleList () {
      this.listLoading = true
      roleList(this.listQuery).then(res => {
        this.tableData = res.data.pageUtils.list
        this.total = res.data.pageUtils.totalCount
        this.listLoading = false
      })
    },
    // 获取列表
    _handlerAgentManaList () {
      this._roleList()
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._roleList()
    },
    roleMenuListSelected (data) {
      data.map((item, index) => {
        if (item.children) {
          const noisChked = item.children.find(e => e.isChked === 0)
          if (!noisChked) {
            this.selectedMenuList.push(item.id)
          }
          this.roleMenuListSelected(item.children)
        } else {
          if (item.isChked) {
            this.selectedMenuList.push(item.id)
          }
        }
      })
      return data
    },
    handleConfigure (row) {
      this.treeSelectVisible = true
      this.treeLoading = true
      this.roleId = row.id
      this.selectedMenuList = []
      roleMenuList({ id: row.id }).then(res => {
        this.treeData = res.data
        this.treeLoading = false
        this.roleMenuListSelected(res.data)
      })
    },
    create () {
      const operationStatus = 'create'
      if (this.isCentralOffice) {
        this.formAction('新增角色', operationStatus, {})
      } else {
        this.formAction('新增角色', operationStatus, {
          typeName: this.roleName
        })
      }
    },
    update (data) {
      const operationStatus = 'update'
      this.id = data.id
      this._getListInfo(data).then((data) => {
        if (this.isCentralOffice) {
          this.formAction('修改角色', operationStatus, {
            ...data
          })
        } else {
          this.formAction('修改角色', operationStatus, {
            ...data,
            typeName: this.roleName
          })
        }
      })
    },
    // 新增数据
    createData (data) {
      let formData = {}
      if (this.isCentralOffice) {
        formData = data
      } else {
        formData = Object.assign({}, data, {
          type: this.officeType
        })
      }
      roleCreate(formData).then(res => {
        this._roleList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增角色成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增角色失败',
            type: 'error'
          })
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        roleDetail({ id: data.id })
          .then(res => {
            if (res.data.role) {
              let temp = {}
              res.data.role.dataScope = res.data.role.dataStringScope
              res.data.role.type = res.data.role.stringType
              if (this.isCentralOffice) {
                temp = { ...res.data.role }
              } else {
                temp = {
                  ...res.data.role,
                  ...{
                    typeName: this.roleName
                  }
                }
              }
              resolve(temp)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除数据
    deleteData (data) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let list = []
          if (Array.isArray(data)) {
            data.forEach(item => {
              list.push(item.id)
            })
          } else {
            list = [data.id]
          }
          roleDelete(list).then(res => {
            if (res.msg === 'ok') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this._roleList()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 更新数据
    updateData (data) {
      let formData = {}
      if (this.isCentralOffice) {
        formData = Object.assign({}, data, {
          id: this.id
        })
      } else {
        formData = Object.assign({}, data, {
          type: this.officeType,
          id: this.id
        })
      }
      roleUpdate(formData).then(res => {
        this._roleList()
        if (res.msg === 'ok') {
          this.$message({
            message: '修改角色成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改角色失败',
            type: 'error'
          })
        }
      })
    },
    submitData () {
      this.saveLoading = true
      const idList = this.$refs.tree.getCheckedKeys()
      const ids = idList.concat(this.$refs.tree.getHalfCheckedKeys())
      roleMenuSave({ roleId: this.roleId, ids }).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            message: '配置菜单成功',
            type: 'success'
          })
          this._roleList()
          this.hide()
        } else {
          this.$message({
            message: '配置菜单失败',
            type: 'error'
          })
        }
        this.saveLoading = false
      })
    },
    hide () {
      this.treeSelectVisible = false
      this.isSelectedTree = false
    }
  }
}
</script>

<style lang="scss">
.role-tree {
  height: 450px;
}
</style>
