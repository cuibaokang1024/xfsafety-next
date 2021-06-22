<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">物联网</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <ul class="iot-list">
        <li v-for="item in iotList" :key="item.id" class="item" @click="viewDevList(item.path)">
          <div class="content">
            <span class="icon" :style="{backgroundImage:`url(${item.icon})`}" />
            <div class="data">
              <span class="text">{{ item.text }}</span>
              <span class="num">{{ iotData[item.name] }}<span class="unit">家</span></span>
            </div>
          </div>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import './style/index.scss'
import { getDevicecount } from '@/api/home'
import { getAreaDevicecount } from '@/api/emergencyHome'
export default {
  props: {
    homeType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iotList: [
        {
          id: 1,
          path: '/IOU/electricMonitoring',
          name: 'electric',
          text: '智慧用电监测',
          icon: require('./images/icon_electric.png')
        },
        {
          id: 2,
          path: 'IOU/waterRegulatoryAll',
          name: 'water',
          text: '智慧用水监测',
          icon: require('./images/icon_water.png')
        },
        {
          id: 3,
          path: '/IOU/gasMonitoring',
          name: 'gas',
          text: '可燃气体监测',
          icon: require('./images/icon_gas.png')
        },
        {
          id: 4,
          path: '/IOU/smokeMonitoring',
          name: 'smoke',
          text: '独立烟感监测',
          icon: require('./images/icon_smoke.png')
        },
        {
          id: 5,
          path: '',
          name: 'cam',
          text: '可视化监测',
          icon: require('./images/icon_camera.png')
        },
        {
          id: 6,
          path: '',
          name: 'infotx',
          text: '火灾自动联网报警监测',
          icon: require('./images/icon_infoTx.png')
        }
      ],
      iotData: {}
    }
  },
  created() {
    this._getDevicecount()
  },
  methods: {
    viewDevList(path) {
      if (path) {
        this.$router.push(path)
      } else {
        this.$message({
          type: 'info',
          message: '建设中'
        })
      }
    },
    _getDevicecount() {
      if (this.homeType === 'emergency') {
        getAreaDevicecount().then((res) => {
          if (res.data) {
            this.iotData = res.data.info
          }
        })
      } else {
        getDevicecount().then((res) => {
          if (res.data) {
            this.iotData = res.data.info
          }
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-container {
  .el-main {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 16px 0 10px;
    border: 1px solid #0180ff;
    background-color: #080d4f;
    overflow: hidden;
    .iot-list{
      width: 100%;
      height: 100%;
      padding: 18px 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      >li{
        flex: 0 1 32%;
        height: 50%;
        margin-right:2%;
        padding: 4px 0;
        cursor: pointer;
        .content{
          height: 100%;
          border: 1px dashed #0180ff;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon{
            display: inline-block;
            width: 57px;
            height: 47px;
            background-size: 47px 47px;
            background-repeat: no-repeat;
            background-position: center;
          }
          .data{
            height: 47px;
            display: flex;
            flex: 1;
            align-items: flex-start;
            justify-content: space-around;
            flex-direction: column;
            .text{
              color: #97c1ff;
              font-size: 14px;
            }
            .num{
              color: #e9e812;
              font-size: 18px;
              font-weight: bold;
              .unit{
                font-size: 12px;
                color: #97c1ff;
                margin-left: 3px;
              }
            }
          }
        }
        &:nth-child(3){
          margin-right: 0;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
}
</style>
