<template>
  <el-collapse-item :name="name">
    <template name="title">
      <i class="header-icon" />{{ data.title }}<i class="header-icon" />
    </template>
    <div class="data">
      <div class="item" @click="filterOffice(query='')">
        <span class="text">接入单位</span>
        <span class="num">{{ data.dwnum }}<span class="unit">家</span></span>
      </div>
      <div class="item" @click="filterOffice(query='')">
        <span class="text">安装设备</span>
        <span class="num">{{ data.sbnum }}<span class="unit">套</span></span>
      </div>
      <div class="item" @click="filterOffice(query={isAlert:1})">
        <span class="text">报警设备</span>
        <span class="num">{{ data.alnum }}<span class="unit">套</span></span>
      </div>
    </div>
    <div class="chart-wrapper">
      <PieChart
        :id="data.chartId"
        width="215px"
        height="170px"
        :chart-data="pieData"
      />
    </div>
  </el-collapse-item>
</template>

<script>
import './style/index.scss'
import PieChart from '@/components/Charts/pieChart'
export default {
  name: 'TopBox',
  components: {
    PieChart
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    chartData: {
      type: Object,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    pieData() {
      const pieData = {
        unit: '台',
        legend: {
          orient: 'horizontal',
          top: '30%',
          left: '70%',
          itemWidth: 20,
          itemHeight: 6,
          textStyle: {
            color: '#fff'
          },
          data: ['在线', '离线', '报警']
        },
        series: [{
          name: '',
          radius: ['60%', '80%'],
          center: ['35%', '50%'],
          data: [
            {
              name: '在线',
              value: this.chartData && this.chartData.onnum || this.data.onnum,
              itemStyle: {
                color: '#4fac03'
              }
            },
            {
              name: '离线',
              value: this.chartData && this.chartData.ofnum || this.data.ofnum,
              itemStyle: {
                color: '#ff0000'
              }
            },
            {
              name: '报警',
              value: this.chartData && this.chartData.alnum || this.data.alnum,
              itemStyle: {
                color: '#ffe400'
              }
            }
          ]
        }]
      }
      return pieData
    }
  },
  methods: {
    filterOffice(query) {
      this.$emit('filterOffice', query)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
