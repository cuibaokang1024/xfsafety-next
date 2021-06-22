<template>
  <div class="house-container home">
    <ul class="main" :class="mainClass">
      <div class="item-map map-wrapper" :class="classNameList[1]">
        <div v-show="isShowOfficeList" class="map-left-box">
          <div class="search">
            <el-input
              v-model="searchOfficeName"
              placeholder="请输入内容"
              class="input-with-select"
              style="color: #97c1ff"
            >
              <el-button slot="append" icon="el-icon-search" @click="_searchOffice" />
            </el-input>
          </div>
          <div class="title">{{ officeListTitle }}({{ officeList.length }}家)</div>
          <ul v-show="!isShowOfficeList" class="office-type-list">
            <li v-for="item in officeTypeData.categoryList" :key="item.id" class="item">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.categoryName"
                placement="top-start"
              >
                <span class="type">{{ item.categoryName || '其他' }}</span>
              </el-tooltip>
              <span class="num" @click="filterOffice(item)">{{ item.total }}</span>
            </li>
          </ul>
          <ul v-if="isShowOfficeList" class="office-list">
            <li
              v-for="(item,index) in officeList"
              :key="item.id"
              class="item"
              @click="officePosition(item)"
            >
              <span class="name">{{ `${index+1}.&nbsp;${item.name||''}` }}</span>
              <span class="type">{{ `类型：${item.categoryName||''}` }}</span>
              <span class="address">{{ `地址：${item.addr||''}` }}</span>
            </li>
          </ul>
        </div>
        <div v-if="isShowRightBox" class="map-right-box" :class="{min:!isShowUnitTypeList}">
          <div class="mask-right-title">{{ maskRightTitle }}</div>
          <div class="close" @click="closeRightBox">
            <i class="el-icon-circle-close" />
          </div>
          <div v-show="!isShowHiddenType" class="top" :class="{border:!isShowUnitTypeList}">
            <div class="chart-wrapper">
              <PieChart
                id="rightPieChart"
                width="100%"
                height="268px"
                :chart-data="pieData"
                @click="filterAreaTypeList"
              />
            </div>
          </div>
          <div v-if="isShowUnitTypeList" class="bot">
            <div v-if="ishiddenTitle" class="title">{{ hiddenTitle }}</div>
            <div v-if="beadhouseMes" class="beadhouseMes-box">
              <span>{{ beadhouseMes.statName }}</span>
              <span>{{ beadhouseMes.count }}</span>
              <span>家</span>
            </div>
            <div class="chart-wrapper">
              <bar-percent-chart
                id="officeTypeChart"
                ref="officeTypeChart1"
                height="100%"
                width="100%"
                :chart-data="officeTypeChartData"
                @click="filterOfficeType"
              />
            </div>
          </div>
        </div>
        <div v-show="navigatList.length>0" class="navigat">
          <ul>
            您所在位置：
            <li v-for="item in navigatList" :key="item.id">
              {{ item.name }}
              <span>>></span>
            </li>
          </ul>
        </div>
        <BasMap
          ref="map"
          :points="officeList"
          @viewDetail="viewUnitArchives"
          @belongUnits="belongUnits"
        />
      </div>
      <li
        v-for="(item, index) in list"
        :key="item.index"
        :class="index == 0 ? classNameList[index] : classNameList[index + 1]"
        class="item-box"
        @click="getClassName(item.className)"
      >
        <component
          :is="item.className"
          :navigat-list.sync="navigatList"
          @filterhiddenDanger="filterhiddenDanger"
          @filterBeadhouseCount="filterBeadhouseCount"
          @handleFilterAreaAlert="handleFilterAreaAlert"
          @getAreaOfficeType="getAreaOfficeType"
        />
      </li>
    </ul>
    <el-dialog
      v-if="dialogVisible"
      class="dark unitArchives"
      :append-to-body="true"
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      width="1240px"
    >
      <div slot="title" class="dialog-title">单位档案</div>
      <div class="dialog-content">
        <unit-archives :office-id="viewOfficeId" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import './style/index.scss'
import {
  hiddenInfo,
  hiddenCircleInfo,
  handlebeadhouseCount,
  handleDevNumArea,
  handleDevByArea,
  handleCompany
} from '@/api/beadhouse'
import BasMap from '@/components/bmap/base-map'
import UnitArchives from '@/components/unitArchives'
import beadhouseCount from './components/beadhouseCount'
import equipmentAlarm from './components/equipmentAlarm'
import alarmMessage from './components/alarmMessage'
import HiddenDanger from './components/hiddenDanger'
import safetyTraining from './components/safetyTraining'
import UnitImplement from './components/unitImplement'
import PieChart from '@/components/Charts/pieChart'
import BarPercentChart from '@/components/Charts/barPercentChart'
import { searchOffice, getPerformanceareacount } from '@/api/home'
import { getOfficeList } from '@/api/map' // 地图所属单位
const nameList = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6']
export default {
  name: 'DashboardAdmin',
  components: {
    BasMap,
    beadhouseCount,
    equipmentAlarm,
    HiddenDanger,
    alarmMessage,
    UnitImplement,
    safetyTraining,
    PieChart,
    BarPercentChart,
    UnitArchives
  },
  data() {
    return {
      refreseChart: false,
      dialogVisible: false,
      viewOfficeId: -1,
      mainClass: 'main-6',
      navigatList: [],
      isShowUnitTypeList: true, // 是否显示单位类型列表
      isShowOfficeList: false, // 是否显示单位列表
      isShowRightBox: false, // 是否显示地图右侧盒子
      isShowHiddenType: false, // 是否显示隐患类型
      list: [
        {
          index: '1',
          className: 'UnitImplement'
        },
        {
          index: '2',
          className: 'HiddenDanger'
        },
        {
          index: '3',
          className: 'beadhouseCount'
        },
        {
          index: '4',
          className: 'equipmentAlarm'
        },
        {
          index: '5',
          className: 'alarmMessage'
        },
        {
          index: '6',
          className: 'safetyTraining'
        }
      ],
      classNameList: [],
      officeTypeData: {}, // 单位类型数据 地图左侧弹出
      officeListTitle: '单位列表', // 单位列表标题
      officeList: [], // 单位列表&地图点列表
      searchOfficeName: '', // 左侧地图弹出 单位名称查询
      // listQuery: {
      //   name: ''
      // }
      areaId: '',
      areaList: [], // 区域列表 地图右侧饼图
      typeList: [], // 单位类型列表
      areaTypeList: [], // 按区域查询单位类型列表
      areaOfficeList: [], // 按区域和单位类型查询单位列表
      hiddenTitle: '区域隐患', // 右侧弹窗，柱状图的title
      ishiddenTitle: true, // 右侧弹窗，柱状图的title是否隐藏
      maskRightTitle: '',
      beadhouseMes: null,
      companyType: {},
      componentName: ''
    }
  },
  computed: {
    officeTypeChartData() {
      const name = []
      const data = []
      const totalList = []
      let total = 0
      this.typeList.forEach(item => {
        name.unshift(item.statName)
        data.unshift({
          ...item,
          categoryId: item.id,
          value: item.count
        })
        total = item.count + 20
      })
      this.typeList.map((item, index) => {
        totalList.unshift({
          categoryId: item.id,
          value: total + 1
        })
      })
      const chartData = {
        colors: ['#0089e0'],
        bgClor: 'rgba(255,255,255,0.17)',
        axisLabel: {
          color: '#fff'
        },
        label: {
          color: '#fff'
        },
        grid: {
          top: '10px',
          left: '80px',
          right: '15px',
          bottom: '0'
        },
        name,
        data,
        total: totalList
      }
      return chartData
    },
    pieData() {
      const pieData = {
        unit: '个',
        legend: {
          orient: 'horizontal',
          top: '87%',
          left: 'center',
          itemWidth: 20,
          itemHeight: 6,
          textStyle: {
            color: '#fff'
          },
          data: this.areaList.title
        },
        series: [
          {
            name: '',
            radius: ['50%', '70%'],
            center: ['50%', '48%'],
            color: ['#E47878', '#DEE478', '#78E4AD'],
            data: this.areaList.data
          }
        ]
      }
      return pieData
    }
  },
  created() {
    this.initDom(this.list)
  },
  methods: {
    // 初始化Grid布局
    initDom(list) {
      this.mainClass = 'main-6'
      let classNameList = nameList.slice()
      if (list.length === 6) {
        classNameList = nameList.slice(0, 7)
        this.mainClass = 'main-6'
      } else if (list.length === 5) {
        classNameList = nameList.slice(0, 6)
        this.mainClass = 'main-5'
      } else if (list.length === 4) {
        classNameList = nameList.slice(0, 5)
        this.mainClass = 'main-4'
      }
      this.classNameList = classNameList
      this.refreseChart = !this.refreseChart
    },
    // 显示地图左侧单位列表
    showOfficeList() {
      if (!this.isShowOfficeList) {
        this.isShowOfficeList = true
      }
    },
    // 隐藏地图左侧单位列表
    hideOfficeList() {
      if (this.isShowOfficeList) {
        this.isShowOfficeList = false
      }
    },
    _handleCompany(companyType) {
      handleCompany(companyType).then(res => {
        this.officeList = res.data
      })
    },
    // 地图所属单位
    belongUnits(data) {
      const areaId = data.area.id
      getOfficeList({ areaId }).then(res => {
        if (res.data && res.data.allData) {
          this.officeList = res.data.allData
        }
      })
    },
    // 单位类别筛选（网吧|酒店|...）
    filterOffice(data) {
      this.officeList = this.officeList.filter(item => {
        return item.categoryId === data.categoryId
      })
      const index = this.navigatList.findIndex((item) => {
        return item.level === 3
      })
      if (index > 0) {
        this.navigatList.splice(index, 1)
      }
      this.navigatList.push({
        level: 3,
        name: data.categoryName
      })
      this.showOfficeList() // 是否显示单位列表
    },
    // 按单位名称查询
    _searchOffice() {
      if (this.componentName === 'UnitImplement') {
        searchOffice({ name: this.searchOfficeName }).then(res => {
          if (res.data) {
            this.officeList = res.data.list
            if (!this.isShowOfficeList) {
              this.showOfficeList()
            }
          }
        })
      } else {
        const companyType = {
          ...this.companyType,
          name: this.searchOfficeName
        }
        this._handleCompany(companyType)
      }
    },
    getClassName(title) {
      this.componentName = title
    },
    // 右侧弹窗，隐患整改进度
    filterhiddenDanger(data) {
      this.companyType = {
        type: 2,
        areaId: data.id,
        isOwn: data.isOwn
      }
      this.maskRightTitle = '按行政区划统计隐患数量'
      this.isShowRightBox = true
      this.isShowHiddenType = false
      this.isShowUnitTypeList = true
      this.officeListTitle = '单位列表'
      this.hiddenTitle = '区域隐患'
      this.ishiddenTitle = true
      Promise.all([
        hiddenInfo({ areaId: data.id, isOwn: 1, order: 'count' }),
        hiddenCircleInfo({ areaId: data.id })
      ]).then(data => {
        this.typeList = data[0].data
        this.areaList = data[1].data
        this.showOfficeList()
      })
      this._handleCompany(this.companyType)
    },
    filterBeadhouseCount(data) {
      handlebeadhouseCount({ areaId: data.id }).then(res => {
        this.maskRightTitle = '按行政区划统计养老机构数量'
        this.beadhouseMes = res.data[0]
        this.isShowRightBox = true
        this.isShowHiddenType = true
        this.isShowUnitTypeList = true
        this.ishiddenTitle = false
        this.showOfficeList()
        this.typeList = res.data
        this.companyType = {
          type: 0,
          areaId: data.id,
          isOwn: data.isOwn
        }
        this._handleCompany(this.companyType)
      })
    },
    // 按区域筛选单位类型
    filterAreaTypeList(data) {
      const index1 = this.navigatList.findIndex(item => {
        return item.level === 5
      })
      const index2 = this.navigatList.findIndex(item => {
        return item.level === 4
      })
      const index3 = this.navigatList.findIndex(item => {
        return item.level === 3
      })
      if (index1 > 0) {
        this.navigatList.splice(index1, 1)
      }
      if (index2 > 0) {
        this.navigatList.splice(index2, 1)
      }
      if (index3 > 0) {
        this.navigatList.splice(index3, 1)
      }
      this.navigatList.push({
        level: 3,
        name: data.data.name
      })
      if (this.componentName === 'HiddenDanger') {
        hiddenInfo({
          areaId: this.companyType.areaId,
          status: data.data.state,
          isOwn: 1,
          order: 'count'
        }).then(res => {
          this.ishiddenTitle = true
          this.typeList = res.data
          this.hiddenTitle = `区域${data.data.name}隐患`
          this.officeListTitle = `单位列表`
        })
      } else if (this.componentName === 'UnitImplement') {
        this.areaId = data.data.areaId
        this.typeList = this.areaTypeList.filter(item => {
          return item.areaId === data.data.areaId
        })
        this.officeList = this.areaOfficeList.filter(item => {
          return item.areaId === data.data.areaId
        })
      } else if (this.componentName === 'alarmMessage') {
        handleDevNumArea({
          areaId: this.companyType.areaId,
          state: data.data.state
        }).then(res => {
          this.ishiddenTitle = true
          this.typeList = res.data
          this.hiddenTitle = `${data.data.name}`
          this.officeListTitle = `单位列表`
        })
      }
      this.companyType = {
        type: this.companyType.type,
        isOwn: this.companyType.isOwn,
        areaId: this.companyType.areaId,
        status: data.data.state
      }
      this.showOfficeList() // 是否显示单位列表
    },
    // 按行政区划统计报警信息
    handleFilterAreaAlert(data) {
      this.maskRightTitle = '按行政区划统计设备安装单位'
      this.hiddenTitle = '设备数量'
      this.showOfficeList()
      Promise.all([
        handleDevByArea({ areaId: data.data.id }),
        handleDevNumArea({ areaId: data.data.id })
      ]).then(data => {
        this.isShowRightBox = true
        this.isShowUnitTypeList = true
        this.areaList = data[0].data
        this.typeList = data[1].data
        this.officeListTitle = '单位列表'
      })
      this.companyType = {
        type: 1,
        isOwn: 0,
        areaId: data.data.id
      }
      this._handleCompany(this.companyType)
    },
    // 获取区域、区域单位类型
    getAreaOfficeType(data) {
      this.maskRightTitle = data.desc
      this.hiddenTitle = '单位类型（家）'
      getPerformanceareacount({
        type: data.name
      }).then(res => {
        const title = res.data.info.areaList.map(ele => {
          return ele.areaName
        })
        res.data.info.areaList.map(ele => {
          return {
            name: ele.areaName,
            areaId: ele.areaId,
            value: ele.areaId
          }
        })
        this.isShowHiddenType = false
        const data = res.data.info
        this.isShowRightBox = true
        this.isShowUnitTypeList = true
        this.areaList = {
          title,
          data: res.data.info.areaList
        }
        this.typeList = res.data.info.typeList.map(ele => {
          return {
            count: ele.total,
            id: ele.categoryId,
            statName: ele.categoryName
          }
        })
        this.areaTypeList = data.areaTypeList
        this.areaOfficeList = data.infoList
        this.officeList = this.areaOfficeList
        this.officeListTitle = '单位列表'
        this.showOfficeList() // 是否显示单位列表
      })
    },
    // 按单位类型筛选单位
    filterOfficeType(data) {
      const index1 = this.navigatList.findIndex(item => {
        return item.level === 5
      })
      const index2 = this.navigatList.findIndex(item => {
        return item.level === 4
      })
      if (index1 > 0) {
        this.navigatList.splice(index1, 1)
      }
      if (index2 > 0) {
        this.navigatList.splice(index2, 1)
      }
      this.navigatList.push({
        level: 4,
        name: data.name
      })
      if (this.componentName === 'beadhouseCount') {
        this.beadhouseMes = data.data
      } else {
        this.beadhouseMes = null
      }
      if (this.componentName === 'UnitImplement') {
        this.officeList = this.areaOfficeList.filter(item => {
          if (this.areaId) {
            return (
              item.categoryId === data.data.categoryId &&
              item.areaId === this.areaId
            )
          } else {
            return item.categoryId === data.data.categoryId
          }
        })
      } else {
        const companyType = {
          type: this.companyType.type,
          areaId: data.data.categoryId,
          isOwn: data.data.isOwn,
          status: this.companyType.status
        }
        this._handleCompany(companyType)
      }
    },
    // 打开单位详情页面
    viewUnitArchives(data) {
      this.viewOfficeId = data.id
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    closeRightBox() {
      this.isShowRightBox = false
    },
    // 点击单位在地图上定位该单位
    officePosition(data) {
      this.$refs.map.setCenter(data)
      const index = this.navigatList.findIndex(item => {
        return item.level === 5
      })
      if (index > 0) {
        this.navigatList.splice(index, 1)
      }
      this.navigatList.push({
        level: 5,
        name: data.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
