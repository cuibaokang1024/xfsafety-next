<template>
  <div class="planPosition-wrapper" style="width: 100%;">
    <div class="select-wrapper">
      <el-input v-model="position" placeholder="请选择" @focus="handleShow" />
      <el-button
        slot="append"
        class="select-btn"
        icon="el-icon-location-outline"
        @click="handleShow"
      />
    </div>
    <!-- 地图弹窗 -->
    <el-dialog
      v-if="dialogMapVisible"
      width="930px"
      class="dark planPosition"
      v-model:visible="dialogMapVisible"
      append-to-body
      :destroy-on-close="true"
    >
      <div name="title" class="dialog-title">平面图定位</div>
      <div class="dialog-content" style="height: 400px;padding: 0;">
        <div class="mark-paper__container">
          <div ref="wrapRef" class="mark-paper__wrap">
            <div ref="pointContainerRef" class="mark-point__container" @mousemove="handlePointMove">
              <div ref="point" :style="{left:`${initPosition.x}px`,top:`${initPosition.y}px` }" class="point" @mousemove.stop="" @mousedown.stop="isPointPress = true" @mouseup="isPointPress = false" />
              <canvas ref="canvasRef" class="mark-paper__canvas" />
            </div>
          </div>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide">关闭</el-button>
        <el-button @click="handlerSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 地图弹窗 -->
  </div>
</template>

<script>
import { getURLBase64 } from '@/utils/getURLBase64'
import { getFilesByBuildingId } from '@/api/inspection'
export default {
  name: 'PlanPosition',
  props: {
    initPosition: {
      type: Object,
      default: () => {}
    },
    partAddrId: {
      type: [Number, String],
      default: -1
    }
  },
  data () {
    return {
      dialogMapVisible: false,
      canvasRef: null,
      containerRef: null,
      wrapRef: null,
      pointContainerRef: null,
      translatePointXRef: 0,
      translatePointYRef: 0,
      fillStartPointXRef: 0,
      fillStartPointYRef: 0,
      canvasHistroyListRef: [],
      point: null,
      lineColor: '#fa4b2a',
      fillImageSrc: '',
      mouseMode: 0,
      lineWidth: 5,
      canvasScale: 1,
      moveX: 0,
      moveY: 0,
      loading: false,
      isPointPress: false,
      canvasCurrentHistory: 0
    }
  },
  computed: {
    position () {
      return `x:${this.initPosition.x},y:${this.initPosition.y}`
    }
  },
  watch: {
    canvasScale (val) {
      this.handleCanvas()
      this.scalCanvas()
    },
    canvasCurrentHistory (val) {
      this.handleCanvas()
    }
  },
  mounted () {},
  created () {},
  methods: {
    async fillImage () {
      const canvas = this.canvasRef
      const wrap = this.wrapRef
      const pointContainer = this.pointContainerRef
      const context = canvas && canvas.getContext('2d')
      const img = new Image()
      if (!canvas || !wrap || !context) return
      if (!this.fillImageSrc) {
        canvas.width = 0
        canvas.height = 0
        this.loading = false
      }
      img.src = await getURLBase64(this.fillImageSrc)
      img.onload = () => {
        // 渲染图片
        canvas.width = img.width
        canvas.height = img.height
        pointContainer.style.width = `${img.width}px`
        pointContainer.style.height = `${img.height}px`

        // 背景设置为图片
        canvas.style.background = `url(${img.src})`
        context.drawImage(img, 0, 0)
        context.strokeStyle = this.lineColor
        context.lineWidth = this.lineWidth
        context.lineJoin = 'round'
        context.lineCap = 'round'
        // 设置变化基点，为画布容器中央
        if (wrap) {
          canvas.style.transformOrigin = `${wrap.offsetWidth /
            2}px ${wrap.offsetHeight / 2}px`
          pointContainer.style.transformOrigin = `${wrap.offsetWidth /
            2}px ${wrap.offsetHeight / 2}px`
        }

        // 清除上一次变化的效果
        canvas.style.transform = ''
        pointContainer.style.transform = ''
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )
        this.canvasHistroyListRef = []
        this.canvasHistroyListRef.push(imageData)
        // canvasCurrentHistoryRef = 1
        this.canvasCurrentHistory = 1
        this.handlePointMove()
      }
      img.onerror = null
      this.loading = false
    },
    scalCanvas () {
      const pointContainer = this.pointContainerRef
      const translatePointX = this.translatePointXRef
      const translatePointY = this.translatePointYRef
      pointContainer &&
        (pointContainer.style.transform = `scale(${this.canvasScale},${this.canvasScale}) translate(${translatePointX}px,${translatePointY}px)`)
    },
    generateLinePoint (x, y) {
      const { current: wrap } = this.wrapRef
      const { current: translatePointX } = this.translatePointXRef
      const { current: translatePointY } = this.translatePointYRef
      const wrapWidth = wrap ? wrap.offsetWidth : 0
      const wrapHeight = wrap ? wrap.offsetHeight : 0
      const canvasScale = this.canvasScale
      // 缩放位移坐标变化规律
      // (transformOrigin - downX) / scale * (scale-1) + downX - translateX = pointX
      const pointX =
        ((wrapWidth / 2 - x) / canvasScale) * (canvasScale - 1) +
        x -
        translatePointX
      const pointY =
        ((wrapHeight / 2 - y) / canvasScale) * (canvasScale - 1) +
        y -
        translatePointY

      return {
        pointX,
        pointY
      }
    },

    handleLineMode (downX, downY) {
      const canvas = this.canvasRef
      const wrap = this.wrapRef
      const context = canvas && canvas.getContext('2d')
      if (!canvas || !wrap || !context) return

      const offsetLeft = canvas.offsetLeft
      const offsetTop = canvas.offsetTop
      // 减去画布偏移的距离（以画布为基准进行计算坐标）
      downX = downX - offsetLeft
      downY = downY - offsetTop

      const { pointX, pointY } = this.generateLinePoint(downX, downY)
      context.globalCompositeOperation = 'source-over'
      context.beginPath()
      context.moveTo(pointX, pointY)

      canvas.onmousemove = null
      canvas.onmousemove = event => {
        const moveX = event.pageX - offsetLeft
        const moveY = event.pageY - offsetTop
        const { pointX, pointY } = this.generateLinePoint(moveX, moveY)
        context.lineTo(pointX, pointY)
        context.stroke()
      }
      canvas.onmouseup = () => {
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )
        if (this.canvasCurrentHistory < this.canvasHistroyListRef.length) {
          this.canvasHistroyListRef = this.canvasHistroyListRef.slice(
            0,
            this.canvasCurrentHistory
          )
        }
        this.canvasHistroyListRef.push(imageData)
        this.setCanvasCurrentHistory(this.canvasCurrentHistory + 1)
        context.closePath()
        canvas.onmousemove = null
        canvas.onmouseup = null
      }
    },
    handlePointMove (event) {
      if (!this.isPointPress) {
        return null
      }
      const point = this.point
      point.style.left = `${event.offsetX}px`
      point.style.top = `${event.offsetY}px`
      this.moveX = event.offsetX
      this.moveY = event.offsetY
    },
    handleMoveMode (downX, downY) {
      const canvas = this.canvasRef
      const wrap = this.wrapRef
      const pointContainer = this.pointContainerRef
      const fillStartPointX = this.fillStartPointXRef
      const fillStartPointY = this.fillStartPointYRef
      if (!canvas || !wrap || this.mouseMode !== 0) return

      // 为容器添加移动事件，可以在空白处移动图片
      wrap.onmousemove = event => {
        const moveX = event.pageX
        const moveY = event.pageY
        this.translatePointXRef = fillStartPointX + (moveX - downX)
        this.translatePointYRef = fillStartPointY + (moveY - downY)

        // canvas.style.transform = `scale(${this.canvasScale},${this.canvasScale}) translate(${this.translatePointXRef}px,${this.translatePointYRef}px)`
        pointContainer.style.transform = `scale(${this.canvasScale},${this.canvasScale}) translate(${this.translatePointXRef}px,${this.translatePointYRef}px)`
      }

      wrap.onmouseup = event => {
        const upX = event.pageX
        const upY = event.pageY
        wrap.onmousemove = null
        wrap.onmouseup = null
        this.fillStartPointXRef = fillStartPointX + (upX - downX)
        this.fillStartPointYRef = fillStartPointY + (upY - downY)
      }
    },
    handleCanvas () {
      const canvas = this.canvasRef
      const wrap = this.wrapRef
      const context = canvas && canvas.getContext('2d')
      if (!context || !wrap) return

      // 清除上一次设置的监听，以防获取参数错误
      wrap.onmousedown = null
      const _this = this
      wrap.onmousedown = function (event) {
        const downX = event.pageX
        const downY = event.pageY
        _this.handleMoveMode(downX, downY)
      }

      wrap.onwheel = null
      wrap.onwheel = e => {
        const { deltaY } = e
        const newScale =
          deltaY > 0
            ? (this.canvasScale * 10 - 0.1 * 10) / 10
            : (this.canvasScale * 10 + 0.1 * 10) / 10
        if (newScale < 0.1 || newScale > 2) return
        this.canvasScale = newScale
      }
    },
    getBuildingPlan (id) {
      return new Promise((resolve, reject) => {
        getFilesByBuildingId({ buildingId: id })
          .then(res => {
            if (res.data && res.data.fileUrl) {
              resolve(res.data.fileUrl)
            } else {
              this.$message({
                type: 'error',
                message: '该楼层暂无平面图'
              })
              this.fillImageSrc = ''
              this.fillImage()
            }
          })
          .catch(() => {
            reject()
          })
      })
    },
    handleScaleChange (value) {
      this.canvasScale = value
    },
    async handleShow () {
      this.fillImageSrc = await this.getBuildingPlan(this.partAddrId)
      if (!this.fillImageSrc) {
        return false
      }
      this.dialogMapVisible = true
      this.$nextTick(() => {
        this.canvasRef = this.$refs.canvasRef
        this.wrapRef = this.$refs.wrapRef
        this.pointContainerRef = this.$refs.pointContainerRef
        this.point = this.$refs.point
        this.canvasScale = 1
        this.fillImage()
      }, 200)
    },
    handleHide () {
      this.dialogMapVisible = false
    },
    handlerSubmit () {
      this.dialogMapVisible = false
      this.$emit('getPosition', { x: this.moveX, y: this.moveY })
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-paper__container {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .mark-point__container {
    position: relative;
  }
  .point {
    position: absolute;
    background: chartreuse;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-top: -15px;
    margin-left: -15px;
    left: 30px;
    top: 30px;
  }
  .mark-paper__wrap {
    cursor: move;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: 1px solid #666;
    border-radius: 8px;
    background: #333;
  }
}
.planPosition-wrapper {
  .select-wrapper {
    position: relative;
    width: 100%;
    .select-btn {
      position: absolute;
      right: 0;
      top: 0px;
      border: none;
      font-weight: bold;
      color: #97c1ff;
      background: #00479d;
      border: 1px solid #00479d;
    }
  }
  .dialog-content {
    height: 400px;
    overflow-y: auto;
  }
}
</style>
<style lang="scss">
.planPosition {
  .el-dialog__body {
    // padding: 0 10px;
  }
}
</style>
