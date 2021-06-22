<template>
  <div class="container todolist">
    <div class="head">
      <div class="icon" />
      <div class="text">隐患值守</div>
    </div>
    <div class="center">
      <div class="top">
        <el-select
          v-model="selectData.value"
          placeholder="请选择"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in selectData.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="bot">
        <BaseTable
          :table-height="250"
          :loading="listLoading"
          :table-data="tableData"
          :table-config="tableConfig"
          :border="false"
          @rowClick="handleView($event)"
        >
          <el-table-column
            label="报警时间"
            width="100px"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <span>{{ row.alertTime | parseTime("{h}:{i}:{s}") }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="摄像头/平面图"
            width="110px"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <div class="camera-plan">
                <span class="camera" @click="handlerTableCamera(row)" />
                <span class="plan" @click="handlerTablePlan(row)" />
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            label="设备状态"
            width="90px"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <div class="rectification">
                <span
                  class="rectification-text"
                  :class="row.category | devStatusClass"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="报警记录"
            width="80px"
            align="left"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-tooltip content="报警记录" placement="top">
                <el-button
                  icon="el-icon-document"
                  type="danger"
                  circle
                  @click="viewAlertDetail(row.devId, 'record')"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>
    <AlarmAlert ref="AlarmAlert" />
    <AlertDetail
      :id="viewDetailId"
      ref="alertDetail"
      :is-reset-flag="isResetFlag"
      :model="model"
      :url="viewDetailUrl"
      :alert-list="allAlertList"
    />
    <el-dialog
      v-if="dialogEleVisible"
      class="electricDetail dark"
      :destroy-on-close="true"
      :visible.sync="dialogEleVisible"
      width="1160px"
      close="eleCloseDetail"
    >
      <div slot="title" class="dialog-title">电设备详情</div>
      <div class="dialog-content">
        <dev-electric-info ref="devDetail" :dev-data="devDataToView" :text-flag="false" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eleHide()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogWaterVisible"
      class="waterDetail dark"
      :destroy-on-close="true"
      :visible.sync="dialogWaterVisible"
      width="930px"
      close="waterCloseDetail"
    >
      <div slot="title" class="dialog-title">水设备详情</div>
      <div class="dialog-content">
        <dev-water-info ref="devDetail" :dev-data="devDataToView" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="waterHide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handlerStatusAlertRecord } from '@/api/companyHome'
import { mapGetters } from 'vuex'
import '@/styles/devList.scss'

import AlertDetail from '@/components/alertDetail'
import BaseTable from '@/components/baseTable'
import AlarmAlert from './components/AlarmAlert'
import DevElectricInfo from '@/components/devElectricInfo'
import DevWaterInfo from '@/components/devWaterInfo'

export default {
  // 隐患值守
  name: 'Danger',
  filters: {
    devStatusClass(devStatus) {
      let className = ''
      if (devStatus === 0) {
        className = 'electric'
      }
      if (devStatus === 1) {
        className = 'water'
      }
      if (devStatus === 2) {
        className = 'smoke'
      }
      if (devStatus === 3) {
        className = 'gas'
      }
      if (devStatus === 4) {
        className = 'infotx'
      }
      if (devStatus === 5) {
        className = 'camera'
      }
      if (devStatus === 6) {
        className = 'ketparts'
      }
      return className
    }
  },
  components: {
    BaseTable,
    AlarmAlert,
    AlertDetail,
    DevElectricInfo,
    DevWaterInfo
  },
  data() {
    return {
      listLoading: {
        category: null
      },
      tableConfig: [
        {
          prop: 'location',
          label: '位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'alertMsg',
          label: '报警信息',
          align: 'left',
          width: ''
        }
      ],
      alertMsg: {},
      devDataToView: {},
      tableData: [],
      viewDetailId: '',
      isResetFlag: true,
      dialogEleVisible: false,
      dialogWaterVisible: false,
      model: '',
      viewDetailUrl: '',
      allAlertList: [],
      selectData: {
        value: '报警类型',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 0,
            label: '电设备'
          },
          {
            value: 1,
            label: '水设备'
          },
          {
            value: 2,
            label: '烟感设备'
          },
          {
            value: 3,
            label: '可燃气体'
          },
          {
            value: 4,
            label: '信息传输装置'
          },
          {
            value: 5,
            label: '视频设备'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['alertMsgData'])
  },
  watch: {
    alertMsgData(newVal) {
      this.alertMsg = newVal
      this.allAlertList.unshift(this.alertMsg)
      const msgArr = this.alertMsg.title
      const deleteIndex = this.tableData.findIndex((item) => {
        return item.devId === this.alertMsg.devId
      })
      this.tableData.splice(deleteIndex, 1)
      const alertMsg = Object.assign({}, this.alertMsg, {
        location: this.alertMsg.addr,
        alertMsg: msgArr
      })
      this.tableData.unshift(alertMsg)
    }
  },
  created() {
    this._handlerStatusAlertRecord()
  },
  methods: {
    _handlerStatusAlertRecord() {
      handlerStatusAlertRecord(this.listLoading).then((res) => {
        this.tableData = res.data
        res.data.forEach((item) => {
          this.allAlertList.push(
            Object.assign({}, item, {
              addr: item.location,
              msg: item.alertMsg
            })
          )
        })
      })
    },
    handleSelectChange(index) {
      this.listLoading.category = index
      this._handlerStatusAlertRecord()
    },
    handlerTablePlan(row) {
      this.$nextTick(() => {
        this.$refs.AlarmAlert.handlerShow()
      })
    },
    handleView(row) {
      console.log(row)
      if (row.category === 0) {
        this.devDataToView = { ...row, devid: row.devId }
        this.dialogEleVisible = true
      } else if (row.category === 1) {
        this.devDataToView = { ...row, devid: row.devId }
        this.dialogWaterVisible = true
      } else {
        return
      }
    },
    // 查看报警信息
    viewAlertDetail(id, model, url) {
      this.isResetFlag = !this.isResetFlag
      this.viewDetailId = id
      this.viewDetailUrl = url
      this.model = model
      this.$refs.alertDetail.show()
    },
    // 关闭设备详情页
    eleCloseDetail() {
      this.dialogEleVisible = false
    },
    // 关闭设备详情窗口
    eleHide() {
      this.dialogEleVisible = false
    },
    // 关闭设备详情页
    waterCloseDetail() {
      this.dialogWaterVisible = false
    },
    // 关闭设备详情窗口
    waterHide() {
      this.dialogWaterVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  height: 100%;
}

.rectification-text {
  width: 30px;
  height: 30px;

  &.electric {
    background: url(./images/icon_electric.png) 0 0 no-repeat;
    background-size: 100%;
  }

  &.water {
    background: url(./images/icon_water.png) 0 0 no-repeat;
    background-size: 100%;
  }

  &.smoke {
    background: url(./images/icon_smoke.png) 0 0 no-repeat;
    background-size: 100%;
  }

  &.gas {
    background: url(./images/icon_gas.png) 0 0 no-repeat;
    background-size: 100%;
  }

  &.infotx {
    background: url(./images/icon_infoTx.png) 0 0 no-repeat;
    background-size: 100%;
  }

  &.camera {
    background: url(./images/icon_camera.png) 0 0 no-repeat;
    background-size: 100%;
  }
}
</style>
