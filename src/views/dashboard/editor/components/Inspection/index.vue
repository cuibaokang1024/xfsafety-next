<template>
  <div class="container inspection">
    <div class="head">
      <div class="icon" />
      <div class="text">巡查检查</div>
    </div>
    <div class="content">
      <div class="fire-list">
        <div class="fire-item">
          <div class="left">
            <div class="icon fire-1" />
            <div class="text">今日未巡查点</div>
          </div>
          <div class="right">
            <div class="num" @click="handleUnChk('day', '今日未巡查点')">
              {{ unchkDayNum }}
            </div>
          </div>
        </div>
        <div class="fire-item">
          <div class="left">
            <div class="icon fire-2" />
            <div class="text">本月未巡查点</div>
          </div>
          <div class="right">
            <div class="num" @click="handleUnChk('month', '本月未巡查点')">
              {{ unchkMonNum }}
            </div>
          </div>
        </div>
      </div>
      <div class="fire-table">
        <div class="title">
          <span @click="handlerLinkStaffWork">检查计划执行情况</span>
          <span @click="handlerLinkStaffWork">更多</span>
        </div>
        <BaseTable
          :table-height="148"
          :loading="listLoading"
          :table-data="tableData"
          :table-config="tableConfig"
          :border="false"
        >
          <el-table-column
            label="任务名称"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-popover
                popper-class="popover-content"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="row.planName"
              >
                <div slot="reference" class="text">{{ row.planName }}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="应巡查点"
            align="center"
            width="90"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <div>{{ row.pointNum }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="实际巡查点"
            align="center"
            width="90"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <div>{{ row.chkCount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="发现隐患数"
            align="center"
            width="90"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <div>{{ row.dangerNum }}</div>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      class="unChk-dialog dark"
      width="1000px"
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div class="dialog-content">
        <el-scrollbar>
          <div class="unChk-content">
            <div class="table-box">
              <BaseTable
                :loading="listLoading"
                :table-config="tableUnChkConfig"
                :table-data="tableUnChkData"
                :border="false"
              />
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  handlePointNum,
  handlerChkPlanInfo,
  handleUnChePointDay,
  handleUnChePointMonth
} from '@/api/companyHome'

import BaseTable from '@/components/baseTable'

export default {
  // 巡查检查
  name: 'Inspection',
  components: {
    BaseTable
  },
  data() {
    return {
      listLoading: {},
      dialogVisible: false,
      title: '',
      unchkDayNum: 0,
      unchkMonNum: 0,
      tableConfig: [],
      tableData: [],
      tableUnChkConfig: [
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
      tableUnChkData: []
    }
  },
  created() {
    this._handlePointNum()
    this._handlerChkPlanInfo()
  },
  methods: {
    _handlePointNum() {
      handlePointNum().then((res) => {
        this.unchkDayNum = res.data.unchkDayNum
        this.unchkMonNum = res.data.unchkMonNum
      })
    },
    _handlerChkPlanInfo() {
      handlerChkPlanInfo().then((res) => {
        if (res.data) {
          this.tableData = res.data.listData.list
        }
      })
    },
    handlerLinkStaffWork() {
      this.$router.push('/dashboard/editor/staffwork')
    },
    handleUnChk(date, title) {
      if (date === 'day') {
        this._handleUnChePointDay()
      } else {
        this._handleUnChePointMonth()
      }
      this.title = title
      this.handleShow()
    },
    _handleUnChePointDay() {
      handleUnChePointDay().then(res => {
        if (res.data) {
          this.tableUnChkData = res.data
        }
      })
    },
    _handleUnChePointMonth() {
      handleUnChePointMonth().then(res => {
        if (res.data) {
          this.tableUnChkData = res.data
        }
      })
    },
    handleShow() {
      this.dialogVisible = true
    },
    handleHide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  padding-left: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
