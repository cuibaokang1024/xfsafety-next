import AMapLoader from '@amap/amap-jsapi-loader'
import { mapGetters } from 'vuex'
import { getCenterPoint } from '@/utils/mapCommon'
export default {
  data() {
    return {
      map: null,
      AMap: null,
      polygons: [],
      texts: [],
      center: null,
      zoom: 0
    }
  },
  computed: {
    ...mapGetters(['areaId'])
  },
  methods: {
    initMap() {
      return new Promise((resolve, reject) => {
        AMapLoader.load({
          key: '246ece196d8b155d1366f4bb2985af5e', // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: [...this.plugins, 'AMap.MapType', 'AMap.ControlBar'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等

        }).then((AMap) => {
          this.AMap = AMap
          this.map = new AMap.Map('map', {
            rotateEnable: true,
            pitchEnable: true,
            pitch: 0,
            viewMode: '3D', // 开启3D视图,默认为关闭
            layers: this.getLayers(),
            animateEnable: true
          })
          const _this = this
          this.map.on('zoomstart', function() {
            if (_this.infoWindow) {
              _this.infoWindow.close()
            }
          })
          this.map.addControl(new AMap.ControlBar({
            position: {
              left: '10px',
              top: '10px'
            }
          }))
          this.map.addControl(new AMap.MapType({
            defaultType: 1,
            showRoad: true
          }))
          this.map.on('zoomchange', function(e) {
            const zoom = _this.map.getZoom()
            _this.zoom = _this.map.getZoom()
            if (!(_this.polygonList && _this.polygonList.length > 0)) {
              if (zoom > 14) {
                _this.map.remove(_this.polygons)
              } else {
                _this.map.add(_this.polygons)
              }
            }
          })
          if (this.polygonList) {
            this.addPolygon(this.polygonList)
            const index = this.polygonList.findIndex((polygon) => {
              return polygon.area.id === this.areaId
            })
            if (index !== -1) {
              const arr = this.polygonList[index].points.split(';')
              const path = arr.map((point) => {
                return new this.AMap.LngLat(Number(point.split(',')[0]), Number(point.split(',')[1]))
              })
              const centerPoint = getCenterPoint(path)
              this.map.setZoomAndCenter(this.polygonList[index].minLevel, centerPoint, true)
              // this.map.setCenter(centerPoint)
            }
            this.$watch('polygonList', function(newVal) { this.addPolygon(newVal) })
          } else {
            this.districtSearch()
          }
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    districtSearch(areaName) {
      var districtSearch = new this.AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 3,
        extensions: 'all'
      })
      const _this = this
      if (areaName) {
        districtSearch.search(areaName, function(status, result) {
          // 查询成功时，result即为对应的行政区信息
          if (result.districtList) {
            _this.$emit('setPolygonPath', result.districtList[0])
          } else {
            _this.$emit('setPolygonPath', null)
          }
        })
        return
      }
      // 搜索所有省/直辖市信息
      if (this.isDrawGrid) {
        districtSearch.search(this.areaName, function(status, result) {
          // 查询成功时，result即为对应的行政区信息
          if (result.districtList) {
            _this.getData(result.districtList[0])
          }
        })
      }
    },
    getLayers() {
      let layers = []
      switch (this.layers) {
        case 'default':
          layers = []
          break
        case 'satellite':
          layers = [new this.AMap.TileLayer.Satellite()]
          break
        case 'satelliteRoadNet':
          layers = [
            // 卫星
            new this.AMap.TileLayer.Satellite(),
            // 路网
            new this.AMap.TileLayer.RoadNet()
          ]
          break
        default:
          layers = []
          break
      }
      return layers
    },
    getData(data) {
      var bounds = data.boundaries
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          var polygon = new this.AMap.Polygon({
            map: this.map,
            strokeWeight: 1,
            strokeColor: 'rgb(47 28 169)',
            fillColor: '#5116d4',
            fillOpacity: 0.6,
            path: bounds[i]
          })
          this.polygons.push(polygon)
        }
        this.map.setCenter(data.center, true)
        this.map.setFitView(null, true)
      }
    },
    destroyMap() {
      this.map && this.map.destroy()
    },
    // 添加矢量覆盖物
    addPolygon(list) {
      // if (!this.polygonList.length > 0) {
      //   return false
      // }
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      const _this = this
      if (this.polygons && this.polygons.length > 0) {
        this.map.remove(this.polygons)
        this.polygons = []
      }
      if (this.texts && this.texts.length > 0) {
        this.map.remove(this.texts)
        this.texts = []
      }
      list.forEach((item) => {
        const arr = item.points.split(';')
        const path = arr.map((point) => {
          return new this.AMap.LngLat(Number(point.split(',')[0]), Number(point.split(',')[1]))
        })
        const polygon = new this.AMap.Polygon({
          strokeWeight: 1,
          strokeColor: 'rgb(47 28 169)',
          fillColor: item.bgColor,
          fillOpacity: 0.6,
          path,
          extData: item,
          zooms: [item.minLevel, item.maxLevel]
        })
        const centerPoint = getCenterPoint(path)
        const text = new this.AMap.Text({
          text: item.areaName,
          anchor: 'center', // 设置文本标记锚点
          draggable: false,
          cursor: 'pointer',
          angle: 0,
          extData: item,
          zooms: [item.minLevel, item.maxLevel],
          style: {
            'padding': '4px 6px',
            'border-radius': '5px',
            'background-color': '#0180ff',
            'border-width': 1,
            'text-align': 'center',
            'font-size': '12px',
            'line-height': '12px',
            'color': '#fff'
          },
          position: [centerPoint[0], centerPoint[1]]
        })
        text.setMap(this.map)
        if (this.openGridInfo) {
          text.on('click', (data) => {
            _this.openGridInfo({ ...data.target._opts.extData, lnglat: data.lnglat, polygon })
          })
        }
        // polygon.on('click', (data) => {
        //   _this.openInfo({ ...data.target._opts.extData, lnglat: data.lnglat, polygon: data.target })
        // })
        this.polygons.push(polygon)
        this.texts.push(text)
        // this.map.setFitView()
      })
      this.map.add(this.polygons)
    }
  }
}
