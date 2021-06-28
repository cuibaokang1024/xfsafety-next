<template>
  <section class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="create('添加消防培训')">添加</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="list"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
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
        @pagination="_getFireTrainList"
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
            :limit="50"
            :is-download="true"
            :accept="'.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx'"
            :file-list="fileList"
            :file-size="10"
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
  getFireTrainList,
  firetrainDelete,
  saveFireTrain,
  getFireTrainInfo,
  updateFireTrain
} from '@/api/office'
import { mapState } from 'vuex'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 消防培训 */
  name: 'FireTraining',
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
        trainTime: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      searchFormOption: {
        config: [
          {
            type: 'date',
            label: '培训时间:',
            name: 'trainTime',
            valueFormat: 'yyyy-MM-dd',
            placeholder: '请输入培训时间'
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
          prop: 'trainTime',
          label: '培训时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'content',
          label: '培训内容',
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
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        data: {},
        config: [
          {
            label: '培训时间:',
            name: 'trainTime',
            type: 'date',
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
            label: '参与人员:',
            type: 'userSelect',
            name: 'personId',
            labelWidth: '80px',
            treeSelectOption: {
              name: 'personName'
            },
            colspan: true
          },
          {
            label: '培训内容:',
            name: 'content',
            type: 'textarea',
            labelWidth: '80px',
            colspan: true,
            maxlength: 200
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ],
        rules: {
          trainTime: [
            { required: true, message: '请选择培训时间', trigger: 'blur' }
          ],
          officeId: [
            {
              required: true,
              message: '请选择所属单位',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapState({
      officeName: state => state.user.officeName,
      officeId: state => state.user.officeId
    })
  },
  created() {
    this._getFireTrainList()
  },
  methods: {
    // 获取列表
    _getFireTrainList() {
      getFireTrainList(this.listQuery).then(res => {
        if (res.data) {
          this.list = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        getFireTrainInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.fileList = res.data.fireTrain.files.map(item => {
                return { ...item }
              })
              const data = Object.assign({}, res.data.fireTrain, {
                chkUserId: '13006,13101',
                chkUsername: '王小虎,胡冬冬'
              })
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getFireTrainList()
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
      firetrainDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getFireTrainList()
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
      updateFireTrain(formData).then(res => {
        this._getFireTrainList()
        if (res.msg === 'ok') {
          this.deleteFileList = []
          this.$message({
            message: '修改消防培训成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改消防培训失败',
            type: 'error'
          })
        }
      })
    },
    create(params) {
      this.disabled = false
      this.fileList = []
      this.qrfileList = []
      const operationStatus = 'create'
      this.formAction(params, operationStatus, {
        officeId: this.officeId,
        officeName: this.officeName
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
      saveFireTrain(formData).then(res => {
        this._getFireTrainList()
        if (res.msg === 'ok') {
          this.$message({
            message: '新增消防培训成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增消防培训失败',
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
