<template>
  <section class="main-wrapper checklist">
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
    </div>
    <div
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
      class="table-box"
    >
      <BaseTable
        :table-data="chkPlanList"
        :table-config="tableConfig"
        :border="false"
        :table-height="'100%'"
        @rowClick="handleView($event,'查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          width="300"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-edit-outline"
              type="success"
              circle
              @click.stop="handleEdit(row, '修改检查表')"
            />
            <el-button icon="el-icon-delete" type="danger" circle @click.stop="handleDelete(row)" />
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="_getChkList"
      />
    </div>
    <BaseForm
      ref="baseForm"
      :width="'1000px'"
      :parent-instance="this"
      :form-option="formOption"
      :is-reset-form-flag="isResetFormFlag"
      @updateData="updateData"
      @createData="createData"
    >
      <template v-slot:checkItems>
        <el-button type="primary" size="mini" @click="addChkTitle">新增</el-button>
        <el-form style="padding-top: 0;">
          <el-table
            :cell-class-name="termTypeCellClass"
            :data="checkItems"
            :span-method="mergeStratege"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column label="标题" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{ row, $index }">
                <el-form-item :prop="`checkItems.${$index}.title`" :rules="rules.title">
                  <el-input
                    v-model="row.title"
                    class="edit-input"
                    size="small"
                    @input="(val) => titleChange(row, val)"
                  />
                </el-form-item>
                <el-button
                  type="success"
                  style="height: 36px"
                  icon="el-icon-plus"
                  circle
                  @click="addCkhItem(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="检查内容" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{ row, $index }">
                <el-form-item :prop="`checkItems.${$index}.label`" :rules="rules.label">
                  <el-input v-model="row.label" class="edit-input" size="small" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="类别"
              align="center"
              width="400"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row, $index }" style>
                <el-form-item :prop="`checkItems.${$index}.termType`" :rules="rules.termType">
                  <el-select v-model="row.termType" placeholder="请选择类别">
                    <el-option
                      v-for="item in termTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-show="row.termType === 0"
                  :prop="`checkItems.${$index}.tempType`"
                  :rules="rules.tempType"
                >
                  <el-select v-model="row.tempType" placeholder="请选择描述">
                    <el-option
                      v-for="item in tempTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-show="row.termType === 0&&row.tempType === 1"
                  :prop="`checkItems.${$index}.dangOpt`"
                  :rules="rules.dangOpt"
                >
                  <el-select v-model="row.dangOpt" placeholder="请选择隐患项">
                    <el-option :key="1" :label="'符合'" :value="1" />
                    <el-option :key="0" :label="'不符合'" :value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-show="row.termType === 0&&row.tempType === 0"
                  :prop="`checkItems.${$index}.dangOpt`"
                  :rules="rules.dangOpt"
                >
                  <el-select v-model="row.dangOpt" placeholder="请选择隐患项">
                    <el-option :key="1" :label="'是'" :value="1" />
                    <el-option :key="0" :label="'否'" :value="0" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="删除"
              width="80"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ $index }">
                <el-button
                  size="mini"
                  style="background: transparent; border: none"
                  @click="deleteChkItem($index)"
                >
                  <i style="font-size: 20px; color: red" class="el-icon-remove" />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </BaseForm>
  </section>
</template>

<script>
import '@/styles/list.scss'
import { getDict } from '@/api/common'
import {
  getChkList,
  geChktListinfo,
  saveChkList,
  deleteChkList
} from '@/api/chkList.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import formAction from '@/mixins/form.js'
import BaseForm from '@/components/baseForm'
let idSeq = Date.now()
export default {
  /* 检查任务 */
  name: 'ChkPlan',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: true,
      listQuery: {
        // 查询参数
        page: 1,
        limit: 10,
        name: '',
        areaName: ''
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '名称:',
            name: 'name',
            placeholder: '请输入名称'
          },
          {
            label: '使用区域：',
            name: 'areaId',
            type: 'treeSelect',
            treeSelectOption: {
              title: '选择使用区域',
              name: 'areaName',
              request: {
                url: 'system/admin/division/getOfficeArea',
                params: {}
              }
            }
          }
        ]
      },
      previewData: {}, // 预览界面数据
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          label: '序号',
          type: 'index',
          width: '55'
        },
        {
          prop: 'name',
          label: '模板名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '模板类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '使用区域',
          align: 'left',
          width: ''
        }
      ],
      chkPlanList: [],
      formOption: {
        config: [
          {
            label: '模板名称：',
            name: 'name',
            type: 'text',
            labelWidth: '130px'
          },
          {
            type: 'select',
            label: '模板类型：',
            name: 'type',
            labelWidth: '130px',
            dataList: []
          },
          {
            label: '使用区域：',
            name: 'areaId',
            type: 'treeSelect',
            labelWidth: '130px',
            treeSelectOption: {
              title: '选择使用区域',
              name: 'areaName',
              request: {
                url: 'system/admin/division/getOfficeArea',
                params: {}
              }
            }
          },
          {
            type: 'radio',
            label: '默认状态:',
            name: 'isDefault',
            labelWidth: '130px',
            dataList: [
              {
                index: 1,
                text: '是'
              },
              {
                index: 0,
                text: '否'
              }
            ]
          },
          {
            type: 'radio',
            label: '检查人员签字：',
            name: 'isSignExam',
            labelWidth: '130px',
            dataList: [
              {
                index: 1,
                text: '是'
              },
              {
                index: 0,
                text: '否'
              }
            ]
          },
          {
            type: 'radio',
            label: '被检查单位签字：',
            name: 'isSignOffice',
            labelWidth: '130px',
            dataList: [
              {
                index: 1,
                text: '是'
              },
              {
                index: 0,
                text: '否'
              }
            ]
          },
          {
            type: 'slot',
            name: 'checkItems',
            colspan: true
          }
        ],
        rules: {
          name: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '请选择使用区域', trigger: 'blur' }
          ]
        }
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        areaId: [{ required: true, message: '请选择使用区域', trigger: 'blur' }]
      },
      termTypeOptions: [
        {
          value: 0,
          label: '选择项'
        },
        {
          value: 1,
          label: '填空项'
        }
      ],
      tempTypeOptions: [
        {
          value: 1,
          label: '符合，不符合'
        },
        {
          value: 0,
          label: '是，否'
        }
      ],
      checkItems: []
    }
  },
  computed: {},
  watch: {
    checkItems: {
      // 合并相同标题项
      handler(newData) {
        if (newData.length) {
          // 标记首行开始合并
          let mergeStartRow = newData[0]
          mergeStartRow.isStartMerge = true // 标记开始合并的行
          mergeStartRow.rowspan = 1 // 标记需要合并行数
          mergeStartRow.startIndex = 0 // 用于计算合并行数
          // 需要计算最后一次的合并行数，故需要循环到length次
          for (let i = 1; i <= newData.length; i++) {
            // row中name字段不相等，则开启下一个合并处理；及最后一次合并
            if (
              (newData[i] && mergeStartRow.id !== newData[i].id) ||
              i === newData.length
            ) {
              mergeStartRow.endIndex = i // 用于计算合并行数
              mergeStartRow.rowspan =
                mergeStartRow.endIndex - mergeStartRow.startIndex // 计算合并行数
              mergeStartRow = newData[i] // 标记新的合并
              if (mergeStartRow) {
                mergeStartRow.isStartMerge = true
                mergeStartRow.rowspan = 1
                mergeStartRow.startIndex = i
              }
            }
          }
        }
      },
      immediate: true
    }
  },
  created() {
    this._getChkList()
    this._getDict()
  },
  methods: {
    // 获取检查表列表
    _getChkList() {
      this.listLoading = true
      getChkList(this.listQuery).then(res => {
        if (res.data) {
          this.chkPlanList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取检查表详情
    _getListInfo(data) {
      this.checkItems = []
      return new Promise((resolve, reject) => {
        geChktListinfo({ id: data.id })
          .then(res => {
            if (res.data) {
              res.data.chkList.listItems.forEach(item => {
                if (item.children) {
                  const arr = item.children.map(key => {
                    return { ...key, title: item.label, id: item.id }
                  })
                  this.checkItems = [...this.checkItems, ...arr]
                }
              })
              resolve(res.data.chkList)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 检查模板类型字典值
    _getDict() {
      getDict({
        type: 'chk_list_type'
      }).then(res => {
        if (res.data) {
          this.formOption.config = this.formOption.config.map(item => {
            if (item.name === 'type') {
              return { ...item, dataList: res.data.dicts }
            } else {
              return item
            }
          })
        }
      })
    },
    // 传入element-table的合并方法
    mergeStratege({ row, column, rowIndex, columnIndex }) {
      // 第一层判断控制从哪一列，或多少列合并，
      if (columnIndex === 0) {
        // 此处表示第一列合并
        // if (columnIndex < 2) { // 此处表示前两列合并
        if (row.isStartMerge) {
          return {
            rowspan: row.rowspan, // 合并多少行，由数据处理函数处理得出
            colspan: 1 // 可以控制合并多少列，可由数据处理函数处理
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 新增标题
    addChkTitle() {
      this.checkItems.push({
        id: ++idSeq,
        title: '',
        termType: '',
        label: '',
        tempType: '',
        dangOpt: ''
      })
    },
    // 将id相同的项并列
    checkSameData(arr) {
      const cache = {} // 存储的是键是zhuanye 的值，值是zhuanye 在indeces中数组的下标
      const indices = [] // 数组中每一个值是一个数组，数组中的每一个元素是原数组中相同zhuanye的下标
      arr.map((item, index) => {
        const id = item.id
        const _index = cache[id]
        if (_index !== undefined) {
          indices[_index].push(index)
        } else {
          cache[id] = indices.length
          indices.push([index])
        }
      })
      const result = []
      indices.map(item => {
        item.map(index => {
          result.push(arr[index])
        })
      })
      return result
    },
    // 删除检查内容
    deleteChkItem(index) {
      this.checkItems.splice(index, 1)
    },
    // 添加检查内容
    addCkhItem(row) {
      this.checkItems.push({
        id: row.id,
        title: row.title,
        termType: '',
        label: '',
        tempType: '',
        dangOpt: ''
      })
      this.checkItems = this.checkSameData(this.checkItems)
    },
    // 新增检查表
    createData(data) {
      saveChkList({ ...data, listItems: this.formatChkItems() }).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            message: '新增检查表成功',
            type: 'success'
          })
          this._getChkList()
        }
      })
    },
    handleCreate(title) {
      this.fileList = []
      const operationStatus = 'create'
      this.checkItems = []
      this.formAction(title, operationStatus, {
        isDefault: 0,
        isSignExam: 0,
        isSignOffice: 0
      })
    },
    // 更新检查表内容
    updateData(data) {
      saveChkList({
        ...data,
        id: this.id,
        listItems: this.formatChkItems()
      }).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            message: '修改检查表成功',
            type: 'success'
          })
          this._getChkList()
        }
      })
    },
    // 删除检查表
    deleteData(data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      deleteChkList(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getChkList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 将检查项格式化为保存所需格式
    formatChkItems() {
      const listItems = []
      this.checkItems.forEach(item => {
        const index = listItems.findIndex(key => {
          return key.label === item.title
        })
        if (index === -1) {
          listItems.push({
            sort: listItems.length + 1,
            label: item.title,
            children: [
              {
                sort: 1,
                termType: item.termType,
                label: item.label,
                tempType: item.tempType,
                dangOpt: item.dangOpt
              }
            ]
          })
        } else {
          listItems[index].children.push({
            sort: listItems[index].children.length + 1,
            termType: item.termType,
            label: item.label,
            tempType: item.tempType,
            dangOpt: item.dangOpt
          })
        }
      })
      return listItems
    },

    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getChkList()
    },
    // 检查类别单元格样式
    termTypeCellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2 || columnIndex === 0) {
        return 'flex'
      }
    },
    // 合并表格的titlie需要赋为相同值
    titleChange(row, val) {
      this.checkItems = this.checkItems.map(item => {
        if (item.id === row.id) {
          return { ...item, title: val }
        } else {
          return { ...item }
        }
      })
    },
    // 关闭预览界面
    hide() {
      this.dialogVisible = false
    },
    // 预览界面
    // 预览
    handlePreview(data) {
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
          this.id = data[0].id
          this.dialogVisible = true
          this._getListInfo(data[0]).then(data => {
            this.previewData = data
          })
        }
      } else {
        this.id = data.id
        this.dialogVisible = true
        this._getListInfo(data).then(data => {
          this.previewData = data
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
.checklist {
  .el-dialog__body {
    height: 500px !important;
  }
  .el-form-item .el-table .el-form-item {
    border-right: none !important;
    border-bottom: none !important;
  }
  .el-form-item .el-table {
    margin-right: 0;
  }
  .el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    background: transparent;
  }
  .flex {
    .cell {
      display: flex;
      align-items: center;
      .el-form-item {
        flex: 1 !important;
      }
    }
  }
}
</style>
