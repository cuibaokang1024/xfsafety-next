<template>
  <div class="detail-wrapper">
    <ul class="select-content">
      <li v-for="item in paramList" :key="item.id">
        <span
          :class="{ selected: visibility === item.name }"
          class="text"
          @click.prevent="selectParme(item)"
        >{{ item.text }}</span>
        <span class="line" />
      </li>
    </ul>
    <div class="content">
      <transition name="switch">
        <el-container v-if="visibility==='basicParame'" class="basicParame box">
          <el-aside width="200px">
            <div class="dev-info">
              <ul>
                <li class="voltage">
                  电压
                  <div v-if="voltageBarChartData" class="lineData">
                    <span v-for="(item,index) in voltageBarChartData" :key="index">
                      <number-roll
                        :style="{color:item.isAlert? '#ff2828':''}"
                        :width="'8px'"
                        :number="item.data"
                        :unit="item.unit"
                      />
                    </span>
                  </div>
                </li>
                <li class="temperature">
                  温度
                  <div v-if="temperatureBarChartData" class="lineData">
                    <span v-for="(item,index) in temperatureBarChartData" :key="index">
                      <number-roll
                        :style="{color:item.isAlert? '#ff2828':''}"
                        :width="'8px'"
                        :number="item.data"
                        :unit="item.unit"
                      />
                    </span>
                  </div>
                </li>
                <li class="circuitBreaker">断路器</li>
                <li class="tripStatus">
                  <el-switch v-model="tripStatus" />
                </li>
                <li class="current">
                  电流
                  <div v-if="currentBarChartData" class="lineData">
                    <span v-for="(item,index) in currentBarChartData" :key="index">
                      <number-roll
                        :style="{color:item.isAlert? '#ff2828':''}"
                        :width="'8px'"
                        :number="item.data"
                        :unit="item.unit"
                      />
                    </span>
                  </div>
                </li>
                <li class="residualCurrent">
                  剩余电流
                  <div v-if="residualCurrentBarChartData" class="lineData">
                    <span>
                      <number-roll
                        :style="{color:residualCurrentBarChartData[0].isAlert? '#ff2828':''}"
                        :width="'8px'"
                        :number="residualCurrentBarChartData[0].data"
                        :unit="residualCurrentBarChartData[0].unit"
                      />
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </el-aside>
          <el-main>
            <el-container v-if="textFlag" class="section1">
              <el-main>
                <!-- <div class="left">
                  <el-date-picker
                    v-model="powerDate"
                    type="date"
                    class="powerDateSelect"
                    placeholder="选择日期"
                  />
                  <div class="text">
                    <span>总电能</span>
                    <span class="num">3489kw●h</span>
                  </div>
                </div> -->
                <div class="line" />
                <div>
                  <ul class="right">
                    <li v-for="item in devBasParme" :key="item.id">
                      <span class="labelText">{{ `${item.name}：` }}</span>
                      <span
                        v-if="item.value==='status'"
                        class="data"
                      >{{ devData[item.value]===0?'在线':'离线' }}</span>
                      <span v-else class="data">{{ devData[item.value] }}</span>
                    </li>
                  </ul>
                </div>
              </el-main>
            </el-container>
            <el-container class="alert-wrapper">
              <el-header>报警信息</el-header>
              <el-main>
                <base-table
                  class="table-wrapper"
                  :border="false"
                  :table-data="alertList"
                  :table-height="'250px'"
                  height="100%"
                  :table-config="alertConfig"
                >
                  <!-- <el-table-column
                    label="建议处置方案"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template slot-scope="{}">
                      <el-button size="mini" type="primary" round>查看</el-button>
                    </template>
                  </el-table-column> -->
                </base-table>
              </el-main>
            </el-container>
            <el-container class="section2">
              <el-button type="primary" icon="el-icon-download" size="mini">数据导出</el-button>
              <div class="dateSelect">
                <el-select
                  v-model="bpSelectedDate"
                  class="queryDateSelect"
                  @change="((val)=>{selectDate(val,'basicParame')})"
                >
                  <el-option
                    v-for="item in dates"
                    :key="item"
                    :label="item | formatTime"
                    :value="item"
                  />
                </el-select>
              </div>
            </el-container>
            <el-container class="section3">
              <div v-if="voltageData" class="chart-wraper">
                <LineChart
                  id="voltagesTime"
                  height="100%"
                  width="100%"
                  :chart-data="voltageLineChartData"
                />
              </div>
            </el-container>
            <el-container class="section3">
              <div v-if="currentData" class="chart-wraper">
                <LineChart
                  id="currentsTime"
                  height="100%"
                  width="100%"
                  :chart-data="currentLineChartData"
                />
              </div>
            </el-container>
            <el-container class="section3">
              <div v-if="temperatureData" class="chart-wraper">
                <LineChart
                  id="temperaturesTime"
                  height="100%"
                  width="100%"
                  :chart-data="temperatureLineChartData"
                />
              </div>
            </el-container>
            <el-container class="section3">
              <div v-if="residualCurrentData" class="chart-wraper">
                <LineChart
                  id="residualCurrentsTime"
                  height="100%"
                  width="100%"
                  :chart-data="residualCurrentLineChartData"
                />
              </div>
            </el-container>
          </el-main>
        </el-container>
      </transition>
      <transition name="switch">
        <el-container v-if="visibility==='powerParame'" class="powerParame box">
          <el-header>
            <div class="dateFlag">
              <el-button
                size="mini"
                type="primary"
                :class="{slected: dateFlag===3}"
                @click="changeDateFlag(flag=3)"
              >日</el-button>
              <el-button
                size="mini"
                type="primary"
                :class="{slected: dateFlag===2}"
                @click="changeDateFlag(flag=2)"
              >周</el-button>
              <el-button
                size="mini"
                type="primary"
                :class="{slected: dateFlag===1}"
                @click="changeDateFlag(flag=1)"
              >月</el-button>
            </div>
            <div v-if="dateFlag===3" class="dateSelect">
              <el-select
                v-model="ppSelectedDate"
                class="queryDateSelect"
                @change="((val)=>{selectDate(val,'powerParame')})"
              >
                <el-option
                  v-for="item in dates"
                  :key="item"
                  :label="item | formatTime"
                  :value="item"
                />
              </el-select>
            </div>
          </el-header>
          <el-main>
            <div v-if="elecEnergyData" class="chart-wraper">
              <LineChart
                id="powerTime"
                height="100%"
                width="100%"
                :chart-data="elecEnergyLineChartData"
                :latest-data="latestElecEnergyData"
              />
            </div>
          </el-main>
        </el-container>
      </transition>
      <transition name="switch">
        <el-container v-if="visibility==='otherParame'" class="otherParame box">
          <el-header>
            <div class>
              参数类型
              <el-select
                v-model="otherParameType"
                class="paramSelect"
                placeholder="请选择参数"
                @change="changeOtherParameType"
              >
                <el-option
                  v-for="item in otherParameOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="dateSelect">
              <el-select
                v-model="opSelectedDate"
                class="queryDateSelect"
                @change="((val)=>{selectDate(val,'otherParame')})"
              >
                <el-option
                  v-for="item in dates"
                  :key="item"
                  :label="item | formatTime"
                  :value="item"
                />
              </el-select>
            </div>
          </el-header>
          <el-main>
            <div v-if="otherParamData" class="chart-wraper">
              <LineChart
                id="otherTime"
                height="100%"
                width="100%"
                :chart-data="otherParamLineChartData"
                :latest-data="latestOtherParamData"
              />
            </div>
          </el-main>
        </el-container>
      </transition>
      <transition name="switch">
        <el-container v-if="visibility==='weekly'" class="weekly box">
          <ul class="list">
            <li @click="viewReport">
              <span class>周报：2020/07/01-2020/07/07</span>
              <span class="alertNum">
                告警
                <span class="num">200</span>次
              </span>
            </li>
          </ul>
        </el-container>
      </transition>
      <transition name="switch">
        <el-container v-if="visibility==='monthly'" class="monthly box">
          <ul class="list">
            <li @click="viewReport">
              <span class>月报：2020/07/01-2020/07/31</span>
              <span class="alertNum">
                告警
                <span class="num">200</span>次
              </span>
            </li>
          </ul>
        </el-container>
      </transition>
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="electricReport dark"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="828px"
    >
      <div slot="title" class="dialog-title" />
      <div class="dialog-content">
        <dev-electric-report />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
// const BAR_WIDTH = '40'
const LINE_COLOE = ['#f79407', '#50b432', '#f45b5b', '#7cb5ec']
import LineChart from '../Charts/lineChart'
import BaseTable from '@/components/baseTable'
import NumberRoll from '@/components/numberRoll'
import DevElectricReport from '@/components/devElectricReport'
import { timeDifference, getDay, parseTime /* deepClone*/ } from '@/utils'
import {
  getAlertNum,
  getElecEnergy,
  getVoltage,
  getElectricCurrent,
  getTemperature,
  getResidualCurrent,
  getOtherParam,
  getOtherType,
  getElectricAlarmRecord
} from '@/api/electric'

export default {
  name: 'DevInfo',
  components: {
    LineChart,
    BaseTable,
    DevElectricReport,
    NumberRoll
  },
  filters: {
    formatTime(date) {
      return date.replace('-', '月') + '日'
    }
  },
  props: {
    devData: {
      type: Object,
      default: () => {}
    },
    latestData: {
      type: Object,
      default: () => {}
    },
    textFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visibility: 'basicParame', // 页面当前要显示参数
      dates: [], // 包括今日前一周的日期
      dialogVisible: false,
      nowDate: '', // 当前日期
      bpSelectedDate: '', // 基本参数查询日期
      ppSelectedDate: '', // 电能参数查询日期
      dateFlag: 3,
      opSelectedDate: '', // 其他参数查询日期
      otherParameType: '0', // 其他参数查询类型
      alarmData: [],
      otherParameOptions: [],
      alertData: [],
      tripStatus: true, // 脱扣状态
      alertConfig: [
        // {
        //   prop: 'alertLine',
        //   label: '报警线路',
        //   align: 'center',
        //   width: '150%'
        // },
        {
          prop: 'sensor',
          label: '报警类型',
          align: 'center',
          width: ''
        },
        {
          prop: 'msg',
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
          label: '报警时间',
          align: 'center',
          width: ''
        }

      ],
      devBasParme: [
        {
          name: '设备编号',
          value: 'devid'
        },
        {
          name: '最新数据',
          value: 'lastRevtime'
        },
        {
          name: '安装位置',
          value: 'addr'
        },
        {
          name: '报警手机',
          value: 'alertTel'
        },
        {
          name: '启用日期',
          value: 'instalTime'
        }
      ],
      baseBarChartData: Object.freeze({
        title: '电压当前值',
        yAxis: {
          color: '#000',
          splitLine: true,
          axisTick: true,
          unit: ''
        },
        xAxis: {
          color: '#000',
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            color: '#fff'
          },
          axisTick: true
        },
        grid: {
          left: '',
          top: '30',
          right: '0',
          bottom: '',
          containLabel: true
        },
        serieList: []
      }),
      alertList: [],
      powerDate: '', // 电能查询日期
      voltageData: null,
      currentData: null,
      temperatureData: null,
      residualCurrentData: null,
      elecEnergyData: null,
      otherParamData: null,
      latestVoltageData: null,
      latestCurrentData: null,
      latestTemperatureData: null,
      latestResidualCurrentData: null,
      latestElecEnergyData: null,
      latestOtherParamData: null,
      otherDatas: null,
      listQuery: {
        devId: '',
        time: '',
        line: '',
        page: 1,
        pageSize: 5
      }
    }
  },
  computed: {
    paramList() {
      const type = this.devData.sensorCat
      const list = [
        {
          id: 0,
          name: 'basicParame',
          text: '基本电参数'
        },
        {
          id: 4,
          name: 'weekly',
          text: '周报'
        },
        {
          id: 5,
          name: 'monthly',
          text: '月报'
        }
      ]
      if (type === '0056' || type === '0070' || type === '00701') {
        list.splice(1, 0, {
          id: 1,
          name: 'powerParame',
          text: '电力检测参数'
        })
      }
      if (type === '0056') {
        list.splice(2, 0, {
          id: 2,
          name: 'otherParame',
          text: '其他参数'
        })
      }
      return list
    },
    voltageBarChartData() {
      return this.formatBarChartData('电压', 'V', this.voltageData)
    },
    voltageLineChartData() {
      return this.formatLineChartData('V', this.voltageData)
    },
    currentBarChartData() {
      return this.formatBarChartData('电流', 'A', this.currentData)
    },
    currentLineChartData() {
      return this.formatLineChartData('A', this.currentData)
    },
    temperatureBarChartData() {
      return this.formatBarChartData('温度', '℃', this.temperatureData)
    },
    temperatureLineChartData() {
      return this.formatLineChartData('℃', this.temperatureData)
    },
    residualCurrentBarChartData() {
      return this.formatBarChartData(
        '剩余电流',
        'mA',
        this.residualCurrentData
      )
    },
    residualCurrentLineChartData() {
      return this.formatLineChartData('mA', this.residualCurrentData)
    },
    otherParamLineChartData() {
      return this.formatLineChartData('A', this.otherParamData)
    },
    elecEnergyLineChartData() {
      const grid = {
        left: 100,
        right: 20,
        bottom: 20,
        top: 30
      }
      return this.formatLineChartData('kW·h', this.elecEnergyData, grid)
    }
  },
  watch: {
    latestData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        if (newVal && this.nowDate === this.listQuery.time) {
          this.updateData()
        }
      }
    }
  },
  created() {
    this.listQuery.devId = this.devData.devid
    this.listQuery.time = parseTime(new Date(), '{m}-{d}')
    this._getAlertNum()
    this.initData()
    this.getWeekDate()
    this.initTime()
    this._getElectricAlarmRecord()
  },
  methods: {
    hide() {
      this.dialogVisible = false
    },
    show() {
      this.dialogVisible = true
    },
    selectParme(item) {
      if (this.visibility === item.name) {
        return
      }
      this.visibility = item.name
      if (item.name === 'basicParame') {
        this.listQuery.time = this.bpSelectedDate
      }
      if (item.name === 'powerParame') {
        this.listQuery.time = this.ppSelectedDate
      }
      if (item.name === 'otherParame') {
        this.listQuery.time = this.opSelectedDate
      }
      this.initData()
    },
    _getAlertNum() {
      getAlertNum({
        devId: this.devData.devid
      }).then(res => {
        if (res.data) {
          this.alarmData = res.data
        }
      })
    },
    // 初始化设备数据
    initData() {
      if (this.visibility === 'basicParame') {
        // 基本电参数
        // const detailType = this.devData.type
        // if (detailType.includes('0,')) {
        //   this._getVoltage()
        // }
        // if (detailType.includes('1,')) {
        //   this._getElectricCurrent()
        // }
        // if (detailType.includes('3,')) {
        //   this._getTemperature()
        // }
        // if (detailType.includes('2,')) {
        //   this._getResidualCurrent()
        // }
        this._getVoltage()
        this._getElectricCurrent()
        this._getTemperature()
        this._getResidualCurrent()
        this._getAlertNum()
      } else if (this.visibility === 'powerParame') {
        // 电力检测
        this._getElecEnergy()
      } else if (this.visibility === 'otherParame') {
        // 其他参数类型
        this._getOtherType()
        // 其他参数
        this._getOtherParam()
      }
    },
    // 初始化选中时间
    initTime() {
      const date = new Date()
      this.nowDate = parseTime(date, '{m}-{d}')
      this.bpSelectedDate = this.nowDate
      this.ppSelectedDate = this.nowDate
      this.opSelectedDate = this.nowDate
    },
    // 时间选择
    selectDate(date, parameName) {
      if (date === this.listQuery.time) {
        return
      }
      this.listQuery.time = date
      if (parameName === 'basicParame') {
        this.bpSelectedDate = date
        this.initData()
      }
      if (parameName === 'powerParame') {
        this.ppSelectedDate = date
        this.initData()
      }
      if (parameName === 'otherParame') {
        this.opSelectedDate = date
        this.initData()
      }
    },
    changeDateFlag(flag) {
      if (flag === this.dateFlag) {
        return
      }
      this.dateFlag = flag
      this._getElecEnergy()
    },
    // 获取包括今日前一周的日期
    getWeekDate() {
      for (let i = 0; i > -7; i--) {
        this.dates.unshift(getDay(i))
      }
    },
    /* 将空值转换为数字0 */
    initializeNull(data) {
      if (data === null || data === '' || data === undefined) {
        data = 0
      }
      return data
    },
    // 格式化数据为柱状图组件传入格式
    formatBarChartData(name, ut, list) {
      const data = list ? list.list : null
      if (!data) {
        return false
      }
      // const chartData = deepClone(this.baseBarChartData)
      // const xAxisData = []
      const serieData = []
      // const colors = []
      data.forEach(item => {
        const voltageVal = item.value[item.value.length - 1] || 0
        const minVoltage = this.initializeNull(list.limitl) || -100 // 最小临界值
        const maxVoltage = this.initializeNull(list.limith) || 10000 // 最大临界值
        let isAlert = false
        if (voltageVal <= minVoltage || voltageVal >= maxVoltage) {
          isAlert = true
        }
        // else {
        //   colors.push('#7fffaa')
        // }
        // xAxisData.push(item.name)
        serieData.push({ data: voltageVal, unit: ut, isAlert })
      })

      // chartData.title = `${name}当前值`
      // chartData.yAxis.unit = ut
      // chartData.xAxis.data = xAxisData
      // chartData.serieList = [
      //   {
      //     name: name,
      //     type: 'bar',
      //     data: serieData,
      //     label: getLabel(ut),
      //     itemStyle: {
      //       normal: {
      //         color: function(params) {
      //           return colors[params.dataIndex]
      //         }
      //       }
      //     },
      //     barWidth: BAR_WIDTH
      //   }
      // ]
      if (serieData.length > 0) {
        return serieData
      } else {
        return false
      }
    },
    // 格式化数据为折线图组件传入格式
    formatLineChartData(ut, list, grid) {
      const serieList = []
      const data = list.list
      data.forEach((item, index) => {
        if (item.value && item.value.length > 0) {
          serieList.push({
            name: item.name,
            data: item.value,
            style: {
              color: LINE_COLOE[index] // 折线图颜色
            }
          })
        }
      })
      const minVoltage = this.initializeNull(list.limitl) || -100 // 最小临界值
      const maxVoltage = this.initializeNull(list.limith) || -100 // 最大临界值
      const criticalVal = {
        name: '临界值',
        markLine: {
          silent: true,
          symbol: ['circle', 'circle'],
          lineStyle: {
            color: 'red',
            type: 'solid'
          },
          label: {
            position: 'middle'
          },
          data: [
            {
              yAxis: maxVoltage,
              label: {
                show: true,
                formatter: '最大临界值\n     ' + maxVoltage + ut
              }
            },
            {
              yAxis: minVoltage,
              label: {
                show: true,
                formatter: '最小临界值\n     ' + minVoltage + ut
              }
            }
          ]
        }
      }
      serieList.push(criticalVal)
      const chartData = {
        unit: ut,
        color: '#28BBAB',
        legend: true,
        legendPosition: {
          left: '60px'
        },
        grid: grid || {},
        xAxis: {
          lineColor: '#293D5A',
          textColor: '#97C1FF'
        },
        yAxis: {
          axisLine: false,
          textColor: '#97C1FF'
        },
        limith: list.limith,
        limitl: list.limitl,
        minNum: list.minNum,
        maxNum: list.maxNum,
        interval: list.interval,
        xAxisData: list.name,
        dataList: serieList
      }
      return chartData
    },
    // 获取电压数据
    _getVoltage() {
      getVoltage(this.listQuery).then(res => {
        if (res.data) {
          this.voltageData = res.data
        }
      })
    },
    // 获取电流数据
    _getElectricCurrent() {
      getElectricCurrent(this.listQuery).then(res => {
        if (res.data) {
          this.currentData = res.data
        }
      })
    },
    // 获取温度数据
    _getTemperature() {
      getTemperature(this.listQuery).then(res => {
        if (res.data) {
          this.temperatureData = res.data
        }
      })
    },
    // 获取剩余电流数据
    _getResidualCurrent() {
      getResidualCurrent(this.listQuery).then(res => {
        if (res.data) {
          this.residualCurrentData = res.data
        }
      })
    },
    // 获取电能数据
    _getElecEnergy() {
      getElecEnergy(
        Object.assign({}, this.listQuery, {
          flag: this.dateFlag
        })
      ).then(res => {
        if (res.data) {
          this.elecEnergyData = res.data
        }
      })
    },
    changeOtherParameType() {
      this._getOtherParam()
    },
    // 获取其他参数类型
    _getOtherType() {
      getOtherType().then(res => {
        if (res.data) {
          this.otherParameOptions = res.data.data
        }
      })
    },
    // 获取其他参数数据
    _getOtherParam() {
      getOtherParam(
        Object.assign({}, this.listQuery, {
          otherType: this.otherParameType
        })
      ).then(res => {
        if (res.data) {
          this.otherParamData = res.data
        }
      })
    },
    // 更新数据
    updateData() {
      const time = parseTime(this.latestData.lastTime, '{h}:{i}')
      if (this.visibility === 'basicParame') {
        this.voltageData.name.push(time)
        this.voltageData.list = this.voltageData.list.map(item => {
          item.value.push(this.latestData.catDtlData[item.flag])
          return { ...item }
        })
        this.currentData.name.push(time)
        this.currentData.list = this.currentData.list.map(item => {
          item.value.push(this.latestData.catDtlData[item.flag])
          return { ...item }
        })
        this.temperatureData.name.push(time)
        this.temperatureData.list = this.temperatureData.list.map(item => {
          item.value.push(this.latestData.catDtlData[item.flag])
          return { ...item }
        })
        this.residualCurrentData.name.push(time)
        this.residualCurrentData.list = this.residualCurrentData.list.map(
          item => {
            item.value.push(this.latestData.catDtlData[item.flag])
            return { ...item }
          }
        )
      } else if (this.visibility === 'powerParame') {
        this.latestElecEnergyData = {
          time,
          value: this.replaceData(this.elecEnergyData.list)
        }
      } else {
        this.latestOtherParamData = {
          time,
          value: this.replaceData(this.otherParamData.list)
        }
      }
    },
    // 周报月报
    viewReport() {
      this.dialogVisible = true
    },
    // 报警记录
    _getElectricAlarmRecord() {
      getElectricAlarmRecord(this.listQuery).then(res => {
        if (res.data) {
          this.alertList = res.data.list
          if (res.data.prog && res.data.prog.length) {
            let diffTimeMessage = ''
            res.data.prog = res.data.prog.map((item) => {
              if (item.lastAlertTime && item.firstAlertTime) {
                const diffTime = timeDifference(
                  item.firstAlertTime,
                  item.lastAlertTime
                )
                diffTimeMessage = `该设备正在发生报警，报警值为${item.data || ''}${
                  item.unit
                }，报警开始时间: ${
                  item.firstAlertTime
                }，已持续${diffTime}。`
              } else if (
                !item.lastAlertTime &&
              item.firstAlertTime
              ) {
                diffTimeMessage = `该设备正在发生报警，报警值为${item.data || ''}${
                  item.unit
                }，报警时间: ${item.firstAlertTime}`
              } else {
                diffTimeMessage = null
              }
              return {
                sensor: item.sensor,
                msg: diffTimeMessage,
                time: item.time
              }
            })
          }
          this.alertList = res.data.prog.concat(this.alertList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .select-content {
    width: 100%;
    height: 46px;
    line-height: 46px;
    display: flex;
    align-items: center;
    list-style: none;
    background-color: rgba(0, 113, 255, 0.2);
    li {
      height: 100%;
      display: flex;
      align-items: center;
      .text {
        display: inline-block;
        height: 100%;
        padding: 0 20px;
        color: #90b9f5;
        cursor: pointer;
        &.selected,
        &:hover {
          background-color: rgba(0, 113, 255, 0.57);
          color: #e2e87f;
        }
      }
      .line {
        display: inline-block;
        width: 1px;
        height: 15px;
        padding: 0;
        margin: 0 2px;
        background: #316acb;
      }
      &:last-child {
        .line {
          display: none;
        }
      }
    }
  }
  .content {
    flex: 1;
    overflow: hidden;
    .box {
      height: 100%;
      overflow-y: auto;
      .dateSelect {
        .el-button {
          &.slected {
            color: #1890ff;
            border-color: #badeff;
            background-color: #e8f4ff;
          }
        }
      }
      .el-main {
        width: 100%;
        padding: 0;
        .chart-wraper {
          height: 100%;
        }
      }
    }
    .switch-enter-active,
    .switch-leave-active {
      transition: all 0.5s;
    }
    .switch-enter,
    .switch-leave-to {
      transform: translate3d(-100%, 0, 0);
    }
    .basicParame {
      .el-aside {
        width: 315px !important;
        background: rgba(255, 255, 255, 0.07);
        background-image: url(./images/dev_electric_line.png);
        background-position: center;
        background-repeat: no-repeat;
        margin: 0;
        position: relative;
        ul {
          list-style: none;
          li {
            position: absolute;
            left: 0;
            padding: 6px 12px 7px 9px;
            background: url(./images/dev_electric_param_bg.png) 0 0 no-repeat;
            background-size: 100% 100%;
            font-size: 12px;
            line-height: 12px;
            color: #fff;
            .lineData {
              position: absolute;
              display: flex;
              width: 220px;
              word-break: normal;
              > span {
                display: inline-block;
                line-height: 20px;
              }
            }
            &.voltage {
              top: 52px;
              .lineData {
                left: 92px;
                top: 5px;
                > span {
                  position: absolute;
                  &:nth-child(1) {
                    left: 0px;
                  }
                  &:nth-child(2) {
                    left: 53px;
                  }
                  &:nth-child(3) {
                    left: 107px;
                  }
                }
              }
            }
            &.temperature {
              top: 96px;
              .lineData {
                left: 92px;
                top: 30px;
                > span {
                  position: absolute;
                  top: 0;
                  &:nth-child(1) {
                    left: 0px;
                  }
                  &:nth-child(2) {
                    left: 53px;
                  }
                  &:nth-child(3) {
                    left: 107px;
                  }
                  &:nth-child(4) {
                    left: 161px;
                  }
                }
              }
            }
            &.circuitBreaker {
              top: 164px;
            }
            &.tripStatus {
              background: none;
              top: 50%;
              padding: 0 0 0 5px;
            }
            &.current {
              bottom: 122px;
              .lineData {
                left: 92px;
                top: 30px;
                > span {
                  position: absolute;
                  &:nth-child(1) {
                    left: 0px;
                  }
                  &:nth-child(2) {
                    left: 53px;
                  }
                  &:nth-child(3) {
                    left: 107px;
                  }
                }
              }
            }
            &.residualCurrent {
              bottom: 32px;
              .lineData {
                left: 50px;
                top: 15px;
                span {
                  position: absolute;
                  left: 204px;
                }
              }
            }
          }
        }
      }
      > .el-main {
        margin-left: 11px;
        .section1 {
          padding-top: 0;
          .el-main {
            display: flex;
            align-items: center;
            padding: 18px 0;
            background: rgba(255, 255, 255, 0.07);
            .left {
              width: 176px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .text {
                color: #fff;
                margin-top: 18px;
                display: flex;
                line-height: 18px;
                .num {
                  font-size: 16px;
                  font-weight: bold;
                  margin-left: 12px;
                  color: #fffc01;
                }
              }
            }
            .line {
              width: 1px;
              height: 85px;
              background: #316acb;
              opacity: 0.32;
            }
            .right {
              flex: 1;
              flex-direction: column;
              list-style: none;
              justify-content: left;
              font-size: 14px;
              text-align: left;
              text-indent: 20px;
              color: #97c1ff;
              line-height: 22px;
            }
          }
        }
        .alert-wrapper {
          background: rgba(255, 255, 255, 0.07);
          margin-top: 12px;
          .el-header {
            height: 48px !important;
            color: #eceba8;
          }
          .el-main {
            padding: 0 16px;
            box-sizing: border-box;
            .el-table {
            }
          }
        }
        .section2 {
          margin-top: 12px;
          padding: 10px 0;
          align-items: center;
          background: rgba(255, 255, 255, 0.07);
        }
        .section3 {
          .chart-wraper {
            width: 100%;
            height: 250px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.07);
            .chart {
            }
          }
        }
      }
    }
    .powerParame {
      .el-header {
        padding: 0;
        justify-content: start;
        .dateFlag {
          .el-button {
            &.slected {
              color: #1890ff;
              border-color: #badeff;
              background-color: #e8f4ff;
            }
          }
        }
      }
    }
    .otherParame {
      .el-header {
        z-index: 100;
        padding: 0;
        color: #97c1ff;
        justify-content: start;
        .el-select {
        }
      }
    }
    .weekly,
    .monthly {
      padding: 20px 0;
      .list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        li {
          flex: 0 1 25%;
          height: 100px;
          border: 1px solid #316acb;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          color: #90b9f5;
          cursor: pointer;
          .alertNum {
            .num {
              color: #c80d0d;
              font-size: 18px;
              font-weight: bold;
              padding: 0 5px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.electricReport {
  .el-dialog__body {
    height: 590px;
    overflow: auto;
  }
}
.electricDetail {
  .el-input--medium {
    &.powerDateSelect {
      width: 140px;
      .el-input__inner {
        line-height: 25px;
        height: 25px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 5px;
        color: #97c1ff;
      }
      .el-input__icon {
        line-height: 25px;
      }
    }
  }
  .el-select--medium {
    &.queryDateSelect,
    &.paramSelect {
      margin-left: 7px;
      .el-input__inner {
        width: 107px;
        height: 25px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 5px;
        color: #89b1ec;
      }
      .el-input__icon {
        line-height: 25px;
      }
    }
  }
}
</style>

