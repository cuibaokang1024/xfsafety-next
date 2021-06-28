<template>
  <div class="train-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableData"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <el-tooltip :content="row.isModified ? '修改' : '不属于本单位试题不可操作'" placement="top">
              <span class="edit-btn">
                <el-button
                  icon="el-icon-edit-outline"
                  :type="row.isModified ? 'success': 'info'"
                  circle
                  :disabled="!row.isModified"
                  @click.stop="handleEdit(row, '修改')"
                />
              </span>
            </el-tooltip>
            <el-tooltip :content="row.isModified ? '删除' : '不属于本单位试题不可操作'" placement="top">
              <span class="delete-btn">
                <el-button
                  icon="el-icon-delete"
                  :type="row.isModified ? 'danger': 'info'"
                  circle
                  :disabled="!row.isModified"
                  @click.stop="handleDelete(row)"
                />
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="_handleQuestList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :watchs="['isOpen']"
        :is-reset-form-flag="isResetFormFlag"
        :submit-status="submitStatus"
        @createData="createData"
        @updateData="updateData"
        @dataChange="handleIsOpenChange"
        @formHide="formHide"
      />
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handleQuestList,
  handleQuestInfo,
  handleQuestDelete,
  handleQuestUpdate,
  handleQuestSave
} from '@/api/train'

import '../style/index.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'

export default {
  /* 题库类别 */
  name: 'QuestionType',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        questionName: '',
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '名称:',
            name: 'questionName',
            placeholder: '请输入名称',
            maxlength: 64
          }
        ]
      },
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '60',
          align: 'center'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'isOpen',
          label: '是否公开',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.isOpen ? '是' : '否'
          }
        },
        {
          prop: 'createDate',
          label: '创建时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px',
            maxlength: 64
          },
          {
            label: '是否公开:',
            name: 'isOpen',
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
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '80px',
            maxlength: 200,
            colspan: true
          }
        ],
        rules: {
          name: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          isOpen: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  created () {
    this._handleQuestList()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleQuestList()
    },
    // 获取列表
    _handleQuestList () {
      handleQuestList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleQuestInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.questionType)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data) {
      this.submitStatus = 'fail'
      this.$confirm('注意：公开类型为“公开”后不可以改回“未公开”', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formData = Object.assign({}, data, {
          files: this.files
        })
        if (this.deleteFileList.length > 0) {
          this._deletedFile()
        }
        handleQuestSave(formData).then(res => {
          if (res.msg === 'ok') {
            this._handleQuestList()
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
        this.$refs.baseForm.hide()
      }).catch(() => {
        this.submitStatus = 'fail'
      })
    },
    // 更新数据
    updateData (data) {
      this.submitStatus = 'fail'
      this.$confirm('注意：公开类型为“公开”后不可以改回“未公开”', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.deleteFileList && this.deleteFileList.length > 0) {
          this._deletedFile()
        }
        const formData = Object.assign({}, data, {
          files: this.files,
          id: this.id
        })
        handleQuestUpdate(formData).then(res => {
          if (res.msg === 'ok') {
            this._handleQuestList()
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
        this.$refs.baseForm.hide()
      }).catch(() => {
        this.submitStatus = 'fail'
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
      handleQuestDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleQuestList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 是否公开改变时
    handleIsOpenChange (newVal) {
      if (newVal.isOpen) {
        this.formOption.config[1].dataList = [
          {
            value: 1,
            label: '是'
          }
        ]
      } else {
        this.formOption.config[1].dataList = [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
