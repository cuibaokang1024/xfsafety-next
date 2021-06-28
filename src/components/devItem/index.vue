<template>
  <div class="devItem-wrapper" :class="{officeDetail:isDetail}">
    <div v-if="devType=== 0" class="devItem electric">
      <div class="content">
        <div class="header">{{ devData.devid }}</div>
        <div class="detail-btn" @click="viewDetail(devData)">详情</div>
        <div class="dec-text addr">{{ devData.addr || '' }}</div>
        <div class="dec-text">{{ `安装时间：${devData.instalTime ||''}` }}</div>
        <div class="dec-text">{{ `更新时间：${devData.lastRevtime || ''}` }}</div>
        <div class="data">
          <span class="item">
            <div v-if="devStatus === 3" class="icon-wrapper">
              <span class="icon icon-voltage" :class="isAlertVoltage? 'alarm':''" />
            </div>
            <div v-else class="icon-wrapper" :class="devStatus | devStatusClass">
              <span class="icon icon-voltage" />
            </div>
            <div class="text-wrapper">
              <span class="text">电压</span>
              <span class="num">
                <number-roll
                  :color="isAlertVoltage? '#ff2828':''"
                  :location="'left'"
                  :unit="'V'"
                  :number="maxVoltage"
                />
              </span>
            </div>
          </span>
          <span class="item">
            <div v-if="devStatus === 3" class="icon-wrapper">
              <span class="icon icon-electricCurrent" :class="isAlertCurrent ? 'alarm':''" />
            </div>
            <div v-else class="icon-wrapper" :class="devStatus | devStatusClass">
              <span class="icon icon-electricCurrent" />
            </div>
            <div class="text-wrapper">
              <span class="text">电流</span>
              <span class="num">
                <number-roll
                  :color="isAlertCurrent? '#ff2828':''"
                  :location="'left'"
                  :unit="'A'"
                  :number="maxCurrent"
                />
              </span>
            </div>
          </span>
          <span class="item">
            <div v-if="devStatus === 3" class="icon-wrapper">
              <span class="icon icon-temperature" :class="isAlertTemperature ? 'alarm':''" />
            </div>
            <div v-else class="icon-wrapper" :class="devStatus | devStatusClass">
              <span class="icon icon-temperature" />
            </div>
            <div class="text-wrapper">
              <span class="text">温度</span>
              <span class="num">
                <number-roll
                  :color="isAlertTemperature? '#ff2828':''"
                  :location="'left'"
                  :unit="'℃'"
                  :number="maxTemperature"
                />
              </span>
            </div>
          </span>
          <span class="item">
            <div v-if="devStatus === 3" class="icon-wrapper">
              <span
                class="icon icon-residualCurrent"
                :class="isAlertResidualCurrent? 'alarm':''"
              />
            </div>
            <div v-else class="icon-wrapper" :class="devStatus | devStatusClass">
              <span class="icon icon-residualCurrent" />
            </div>
            <div class="text-wrapper">
              <span class="text">剩余电流</span>
              <span class="num">
                <number-roll
                  :color="isAlertResidualCurrent? '#ff2828':''"
                  :location="'left'"
                  :unit="'mA'"
                  :number="residualCurrent"
                />
              </span>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div v-if="devType === 1" class="devItem water">
      <div class="content">
        <div class="header">{{ devData.devid }}</div>
        <div class="detail-btn" @click="viewDetail(devData)">详情</div>
        <div class="dec-text">{{ devData.location }}</div>
        <div class="dec-text">{{ `安装时间：${devData.instalTime || devData.createDate ||''}` }}</div>
        <div class="dec-text">{{ `更新时间：${devData.lastTime || devData.updateDate || ''}` }}</div>
        <div
          v-if="devData.sensorType === '001'||devData.sensorType==='002'"
          class="indoor-container"
        >
          <div class="box mpa">
            <span>水压</span>
            <span>{{ `${devData.upDataValue||0}${devData.unit}` }}</span>
          </div>
          <div class="box item">
            <span
              class="icon icon-indoor"
              :class="devStatus | devStatusClass"
              @click="viewAlertRecord(type='',id=devData.iotCardId,location=devData.location)"
            />
          </div>
        </div>
        <div v-else class="pool-container">
          <div class="tent">
            <div class="tent-item">
              <span class="textleft">百分比：</span>
              <span class="textright">{{ `${devData.upDataPercent||0}%` }}</span>
            </div>
            <div class="tent-item">
              <span class="textleft">高&nbsp;&nbsp;&nbsp;度：</span>
              <span class="textright">{{ `${devData.upDataValue||0}m` }}</span>
            </div>
            <div class="tent-item">
              <span class="textleft">立方米：</span>
              <span class="textright">{{ `${devData.upDataVolume||0}m³` }}</span>
            </div>
          </div>
          <div class="box item">
            <span
              class="icon icon-pool"
              :class="devStatus | devStatusClass"
              @click="viewAlertRecord(type='',id=devData.iotCardId,location=devData.location)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="devType === 2" class="devItem smoke">
      <div class="content">
        <div class="header">{{ devData.devid }}</div>
        <div class="text">{{ devData.location || '' }}</div>
        <div class="text">{{ `安装时间：${devData.instalTime || devData.createDate ||''}` }}</div>
        <div class="text">{{ `更新时间：${devData.lastTime || devData.updateDate || ''}` }}</div>
        <div v-if="devData.sensorCat === '2'">
          <div class="degree">
            <div class="degree-item">
              <span>{{ `烟雾浓度：${devData.concentration || 0}dB/m` }}</span>
            </div>
            <div class="degree-item">
              <span>{{ `温度值：${devData.temperature || 0}℃` }}</span>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <span
                class="icon icon-battery-2"
                :class="devData.devBattery || 0 | getBatterylClass"
              />
              <span class="num">{{ `${devData.devBattery || 0}%` }}</span>
            </div>
            <div class="row-item">
              <el-tooltip popper-class="dev-tip" effect="dark" content="传感器电池" placement="top-end">
                <span
                  class="icon icon-battery"
                  :class="devData.lowPowerAlert===0 ? 'normal' : 'danger'"
                />
              </el-tooltip>
              <span
                class="num"
                :class="{alarm: devData.lowPowerAlert===1}"
              >{{ devData.lowPowerAlert===0 ? '正常' : '低电' }}</span>
            </div>
            <div class="row-item">
              <span
                class="icon icon-wifi"
                :class="devData.devSignal || 0 | getSignalClass(devSmokeType='HM')"
              />
              <span class="num">信号强度</span>
            </div>
            <div class="row-item">
              <el-tooltip popper-class="dev-tip" effect="dark" content="烟感" placement="top-end">
                <span
                  class="icon icon-smoke"
                  :class="devStatus | devStatusClass"
                  @click="viewAlertRecord(type='',id=devData.iotCardId,location=devData.location)"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
        <div v-if="devData.sensorCat === '3'">
          <div class="row">
            <div class="row-item">
              <span
                class="icon icon-battery-2"
                :class="devData.devBattery || 0 | getBatterylClass"
              />
              <span class="num">{{ `${devData.devBattery || 0}%` }}</span>
            </div>
            <div class="row-item">
              <span
                class="icon icon-wifi"
                :class="devData.devSignal || 0 | getSignalClass(devSmokeType='JD')"
              />
              <span class="num">信号强度</span>
            </div>
            <div class="row-item">
              <el-tooltip popper-class="dev-tip" effect="dark" content="烟感" placement="top-end">
                <span
                  class="icon icon-smoke"
                  :class="devStatus | devStatusClass"
                  @click="viewAlertRecord(type='',id=devData.iotCardId,location=devData.location)"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
        <div v-if="devData.sensorCat === '4'">
          <div class="row">
            <div class="row-item">
              <span
                class="icon icon-wifi"
                :class="devData.devSignal || 0 | getSignalClass(devSmokeType='JD')"
              />
              <span class="num">信号强度</span>
            </div>
            <div class="row-item">
              <el-tooltip popper-class="dev-tip" effect="dark" content="烟感" placement="top-end">
                <span
                  class="icon icon-smoke"
                  :class="devStatus | devStatusClass"
                  @click="viewAlertRecord(type='',id=devData.iotCardId,location=devData.location)"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
        <div v-if="devData.sensorCat === '1'">
          <div class="box">
            <div class="box-item-special">
              <div class="item-special" style="height: 50px;">
                <span class="num">NB电池</span>
                <span
                  class="icon icon-battery-2"
                  :class="devData.devBattery ||0 | getBatterylClass"
                />
                <span class="num">{{ `${devData.devBattery || 0}%` }}</span>
              </div>
              <div class="item-special column">
                <div class="num">传感器电池</div>
                <div class="battery-container">
                  <span
                    class="icon icon-battery"
                    :class="devData.lowPowerAlert===0 ? 'normal' : 'danger'"
                  />
                  <span
                    class="num"
                    :class="{alarm: devData.lowPowerAlert===1}"
                  >{{ devData.lowPowerAlert===0 ? '正常' : '低电' }}</span>
                </div>
              </div>
            </div>
            <div class="box-item" style="width: 78px;">
              <span class="num" style="margin-bottom: 16px;">信号强度</span>
              <span
                class="icon icon-wifi"
                :class="devData.devSignal | getSignalClass(devSmokeType='JD')"
              />
            </div>
            <div class="box-item" style="width: 86px;">
              <el-tooltip popper-class="dev-tip" effect="dark" content="烟感" placement="top-end">
                <span
                  class="icon icon-smoke"
                  :class="devStatus | devStatusClass"
                  @click="viewAlertRecord(type='',id=devData.iotCardId,location=devData.location)"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="devType === 3" class="devItem gas">
      <div class="content">
        <div class="header">{{ devData.devId }}</div>
        <div class="dec-text">{{ devData.location }}</div>
        <div class="dec-text">{{ `安装时间：${devData.instalTime || devData.createDate ||''}` }}</div>
        <div class="dec-text">{{ `更新时间：${devData.lastTime || devData.updateDate || ''}` }}</div>
        <div class="item">
          <div class="item-left">
            <div v-if="devData.sensorCat!=='0'" class="item-left-container">
              <div class="text">气体浓度:</div>
              <div class="num">{{ `${devData.contrat||0}${devData.unitName||'ppm'}` }}</div>
            </div>
            <div v-if="devData.sensorCat==='4'" class="item-left-container">
              <div class="text">温度值:</div>
              <div class="num">{{ `${devData.temperature||0}℃` }}</div>
            </div>
            <div v-if="devData.sensorCat==='1'" class="item-left-container">
              <div class="text">机械手状态:</div>
              <div v-if="devData.isFault===1">
                <span class="fault" />
              </div>
              <div v-else class="status-wrapper">
                <el-tooltip
                  :disabled="devData.maniNum===3?false : true"
                  popper-class="dev-tip"
                  effect="dark"
                  content="故障"
                  placement="top-end"
                >
                  <el-switch
                    v-model="manipulatorStatus"
                    active-color="#00a0e9"
                    :disabled="devStatus===2||devData.maniNum===3||!devData.imei?true:volumeDisabled"
                    @change="changeManipulatorStatus"
                  />
                </el-tooltip>
              </div>
            </div>
            <div v-if="devData.sensorCat==='4'" class="item-left-container">
              <div class="text">电池电量:</div>
              <span class="icon icon-battery-2" :class="devData.battery ||0 | getBatterylClass" />
              <span class="num">{{ `${devData.battery || 0}%` }}</span>
            </div>
            <div v-if="devData.sensorCat==='1'" class="item-left-container">
              <div class="text">音量大小:</div>
              <div class="volume-wrapper">
                <el-slider
                  v-model="volume"
                  input-size="mini"
                  :min="0"
                  :max="15"
                  :disabled="devStatus===2||!devData.imei?true:volumeDisabled"
                  @change="changeVolume"
                />
              </div>
            </div>
          </div>
          <div v-if="devData.sensorCat!=='0'" class="item-middle">
            <span class="num" style="margin-bottom: 16px;">信号强度</span>
            <div
              class="icon icon-wifi"
              :class="devData.devSignal || -51 | getSignalClass(devGasType='RQ1')"
            />
          </div>
          <div class="item-right">
            <div class="item-right-container">
              <el-tooltip popper-class="dev-tip" effect="dark" content="燃气" placement="top-end">
                <span
                  class="icon icon-gas"
                  :class="devStatus | devStatusClass"
                  @click="viewAlertRecord(type='',id=devData.devId,location=devData.location)"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="devType=== 4" class="camera">
      <div class="content">
        <p class="title">{{ devData.location||'未填写位置' }}</p>
        <p class="sensor">{{ devData.sensor }}</p>
        <p class="installTime">{{ `安装时间：${devData.installTime}` }}</p>
        <p class="createTime">{{ `更新时间：${devData.lastTime}` }}</p>
        <div class="btnWrapper">
          <el-button
            v-if="devData.gbsEnable!==1"
            class="btn-camera"
            icon="el-icon-video-camera"
            type="success"
            round
          >
            <a
              :href="`videoclient://?id=${devData.id}&dev_name=${devData.devName}&ip=${devData.ip}&port=${devData.port}&login_name=${devData.loginName}&login_pass=${devData.loginPass}`"
              class="detail"
            >网络摄像机</a>
          </el-button>
          <el-button
            v-if="devData.gbsEnable===1"
            icon="el-icon-video-camera"
            @click="playVideo(devData)"
          >实时视频</el-button>
          <el-button
            class="btn-record"
            icon="el-icon-tickets"
            type="success"
            round
            @click="viewAlertRecord(type='',id=devData.matchId,location=devData.location)"
          >报警记录</el-button>
        </div>
      </div>
    </div>
    <div v-if="devType=== 5" class="devItem infotxOffice">
      <div class="content">
        <div class="header">城市远程监控</div>
        <div class="dec-text">{{ devData.location }}</div>
        <div class="dec-text">{{ `安装时间：${devData.instalTime || devData.createDate || ''}` }}</div>
        <div class="dec-text">{{ `更新时间：${devData.lastTime || devData.updateDate || ''}` }}</div>
        <div class="status">
          <div class="item" @click="viewAlertRecord(id = devData.devId, cat = '1')">
            <el-tooltip popper-class="dev-tip" effect="dark" content="火警" placement="top-end">
              <span class="icon" :class="devStatus | devStatusClass" />
            </el-tooltip>
            <b class="num">{{ devData.person.alertNum }}</b>
          </div>
          <div class="item" @click="viewAlertRecord(id = devData.devId, cat = '2')">
            <el-tooltip popper-class="dev-tip" effect="dark" content="故障" placement="top-end">
              <span
                class="icon"
                :class="devStatus === 2 ? 'icon-info-offline' : devData.person.faultNum <= 0 ? 'icon-info-normal' : 'icon-info-trip'"
              />
            </el-tooltip>
            <b class="num">{{ devData.person.faultNum }}</b>
          </div>
        </div>
      </div>
    </div>
    <div v-if="devType=== 6" class="devItem keyParts">
      <div class="content">
        <div class="header">{{ devData.name }}</div>
        <div class="dec-text">{{ devData.location }}</div>
        <div class="dec-text">{{ `安装时间：${devData.instalTime || devData.createDate ||''}` }}</div>
        <div class="dec-text">{{ `更新时间：${devData.lastTime || devData.updateDate || ''}` }}</div>
        <div class="item">
          <span class="zone" @click="viewZone(devData.account)">{{ `防区：${devData.totalNum}个` }}</span>
          <span class="alarm">
            {{ `报警：${devData.alertNum}个` }}
            <span class="icon" />
          </span>
        </div>
        <el-button
          round
          type="primary"
          @click="viewAlertRecord(type='',id=devData.account,location=devData.location)"
        >报警记录</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { volumeAdjust, maniSwitch } from '@/api/gas'
import './style/index.scss'
import { debounce, has } from '@/utils'

import NumberRoll from '@/components/numberRoll'

export default {
  name: 'DevItem',
  filters: {
    getSignalClass (signal, type) {
      if (!signal) {
        return 'signal-0'
      }
      let percent = 0
      if (type) {
        if (type === 'HM') {
          percent = (Math.abs(signal + 113) / 113) * 10
        } else if (type === 'JD') {
          percent = (signal / 31) * 10
        } else if (type === 'RQ1') {
          percent = (Math.abs(signal + 110) / 59) * 10
        }
      }
      let className = ''
      if (percent < 1) {
        className = 'signal-0'
      }
      if (percent >= 1 && percent < 4) {
        className = 'signal-1'
      }
      if (percent >= 4 && percent < 6) {
        className = 'signal-2'
      }
      if (percent >= 6 && percent < 8) {
        className = 'signal-3'
      }
      if (percent >= 8 && percent < 9) {
        className = 'signal-4'
      }
      if (percent >= 9) {
        className = 'signal-5'
      }
      return className
    },
    getBatterylClass (num) {
      let className = ''
      if (num === 0) {
        className = 'battery-0'
      }
      if (num > 0 && num <= 20) {
        className = 'battery-1'
      }
      if (num > 20 && num <= 40) {
        className = 'battery-2'
      }
      if (num > 40 && num <= 60) {
        className = 'battery-3'
      }
      if (num > 60 && num <= 80) {
        className = 'battery-4'
      }
      if (num > 80 && num <= 100) {
        className = 'battery-5'
      }
      return className
    },
    devStatusClass (devStatus) {
      let className = ''
      if (devStatus === 1) {
        className = 'normal'
      }
      if (devStatus === 2) {
        className = 'offline'
      }
      if (devStatus === 3) {
        className = 'alarm'
      }
      if (devStatus === 4) {
        className = 'trip'
      }
      if (devStatus === 5) {
        className = 'fault'
      }
      return className
    }
  },
  components: {
    NumberRoll
  },
  props: {
    devData: {
      type: Object,
      default: () => {}
    },
    devType: {
      type: Number,
      default: 0
    },
    devStatus: {
      type: [String, Number],
      default: ''
    },
    volumeDisabled: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      volume: 0,
      oldVolume: 0,
      manipulatorStatus: true,
      newManipulatorStatus: null,
      lock: false,
      volumeLock: false
    }
  },
  computed: {
    /**
    * 判断电设备各参数是否报警
    * 0 电压 1 电流 2 剩余电流 3 电压
    */
    isAlertVoltage () {
      if (!has(this.devData, 'person.catAlert')) {
        return false
      }
      return this.devData.person.catAlert.includes(0)
    },
    isAlertCurrent () {
      if (!has(this.devData, 'person.catAlert')) {
        return false
      }
      return this.devData.person.catAlert.includes(1)
    },
    isAlertTemperature () {
      if (!has(this.devData, 'person.catAlert')) {
        return false
      }
      return this.devData.person.catAlert.includes(3)
    },
    isAlertResidualCurrent () {
      if (!has(this.devData, 'person.catAlert')) {
        return false
      }
      return this.devData.person.catAlert.includes(2)
    },
    /**
    * 获取电设备各参数当前值（取最大值）
    * 0 电压 1 电流 2 剩余电流 3 电压
    */

    maxVoltage () {
      if (!has(this.devData, 'person.catData.0')) {
        return 0
      }
      return this.formatElectricValue(this.devData.person.catData[0])
    },
    maxCurrent () {
      if (!has(this.devData, 'person.catData.1')) {
        return 0
      }
      return this.formatElectricValue(this.devData.person.catData[1])
    },
    maxTemperature () {
      if (!has(this.devData, 'person.catData.2')) {
        return 0
      }
      return this.formatElectricValue(this.devData.person.catData[3])
    },
    residualCurrent () {
      if (!has(this.devData, 'person.catData.3')) {
        return 0
      }
      return this.formatElectricValue(this.devData.person.catData[2])
    }
  },
  created () {
    if (this.devType === 3) {
      this.volume = this.devData.volume | 0
      if (this.devData.maniNum === 0 || this.devData.maniNum === 4) {
        this.manipulatorStatus = false
      } else if (this.devData.maniNum === 1 || this.devData.maniNum === 3) {
        this.manipulatorStatus = true
      } else {
        this.manipulatorStatus = false
      }
    }
  },
  methods: {
    // 格式化电设备参数置
    formatElectricValue (value) { // 限制超出三位小数保留三位
      const reg = /^(([^0][0-9]+|0)\.([0-9]{3,}))$/
      let data = Math.max.apply(Math, value)
      if (data && reg.test(data)) {
        data = Number(data.toFixed(3))
      }
      return data
    },
    // 设置燃气设备音量
    changeVolume (volume) {
      this.oldVolume = this.devData.volume
      if (this.volumeLock) {
        this.volume = this.oldVolume
        return false
      }
      this.volumeLock = true
      volumeAdjust({
        imei: this.devData.imei,
        volume
      })
        .then(res => {
          if (res.data.result) {
            this.volume = volume
            this.oldVolume = volume
            this.$message({
              message: '设置音量成功',
              type: 'success'
            })
            this.volumeLock = false
          } else {
            this.volume = this.oldVolume
            this.$message({
              message: '设置音量失败',
              type: 'info'
            })
            this.volumeLock = false
          }
        })
        .catch(() => {
          this.volume = this.oldVolume
          this.volumeLock = false
        })
    },
    changeManipulatorStatus (manipulatorStatus) {
      if (!this.lock) {
        this.newManipulatorStatus = manipulatorStatus
      }
      this.manipulatorStatus = !this.newManipulatorStatus
      this.lock = true
      this.changemaniNum()
    },
    // 设置燃气设备机械手状态
    changemaniNum: debounce(
      function () {
        let operate = 0
        let msg = '关闭'
        if (this.newManipulatorStatus) {
          operate = 1
          msg = '打开'
        }
        maniSwitch({
          imei: this.devData.imei,
          operate
        })
          .then(res => {
            if (res.data.result) {
              this.manipulatorStatus = this.newManipulatorStatus
              this.$message({
                message: `${msg}机械手成功`,
                type: 'success'
              })
              this.lock = false
            } else {
              this.manipulatorStatus = !this.newManipulatorStatus
              this.$message({
                message: `${msg}机械手失败`,
                type: 'info'
              })
            }
          })
          .catch(() => {
            this.manipulatorStatus = !this.newManipulatorStatus
          })
      },
      600,
      true
    ),
    // 查看详情
    viewDetail (devData) {
      this.$emit('viewDetail', devData)
    },
    playVideo (data) {
      this.$emit('playVideo', data)
    },
    // 查看报警记录
    viewAlertRecord (type, id, location) {
      if (type !== '') {
        this.$emit('viewAlertRecord', type, id, location)
      } else {
        this.$emit('viewAlertRecord', id, location)
      }
    },
    // 查看防区
    viewZone (account) {
      this.$emit('viewZone', account)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
