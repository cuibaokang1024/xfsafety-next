<template>
  <div class="main-wrapper">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加')">添加</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="tableData"
        :table-height="'100%'"
        :border="false"
        @rowClick="handleView($event, '查看试卷配置')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-tooltip content="修改" placement="top">
              <el-button type="success" icon="el-icon-edit-outline" circle @click.stop="handleEdit(row, '修改试卷配置')" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle @click.stop="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="_getTestpaperList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :width="'1000px'"
        :form-option="formOption"
        :watchs="['choiceFraction', 'manyFraction', 'judgeFraction']"
        :is-reset-form-flag="isResetFormFlag"
        :submit-status="submitStatus"
        @updateData="updateData"
        @createData="createData"
        @formHide="formHide"
        @dataChange="formDataChange"
      >
        <template>
          <div class="detailList">
            <div style="margin-bottom: 15px;">
              <span class="title">题目配置:</span>
              <el-button class="point-btn" size="mini" round @click="showSubjectSelect">选择</el-button>
            </div>
            <el-form
              ref="detailList"
              :model="detailList"
              :rules="detailRules"
            >
              <el-table :data="detailList.subjectList" style="width: 100%">
                <el-table-column
                  label="序号"
                  width="80"
                  align="center"
                  class-name="small-padding fixed-width"
                >
                  <template v-slot="scope">{{ scope.$index+1 }}</template>
                </el-table-column>
                <el-table-column label="类别" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row}">{{ row.questionTypeName }}</template>
                </el-table-column>
                <el-table-column label="选择题总数" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row}">{{ row.choiceTotal }}</template>
                </el-table-column>
                <el-table-column label="选择题数" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row,$index }">
                    <el-form-item :prop="`subjectList.${$index}.choiceCount`" :rules="detailRules.choiceCount">
                      <el-input v-model.number="row.choiceCount" class="edit-input" size="small" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="多选题总数" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row}">{{ row.manyTotal }}</template>
                </el-table-column>
                <el-table-column label="多选题数" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row,$index }">
                    <el-form-item :prop="`subjectList.${$index}.manyCount`" :rules="detailRules.manyCount">
                      <el-input v-model.number="row.manyCount" class="edit-input" size="small" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="判断题总数" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row}">{{ row.judgeTotal }}</template>
                </el-table-column>
                <el-table-column label="判断题数" align="center" class-name="small-padding fixed-width">
                  <template v-slot="{row,$index }">
                    <el-form-item :prop="`subjectList.${$index}.judgeCount`" :rules="detailRules.judgeCount">
                      <el-input v-model.number="row.judgeCount" class="edit-input" size="small" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="删除"
                  width="80"
                  align="center"
                  class-name="small-padding fixed-width"
                >
                  <template v-slot="{row}">
                    <el-button
                      size="mini"
                      style="background:transparent;border: none;"
                      @click="deleteSubject(row)"
                    >
                      <i style="font-size: 20px;color: red" class="el-icon-remove" />
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </template>
      </BaseForm>
      <input v-model.number="age">
      <el-dialog
        v-if="subjectSelectVisible"
        class="subjectSelect dark"
        :destroy-on-close="true"
        v-model:visible="subjectSelectVisible"
        width="1150px"
      >
        <div name="title" class="dialog-title">题目选择</div>
        <div class="dialog-content" style="height: 500px; padding-top: 0">
          <SubjectSelect ref="subjectSelect" :init-val="initSubjectVal" />
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="getSelectedSubject">确定</el-button>
          <el-button @click="hideSubjectSelect">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getTestpaperList,
  getTestPaperInfo,
  testPaperDelete,
  testPaperSave,
  testPaperUpdate
} from '@/api/train'

import '@/styles/list.scss'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import SubjectSelect from './components/subjectSelect'

export default {
  /* 试卷配置 */
  name: 'TestPaperDispose',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    SubjectSelect
  },
  mixins: [formAction],
  data () {
    var chkPassFraction = (rule, value, callback) => {
      const totalFraction = this.$refs.baseForm.formModel.totalFraction
      if (value >= totalFraction) {
        callback(new Error('及格分数必须小于总分'))
      } else {
        callback()
      }
    }
    var chkCount = (rule, value, callback) => {
      const index = parseInt(rule.field.split('.')[1])
      const attribute = rule.field.split('.')[2].replace('Count', '') + 'Total'
      const total = this.detailList.subjectList[index][attribute]
      if (value === 0) {
        callback()
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 0) {
            callback(new Error('不可输入负数'))
          }
          if (value > total) {
            callback(new Error('不可大于总数'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      listLoading: false,
      listQuery: {
        questionName: '',
        page: 1,
        limit: 10
      },
      age: 20,
      subjectSelectVisible: false,
      total: 0,
      tableData: [],
      detailList: {
        subjectList: []
      },
      currentFormData: null,
      initSubjectVal: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '考试名称:',
            name: 'name',
            placeholder: '请输入名称'
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
          label: '考试名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'startTime',
          label: '开始时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'endTime',
          label: '结束时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'testTime',
          label: '时长',
          align: 'left',
          width: ''
        },
        {
          prop: 'totalFraction',
          label: '总分',
          align: 'left',
          width: ''
        },
        {
          prop: 'choiceFraction',
          label: '单选题分值',
          align: 'left',
          width: ''
        },
        {
          prop: 'manyFraction',
          label: '多选题分值',
          align: 'left',
          width: ''
        },
        {
          prop: 'judgeFraction',
          label: '判断题分值',
          align: 'left',
          width: ''
        }
      ],
      formOption: {
        config: [
          {
            label: '考试名称:',
            name: 'name',
            type: 'text',
            labelWidth: '100px',
            maxlength: 32,
            colspan: true
          },
          {
            label: '类型:',
            name: 'type',
            type: 'select',
            labelWidth: '100px',
            dataList: [
              {
                value: 0,
                label: '模拟考试'
              },
              {
                value: 1,
                label: '正式考试'
              }
            ]
          },
          {
            label: '开始时间:',
            name: 'startTime',
            type: 'datetime',
            picker: 'endTime',
            range: 'start',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            labelWidth: '100px'
          },
          {
            label: '结束时间:',
            name: 'endTime',
            type: 'datetime',
            picker: 'startTime',
            range: 'end',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            labelWidth: '100px'
          },
          {
            label: '考试时长:',
            name: 'testTime',
            type: 'number',
            placeholder: '请输入大于零的整数，单位为分钟',
            min: 1,
            max: 99999,
            labelWidth: '100px'
          },
          {
            label: '考试密码:',
            name: 'testPassword',
            type: 'text',
            maxlength: 10,
            labelWidth: '100px'
          },
          {
            label: '选择题分值:',
            name: 'choiceFraction',
            type: 'number',
            min: 1,
            max: 999999,
            labelWidth: '100px',
            placeholder: '请输入大于零的整数'
          },
          {
            label: '多选题分值:',
            name: 'manyFraction',
            type: 'number',
            min: 1,
            max: 999999,
            placeholder: '请输入大于零的整数',
            labelWidth: '100px'
          },
          {
            label: '判断题分值:',
            name: 'judgeFraction',
            placeholder: '请输入大于零的整数',
            type: 'number',
            min: 1,
            max: 999999,
            labelWidth: '100px'
          },
          {
            label: '总分:',
            name: 'totalFraction',
            type: 'number',
            min: 1,
            disabled: true,
            labelWidth: '100px'
          },
          {
            label: '及格分数:',
            name: 'passFraction',
            type: 'number',
            placeholder: '请输入大于零的整数或一位小数，必须小于总分',
            min: 1,
            precision: 1,
            labelWidth: '100px'
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
          type: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          startTime: [
            {
              required: true,
              message: '考试开始时间为必须输入！',
              trigger: 'blur'
            }
          ],
          endTime: [
            {
              required: true,
              message: '考试结束时间为必须输入！',
              trigger: 'blur'
            }
          ],
          testTime: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          choiceFraction: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          manyFraction: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          judgeFraction: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          totalFraction: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            }
          ],
          passFraction: [
            {
              required: true,
              message: '这是必填字段',
              trigger: 'blur'
            },
            { validator: chkPassFraction, trigger: 'blur' }
          ]
        }
      },
      detailRules: {
        manyCount: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          },
          {
            validator: chkCount, trigger: 'blur'
          }
        ],
        judgeCount: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          },
          {
            validator: chkCount, trigger: 'blur'
          }
        ],
        choiceCount: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          },
          {
            validator: chkCount, trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'detailList.subjectList': {
      deep: true, // 深度监听
      handler (newVal, oldVal) {
        if (newVal) {
          const totalFraction = this.calcTotalFraction(this.currentFormData)
          this.formOption.data = { ...this.currentFormData, totalFraction }
          this.isResetFormFlag = !this.isResetFormFlag
        }
      }
    }
  },
  created () {
    this._getTestpaperList()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getTestpaperList()
    },
    // 获取列表
    _getTestpaperList () {
      getTestpaperList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getTestPaperInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.detailList.subjectList = res.data.detailList
              this.currentFormData = res.data
              resolve(res.data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 选择题目
    showSubjectSelect () {
      this.initSubjectVal = this.detailList.subjectList
      this.subjectSelectVisible = true
    },
    // 获取选中题目
    getSelectedSubject () {
      this.detailList.subjectList = this.$refs.subjectSelect.getSelectedSubject()
      this.subjectSelectVisible = false
    },
    hideSubjectSelect () {
      this.subjectSelectVisible = false
    },
    // 监听的表单字段值改变触发
    formDataChange (newVal) {
      this.currentFormData = newVal
      const totalFraction = this.calcTotalFraction(newVal)
      if (!totalFraction) {
        return
      }
      const newData = { ...newVal, totalFraction }
      this.formOption.data = newData
      this.isResetFormFlag = !this.isResetFormFlag
    },
    // 计算总分
    calcTotalFraction (data) {
      let totalFraction = 0
      if (!data || !this.detailList.subjectList.length) {
        return 0
      }
      let choiceCount = 0; let judgeCount = 0; let manyCount = 0
      this.detailList.subjectList.forEach((item) => {
        choiceCount += item.choiceCount
        judgeCount += item.judgeCount
        manyCount += item.manyCount
      })
      totalFraction = choiceCount * data.choiceFraction + manyCount * data.manyFraction + judgeCount * data.judgeFraction
      return totalFraction
    },
    deleteSubject (row) {
      this.detailList.subjectList = this.detailList.subjectList.filter(item => {
        return item.questionTypeId !== row.questionTypeId
      })

      this.calcTotalFraction(this.currentFormData)
    },
    // 新增数据
    createData (data) {
      this.$refs.detailList.validate(valid => {
        if (valid) {
          const formData = { ...data, detailList: this.detailList.subjectList }
          testPaperSave(formData).then(res => {
            if (res.msg === 'ok') {
              this._getTestpaperList()
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
          this.submitStatus = 'fail'
        }
      })
    },
    // 更新数据
    updateData (data) {
      this.$refs.detailList.validate(valid => {
        if (valid) {
          const formData = { ...data, id: this.id, detailList: this.detailList.subjectList }
          testPaperUpdate(formData).then(res => {
            if (res.msg === 'ok') {
              this._getTestpaperList()
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
          this.submitStatus = 'fail'
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
      testPaperDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getTestpaperList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    formHide () {
      this.detailList = {
        subjectList: []
      }
    }
  }
}
</script>

<style scoped lang="scss">
.detailList {
    margin-top: 13px;
    padding: 10px 25px;
    background: rgba(255, 255, 255, 0.07);
    .title {
        font-size: 14px;
        font-weight: bold;
        color: #8cf6ff;
    }
    .point-btn {
        background: #0a82a5;
        border: none;
        font-size: 14px;
        font-weight: 400;
        color: #d4e5ff;
    }
}
</style>
<style lang="scss">
  .detailList {
    .el-form-item {
      margin-top: 16px;
      margin-bottom: 16px !important;
    }
    .el-form-item__content {
      width: 100%!important;
    }
  }
</style>
