<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">报警设备数量</span>
    </el-header>
    <el-main>
      <ul class="statistics" :gutter="10">
        <li
          v-for="item in statisticsList"
          :key="item.id"
          @click="handleRouterClick(item.routerName)"
        >
          <div class="content">
            <span
              class="icon"
              :style="{ backgroundImage: `url(${item.url})`, backgroundSize: '100%' }"
            />
            <div class="content-title">
              <span class="text">{{ item.desc }}</span>
              <span class="num">
                {{ item.num }}
                <span class="unit">台</span>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import { handleDeviceCount } from '@/api/beadhouse'

export default {
  props: {
    navigatList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      statisticsList: []
    }
  },
  created() {
    this._handleDeviceCount()
  },
  methods: {
    _handleDeviceCount() {
      handleDeviceCount().then(res => {
        if (res.data) {
          this.statisticsList = this.handleInitData(res.data)
        }
      })
    },
    handleRouterClick(routerName) {
      this.$router.push(routerName)
    },
    handleInitData(data) {
      const statisticsList = [
        {
          id: '1',
          desc: '智慧用电监测',
          num: data.electricAlert,
          routerName: '/IOU/electricMonitoring',
          color: '#fd0003',
          url: require('./images/hidden1.png')
        },
        {
          id: '2',
          span: '6',
          routerName: '/IOU/waterRegulatoryAll',
          desc: '智慧用水监测',
          num: data.waterAlert,
          color: '#ff7200',
          url: require('./images/hidden2.png')
        },
        {
          id: '3',
          span: '6',
          routerName: '/IOU/devInfotxShow',
          desc: '火灾自动联网报警',
          color: '#fffe03',
          num: data.infotxAlert,
          url: require('./images/hidden3.png')
        },
        {
          id: '4',
          span: '6',
          routerName: '/IOU/devCamShow',
          desc: '可视化检测',
          color: '#01fcff',
          num: data.camAlert,
          url: require('./images/hidden4.png')
        }
      ]
      return statisticsList
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

    .text {
      font-size: 16px;
      color: #fff;
      margin-left: 5px;
    }

    .block {
      display: inline-block;
      width: 6px;
      height: 13px;
      background-color: #0488ea;
      margin-left: 2px;
    }
  }

  .el-main {
    position: relative;
    padding: 0;
    padding-top: 12px;
    overflow: hidden;

    .statistics {
      display: grid;
      grid-template-columns: repeat(2, 48%);
      grid-row-gap: 15px;
      grid-column-gap: 12px;
      list-style: none;
      padding: 0;
      height: 100%;

      > li {
        cursor: pointer;

        .icon {
          display: inline-block;
          width: 46px;
          height: 46px;
          background-position: center center;
          background-repeat: no-repeat;
        }

        .content {
          height: 100%;
          display: flex;
          color: #97c1ff;
          font-size: 14px;
          align-items: center;
          justify-content: space-evenly;
          box-shadow: 0 0 15px #0e5ee0 inset;
          border: 1px solid #0d3b86;
          box-sizing: content-box;

          > span {
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

          .num {
            font-size: 18px;
            line-height: 18px;
            font-weight: bold;
            background-image: linear-gradient(#03e9fc, #02aff2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-top: 4px;

            .unit {
              font-size: 14px;
              line-height: 14px;
              background-image: linear-gradient(#03e9fc, #02aff2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
}
</style>
