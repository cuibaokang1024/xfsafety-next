<template>
  <div class="train-main choiceBank">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加')">添加</el-button>
      <el-button class="record" @click="handleDownload()">下载模板</el-button>
      <el-button
        v-if="btnVisible"
        class="cover-btn refresh"
        @click="handleCoverImport()"
      >点击上传</el-button>
      <el-upload
        ref="iUpload"
        class="choiceBank-upload"
        action="Fake Action"
        accept=".xls"
        :multiple="false"
        :limit="1"
        :http-request="handleHttpRequest"
        :on-success="handleHttpSuccess"
      >
        <el-button
          class="refresh"
          size="small"
          type="primary"
        >点击上传</el-button>
      </el-upload>
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
        <el-table-column label="试题来源" align="left" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
            <span>{{ row.isModified ? '本单位' : '他人共享' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
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
        @pagination="_handleQuestionList"
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
        :submit-status="submitStatus"
        @createData="createData"
        @updateData="updateData"
        @formHide="formHide"
      >
        <template v-slot:optionsList>
          <el-form
            ref="optionsForm"
            class="option-form"
            :model="optionData"
            :rules="optionRules"
            :disabled="disabled"
          >
            <el-form-item label="选项:">
              <el-table :data="optionData.optionsList" style="width: 100%">
                <el-table-column
                  label="序号"
                  align="center"
                  class-name="small-padding fixed-width"
                >
                  <template v-slot="{ row, $index }">
                    <el-form-item
                      :prop="`optionsList.${$index}.sort`"
                      :rules="optionRules.sort"
                    >
                      <el-input
                        v-model.number="row.sort"
                        class="edit-input"
                        size="small"
                        :disabled="true"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="选项"
                  align="center"
                  class-name="small-padding fixed-width"
                >
                  <template v-slot="{ row, $index }">
                    <el-form-item
                      :prop="`optionsList.${$index}.option`"
                      :rules="optionRules.option"
                    >
                      <el-input
                        v-model="row.option"
                        class="edit-input"
                        size="small"
                        :disabled="true"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="内容"
                  align="center"
                  class-name="small-padding fixed-width"
                >
                  <template v-slot="{ row, $index }">
                    <el-form-item
                      :prop="`optionsList.${$index}.content`"
                      :rules="optionRules.content"
                    >
                      <el-input
                        v-model="row.content"
                        class="edit-input"
                        size="small"
                        maxlength="100"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </template>
      </BaseForm>
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="dark"
      width="360px"
      v-model:visible="dialogVisible"
      :before-close="handleHide"
    >
      <div name="title" class="dialog-title">题目类型选择</div>
      <div class="dialog-content">
        <BaseTable
          :loading="listLoading"
          :table-config="tableImportConfig"
          :table-data="typeList"
          :disabled-all-check="true"
          :border="false"
          @handleSelectionChange="handleSelData"
        />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide">取 消</el-button>
        <el-button type="primary" @click="handleTypeSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getDict,
  handleQuestionCategory,
  handleQuestionList,
  handleQuestionInfo,
  handleQuestionDelete,
  handleQuestionUpdate,
  handleQuestionSave,
  handleQuestionDownload,
  handleQuestionImport
} from '@/api/train'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'

import '../style/index.scss'
import formAction from '@/mixins/form'
import Download from '@/utils/fileDownload'

export default {
  // 单选题库
  name: 'ChoiceBank',
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
      btnVisible: true,
      dialogVisible: false,
      typeSelectList: [],
      typeObj: {},
      listQuery: {
        name: '',
        typeName: '',
        difficulty: '',
        type: '0', // 0 单选题 1 多选题 2 判断题
        page: 1,
        limit: 10
      },
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '题目:',
            name: 'name',
            placeholder: '请输入题目'
          },
          {
            type: 'text',
            label: '类别:',
            name: 'typeName',
            placeholder: '请输入类别'
          },
          {
            type: 'select',
            label: '难易度:',
            name: 'difficulty',
            placeholder: '请选择难易度',
            dataList: []
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
          prop: 'typeName',
          label: '类别',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '题目',
          align: 'left',
          width: ''
        },
        {
          prop: 'difficulty',
          label: '难易度',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            const array = this.difficultyList.filter((item) => {
              return item.value === String(row.difficulty)
            })
            return array[0].label
          }
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      tableImportConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'label',
          label: '题目类别',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      total: 0,
      difficultyList: [],
      typeList: [],
      formOption: {
        config: [
          {
            label: '类别:',
            name: 'questionTypeId',
            type: 'select',
            labelWidth: '80px',
            dataList: []
          },
          {
            label: '难易度:',
            name: 'difficulty',
            type: 'select',
            labelWidth: '80px',
            dataList: []
          },
          {
            label: '题目:',
            name: 'name',
            type: 'textarea',
            labelWidth: '80px',
            maxlength: 200,
            colspan: true
          },
          {
            type: 'slot',
            name: 'optionsList',
            colspan: true
          },
          {
            label: '答案:',
            name: 'answer',
            type: 'radio',
            labelWidth: '80px',
            dataList: [
              {
                index: 'A',
                text: 'A'
              },
              {
                index: 'B',
                text: 'B'
              },
              {
                index: 'C',
                text: 'C'
              },
              {
                index: 'D',
                text: 'D'
              }
            ],
            colspan: true
          },
          {
            label: '解释:',
            name: 'exp',
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
          answer: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          questionTypeId: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          difficulty: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ]
        }
      },
      optionData: {
        optionsList: [
          {
            content: '',
            option: 'A',
            sort: '1'
          },
          {
            content: '',
            option: 'B',
            sort: '2'
          },
          {
            content: '',
            option: 'C',
            sort: '3'
          },
          {
            content: '',
            option: 'D',
            sort: '4'
          }
        ]
      },
      optionRules: {
        content: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this._getDict()
    this._handleQuestionCategory()
    this._handleQuestionList()
  },
  methods: {
    // 字典值
    _getDict () {
      getDict({
        type: 'exam_question_difficulty'
      }).then((res) => {
        if (res.data) {
          this.difficultyList = res.data.dicts
          this.searchFormOption.config[2].dataList = res.data.dicts
          this.formOption.config[1].dataList = res.data.dicts
        }
      })
    },
    // 题库类别
    _handleQuestionCategory () {
      handleQuestionCategory({}).then((res) => {
        if (res.data) {
          this.typeList = res.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.formOption.config[0].dataList = this.typeList
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleQuestionList()
    },
    // 获取列表
    _handleQuestionList () {
      handleQuestionList(this.listQuery).then((res) => {
        if (res.data) {
          this.tableData = res.data.pageUtils.list
          this.total = res.data.pageUtils.totalCount
        }
      })
    },
    handleCreate (title) {
      this.disabled = false
      this.optionData.optionsList = [
        {
          content: '',
          option: 'A',
          sort: '1'
        },
        {
          content: '',
          option: 'B',
          sort: '2'
        },
        {
          content: '',
          option: 'C',
          sort: '3'
        },
        {
          content: '',
          option: 'D',
          sort: '4'
        }
      ]
      const operationStatus = 'create'
      this.formAction(title, operationStatus, {})
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleQuestionInfo({ id: data.id })
          .then((res) => {
            if (res.data) {
              this.optionData.optionsList = res.data.question.optionsList
              const data = {
                ...res.data.question,
                difficulty: String(res.data.question.difficulty)
              }
              resolve(data)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data) {
      const array = this.typeList.filter((item) => {
        return item.value === data.questionTypeId
      })
      const formData = Object.assign({}, data, {
        optionsList: this.optionData.optionsList,
        type: this.listQuery.type,
        typeName: array[0].label
      })
      this.$refs.optionsForm.validate(valid => {
        if (valid) {
          this.submitStatus = 'success'
          handleQuestionSave(formData).then((res) => {
            if (res.msg === 'ok') {
              this._handleQuestionList()
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            } else {
              this.submitStatus = 'fail'
              this.$message({
                message: '新增失败',
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '选项内容不可为空',
            type: 'error'
          })
          this.submitStatus = 'fail'
        }
      })
    },
    // 更新数据
    updateData (data) {
      const array = this.typeList.filter((item) => {
        return item.value === data.questionTypeId
      })
      const formData = Object.assign({}, data, {
        id: this.id,
        optionsList: this.optionData.optionsList,
        typeName: array[0].label
      })
      this.$refs.optionsForm.validate(valid => {
        if (valid) {
          this.submitStatus = 'success'
          handleQuestionUpdate(formData).then((res) => {
            if (res.msg === 'ok') {
              this._handleQuestionList()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.submitStatus = 'fail'
              this.$message({
                message: '修改失败',
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '选项内容不可为空',
            type: 'error'
          })
          this.submitStatus = 'fail'
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
      handleQuestionDelete(list).then((res) => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleQuestionList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 导出
    handleDownload () {
      handleQuestionDownload().then((res) => {
        if (!res) {
          this.$message.error('下载模板文件失败')
          return false
        }
        this.$message({
          message: '下载模板文件成功',
          type: 'success'
        })
        Download(res.data, '消防培训考试模板.xls')
      })
    },
    handleSelData (val) {
      this.typeSelectList = val
    },
    handleCoverImport () {
      this.btnVisible = false
      this.handleShow()
    },
    handleTypeSubmit () {
      const array = this.typeSelectList
      if (Array.isArray(array)) {
        if (array.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (array.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          this.handleHide()
          this.btnVisible = true
          this.typeObj = array[0]
          this.$refs.iUpload.$refs['upload-inner'].handleClick()
        }
      } else {
        this.$message({
          message: '请选择数据!',
          type: 'warning'
        })
      }
    },
    handleHttpRequest (files) {
      const file = new FormData()
      file.append('excel', files.file)
      file.append('questionTypeId', this.typeObj.value)
      file.append('typeName', this.typeObj.label)
      handleQuestionImport({
        type: this.listQuery.type,
        params: file
      }).then((res) => {
        if (res.code === 200) {
          this._handleQuestionList()
          this.typeObj = {}
          this.$refs.iUpload.clearFiles()
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        }
      }).catch(() => {
        this._handleQuestionList()
        this.typeObj = {}
        this.$refs.iUpload.clearFiles()
      })
    },
    handleHttpSuccess () {},
    handleShow () {
      this.dialogVisible = true
    },
    handleHide () {
      this.typeObj = {}
      this.btnVisible = true
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
