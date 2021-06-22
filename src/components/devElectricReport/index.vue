<template>
  <div class="devElectricReport">
    <el-table :data="alertData" style="width: 100%" :cell-style="changeCellStyle">
      <el-table-column prop="name" label="监测区域名称" align="center" />
      <el-table-column prop="status" label="在线状态" align="center" :formatter="statusFormatter" />
      <el-table-column prop="residualCurrent" label="剩余电流告警" align="center" />
      <el-table-column prop="temperature" label="温度告警" align="center" />
      <el-table-column prop="current" label="电流告警" align="center" />
      <el-table-column prop="voltage" label="电压告警" align="center" />
    </el-table>
    <el-header>极地馆二层电梯旁电井2AP2-1</el-header>
    <el-table :data="devParmasData" style="width: 100%">
      <el-table-column prop="project" label="项目" align="center" />
      <el-table-column prop="unit" label="单位" align="center" />
      <el-table-column prop="normalValue" label="正常值" align="center" />
      <el-table-column prop="limitValue" label="极限值" align="center" />
      <el-table-column prop="time" label="发生时间" align="center" width="180" />
    </el-table>
    <el-header>一周告警总数对比图</el-header>
    <div class="chart-wrapper">
      <BarChart
        v-if="weekChartData"
        ref="chart"
        height="100%"
        width="100%"
        :chart-data="weekChartData"
      />
    </div>
  </div>
</template>

<script>
import BarChart from '../Charts/barChart'
export default {
  components: {
    BarChart
  },
  props: {
    model: {
      type: String,
      default: 'weekly'
    }
  },
  data() {
    return {
      alertData: [
        {
          name: '极地馆二层电梯旁电井2AP2-1',
          status: 0,
          residualCurrent: '1',
          temperature: '2',
          current: '3',
          voltage: '4'
        }
      ],
      devParmasData: [
        {
          project: 'A相电压上限',
          unit: 'V',
          normalValue: '<=264.00',
          limitValue: '237.0',
          time: '2020-10-05 20:24:58.0'
        },
        {
          project: 'A相电压下限',
          unit: 'V',
          normalValue: '>=187.00',
          limitValue: '223.2',
          time: '2020-10-06 09:53:17.0'
        },
        {
          project: 'B相电压上限',
          unit: 'V',
          normalValue: '<=264.00',
          limitValue: '236.6',
          time: '2020-10-05 03:34:16.0'
        },
        {
          project: 'B相电压下限',
          unit: 'V',
          normalValue: '>=187.00',
          limitValue: '223.2',
          time: '2020-10-06 09:56:16.0'
        },
        {
          project: 'C相电压上限',
          unit: 'V',
          normalValue: '<=264.00',
          limitValue: '237.3',
          time: '2020-10-05 20:27:08.0'
        },
        {
          project: 'C相电压下限',
          unit: 'V',
          normalValue: '>=187.00',
          limitValue: '224.4',
          time: '2020-10-06 09:57:11.0'
        },
        {
          project: 'A相电流',
          unit: 'A',
          normalValue: '<=200.00',
          limitValue: '11.2',
          time: '2020-10-06 08:29:06.0'
        },
        {
          project: 'B相电流',
          unit: 'A',
          normalValue: '<=200.00',
          limitValue: '29.6',
          time: '2020-10-10 18:17:35.0'
        },
        {
          project: 'C相电流',
          unit: 'A',
          normalValue: '<=200.00',
          limitValue: '22.3',
          time: '2020-10-10 17:47:35.0'
        },
        {
          project: 'A线温度',
          unit: '℃',
          normalValue: '<=70.00',
          limitValue: '21.3',
          time: '2020-10-11 14:59:45.0'
        },
        {
          project: 'B线温度',
          unit: '℃',
          normalValue: '<=70.00',
          limitValue: '21.6',
          time: '2020-10-11 16:59:42.0'
        },
        {
          project: 'C线温度',
          unit: '℃',
          normalValue: '<=70.00',
          limitValue: '21.4',
          time: '2020-10-11 14:59:46.0'
        },
        {
          project: 'N线温度',
          unit: '℃',
          normalValue: '<=70.00',
          limitValue: '21.8',
          time: '2020-10-11 16:54:45.0'
        },
        {
          project: '剩余电流',
          unit: 'mA',
          normalValue: '<=300.00',
          limitValue: '270.0',
          time: '2020-10-10 14:21:39.0'
        },
        {
          project: '有功电能',
          unit: 'kW·h',
          normalValue: '<=100000000.00',
          limitValue: '21176.9',
          time: '2020-10-11 23:55:51.0'
        },
        {
          project: 'A相相电压角度',
          unit: '°',
          normalValue: '<=180.00',
          limitValue: '0.0',
          time: '2020-10-11 00:03:36.0'
        },
        {
          project: 'B相相电压角度',
          unit: '°',
          normalValue: '<=180.00',
          limitValue: '-82.0',
          time: '2020-10-11 04:03:35.0'
        },
        {
          project: 'C相相电压角度',
          unit: '°',
          normalValue: '<=180.00',
          limitValue: '94.0',
          time: '2020-10-11 04:03:35.0'
        },
        {
          project: 'A相相电流角度',
          unit: '°',
          normalValue: '<=180.00',
          limitValue: '107.0',
          time: '2020-10-10 17:17:36.0'
        },
        {
          project: 'B相相电流角度',
          unit: '°',
          normalValue: '<=180.00',
          limitValue: '127.0',
          time: '	2020-10-05 06:49:20.0'
        },
        {
          project: 'C相相电流角度',
          unit: '°',
          normalValue: '<=180.00',
          limitValue: '61.0',
          time: '2020-10-05 06:04:21.0'
        },
        {
          project: 'A相有功功率',
          unit: 'kw',
          normalValue: '<=100.00',
          limitValue: '1.6',
          time: '2020-10-06 00:45:00.0'
        },
        {
          project: 'B相有功功率',
          unit: 'kw',
          normalValue: '<=100.00',
          limitValue: '6.8',
          time: '2020-10-10 18:17:38.0'
        },
        {
          project: 'C相有功功率',
          unit: 'kw',
          normalValue: '<=100.00',
          limitValue: '4.9',
          time: '2020-10-11 12:23:43.0'
        },
        {
          project: 'A相无功功率',
          unit: 'kvar',
          normalValue: '<=100.00',
          limitValue: '0.0',
          time: '2020-10-11 00:03:37.0'
        },
        {
          project: 'B相无功功率',
          unit: 'kvar',
          normalValue: '<=100.00',
          limitValue: '1.7',
          time: '2020-10-10 18:22:36.0'
        },
        {
          project: 'C相无功功率',
          unit: 'kvar',
          normalValue: '<=100.00',
          limitValue: '4.3',
          time: '2020-10-10 17:47:36.0'
        },
        {
          project: 'A相视在功率',
          unit: 'kVA',
          normalValue: '<=100.00',
          limitValue: '2.5',
          time: '2020-10-06 10:15:51.0'
        },
        {
          project: 'B相视在功率',
          unit: 'kVA',
          normalValue: '<=100.00',
          limitValue: '7.0',
          time: '2020-10-10 18:17:40.0'
        },
        {
          project: 'C相视在功率',
          unit: 'kVA',
          normalValue: '<=100.00',
          limitValue: '5.2',
          time: '2020-10-10 17:47:36.0'
        },
        {
          project: 'A相功率因数',
          unit: 'null',
          normalValue: '<=1.00',
          limitValue: '1.0',
          time: '2020-10-11 00:03:37.0'
        },
        {
          project: 'B相功率因数',
          unit: 'null',
          normalValue: '<=1.00',
          limitValue: '0.989',
          time: '2020-10-11 01:03:42.0'
        },
        {
          project: 'C相功率因数',
          unit: 'null',
          normalValue: '<=1.00',
          limitValue: '1.0',
          time: '2020-10-11 00:03:37.0'
        },
        {
          project: '总有功功率	',
          unit: 'kw',
          normalValue: '<=100.00',
          limitValue: '10.4',
          time: '2020-10-10 16:36:47.0'
        },
        {
          project: '总无功功率	',
          unit: 'kvar',
          normalValue: '<=100.00',
          limitValue: '4.0',
          time: '2020-10-10 17:47:36.0'
        },
        {
          project: '总视在功率	',
          unit: 'kVA',
          normalValue: '<=100.00',
          limitValue: '12.2',
          time: '2020-10-10 17:52:36.0'
        },
        {
          project: '总功率因数	',
          unit: null,
          normalValue: '<=100.00',
          limitValue: '0.995',
          time: '2020-10-10 16:36:47.0'
        },
        {
          project: 'A相电压谐波',
          unit: null,
          normalValue: '<=1000.00',
          limitValue: '4.7',
          time: '2020-10-11 23:30:56.0'
        },
        {
          project: 'B相电压谐波',
          unit: null,
          normalValue: '<=1000.00',
          limitValue: '4.4',
          time: '2020-10-11 23:30:56.0'
        },
        {
          project: 'C相电压谐波',
          unit: null,
          normalValue: '<=1000.00',
          limitValue: '4.0',
          time: '2020-10-11 23:20:51.0'
        },
        {
          project: 'A相电流谐波',
          unit: null,
          normalValue: '<=1000.00',
          limitValue: '0.0',
          time: '2020-10-11 00:03:38.0'
        },
        {
          project: 'B相电流谐波',
          unit: null,
          normalValue: '<=1000.00',
          limitValue: '0.0',
          time: '2020-10-11 00:03:38.0'
        },
        {
          project: 'C相电流谐波',
          unit: null,
          normalValue: '<=1000.00',
          limitValue: '0.0',
          time: '2020-10-11 00:03:38.0'
        }
      ],
      weekChartData: {
        title: '',
        yAxis: {
          color: '#97c1ff',
          unit: '家'
        },
        xAxis: {
          color: '#97c1ff',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        grid: {
          left: '7px',
          top: '40px',
          right: '7px',
          bottom: '0',
          containLabel: true
        },
        legend: {
          textStyle: {
            color: '#97c1ff',
            fontSize: 12
          },
          position: {
            left: 'center',
            top: '10'
          },
          itemWidth: 13,
          itemHeight: 6
        },
        serieList: [
          {
            data: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            data: [1, 2, 3, 4, 5, 6, 7]
          }
        ]
      }
    }
  },
  methods: {
    changeCellStyle({ row, column, rowIndex, columnIndex }) {
      if (this.alertData[rowIndex].status === 0 && columnIndex === 0) {
        return 'color:#ff5555'
      }
    },
    statusFormatter(row, column, rowIndex, columnIndex) {
      if (row.status === 0) {
        return '在线'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  height: 40px !important;
  line-height: 40px;
  color: #97c1ff;
  padding: 0;
}
</style>
