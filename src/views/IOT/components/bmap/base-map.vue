<template>
  <div class="map-wrapper">
    <div id="map" class="map iotMap" />
    <div style="display:none">
      <info-window ref="infoWindow" :window-data="windowData" @viewDetail="viewDetail" />
    </div>
  </div>
</template>

<script>
import './style/index.scss'
import InfoWindow from './infoWindow'
import commonMap from '@/mixins/commonMap.js'
export default {
  name: 'BaseMap',
  components: {
    InfoWindow
  },
  mixins: [commonMap],
  props: {
    officeList: {
      type: Array,
      default: () => []
    }// 初始化地图点数据（单位列表）
  },
  data() {
    return {
      plugins: ['AMap.MassMarks', 'AMap.DistrictSearch'],
      windowData: {},
      infoWindow: null,
      mass: null,
      isDrawGrid: false,
      alertMarkers: [],
      layers: 'satelliteRoadNet' // default(默认标准图层) satellite（卫星图）satelliteRoadNet（卫星图加路网）
    }
  },
  mounted() {
    this.initMassMarks()
  },
  destroyed() {
    this.map && this.map.destroy()
  },
  methods: {
    openInfo(data) {
      this.windowData = data
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs.infoWindow.$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, data.lnglat)
      })
    },
    async initMassMarks() {
      await this.initMap()
      this.mass = new this.AMap.MassMarks([], {
        opacity: 1,
        cursor: 'pointer',
        style: [{
          url: require('./images/icon_mass_green.png'),
          anchor: new this.AMap.Pixel(4, 4),
          size: new this.AMap.Size(24, 24),
          zIndex: 1
        }, {
          url: require('./images/icon_mass_red.png'),
          anchor: new this.AMap.Pixel(4, 4),
          size: new this.AMap.Size(24, 24),
          zIndex: 2
        }]
      })
      this.mass.setMap(this.map)
      const _this = this
      this.mass.on('click', function(e) {
        _this.openInfo(e.data)
      })
      this.drawPoints(this.officeList)
      this.$watch('officeList', function() {
        this.drawPoints()
      }, { deep: true })
    },
    // 绘制点
    drawPoints() {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      if (this.mass) {
        this.mass.clear()
      }
      if (this.alertMarkers.length > 0) {
        this.map.remove(this.alertMarkers)
      }
      const points = []
      this.officeList.forEach(item => {
        if (item.longitude && item.latitude) {
          var point = {
            lnglat: [item.longitude, item.latitude],
            name: item.name || item.officeName,
            id: item.id || item.officeId,
            address: item.address || item.addr,
            isAlert: item.isAlert,
            style: 2
          }
          if (item.isAlert !== 0) {
            const markerContent = '<div class="custom-content-marker" style="pointer-events: none;"></div>'
            const marker = new this.AMap.Marker({
              position: [item.longitude, item.latitude],
              content: markerContent,
              offset: new this.AMap.Pixel(-24, -24)
            })
            this.alertMarkers.push(marker)
            this.map.add(marker)
            point.style = 1
          }
          points.push(point)
        }
      })
      this.mass.setData(points)
      this.map.setFitView(null, true)
    },
    // 设置地图中心点
    setCenter(data) {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      const position = [data.longitude, data.latitude]
      this.map.setZoomAndCenter(16, position, true)
      setTimeout(() => {
        this.openInfo({ ...data, address: data.address, lnglat: position })
      }, 0)// 地图缩放会直接清除信息窗体，设为异步
    },
    viewDetail() {
      this.$emit('viewDetail', this.windowData)
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

