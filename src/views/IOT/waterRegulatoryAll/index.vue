<template>
  <div class="main">
    <div class="container">
      <div class="left-container">
        <el-collapse v-model="activeName" accordion>
          <top-box :name="'electric'" :chart-data="pieChartData" :data="monitorData" @filterOffice="filterOffice" />
        </el-collapse>
        <div class="box bot">
          <ul class="list">
            <li @click="filterOffice(query={sensorType:'001',isAlert:1})">
              <div class="icon hydrant" />
              <div class="desc">
                <span class="text">室内消火栓</span>
                <span class="num-wrapper">
                  <span class="num">
                    <number-roll
                      :width="'10px'"
                      :font-size="'18px'"
                      :number="monitorData.sen1"
                      :unit="'套'"
                    />
                  </span>
                </span>
              </div>
            </li>
            <li @click="filterOffice(query={sensorType:'002',isAlert:1})">
              <div class="icon shower" />
              <div class="desc">
                <span class="text">自动水喷淋</span>
                <span class="num-wrapper">
                  <span class="num">
                    <number-roll
                      :width="'10px'"
                      :font-size="'18px'"
                      :number="monitorData.sen2"
                      :unit="'套'"
                    />
                  </span>
                </span>
              </div>
            </li>
            <li @click="filterOffice(query={sensorType:'003',isAlert:1})">
              <div class="icon tank" />
              <div class="desc">
                <span class="text">高位水箱</span>
                <span class="num-wrapper">
                  <span class="num">
                    <number-roll
                      :width="'10px'"
                      :font-size="'18px'"
                      :number="monitorData.sen3"
                      :unit="'套'"
                    />
                  </span>
                </span>
              </div>
            </li>
            <li @click="filterOffice(query={sensorType:'004',isAlert:1})">
              <div class="icon pool" />
              <div class="desc">
                <span class="text">消防水池</span>
                <span class="num-wrapper">
                  <span class="num">
                    <number-roll
                      :width="'10px'"
                      :font-size="'18px'"
                      :number="monitorData.sen4"
                      :unit="'套'"
                    />
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="center-container">
        <base-map ref="map" :office-list="officeList" @viewDetail="viewUnitDevDetail" />
      </div>
      <div class="right-container">
        <div class="search">
          <el-input v-model="companyName" placeholder="请输入您要搜索的信息" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="filterOffice(query={officeName:companyName})" />
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
            <span class="address">{{ `地址：${item.address||''}` }}</span>
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
    <history-alarm ref="historyAlarm" :is-reset-flag="isHistoryResetFlag" :dev-category="1" />
    <el-dialog
      v-if="dialogVisible"
      class="dark unitDevDetail-wrapper"
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      width="1161px"
    >
      <div name="title" class="dialog-title">{{ dialogName }}</div>
      <div class="dialog-content">
        <unit-dev-detail :office-id="viewDevOfficeId" :category="1" :category-name="'water'" />
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
import AlarmHandle from '../components/alarmHandle'
import HistoryAlarm from '../components/historyAlarm'
import UnitDevDetail from '@/components/unitDevDetail'
import { getMonitorData, getOfficeAlert, getOfficeList } from '@/api/water'
import mqtt from 'mqtt'
export default {
  components: {
    TopBox,
    BaseMap,
    NumberRoll,
    AlarmHandle,
    HistoryAlarm,
    UnitDevDetail
  },
  data() {
    return {
      isSelectType: false,
      dialogVisible: false,
      dialogName: '',
      viewDevid: '', // 打开处置页面（设备id）
      viewOfficeId: '', // 打开处置页面（单位id）| 地图单位（单位id）设备详情
      viewDevOfficeId: '', // 打开单位设备详情页面（单位id）
      isHistoryResetFlag: false, // 历史弹出页数据是否更新标志
      isDetailResetFlag: false, // 报警详情弹出页数据是否更新标志
      activeName: 'electric',
      latestData: {}, // mqtt最新数据
      visibility: 'alarm', // 显示社会单位列表 | 报警列表
      monitorData: {
        title: '智慧用水监测',
        chartId: 'waterPieChart'
      },
      pieChartData: {},
      showAlarmList: '全部', // 显示全部单位报警信息(全部) | 当前单位报警信息（当前）
      companyName: '',
      listQuery: {},
      alarmMsgList: [],
      officeList: []
    }
  },
  created() {
    this._getMonitorData()
    this._getOfficeList()
    this._getAlertList()
  },
  methods: {
    // 获取左侧监测数据
    _getMonitorData() {
      getMonitorData().then(res => {
        if (res.data) {
          const data = res.data
          this.monitorData = Object.assign({}, this.monitorData, data)
          this.pieChartData = {
            ofnum: data.ofnum, onnum: data.onnum, alnum: data.alnum
          }
        }
      })
    },
    // 获取单位列表
    _getOfficeList() {
      getOfficeList(this.listQuery).then((res) => {
        if (res.data) {
          this.officeList = res.data.data
        }
      })
    },
    displaySwitch(visibility) {
      if (visibility === 'alarm' && this.visibility !== 'alarm') {
        this._getAlertList()
      }
      this.visibility = visibility
    },
    // 打开地图单位设备详情页
    viewUnitDevDetail(data) {
      this.dialogName = data.name
      this.viewDevOfficeId = data.id
      this.dialogVisible = true
    },
    // 关闭地图单位设备详情页
    hide() {
      this.dialogVisible = false
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
        if (res.alertList) {
          this.alarmMsgList = res.alertList
        }
      })
    },
    filterOffice(query) {
      this.visibility = 'office'
      this.listQuery = query
      this._getOfficeList()
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
        alnum: monitorData.alnum + latestData.isAlert,
        sen1: monitorData.sen1 + latestData.alarmGroup === '001' ? latestData.isAlert : 0,
        sen2: monitorData.sen2 + latestData.alarmGroup === '002' ? latestData.isAlert : 0,
        sen3: monitorData.sen3 + latestData.alarmGroup === '003' ? latestData.isAlert : 0,
        sen4: monitorData.sen4 + latestData.alarmGroup === '004' ? latestData.isAlert : 0
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
