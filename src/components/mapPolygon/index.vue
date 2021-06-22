
<script>
// 修改百度地图基础多边形组件，为BMap.Polygon类增加remarks（区域描述）areaName（区域名称）
// areaId（区域id）areaParentId（区域父级id）区域名称（自定义覆盖物label标注）areaType（区域类型）属性
import commonMixin from './base/common.js'
import bindEvents from './base/bindEvent.js'
import { createPoint } from './base/factory.js'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'bm-polygon',
  render() {},
  mixins: [commonMixin('overlay')],
  props: {
    path: {
      type: Array,
      default() {
        return []
      }
    },
    remarks: {
      type: String
    },
    strokeColor: {
      type: String
    },
    strokeWeight: {
      type: Number
    },
    strokeOpacity: {
      type: Number
    },
    strokeStyle: {
      type: String
    },
    fillColor: {
      type: String
    },
    fillOpacity: {
      type: Number
    },
    massClear: {
      type: Boolean,
      default: true
    },
    clicking: {
      type: Boolean,
      default: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    path: {
      handler(val, oldVal) {
        this.reload()
      },
      deep: true
    },
    strokeColor(val) {
      this.originInstance.setStrokeColor(val)
    },
    strokeOpacity(val) {
      this.originInstance.setStrokeOpacity(val)
    },
    strokeWeight(val) {
      this.originInstance.setStrokeWeight(val)
    },
    strokeStyle(val) {
      this.originInstance.setStrokeStyle(val)
    },
    fillColor(val) {
      this.originInstance.setFillColor(val)
    },
    fillOpacity(val) {
      this.originInstance.setFillOpacity(val)
    },
    // remarks (val) {
    //    this.originInstance.setRemarks(val)
    // },
    editing(val) {
      val ? this.originInstance.enableEditing() : this.originInstance.disableEditing()
    },
    massClear(val) {
      val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
    },
    clicking(val) {
      this.reload()
    }
  },
  methods: {
    load() {
      const { BMap, map, path, strokeColor, remarks, strokeWeight, strokeOpacity, strokeStyle, fillColor, fillOpacity, editing, massClear, clicking } = this
      const overlay = new BMap.Polygon(path.map(item => createPoint(BMap, { lng: item.lng, lat: item.lat })), {
        strokeColor,
        strokeWeight,
        strokeOpacity,
        strokeStyle,
        fillColor,
        fillOpacity,
        // enableEditing: editing,
        enableMassClear: massClear,
        enableClicking: clicking
      })
      overlay.remarks = remarks
      this.originInstance = overlay
      map.addOverlay(overlay)
      bindEvents.call(this, overlay)
      // 这里有一个诡异的bug，直接给 editing 赋值时会出现未知错误，因为使用下面的方法抹平。
      editing ? overlay.enableEditing() : overlay.disableEditing()
    }
  }
}
</script>
