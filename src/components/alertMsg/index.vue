<template>
  <div>
    <AlertDetail
      :id="viewDetailId"
      ref="alertDetail"
      :is-reset-flag="isResetFlag"
      :model="model"
      :url="viewDetailUrl"
      :alert-list="allAlertList"
    />
  </div>
</template>

<script>
import AlertDetail from '@/components/alertDetail'
import mqtt from 'mqtt'
import { mapGetters } from 'vuex'
import { MQTT_CONNECTION } from '@/utils/mqtt_config'
const idSeq = Date.now()
const synth = window.speechSynthesis
export default {
  components: {
    AlertDetail
  },
  data () {
    return {
      notifyList: [],
      alertData: {},
      alertList: [],
      viewDetailId: '',
      isResetFlag: true,
      allAlertList: [],
      viewDetailUrl: '',
      model: '',
      subscription: {
        topic: '',
        qos: 0
      },
      connection: null,
      client: {
        connected: false
      }
    }
  },
  computed: {
    ...mapGetters(['officeId', 'isSubscribeElectric'])
  },
  watch: {
    isSubscribeElectric (newVal) {
      // 进入电设备页面订阅否则取消订阅
      if (newVal) {
        this.doSubscribe({
          topic: `xfs/device/electric/${this.officeId}/info`,
          qos: 0
        })
      } else {
        this.doUnSubscribe({
          topic: `xfs/device/electric/${this.officeId}/info`
        })
      }
    }
  },
  created () {
    this.connection = Object.assign({}, MQTT_CONNECTION, {
      clientId: `mqtt_${idSeq}`
    }) // 每次生成一个新的clientId然后创建连接

    if (this.officeId === 10000) {
      // 管理员（通配符）订阅所有单位 （测试用）- 10000
      // this.subscription.topic = `xfs/sys/+/alert/popup`
    } else {
      this.subscription.topic = `xfs/sys/${this.officeId}/alert/popup` // 系统报警弹窗订阅
    }
    this.createConnection()
    this.doSubscribe(this.subscription)
    // 订阅电设备
    if (this.isSubscribeElectric) {
      this.doSubscribe({
        topic: `xfs/device/electric/${this.officeId}/info`,
        qos: 0
      })
    }
  },

  unmounted () {
    this.$notify.closeAll()
    this.destroyConnection()
  },
  methods: {
    // 创建mqtt连接
    createConnection () {
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })
      this.client.on('message', (topic, message) => {
        let data = null
        if (message) {
          data = JSON.parse(message.toString())
        }
        if (this.officeId === 10000) {
          this.alertMsg(data)
        }
        switch (topic) {
          // 系统报警消息推送
          case `xfs/sys/${this.officeId}/alert/popup`:
            this.alertMsg(data)
            break
          // 电设备数据实时更新
          case `xfs/device/electric/${this.officeId}/info`:
            this.$store.dispatch('device/changeElectricLatestData', data)
        }
        console.log(`Received message ${message} from topic ${topic}`)
      })
    },
    // 订阅主题
    doSubscribe (subscription) {
      const { topic, qos } = subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        console.log('Subscribe to topics res', res)
      })
    },
    // 取消订阅
    doUnSubscribe (subscription) {
      const { topic } = subscription
      this.client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
        } else {
          console.log(`Unsubscribe ${topic} success`)
        }
      })
    },
    // 断开连接
    destroyConnection () {
      if (this.client.connected) {
        try {
          this.client.end()
          this.client = {
            connected: false
          }
          console.log('Successfully disconnected!')
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },
    // 弹出报警信息
    alertMsg (message) {
      this.$store.dispatch('device/changeAlertMsgData', message)
      if (!message) {
        this.$nextTick(() => {
          this.$notify({
            title: '告警',
            customClass: 'devAlert',
            message: '暂无信息',
            position: 'bottom-right',
            duration: 0
          })
        })
        return false
      }
      this.allAlertList.unshift(message)
      const index = this.alertList.findIndex(item => {
        return item.devId === message.devId
      })
      if (index === -1) {
        this.alertData = message
        this.alertList.push(message)
      } else {
        const data = {
          ...message,
          num: this.alertList[index].num ? this.alertList[index].num + 1 : 2
        }
        this.alertData = data
        this.alertList.splice(index, 1)
        this.alertList.push(data)
        this.notifyList[index].close()
        this.notifyList.splice(index, 1)
      }
      // 语音播放
      this.handleSpeak(this.alertData.msg)
      // 关闭报警详情弹窗（防止遮挡）
      // if (this.$refs.alertDetail) {
      //   this.$nextTick(() => {
      //     this.$refs.alertDetail.hide()
      //   })
      // }
      this.$nextTick(() => {
        const notify = this.$notify({
          title: this.alertData.title,
          customClass: 'devAlert',
          dangerouslyUseHTMLString: true,
          message: this.createdAlertHtml(this.alertData),
          position: 'bottom-right',
          duration: 0,
          showClose: false
        })
        this.notifyList.push(notify)
      })
    },
    closeMsg (data) {
      const index = this.alertList.findIndex(item => {
        return item.devId === data.devId
      })
      if (index === -1) {

      } else {
        this.alertList.splice(index, 1)
        this.notifyList[index].close()
        this.notifyList.splice(index, 1)
        this.allAlertList = this.allAlertList.filter(item => {
          return item.devId !== data.devId
        })
      }
    },
    // 查看报警信息
    viewAlertDetail (id, model, url) {
      this.isResetFlag = !this.isResetFlag
      this.viewDetailId = id
      this.viewDetailUrl = url
      this.model = model
      this.$refs.alertDetail.show()
    },
    // 语音播报的函数
    handleSpeak (text) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = text // 文字内容
      msg.lang = 'zh-CN' // 使用的语言:中文
      msg.volume = 1 // 声音音量：1
      msg.rate = 1 // 语速：1
      msg.pitch = 1 // 音高：1
      synth.speak(msg) // 播放
    },
    // 语音停止
    handleStop (e) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = e
      msg.lang = 'zh-CN'
      synth.cancel(msg)
    },
    // 创建报警内容
    createdAlertHtml (alertData) {
      return (
        <div v-show='false' ref='msgHtml' class='msg-wrapper'>
          <div class='content'>
            <span class={`devIcon devIcon_${alertData.category}`}></span>
            <i
              class='el-icon-close close'
              onClick={() => this.closeMsg(alertData)}
            ></i>
            <p class='item addr'>
              <span class='label'>位置：</span>
              <span class='text' title={alertData.addr || ''}>
                {alertData.addr || ''}
              </span>
            </p>
            <p class='item message'>
              <span class='label'>最新消息：*</span>
              <span class='text msg' title={alertData.msg || ''}>
                {alertData.msg || ''}
              </span>
            </p>
          </div>
          <div class='footer' style='display: flex;justifity-content: center;'>
            <div
              class='item'
              onClick={() => this.viewAlertDetail(alertData.devId, 'record')}
            >
              <span class='num'>{alertData.num || 1}</span>
              <span class='text'>报警次数</span>
            </div>
            <div
              class='item'
              onClick={() => this.viewAlertDetail(alertData.devId, 'record')}
            >
              <i class='el-icon-tickets' />
              <span class='text'>历史报警</span>
            </div>
            {alertData.category === 5 && alertData.url ? (
              <div
                class='item'
                onClick={() =>
                  this.viewAlertDetail(alertData.devId, 'img', alertData.url)
                }
              >
                <i class='el-icon-video-camera' />
                <span class='text'>现场图片</span>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.msg-wrapper {
  background: #170606;
  .devIcon {
    display: inline-block;
    width: 25px;
    height: 25px;
    position: absolute;
    top: 10px;
    left: 10px;
    &.devIcon_0 {
      background: url(./images/icon_electric.png) 0 0 no-repeat;
    }
    &.devIcon_1 {
      background: url(./images/icon_water.png) 0 0 no-repeat;
    }
    &.devIcon_2 {
      background: url(./images/icon_smoke.png) 0 0 no-repeat;
    }
    &.devIcon_3 {
      background: url(./images/icon_gas.png) 0 0 no-repeat;
    }
    &.devIcon_4 {
      background: url(./images/icon_infoTx.png) 0 0 no-repeat;
    }
    &.devIcon_5 {
      background: url(./images/icon_camera.png) 0 0 no-repeat;
    }
  }
}
</style>
