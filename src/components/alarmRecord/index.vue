<template>
  <div>
    <el-dialog
      class="alertRecord dark"
      title="报警记录"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <div slot="title" class="dialog-title">报警记录</div>
      <div ref="content" class="dialog-content">
        <el-header>
          <span>{{ `单位：${unitName||officeName}` }}</span>
          <span>位置：{{ addr }}</span>
        </el-header>
        <div v-if="diffTimeMessage" class="diffTimeMessage">{{ diffTimeMessage }}</div>
        <div v-if="addrUrl||doorUrl" class="somke_image">
          <div v-if="addrUrl" class="addrUrl">
            <span class="text">安装位置</span>
            <el-image
              style="width: 100px; height: 100px"
              :src="addrUrl"
              :preview-src-list="[addrUrl]"
            />
          </div>
          <div v-if="doorUrl" class="doorUrl">
            <span class="text">门头照片</span>
            <el-image
              style="width: 100px; height: 100px"
              :src="doorUrl"
              :preview-src-list="[doorUrl]"
            />
          </div>
        </div>
        <baseTable
          v-loading="listLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
          class="table"
          :border="false"
          :table-data="tableData"
          :table-config="tableConfig"
          :table-height="'450px'"
        >
          <el-table-column
            v-if="sensorCat==='505'"
            label="操作"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" round @click="viewImg(row)">现场图片</el-button>
            </template>
          </el-table-column>
        </baseTable>
        <pagination
          v-show="total>0"
          class="pagination"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="hide()">关 闭</el-button>
      </div>
    </el-dialog>
    <AlertDetail
      ref="alertDetail"
      :is-reset-flag="isImgResetFlag"
      :model="'img'"
      :url="viewDetailUrl"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import AlertDetail from '@/components/alertDetail'
import { getSmokeAlarmRecord } from '@/api/smoke'
import { getWaterAlarmRecord } from '@/api/water'
import { getCameraAlarmRecord } from '@/api/camera'
import { getGasAlarmRecord } from '@/api/gas'
import { getAlarmHistor as getAlarmsysAlarmRecord } from '@/api/alarmsys'
import { timeDifference, hms, parseTime } from '@/utils'

export default {
  components: {
    BaseTable,
    Pagination,
    AlertDetail
  },
  props: {
    // 设备ID
    id: {
      type: String,
      default: ''
    },
    addr: {
      type: String,
      default: ''
    },
    sensorCat: {
      type: String,
      default: ''
    },
    devType: {
      type: Number,
      default: 0
    },
    unitName: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    // 是否更新表格数据
    isResetTableFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: true,
      total: 0,
      isImgResetFlag: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        devId: '',
        type: this.type
      },
      viewDetailUrl: '',
      addrUrl: '',
      doorUrl: '',
      tableData: [],
      tableConfig: [],
      diffTimeMessage: null
    }
  },
  computed: {
    ...mapGetters(['officeName'])
  },
  watch: {
    isResetTableFlag() {
      this.getList()
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      if (this.diffTimeMessage) {
        this.diffTimeMessage = null
      }
      this.dialogVisible = false
    },
    formatterAlertMsg(data) {
      if (data.lastAlertTime && data.firstAlertTime) {
        return `该设备发生${data.sensor}报警，报警持续时间${hms(
          data.firstAlertTime
        )}~${hms(data.lastAlertTime)}`
      } else {
        return `该设备发生${data.sensor}报警`
      }
    },
    getList() {
      switch (this.devType) {
        case 1:
          this._getWaterAlarmRecord()
          break
        case 2:
          this._getSmokeAlarmRecord()
          break
        case 3:
          this._getGasAlarmRecord()
          break
        case 4:
          this._getCameraAlarmRecord()
          break
        case 5:
          this._getAlarmsysAlarmRecord()
          break
      }
    },
    _getCameraAlarmRecord() {
      this.listLoading = true
      this.tableConfig = [
        {
          prop: 'addr',
          label: '位置',
          align: 'center',
          width: ''
        },
        {
          prop: 'sensor',
          label: '报警类型',
          align: 'center',
          width: ''
        },
        {
          prop: 'createDate',
          label: '时间',
          align: 'center',
          width: ''
        }
      ]
      getCameraAlarmRecord(
        Object.assign({}, this.listQuery, {
          devId: this.id
        })
      ).then(res => {
        if (res.data) {
          this.tableData = res.data.list.map(item => {
            if (item.carNum) {
              let carNum = item.carNum
              if (item.carNum === 'unknown') {
                carNum = 'weishibie'
              }
              return { ...item, sensor: `${item.sensor} 车牌号：${carNum}` }
            } else {
              return { ...item }
            }
          })
          this.total = res.data.totalCount
          this.listLoading = false
        }
      })
    },
    _getAlarmsysAlarmRecord() {
      this.listLoading = true
      this.tableConfig = [
        {
          prop: 'areano',
          label: '防区编号',
          align: 'center',
          width: ''
        },
        {
          prop: 'desc',
          label: '报警内容',
          align: 'center',
          width: ''
        },
        {
          prop: 'time',
          label: '时间',
          align: 'center',
          width: ''
        }
      ]
      getAlarmsysAlarmRecord(
        Object.assign({}, this.listQuery, {
          account: this.id
        })
      ).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        }
      })
    },
    _getGasAlarmRecord() {
      this.listLoading = true
      this.tableConfig = [
        {
          prop: 'sensor',
          label: '报警类型',
          align: 'center',
          width: ''
        },
        {
          prop: 'time',
          label: '时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'message',
          label: '报警信息',
          align: 'center',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return this.formatterAlertMsg(row)
          }
        }
      ]
      getGasAlarmRecord(
        Object.assign({}, this.listQuery, {
          devId: this.id
        })
      ).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          if (JSON.stringify(res.data.prog) !== '{}') {
            if (res.data.prog.lastAlertTime && res.data.prog.firstAlertTime) {
              const diffTime = timeDifference(
                res.data.prog.firstAlertTime,
                res.data.prog.lastAlertTime
              )
              this.diffTimeMessage = `该设备正在发生${res.data.prog.sensor}报警，报警开始时间: ${res.data.prog.firstAlertTime}，已持续${diffTime}。`
            } else if (
              !res.data.prog.lastAlertTime &&
              res.data.prog.firstAlertTime
            ) {
              this.diffTimeMessage = `该设备发生${res.data.prog.sensor}报警，报警时间: ${res.data.prog.firstAlertTime}`
            } else {
              this.diffTimeMessage = null
            }
          }
          this.total = res.data.totalCount
          this.listLoading = false
        }
      })
    },
    _getWaterAlarmRecord() {
      this.listLoading = true
      this.tableConfig = [
        {
          prop: 'sensor',
          label: '设备',
          align: 'center',
          width: ''
        },
        {
          prop: 'message',
          label: '报警信息',
          align: 'center',
          width: '',
          formatter: (row, column, cellValue, index) => {
            if (row.lastAlertTime && row.firstAlertTime) {
              return `${row.msg}，报警持续时间${parseTime(
                row.firstAlertTime
              )} ~ ${parseTime(row.lastAlertTime)}`
            } else {
              return row.msg
            }
          }
        },
        {
          prop: 'time',
          label: '时间',
          align: 'center',
          width: ''
        }
      ]
      getWaterAlarmRecord(
        Object.assign({}, this.listQuery, {
          devId: this.id
        })
      ).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          if (JSON.stringify(res.data.prog) !== '{}') {
            if (res.data.prog.lastAlertTime && res.data.prog.firstAlertTime) {
              const diffTime = timeDifference(
                res.data.prog.firstAlertTime,
                res.data.prog.lastAlertTime
              )
              this.diffTimeMessage = `该${
                res.data.prog.sensor
              }正在发生报警，报警值为${res.data.prog.data || ''}${
                res.data.prog.unit
              }，报警开始时间: ${
                res.data.prog.firstAlertTime
              }，已持续${diffTime}。`
            } else if (
              !res.data.prog.lastAlertTime &&
              res.data.prog.firstAlertTime
            ) {
              this.diffTimeMessage = `该${
                res.data.prog.sensor
              }发生报警，报警值为${res.data.prog.data || ''}${
                res.data.prog.unit
              }，报警时间: ${res.data.prog.firstAlertTime}`
            } else {
              this.diffTimeMessage = null
            }
          }
          this.total = res.data.totalCount
          this.addrUrl = res.data.addrUrl
          this.doorUrl = res.data.doorUrl
          this.listLoading = false
        }
      })
    },
    _getSmokeAlarmRecord() {
      this.listLoading = true
      this.tableConfig = [
        {
          prop: 'sensor',
          label: '报警类型',
          align: 'center',
          width: ''
        },
        {
          prop: 'time',
          label: '报警时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'message',
          label: '报警信息',
          align: 'center',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return this.formatterAlertMsg(row)
          }
        }
      ]
      getSmokeAlarmRecord(
        Object.assign({}, this.listQuery, {
          devId: this.id
        })
      ).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          if (JSON.stringify(res.data.prog) !== '{}') {
            if (res.data.prog.lastAlertTime && res.data.prog.firstAlertTime) {
              const diffTime = timeDifference(
                res.data.prog.firstAlertTime,
                res.data.prog.lastAlertTime
              )
              this.diffTimeMessage = `该设备正在发生${res.data.prog.sensor}报警，报警开始时间: ${res.data.prog.firstAlertTime}，已持续${diffTime}。`
            } else if (
              !res.data.prog.lastAlertTime &&
              res.data.prog.firstAlertTime
            ) {
              this.diffTimeMessage = `该设备发生${res.data.prog.sensor}报警，报警时间: ${res.data.prog.firstAlertTime}`
            } else {
              this.diffTimeMessage = null
            }
          }
          this.total = res.data.totalCount
          this.addrUrl = res.data.addrUrl
          this.doorUrl = res.data.doorUrl
          this.listLoading = false
        }
      })
    },
    // 查看现场图片
    viewImg(row) {
      this.isImgResetFlag = !this.isImgResetFlag
      this.viewDetailUrl = row.url
      this.$refs.alertDetail.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 0 10px;
  .dialog-content {
    height: 600px;
    display: flex;
    flex-direction: column;
    .el-header {
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 16px;
      font-weight: bold;
      padding: 0;
      color: #fff;
      background: url(../../assets/devImages/select_item_bg.png) 0 0 no-repeat;
      background-size: 100% 100%;
    }
    .diffTimeMessage {
      height: 56px;
      line-height: 56px;
      text-align: center;
      color: #faff75;
      border: 1px dashed #f04848;
      background: rgba(255, 255, 255, 0.09);
      margin-top: 8px;
      margin-bottom: 10px;
    }
    .somke_image {
      display: flex;
      padding: 10px 0px;
      .addrUrl,
      .doorUrl {
        display: flex;
        .text {
          display: flex;
          padding: 0 20px;
          align-items: center;
          background: #0b72c0;
          color: #fff;
        }
      }
      .doorUrl {
        margin-left: 10px;
        .text {
          background: #429b62;
        }
      }
    }
    .pagination {
      padding: 0;
    }
    .table {
      overflow: auto;
    }
  }
}
</style>
