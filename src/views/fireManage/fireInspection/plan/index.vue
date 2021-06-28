<template>
  <el-container class="main inspect-main check-plan">
    <div class="search-box" style="display: flex">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <el-main
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="content"
    >
      <div class="left">
        <TreeNode
          :model="'childClick'"
          :lazy="true"
          :load="loadNode"
          :empty-text="'暂无平面图'"
          @handleNodeClick="handleNodeClick"
        />
      </div>
      <div class="mark-paper__container">
        <div class="title" />
        <div ref="wrapRef" class="mark-paper__wrap">
          <div ref="pointContainerRef" class="mark-point__container">
            <span v-for="point in points" :key="point.id" :class="point.isDanger===1?'danger':point.isChecked===1?'checked':'noChecked'" class="point" :style="{left:`${point.planX}px`,top:`${point.planY}px` }">{{ point.typeName }}</span>
            <canvas ref="canvasRef" class="mark-paper__canvas" />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'
import { getfloorPlanPart, getfloorPlanPartsAddr, getfloorPlanInfo } from '@/api/partsList'
import { handlerChkPlanList } from '@/api/companyHome'
import { getURLBase64 } from '@/utils/getURLBase64'
import SearchForm from '@/components/searchForm'
import TreeNode from '@/components/treeNode'

export default {
  /* 平面图 */
  name: 'FirePlan',
  components: {
    SearchForm,
    TreeNode
  },
  mixins: [formAction],
  data () {
    return {
      canvasRef: null,
      containerRef: null,
      wrapRef: null,
      pointContainerRef: null,
      translatePointXRef: 0,
      translatePointYRef: 0,
      fillStartPointXRef: 0,
      fillStartPointYRef: 0,
      canvasHistroyListRef: [],
      lineColor: '#fa4b2a',
      fillImageSrc: '',
      mouseMode: 0,
      lineWidth: 5,
      canvasScale: 1,
      loading: false,
      canvasCurrentHistory: 0,
      listLoading: false,
      activeName: 'inspectionPoint',
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '检查任务:',
            name: 'planId',
            placeholder: '请选择检查任务',
            dataList: []
          },
          {
            type: 'endTime',
            label: '检查时间:',
            name: 'startTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          },
          {
            type: 'datetime',
            label: '至',
            name: 'endTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        ]
      },
      listQuery: {
        planId: null,
        beginTime: '',
        endTime: ''
      },
      node_had: '',
      resolve_had: '',
      points: [],
      buildingTreeData: []
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
  mounted () {
    this.canvasRef = this.$refs.canvasRef
    this.wrapRef = this.$refs.wrapRef
    this.pointContainerRef = this.$refs.pointContainerRef
    this.canvasScale = 1
    this.fillImage()
  },
  created () {
    this._handlerChkPlanList()
  },
  methods: {
    // 巡查任务字典值
    _handlerChkPlanList () {
      handlerChkPlanList().then((res) => {
        if (res.data) {
          this.searchFormOption.config = this.searchFormOption.config.map(
            (config) => {
              if (config.name === 'planId') {
                return { ...config, dataList: res.data }
              }
              return { ...config }
            }
          )
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this.node_had.childNodes = []// 把存起来的node的子节点清空，不然会界面会出现重复树！
      this.loadNode(this.node_had, this.resolve_had)// 再次执行懒加载的方法
    },
    // 获取楼座列表
    _getfloorPlanPart (resolve) {
      getfloorPlanPart(this.listQuery).then((res) => {
        if (res.data) {
          resolve(res.data.map((item) => {
            return { ...item, level: 0 }
          }))
        }
      }).catch((error) => { console.log(error) })
    },
    // 根据楼座查询楼层
    _getfloorPlanPartsAddr (node, resolve) {
      getfloorPlanPartsAddr({ partId: node.data.id }).then((res) => {
        if (res.data) {
          resolve(res.data)
        }
      }).catch((error) => { console.log(error) })
    },
    loadNode (node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
        this.node_had = node// node.level == 0的node存起来(刷新数据)
        this.resolve_had = resolve// 把node.level == 0的resolve存起来(刷新数据)
        this._getfloorPlanPart(resolve)
      }
      // 其余节点处理
      if (node.level === 1) {
        // 把resolve传到自己的异步中去
        this._getfloorPlanPartsAddr(node, resolve)
      } else { // (当前逻辑只有二级节点)
        resolve([])
      }
    },
    handleClick () {},
    async handleNodeClick (data, node) {
      if (node.data.level === 0) {
        return
      }
      this.loading = true
      try {
        const planData = await this.getBuildingPlan(data.id)
        this.fillImageSrc = planData.fileUrl
        this.points = planData.points
      } catch (error) {
        this.loading = false
        return
      }
      this.fillImage()
    },
    getBuildingPlan (id) {
      return new Promise((resolve, reject) => {
        getfloorPlanInfo({ partAddrId: id }).then((res) => {
          if (res.data && res.data.fileUrl && res.data.points) {
            const points = res.data.points.filter((point) => { // 未设置巡查点位置则不显示
              return point.planX && point.planY
            })
            resolve({ fileUrl: res.data.fileUrl, points })
          } else {
            this.$message({
              type: 'info',
              message: '该楼层暂无平面图'
            })
            this.fillImageSrc = ''
            this.fillImage()
          }
        }).catch(() => {
          reject(console.log('error'))
        })
      })
    },
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
      try {
        img.src = await getURLBase64(this.fillImageSrc)
      } catch (error) {
        this.$message({
          type: 'error',
          message: error
        })
        this.loading = false
        return
      }
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
        this.drawArrow(context, 100, 100, 300, 300)
        // 设置变化基点，为画布容器中央
        if (wrap) {
          canvas.style.transformOrigin = `${wrap.offsetWidth / 2}px ${
            wrap.offsetHeight / 2
          }px`
          pointContainer.style.transformOrigin = `${wrap.offsetWidth / 2}px ${
            wrap.offsetHeight / 2
          }px`
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
      canvas.onmousemove = (event) => {
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

        // 如果此时处于撤销状态，此时再使用画笔，则将之后的状态清空，以刚画的作为最新的画布状态
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

    handleMoveMode (downX, downY) {
      const canvas = this.canvasRef
      const wrap = this.wrapRef
      const pointContainer = this.pointContainerRef
      const fillStartPointX = this.fillStartPointXRef
      const fillStartPointY = this.fillStartPointYRef
      if (!canvas || !wrap || this.mouseMode !== 0) return

      // 为容器添加移动事件，可以在空白处移动图片
      wrap.onmousemove = (event) => {
        const moveX = event.pageX
        const moveY = event.pageY

        this.translatePointXRef = fillStartPointX + (moveX - downX)
        this.translatePointYRef = fillStartPointY + (moveY - downY)

        // canvas.style.transform = `scale(${this.canvasScale},${this.canvasScale}) translate(${this.translatePointXRef}px,${this.translatePointYRef}px)`
        pointContainer.style.transform = `scale(${this.canvasScale},${this.canvasScale}) translate(${this.translatePointXRef}px,${this.translatePointYRef}px)`
      }

      wrap.onmouseup = (event) => {
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
      wrap.onwheel = (e) => {
        const { deltaY } = e
        const newScale =
          deltaY > 0
            ? (this.canvasScale * 10 - 0.1 * 10) / 10
            : (this.canvasScale * 10 + 0.1 * 10) / 10
        if (newScale < 0.1 || newScale > 2) return
        this.canvasScale = newScale
      }
    },
    handleScaleChange (value) {
      this.canvasScale = value
    },
    drawArrow (ctx, x1, y1, x2, y2) {
      // 参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标
      var sta = [x1, y1]
      var l = Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 1 / 2)
      x2 = x2 - (20 / l) * (x2 - x1)
      x2 = x2.toFixed(0)
      y2 = y2 - (20 / l) * (y2 - y1)
      y2 = y2.toFixed(0)
      var end = [x2, y2]
      // 画线
      ctx.beginPath() // 丢弃任何当前定义的路径并且开始一条新的路径。它把当前的点设置为 (0,0)
      ctx.translate(0, 0, 0) // 坐标原点 为画布的变换矩阵添加水平的和垂直的偏移
      ctx.moveTo(sta[0], sta[1]) // 窗口的左上角移动到一个指定的坐标
      ctx.lineTo(end[0], end[1]) // 方法添加一个新点，然后创建从该点到画布中最后指定点的线条
      ctx.strokeStyle = '#0000ff'
      ctx.fill() // 方法使用 fillStyle 属性所指定的颜色、渐变和模式来填充当前路径
      ctx.lineWidth = 3
      ctx.stroke() // 绘制当前路径的边框。路径定义的几何线条产生了，但线条的可视化取决于 strokeStyle、lineWidth、lineJoin、lineCap 和 miterLimit 等属性
      ctx.save() //
      // 画箭头
      ctx.translate(end[0], end[1])
      // 我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
      var ang = (end[0] - sta[0]) / (end[1] - sta[1])
      ang = Math.atan(ang)
      if (end[1] - sta[1] >= 0) {
        ctx.rotate(-ang)
      } else {
        ctx.rotate(Math.PI - ang) // 加个180度，反过来
        // ctx.scale(1, 0.2);
      }
      ctx.lineTo(-10, -20)
      ctx.lineTo(0, -5)
      ctx.lineTo(10, -20)
      ctx.lineTo(0, 0)
      ctx.fillStyle = '#0000ff'
      ctx.fill() // 箭头是个封闭图形
      ctx.lineWidth = 3
      ctx.restore() // 恢复到堆的上一个状态
      ctx.closePath()
    }
  }
}
</script>

<style scoped lang="scss">
/* 平面图 */
.main {
  display: flex;
  flex-direction: column;
  background-color: #001647;
  .content {
    padding: 0;
    display: flex;
    flex: 1;
    .left {
      width: 185px;
      padding: 12px;
      overflow-y: auto;
      background: rgba(255, 255, 255, 0.07);
    }
    .mark-paper__container {
      height: 100%;
      margin-left: 18px;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      .title {
        height: 36px;
        padding-left: 12px;
        line-height: 32px;
        font-size: 14px;
        color: #97c1ff;
        font-weight: bold;
      }
      .mark-point__container {
        position: relative;
      }
      .point {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        &.checked{
          background: green;
        }
        &.danger{
          background: red;
        }
        &.noChecked{
          background: yellow;
        }
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
    .right {
      width: 185px;
      padding: 12px;
      overflow-y: auto;
      margin-left: 18px;
      background: rgba(255, 255, 255, 0.07);
    }
  }
}

/* 平面图 */

</style>
<style lang="scss">
.check-plan{
  .el-tabs {
        .el-tabs__header {
          margin: 0 0 20px;
          .el-tabs__nav-wrap {
            .el-tabs__nav-scroll {
              .el-tabs__nav {
                display: flex;
                justify-content: space-between;
                width: 100%;

                .el-tabs__active-bar {
                  display: none;
                }

                .el-tabs__item {
                  height: 28px;
                  padding: 0 16px;
                  line-height: 28px;
                  text-align: center;
                  color: #fff;
                  font-size: 14px;
                  border-radius: 5px;
                  background: #0b84c4;

                  &.is-active {
                    background: #12568f;
                  }
                }
              }
            }
          }

          .el-tabs__nav-wrap::after {
            display: none;
          }
        }
      }
  }
</style>
