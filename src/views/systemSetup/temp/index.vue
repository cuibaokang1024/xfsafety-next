<template>
  <div class="section-main unitrecord-container">
    <div class="left-container">
      <TreeNode v-if="isCentralOffice" height="722px" :tree-data="treeData" :lazy="true" :load="loadNodes" @handleNodeClick="handleNodeClick" />
      <TreeNode v-else height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
    </div>
    <div class="right-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box">
        <el-button class="add" @click="handleCreateAdd('新增代理商')">添加</el-button>
        <el-button class="edit" @click="handleAgentEdit(multipleSelection, '修改代理商')">修改</el-button>
        <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
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
            width="240"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{row}">
              <el-button size="mini" type="primary" round @click="handleAgentView(row, '查看代理商')">查看</el-button>
              <el-button size="mini" type="success" round @click="handleAgentEdit(row, '修改代理商')">修改</el-button>
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
          v-model:limit="listQuery.limit"
          @pagination="_handlerAgentManaList"
        />
      </div>
      <!-- 列表框 -->
    </div>
    <!-- 弹出框 -->
    <div class="dialog-container">
      <el-dialog
        v-if="dialogVisible"
        class="formDialog dark agent-dialog"
        width="987px"
        v-model:visible="dialogVisible"
      >
        <div name="title" class="dialog-title">{{ title }}</div>
        <div ref="content" class="dialog-content">
          <el-form
            ref="form"
            class="agent-form"
            :rules="rules"
            :disabled="operationStatus === 'views'"
            :model="formOption"
            label-width="120px"
          >
            <el-col :span="12">
              <el-form-item label="单位名称：" prop="name">
                <el-input v-model="formOption.name" placeholder="请输入单位名称" />
              </el-form-item>
            </el-col>
            <el-col v-if="operationStatus === 'create'" :span="12">
              <el-form-item label="姓名：" prop="userName">
                <el-input v-model="formOption.userName" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col v-if="operationStatus === 'create'" :span="12">
              <el-form-item label="登录名：" prop="loginName">
                <el-input v-model="formOption.loginName" placeholder="请输入登录名" />
              </el-form-item>
            </el-col>
            <el-col v-if="operationStatus === 'create'" :span="12">
              <el-form-item label="密码：" prop="password">
                <el-input v-model="formOption.password" type="password" placeholder="请输入密码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="officePhone">
                <el-input v-model="formOption.officePhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="formOption.email" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="enable">
                <el-radio-group v-model="formOption.enable">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- v-if="isCentralOffice" -->
            <el-col v-if="isCentralOffice" :span="12">
              <el-form-item label="上级代理商：" prop="parentId">
                <unit-select :is-agent="true" v-model:value="formOption.parentId" v-model:label="formOption.parentName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属区域：" prop="areaId">
                <tree-select
                  v-model:value="formOption.areaId"
                  v-model:label="formOption.areaName"
                  :tree-select-option="treeSelectOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代理区域：" prop="areaIdList">
                <div class="treeSelect">
                  <div class="select-wrapper">
                    <el-select v-model="formOption.areaNames" :popper-append-to-body="false" placeholder="请选择" @focus="show()" />
                    <el-button slot="append" class="select-btn" icon="el-icon-search" @click="show()" />
                  </div>
                  <el-dialog class="dark" v-model:visible="dialogTreeVisible" :append-to-body="true" width="350px">
                    <div class="dialog-title">代理区域</div>
                    <div class="dialog-content">
                      <el-tree
                        ref="tree"
                        v-loading="loading"
                        node-key="id"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="#001647"
                        :show-checkbox="true"
                        class="el-tree-dark"
                        :data="agentAreaTree"
                        :check-strictly="true"
                      />
                    </div>
                    <div name="footer" class="dialog-footer">
                      <el-button @click="closeArea()">取 消</el-button>
                      <el-button type="primary" @click="submitData()">确 定</el-button>
                    </div>
                  </el-dialog>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址：">
                <el-input v-model="formOption.addr" placeholder="请输入详细地址" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="经纬度：" prop="lnglat">
                <map-select
                  :lnglat="formOption.lnglat"
                  :addr="formOption.addr"
                  @handleLnglat="handleLnglat"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人：" prop="master">
                <el-input v-model="formOption.master" placeholder="请输入负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报警电话：" prop="alertTel">
                <el-input v-model="formOption.alertTel" placeholder="请输入报警电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model="formOption.sort" placeholder="请输入排序" />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="hide()">关 闭</el-button>
          <el-button
            v-if="operationStatus!=='views'"
            type="primary"
            @click="submit()"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
    <router-view />
  </div>
</template>

<script>
import {
  handlerAgentManaAreaTree,
  handlerAgentManaList,
  handlerAgentManaAdd,
  handlerAgentManaDetail,
  handlerAgentManaUpdate,
  handlerAgentManaDel,
  handlerAreaTree
} from '@/api/office'
import { deepClone } from '@/utils/index'
import '@/styles/list.scss'
import MapSelect from '@/components/MapSelect'
import '@/views/fireManage/unitRecord/style/supervisionUnit.scss'
import '@/views/fireManage/unitRecord/supervisionUnitRecord/index.scss'
import TreeSelect from '@/components/treeSelect'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import TreeNode from '@/components/treeNode'
import UnitSelect from '@/components/UnitSelect'
import { mapState } from 'vuex'

export default {
  /* 监管单位档案 */
  name: 'AgentManagement',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    TreeNode,
    MapSelect,
    TreeSelect,
    UnitSelect
  },
  data () {
    return {
      detailData: {},
      listLoading: false,
      loading: false,
      agentId: '',
      multipleSelection: [],
      listQuery: {
        name: '',
        areaId: '',
        page: 1,
        limit: 10
      },
      total: 0,
      dialogVisible: false,
      treeData: [],
      agentAreaTree: [],
      dialogTreeVisible: false,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '单位名称：',
            name: 'name',
            placeholder: '请输入单位名称'
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
          prop: 'areaName',
          label: '区域名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'master',
          label: '负责人',
          align: 'left',
          width: ''
        },
        {
          prop: 'officePhone',
          label: '电话',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      rules: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择归属区域', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        areaIdList: [
          { required: true, message: '请选择代理区域', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      title: '',
      operationStatus: 'create',
      formOption: {
        name: '',
        userName: '',
        loginName: '',
        password: '',
        officePhone: '',
        email: '',
        enable: '',
        parentId: '',
        parentName: '',
        areaId: '',
        areaIdList: [],
        areaNames: [],
        areaName: '',
        addr: '',
        lnglat: '',
        master: '',
        alertTel: '',
        sort: null
      },
      treeSelectOption: {
        title: '选择归属区域',
        name: 'areaName',
        request: {
          url: 'system/api/agentarea/getAreaTree',
          params: {}
        }
      }
    }
  },
  computed: {
    ...mapState({
      officeId: state => state.user.officeId,
      isCentralOffice: state => state.user.isCentralOffice
    })
  },
  watch: {
    'formOption.parentId' (newVal) {
      let agentId = ''
      if (newVal) {
        agentId = newVal
      } else {
        agentId = this.officeId
      }
      this.agentId = agentId
      this.treeSelectOption.request.url = `system/api/agentarea/getAreaTree?agentId=${agentId}`
    }
  },
  created () {
    this._handlerAgentManaList()
    this._handlerAgentManaAreaTree()
    this.treeSelectOption.request.url = `system/api/agentarea/getAreaTree?agentId=${this.officeId}`
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 非管理员账号调用这个函数
    _handlerAgentManaAreaTree () {
      handlerAgentManaAreaTree().then(res => {
        this.treeData = res.data
      })
    },
    // 获取左侧tree
    _handlerAgentManaAllAreaTree (resolve, agentId) {
      handlerAgentManaAreaTree({ areaId: agentId }).then(res => {
        if (res.data) {
          resolve(res.data)
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取table列表
    _handlerAgentManaList () {
      handlerAgentManaList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    loadNodes (node, resolve) {
      if (node.level === 0) {
        this._handlerAgentManaAllAreaTree(resolve)
      } else {
        this._handlerAgentManaAllAreaTree(resolve, node.data.id)
      }
    },
    // 树状方法
    handleNodeClick (data, node) {
      this.listQuery.areaId = data.id
      this._handlerAgentManaList()
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerAgentManaList()
    },
    // 获取列表详情信息
    _getListInfo (data) {
      handlerAgentManaDetail({ id: data.id })
        .then(res => {
          this.formOption = res.data
          this.detailData = deepClone(res.data)
          this.agentId = res.data.parentId === 10000 ? this.officeId : res.data.parentId
          this.formOption.parentId = res.data.parentId === 10000 ? '' : res.data.parentId
          this.formOption.lnglat = res.data.longitude ? `${res.data.longitude},${res.data.latitude}` : ''
          this.dialogVisible = true
        })
    },
    // 添加代理商
    handleCreateAdd (text) {
      this.dialogVisible = true
      this.operationStatus = 'create'
      this.title = text
      this.agentId = this.officeId
    },
    // 修改代理商
    handleAgentEdit (data, title) {
      this.operationStatus = 'update'
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
          this.id = data[0].id
          this._getListInfo(data[0])
        }
      } else {
        this.id = data.id
        this._getListInfo(data)
      }
    },
    // 查看代理商
    handleAgentView (data, title) {
      this.operationStatus = 'views'
      this.title = title
      this._getListInfo(data)
    },
    // 删除代理商
    handleDelete (data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteData(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 获取经纬度
    handleLnglat (position) {
      this.formOption.lnglat = position
    },
    // 提交form表单
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.operationStatus === 'create') {
            this.createData(this.formOption)
          } else if (this.operationStatus === 'update') {
            this.updateData(this.formOption)
          }
        } else {

        }
      })
    },
    // 新增数据
    createData (data) {
      const Base64 = require('js-base64').Base64
      const areaIdList = data.areaIdList.split(',').map(ele => {
        return Number(ele)
      })
      const formData = Object.assign({}, data, {
        longitude: data.lnglat.split(',')[0],
        latitude: data.lnglat.split(',')[1],
        areaIdList: areaIdList,
        password: Base64.encode(data.password)
      })
      handlerAgentManaAdd(formData).then(res => {
        if (res.msg === 'ok') {
          this._handlerAgentManaList()
          this.$message({
            message: '新增代理商管理成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增代理商管理失败',
            type: 'error'
          })
        }
        this.hide()
      })
    },
    // 更新数据
    updateData (data) {
      let areaIdList = null
      if (!Array.isArray(data.areaIdList)) {
        areaIdList = data.areaIdList.split(',').map(ele => {
          return Number(ele)
        })
      } else {
        areaIdList = data.areaIdList
      }
      if (Array.isArray(areaIdList) && areaIdList.length > 0) {
        areaIdList = areaIdList.filter(ele => {
          return this.detailData.areaIdList.length > 0 && !this.detailData.areaIdList.includes(ele)
        })
      }
      const formData = Object.assign({}, data, {
        longitude: data.lnglat.split(',')[0],
        latitude: data.lnglat.split(',')[1],
        areaIdList: areaIdList,
        id: this.id
      })
      handlerAgentManaUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handlerAgentManaList()
          this.$message({
            message: '修改代理商管理成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改代理商管理失败',
            type: 'error'
          })
        }
        this.hide()
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
      handlerAgentManaDel(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handlerAgentManaList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    _handlerAreaTree (agentId) {
      handlerAreaTree({ agentId: agentId || this.officeId }).then(res => {
        this.agentAreaTree = res.data
        this.loading = false
      })
    },
    // 代理区域弹窗显示
    show () {
      this.dialogTreeVisible = true
      this.loading = true
      this._handlerAreaTree(this.agentId)
    },
    closeArea () {
      this.dialogTreeVisible = false
    },
    // 代理区域选择确定按钮
    submitData () {
      const value = this.$refs.tree.getCheckedNodes().map((item) => {
        return item.id
      })
      const label = this.$refs.tree.getCheckedNodes().map((item) => {
        return item.label
      })
      if (this.operationStatus !== 'create') {
        let data = null
        let levels = null
        // 对代理商管理的修改
        if (this.detailData && this.detailData.areaIdList) {
          data = [...new Set(value.concat(this.detailData.areaIdList))]
          levels = [...new Set(label.concat(this.detailData.areaNames.split(',')))]
        } else {
          data = value
          levels = this.detailData.areaNames.split(',')
        }
        this.formOption.areaIdList = data.join(',')
        this.formOption.areaNames = levels.join(',')
      } else {
        this.formOption.areaIdList = value.join(',')
        this.formOption.areaNames = label.join(',')
      }
      this.dialogTreeVisible = false
    },
    hide () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
      this.formOption = {
        name: '',
        userName: '',
        loginName: '',
        password: '',
        officePhone: '',
        email: '',
        enable: '',
        parentId: '',
        areaId: '',
        areaIdList: [],
        areaNames: [],
        areaName: '',
        addr: '',
        lnglat: '',
        master: '',
        alertTel: '',
        sort: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .section-main{
    flex-direction: row;
  }
  .treeSelect {
  .select-wrapper {
    position: relative;
    width: 100%;
    .select-btn {
      position: absolute;
      right: 0;
      top: 0px;
      border: none;
      font-weight: bold;
      color: #97c1ff;
      background: #00479d;
      border: 1px solid #00479d;
    }
  }
  .dialog-content {
    height: 150px;
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
.formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-child(even) {
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}
.agent-dialog {
  .el-form-item {
    width: 100%;
  }
  .el-dialog {
    .el-dialog__body {
      height: 489px;
    }
  }
}
.agent-form{
  .el-form-item{
    border: none !important;
  }
  .el-form-item__content{
    margin-left: 0 !important;
    width: calc(100% - 120px) !important;
  }
  .el-input{
    width: 100% !important;
  }
  .el-select{
    width: 100%;
  }
}
</style>
