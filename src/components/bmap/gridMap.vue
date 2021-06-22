<template>
  <div class="map-wrapper">
    <div id="gridMap" class="map" />
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { getCenterPoint } from '@/utils/mapCommon'
export default {
  name: 'DrawPolygon',
  props: {
    position: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      map: null,
      AMap: null,
      overlays: [],
      mouseTool: null
    }
  },
  watch: {},
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      AMapLoader.load({
        key: '246ece196d8b155d1366f4bb2985af5e', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        this.map = new AMap.Map('gridMap', {
          zoom: 15,
          layers: [new AMap.TileLayer.Satellite()]
        })
        this.AMap = AMap
        const path1 = [
          new AMap.LngLat(120.356096, 36.08574),
          new AMap.LngLat(120.354079, 36.083451),
          new AMap.LngLat(120.357233, 36.08163),
          new AMap.LngLat(120.359357, 36.083971)
        ]
        const path2 = [
          new AMap.LngLat(120.36043, 36.085753),
          new AMap.LngLat(120.360827, 36.08303),
          new AMap.LngLat(120.362823, 36.082597),
          new AMap.LngLat(120.362801, 36.083187),
          new AMap.LngLat(120.362844, 36.083672),
          new AMap.LngLat(120.362651, 36.084383),
          new AMap.LngLat(120.362394, 36.085354)
        ]
        const path3 = [
          new AMap.LngLat(120.359786, 36.080204),
          new AMap.LngLat(120.358992, 36.079371),
          new AMap.LngLat(120.360688, 36.078123),
          new AMap.LngLat(120.360967, 36.078331),
          new AMap.LngLat(120.360945, 36.078868),
          new AMap.LngLat(120.360859, 36.079632)
        ]
        // const path4 = [
        //   new AMap.LngLat(120.356096, 36.08574),
        //   new AMap.LngLat(120.354079, 36.083451),
        //   new AMap.LngLat(120.357233, 36.08163),
        //   new AMap.LngLat(120.359357, 36.083971)
        // ]
        // const path5 = [
        //   new AMap.LngLat(120.356096, 36.08574),
        //   new AMap.LngLat(120.354079, 36.083451),
        //   new AMap.LngLat(120.357233, 36.08163),
        //   new AMap.LngLat(120.359357, 36.083971)
        // ]
        this.addPolygon(path1, '#084fe8', 'A楼')
        this.addPolygon(path2, '#e80c0c', 'B楼')
        this.addPolygon(path3, '#ffba00', 'C楼')
      }).catch(e => {
        console.log(e)
      })
    },
    addPolygon (data, color, mapText) {
      const polygon = new this.AMap.Polygon({
        path: data,
        fillColor: color,
        strokeOpacity: 1,
        fillOpacity: 0.5,
        strokeColor: '#2b8cbe',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [5, 5]
      })
      const position = getCenterPoint(data)
      const text = new this.AMap.Text({
        text: mapText,
        anchor: 'center', // 设置文本标记锚点
        draggable: true,
        cursor: 'pointer',
        angle: 0,
        style: {
          padding: '4px 6px',
          'border-radius': '5px',
          'background-color': '#0180ff',
          'border-width': 1,
          'text-align': 'center',
          'font-size': '12px',
          'line-height': '12px',
          color: '#fff'
        },
        position: [position.lng, position.lat]
      })
      text.setMap(this.map)
      polygon.on('mouseover', () => {
        polygon.setOptions({
          fillOpacity: 0.7,
          fillColor: color
        })
      })
      polygon.on('mouseout', () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          fillColor: color

        })
      })
      this.map.add(polygon)
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
