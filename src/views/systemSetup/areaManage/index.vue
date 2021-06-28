<template>
  <keep-alive>
    <section class="section-main areaManage">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 列表框 -->
      <div class="table-box">
        <el-table
          ref="table"
          :data="tableData"
          :border="false"
          lazy
          row-key="id"
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @row-click="handleView($event, '查看')"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="区划名称" />
          <el-table-column
            label="操作"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{ row }">
              <el-tooltip content="修改" placement="top">
                <el-button
                  v-if="isCentralOffice || row.officeId"
                  icon="el-icon-edit-outline"
                  type="success"
                  circle
                  @click.stop="handleEdit(row, '修改')"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  v-if="isCentralOffice || row.officeId"
                  icon="el-icon-delete"
                  type="danger"
                  circle
                  @click.stop="handleDelete(row)"
                />
              </el-tooltip>
              <el-tooltip content="添加下级区划" placement="top">
                <el-button
                  icon="el-icon-plus"
                  type="warning"
                  circle
                  @click.stop="handleAddLowerArea(row, '新增行政区划')"
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
    </section>
  </keep-alive>
</template>

<script>
import {
  getOfficeAreaSub,
  saveArea,
  updateArea,
  delArea,
  getAreaDetail
} from '@/api/areaManage'

import '@/styles/list.scss'
import formAction from '@/mixins/form'
import { isNumber } from '@/utils'
import { mapGetters } from 'vuex'

import BaseForm from '@/components/baseForm'
import SearchForm from '@/components/searchForm'

export default {
  /* 区域管理 */
  name: 'AreaManage',
  components: {
    BaseForm,
    SearchForm
  },
  mixins: [formAction],
  data () {
    var checkSort = (rule, value, callback) => {
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
    return {
      listLoading: false,
      parentIds: '', // 上级区划id（新增下级区划时需要逗号拼接上自身id）
      areaType: '', // 新增下级区划时需要自身type + 1
      tableData: [],
      listQuery: {
        name: '',
        areaId: ''
      },
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '物资名称:',
            name: 'name',
            placeholder: '请输入物资名称'
          }
        ]
      },
      formOption: {
        config: [
          {
            label: '上级区划:',
            name: 'parentId',
            type: 'treeSelect',
            disabled: true,
            labelWidth: '80px',
            treeSelectOption: {
              title: '选择上级区划',
              name: 'parentName',
              request: {
                url: 'system/admin/division/getOfficeArea',
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
  computed: {
    ...mapGetters(['isCentralOffice'])
  },
  created () {
    this._getOfficeArea()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery.name = data.name
      this.listQuery.areaId = ''
      this.$refs.table.store.states.lazyTreeNodeMap = []
      this._getOfficeArea()
    },
    // 列表
    _getOfficeArea () {
      this.listLoading = true
      getOfficeAreaSub(this.listQuery).then((res) => {
        if (res.data && res.data.length > 0) {
          this.tableData = res.data.map((item) => {
            return { ...item, hasChildren: item.hasChildren === '1' }
          })
        }
        this.listLoading = false
      })
    },
    load (tree, treeNode, resolve) {
      this.listQuery.areaId = tree.id
      getOfficeAreaSub(this.listQuery).then((res) => {
        if (res.data && res.data.length > 0) {
          const data = res.data.map((item) => {
            return { ...item, hasChildren: item.hasChildren === '1' }
          })
          resolve(data)
        }
      })
    },
    // 下级区划新增页面
    handleAddLowerArea (data, title) {
      const operationStatus = 'create'
      this.parentIds = `${data.parentIds}${data.id},`
      this.areaType = parseInt(data.type) + 1
      this.formAction(title, operationStatus, {
        parentId: data.id,
        parentName: data.name,
        designUnitRecord: 2
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getAreaDetail({
          id: data.id
        })
          .then((res) => {
            if (res.data) {
              resolve({ ...res.data.area, designUnitRecord: 2 })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        parentIds: this.parentIds,
        type: this.areaType
      })
      saveArea(formData).then((res) => {
        if (res.msg === 'ok') {
          this._getOfficeArea()
          this.$message({
            message: '新增下级区划成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增下级区划失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      const formData = Object.assign({}, data, {
        parentIds: data.parentIds,
        type: parseInt(data.type),
        id: this.id
      })
      updateArea(formData).then((res) => {
        if (res.msg === 'ok') {
          this._getOfficeArea()
          this.$message({
            message: '修改区域成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改区域失败',
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
      const id = list[0]
      delArea([id]).then((res) => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getOfficeArea()
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

<style lang="scss" scoped>
.areaManage {
  .el-table {
    background: transparent;
  }
}
</style>
<style lang="scss">
.areaManage
  .formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
