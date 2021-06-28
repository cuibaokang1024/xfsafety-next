<template>
  <div class="map-wrapper">
    <div id="map" class="map" />
    <div class="tools">
      <el-button type="primary" size="mini" icon="el-icon-location-outline" @click="mapEvent(model='query')">周边查询</el-button>
      <el-button type="primary" size="mini" icon="el-icon-location-outline" @click="routePlan">线路规划</el-button>
      <el-button type="primary" size="mini" icon="el-icon-location-outline" @click="mapEvent(model='dispatch')">分级调度</el-button>
    </div>
    <div style="display:none">
      <PeripheryQueryWindow ref="peripheryQueryWindow" :address="address" :model="model" @query="query" @dispatch="dispatch" @navigation="navigation" @openDevDetail="openDevDetail" />
      <GridMaterialInfoWindow ref="gridMaterialInfoWindow" :window-data="gridMaterialInfo" @query="query" />
    </div>
    <div id="panel" />
    <div class="search">
      <el-input v-model="keyword" class="input-with-select">
        <template #append>
          <el-button icon="el-icon-search" @click="keywordSearch" ></el-button>
        </template>
      </el-input>
      <div id="searchResults" />
      <transition name="fade">
        <div v-show="isShowMatchingList" ref="matchingOfficeList" class="matchingOfficeList">
          <div class="title">相关企业列表</div>
          <ul>
            <li v-for="office in matchingOfficeList" :key="office.id" :class="{active:selectedOfficeId === office.id }" @click="showOfficeInfo(office)">{{ office.name }}</li>
          </ul>
          <div v-show="!matchingOfficeList.length>0" class="noMatching">系统暂无匹配企业</div>
        </div>
      </transition>
    </div>
    <div v-show="isShowOfficeInfo" class="officeInfo">
      <div class="box-wrapper">
        <transition name="slide">
          <div v-show="isShowOfficeInfo&&isShowBaseInfo" class="baseInfo box">
            <div class="title">{{ officeInfo.name||'' }}</div>
            <div class="close" @click="slide('baseInfo')" />
            <div class="content">
              <p>{{ officeInfo.levelName||'' }}</p>
              <p>{{ `消防主管部门：${officeInfo.fireDeptName||''}` }}</p>
              <p>{{ `消防监督员：${officeInfo.fireMonitors||''}` }}</p>
              <p>{{ `单位所属行业：${officeInfo.industryName||''}` }}</p>
              <p>{{ `行业主管部门：${officeInfo.directDeptName||''}` }}</p>
              <p>{{ `位置：${officeInfo.addr||''}` }}</p>
              <p>{{ `归属区域：${officeInfo.areaName||''}` }}</p>
              <p>{{ `单位类型：${officeInfo.categoryName||''}` }}</p>
              <p>{{ `单位安全消防负责人：${officeInfo.primaryName||''}` }}</p>
              <p>{{ `联系电话：${officeInfo.primaryTel||''}` }}</p>
              <p>{{ `消防安全管理人：${officeInfo.deputyName||''}` }}</p>
              <p>{{ `联系电话：${officeInfo.deputyTel||''}` }}</p>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div v-show="!isShowBaseInfo" class="item" @click="slide('baseInfo')">
            <img src="./images/icon_bseInfo.png" alt="">
            <span class="text">基本信息</span>
          </div>
        </transition>
      </div>
      <div class="box-wrapper">
        <transition name="slide">
          <div v-show="isShowOfficeInfo&&isShowBuildingPlan" class="buildingPlan box">
            <div class="title">单位平面图</div>
            <div class="close" @click="slide('buildingPlan')" />
            <div class="image-wrapper">
              <template v-for="img in buildingPlanUrls" :key="img.url">
                <el-image  :src="img.url" lazy />
                <div class="name">{{ img.name }}</div>
              </template>
            </div>
            <div v-if="!buildingPlanUrls.length>0" class="noData">暂无数据</div>
          </div>
        </transition>
        <transition name="fade">
          <div v-show="!isShowBuildingPlan" class="item" @click="slide('buildingPlan')">
            <img src="./images/icon_buildingPlan.png" alt="">
            <span class="text">平面图</span>
          </div>
        </transition>
      </div>
      <div class="box-wrapper">
        <transition name="slide">
          <div v-show="isShowOfficeInfo&&isShowFirePlan" class="firePlan box">
            <div class="title">消防预案</div>
            <div class="close" @click="slide('firePlan')" />
            <BaseTable
              ref="BaseTable"
              :table-data="firePlanList"
              :table-config="firePlanConfig"
              :border="false"
              :table-height="'100%'"
            />
          </div>
        </transition>
        <transition name="fade">
          <div v-show="!isShowFirePlan" class="item" @click="slide('firePlan')">
            <img src="./images/icon_firePlan.png" alt="">
            <span class="text">消防预案</span>
          </div>
        </transition>
      </div>
    </div>
    <BaseForm
      ref="baseForm"
      :form-option="formOption"
      :is-reset-form-flag="isResetFormFlag"
      @formHide="baseFormHide"
      @createData="createData"
    >
      <template v-slot:fireOfficer>
        <el-input v-model="fireOfficerNames" placeholder="请选择人员" class="input-with-select">
          <template #append>
            <el-button icon="el-icon-search" @click="showFireOfficerSelect"></el-button>
          </template>
        </el-input>
      </template>
    </BaseForm>
    <el-dialog
      v-if="fireOfficerSelectVisible"
      ref="fireOfficerSelect"
      class="fireOfficerSelect dark"
      :destroy-on-close="true"
      v-model:visible="fireOfficerSelectVisible"
      width="1150px"
    >
      <div name="title" class="dialog-title">派发火警</div>
      <div class="dialog-content" style="height: 500px; padding-top: 0">
        <FireOfficeSelect ref="fireOfficerSelect" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="getSelectedFireOfficer">确定</el-button>
        <el-button @click="hideFireOfficerSelect">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="devDialogVisible"
      class="dark unitDevDetail-wrapper"
      :destroy-on-close="true"
      v-model:visible="devDialogVisible"
      width="1161px"
    >
      <div name="title" class="dialog-title">物联网设备</div>
      <div class="dialog-content">
        <unit-dev-detail :office-id="selectedOfficeId" :category="category" :category-name="categoryName" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import BaseTable from '@/components/baseTable'
import UnitDevDetail from '@/components/unitDevDetail'
import PeripheryQueryWindow from '@/components/bmap/peripheryQueryWindow'
import GridMaterialInfoWindow from '@/components/bmap/gridMaterialInfoWindow'
import { getGridMaterial, getGridMaterialInfo, sendPolice, getMatchingOfficeList, getOfficePlanList, getFirePlanList } from '@/api/emergencyCommand'
import FireOfficeSelect from './fireOfficerSelect'
import formAction from '@/mixins/form.js'
import BaseForm from '@/components/baseForm'
export default {
  name: 'BaseMap',
  components: {
    PeripheryQueryWindow,
    GridMaterialInfoWindow,
    BaseForm,
    FireOfficeSelect,
    BaseTable,
    UnitDevDetail
  },
  mixins: [formAction],
  data () {
    return {
      map: null,
      AMap: null,
      zoom: 9,
      center: '青岛市',
      queryMarker: null, // 周边查询标注点
      address: '', // 周边查询标地址
      positionPicker: null, // 周边查询点定位（）
      model: 'query', // 周边查询|分级调度|单位点击 query|dispatch|office
      circle: null, // 周边查询标圆形覆盖物
      driving: '', // 驾车线路规划
      queryOverlayers: [], // 周边查询相关地图覆盖物
      startPoint: null, // 线路规划起点
      endPoint: null, // 线路规划终点
      throughPoint: null, // 线路规划途经点
      nextDrawPoint: 'startPoint', // 鼠标点击下一个要添加的路线点 startPoint|endPoint|throughPoint
      searchPath: [], // 路线导航起始点
      searchOverlayers: [], // 路线导航地图相关覆盖物
      route: null, // 拖拽导航类
      markerCluster: null, // 点聚合
      gridMaterialInfo: {}, // 地图资源信息
      keyword: '', // 查询关键字
      placeSearch: null, // 搜索类
      matchingOfficeList: [],
      matchingOfficeMarker: null,
      formOption: {
        config: [
          {
            label: '火灾地点:',
            name: 'addr',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '经纬度:',
            name: 'lnglat',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '火警派发:',
            name: 'fireOfficer',
            type: 'slot',
            labelWidth: '100px',
            colspan: true
          },
          {
            label: '警情信息:',
            name: 'content',
            type: 'textarea',
            labelWidth: '100px',
            colspan: true
          }
        ]
      },
      officeInfo: {},
      fireOfficerSelectVisible: false,
      fireOfficerList: [],
      fireOfficerNames: '',
      buildingPlanUrls: [],
      firePlanList: [],
      firePlanConfig: [
        {
          label: '序号',
          type: 'index',
          width: '60',
          align: 'center'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'date',
          label: '制订时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'remarks',
          label: '简要',
          align: 'center',
          width: ''
        }
      ],
      selectedOfficeId: '',
      isShowOfficeInfo: false,
      isShowMatchingList: false,
      isShowBaseInfo: false,
      isShowBuildingPlan: false,
      isShowFirePlan: false,
      devDialogVisible: false,
      category: -1,
      categoryName: ''

    }
  },
  mounted () {
    this.initMap()
  },
  unmounted () {
    this.map && this.map.destroy()
  },
  methods: {
    openInfo (position, content) {
      this.closeInfoWindow()
      this.$nextTick(() => {
        this.infoWindow = new this.AMap.InfoWindow({
          content: this.$refs[content].$el // 使用默认信息窗体框样式，显示信息内容
        })
        this.infoWindow.open(this.map, position)
      })
    },
    initMap () {
      AMapLoader.load({
        key: '246ece196d8b155d1366f4bb2985af5e', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Driving', 'AMap.DragRoute', 'AMap.MarkerCluster', 'AMap.PlaceSearch'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: { // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 缺省 1.1
          plugins: ['misc/PositionPicker'] // 需要加载的 AMapUI ui插件
        }
      }).then((AMap) => {
        this.AMap = AMap
        this.map = new AMap.Map('map', {
          zoom: 11, // 级别
          layers: [
            // 标准图层
            new AMap.TileLayer()
          ]
        })
        this.driving = new AMap.Driving({
          map: this.map,
          panel: 'panel',
          hideMarkers: true
        })
        this.zoom = this.map.getZoom()
        this.center = this.map.getCenter()
        // eslint-disable-next-line no-undef
        this.positionPicker = new AMapUI.PositionPicker({
          mode: 'dragMap',
          map: this.map
        })

        const _this = this
        this.positionPicker.on('success', function (positionResult) {
          _this.address = positionResult.address
          _this.positionPicker.stop()
        })
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map,
          panel: 'searchResults' // 结果列表将在此容器中进行展示。
        })
        this.placeSearch.on('listElementClick', function (e) {
          _this.isShowMatchingList = true
          _this.$refs.matchingOfficeList.style.transform = `translateY(${e.index * 67}px)`
          _this.address = e.data.address
          if (_this.matchingOfficeMarker) {
            _this.map.remove(_this.matchingOfficeMarker)
          }
          const params = {
            name: e.data.name,
            longitude: e.data.location.lng,
            latitude: e.data.location.lat
          }
          getMatchingOfficeList(params).then((res) => {
            if (res.data) {
              _this.matchingOfficeList = res.data
              _this.isShowMatchingList = true
            }
          })
        })
      }).catch(e => {
        console.log(e)
      })
    },
    // 周边查询
    query (data) {
      if (this.circle) {
        this.map.remove(this.circle)
      }
      if (this.cluster) {
        this.cluster.setData([])
      }
      let center
      if (this.queryMarker) {
        center = this.queryMarker.getPosition()
      } else if (this.officeInfo.longitude && this.officeInfo.latitude) {
        center = [this.officeInfo.longitude, this.officeInfo.latitude]
      } else {
        this.$message({
          message: '该单位暂无经纬度信息,请手动查询',
          type: 'error'
        })
        return false
      }
      this.circle = new this.AMap.Circle({
        center,
        radius: data.radius, // 半径
        borderWeight: 3,
        strokeColor: '#ccc',
        strokeOpacity: 1,
        strokeWeight: 0,
        fillOpacity: 0.4,
        strokeStyle: 'solid',
        fillColor: '#1791fc',
        zIndex: 50
      })
      this.map.add(this.circle)
      this.map.setFitView([this.circle], true)
      this.queryOverlayers.push(this.circle)
      this.closeInfoWindow()
      const types = data.checkedGoods.toString()
      let points = []
      getGridMaterial({ types }).then((res) => {
        if (res.data && res.data.list.length > 0) {
          points = res.data.list.filter((point) => {
            return this.circle.contains([point.longitude, point.latitude]) === true
          })
          points = points.map((point) => {
            return { ...point, lnglat: [point.longitude, point.latitude] }
          })
          const _this = this
          var _renderMarker = function (context) {
            let url = ''
            switch (context.data[0].type) {
              case 1:
                url = require('@/components/bmap/images/icon_water_source.png')
                break
              case 2:
                url = require('@/components/bmap/images/icon_fire_extinguishant.png')
                break
              case 3:
                url = require('@/components/bmap/images/icon_special_vehicles.png')
                break
              case 4:
                url = require('@/components/bmap/images/icon_fire_station.png')
                break
              case 5:
                url = require('@/components/bmap/images/icon_mini_fire_station.png')
                break
              case 6:
                url = require('@/components/bmap/images/icon_danger_chemicals.png')
                break
              case 7:
                url = require('@/components/bmap/images/icon_rescue_materials.png')
                break
              case 8:
                url = require('@/components/bmap/images/icon_rescue_food.png')
                break
            }
            const icon = new _this.AMap.Icon({
              size: new _this.AMap.Size(25, 34),
              image: url
            })
            context.marker.setIcon(icon)
            const position = context.marker.getPosition()
            context.marker.on('click', function () {
              getGridMaterialInfo({ id: context.data[0].id }).then((res) => {
                if (res.data && res.data.gridMaterial) {
                  _this.gridMaterialInfo = res.data.gridMaterial
                  _this.openInfo(position, 'gridMaterialInfoWindow')
                }
              })
            })
          }
          // 添加聚合组件
          this.cluster = new this.AMap.MarkerCluster(this.map, points, {
            renderMarker: _renderMarker
          })
        }
      })
    },
    // 地图事件绑定
    mapEvent (model) {
      if (model) {
        this.model = model
      }
      if (this.cluster) {
        this.cluster.setData([])
      }
      this.map.on('mousemove', this.mouseMove)
      this.closeInfoWindow()
      this.clearOverlayers()
    },
    // 点击地图确定中心点
    queryMarkerClick () {
      this.map.off('mousemove', this.mouseMove)
      const position = this.queryMarker.getPosition()
      this.positionPicker.start(position)
      this.openInfo(position, 'peripheryQueryWindow')
    },
    // 监听地图鼠标移动事件，确定周边查询中心点
    mouseMove (e) {
      const position = [e.lnglat.getLng(), e.lnglat.getLat()]
      if (!this.queryMarker) {
        this.queryMarker = new this.AMap.Marker({ position })
        this.queryMarker.setMap(this.map)
        this.queryOverlayers.push(this.queryMarker)
        this.queryMarker.on('click', this.queryMarkerClick)
      } else {
        this.queryMarker.setPosition(position) // 更新点标记位置
      }
    },
    // 关闭信息窗口
    closeInfoWindow () {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
    },
    // 清空周边查询地图覆盖物
    clearOverlayers () {
      if (this.queryOverlayers.length > 0) {
        this.map.remove(this.queryOverlayers)
        this.queryMarker = null
        this.circle = null
        this.queryOverlayers = []
        this.map.off('mousemove', this.mouseMove)
      }
    },
    // 添加起始点
    addSearchMarker (position, nextDrawPoint) {
      const point = new this.AMap.Marker({ position })
      point.setMap(this.map)
      this.nextDrawPoint = nextDrawPoint
      this.searchPath.push(position)
      this.searchOverlayers.push(point)
    },
    // 点击线路规划监听地图鼠标点击事件确定起始点
    mouseClick (e) {
      const position = [e.lnglat.getLng(), e.lnglat.getLat()]
      const _this = this
      switch (this.nextDrawPoint) {
        case 'startPoint':
          this.addSearchMarker(position, 'endPoint')
          break
        case 'endPoint':
          this.addSearchMarker(position, 'clear')
          this.route = new this.AMap.DragRoute(this.map, this.searchPath, this.AMap.DrivingPolicy.LEAST_FEE) // 构造拖拽导航类
          this.route.search() // 查询导航路径并开启拖拽导航
          this.route.on('complete', function (result) {
            const data = result.data
            _this.drivingSearch(data.start.location, data.end.location)
          })
          this.map.remove(this.searchOverlayers)
          this.map.off('click', this.mouseClick)
          break
      }
    },
    // 线路规划
    routePlan () {
      this.map.on('click', this.mouseClick)
      if (this.nextDrawPoint === 'clear') {
        this.route.destroy()
        this.driving.clear()
        this.searchPath = []
        if (this.zoom && this.center) { this.map.setZoomAndCenter(this.zoom, this.center) }
        this.nextDrawPoint = 'startPoint'
        this.map.off('click', this.mouseClick)
      }
    },
    // 线路规划结果
    drivingSearch (start, end) {
      // 根据起终点经纬度规划驾车导航路线
      this.driving.search(start, end, function (status, result) {
        // result 即是对应的驾车导航信息
        if (status === 'complete') {
          // log.success('绘制驾车路线完成')
        } else {
          // log.error('获取驾车数据失败：' + result)
        }
      })
    },
    // 分级调度
    dispatch () {
      let lnglat
      if (this.queryMarker) {
        lnglat = `${this.queryMarker.getPosition().lng}, ${this.queryMarker.getPosition().lat}`
      } else if (this.officeInfo.longitude && this.officeInfo.latitude) {
        lnglat = `${this.officeInfo.longitude}, ${this.officeInfo.latitude}`
      } else {
        this.$message({
          message: '该单位暂无经纬度信息,请手动派发',
          type: 'error'
        })
        return false
      }
      this.formAction('分级调度', 'create', { lnglat, addr: this.address })
    },
    // 选择派发人员
    showFireOfficerSelect () {
      this.initFireOfficerVal = this.fireOfficerList
      this.fireOfficerSelectVisible = true
    },
    hideFireOfficerSelect () {
      this.fireOfficerSelectVisible = false
    },
    getSelectedFireOfficer () {
      this.fireOfficerList = this.$refs.fireOfficerSelect.getSelectedfireOfficer()
      this.fireOfficerNames = this.fireOfficerList.map((fireOfficer) => {
        return fireOfficer.name
      }).toString()
      this.hideFireOfficerSelect()
    },
    // 警情派发
    createData (data) {
      const ids = this.fireOfficerList.map((fireOfficer) => {
        return fireOfficer.id
      }).toString()

      const longitude = data.lnglat.split(',')[0]
      const latitude = data.lnglat.split(',')[1]
      const params = {
        ids,
        longitude,
        latitude,
        addr: this.address,
        content: data.content
      }
      sendPolice(params).then((res) => {
        if (res.msg === 'ok') {
          this.$message({
            message: '警情派发成功',
            type: 'success'
          })
        }
      })
    },
    baseFormHide () {
      this.fireOfficerNames = ''
    },
    // 关键字搜索（调用高德地图api）
    keywordSearch () {
      this.clearOverlayers()
      this.closeInfoWindow()
      if (this.keyword) {
        this.placeSearch.search(this.keyword, function (status, result) {

        })
      } else {
        this.placeSearch.clear()
        this.isShowMatchingList = false
      }
    },
    // 获取单位平面图
    _getOfficePlanList (id) {
      return new Promise((resolve, reject) => {
        getOfficePlanList({ officeId: id }).then(res => {
          if (res.data) {
            const data = res.data.map((img) => {
              return {
                name: img.name,
                url: img.fileUrl
              }
            })
            resolve(data)
          } else {
            reject(console.log('error'))
          }
        })
      })
    },
    // 获取单位应急预案
    _getFirePlanList (id) {
      return new Promise((resolve, reject) => {
        getFirePlanList({ officeId: id }).then(res => {
          if (res.data) {
            resolve(res.data)
          } else {
            reject(console.log('error'))
          }
        })
      })
    },
    // 展示单位基本信息
    async showOfficeInfo (officeInfo) {
      this.officeInfo = officeInfo
      this.isShowMatchingList = false
      this.selectedOfficeId = officeInfo.id
      if (this.matchingOfficeMarker) {
        this.map.remove(this.matchingOfficeMarker)
      }
      if (officeInfo.addr) {
        this.address = officeInfo.addr
      }
      this.placeSearch.clear()
      const _this = this
      const position = [officeInfo.longitude, officeInfo.latitude]
      this.model = 'office'
      this.matchingOfficeMarker = new this.AMap.Marker({ position })
      this.matchingOfficeMarker.setMap(this.map)
      this.openInfo(position, 'peripheryQueryWindow')
      this.matchingOfficeMarker.on('click', function () {
        _this.openInfo(position, 'peripheryQueryWindow')
      })
      // this.placeSearch.search(' ')
      this.buildingPlanUrls = await this._getOfficePlanList(this.selectedOfficeId)
      this.firePlanList = await this._getFirePlanList(this.selectedOfficeId)
      this.isShowOfficeInfo = true
      this.isShowBaseInfo = this.isShowBuildingPlan = this.isShowFirePlan = this.isShowOfficeInfo
    },
    openDevDetail () {},
    // 导航
    navigation (start) {
      if (this.officeInfo.addr) {
        this.driving.search([
          { keyword: start },
          { keyword: this.officeInfo.addr }
        ])
      } else if (this.address) {
        this.driving.search([
          { keyword: start },
          { keyword: this.address }
        ])
      } else {
        this.$message({
          message: '该单位暂无位置信息,请手动导航',
          type: 'error'
        })
      }
    },
    // 单位基本信息隐藏
    slide (flag) {
      if (flag === 'baseInfo') {
        this.isShowBaseInfo = !this.isShowBaseInfo
      }
      if (flag === 'buildingPlan') {
        this.isShowBuildingPlan = !this.isShowBuildingPlan
      }
      if (flag === 'firePlan') {
        this.isShowFirePlan = !this.isShowFirePlan
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.map-wrapper,.map-content {
  height: 100%;
  position: relative;
  overflow: hidden;
  .map{
    width: 100%;
    height: 100%;
  }
  .tools{
    position: absolute;
    left: 14px;
    top: 40px;
  }
  #panel {
      position: absolute;
      background-color: white;
      max-height: 90%;
      overflow-y: auto;
      top: 100px;
      left: 10px;
      width: 280px;
      z-index: 1,
  }
  #panel .amap-lib-driving {
    border-radius: 4px;
    overflow: hidden;
  }
  .search{
    position: absolute;
    right: 15px;
    top: 20px;
    display: flex;
    width: 326px;
    flex-direction: column;
  }
  .btn-officeInfo{
    position: absolute;
    bottom: 13px;
    width: 100%;
    display: flex;
    justify-content: space-between;

  }
  .officeInfo{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    .slide-enter-active,
    .slide-leave-active {
      transition: all .5s;
    }
    .slide-enter,
    .slide-leave-to {
      transform: translateY(100%)
    }
    .box-wrapper{
        width: 33%;
        position: absolute;
        left: 0.25%;
        bottom: -100%;
        &:nth-child(2){
            left: 33.5%
        }
        &:nth-child(3){
            left: 66.75%
        }
        .box{
            width: 100%;
            height: 380px;
            background: rgba(0, 22, 71, 1);
            padding: 15px 26px;
            color: #fff;
            display: flex;
            flex-direction: column;
            .title{
                font-size: 16px;
                font-weight: bold;
                line-height: 46px;
                border-bottom: 1px solid #0D98EF;
            }
            .close{
                position: absolute;
                width: 21px;
                height: 21px;
                background: url(./images/icon_arrow.png)0 0 no-repeat;
                background-size: 21px 21px;
                right: 15px;
                transform: rotateZ(180deg);
            }
        }
        .item{
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 142px;
            height: 71px;
            background: rgba(0,0,0,0.68);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            cursor: pointer;
            .icon{}
            &:hover{
                background: rgba(13, 152, 239, 0.68);
            }
            &.slide-enter-active,
            &.slide-leave-active {
                transition: all .5s;
            }
            &.slide-enter,
            &.slide-leave-to {
                opacity: 0;
            }
        }
    }
    .baseInfo{
      .content{
        padding-top: 16px;
        p{
          &:nth-child(1){
            color: #E2E87F;
            line-height: 24px;
            font-weight: bold;
          }
          font-size: 14px;
          line-height: 22px;
          margin: 0;
        }
      }
    }
  }
  .firePlan{
    .el-table{
      margin-top: 10px;
    }
  }
  .buildingPlan{
    .image-wrapper{
      width: 100%;
      height: 359px;
      overflow: auto;
      margin-top: 10px;
      .name{
        font-size: 14px;
        color: #fff;
        text-align: center;
        font-weight: bold;
        padding: 10px 0;
      }
      .el-image{
        width: 100%;
        min-height: 200px;
      }
    }
    .noData{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%,-50%,0);
      color: #97c1ff;
      font-size: 14px;
    }
  }
  .matchingOfficeList{
    position: absolute;
    width: 304px;
    right: 326px;
    top:36px;
    padding: 15px 0;
    background: rgba(0,0,0,0.69);
    .title{
      font-size: 14px;
      font-weight: bold;
      color: #5EFFEE;
      line-height: 30px;
      border-bottom: 1px dashed rgba(255,255,255,0.3);
      text-indent: 15px;
    }
    ul{
      padding-top: 10px;
      max-height: 150px;
      overflow: auto;
      li{
        padding: 0 15px;
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        cursor: pointer;
        &:hover{
          background: rgba(13, 152, 239, 0.32);
        }
        &.active{
          background: rgba(13, 152, 239, 0.32);
        }
      }
    }
    .noMatching{
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
