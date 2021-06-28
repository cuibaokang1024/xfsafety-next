<template>
  <div class="inspect-main inspectionPoint">
    <!-- 搜索框 -->
    <div class="search-box">
      <el-form ref="form" class="slot-form" inline>
        <el-form-item label="所在部位:">
          <el-select v-model="listQuery.partId" placeholder="请选择">
            <el-option
              v-for="item in partList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="具体位置:">
          <el-select v-model="listQuery.partAddrId" placeholder="请选择">
            <el-option
              v-for="item in partAddrList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <SearchForm
        :form-option="searchFormOption"
        @reset="resetQuery"
        @search="handleFilter"
      />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button
        :loading="exportLoading"
        icon="el-icon-download"
        class="record"
        @click="handleChooseExport"
      >导出巡查记录</el-button>
      <el-dialog
        v-if="recordFlag"
        v-model:visible="recordFlag"
        class="monthRecord dark"
        width="400px"
        @close="handleRecordHide"
      >
        <div name="title" class="dialog-title">请选择导出巡查记录月份</div>
        <div class="dialog-content">
          <el-date-picker
            v-model="monthRecord"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择年月"
            :picker-options="monthRecordOptions"
          />
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="handleRecordHide">取 消</el-button>
          <el-button type="primary" @click="handleExport">确 定</el-button>
        </div>
      </el-dialog>
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
        :table-config="tableConfig"
        :table-data="tableData"
        :table-height="'100%'"
        :border="false"
        @rowClick="handlePointView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handlePointEdit(row, '修改')"
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
      <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_handlerPointList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container dark point-dialog">
      <el-dialog
        v-if="dialogVisible"
        :title="operationStatus === 'view' ? '查看' : '修改'"
        v-model:visible="dialogVisible"
        width="1000px"
        :before-close="beforeFormClose"
      >
        <div class="dialog-content">
          <el-form
            ref="pointForm"
            :model="formOption"
            :rules="rules"
            :disabled="disabled"
          >
            <el-col :span="12">
              <el-form-item label="巡查点编号:" prop="num">
                <el-input v-model="formOption.num" maxlength="64" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡查点类型:" prop="typeId">
                <tree-select
                  v-model:value="formOption.typeId"
                  v-model:label="formOption.typeName"
                  :tree-select-option="typeOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设施型号:" prop="model">
                <el-input v-model="formOption.model" maxlength="64" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在部位:" prop="partId">
                <el-select v-model="formOption.partId" placeholder="请选择">
                  <el-option
                    v-for="item in partList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="具体位置:" prop="partAddrId">
                <el-select v-model="formOption.partAddrId" placeholder="请选择">
                  <el-option
                    v-for="item in partAddrList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址:" prop="addr">
                <el-input v-model="formOption.addr" maxlength="200" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任部门:" prop="deptId">
                <el-select v-model="formOption.deptId" placeholder="请选择">
                  <el-option
                    v-for="item in deptIdList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人:" prop="primaryId">
                <tree-select
                  v-model:value="formOption.primaryId"
                  v-model:label="formOption.primaryName"
                  :tree-select-option="primaryOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标注名称:" prop="markerName">
                <el-input v-model="formOption.markerName" maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平面图:" prop="plan" class="plan">
                <PlanPosition
                  :part-addr-id="formOption.partAddrId"
                  :init-position="{
                    x: formOption.planX || 0,
                    y: formOption.planY || 0,
                  }"
                  @getPosition="getPosition"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="title">设备设施:</div>
            </el-col>
            <el-col :span="24">
              <el-form-item class="pointlist">
                <el-table
                  style="width: 100%"
                  :span-method="mergeStratege"
                  :cell-class-name="termTypeCellClass"
                  :data="formOption.customList"
                >
                  <el-table-column
                    label="序号"
                    width="50"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`customList.${$index}.sort`"
                        :rules="rules.sort"
                      >
                        <el-input v-model="row.sort" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="设备编号"
                    align="center"
                    width="100"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`customList.${$index}.number`"
                        :rules="rules.number"
                      >
                        <el-input v-model="row.number" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="名称"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`customList.${$index}.name`"
                        :rules="rules.name"
                      >
                        <el-input v-model="row.name" size="small" />
                      </el-form-item>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="添加检查标准"
                        placement="top"
                      >
                        <el-button
                          type="success"
                          style="height: 36px; margin-left: 8px"
                          icon="el-icon-plus"
                          circle
                          @click="addCkhItem(row)"
                        />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="检查标准"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`customList.${$index}.content`"
                        :rules="rules.content"
                      >
                        <el-input v-model="row.content" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="范围类型"
                    align="center"
                    width="100"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item :prop="`customList.${$index}.rangeType`">
                        <el-select v-model="row.rangeType">
                          <el-option label="范围值" :value="0" />
                          <el-option label="单选值" :value="1" />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="正常范围"
                    align="center"
                    width="120"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <div v-if="row.rangeType === 0" class="normal-range">
                        <el-form-item
                          :prop="`customList.${$index}.minAlert`"
                          :rules="rules.minAlert"
                        >
                          <el-input v-model.number="row.minAlert" size="mini" />
                        </el-form-item>
                        <span>~</span>
                        <el-form-item
                          :prop="`customList.${$index}.maxAlert`"
                          :rules="rules.maxAlert"
                        >
                          <el-input v-model.number="row.maxAlert" size="mini" />
                        </el-form-item>
                      </div>
                      <div v-if="row.rangeType === 1">
                        <el-form-item :prop="`customList.${$index}.rangeType`">
                          <el-radio
                            v-model="row.isNormal"
                            :label="0"
                          >是</el-radio>
                          <el-radio
                            v-model="row.isNormal"
                            :label="1"
                          >否</el-radio>
                        </el-form-item>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="单位"
                    width="80"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item :prop="`customList.${$index}.ut`">
                        <el-input
                          v-model="row.ut"
                          size="mini"
                          :disabled="
                            row.rangeType === 1 ? true : disabled ? true : false
                          "
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="80"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot:header>
                      <el-button
                        class="add"
                        size="mini"
                        type="primary"
                        @click="handleRowData()"
                      >添加</el-button>
                    </template>
                    <template v-slot="{ $index }">
                      <el-button
                        size="mini"
                        style="background: transparent; border: none"
                        @click="deleteChkItem($index)"
                      >
                        <i
                          style="font-size: 20px; color: red"
                          class="el-icon-remove"
                        />
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="handlerHide">关 闭</el-button>
          <el-button
            v-if="operationStatus === 'edit'"
            type="primary"
            @click="handlerSubmitForm"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handlerPointList,
  handlerPointDeptId,
  // handlerPointPrimaryId,
  handlerPointUpdate,
  handlerPointDetail,
  handlerPointDelete,
  handleMonthCheckRecord
} from '@/api/chk'
import { getPartsList, getPartsAddrList } from '@/api/partsList'

import '../style/supervisionUnit.scss'
import { isNumber } from '@/utils'
import Download from '@/utils/fileDownload'

import PlanPosition from '@/components/planPosition'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import TreeSelect from '@/components/treeSelect'
import Pagination from '@/components/Pagination'

var idSeq = Date.now()

export default {
  /* 巡查点 */
  name: 'FirePlan',
  components: {
    SearchForm,
    BaseTable,
    TreeSelect,
    Pagination,
    PlanPosition
  },
  data () {
    var chkNumber = (rule, value, callback) => {
      if (value === 0) {
        callback()
      } else {
        if (!isNumber(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      exportLoading: false,
      monthRecord: '',
      monthRecordOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24 * 30 * 5 || time.getTime() > Date.now()
        }
      },
      listQuery: {
        partId: '',
        partAddrId: '',
        typeId: '',
        addr: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            label: '巡查点类型:',
            name: 'typeId',
            type: 'treeSelect',
            treeSelectOption: {
              title: '选择巡查点类型',
              name: 'typeName',
              request: {
                url: 'fire/api/pointstype/getTree',
                params: {}
              }
            }
          },
          {
            type: 'text',
            label: '详细地址:',
            name: 'addr',
            maxlength: 20,
            placeholder: '请输入详细地址'
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
          prop: 'num',
          label: '巡查点编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '巡查点类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'partName',
          label: '所在部位',
          align: 'left',
          width: ''
        },
        {
          prop: 'partAddr',
          label: '具体位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '详细地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'deptName',
          label: '责任部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'primaryName',
          label: '责任人',
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
      tableData: [],
      buildingList: [],
      multipleSelection: [],
      recordFlag: false,
      dialogVisible: false,
      operationStatus: 'view',
      disabled: false,
      formOption: {
        customList: []
      },
      rules: {
        primaryId: [
          { required: true, message: '这是必填字段', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '必填', trigger: 'blur' }],
        number: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        name: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        content: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        minAlert: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: chkNumber, trigger: 'blur' }
        ],
        maxAlert: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: chkNumber, trigger: 'blur' }
        ]
      },
      typeOption: {
        title: '选择巡查点类型',
        request: {
          url: 'fire/api/pointstype/getTree',
          params: {}
        }
      },
      primaryOption: {
        title: '选择人员',
        request: {
          url: 'fire/api/points/getUserList',
          params: {}
        }
      },
      partList: [],
      partAddrList: [],
      deptIdList: []
    }
  },
  watch: {
    'listQuery.partId': {
      handler (newVal, oldVal) {
        if (newVal !== -1 && newVal) {
          this.listQuery.partAddrId = ''
          this._getPartsAddrList(newVal)
        }
      }
    },
    'formOption.partId': {
      handler (newVal, oldVal) {
        if (oldVal) {
          this.formOption.partAddrId = ''
          this.formOption.planX = 0
          this.formOption.planY = 0
        }
        if (newVal !== -1 && newVal) {
          this._getPartsAddrList(newVal)
        }
      }
    },
    'formOption.customList': {
      // 合并相同标题项
      handler (newData) {
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
  created () {
    this._getPartsList()
    this._handlerPointDeptId()
    this._handlerPointList()
  },
  methods: {
    _handlerPointDeptId () {
      handlerPointDeptId().then((res) => {
        this.deptIdList = res.data
      })
    },
    // 获取采集部位列表
    _getPartsList () {
      getPartsList().then((res) => {
        if (res.data) {
          this.buildingList = res.data
          this.partList = res.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },
    // 根据采集部位获取楼层
    _getPartsAddrList (id) {
      getPartsAddrList({ partsId: id }).then((res) => {
        if (res.data) {
          this.partAddrList = res.data.map((partAddr) => {
            return {
              value: partAddr.id,
              label: partAddr.name
            }
          })
        }
      })
    },
    // 列表
    _handlerPointList () {
      this.listLoading = true
      handlerPointList(this.listQuery).then((res) => {
        if (res.data) {
          this.total = res.data.totalCount
          this.tableData = res.data.list
        }
        this.listLoading = false
      })
    },
    // 获取点在平面图上的位置
    getPosition (data) {
      this.formOption.planX = data.x
      this.formOption.planY = data.y
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerPointList()
    },
    // 重置查询条件
    resetQuery () {
      this.listQuery.partId = ''
      this.listQuery.partAddrId = ''
    },
    // 获取详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        let customList = []
        handlerPointDetail({ id: data.id })
          .then((res) => {
            if (res.data) {
              res.data.points.customList.forEach((item) => {
                if (item.children) {
                  const arr = item.children.map((key) => {
                    return {
                      ...key,
                      sort: item.sort,
                      id: item.id,
                      number: item.number,
                      name: item.name
                    }
                  })
                  customList = [...customList, ...arr]
                }
              })
              res.data.points.customList = customList
              resolve(res.data.points)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 删除数据
    handleDelete (data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let list = []
            if (Array.isArray(data)) {
              data.forEach((item) => {
                list.push(item.id)
              })
            } else {
              list = [data.id]
            }
            handlerPointDelete(list).then((res) => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除巡查点成功'
                })
                this._handlerPointList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除巡查点失败'
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handlerShow () {
      this.dialogVisible = true
    },
    handlerHide () {
      this.$nextTick(() => {
        this.$refs.pointForm.resetFields()
        this.dialogVisible = false
      })
    },
    beforeFormClose (done) {
      this.$nextTick(() => {
        this.$refs.pointForm.resetFields()
        done()
      })
    },
    async handlePointView (data) {
      this.operationStatus = 'view'
      this.disabled = true
      this.formOption = await this._getListInfo(data)
      this.handlerShow()
    },
    async handlePointEdit (data) {
      this.operationStatus = 'edit'
      this.disabled = false
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
          this.formOption = await this._getListInfo(data[0])
          this.handlerShow()
        }
      } else {
        this.formOption = await this._getListInfo(data)
        this.handlerShow()
      }
    },
    handleRowData () {
      this.formOption.customList.push({
        id: ++idSeq,
        rangeType: 0,
        isNormal: 0
      })
    },
    // 传入element-table的合并方法
    mergeStratege ({ row, column, rowIndex, columnIndex }) {
      // 第一层判断控制从哪一列，或多少列合并，
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
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
    // 检查类别单元格样式
    termTypeCellClass ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return 'flex'
      }
    },
    // 添加检查内容
    addCkhItem (row) {
      this.formOption.customList.push({
        id: row.id,
        sort: row.sort,
        name: row.name,
        rangeType: 0,
        isNormal: 0,
        ut: ''
      })
      this.formOption.customList = this.checkSameData(
        this.formOption.customList
      )
    },
    // 将id相同的项并列
    checkSameData (arr) {
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
      indices.map((item) => {
        item.map((index) => {
          result.push(arr[index])
        })
      })
      return result
    },
    // 将检查项格式化为保存所需格式
    formatCustomList () {
      const listItems = []
      this.formOption.customList.forEach((item) => {
        const index = listItems.findIndex((key) => {
          return key.id === item.id
        })
        if (index === -1) {
          listItems.push({
            id: item.id,
            sort: item.sort,
            name: item.name,
            number: item.number,
            children: [
              {
                sort: 1,
                content: item.content,
                rangeType: item.rangeType,
                isNormal: item.isNormal,
                minAlert: item.minAlert,
                maxAlert: item.maxAlert,
                ut: item.ut
              }
            ]
          })
        } else {
          listItems[index].children.push({
            sort: listItems[index].children.length + 1,
            content: item.content,
            rangeType: item.rangeType,
            isNormal: item.isNormal,
            minAlert: item.minAlert,
            maxAlert: item.maxAlert,
            ut: item.ut
          })
        }
      })
      return listItems
    },
    // 删除检查内容
    deleteChkItem (index) {
      this.formOption.customList.splice(index, 1)
    },
    // 更新数据
    handlerSubmitForm () {
      this.$refs.pointForm.validate((valid) => {
        if (valid) {
          handlerPointUpdate({
            ...this.formOption,
            customList: this.formatCustomList()
          }).then((res) => {
            if (res.msg === 'ok') {
              this.$message.success('修改巡查点成功')
              this.dialogVisible = false
              this._handlerPointList()
            } else {
              this.$message.error('修改巡查点失败')
              this._handlerPointList()
            }
          })
        }
      })
    },
    handleChooseExport () {
      this.monthRecord = ''
      this.handleRecordShow()
    },
    handleExport () {
      this.exportLoading = true
      if (this.monthRecord) {
        handleMonthCheckRecord({ exportDate: this.monthRecord }).then((res) => {
          if (!res) {
            this.$message.error('下载模板文件失败')
            return false
          }
          this.$message({
            message: '下载模板文件成功',
            type: 'success'
          })
          Download(res.data, res.fileName)
          this.exportLoading = false
        })
      } else {
        this.$message({
          message: '请先选择日期!',
          type: 'warning'
        })
        this.exportLoading = false
      }
    },
    handleRecordShow () {
      this.recordFlag = true
    },
    handleRecordHide () {
      this.recordFlag = false
    }
  }
}
</script>
<style lang="scss" scoped>
.inspect-main {
  .search-box {
    display: flex;

    .slot-form {
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.slot-form {
  .el-form-item__label {
    color: #97c1ff;
    font-size: 14px;
  }

  .el-input__inner {
    width: 152px;
    height: 30px;
    color: #97c1ff;
    font-size: 14px;
    border: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.point-dialog {
  .dialog-content {
    height: 540px;
    overflow-y: scroll;

    .el-form {
      width: auto !important;
      margin-right: 8px;

      .el-form-item {
        display: flex;
      }

      .el-form-item__content {
        width: 100% !important;

        .el-select {
          width: 100%;
        }
      }

      .normal-range {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin: 0 2px;
        }
      }

      .add {
        height: 40px;
      }

      .del {
        height: 40px;
      }

      .title {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        text-align: left;
        font-weight: bold;
        font-size: 14px;
        color: #8effff;
      }

      .pointlist {
        .el-form-item {
          margin-top: 16px;
          margin-bottom: 16px !important;
        }

        .el-form-item__content {
          width: 100%;
        }
      }

      .plan {
        .el-form-item__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        span {
          font-weight: bold;
          color: #97c1ff;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.inspectionPoint {
  .monthRecord {
    .el-dialog__body {
      padding: 20px;

      .dialog-content {
        .el-date-editor {
          width: 100%;

          .el-input__inner {
            color: #97c1ff;
            font-size: 14px;
            border: none;
            background-color: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
}

.pointlist {
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
