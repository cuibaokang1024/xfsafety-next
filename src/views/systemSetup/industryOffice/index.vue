<template>
  <div style="height: 100%">
    <transition name="fade-transform" mode="out-in">
      <div class="section-main industryOffice">
        <div class="left-container">
          <div class="title">行政区划</div>
          <TreeNode
            v-if="isCentralOffice"
            height="722px"
            :tree-data="treeData"
            :lazy="true"
            :load="loadNodes"
            @handleNodeClick="handleNodeClick"
          />
          <TreeNode v-else height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </div>
        <div class="right-container">
          <div class="search-box">
            <SearchForm :form-option="searchFormOption" @search="handleFilter" />
          </div>
          <!-- 列表框 -->
          <div
            v-loading="listLoading"
            class="table-box"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#001647"
          >
            <el-table
              ref="table"
              :data="tableData"
              :border="false"
              lazy
              row-key="id"
              height="100%"
              :load="handleLoad"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @row-click="handleView($event, '查看')"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="name" label="机构名称" />
              <el-table-column prop="areaName" label="归属区域" />
              <el-table-column prop="code" label="机构编码" />
              <el-table-column prop="remarks" label="备注说明" />
              <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
                <template slot-scope="{ row }">
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
                  <el-tooltip content="人员" placement="top">
                    <el-button
                      icon="el-icon-user"
                      type="info"
                      circle
                      @click.stop="handleViewPersonel(row)"
                    />
                  </el-tooltip>
                  <el-tooltip content="新增下级" placement="top">
                    <el-button
                      icon="el-icon-plus"
                      type="warning"
                      circle
                      @click.stop="handleLowerCreate(row, '新增')"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 列表框 -->
        </div>
        <!-- 弹出框 -->
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
      <!-- 弹出框 -->
      </div>
    </transition>
    <transition name="fade-transform" mode="out-in">
      <UserManage v-if="isShowUserManage" :user-type="3" :office-id="viewUserOfficeId" :office-name="viewUserOfficeName" @hideUserManage="hideUserManage" />
    </transition>
  </div>
</template>

<script>
import {
  handleRightTable,
  handleIndustrySave,
  handleIndustryUpdate,
  handleIndustryDelete,
  handleIndustryInfo
} from '@/api/systemSet'
import { handlerAgentManaAreaTree } from '@/api/office'

import '../styles/agent.scss'
import formAction from '@/mixins/form'
import { mapState } from 'vuex'
import SearchForm from '@/components/searchForm'
import BaseForm from '@/components/baseForm'
import TreeNode from '@/components/treeNode'
import UserManage from '@/components/userManage'
export default {
  /* 行业主管部门 */
  name: 'IndustryOffice',
  components: {
    BaseForm,
    TreeNode,
    UserManage,
    SearchForm
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      maps: new Map(), // 对象 用于实时更新增删改
      tableData: [],
      treeData: [],
      viewUserOfficeId: '', // 查看人员officeId
      viewUserOfficeName: '', // 查看人员officeName
      isShowUserManage: false,
      listQuery: {
        areaId: null,
        type: 3,
        name: ''
      },
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
      formOption: {
        config: [
          {
            label: '上级机构:',
            name: 'parentId',
            type: 'treeSelect',
            labelWidth: '80px',
            treeSelectOption: {
              title: '选择上级机构',
              name: 'parentName',
              request: {
                url: 'system/api/office/directTree',
                params: {}
              }
            }
          },
          {
            label: '机构编码:',
            name: 'code',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '机构名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '归属区域:',
            name: 'areaId',
            type: 'treeSelect',
            labelWidth: '80px',
            treeSelectOption: {
              title: '选择归属区域',
              name: 'areaName',
              request: {
                url: 'system/api/area/getAreaList',
                params: {
                  para: 'areaId'
                }
              }
            }
          },
          {
            label: '主负责人:',
            name: 'primaryName',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '副负责人:',
            name: 'deputyName',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '详细地址:',
            name: 'addr',
            type: 'text',
            labelWidth: '80px',
            colspan: true
          },
          {
            label: '是否可用:',
            name: 'enable',
            type: 'select',
            labelWidth: '80px',
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
            label: '电话:',
            name: 'officePhone',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '邮箱:',
            name: 'email',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '传真:',
            name: 'officeFax',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '80px',
            colspan: true
          }
        ],
        rules: {
          areaId: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapState({
      isCentralOffice: state => state.user.isCentralOffice
    })
  },
  created() {
    this._handlerAgentManaAreaTree()
  },
  methods: {
    // 树状方法
    handleNodeClick(data, node) {
      this.listQuery.areaId = data.id
      this._handleRightTable()
    },
    loadNodes(node, resolve) {
      if (node.level === 0) {
        this._handlerAgentManaAllAreaTree(resolve)
      } else {
        this._handlerAgentManaAllAreaTree(resolve, node.data.id)
      }
    },
    // 获取左侧tree
    _handlerAgentManaAllAreaTree(resolve, agentId) {
      handlerAgentManaAreaTree({ areaId: agentId })
        .then(res => {
          if (res.data) {
            resolve(res.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 非管理员账号调用这个函数
    _handlerAgentManaAreaTree() {
      handlerAgentManaAreaTree().then(res => {
        this.treeData = res.data
        this.listQuery.areaId = res.data[0].id
        this._handleRightTable()
      })
    },
    // 列表
    _handleRightTable() {
      this.listLoading = true
      handleRightTable(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.map(item => {
            return { ...item, hasChildren: item.hasChildren === '1' }
          })
        } else {
          this.tableData = []
        }
        this.listLoading = false
      })
    },
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleRightTable()
    },
    handleLoad(tree, treeNode, resolve) {
      const pid = tree.id
      this.maps.set(pid, { tree, treeNode, resolve })
      this.listQuery.areaId = tree.id
      handleRightTable({ officeId: tree.id }).then(res => {
        if (res.data && res.data.length > 0) {
          const data = res.data.map(item => {
            return { ...item, hasChildren: item.hasChildren === '1' }
          })
          resolve(data)
        }
      })
    },
    // 新增下级巡查点
    handleLowerCreate(data, title) {
      const operationStatus = 'create'
      this.formAction(title, operationStatus, {
        parentId: data.id,
        parentName: data.name
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        handleIndustryInfo({
          id: data.id
        })
          .then(res => {
            if (res.data) {
              resolve(res.data.office)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData(data) {
      const formData = Object.assign({}, data, {})
      handleIndustrySave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleRightTable()
          this.handleRealUpdateData(data.parentId)
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData(data) {
      const formData = Object.assign({}, data, {
        id: this.id
      })
      handleIndustryUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleRightTable()
          this.handleRealUpdateData(data.parentId)
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        }
      })
    },
    // 删除表单数据
    handleIndustryDelete(data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否连下级单位一块删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteData(data)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
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
      const id = list[0]
      handleIndustryDelete([id]).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleRightTable()
          this.handleRealUpdateData(data.parentId)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 缓存数据
    handleRealUpdateData(pid) {
      const { tree, treeNode, resolve } = this.maps.get(pid)
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, pid, [])
      this.handleLoad(tree, treeNode, resolve)
    },
    // 查看人员
    handleViewPersonel(data) {
      this.viewUserOfficeId = data.id
      this.viewUserOfficeName = data.name
      this.isShowUserManage = true
    },
    // 隐藏人员
    hideUserManage() {
      this.isShowUserManage = false
    }
  }
}
</script>

<style lang="scss" scoped>
.industryOffice {
  .el-table {
    background: transparent;
  }
}
</style>
<style lang="scss">
.industryOffice
  .formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
