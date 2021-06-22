<template>
  <div class="container home">
    <ul class="main" :class="mainClass">
      <div class="item-map map-wrapper" :class="classNameList[1]">
        <div v-show="isShowCategory || isShowOfficeList" class="map-left-box">
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
          <div class="title">{{ officeListTitle }}</div>
          <ul v-show="isShowCategory&&!isShowOfficeList" class="office-type-list">
            <li v-for="item in officeTypeData.categoryList" :key="item.id" class="item">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.categoryName"
                placement="top-start"
              >
                <span class="type">{{ item.categoryName }}</span>
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
          <div class="close" @click="closeRightBox">
            <i class="el-icon-circle-close" />
          </div>
          <div v-show="!isShowHiddenType" class="top" :class="{border:!isShowUnitTypeList}">
            <div class="chart-wrapper">
              <PieChart
                id="rightPieChart"
                width="100%"
                height="100%"
                :chart-data="pieData"
                @click="filterAreaTypeList"
              />
            </div>
          </div>
          <div v-show="isShowHiddenType" class="hidden-type">
            <div class="title">隐患类型</div>
            <ul>
              <li
                v-for="item in dangerTypeList"
                :key="item.id"
                :class="{selected:item.value===hiddenTypeValue}"
                @click="filterHiddenType(item.value)"
              >{{ item.label }}</li>
            </ul>
          </div>
          <div v-if="isShowUnitTypeList" class="bot">
            <div class="title">单位类型（家）</div>
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
        <!-- <div class="hiddenDanger">
          <ul class="hidden-type-list">
            <li class="item">{{ item.text }}</li>
          </ul>
        </div>-->
        <div v-show="navigatList.length>0" class="navigat">
          <ul>
            您所在位置：
            <li v-for="item in navigatList" :key="item.id">
              {{ item.name }}
              <span>>></span>
            </li>
          </ul>
        </div>
        <BasMap ref="map" :points="officeList" @viewDetail="viewUnitArchives" @belongUnits="belongUnits" />
      </div>
      <li
        v-for="(item, index) in list"
        :key="item.index"
        :class="index == 0 ? classNameList[index] : classNameList[index + 1]"
      >
        <component
          :is="item.className"
          :navigat-list.sync="navigatList"
          :home-type="'emergency'"
          @filterHiddenLevel="filterHiddenLevel"
          @filterOfficeLevel="filterOfficeLevel"
          @levelSearch="levelSearch"
          @buildingLevelSearch="buildingLevelSearch"
          @areaFilterList="areaFilterList"
          @getAreaOfficeType="getAreaOfficeType"
        />
      </li>
    </ul>
    <div :class="showSelectItem?'select-box select-box-active':'select-box'">
      <div class="select-btn" @click="handlerClickSelectBox">
        <span>选</span>
      </div>
      <div class="select-top">
        <span>请选择您需要的信息</span>
      </div>
      <div class="select-container">
        <div
          v-for="item in selectList"
          :key="item.index"
          :class="item.isSelect?'select-item select-item-active':'select-item'"
          @click="handlerClick(item)"
        >{{ item.text }}</div>
      </div>
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="dark unitArchives"
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
import '../admin/style/index.scss'
import BasMap from '@/components/bmap/base-map'
import UnitArchives from '@/components/unitArchives'
import UnitGraded from '../admin/components/unitGraded'
import RegionalUnit from '../admin/components/regionalUnit'
import BuildingLevel from '../admin/components/buildingLevel'
import Iot from '../admin/components/iot'
import PieChart from '@/components/Charts/pieChart'
import BarPercentChart from '@/components/Charts/barPercentChart'
import {
  searchOffice,
  getPerformanceareacount,
  getDangerTypeList
} from '@/api/home'
import { getAreaLevelbuildinglist } from '@/api/emergencyHome'
import { getOfficeList } from '@/api/map'
const nameList = [
  'item-1',
  'item-2',
  'item-3',
  'item-4',
  'item-5'
]
export default {
  name: 'Emergency',
  components: {
    BasMap,
    UnitGraded,
    RegionalUnit,
    BuildingLevel,
    PieChart,
    BarPercentChart,
    Iot,
    UnitArchives
  },
  data() {
    return {
      refreseChart: false,
      showSelectItem: false,
      dialogVisible: false,
      viewOfficeId: -1,
      hiddenTypeValue: -1,
      mainClass: 'main-5',
      navigatList: [],
      dangerTypeList: [], // 隐患类型列表
      isShowCategory: false, // 是否显示单位分级列表
      isShowUnitTypeList: true, // 是否显示单位类型列表
      isShowOfficeList: false, // 是否显示单位列表
      isShowRightBox: false, // 是否显示地图右侧盒子
      isShowHiddenType: false, // 是否显示隐患类型
      list: [
        {
          index: '1',
          className: 'UnitGraded'
        },
        {
          index: '3',
          className: 'BuildingLevel'
        },
        {
          index: '4',
          className: 'Iot'
        },
        {
          index: '5',
          className: 'RegionalUnit'
        }

      ],
      selectList: [
        {
          index: '1',
          className: 'UnitGraded',
          text: '单位分级统计',
          isSelect: true
        },
        {
          index: '2',
          className: 'UnitImplement',
          text: '单位履职情况分析',
          isSelect: true
        },
        {
          index: '3',
          className: 'BuildingLevel',
          text: '建筑分级统计',
          isSelect: true
        },
        {
          index: '4',
          className: 'HiddenDanger',
          text: '隐患统计',
          isSelect: true
        },
        {
          index: '5',
          className: 'MeritsRank',
          text: '监管部门绩效综合排名',
          isSelect: true
        },
        {
          index: '6',
          className: 'RiskAssess',
          text: '单位风险评估汇总',
          isSelect: true
        },
        {
          index: '7',
          className: 'RegionalUnit',
          text: '按行政区划统计单位和建筑',
          isSelect: true
        },
        {
          index: '8',
          className: 'AlertMsg',
          text: '告警信息统计',
          isSelect: true
        },
        {
          index: '9',
          className: 'Iot',
          text: '物联网',
          isSelect: true
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
      areaOfficeList: [] // 按区域和单位类型查询单位列表
    }
  },
  computed: {
    officeTypeChartData() {
      const name = []
      const data = []
      const totalList = []
      let total = 0
      this.typeList.forEach(item => {
        name.push(item.categoryName || '其他')
        data.push({
          categoryId: item.categoryId,
          value: item.total
        })
        total += item.total
      })
      this.typeList.forEach(item => {
        totalList.push({
          categoryId: item.categoryId,
          value: total
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
          right: '0px',
          bottom: '0'
        },
        name,
        data,
        total: totalList
      }
      return chartData
    },
    pieData() {
      const data = []
      if (this.areaList.length > 0) {
        this.areaList.forEach(item => {
          data.push({
            name: item.areaName,
            value: item.total,
            areaId: item.areaId
          })
        })
      }
      const pieData = {
        unit: '家',
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          left: 'center',
          itemWidth: 20,
          itemHeight: 6,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            data
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
    // 点击元素
    handlerClickSelectBox() {
      this.showSelectItem = !this.showSelectItem
    },
    // 订阅逻辑
    handlerClick(item) {
      if (this.list.length < 5 && item.isSelect) {
        this.$message({
          message: '至少保留五个模块',
          type: 'warning'
        })
        return false
      }
      const index = item.index - 1
      const selectStatus = !item.isSelect
      // 要删除模块的下标
      const deleteIndex = this.list.findIndex(data => {
        return data.className === item.className
      })
      if (item.isSelect) {
        this.list.splice(deleteIndex, 1) // 删除对应模块
        this.initDom(this.list)
      } else {
        // 插入的模块信息
        const insertItem = {
          index: item.index,
          className: item.className
        }
        if (index === 0) {
          this.list.unshift(insertItem) // 如果是第一个，直接在数组顶部插入
        } else {
          const insertIndex = this.list.findIndex(item => {
            return item.index > index + 1
          }) // 查找比当前要插入模块index值大的第一个数组元素的下标
          if (insertIndex !== -1) {
            this.list.splice(insertIndex, 0, insertItem) // 在insertIndex位置插入模块数据
          } else {
            this.list.push(insertItem) // 如果没有比当前要插入模块index大的数组元素，则直接数组尾部插入
          }
        }
      }
      this.initDom(this.list)
      this.selectList[index].isSelect = selectStatus
    },
    // 初始化Grid布局
    initDom(list) {
      this.mainClass = 'main-9'
      let classNameList = nameList.slice()
      if (list.length === 8) {
        classNameList = nameList.slice(0, 9)
        this.mainClass = 'main-8'
      } else if (list.length === 7) {
        classNameList = nameList.slice(0, 8)
        this.mainClass = 'main-7'
      } else if (list.length === 6) {
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
    // 地图所属单位
    belongUnits(data) {
      const areaId = data.area.id
      getOfficeList({ areaId }).then((res) => {
        if (res.data && res.data.allData) {
          this.officeList = res.data.allData
        }
      })
    },
    // 单位分级筛选（重点单位|一般单位|...）
    levelSearch(data) {
      if (this.isShowRightBox) {
        this.isShowRightBox = false
      }
      this.officeTypeData = data
      this.officeListTitle = data.title
      this.officeList = data.officeList
      this.isShowCategory = true // 显示单位分级列表
      this.hideOfficeList()
    },
    // 高层建筑分级统计-建筑列表查询
    buildingLevelSearch(data) {
      this.officeListTitle = data.name
      this.navigatList = []
      this.navigatList.push(
        {
          level: 1,
          name: '建筑分级统计'
        },
        {
          level: 2,
          name: data.name
        }
      )
      this.$emit('update:navigatList', this.navigatList)
      getAreaLevelbuildinglist({
        type: data.type
      }).then(res => {
        this.officeList = res.data.list
        if (!this.isShowOfficeList) {
          this.showOfficeList()
        }
      })
    },
    // 单位类别筛选（网吧|酒店|...）
    filterOffice(data) {
      this.officeList = this.officeList.filter(item => {
        return item.categoryId === data.categoryId
      })
      // const index = this.navigatList.findIndex((item) => {
      //   return item.level === 3
      // })
      // if (index > 0) {
      //   this.navigatList.splice(index, 1)
      // }
      this.navigatList.push({
        level: 3,
        name: data.categoryName
      })
      this.showOfficeList() // 是否显示单位列表
    },
    areaFilterList(data) {
      this.officeListTitle = data.title
      this.showOfficeList() // 是否显示单位列表
      this.officeList = data.officeList
    },
    // 按单位名称查询
    _searchOffice() {
      searchOffice({ name: this.searchOfficeName }).then(res => {
        if (res.data) {
          this.officeList = res.data.list
          if (!this.isShowOfficeList) {
            this.showOfficeList()
          }
        }
      })
    },
    // 获取区域、区域单位类型
    getAreaOfficeType(data) {
      getPerformanceareacount({
        type: data.name
      }).then(res => {
        this.isShowRightBox = true
        this.isShowHiddenType = false
        const data = res.data.info
        this.isShowRightBox = true
        this.isShowUnitTypeList = true
        this.areaList = data.areaList
        this.typeList = data.typeList
        this.areaTypeList = data.areaTypeList
        this.areaOfficeList = data.infoList
        this.officeList = this.areaOfficeList
        this.officeListTitle = '单位列表'
        this.showOfficeList() // 是否显示单位列表
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
      this.areaId = data.data.areaId
      this.typeList = this.areaTypeList.filter(item => {
        return item.areaId === data.data.areaId
      })
      this.officeList = this.areaOfficeList.filter(item => {
        return item.areaId === data.data.areaId
      })
      this.showOfficeList() // 是否显示单位列表
    },
    // 按单位级别筛选单位（A，AA...）
    filterOfficeLevel(data) {
      this.officeList = data.areaOfficeList
      this.areaOfficeList = data.areaOfficeList
      this.areaList = data.areaList
      this.officeListTitle = data.title
      this.showOfficeList() // 是否显示单位列表
      this.isShowRightBox = true
      this.isShowUnitTypeList = false
      this.isShowHiddenType = false
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
    },
    // 按隐患级别筛选
    filterHiddenLevel(data) {
      getDangerTypeList(data).then(res => {
        this.officeList = res.data.info
        this.dangerTypeList = res.data.dangerTypeList
        this.typeList = []
        this.isShowRightBox = true
        this.isShowHiddenType = true
        this.isShowUnitTypeList = true
      })
    },
    // 按隐患类型筛选
    filterHiddenType(data) {
      this.hiddenTypeValue = data
    },
    // 打开单位详情页面
    viewUnitArchives(data) {
      this.viewDevOfficeId = data.id
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
      const point = [data.longitude, data.latitude]
      this.$refs.map.setCenter(point)
      const index = this.navigatList.findIndex(item => {
        return item.level === 5
      })
      this.$refs.map.openInfo(data)
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
    .container.home{
      > .main  >.map-wrapper .map-left-box{
        bottom: 286px;
      }
      > .main.main-4{
        padding-top: 15px;
        height: 100%;
        grid-template-columns: auto 427px;
        grid-template-rows: 240px 280px 340px;
        overflow: hidden;
        position: relative;
        >li {
          margin-bottom: 1px;
          .buildingLevel{
            .el-main{
              flex-direction: column;
            }
          }
        }
        grid-row-gap: 0px;
        .item-1{
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 1;
          grid-row-end: 2;

        }
        .item-2 {
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 4;
        }
        .item-3 {
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 2;
          grid-row-end: 3;
        }
        .item-4 {
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 3;
          grid-row-end: 4;
        }

        .item-5 {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 2;
            grid-row-end: 4;
            position: absolute;
            left: 0;
            bottom: 0;
            right: 450px;
            height: 275px;
        }
      }
    }

</style>
