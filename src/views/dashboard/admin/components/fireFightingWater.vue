<template>
  <el-container v-domResize="domResize">
    <el-header height="26px">
      <span class="block" />
      <span class="text">按行政区划统计单位和建筑</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <div class="chart">
        <BarChart
          id="residualCurrent1"
          ref="chart"
          height="100%"
          width="100%"
          :chart-data="voltagesData"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BarChart from '@/components/Charts/barChart'
import domResize from '@/directive/resize/index.js'

export default {
  components: {
    BarChart
  },
  directives: { domResize },
  data() {
    return {
      a: 10,
      b: 20,
      voltagesData: {
        title: '',
        yAxis: {},
        xAxis: {
          data: ['青岛市消防救援支队', '市南区消防救援支队', '市北区消防救援支队', '崂山区消防救援支队']
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
            name: '火灾高危单位',
            type: 'bar',
            data: [10, 20, 30, 10],
            label: {},
            itemStyle: {
              color: '#eb4949'
            },
            barWidth: '9'
          },
          {
            name: '重点单位',
            type: 'bar',
            data: [20, 20, 30, 10],

            label: {},
            itemStyle: {
              color: '#ff7800'
            },
            barWidth: '9'
          },
          {
            name: '一般单位',
            type: 'bar',
            data: [30, 20, 30, 10],

            label: {},
            itemStyle: {
              color: '#03dd79'
            },
            barWidth: '9'
          }
        ]
      }
    }
  },
  created() {
    setInterval(() => {
      this.a = this.a + 1
      this.b = this.b + 2
    }, 2000)
  },
  methods: {
    domResize() {
      this.$refs.chart.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    position: relative;
    padding: 0;
    margin-bottom: 2px;
    align-items: center;
    border-bottom: 1px solid #0180ff;
    .text {
      font-size: 16px;
      color: #fff;
      margin-left: 5px;
    }
    .block {
      display: inline-block;
      width: 6px;
      height: 13px;
      background-color: #0488ea;
      margin-left: 2px;
    }
    .tagging {
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 2px;
      width: 30px;
      height: 5px;
      background: url(images/tagging.png) 0 0 no-repeat;
    }
  }
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
        border: 1px dashed #0180ff;
        .num {
          font-size: 20px;
        }
        &:not(:last-child){
            margin-right: 4px;
          }
      }
      .yesterday {
        .icon {
          background: url("./images/respon-1.png") 0 0 no-repeat;
        }
        .num {
          color: #fffc18;
        }
      }
      .overdue {
        .icon {
          background: url("./images/respon-2.png") 0 0 no-repeat;
        }
        .num {
          color: #ff2b2b;
        }
      }
    }
    .chart {
      flex: 1;
    }
  }
}
</style>
