<template>
  <div class="dark map-wrapper">
    <div id="map" class="map" />
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'PositionPicker',
  props: {
    address: {
      type: String,
      default: ''
    }, // 传入位置
    position: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      map: null,
      AMap: null,
      positionPicker: null,
      positionResult: null
    }
  },
  watch: {
    // points: {
    //   deep: true, // 深度监听
    //   handler(newVal, oldVal) {
    //     this.drawPoints(newVal)
    //   }
    // }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    mapPosition () {
      const _this = this
      if (this.position) {
        const lng = this.position.split(',')[0]
        const lat = this.position.split(',')[1]
        const lnglat = new this.AMap.LngLat(lng, lat)
        this.positionPicker.start(lnglat)
      } else {
        if (this.address) {
          const geocoder = new this.AMap.Geocoder({
            city: '全国'
          })
          geocoder.getLocation(this.address, function (status, result) {
            if (status === 'complete' && result.geocodes.length) {
              const lnglat = result.geocodes[0].location
              _this.positionPicker.start(lnglat)
            } else {
              _this.$message({
                message: '根据地址查询位置失败',
                type: 'error'
              })
            }
          })
        } else {
          const geolocation = new this.AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            showButton: false, // 显示定位按钮，默认：true
            showMarker: false, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false // 定位成功后将定位到的位置作为地图中心点，默认：true
          })
          geolocation.getCurrentPosition(function (status, result) {
            if (status === 'complete') {
              _this.positionPicker.start(result.position)
            } else {
              _this.$message({
                message: '浏览器定位失败',
                type: 'error'
              })
            }
          })
        }
      }
    },
    initMap () {
      AMapLoader.load({
        key: '246ece196d8b155d1366f4bb2985af5e', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Geocoder', 'AMap.Geolocation'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: { // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 缺省 1.1
          plugins: ['misc/PositionPicker'] // 需要加载的 AMapUI ui插件
        }
      }).then((AMap) => {
        this.map = new AMap.Map('map', {
          zoom: 16
        })
        this.AMap = AMap
        this.positionPicker = new AMapUI.PositionPicker({
          mode: 'dragMarker',
          map: this.map
        })
        const _this = this
        this.mapPosition()
        this.positionPicker.on('success', function (positionResult) {
          _this.positionResult = positionResult
        })
        this.positionPicker.on('fail', function (positionResult) {
          _this.$message({
            message: '地图定位失败',
            type: 'error'
          })
        })
      }).catch(e => {
        console.log(e)
      })
    },
    upDateLnglat () {
      if (this.positionResult) {
        this.$emit('update:position', `${this.positionResult.position.lng}, ${this.positionResult.position.lat}`)
      }
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
