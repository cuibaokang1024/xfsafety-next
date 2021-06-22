<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">单位履职情况分析</span>
    </el-header>
    <el-main>
      <ul class="statistics" :gutter="10">
        <li v-for="item in statisticsList" :key="item.id" @click="getAreaOfficeType(item)">
          <div class="content">
            <span class="icon" :style="{backgroundImage:`url(${item.url})`}" />
            <div class="content-title">
              <span class="text">{{ item.desc }}</span>
              <span class="num">{{ performancecount[item.name] }}<span class="unit">家</span></span>
            </div>
          </div>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import { getPerformancecount } from '@/api/home'
export default {
  props: {
    navigatList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      interval: null,
      navigatList_copy: [],
      performancecount: {}, // 履责数据
      statisticsList: [
        {
          id: '1',
          colspan: true,
          desc: '3天未巡检',
          num: '10',
          name: 'noChk',
          color: '#fd0003',
          url: require('./images/icon_inspect1.png')
        },
        {
          id: '2',
          span: '6',
          name: 'noChanged',
          desc: '隐患超期未整改',
          num: '10',
          color: '#ff7200',
          url: require('./images/icon_inspect2.png')
        },
        {
          id: '3',
          span: '6',
          name: 'noDrill',
          desc: '半年内未演练',
          color: '#fffe03',
          num: '10',
          url: require('./images/icon_inspect3.png')
        },
        {
          id: '4',
          span: '6',
          name: 'noTrain',
          desc: '半年内未培训',
          color: '#01fcff',
          num: '10',
          url: require('./images/icon_inspect4.png')
        }
      ]
    }
  },
  created() {
    this._getPerformancecount()
  },
  methods: {
    _getPerformancecount() {
      getPerformancecount().then((res) => {
        if (res.data && res.data.info) {
          this.performancecount = res.data.info
        }
      })
    },
    getAreaOfficeType(data) {
      this.navigatList_copy = []
      this.navigatList_copy.push({
        level: 1,
        name: '单位履职情况分析'
      }, {
        level: 2,
        name: data.desc
      })
      this.$emit('update:navigatList', this.navigatList_copy)
      this.$emit('getAreaOfficeType', data)
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
    border-bottom: none;
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
  }
  .el-main{
      position: relative;
      padding: 0;
      padding-top: 12px;
      overflow: hidden;
      .statistics{
        display: grid;
        grid-template-columns: repeat(2, 48%);
        grid-row-gap: 15px;
        grid-column-gap: 12px;
        list-style: none;
        padding: 0;
        height: 100%;
        >li{
          cursor: pointer;
          .icon{
            display: inline-block;
            width: 46px;
            height: 46px;
            background-position: center center;
            background-repeat: no-repeat;
          }
          .content{
            height: 100%;
            display: flex;
            color: #97c1ff;
            font-size: 14px;
            align-items: center;
            justify-content: space-evenly;
            box-shadow: 0 0 15px #0E5EE0 inset;
            border: 1px solid #0D3B86;
            box-sizing: content-box;
            >span{
              margin-left: 20px;
              margin-right: 8px;
            }
            .content-title {
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            .text {
              color: #fff;
            }
            .num{
              font-size: 18px;
              line-height: 18px;
              font-weight: bold;
              color: #DEE478;
              margin-top: 4px;
              .unit{
                font-size: 14px;
                line-height: 14px;
                color: #DEE478;
                font-weight: normal;
              }
            }
          }
        }
      }
  }
}
</style>
