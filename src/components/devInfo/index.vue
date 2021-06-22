<template>
  <el-dialog class="devInfo" :visible.sync="dialogTreeVisible" width="800px">
    <div slot="title" class="dialog-title">{{ title }}</div>
    <div class="dialog-content">
      <div v-if="devType=='1'" class="water">
        <div class="chart-wrapper">
          <GaugeChart
            v-if="Object.keys(watPressData).length>0"
            id="watPress"
            height="100%"
            width="100%"
            :chart-data="watPressData"
          />
          <LiquidfillChart
            v-if="Object.keys(watLevelsData).length>0"
            id="watLevel"
            height="100%"
            width="100%"
            :chart-data="watLevelsData"
          />
        </div>
        <div class="chart-wrapper">
          <LineChart id="watWeek" height="100%" width="100%" :chart-data="weekChartData" />
        </div>
      </div>
      <div v-if="devType=='0'" class="electric">
        <div class="item">
          <div class="chart-wrapper">
            <BarChart id="voltage" height="100%" width="100%" :chart-data="voltagesData" />
          </div>
          <div class="chart-wrapper kChart">
            <LineChart id="voltagesTime" height="100%" width="100%" :chart-data="voltagesTimeData" />
          </div>
        </div>
        <div class="item">
          <div class="chart-wrapper">
            <BarChart id="current" height="100%" width="100%" :chart-data="currentData" />
          </div>
          <div class="chart-wrapper kChart" />
        </div>
        <div class="item">
          <div class="chart-wrapper">
            <BarChart id="temperature" height="100%" width="100%" :chart-data="temperatureData" />
          </div>
          <div class="chart-wrapper kChart" />
        </div>
        <div class="item">
          <div class="chart-wrapper">
            <BarChart
              id="residualCurrent"
              height="100%"
              width="100%"
              :chart-data="residualCurrentData"
            />
          </div>
          <div class="chart-wrapper kChart" />
        </div>
      </div>
    </div>
    <el-button size="mini" style="width: auto" @click="endMqtt()">断开连接</el-button>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import GaugeChart from '../Charts/gaugeChart'
import LiquidfillChart from '../Charts/liquidfillChart'
import LineChart from '../Charts/lineChart'
import BarChart from '../Charts/barChart'
import { mqttClient } from '../../utils/mqtt'
export default {
  name: 'DevInfo',
  components: {
    GaugeChart,
    LiquidfillChart,
    LineChart,
    BarChart
  },
  data() {
    return {
      dialogTreeVisible: false,
      title: '设备详情',
      devType: '1',
      watPressData: {
        // name: '水压',
        // value: '1',
        // min: '0',
        // max: '1.6',
        // unit: 'kPa',
        // minAlarmVal: 0.3,
        // maxAlarmVal: 1.3
      },
      watLevelsData: {
        unit: '%',
        value: 0.4
      },
      weekChartData: {
        unit: 'm',
        color: '#28BBAB',
        dataList: [
          {
            name: '水位',
            data: [1.5, 1.7, 2.0, 0.3, 0.5, 1.3, 2.5, 0.1],
            style: {
              color: '#28BBAB' // 折线图颜色
            }
          }
        ],
        xAxisData: [
          '2020-01-02',
          '2020-01-03',
          '2020-01-04',
          '2020-01-05',
          '2020-01-06',
          '2020-01-07',
          '2020-01-08'
        ]
      },
      voltagesData: {
        title: '电压当前值',
        xData: ['A相电压', 'B相电压', 'C相电压'],
        value: [239.4, 239.3, 239.4]
      },
      voltagesTimeData: {
        unit: 'V',
        color: '#28BBAB',
        legend: true,
        legendPosition: {
          left: '60px'
        },
        limith: 264,
        limitl: 187,
        minNum: 216,
        maxNum: 234,
        interval: 6,
        dataList: [
          {
            name: 'A相电压',
            data: [
              231.3,
              226.6,
              222.9,
              221.7,
              226.6,
              230.5,
              230.9,
              227,
              222.3,
              221.5,
              227,
              230.9,
              231.1,
              227.5,
              222.8,
              222.8,
              227.6,
              231.3,
              231.9,
              227.1,
              223.6,
              223.9,
              227.6,
              231.9,
              231.8,
              228.3,
              224.3,
              224.7,
              228.1,
              231.8,
              232.3,
              232.2,
              232.1,
              233.2,
              232.7,
              232.7,
              233,
              233,
              232.9,
              232.7,
              231.7,
              231.9,
              232.4,
              232.2,
              232.4,
              232.5,
              232,
              232,
              232.1,
              232,
              232.5,
              232.1,
              231.6,
              231.8,
              231.7,
              232.2,
              231.7,
              231.5,
              231.4,
              231.2,
              231.3,
              231.3,
              231.2,
              231.1,
              231.4,
              231.3,
              230.8,
              230.5,
              230.8,
              230.8,
              230.8,
              230.8,
              231.3,
              230.6,
              230.5,
              230.4,
              230.6,
              230.6,
              230.6,
              229.9,
              229.8,
              230.3,
              230.7,
              229.9,
              230.4,
              230,
              230,
              229,
              228.6,
              228.5,
              227.2,
              226.9,
              225.3,
              225.6,
              225.3,
              225.1,
              225.5,
              224.3,
              224.4,
              223.7,
              223,
              225.2,
              224.2,
              223.7,
              223,
              223.9,
              223.5,
              222.6,
              223.6,
              223.4,
              222.6,
              222.8,
              222.4,
              220.7,
              221.4,
              220.1,
              220.3,
              220.5,
              221.5,
              222.3,
              221.1
            ],
            style: {
              color: '#e8e623' // 折线图颜色
            }
          },
          {
            name: 'B相电压',
            data: [
              230.5,
              225.7,
              222,
              221,
              226.1,
              229.8,
              230.2,
              226.2,
              221.5,
              220.7,
              226.1,
              230,
              230.4,
              226.6,
              222,
              222,
              226.8,
              230.6,
              231.1,
              226.5,
              222.8,
              223.2,
              226.9,
              231.2,
              231.1,
              227.5,
              223.3,
              223.8,
              227.1,
              231,
              231.5,
              231.4,
              231.3,
              232.3,
              231.9,
              231.9,
              232.2,
              232.3,
              232,
              231.8,
              230.9,
              231,
              231.4,
              231.4,
              231.5,
              231.7,
              231.1,
              231.2,
              231.3,
              231.3,
              231.6,
              231.2,
              230.8,
              230.9,
              230.9,
              231.4,
              231.1,
              230.8,
              230.6,
              230.5,
              230.5,
              230.6,
              230.4,
              230.2,
              230.6,
              230.5,
              229.9,
              229.7,
              230.1,
              230,
              230,
              229.9,
              230.5,
              229.7,
              229.5,
              229.5,
              229.6,
              229.6,
              229.5,
              229.1,
              229,
              229.5,
              230,
              229.1,
              229.4,
              229,
              229.1,
              228.3,
              228,
              227.6,
              226.1,
              225.9,
              224.2,
              224.6,
              224.3,
              224.2,
              224.3,
              223.5,
              223.5,
              222.7,
              222,
              224.4,
              223,
              222.3,
              221.9,
              222.7,
              222,
              221.3,
              222.1,
              222.1,
              221.2,
              221.3,
              220.9,
              219.1,
              219.9,
              218.9,
              218.7,
              218.9,
              219.6,
              220.5,
              219.3
            ],
            style: {
              color: '#4dd027' // 折线图颜色
            }
          },
          {
            name: 'C相电压',
            data: [
              230.2,
              225.5,
              222,
              220.9,
              225.8,
              229.7,
              230.1,
              226,
              221.4,
              220.6,
              226,
              229.9,
              230.2,
              226.3,
              221.7,
              221.8,
              226.7,
              230.6,
              231.1,
              226.3,
              222.6,
              223,
              226.7,
              231.3,
              231,
              227.4,
              223.3,
              223.7,
              227.2,
              231,
              231.4,
              231.3,
              231.3,
              232.3,
              231.9,
              231.8,
              232.1,
              232.2,
              232,
              231.7,
              230.7,
              230.9,
              231.5,
              231.3,
              231.5,
              231.6,
              231.2,
              231.1,
              231.3,
              231.1,
              231.6,
              231.1,
              230.6,
              230.8,
              230.8,
              231.2,
              230.9,
              230.6,
              230.6,
              230.4,
              230.3,
              230.3,
              230.2,
              230.1,
              230.5,
              230.4,
              229.8,
              229.6,
              229.9,
              229.7,
              229.8,
              229.8,
              230.4,
              229.6,
              229.7,
              229.6,
              229.6,
              229.7,
              229.6,
              229,
              228.9,
              229.4,
              229.8,
              228.9,
              229.2,
              228.9,
              229,
              227.9,
              227.5,
              227.3,
              226,
              225.8,
              224.1,
              224.5,
              223.9,
              223.9,
              224.2,
              223.1,
              223,
              222.2,
              221.6,
              223.7,
              222.8,
              222.4,
              221.7,
              222.5,
              221.7,
              221.1,
              221.7,
              221.4,
              220.9,
              220.6,
              220.3,
              218.4,
              219.1,
              217.9,
              218,
              218.2,
              218.9,
              219.8,
              218.7
            ],
            style: {
              color: '#e03a1a' // 折线图颜色
            }
          }
        ],
        xAxisData: [
          '00:01',
          '00:06',
          '00:11',
          '00:16',
          '00:21',
          '00:26',
          '00:31',
          '00:36',
          '00:41',
          '00:46',
          '00:51',
          '00:56',
          '01:01',
          '01:06',
          '01:11',
          '01:16',
          '01:21',
          '01:26',
          '01:31',
          '01:36',
          '01:41',
          '01:46',
          '01:51',
          '01:56',
          '02:01',
          '02:06',
          '02:11',
          '02:16',
          '02:21',
          '02:26',
          '02:31',
          '02:36',
          '02:41',
          '02:46',
          '02:51',
          '02:56',
          '03:01',
          '03:06',
          '03:11',
          '03:16',
          '03:21',
          '03:26',
          '03:31',
          '03:36',
          '03:41',
          '03:46',
          '03:51',
          '03:56',
          '04:01',
          '04:06',
          '04:11',
          '04:16',
          '04:21',
          '04:26',
          '04:31',
          '04:36',
          '04:41',
          '04:46',
          '04:51',
          '04:56',
          '05:01',
          '05:06',
          '05:11',
          '05:16',
          '05:21',
          '05:26',
          '05:31',
          '05:36',
          '05:41',
          '05:46',
          '05:51',
          '05:56',
          '06:01',
          '06:06',
          '06:11',
          '06:16',
          '06:21',
          '06:26',
          '06:31',
          '06:36',
          '06:41',
          '06:46',
          '06:51',
          '06:56',
          '07:01',
          '07:06',
          '07:11',
          '07:16',
          '07:21',
          '07:26',
          '07:31',
          '07:36',
          '07:41',
          '07:46',
          '07:51',
          '07:56',
          '08:01',
          '08:06',
          '08:11',
          '08:16',
          '08:21',
          '08:26',
          '08:31',
          '08:36',
          '08:41',
          '08:46',
          '08:51',
          '08:56',
          '09:01',
          '09:06',
          '09:11',
          '09:16',
          '09:21',
          '09:26',
          '09:31',
          '09:36',
          '09:41',
          '09:46',
          '09:51',
          '09:56',
          '10:01'
        ]
      },
      currentData: {},
      temperatureData: {},
      residualCurrentData: {}
    }
  },
  created() {
    // this.mqttMSG()
  },
  methods: {
    hide() {
      this.dialogTreeVisible = false
    },
    show() {
      this.dialogTreeVisible = true
    },
    endMqtt() {
      mqttClient.end()
      console.log('连接断开')
    },
    mqttMSG() {
      // mqtt连接
      const topic = 'topic2'
      mqttClient.on('connect', e => {
        console.log('连接成功:')
        mqttClient.subscribe(`${topic}`, { qos: 1 }, error => {
          if (!error) {
            console.log(`订阅${topic}成功`)
          } else {
            console.log(`订阅${topic}失败`)
          }
        })
      })
      // 接收消息处理
      mqttClient.on('message', (topic, message) => {
        const mqttData = JSON.parse(message.toString())
        console.log('收到来自', topic, '的消息', message.toString())
        this.weekChartData.dataList[0].data.push(mqttData.data)
        this.weekChartData.xAxisData.push(mqttData.date)
      })
      // 断开发起重连
      mqttClient.on('reconnect', error => {
        console.log('正在重连:', error)
      })
      // 链接异常处理
      mqttClient.on('error', error => {
        console.log('连接失败:', error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  height: 100%;
  .water {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .chart-wrapper {
      flex: 1;
    }
  }
  .electric {
    width: 100%;
    .item {
      display: flex;
      height: 250px;
      .chart-wrapper {
        flex: 2;
      }
      .kChart {
        flex: 3;
      }
    }
  }
}
</style>

