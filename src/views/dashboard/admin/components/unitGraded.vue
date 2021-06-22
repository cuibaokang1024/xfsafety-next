<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">单位分级统计</span>
      <span class="tagging" />
    </el-header>
    <el-main :class="homeType==='emergency'?'emergency':''">
      <ul class="statistics" :gutter="10">
        <li v-for="item in statisticsList" :key="item.id" :style="{background:colors[item.id - 1]}" @click="filterOffice(item)">
          <div class="content">
            <span class="text">{{ item.desc }}</span>
            <span class="num">{{ levelInfo[item.name]||0 }}<span class="unit">家</span></span>
          </div>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import { getLevelinfo, getLevelofficelist } from '@/api/home.js'
import { getAreaLevelinfo, getAreaLevelofficelist } from '@/api/emergencyHome'
export default {
  props: {
    navigatList: {
      type: Array,
      default: () => []
    },
    homeType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      interval: null,
      navigatList_copy: [],
      colors: ['#ea8606', '#fb575e', '#45b8ef', '#28b779', '#3853b2', '#76b8be', '#b5ae3b', '#538ed0'],
      statisticsList: [
        {
          id: '1',
          name: 'total',
          colspan: true,
          desc: '单位总数',
          num: '10',
          color: '#fd0003'
        },
        {
          id: '2',
          name: 'highRisk',
          span: '6',
          desc: '火灾高危单位',
          num: '10',
          color: '#ff7200'
        },
        {
          id: '3',
          name: 'importantCount',
          span: '6',
          desc: '重点单位',
          color: '#fffe03',
          num: '10'
        },
        {
          id: '4',
          name: 'normalCount',
          span: '6',
          desc: '一般单位',
          color: '#01fcff',
          num: '10'
        },
        {
          id: '5',
          name: 'smallCount',
          span: '6',
          desc: '九小场所',
          color: '#01fcff',
          num: '10'
        }
      ],
      officeList: [],
      categoryList: [],
      listQuery: {},
      levelInfo: {}
    }
  },
  computed: {
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  created() {
    this._getLevelinfo()
    if (this.homeType === 'emergency') {
      this.statisticsList.push({
        id: '6',
        name: 'dangerCount',
        span: '6',
        desc: '危化品单位',
        color: '#76b8be',
        num: '10'
      },
      {
        id: '7',
        name: 'commerceCount',
        span: '6',
        desc: '工商贸单位',
        color: '#b5ae3b',
        num: '10'
      },
      {
        id: '8',
        name: 'otherCount',
        span: '6',
        desc: '其他单位',
        color: '#538ed0',
        num: '10'
      })
    }
  },
  mounted() {

  },
  methods: {
    // 获取单位分级统计
    _getLevelinfo() {
      if (this.homeType === 'emergency') {
        getAreaLevelinfo().then((res) => {
          if (res.data) {
            this.levelInfo = res.data.info
          }
        })
      } else {
        getLevelinfo().then((res) => {
          if (res.data) {
            this.levelInfo = res.data.info
          }
        })
      }
    },
    filterOffice(data) {
      this.navigatList_copy = []
      // 获取单位分级（单位类别和单位列表）
      this.navigatList_copy.push({
        level: 1,
        name: '单位分级统计'
      }, {
        level: 2,
        name: data.desc
      })
      this.$emit('update:navigatList', this.navigatList_copy)
      if (this.homeType === 'emergency') {
        getAreaLevelofficelist({
          type: data.name
        }).then((res) => {
          if (res.data) {
            const officeData = {
              title: data.desc,
              officeList: res.data.list,
              categoryList: res.data.info
            }
            this.$emit('levelSearch', officeData)
          }
        })
      } else {
        getLevelofficelist({
          type: data.name
        }).then((res) => {
          if (res.data) {
            const officeData = {
              title: data.desc,
              officeList: res.data.list,
              categoryList: res.data.info
            }
            this.$emit('levelSearch', officeData)
          }
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    position: relative;
    padding: 0;
    margin-bottom: 2px;
    align-items: center;
    border-bottom: 1px solid #0180ff;
    .text{
        font-size: 16px;
        color: #fff;
        margin-left: 5px;
    }
    .block{
        display: inline-block;
        width: 6px;
        height: 13px;
        background-color: #0488ea;
        margin-left: 2px;
    }
    .tagging{
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 2px;
        width: 30px;
        height: 5px;
        background: url(images/tagging.png)0 0 no-repeat;
    }
  }
  .el-main{
      position: relative;
      padding: 8px;
      background-color: #080d4f;
      border: 1px solid #0180ff;
      overflow: hidden;
      &.emergency{
        .statistics{
          flex-wrap: wrap;
          align-items: center;
          height: 100%;
          justify-content: space-around;
          >li{
            flex: 0 1 22%;
            margin: 0!important;
          }
        }
      }
      .statistics{
        display: flex;
        list-style: none;
        padding: 0;
        >li{
          flex: 1;
          cursor: pointer;
          &:hover{
            transform: scale(1.03);
          }
          .content{
            height: 80px;
            display: flex;
            flex-direction: column;
            color: #fff;
            font-size: 14px;
            align-items: center;
            justify-content: space-evenly;
            .num{
              font-size: 18px;
              font-weight: bold;
              color: #f6ff00;
              .unit{
                font-size: 14px;
                color: #fff;
                font-weight: normal;
              }
            }
          }
          &:not(:last-child){
            margin-right: 9px;
          }
        }
      }
  }
}
</style>
