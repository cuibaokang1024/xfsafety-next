<template>
  <div class="container electricsmoketesting">
    <div class="electric">
      <div v-if="accessElectricStatus">
        <div class="head">
          <div class="icon" />
          <div class="text">用电监测</div>
        </div>
        <div class="center">
          <div class="left">
            <PieChart
              id="electricPieChart"
              width="100%"
              height="100%"
              :chart-data="electricPieData"
            />
          </div>
          <div class="right">
            <div class="right-item" @click="handleLinkElectric">
              <div class="title">安装设备</div>
              <div class="text">
                <span>{{ iotData.electric }}</span>
                套
              </div>
            </div>
            <div class="right-item" @click="handleLinkElectric">
              <div class="title">报警设备</div>
              <div class="text">
                <span>{{ iotData.electricAlert }}</span>
                套
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!accessElectricStatus">
        <AccessCover
          width="100%"
          height="100%"
          title="用电检测"
          :status="1"
          @handleClickInfo="handleClickInfo"
        />
      </div>
    </div>
    <div class="smoke">
      <div v-if="accessSmokeStatus">
        <div class="head">
          <div class="icon" />
          <div class="text">烟感监测</div>
        </div>
        <div class="center">
          <div class="left">
            <PieChart id="smokePieChart" width="100%" height="100%" :chart-data="smokePieData" />
          </div>
          <div class="right">
            <div class="right-item" @click="handleLinkSmoke">
              <div class="title">安装设备</div>
              <div class="text">
                <span>{{ iotData.smoke }}</span>
                套
              </div>
            </div>
            <div class="right-item" @click="handleLinkSmoke">
              <div class="title">报警设备</div>
              <div class="text">
                <span>{{ iotData.smokeAlert }}</span>
                套
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!accessSmokeStatus">
        <AccessCover
          width="100%"
          height="100%"
          title="烟感检测"
          :status="2"
          @handleClickInfo="handleClickInfo"
        />
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
  // 用电及烟感检测
  name: 'ElectricSmokeTesting',
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
    accessElectricStatus() {
      return !(this.iotData.electric <= 0)
    },
    accessSmokeStatus() {
      return !(this.iotData.smoke <= 0)
    },
    electricPieData() {
      const electricPieData = {
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
                value: this.iotData.electricOnline,
                name: '在线'
              },
              {
                id: '153',
                value: this.iotData.electricOffline,
                name: '离线'
              },
              {
                id: '154',
                value: this.iotData.electricAlert,
                name: '报警'
              }
            ],
            color: ['#7ec148', '#fd6e6e', '#edeb4c']
          }
        ]
      }
      return electricPieData
    },
    smokePieData() {
      const smokePieData = {
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
                value: this.iotData.smokeOnline,
                name: '在线'
              },
              {
                id: '153',
                value: this.iotData.smokeOffline,
                name: '离线'
              },
              {
                id: '154',
                value: this.iotData.smokeAlert,
                name: '报警'
              }
            ],
            color: ['#7ec148', '#fd6e6e', '#edeb4c']
          }
        ]
      }
      return smokePieData
    }
  },
  created() {
    this._handlerOfficeHomeIotData()
  },
  methods: {
    _handlerOfficeHomeIotData() {
      handlerOfficeHomeIotData().then(res => {
        this.iotData = res.data.info
      })
    },
    handleClickInfo(status) {
      if (status === 1) {
        if (!this.accessElectricStatus) {
          return this.$router.push('/dashboard/editor/accessElectric')
        }
      } else if (status === 2) {
        if (!this.accessSmokeStatus) {
          return this.$router.push('/dashboard/editor/accessSmoke')
        }
      }
    },
    handleLinkElectric() {
      sessionStorage.setItem('filterRouteId', 10002)
      store.dispatch('permission/filterRoutes', 10002)
      this.$router.push('/IOT/electricEquipmentAll')
    },
    handleLinkSmoke() {
      sessionStorage.setItem('filterRouteId', 10002)
      store.dispatch('permission/filterRoutes', 10002)
      this.$router.push('/IOT/smokeEquipmentAll')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
