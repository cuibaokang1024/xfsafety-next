<template>
  <el-container v-domResize="domResize" class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">隐患统计</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <div class="top">
        <div class="item" @click="hiddenFilter('greatDanger')">
          <span class="left">
            <span class="text">重大隐患</span>
          </span>
          <span class="left">
            <span class="num">{{ dangerList.greatDanger||0 }}</span>
          </span>
        </div>
        <div class="item" @click="hiddenFilter('majorDanger')">
          <span class="left">
            <span class="text">较大隐患</span>
          </span>
          <span class="left">
            <span class="num">{{ dangerList.majorDanger||0 }}</span>
          </span>
        </div>
        <div class="item" @click="hiddenFilter('seriousDanger')">
          <span class="left">
            <span class="text">严重隐患</span>
          </span>
          <span class="left">
            <span class="num">{{ dangerList.seriousDanger||0 }}</span>
          </span>
        </div>
        <div class="item" @click="hiddenFilter('commonDanger')">
          <span class="left">
            <span class="text">一般隐患</span>
          </span>
          <span class="left">
            <span class="num">{{ dangerList.commonDanger||0 }}</span>
          </span>
        </div>
      </div>
      <div class="chart">
        <BarChart
          id="residualCurrent"
          ref="chart"
          height="100%"
          width="100%"
          :chart-data="chartData"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BarChart from '@/components/Charts/barChart'
import domResize from '@/directive/resize/index.js'
import { getDangerList } from '@/api/home.js'
import './style/index.scss'
export default {
  components: {
    BarChart
  },
  directives: { domResize },
  data() {
    return {
      colors: ['#b70429', '#e9680d', '#cfd102', '#01fcff'],
      dangerList: {
        greatDanger: '',
        majorDanger: '',
        seriousDanger: '',
        commonDanger: ''
      },
      childDangerList: {}
    }
  },
  computed: {
    chartData() {
      const xAxisData = []
      const obj = {
        rectified: [],
        unrectified: []
      }
      const [commonDanger, seriousDanger, majorDanger, greatDanger] = [obj, obj, obj, obj]
      if (this.childDangerList.length > 0) {
        this.childDangerList.forEach((item) => {
          xAxisData.push(item.office_name)
          commonDanger.rectified.push(item.commonDanger)
          commonDanger.unrectified.push(item.commonDangerUnrect)
          seriousDanger.rectified.push(item.seriousDanger)
          seriousDanger.unrectified.push(item.seriousDangerUnrect)
          majorDanger.rectified.push(item.majorDanger)
          majorDanger.unrectified.push(item.majorDangerUnrect)
          greatDanger.rectified.push(item.greatDanger)
          greatDanger.unrectified.push(item.greatDangerUnrect)
        })
      }
      return {
        title: '',
        yAxis: {},
        xAxis: {
          data: xAxisData
        },
        grid: {
          left: '',
          top: '35',
          right: '0',
          bottom: '',
          containLabel: true
        },
        legend: {
          textStyle: {
            color: '#97c1ff',
            fontSize: 12
          },
          position: {
            right: '0',
            top: '10px'
          },
          itemWidth: 13,
          itemHeight: 6
        },
        serieList: [
          {
            name: '重大',
            type: 'bar',
            data: greatDanger.rectified,
            label: {},
            itemStyle: {
              color: '#b70429'
            },
            barWidth: '16',
            stack: '重大'
          },
          {
            name: '未整改',
            type: 'bar',
            data: this.getData(greatDanger.unrectified, '#b70429'),
            label: {},
            barWidth: '16',
            stack: '重大'
          },
          {
            name: '较大',
            type: 'bar',
            data: majorDanger.rectified,

            label: {},
            itemStyle: {
              color: '#e9680d'
            },
            barWidth: '16',
            stack: '较大'
          },
          {
            name: '未整改',
            type: 'bar',
            data: this.getData(majorDanger.unrectified, '#e9680d'),
            label: {},
            barWidth: '16',
            stack: '较大'
          },
          {
            name: '严重',
            type: 'bar',
            data: seriousDanger.rectified,

            label: {},
            itemStyle: {
              color: '#cfd102'
            },
            barWidth: '16',
            stack: '严重'
          },
          {
            name: '未整改',
            type: 'bar',
            data: this.getData(seriousDanger.unrectified, '#cfd102'),
            label: {},
            barWidth: '16',
            stack: '严重'
          },
          {
            name: '一般',
            type: 'bar',
            data: commonDanger.rectified,

            label: {},
            itemStyle: {
              color: '#01fcff'
            },
            barWidth: '16',
            stack: '一般'
          },
          {
            name: '未整改',
            type: 'bar',
            data: this.getData(commonDanger.unrectified, '#01fcff'),
            label: {},
            barWidth: '16',
            stack: '一般'

          }
        ]
      }
    }
  },
  created() {
    this._getDangerList()
  },
  methods: {
    domResize() {
      this.$refs.chart.resize()
    },
    getData(data, color) {
      const list = data
      return list.map((it, i) => {
        const dataURL = this.getCanvasImgColorUrl(color)
        const PatternImgA = new Image()
        PatternImgA.src = dataURL
        return { // 处理每一个柱子 是否加边框
          value: it,
          itemStyle: {
            color: {
              image: PatternImgA,
              repeat: 'repeat'
            },
            barBorderColor: color,
            barBorderWidth: 1,
            barBorderRadius: 0,
            borderType: 'solid'
          }
        }
      })
    },
    _getDangerList() {
      getDangerList().then((res) => {
        if (res.data) {
          this.dangerList = { ...res.data.officedangerListSelf[0] }
          this.childDangerList = res.data.officedangerListChild
        }
      })
    },
    hiddenFilter(data) {
      if (this.dangerList.office_id) {
        const query = {
          type: data,
          officeId: this.dangerList.office_id
        }
        this.$emit('filterHiddenLevel', query)
      }
    },
    getCanvasImgColorUrl(color) {
      const lineBlock = document.createElement('canvas')
      const cxt = lineBlock.getContext('2d')
      lineBlock.width = 50
      lineBlock.height = 50
      cxt.beginPath()
      cxt.moveTo(95, 0)
      cxt.lineTo(0, 95)
      cxt.moveTo(90, 0)
      cxt.lineTo(0, 90)
      cxt.moveTo(85, 0)
      cxt.lineTo(0, 85)
      cxt.moveTo(80, 0)
      cxt.lineTo(0, 80)
      cxt.moveTo(75, 0)
      cxt.lineTo(0, 75)
      cxt.moveTo(70, 0)
      cxt.lineTo(0, 70)
      cxt.moveTo(65, 0)
      cxt.lineTo(0, 65)
      cxt.moveTo(60, 0)
      cxt.lineTo(0, 60)
      cxt.moveTo(55, 0)
      cxt.lineTo(0, 55)
      cxt.moveTo(50, 0)
      cxt.lineTo(0, 50)
      cxt.moveTo(45, 0)
      cxt.lineTo(0, 45)
      cxt.moveTo(40, 0)
      cxt.lineTo(0, 40)
      cxt.moveTo(35, 0)
      cxt.lineTo(0, 35)
      cxt.moveTo(30, 0)
      cxt.lineTo(0, 30)
      cxt.moveTo(25, 0)
      cxt.lineTo(0, 25)
      cxt.moveTo(20, 0)
      cxt.lineTo(0, 20)
      cxt.moveTo(15, 0)
      cxt.lineTo(0, 15)
      cxt.moveTo(10, 0)
      cxt.lineTo(0, 10)
      cxt.moveTo(5, 0)
      cxt.lineTo(0, 5)
      cxt.strokeStyle = color
      cxt.stroke()
      cxt.fillStyle = 'rgba(255,255,255,0)'
      cxt.fillRect(0, 0, 100, 100)
      const dataURL = lineBlock.toDataURL('image/png', 1)
      return dataURL
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  .el-main {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 16px 0 10px;
    border: 1px solid #0180ff;
    background-color: #080d4f;
    overflow: hidden;
    .top {
      height: 33px;
      display: flex;
      .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: #97c1ff;
        font-size: 14px;
        cursor: pointer;
        border: 1px dashed #0180ff;
        .num {
          font-size: 20px;
        }
        &:nth-child(1){
          .num{
            color: #fd0003;
          }
        }
        &:nth-child(2){
          .num{
            color: #ff7200;
          }
        }
        &:nth-child(3){
          .num{
            color: #fffe03;
          }
        }
        &:nth-child(4){
          .num{
            color: #01fcff;
          }
        }
        &:not(:last-child){
            margin-right: 4px;
          }
      }
    }
    .chart {
      flex: 1;
    }
  }
}
</style>
