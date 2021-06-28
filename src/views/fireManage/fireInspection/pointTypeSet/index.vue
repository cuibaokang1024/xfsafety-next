<template>
  <div class="inspect-main pointType">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增巡查点类型')">添加</el-button>
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
        :table-height="'716'"
        :table-config="tableConfig"
        :table-data="tableData"
        :default-expand-all="false"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="更新时间" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新人" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <span>{{ row.updateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <span>{{ row.creatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <span>{{ row.creatName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-if="row.officeId !== '-2'"
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleEdit(row, '修改')"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                v-if="row.officeId !== '-2'"
                icon="el-icon-delete"
                type="danger"
                circle
                @click.stop="handleDelete(row)"
              />
            </el-tooltip>
            <el-tooltip content="添加下级" placement="top">
              <el-button
                icon="el-icon-plus"
                type="warning"
                circle
                @click.stop="handlePointTypeSetCreate(row, '添加下级')"
              />
            </el-tooltip>
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
      >
        <template v-slot:Tinymce>
          <div class="Tinymce-title">检查标准:</div>
          <Tinymce ref="editor" v-model="chkStandard" width="auto" :height="380" />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handlerPointTypeSetList,
  handlerPointTypeSetSave,
  handlerPointTypeSetUpdate,
  handlerPointTypeSetDelete,
  handlerPointTypeSetDetail
} from '@/api/office'

import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'
import { isNumber } from '@/utils'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import BaseForm from '@/components/baseForm'
import Tinymce from '@/components/Tinymce'

export default {
  /* 巡查点类型设置 */
  name: 'PointTypeSet',
  components: {
    SearchForm,
    BaseTable,
    BaseForm,
    Tinymce
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
      listQuery: {
        name: ''
      },
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '巡查点类型:',
            name: 'name',
            placeholder: '请输入巡查点类型'
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
          prop: 'name',
          label: '巡查点类型',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '归属上级:',
            name: 'parentId',
            type: 'treeSelect',
            labelWidth: '80px',
            treeSelectOption: {
              title: '选择父级编号',
              name: 'parentName',
              request: {
                url: 'fire/api/pointstype/getTree',
                params: {}
              }
            },
            colspan: true
          },
          {
            label: '名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px',
            maxlength: 99
          },
          {
            label: '排序:',
            name: 'sort',
            type: 'number',
            labelWidth: '80px',
            min: 1,
            max: 9999
          },
          {
            label: '编号:',
            name: 'num',
            type: 'text',
            labelWidth: '80px',
            placeholder: '请输入数字值',
            min: 1,
            max: 9999
          },
          {
            label: '级别:',
            name: 'level',
            type: 'number',
            labelWidth: '80px',
            maxlength: 69
          },
          {
            type: 'slot',
            name: 'Tinymce',
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
      },
      chkStandard: '' // 文章内容
    }
  },
  created () {
    this._handlerPointTypeSetList()
  },
  methods: {
    // 列表
    _handlerPointTypeSetList () {
      this.listLoading = true
      handlerPointTypeSetList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
        this.listLoading = false
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handlerPointTypeSetDetail({
          id: data.id,
          params: { parentId: data.parentId }
        })
          .then(res => {
            if (res.data) {
              this.chkStandard = res.data.chkStandard
              const data = { ...res.data, parentId: res.data.parentId === '-1' ? '' : res.data.parentId }
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = data
      this._handlerPointTypeSetList()
    },
    // 更新数据
    updateData (data) {
      const formData = Object.assign({}, data, {
        chkStandard: this.chkStandard,
        id: this.id
      })
      handlerPointTypeSetUpdate(formData).then(res => {
        if (res.msg === 'ok') {
          this._handlerPointTypeSetList()
          this.$message({
            message: '修改巡查点类型设置成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改巡查点类型设置失败',
            type: 'error'
          })
        }
      })
      this.chkStandard = ''
    },
    baseFormHide () {
      this.chkStandard = ''
      console.log(this.chkStandard)
    },
    // 新增数据
    createData (data) {
      const formData = Object.assign({}, data, {
        chkStandard: this.chkStandard
      })
      handlerPointTypeSetSave(formData).then(res => {
        if (res.msg === 'ok') {
          this._handlerPointTypeSetList()
          this.$message({
            message: '新增巡查点类型设置成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增巡查点类型设置失败',
            type: 'error'
          })
        }
      })
    },
    // 新增下级巡查点
    handlePointTypeSetCreate (data, title) {
      const operationStatus = 'create'
      this.chkStandard = ''
      this.formAction(title, operationStatus, {
        parentId: data.id,
        parentName: data.name
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
      handlerPointTypeSetDelete({ id }).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handlerPointTypeSetList()
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
.Tinymce-title{
  color: #97c1ff;
  font-weight: bold;
}

.pointType {
  .el-table {
    background: transparent;
  }
}
</style>

<style lang="scss">
.pointType
  .formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
