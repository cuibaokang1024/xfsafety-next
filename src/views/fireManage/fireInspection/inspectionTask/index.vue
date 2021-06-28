<template>
  <section class="inspect-main chkPlanList">
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
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{ row }">
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
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="_getChkPlanList"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="chkPlanForm dark"
      width="987px"
      v-model:visible="dialogVisible"
      @close="hideChkPlanForm"
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div class="dialog-content" style="height: 500px; padding-right: 15px;overflow-y: auto;">
        <el-form ref="form" label-width="120px" :inline="true" :model="formData" :rules="rules">
          <el-col :span="12">
            <el-form-item label="检查工作：" prop="receiveId">
              <el-select v-model="formData.receiveId">
                <el-option :key="0" label="单位隐患自查" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称：" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查周期：" prop="cycle">
              <el-input-number
                v-model="formData.cycle"
                :controls="false"
                :precision="cyclePrecision"
                :min="0.1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期频率：" prop="cycleUnit">
              <el-select v-model="formData.cycleUnit">
                <el-option
                  v-for="item in cycleUnitList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="showTimePicker" :span="12">
            <el-form-item label="检查开始时间：" prop="startTime">
              <el-time-picker
                v-model="formData.startTime"
                placeholder="选择时间"
                value-format="HH:mm:ss"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="showTimePicker" :span="12">
            <el-form-item label="检查结束时间：" prop="endTime">
              <el-time-picker
                v-model="formData.endTime"
                value-format="HH:mm:ss"
                placeholder="选择时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查开始日期：" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查结束日期：" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不检查日期：" prop="unchkDate">
              <el-checkbox-group v-model="formData.unchkDate" @change="changeUnchkDate">
                <el-checkbox
                  v-for="item in unchkDateList"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查人员：" prop="chkUser">
              <el-input
                v-model="formData.chkUsername"
                placeholder="请选择检查人员"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" @click="showUserSelect" />
              </el-input>
              <el-input v-show="false" v-model="formData.chkUser" />
            </el-form-item>
          </el-col>
        </el-form>
        <div class="point-wrapper">
          <div style="margin-bottom: 15px;">
            <span class="title">检查计划（巡查点列表）:</span>
            <el-button class="point-btn" size="mini" round @click="showPointSelect">新增巡查点</el-button>
          </div>
          <el-table :data="pointsList" style="width: 100%">
            <el-table-column
              label="序号"
              width="80"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template v-slot="scope">{{ scope.$index+1 }}</template>
            </el-table-column>
            <el-table-column label="巡查点编号" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">{{ row.num }}</template>
            </el-table-column>
            <el-table-column label="类型" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">{{ row.typeName }}</template>
            </el-table-column>
            <el-table-column label="位置" align="center" class-name="small-padding fixed-width">
              <template v-slot="{row}">{{ row.addr }}</template>
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
                  @click="deletePoint(row)"
                >
                  <i style="font-size: 20px;color: red" class="el-icon-remove" />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hideChkPlanForm">取 消</el-button>
        <el-button
          v-if="operationStatus!=='view'"
          type="primary"
          @click="operationStatus==='create' ? createData(): updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="userSelectVisible"
      ref="userSelect"
      class="userSelect dark"
      :destroy-on-close="true"
      v-model:visible="userSelectVisible"
      width="980px"
    >
      <div name="title" class="dialog-title">检查人员选择</div>
      <div class="dialog-content" style="height: 500px; padding-top: 0;padding-bottom: 0;">
        <user-select ref="userSelect" :init-val="initUserVal" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="getSelectedUser">确定</el-button>
        <el-button @click="hideUserSelect">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="pointSelectVisible"
      ref="pointSelect"
      class="pointSelect dark"
      :destroy-on-close="true"
      v-model:visible="pointSelectVisible"
      width="1150px"
    >
      <div name="title" class="dialog-title">巡查点选择</div>
      <div class="dialog-content" style="height: 500px; padding-top: 0">
        <point-select ref="pointSelect" :init-val="initPointVal" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="getSelectedPoint">确定</el-button>
        <el-button @click="hidePointSelect">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import '../style/supervisionUnit.scss'
import { getDict } from '@/api/common'
import { handleInitMoment } from '@/utils'

import {
  getChkPlanList,
  geChktPlaninfo,
  saveChkPlanList,
  updateChkPlanList,
  deleteChkPlanList
} from '@/api/chk'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import UserSelect from '@/components/userSelect'
import PointSelect from './components/pointSelect'

export default {
  /* 检查任务 */
  name: 'ChkPlan',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    UserSelect,
    PointSelect
  },
  data () {
    const validateStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始时间'))
      } else {
        if (this.formData.endTime) {
          this.$refs.form.validateField('endTime')
        }
        callback()
      }
    }
    const validateEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择结束时间'))
      } else {
        if (!this.formData.startTime) {
          callback(new Error('请选择开始时间'))
        } else if (handleInitMoment(this.formData.startTime) >= handleInitMoment(value)) {
          callback(new Error('结束时间必须大于开始时间！'))
        } else {
          callback()
        }
      }
    }
    const validateStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始日期'))
      } else {
        if (this.formData.endDate) {
          this.$refs.form.validateField('endDate')
        }
        callback()
      }
    }
    const validateEndDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择结束日期'))
      } else {
        if (!this.formData.startDate) {
          callback(new Error('请选择开始日期！'))
        } else if (Date.parse(this.formData.startDate) >= Date.parse(value)) {
          callback(new Error('结束日期必须大于开始日期！'))
        } else {
          callback()
        }
      }
    }
    return {
      dialogVisible: false,
      listLoading: true,
      userSelectVisible: false, // 是否显示人员选择界面
      pointSelectVisible: false, // 是否显示巡查点选择界面
      operationStatus: '',
      title: '',
      multipleSelection: [],
      listQuery: {
        // 查询参数
        page: 1,
        limit: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '计划名称:',
            name: 'name',
            placeholder: '请输入名称'
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
          label: '计划名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'cycle',
          label: '检查周期',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.cycle + row.cycleUnitVal
          }
        },
        {
          prop: 'startDate',
          label: '检查开始日期',
          align: 'left',
          width: ''
        },
        {
          prop: 'endDate',
          label: '检查结束日期',
          align: 'left',
          width: ''
        },
        // {
        //   prop: 'unchkDate',
        //   label: '不检查日期',
        //   align: 'left',
        //   width: ''
        // },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkUsername',
          label: '检查人员',
          align: 'left',
          width: ''
        }
      ],
      initUserVal: [], // 人员选择回显数据
      initPointVal: [], // 检查点选择回显数据
      pointsList: [], //  检查点初始数据
      chkPlanList: [],
      cycleUnitList: [], // 检查周期频率
      unchkDateList: [], // 不检查日期
      formData: {
        receiveId: 0,
        name: '门诊一层巡查',
        cycle: 1.0,
        cycleUnit: '1440',
        cycleUnitVal: null,
        startTime: '00:00:00',
        endTime: '00:00:00',
        startDate: '2020-08-22',
        endDate: '2020-09-06',
        unchkDate: ['6', '7', '8'],
        chkUser: '12,15,16',
        chkUsername: '王刚,郑玉和,张云龙',
        groupId: null,
        groupDate: null,
        pointsList: [{ id: 3 }, { id: 4 }, { id: 17 }]
      },
      rules: {
        receiveId: [
          { required: true, message: '请选择检查工作', trigger: 'blur' }
        ],
        name: [{ required: true, trigger: 'blur', message: '请输入计划名称' }],
        cycle: [{ required: true, trigger: 'blur', message: '请输入检查周期' }],
        cycleUnit: [
          { required: true, trigger: 'blur', message: '请选择周期频率' }
        ],
        startTime: [
          { required: true, trigger: 'blur', validator: validateStartTime }
        ],
        endTime: [
          { required: true, trigger: 'blur', validator: validateEndTime }
        ],
        startDate: [
          { required: true, trigger: 'blur', validator: validateStartDate }
        ],
        endDate: [
          { required: true, trigger: 'blur', validator: validateEndDate }
        ],
        chkUser: [
          { required: true, trigger: 'blur', message: '请选择检查人员' }
        ]
      }
    }
  },
  computed: {
    showTimePicker () {
      if (this.formData.cycleUnit === '1' || this.formData.cycleUnit === '60') {
        return true
      } else {
        return false
      }
    },
    cyclePrecision () {
      if (this.formData.cycleUnit === '1') {
        return 0
      } else {
        return 1
      }
    }
  },
  created () {
    this._getChkPlanList()
    this.getCycleUnit()
    this.getUnchkDate()
  },
  methods: {
    // 获取检查计划列表
    _getChkPlanList () {
      this.listLoading = true
      getChkPlanList(this.listQuery).then(res => {
        if (res.data) {
          this.chkPlanList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取检查计划详情
    _geChktPlaninfo (data) {
      return new Promise((resolve, reject) => {
        geChktPlaninfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取周期频率（字典值）
    getCycleUnit () {
      getDict({ type: 'chk_cycle_unit' }).then(res => {
        if (res.data) {
          this.cycleUnitList = res.data.dicts
        }
      })
    },
    // 检查周期校验
    checkCycle (rule, value, callback) {
      if (!value) {
        return callback(new Error('检查周期不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 18) {
          callback(new Error('必须年满18岁'))
        } else {
          callback()
        }
      }
    },
    // 获取不检查日期
    getUnchkDate () {
      getDict({ type: 'chk_uncheck_date' }).then(res => {
        if (res.data) {
          const data = res.data.dicts.sort((object1, object2) => {
            const value1 = object1.sort
            const value2 = object2.sort
            return value1 - value2
          })
          this.unchkDateList = data
        }
      })
    },
    // 改变不检查日期
    changeUnchkDate (val) {
      this.unchkDate = val
    },
    // 删除巡查点
    deletePoint (row) {
      this.pointsList = this.pointsList.filter(item => {
        return item.id !== row.id
      })
    },
    // 选择人员
    showUserSelect () {
      if (this.formData.chkUser) {
        const userNameList = this.formData.chkUsername.split(',')
        this.initUserVal = this.formData.chkUser
          .split(',')
          .map((item, index) => {
            return { id: parseInt(item), name: userNameList[index] }
          })
      }
      this.userSelectVisible = true
    },
    // 选择巡查点
    showPointSelect () {
      this.initPointVal = this.pointsList
      this.pointSelectVisible = true
    },
    // 获取选中人员
    getSelectedUser () {
      const selectedUserList = this.$refs.userSelect.getSelectedUser()
      this.formData.chkUsername = this.arrToStr(selectedUserList, 'name')
      this.formData.chkUser = this.arrToStr(selectedUserList, 'id')
      this.hideUserSelect()
    },
    // 获取选中巡查点
    getSelectedPoint () {
      this.pointsList = this.$refs.pointSelect.getSelectedPoint()
      this.pointSelectVisible = false
    },
    hideUserSelect () {
      this.userSelectVisible = false
    },
    hidePointSelect () {
      this.pointSelectVisible = false
    },
    showChkPlanForm () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    hideChkPlanForm () {
      this.dialogVisible = false
      this.pointsList = []
    },
    // 新增检查计划
    handleCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formData = {
        receiveId: 0,
        name: '',
        cycle: undefined,
        cycleUnit: '',
        cycleUnitVal: null,
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        unchkDate: [],
        chkUser: '',
        chkUsername: '',
        pointsList: []
      }
      this.pointsList = []
      this.showChkPlanForm()
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 查看表单信息
    async handleView (data, title) {
      this.title = title
      this.operationStatus = 'view'
      const detaile = await this._geChktPlaninfo(data)
      this.formData = {
        ...detaile.plan,
        cycleUnit: `${detaile.plan.cycleUnit}`,
        unchkDate: detaile.plan.unchkDate.split(',')
      }
      this.pointsList = detaile.list
      this.showChkPlanForm()
    },
    // 编辑表单信息
    async handleEdit (data, title) {
      this.title = title
      this.operationStatus = 'edit'
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
          const detaile = await this._geChktPlaninfo(data[0])
          this.formData = {
            ...detaile.plan,
            cycleUnit: `${detaile.plan.cycleUnit}`,
            unchkDate: detaile.plan.unchkDate
              ? detaile.plan.unchkDate.split(',')
              : []
          }
          this.pointsList = detaile.list
          this.showChkPlanForm()
        }
      } else {
        const detaile = await this._geChktPlaninfo(data)
        this.formData = {
          ...detaile.plan,
          cycleUnit: `${detaile.plan.cycleUnit}`,
          unchkDate: detaile.plan.unchkDate
            ? detaile.plan.unchkDate.split(',')
            : []
        }
        this.pointsList = detaile.list
        this.showChkPlanForm()
      }
    },
    // 删除表单数据
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
              data.forEach(item => {
                list.push(item.id)
              })
            } else {
              list = [data.id]
            }
            deleteChkPlanList(list).then(res => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除检查计划成功'
                })
                this._getChkPlanList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败'
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
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getChkPlanList()
    },
    // / 新增检查计划
    createData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.pointsList && this.pointsList.length > 0) {
            this.formData = Object.assign({}, this.formData, {
              pointsList: this.pointsList.map(item => {
                return { id: item.id }
              }),
              unchkDate: this.arrToStr(this.unchkDate)
            })
            saveChkPlanList(this.formData).then(res => {
              if (res.msg === 'ok') {
                this.$message.success('新增检查计划成功')
                this.hideChkPlanForm()
                this._getChkPlanList()
              }
            })
          } else {
            this.$message({
              message: '请至少选择一个巡查点',
              type: 'info'
            })
          }
        }
      })
    },
    arrToStr (arr, obj) {
      let str = ''
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          if (obj) {
            str += `${item[obj] || ''},`
          } else {
            str += `${item || ''},`
          }
        })
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    // 更新检查计划
    updateData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.pointsList && this.pointsList.length > 0) {
            this.formData = Object.assign({}, this.formData, {
              pointsList: this.pointsList.map(item => {
                return { id: item.id }
              }),
              unchkDate: this.arrToStr(this.unchkDate)
            })
            updateChkPlanList(this.formData).then(res => {
              if (res.msg === 'ok') {
                this.$message.success('修改检查计划成功')
                this.hideChkPlanForm()
                this._getChkPlanList()
              }
            })
          } else {
            this.$message({
              message: '请至少选择一个巡查点',
              type: 'info'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chkPlanList {
  .dark {
    &.chkPlanForm {
      .el-form {
        flex-wrap: wrap;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.07);
        .el-form-item {
          display: flex;
          flex: 0 1 50%;
          margin-right: 0;
          .el-form-item__content {
            flex: 1;
            .el-input-number--medium {
              width: 100%;
              input {
                text-align: left;
              }
            }
            .el-input {
              width: 100%;
            }
            .el-select {
              width: 100%;
            }
          }
        }
      }
      .point-wrapper {
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
    }
  }
}
</style>
<style lang="scss">
.chkPlanList {
  .dark {
    &.chkPlanForm {
      .el-dialog__body {
        padding-top: 0;
      }
    }
    .el-dialog .dialog-content .el-form .el-form-item__content {
      width: calc(100% - 120px);
      .el-checkbox-group {
        padding: 0 15px;
        display: flex;
        height: 41px;
        align-items: center;
        justify-content: flex-start;
        .el-checkbox__input:not(.is-checked) {
          .el-checkbox__inner {
            background: transparent;
            border: 1px solid #13a4e0;
          }
        }
      }
      .el-input-number--medium {
        input {
          text-align: left;
        }
      }
    }
  }
}
</style>
