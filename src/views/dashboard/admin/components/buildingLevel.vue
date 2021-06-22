<template>
  <el-container class="home-box buildingLevel">
    <el-header height="26px">
      <span class="block" />
      <span class="text">建筑分级统计</span>
      <span class="tagging" />
    </el-header>
    <el-main :class="homeType==='emergency'?'emergency':''">
      <div class="box">
        <div class="title">【高层建筑高度分类统计】</div>
        <div class="content">
          <bar-percent-chart
            id="chart-fire-bar"
            height="100%"
            width="100%"
            :chart-data="chartData"
            @click="chartClick"
          />
        </div>
      </div>
      <div class="box">
        <div class="title">【高层建筑用途分类统计】</div>
        <div class="content">
          <div class="item" @click="buildingLevelSearch({type:'publicType',name:'高层公共建筑'})">
            <span class="icon" />
            <div class="data">
              <span class="text">高层公共建筑</span>
              <span class="num">{{ publicType }}</span>
            </div>
          </div>
          <div class="item" @click="buildingLevelSearch({type:'residenceType',name:'高层住宅建筑'})">
            <span class="icon" />
            <div class="data">
              <span class="text">高层住宅建筑</span>
              <span class="num">{{ residenceType }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getLevelbuildinginfo } from '@/api/home'
import { getAreaLevelbuildinginfo } from '@/api/emergencyHome'
import BarPercentChart from '@/components/Charts/barPercentChart'
import './style/index.scss'
export default {
  components: {
    BarPercentChart
  },
  props: {
    homeType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      chartData: {},
      publicType: 0,
      residenceType: 0
    }
  },
  created() {
    this._getLevelbuildinginfo()
  },
  mounted() {},
  methods: {
    _getLevelbuildinginfo() {
      const info = {
        total: 7,
        secondLevel: 3,
        firstLevel: 3,
        superLevel: 1,
        publicType: 3,
        residenceType: 4
      }
      this.chartData = this.formatChartData(info)
      if (this.homeType === 'emergency') {
        getAreaLevelbuildinginfo().then(res => {
          if (res.data) {
            this.chartData = this.formatChartData(res.data.info)
            this.publicType = res.data.info.publicType
            this.residenceType = res.data.info.residenceType
          }
        })
      } else {
        getLevelbuildinginfo().then(res => {
          if (res.data) {
            this.chartData = this.formatChartData(res.data.info)
            this.publicType = res.data.info.publicType
            this.residenceType = res.data.info.residenceType
          }
        })
      }
    },
    formatChartData(data) {
      const chartData = {
        colors: ['#1890ff', '#d99503', '#4da01f'],
        axisLabel: {
          color: '#97c1ff'
        },
        label: {
          color: '#97c1ff'
        },
        grid: {
          top: '10px',
          left: '60px',
          right: '0',
          bottom: '0'
        },
        name: ['超高层', '一类高层', '二类高层'],
        data: [
          {
            name: '超高层',
            type: 'superLevel',
            value: data.superLevel
          },
          {
            name: '一类高层',
            type: 'firstLevel',
            value: data.firstLevel
          },
          {
            name: '二类高层',
            type: 'secondLevel',
            value: data.secondLevel
          }
        ],
        total: [
          { name: '超高层', type: 'superLevel', value: data.total },
          { name: '一类高层', type: 'firstLevel', value: data.total },
          { name: '二类高层', type: 'secondLevel', value: data.total }
        ]
      }
      return chartData
    },
    chartClick(data) {
      this.buildingLevelSearch(data.data)
    },
    buildingLevelSearch(data) {
      this.$emit('buildingLevelSearch', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  .el-main {
    position: relative;
    padding: 8px;
    background-color: #080d4f;
    border: 1px solid #0180ff;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    &.emergency {
      flex-direction: column;
    }
    .box {
      flex: 0 1 48%;
      display: flex;
      flex-direction: column;
      .title {
        height: 29px;
        line-height: 29px;
        font-size: 12px;
        color: #faff69;
        background: url(./images/building_level_title.png) 0 0 no-repeat;
      }
      .content {
        flex: 1;
        display: flex;
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            .icon {
              transform: scale(1.03);
            }
          }
          &:nth-child(2) {
            .icon {
              background: url(./images/icon_building2.png) 0 0 no-repeat;
            }
          }
          .icon {
            display: inline-block;
            width: 44px;
            height: 41px;
            background: url(./images/icon_building1.png) 0 0 no-repeat;
            background-size: 100% 100%;
          }
          .data {
            flex: 1;
            height: 100%;
            display: flex;
            padding-left: 5px;
            flex-direction: column;
            justify-content: center;
            align-items: left;
            .text {
              font-size: 12px;
              color: #97c1ff;
              margin-bottom: 10px;
            }
            .num {
              font-size: 16px;
              font-weight: bold;
              color: #fff;
            }
          }
        }
      }
    }
    .chart {
      flex: 1;
    }
  }
}
</style>
