<template>
  <div class="grid-Manager">
    <div class="map-wrapper">
      <BasMap ref="map" :points="officeList" @belongUnits="belongUnits" @viewDetail="viewUnitArchives" />
    </div>

    <div class="panel">
      <div class="item">
        <div class="title">监管单位</div>
        <div class="content">
          <BaseTable
            :table-data="pageOfficeList"
            :table-config="tableConfig"
            :border="false"
            :show-header="false"
            :table-height="'100%'"
          >
            <el-table-column align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <span class="btn-view" @click="unitPosition(row)">查看</span>
              </template>
            </el-table-column>
          </BaseTable>
          <div style="text-align: right">
            <pagination
              v-show="total > 0"
              :total="total"
              :layout="'prev, next, total, jumper'"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.pageSize"
              @pagination="_getOfficeList"
            />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">单位分级</div>
        <div class="chart-wrapper">
          <PieChart
            :id="'unitLevel'"
            width="375px"
            height="200px"
            :chart-data="pieData"
            @click="filterOfficeByLevel"
          />
        </div>
      </div>
      <div class="item">
        <div class="title">行政区划-单位数量</div>
        <div class="chart-wrapper">
          <BarChart
            v-if="areaData.length>0"
            id="region"
            ref="chart"
            width="100%"
            height="400px"
            :chart-data="barChartData"
            @click="filterOfficeArea"
          />
        </div>
      </div>
    </div>
    <!-- <div style="display:none">
      <GridMapWindow ref="gridInfoWindow" :window-data="windowData"  />
      <InfoWindow ref="unitInfoWindow" :window-data="windowData" @viewDetail="viewUnitArchives" />
    </div> -->
    <el-dialog
      v-if="dialogVisible"
      class="dark unitArchives"
      :append-to-body="true"
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      width="1240px"
    >
      <div name="title" class="dialog-title">单位档案</div>
      <div class="dialog-content">
        <unit-archives :office-id="viewOfficeId" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import BasMap from '@/components/bmap/base-map'
import { getOfficeList, getOfficeLevel, getArea } from '@/api/map'
import BaseTable from '@/components/baseTable'
import PieChart from '@/components/Charts/pieChart'
import BarChart from '@/components/Charts/barChart'
import Pagination from '@/components/Pagination'
import UnitArchives from '@/components/unitArchives'
export default {
  name: 'IndustryDirectors',
  components: {
    BaseTable,
    PieChart,
    Pagination,
    BarChart,
    UnitArchives,
    BasMap
  },
  data() {
    return {
      plugins: ['AMap.Polygon', 'AMap.LngLat', 'AMap.MouseTool', 'AMap.PolyEditor', 'AMap.DistrictSearch'], // 需要使用的的插件列表
      windowData: {},
      dialogVisible: false,
      infoWindow: null,
      layers: 'satelliteRoadNet', // default(默认标准图层) satellite（卫星图）satelliteRoadNet（卫星图加路网）
      polygonList: [],
      listQuery: {
        page: 1,
        pageSize: 5,
        level: '',
        areaId: ''
      },
      total: 0,
      viewOfficeId: '',
      pageOfficeList: [],
      tableConfig: [
        {
          type: 'index',
          width: '35',
          align: 'center'
        },
        {
          prop: 'name',
          align: 'left',
          width: '220'
        }
      ],
      majorValue: 0, moreValue: 0, commonlyValue: 0, otherValue: 0,
      areaData: [],
      officeList: []
    }
  },
  computed: {
    pieData() {
      const pieData = {
        unit: '家',
        legend: {
          orient: 'horizontal',
          top: '30%',
          left: '70%',
          itemWidth: 20,
          itemHeight: 6,
          textStyle: {
            color: '#fff'
          },
          data: ['重大风险', '较大风险', '一般风险', '低风险']
        },
        series: [{
          name: '',
          radius: '80%',
          center: ['35%', '50%'],
          selectedMode: 'single',
          data: [
            {
              name: '重大风险',
              level: '1',
              value: this.majorValue,
              itemStyle: {
                color: '#c12a2a'
              }
            },
            {
              name: '较大风险',
              level: '3',
              value: this.moreValue,
              itemStyle: {
                color: '#f9782a'
              }
            },
            {
              name: '一般风险',
              level: '2',
              value: this.commonlyValue,
              itemStyle: {
                color: '#e2b428'
              }
            },
            {
              name: '低风险',
              level: '4',
              value: this.otherValue,
              itemStyle: {
                color: '#0080ff'
              }
            }],
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                if (params.value !== 0) {
                  return `${params.percent}%`
                } else {
                  return ''
                }
              },
              position: 'inner'
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      return pieData
    },
    barChartData() {
      const chartData = {
        title: '',
        yAxis: {
          color: '#97c1ff',
          type: 'category',
          data: this.areaData.map((item) => {
            return item.name
          })
        },
        xAxis: {
          color: '#97c1ff',
          type: 'value',
          unit: '家'
        },
        grid: {
          left: '7px',
          top: '40px',
          right: '7px',
          bottom: '12px',
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
            name: '单位数',
            type: 'bar',
            data: this.areaData.map((item) => {
              return { value: item.value, areaId: item.id }
            }),
            itemStyle: {
              color: '#00b4b1'
            },
            barWidth: '10'
          }
        ]
      }
      return chartData
    }
  },
  created() {
    this._getOfficeLevel()
    this._getArea()
  },
  methods: {
    openGridInfo(data) {
      this.windowData = data
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs.gridInfoWindow.$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, data.lnglat)
      })
    },
    openInfo(data) {
      this.windowData = data
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs.unitInfoWindow.$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, data.lnglat)
      })
    },
    unitPosition(data) {
      this.map.setZoomAndCenter(16, [data.longitude, data.latitude], true)
      setTimeout(() => {
        this.openInfo({ ...data, lnglat: [data.longitude, data.latitude] })
      }, 100)// 地图缩放会直接清除信息窗体，设为异步
    },
    // 获取单位列表
    _getOfficeList() {
      getOfficeList(this.listQuery).then((res) => {
        if (res.data) {
          this.officeList = res.data.allData
          this.pageOfficeList = res.data.pageData.list
          this.total = res.data.pageData.totalCount
        }
      })
    },
    // 根据单位分级筛选单位
    filterOfficeByLevel(params) {
      this.listQuery.level = params.data.level
      this.listQuery.areaId = ''
      this._getOfficeList()
    },
    // 根据区域信息筛选单位
    filterOfficeArea(params) {
      this.listQuery.page = 1
      this.listQuery.areaId = params.data.areaId
      this.listQuery.level = ''
      this._getOfficeList()
    },
    // 获取单位分级数据
    _getOfficeLevel() {
      getOfficeLevel().then((res) => {
        if (res.data) {
          res.data.forEach(item => {
            if (item.level === '1') {
              this.majorValue += item.value
            } else if (item.level === '3') {
              this.moreValue += item.value
            } else if (item.level === '2') {
              this.commonlyValue += item.value
            } else {
              this.otherValue += item.value
            }
          })
        }
      })
    },
    // 关闭单位档案页面
    hide() {
      this.dialogVisible = false
    },
    // 查看单位详情
    viewUnitArchives(data) {
      this.viewOfficeId = data.id
      this.dialogVisible = true
    },
    // 获取区域单位数据
    _getArea() {
      getArea().then((res) => {
        if (res.data) {
          this.areaData = res.data
        }
      })
    },
    // 所属单位
    belongUnits(data) {
      this.listQuery.areaId = data.area.id
      this._getOfficeList()
    },
    // 绘制地图单位点
    drawPoints() {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      if (this.mass) {
        this.mass.clear()
      }
      const points = []
      this.officeList.forEach(item => {
        if (item.longitude && item.latitude) {
          var point = {
            lnglat: [item.longitude, item.latitude],
            name: item.name,
            id: item.id,
            address: item.address,
            isAlert: item.isAlert,
            style: item.level - 1
          }
          points.push(point)
        }
      })
      this.mass.setData(points)
      // this.map.setFitView()
    }
  }
}
</script>

<style lang="scss" scoped>
  .grid-Manager{
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    .map-wrapper{
      flex: 1;
      width: 100%;
      height: 100%;
    }
    .panel{
      width: 380px;
      padding: 20px 18px;
      overflow: hidden;
      overflow-y: auto;
      .item{
        display: flex;
        flex-direction: column;
        .title{
          height: 39px;
          line-height: 39px;
          font-size: 14px;
          color: #fff;
          border: 1px solid #4199f2;
          text-indent: 15px;
        }
        .content{
          height: 220px;
          display: flex;
          flex-direction: column;
          padding: 5px 0;
          .btn-view{
            display: inline-block;
            width: 58px;
            height: 19px;
            line-height: 19px;
            background: #0A82A5;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 400;
            color: #D4E5FF;
            cursor: pointer;
          }
        }
        .chart-wrapper{

        }
      }
    }
  }
</style>
<style lang="scss">
.grid-Manager{
  .el-table{
    th,td{
      padding: 5px 0;
    }
  }
}
</style>
