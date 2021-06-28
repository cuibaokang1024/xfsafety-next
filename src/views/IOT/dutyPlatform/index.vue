<template>
  <div class="main">
    <div class="container">
      <div class="left-container">
        <div class="statistics">
          <div class="accessUnit">
            <span class="text">总共接入单位</span>
            <span class="num">{{ statisticsData.dwnum }}<span class="unit">家</span></span>
          </div>
          <div class="devNum">
            <span class="text">总共安装设备</span>
            <span class="num">{{ statisticsData.sbnum }}<span class="unit">套</span></span>
          </div>

          <div class="alarmNum">
            <span class="text">总报警设备</span>
            <span class="num">{{ statisticsData.alnum }}<span class="unit">套</span></span>
          </div>
        </div>
        <el-collapse v-model="activeName" style="overflow: auto;height: 100%;" @change="_getMonitorData()">
          <top-box :name="'electric'" :data="monitorData.electric" @filterOffice="filterOffice($event,'dev_electric')" />
          <top-box :name="'water'" :data="monitorData.water" @filterOffice="filterOffice($event,'dev_water')" />
          <top-box :name="'smoke'" :data="monitorData.smoke" @filterOffice="filterOffice($event,'dev_smoke')" />
          <top-box :name="'gas'" :data="monitorData.gas" @filterOffice="filterOffice($event,'dev_gas')" />
        </el-collapse>
      </div>
      <div class="center-container">
        <base-map ref="map" :office-list="officeList" @viewDetail="viewUnitArchives" />
      </div>
      <div class="right-container">
        <div class="search">
          <el-input v-model="listQuery.companyName" placeholder="请输入您要搜索的信息" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </div>
        <div class="btn-switch">
          <el-button :class="{selected:visibility==='alarm'}" round @click="displaySwitch('alarm')">报警信息</el-button>
          <el-button :class="{selected:visibility==='office'}" round @click="displaySwitch('office')">社会单位</el-button>
        </div>
        <div class="split" />
        <div v-show="visibility==='alarm'" class="tool">
          <span class="all" @click="switchAlarmList">{{ `${showAlarmList}报警` }}</span>
          <span class="history" @click="viewHistoryRecord">历史</span>
          <span class="clear">清空</span>
          <div class="type">
            <span class="arrow" :class="isSelectType?'arrow-up':''" />
            <el-select
              v-model="listQuery.devWaterStatus"
              :popper-append-to-body="false"
              style="width:67px"
              placeholder
              @visible-change="selectType"
            >
              <el-option :value="''" label="全部" />
            </el-select>
          </div>
        </div>
        <ul v-show="visibility==='alarm'" class="alarm-list">
          <li v-for="item in alarmMsgList" :key="item.devId" @click="viewAlarmHandle(item)">
            <span class="name">{{ item.officeName||'' }}</span>
            <span class="info">{{ item.msg||'' }}</span>
            <span class="time">{{ item.time||'' }}</span>
            <span class="num">{{ `报警次数：${item.alertCount||''}` }}</span>
          </li>
        </ul>
        <ul v-show="visibility==='office'" class="office-list">
          <li v-for="item in officeList" :key="item.id" @click="filterAlarmList(item)">
            <span class="name">{{ item.name||'' }}</span>
            <span class="address">{{ `地址：${item.addr||''}` }}</span>
            <span class="tel">{{ `电话：${item.tel||''}` }}</span>
            <span class="num-wrapper">
              <span class="text">报警：</span>
              <span class="num">
                <number-roll
                  :width="'10px'"
                  :font-size="'14px'"
                  :number="item.alarmNum"
                  :unit="'次'"
                />
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <alarm-handle ref="alarmHandle" :dev-category="1" :dev-id="viewDevid" :office-id="viewOfficeId" :is-reset-flag="isDetailResetFlag" />
    <history-alarm ref="historyAlarm" :is-reset-flag="isHistoryResetFlag" :is-show-category="true" />
    <el-dialog
      v-if="dialogVisible"
      class="dark unitArchives"
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      width="1240px"
    >
      <div name="title" class="dialog-title">单位档案</div>
      <div class="dialog-content">
        <unit-archives :office-id="viewOfficeId" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import '@/styles/devMonitoring.scss'
import BaseMap from '../components/bmap/base-map'
import TopBox from '../components/topBox'
import NumberRoll from '@/components/numberRoll'
import UnitArchives from '@/components/unitArchives'
import AlarmHandle from '../components/alarmHandle'
import HistoryAlarm from '../components/historyAlarm'
import { getOfficeAlert, getMonitorData, getDevMonitor, getAlertOffices, getNumOffices } from '@/api/iot'
import { MQTT_CONNECTION } from '@/utils/mqtt_config'
import mqtt from 'mqtt'
export default {
  components: {
    TopBox,
    BaseMap,
    NumberRoll,
    AlarmHandle,
    HistoryAlarm,
    UnitArchives
  },
  data() {
    return {
      isSelectType: false,
      activeName: ['electric'],
      dialogVisible: false, // 单位档案显示|隐藏
      statisticsData: {}, // 左侧上方统计数据
      latestData: {}, // mqtt最新数据
      viewDevid: '', // 打开处置页面（设备id）
      viewOfficeId: '', // 打开处置页面（单位id）| 地图单位（单位id）设备详情|单位详情（单位id）
      isHistoryResetFlag: false, // 历史弹出页数据是否更新标志
      isDetailResetFlag: false, // 报警详情弹出页数据是否更新标志
      visibility: 'alarm', // 显示社会单位列表 | 报警列表
      monitorData: {
        electric: {
          title: '智慧用电监测',
          chartId: 'dev_electric'
        },
        water: {
          title: '智慧用水监测',
          chartId: 'dev_water'
        },
        smoke: {
          title: '烟感监测',
          chartId: 'dev_smoke'
        },
        gas: {
          title: '可燃气体监测',
          chartId: 'dev_gas'
        }

      },
      showAlarmList: '全部', // 显示全部单位报警信息(全部) | 当前单位报警信息（当前）
      companyName: '',
      listQuery: {},
      alarmMsgList: [],
      officeList: []
    }
  },
  created() {
    this._getMonitorData(this.activeName[0])
    this._getAlertList()
    this._getDevMonitor()
    this._getAlertOffices()
  },
  methods: {
    // 获取左侧监测数据
    _getMonitorData() {
      const type = this.activeName[this.activeName.length - 1]
      getMonitorData({
        type
      }).then(res => {
        if (res.data) {
          const data = res.data
          this.monitorData[type] = Object.assign({}, this.monitorData[type], data)
        }
      })
    },
    _getDevMonitor() {
      getDevMonitor().then((res) => {
        if (res.data) {
          this.statisticsData = res.data.data
        }
      })
    },
    // 获取报警单位列表
    _getAlertOffices() {
      getAlertOffices().then((res) => {
        if (res.data) {
          this.officeList = res.data
        }
      })
    },
    displaySwitch(visibility) {
      if (visibility === 'alarm' && this.visibility !== 'alarm') {
        this._getAlertList()
      }
      this.visibility = visibility
    },
    // 打开报警处置页面
    viewAlarmHandle(item) {
      this.viewDevid = item.devId
      this.viewOfficeId = item.officeId
      this.isDetailResetFlag = !this.isDetailResetFlag
      this.$refs.alarmHandle.show()
    },
    // 打开历史页面
    viewHistoryRecord() {
      this.isHistoryResetFlag = !this.isHistoryResetFlag
      this.$refs.historyAlarm.show()
    },
    // 获取右侧报警信息列表
    _getAlertList(query) {
      getOfficeAlert(query).then((res) => {
        if (res.data) {
          this.alarmMsgList = res.data.alertList
        }
      })
    },
    // 打开单位详情页面
    viewUnitArchives(data) {
      this.viewOfficeId = data.id
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    filterOffice(e, type) {
      this.visibility = 'office'
      getNumOffices(Object.assign({}, {
        table: type
      }, e)).then((res) => {
        if (res.data) {
          this.officeList = res.data.numOffices
        }
      })
    },
    filterAlarmList(item) {
      this.showAlarmList = '当前'
      this.visibility = 'alarm'
      this._getAlertList({ officeId: item.id })
      if (item.longitude && item.latitude) {
        this.$refs.map.setCenter(item)
      }
    },
    switchAlarmList() {
      if (this.showAlarmList === '全部') {
        return
      } else {
        this.showAlarmList = '全部'
        this._getAlertList()
      }
    },
    // mqtt连接
    mqttMSG() {
      const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
      const topic = '104'
      const options = Object.assign({}, MQTT_OPTIONS, {
        clientId
      })
      this.mqttClient = mqtt.connect(MQTT_SERVICE, options)
      this.mqttClient.on('connect', e => {
        console.log('连接成功:')
        this.mqttClient.subscribe(`${topic}`, { qos: 1 }, error => {
          if (!error) {
            console.log(`订阅${topic}成功`)
          } else {
            console.log(`订阅${topic}失败`)
          }
        })
      })
      // 接收消息处理
      this.mqttClient.on('message', (topic, message) => {
        console.log('收到来自', topic, '的消息', message.toString())
        this.latestData = JSON.parse(message.toString())
        if (this.latestData.type === 'water') {
          this.updateData()
        } else {
          this.latestData = {}
          return
        }
        if (this.latestData.iotCardId === this.showDetailId) {
          this.latestDetailData = this.latestData
        }
      })
      // 断开发起重连
      this.mqttClient.on('reconnect', error => {
        console.log('正在重连:', error)
      })
      // 链接异常处理
      this.mqttClient.on('error', error => {
        console.log('连接失败:', error)
      })
    },
    updateData() {
      const monitorData = this.monitorData
      const latestData = this.latestData
      this.monitorData = Object.assign({}, this.monitorData, {
        alarmEquipment: monitorData.alarmEquipment + latestData.isAlert,
        hydrantAlarm: monitorData.hydrantAlarm + latestData.alarmGroup === '001' ? latestData.isAlert : 0,
        showerAlarm: monitorData.showerAlarm + latestData.alarmGroup === '002' ? latestData.isAlert : 0,
        tankAlarm: monitorData.tankAlarm + latestData.alarmGroup === '003' ? latestData.isAlert : 0,
        poolAlarm: monitorData.poolAlarm + latestData.alarmGroup === '004' ? latestData.isAlert : 0
      })
      const index = this.alarmMsgList.findIndex(item => {
        return item.devId === latestData.devId
      })
      const newData = {
        msg: latestData.msg,
        devId: latestData.devId,
        officeName: latestData.officeName,
        officeId: latestData.officeId,
        alertCount: index < 0 ? latestData.isAlert : this.alarmMsgList[index].alertCount + latestData.isAlert,
        time: latestData.alertTime
      }
      if (index < 0) {
        this.alarmMsgList.pop(newData)
      } else {
        this.$set(this.alarmMsgList, index, newData)
      }
    },
    selectType(flag) {
      this.isSelectType = flag
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
