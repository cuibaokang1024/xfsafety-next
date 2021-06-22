<template>
  <div class="map-wrapper">
    <div id="map" class="map" />
    <div style="display: none">
      <DrawMapWindow ref="infoWindow" :window-data="windowData" v-on="$listeners" />
    </div>
    <div class="zoom">当前地图层级：{{ zoom }}</div>
  </div>
</template>

<script>
import { getCenterPoint } from '@/utils/mapCommon'
import DrawMapWindow from './drawMapWindow'
import commonMap from '@/mixins/commonMap.js'

export default {
  name: 'DrawPolygon',
  components: {
    DrawMapWindow
  },
  mixins: [commonMap],
  props: {
    position: {
      type: String,
      default: null
    },
    path: {
      type: String,
      default: ''
    },
    polygonList: {
      type: Array,
      default: () => []
    },
    isDrawBuilding: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      plugins: ['AMap.Polygon', 'AMap.LngLat', 'AMap.MouseTool', 'AMap.PolyEditor', 'AMap.DistrictSearch'], // 需要使用的的插件列表
      windowData: {},
      overlays: [],
      mouseTool: null,
      polygonEditor: null,
      polygon: null,
      polygons: [],
      infoWindow: null,
      mass: null,
      cancelEdit: false,
      alertMarkers: [],
      layers: 'satelliteRoadNet' // default(默认标准图层) satellite（卫星图）satelliteRoadNet（卫星图加路网）
    }
  },
  watch: {},
  unmounted () {
    this.map && this.map.destroy()
  },
  mounted () {
    this.initDrawMap()
  },
  methods: {
    openGridInfo (data) {
      this.windowData = data
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs.infoWindow.$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, data.lnglat)
      })
    },
    async initDrawMap () {
      if (!this.map) {
        await this.initMap()
      }
      const _this = this
      if (this.path) {
        this.initPolygon()
      }
      this.mouseTool = new this.AMap.MouseTool(this.map)// 地图鼠标工具
      this.mouseTool.on('draw', function (e) {
        _this.overlays.push(e.obj)
        _this.polygonEditor = new _this.AMap.PolyEditor(_this.map, e.obj)
        _this.polygonEditor.on('end', function (event) {
          _this.polygon = event.target
        })
        _this.polygonEditor.open()
        _this.mouseTool.close(false)
      })
    },
    editGraphics (data) {
      this.cancelEdit = false
      const options = data.polygon.getOptions()
      this.polygonEditor = new this.AMap.PolyEditor(this.map, data.polygon)
      const _this = this
      this.polygonEditor.on('end', function (event) {
        if (_this.cancelEdit) {
          data.polygon.setOptions(options)
        } else {
          _this.polygon = event.target
        }
      })
      this.polygonEditor.open()// 打开多边形编辑
      if (this.infoWindow) {
        this.infoWindow.close()
      }
    },
    cancelEditGraphics (data) {
      this.cancelEdit = true
      this.polygonEditor.close()
      this.polygonEditor = null
      this.polygon = null
    },
    draw (type, obj) {
      if (!(this.overlays && this.overlays.length > 0)) {
        this.mouseTool.polygon({
          fillOpacity: 0.5,
          fillColor: '#b7b000',
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#fff' // 线条颜色
        // 同Polyline的Option设置
        })
      } else {
        this.$message(
          {
            message: '已有绘制图形，请清除后重新绘制或编辑',
            type: 'info'
          }
        )
        return false
      }
    },
    // 清除矢量覆盖物
    clear () {
      if (this.overlays.length > 0) {
        this.map.remove(this.overlays)
        this.polygonEditor.close()
        this.polygonEditor = null
        this.polygon = null
        this.overlays = []
      }
    },
    // 获取绘制的矢量图形path
    getPolygon () {
      if (this.polygonEditor) {
        this.polygonEditor.close()
      }
      if (!this.polygon && !this.isDrawBuilding) {
        this.$message({
          type: 'info',
          message: '请先绘制网格'
        })
        return false
      }
      const path = this.polygon ? this.polygon.getPath() : ''
      this.$emit('setPolygon', path)
    },
    initPolygon () {
      const _this = this
      const arr = this.path.split(';')
      arr.pop()
      const path = arr.map((item) => {
        return new this.AMap.LngLat(Number(item.split(',')[0]), Number(item.split(',')[1]))
      })
      const polygon = new this.AMap.Polygon({
        path,
        fillOpacity: 0.5,
        fillColor: '#b7b000',
        borderWeight: 2,
        strokeColor: '#fff'
      })
      this.map.add(polygon)
      this.overlays.push(polygon)
      this.polygonEditor = new this.AMap.PolyEditor(this.map, polygon)
      this.polygonEditor.on('end', function (event) {
        _this.polygon = event.target
      })
      this.polygonEditor.open()// 打开多边形编辑
      const lng = getCenterPoint(path)[0]
      const lat = getCenterPoint(path)[1]

      const centerPoint = new this.AMap.LngLat(lng, lat) // 获取多边形中心点
      this.map.setCenter(centerPoint, true)
      this.map.setZoom(14)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper,.map-content {
  width: 100%;
  height: 100%;
  .map{
    width: 100%;
    height: 100%;
  }
  .zoom{
    position: absolute;
    left: 50%;
    top: 10px;
    padding: 6px 10px;
    border: 1px solid #0180ff;
    font-size: 14px;
    color: #f6ff00;
    font-weight: bold;
  }
}
</style>
