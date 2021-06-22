<template>
  <div class="map-wrapper">
    <div id="map" class="map" />
    <div style="display:none">
      <GridMapWindow ref="gridInfoWindow" :window-data="windowData" @subDivision="subDivision" @belongUnits="belongUnits" />
      <InfoWindow ref="unitInfoWindow" :window-data="windowData" @viewDetail="viewDetail" />
      <!-- <info-window ref="infoWindow" :window-data="windowData" @viewDetail="viewDetail" /> -->
    </div>
  </div>
</template>

<script>
import './style/index.scss'
import GridMapWindow from '@/components/bmap/gridMapWindow'
import InfoWindow from '@/components/bmap/infoWindow'
import commonMap from '@/mixins/commonMap.js'
import { getPolygonList } from '@/api/map'
export default {
  name: 'BaseMap',
  components: {
    InfoWindow,
    GridMapWindow
  },
  mixins: [commonMap],
  props: {
    points: {
      type: Array,
      default: () => []
    }// 初始化地图点数据（单位列表）
  },
  data () {
    return {
      plugins: ['AMap.MassMarks', 'AMap.DistrictSearch', 'AMap.MarkerCluster'],
      windowData: {},
      infoWindow: null,
      isDrawGrid: true,
      polygonList: [],
      cluster: null,
      layers: 'satelliteRoadNet' // default(默认标准图层) satellite（卫星图）satelliteRoadNet（卫星图加路网）
    }
  },
  mounted () {
    this._getPolygonList()
  },
  unmounted () {
    this.destroyMap()
  },
  methods: {
    openGridInfo (data) {
      this.windowData = data
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs.gridInfoWindow.$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, data.lnglat)
      })
    },
    openInfo (data) {
      this.windowData = data
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs.unitInfoWindow.$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, data.lnglat)
      })
    },
    async initMassMarks () {
      await this.initMap()
      this.$watch('points', function () {
        this.drawPoints(this.points)
      }, { deep: true })
    },
    // 获取行政区划信息
    _getPolygonList (areaId) {
      getPolygonList({ areaId }).then((res) => {
        if (res.data) {
          this.polygonList = res.data
          this.initMassMarks()
        }
      })
    },
    // 绘制点
    drawPoints (data) {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      if (this.cluster) {
        this.cluster.setData([])
      }
      const points = []
      data.forEach(item => {
        if (item.longitude && item.latitude) {
          points.push({
            lnglat: new this.AMap.LngLat(Number(item.longitude), Number(item.latitude)),
            name: item.name,
            id: item.id,
            address: item.addr || item.address || '',
            level: item.level || ''
          })
        }
      })
      // 添加聚合组件
      this.cluster = new this.AMap.MarkerCluster(this.map, points, {
        styles: [{
          url: 'http://webapi.amap.com/theme/v1.3/m1.png',
          size: new this.AMap.Size(52, 52),
          offset: new this.AMap.Pixel(-26, -26)
        }, {
          url: 'http://webapi.amap.com/theme/v1.3/m1.png',
          size: new this.AMap.Size(52, 52),
          offset: new this.AMap.Pixel(-26, -26)
        }, {
          url: 'http://webapi.amap.com/theme/v1.3/m1.png',
          size: new this.AMap.Size(52, 52),
          offset: new this.AMap.Pixel(-26, -26)
        }, {
          url: 'http://webapi.amap.com/theme/v1.3/m1.png',
          size: new this.AMap.Size(52, 52),
          offset: new this.AMap.Pixel(-26, -26)
        }, {
          url: 'http://webapi.amap.com/theme/v1.3/m1.png',
          size: new this.AMap.Size(52, 52),
          offset: new this.AMap.Pixel(-26, -26)
        }],
        renderMarker: this._renderMarker
      })
      const _this = this
      this.cluster.on('click', function (e) {
        if (e.clusterData.length >= 2) {
          let curZoom = _this.map.getZoom()
          if (curZoom < 20) {
            curZoom += 1.1
          }
          _this.map.setZoomAndCenter(curZoom, e.lnglat, true)
        }
      })
      this.map.setFitView(null, true)
    },
    viewDetail () {
      this.$emit('viewDetail', this.windowData)
    },
    // 下级区划
    subDivision (data) {
      const index = this.polygonList.findIndex((polygon) => {
        return polygon.area.parent.id === data.area.id
      })
      if (index !== -1) {
        const zoom = parseInt(this.polygonList[index].minLevel)
        this.map.setZoom(zoom + 0.1)// 避免上级区划和下级区划会有重叠
      } else {
        this.$message({
          type: 'info',
          message: '暂无下级区划'
        })
      }
    },
    belongUnits () {
      this.$emit('belongUnits', this.windowData)
    },
    _renderMarker (context) {
      const _this = this
      let url = ''
      switch (context.data[0].level) {
        case 1:
          url = require('@/components/bmap/images/icon_mass_red.png')
          break
        case 2:
          url = require('@/components/bmap/images/icon_mass_yellow.png')
          break
        case 3:
          url = require('@/components/bmap/images/icon_mass_orange.png')
          break
        case 4:
          url = require('@/components/bmap/images/icon_mass_blue.png')
          break
        default:
          url = require('@/components/bmap/images/icon_mass_green.png')
          break
      }
      const icon = new _this.AMap.Icon({
        size: new _this.AMap.Size(24, 24),
        image: url
      })

      context.marker.setIcon(icon)
      context.marker.setOffset(new this.AMap.Pixel(-12, -12))
      const lnglat = context.marker.getPosition()
      context.marker.on('click', function (e) {
        _this.openInfo({ ...context.data[0], lnglat: lnglat })
      })
    },
    // 设置地图中心点
    setCenter (data) {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      const position = [data.longitude, data.latitude]
      this.map.setZoomAndCenter(19, position, true)
      setTimeout(() => {
        this.openInfo({ ...data, address: data.addr, lnglat: position })
      }, 100)// 地图缩放会直接清除信息窗体，设为异步
    }

  }
}
</script>

<style lang="scss" scoped>
.map-wrapper,.map-content {
  height: 100%;
  .map{
    width: 100%;
    height: 100%;
  }
}
</style>
