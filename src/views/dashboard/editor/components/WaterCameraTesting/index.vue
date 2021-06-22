<template>
  <div class="container watercameratesting">
    <div class="water">
      <div v-if="accessWaterStatus">
        <div class="head">
          <div class="icon" />
          <div class="text">用水监测</div>
        </div>
        <div class="center">
          <div class="left">
            <PieChart id="waterPieChart" width="100%" height="100%" :chart-data="waterPieData" />
          </div>
          <div class="right">
            <div class="right-item" @click="handlerLinkWater">
              <div class="title">安装设备</div>
              <div class="text">
                <span>{{ iotData.water }}</span>
                套
              </div>
            </div>
            <div class="right-item" @click="handlerLinkWater">
              <div class="title">报警设备</div>
              <div class="text">
                <span>{{ iotData.waterAlert }}</span>
                套
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!accessWaterStatus">
        <AccessCover
          width="100%"
          height="100%"
          title="用水检测"
          :status="0"
          @handleClickInfo="handleClickInfo"
        />
      </div>
    </div>
    <div class="camera">
      <div class="head">
        <div class="icon" />
        <div class="text">可视化监测</div>
      </div>
      <div class="center" @click="handlerLinkCamera">
        <div class="icon" />
        <div class="text">可视化监测</div>
      </div>
    </div>
  </div>
</template>

<script>
import { handlerOfficeHomeIotData } from '@/api/companyHome'

import PieChart from '@/components/Charts/pieChart'
import AccessCover from '../AccessCover'
import store from '@/store'
export default {
  // 用水及可视化检测
  name: 'WaterCameraTesting',
  components: {
    PieChart,
    AccessCover
  },
  data() {
    return {
      iotData: {}
    }
  },
  computed: {
    // 是否显示接入与未接入画面 0为未接入 1为接入
    accessWaterStatus() {
      return !(this.iotData.water <= 0)
    },
    waterPieData() {
      const waterPieData = {
        unit: '套，约占',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          left: 'center',
          itemWidth: 20,
          itemHeight: 6,
          textStyle: {
            color: '#fff'
          },
          data: ['在线', '离线', '报警']
        },
        series: [
          {
            name: '',
            radius: ['60%', '90%'],
            center: ['50%', '40%'],
            label: {
              show: false,
              position: 'center'
            },
            data: [
              {
                id: '152',
                value: this.iotData.waterOnline,
                name: '在线'
              },
              {
                id: '153',
                value: this.iotData.waterOffline,
                name: '离线'
              },
              {
                id: '154',
                value: this.iotData.waterAlert,
                name: '报警'
              }
            ],
            color: ['#7ec148', '#fd6e6e', '#edeb4c']
          }
        ]
      }
      return waterPieData
    }
  },
  created() {
    this._handlerOfficeHomeIotData()
  },
  methods: {
    _handlerOfficeHomeIotData() {
      handlerOfficeHomeIotData().then(res => {
        if (res.data) {
          this.iotData = res.data.info
        }
      })
    },
    handleClickInfo(status) {
      if (status === 0) {
        if (!this.accessWaterStatus) {
          return this.$router.push('/dashboard/editor/accessWater')
        }
      }
    },
    handlerLinkWater() {
      sessionStorage.setItem('filterRouteId', 10002)
      store.dispatch('permission/filterRoutes', 10002)
      this.$router.push('/IOT/waterEquipmentAll')
    },
    handlerLinkCamera() {
      sessionStorage.setItem('filterRouteId', 10002)
      store.dispatch('permission/filterRoutes', 10002)
      this.$router.push('/IOT/cameraEquipmentAll')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
