<template>
  <section class="section-main areaManage">
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button
        class="add"
        @click="handleCreate('添加菜单')"
      >添加</el-button>
      <el-button
        class="edit"
        @click="handleEdit(multipleSelection, '修改菜单')"
      >修改</el-button>
      <el-button
        class="user"
        @click="handleDelete(multipleSelection)"
      >删除</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div
      v-loading="listLoading"
      class="table-box"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <BaseTable
        :table-height="'100%'"
        :table-config="tableConfig"
        :table-data="tableData"
        :default-expand-all="true"
        :border="false"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{ row,$index }">
            <el-button
              size="mini"
              type="primary"
              round
              @click="handleView(row, '查看菜单')"
            >查看</el-button>
            <el-button
              v-if="$index!==0"
              size="mini"
              type="success"
              round
              @click="handleEdit(row, '修改菜单')"
            >修改</el-button>
            <el-button
              v-if="$index!==0"
              size="mini"
              type="danger"
              round
              @click="handleDelete(row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              round
              @click="addLowerArea(row, '新增菜单')"
            >添加下级菜单</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @formHide="baseFormHide"
        @updateData="updateData"
        @createData="createData"
      />
    </div>
    <router-view />
    <!-- 弹出框 -->
  </section>
</template>

<script>
import {
  getOfficeArea,
  saveArea,
  updateArea,
  delArea,
  getAreaDetail
} from '@/api/areaManage'
import '@/styles/list.scss'
import formAction from '@/mixins/form.js'
import { isNumber } from '@/utils'
import BaseTable from '@/components/baseTable'
import BaseForm from '@/components/baseForm'

export default {
  /* 菜单管理 */
  name: 'AreaManage',
  components: {
    BaseTable,
    BaseForm
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
      parentIds: '', // 上级菜单id（新增下级菜单时需要逗号拼接上自身id）
      areaType: '', // 新增下级菜单时需要自身type + 1
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '菜单名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'contacts',
          label: '联系人',
          align: 'left',
          width: ''
        },
        {
          prop: 'telephone',
          label: '联系电话',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '上级菜单:',
            name: 'parentId',
            type: 'treeSelect',
            labelWidth: '100px',
            treeSelectOption: {
              title: '选择上级菜单',
              name: 'pname',
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
            labelWidth: '100px'
          },
          {
            label: '链接:',
            name: 'contactUser',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '目标:',
            name: 'contactTel',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '排序:',
            name: 'sort',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '可见:',
            name: 'designUnitRecord',
            type: 'radio',
            labelWidth: '100px',
            dataList: [
              {
                index: 1,
                text: '显示'
              },
              {
                index: 2,
                text: '隐藏'
              }
            ]
          },
          {
            label: '导航标签:',
            name: 'designUnitRecord',
            type: 'radio',
            labelWidth: '100px',
            dataList: [
              {
                index: 1,
                text: '显示'
              },
              {
                index: 2,
                text: '隐藏'
              }
            ]
          },
          {
            label: '页面缓存:',
            name: 'designUnitRecord',
            type: 'radio',
            labelWidth: '100px',
            dataList: [
              {
                index: 1,
                text: '是'
              },
              {
                index: 2,
                text: '否'
              }
            ]
          },
          {
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '100px',
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
              required: true, validator: checkSort, trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  created () {
    this._getOfficeArea()
  },
  methods: {
    // 列表
    _getOfficeArea () {
      this.listLoading = true
      getOfficeArea(this.listQuery).then((res) => {
        if (res.data) {
          this.tableData = res.data
        }
        this.listLoading = false
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
            message: '修改菜单成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改菜单失败',
            type: 'error'
          })
        }
      })
      this.chkStandard = ''
    },
    baseFormHide () {
      this.chkStandard = ''
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
            message: '新增下级菜单成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增下级菜单失败',
            type: 'error'
          })
        }
      })
    },
    // 下级菜单新增页面
    addLowerArea (data, title) {
      const operationStatus = 'create'
      this.parentIds = `${data.parentIds}${data.id},`
      this.areaType = parseInt(data.type) + 1
      this.formAction(title, operationStatus, { parentId: data.id, pname: data.name, designUnitRecord: 2 })
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
    },
    // 查看人员
    viewPersonel (data) {
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
          const id = data[0].id
          const name = data[0].name
          this.$router.push({
            path: `${this.$route.path}/${id}`,
            query: { name }
          })
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.areaManage{
    .el-table{
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
