<template>
  <section class="section-main">
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加平面图')">添加</el-button>
      <el-button class="edit" @click="handleEdit(multipleSelection, '修改平面图')">修改</el-button>
      <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="list"
        :table-config="tableConfig"
        :border="false"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" round @click="handleView(row, '查看平面图')">查看</el-button>
            <el-button size="mini" type="success" round @click="handleEdit(row, '修改平面图')">修改</el-button>
            <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="_getBuildingPlanList"
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
            @removeFile="removeFile"
          />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'
import {
  getBuildingPlanList,
  buildingplanDelete,
  saveBuildingPlan,
  getBuildingPlanInfo,
  updateBuildingPlan
} from '@/api/office'

import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 消防平面图 */
  name: 'FireBuilding',
  components: {
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
        page: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'groupName',
          label: '分组名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'createDate',
          label: '创建时间',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '分组名称:',
            name: 'groupName',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '所属单位:',
            type: 'unitSelect',
            name: 'officeId',
            placeholder: '请选择所属单位',
            treeSelectOption: {
              name: 'officeName'
            }
          },
          {
            label: '类型:',
            name: 'type',
            type: 'radio',
            labelWidth: '80px',
            dataList: [
              {
                index: 0,
                text: '平面图'
              },
              {
                index: 1,
                text: '三维图'
              }
            ],
            colspan: true
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ],
        rules: {
          groupName: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          officeId: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          type: [
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
  created() {
    this._getBuildingPlanList()
  },
  methods: {
    // 获取列表
    _getBuildingPlanList() {
      getBuildingPlanList(this.listQuery).then(res => {
        if (res.data) {
          this.list = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        getBuildingPlanInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.fileList = res.data.buildingPlan.files.map(item => {
                return { ...item, name: item.fileName }
              })
              resolve(res.data.buildingPlan)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery.name = data.name
      this.ruleDate = data.date
      this._getBuildingPlanList()
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
      buildingplanDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getBuildingPlanList()
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
      updateBuildingPlan(formData).then(res => {
        this._getBuildingPlanList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改消防平面图成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改消防平面图失败',
            type: 'error'
          })
        }
      })
    },
    // 新增数据
    createData(data) {
      const formData = Object.assign({}, data, {
        files: this.files
      })
      if (this.deleteFileList.length > 0) {
        this._deletedFile()
      }
      saveBuildingPlan(formData).then(res => {
        this._getBuildingPlanList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增消防平面图成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增消防平面图失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
