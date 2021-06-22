<template>
  <div class="agent-alert">
    <div class="header">
      <span class="circle" /> 报警值守中心
    </div>
    <div class="content">
      <ul class="devTypeList">
        <li
          v-for="item in devTypeList"
          :key="item.id"
          :class="{selected: item.category===currentDevType}"
          @click="switchDevType(item.category)"
        >{{ item.name }}</li>
      </ul>
      <div class="alert-wrapper">
        <BaseTable
          :table-data="currentList"
          :table-config="tableConfig"
          :border="false"
          :table-height="'100%'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/baseTable'
import mqtt from 'mqtt'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import { MQTT_CONNECTION } from '@/utils/mqtt_config'
const idSeq = Date.now()
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      devTypeList: [
        {
          id: 1,
          name: '全部',
          category: -1
        },
        {
          id: 2,
          name: '电',
          category: 0
        },
        {
          id: 3,
          name: '水',
          category: 1
        },
        {
          id: 4,
          name: '烟感',
          category: 2
        },
        {
          id: 5,
          name: '燃气',
          category: 3
        },
        {
          id: 6,
          name: '可视化',
          category: 5
        },
        {
          id: 7,
          name: '信息传输装置',
          category: 4
        },
        {
          id: 8,
          name: '重点部位监测',
          category: 6
        }
      ],
      tableConfig: [
        {
          prop: 'officeName',
          label: '单位名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'addr',
          label: '安装位置',
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
          label: '报警时间',
          align: 'center',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return parseTime(row.createDate)
          }
        }
      ],
      alertList: [],
      currentDevType: -1,
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
    ...mapGetters(['mqttTopics']),
    currentList() {
      const list = this.alertList.filter(item => {
        if (this.currentDevType === -1) {
          return item
        } else {
          return item.category === this.currentDevType
        }
      })
      return list
    }
  },
  created() {
    this.connection = Object.assign({}, MQTT_CONNECTION, {
      clientId: `mqtt_${idSeq}`
    }) // 每次生成一个新的clientId然后创建连接
    this.createConnection()

    this.allDoSubscribe()
  },
  destroyed() {
    this.destroyConnection()
  },
  methods: {
    // 创建mqtt连接
    createConnection() {
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
          const index = this.alertList.findIndex(item => {
            return (
              item.officeId === data.officeId &&
              item.devId === data.devId &&
              item.sensorCat === data.sensorCat
            )
          })
          if (index !== -1) {
            this.alertList.splice(index, 1, data)
          } else {
            this.alertList.unshift(data)
          }
        }
        console.log(`Received message ${message} from topic ${topic}`)
      })
    },
    // 订阅主题
    doSubscribe(subscription) {
      const topic = subscription
      this.client.subscribe(topic, { qos: 0 }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        console.log('Subscribe to topics res', res)
      })
    },
    // 取消订阅
    doUnSubscribe(subscription) {
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
    destroyConnection() {
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
    allDoSubscribe() {
      this.mqttTopics.forEach(topic => {
        this.doSubscribe(topic)
      })
    },
    switchDevType(category) {
      this.currentDevType = category
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-alert {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 14px;
    font-weight: bold;
    color: #ff3f48;
    padding: 14px 10px;
    .circle {
      display: inline-block;
      margin-right: 2px;
      width: 7px;
      height: 7px;
      background: #ff3f48;
      border-radius: 50%;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    .devTypeList {
      display: flex;
      justify-content: space-around;
      li {
        min-width: 51px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        color: #fff;
        background: #141730;
        border: 1px solid #39408c;
        border-radius: 5px;
        font-size: 14px;
        padding: 0 5px;
        cursor: pointer;
        &.selected {
          background: linear-gradient(90deg, #7342fe, #3843fb);
        }
      }
    }
    .alert-wrapper {
      margin-top: 8px;
      flex: 1;
    }
  }
}
</style>
<style lang="scss">
.agent-alert {
  .alert-wrapper {
    .el-table {
      .el-table__header-wrapper {
        border-radius: 0;
      }
      .cell {
        line-height: 13px;
      }
    }
  }
}
</style>
