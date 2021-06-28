<template>
  <div class="section-main agentArea">
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
        :load="handleLoad"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @row-click="handleView($event, '查看')"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="区划名称" />
        <el-table-column prop="areaCode" label="区域代码" />
        <el-table-column prop="mailCode" label="邮政编码" />
        <el-table-column prop="remarks" label="备注说明" />
        <el-table-column width="340" label="操作" align="left" class-name="small-padding fixed-width">
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
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @createData="createData"
        @updateData="updateData"
      />
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handleAreaList,
  handleAreaSave,
  handleAreaUpdate,
  handleAreaDelete,
  handleAreaInfo
} from '@/api/systemSet'

import '@/styles/list.scss'
import formAction from '@/mixins/form.js'
import { isNumber } from '@/utils'

import BaseForm from '@/components/baseForm'

export default {
  /* 代理商区域管理 */
  name: 'AgentArea',
  components: {
    BaseForm
  },
  mixins: [formAction],
  data () {
    var checkSort = (rule, value, callback) => {
      if (value === 0) {
        callback()
      } else {
        if (!value) {
          return callback(new Error('排序值不能为空'))
        } else {
          if (!isNumber(parseInt(value))) {
            callback(new Error('请输入数字值'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      listLoading: false,
      parentIds: '', // 上级区划id (新增下级区划时需要逗号拼接上自身id)
      maps: new Map(), // 对象 用于实时更新增删改
      tableData: [],
      formOption: {
        config: [
          {
            label: '上级区划:',
            name: 'parentId',
            type: 'treeSelect',
            disabled: true,
            labelWidth: '80px',
            treeSelectOption: {
              title: '选择区划',
              name: 'parentName',
              request: {
                url: 'system/api/area/getAreaList',
                params: {}
              }
            }
          },
          {
            label: '名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '简介:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '80px',
            colspan: true
          }
        ],
        rules: {
          number: [
            {
              required: true,
              message: '请输入编号',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          sort: [
            {
              required: true,
              validator: checkSort,
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  created () {
    this._handleAreaList()
  },
  methods: {
    // 列表
    _handleAreaList () {
      this.listLoading = true
      handleAreaList(this.listQuery).then(res => {
        if (res.data && res.data.length > 0) {
          this.tableData = res.data.map(item => {
            return { ...item, hasChildren: item.hasChildren === '1' }
          })
        }
        this.listLoading = false
      })
    },
    handleLoad (tree, treeNode, resolve) {
      const pid = tree.id
      this.maps.set(pid, { tree, treeNode, resolve })
      handleAreaList({ areaId: tree.id }).then(res => {
        if (res.data && res.data.length > 0) {
          const data = res.data.map(item => {
            return { ...item, hasChildren: item.hasChildren === '1' }
          })
          resolve(data)
        }
      })
    },
    // 新增下级
    handleLowerCreate (data, title) {
      const operationStatus = 'create'
      this.parentIds = data.parentIds
      this.formAction(title, operationStatus, {
        parentId: data.id,
        parentName: data.name
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleAreaInfo({
          id: data.id
        })
          .then(res => {
            if (res.data) {
              resolve(res.data.area)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        parentIds: this.parentIds
      })
      handleAreaSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleAreaList()
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.handleRealUpdateData(data.parentId)
        } else {
          this.$message({
            message: '新增失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      const formData = Object.assign({}, data, {
        id: this.id
      })
      handleAreaUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handleAreaList()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.handleRealUpdateData(data.parentId)
        } else {
          this.$message({
            message: '修改失败',
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
      const id = list[0]
      handleAreaDelete([id]).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleAreaList()
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
    handleRealUpdateData (pid) {
      const { tree, treeNode, resolve } = this.maps.get(pid)
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, pid, [])
      this.handleLoad(tree, treeNode, resolve)
    }
  }
}
</script>

<style lang="scss" scoped>
.agentArea {
  .el-table {
    background: transparent;
  }
}
</style>

<style lang="scss">
.agentArea
  .formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
