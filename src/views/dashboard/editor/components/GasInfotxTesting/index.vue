<template>
  <div class="container gasinfotxtesting">
    <div class="gas" style="float: left;">
      <div v-if="accessGasStatus">
        <div class="head">
          <div class="icon" />
          <div class="text">燃气监测</div>
        </div>
        <div class="center">
          <div class="top">
            <PieChart id="gasPieChart" width="100%" height="100%" :chart-data="gasPieData" />
          </div>
          <div class="bot">
            <div class="bot-item" @click="handlerLinkGas">
              <div class="title">安装设备</div>
              <div class="text">
                <span>{{ iotData.gas }}</span>
                套
              </div>
            </div>
            <div class="bot-item" @click="handlerLinkGas">
              <div class="title">报警设备</div>
              <div class="text">
                <span>{{ iotData.gasAlert }}</span>
                套
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!accessGasStatus">
        <AccessCover
          width="100%"
          height="100%"
          title="燃气检测"
          :status="3"
          @handleClickInfo="handleClickInfo"
        />
      </div>
    </div>
    <div class="infotx" style="float: right;">
      <div v-if="accessIntotxStatus">
        <div class="head">
          <div class="icon" />
          <div class="text">火灾自动联网报警</div>
        </div>
        <div class="center">
          <div class="top">
            <PieChart id="infotxPieChart" width="100%" height="100%" :chart-data="infotxPieData" />
          </div>
          <div class="bot">
            <div class="bot-item" @click="handlerLinkInfotx">
              <div class="title">安装设备</div>
              <div class="text">
                <span>{{ iotData.infotx }}</span>
                套
              </div>
            </div>
            <div class="bot-item" @click="handlerLinkInfotx">
              <div class="title">报警设备</div>
              <div class="text">
                <span>{{ iotData.infotxAlert }}</span>
                套
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!accessIntotxStatus">
        <AccessCover
          width="100%"
          height="100%"
          title="火灾自动联网报警"
          :status="4"
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
  // 燃气及火灾自动联网检测
  name: 'GasInfotxTesting',
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
    accessGasStatus() {
      return !(this.iotData.gas <= 0)
    },
    accessIntotxStatus() {
      return !(this.iotData.infotx <= 0)
    },
    gasPieData() {
      const gasPieData = {
        unit: '套，约占',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          left: '60%',
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
            center: ['30%', '50%'],
            label: {
              show: false,
              position: 'center'
            },
            data: [
              {
                id: '152',
                value: this.iotData.gasOnline,
                name: '在线'
              },
              {
                id: '153',
                value: this.iotData.gasOffline,
                name: '离线'
              },
              {
                id: '154',
                value: this.iotData.gasAlert,
                name: '报警'
              }
            ],
            color: ['#7ec148', '#fd6e6e', '#edeb4c']
          }
        ]
      }
      return gasPieData
    },
    infotxPieData() {
      const infotxPieData = {
        unit: '套，约占',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          left: '60%',
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
            center: ['30%', '50%'],
            label: {
              show: false,
              position: 'center'
            },
            data: [
              {
                id: '152',
                value: this.iotData.infotxOnline,
                name: '在线'
              },
              {
                id: '153',
                value: this.iotData.infotxOffline,
                name: '离线'
              },
              {
                id: '154',
                value: this.iotData.infotxAlert,
                name: '报警'
              }
            ],
            color: ['#7ec148', '#fd6e6e', '#edeb4c']
          }
        ]
      }
      return infotxPieData
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
      if (status === 3) {
        if (!this.accessGasStatus) {
          return this.$router.push('/dashboard/editor/accessGas')
        }
      } else if (status === 4) {
        if (!this.accessIntotxStatus) {
          return this.$router.push('/dashboard/editor/accessInfotx')
        }
      }
    },
    handlerLinkGas() {
      sessionStorage.setItem('filterRouteId', 10002)
      store.dispatch('permission/filterRoutes', 10002)
      this.$router.push('/IOT/gasEquipmentAll')
    },
    handlerLinkInfotx() {
      sessionStorage.setItem('filterRouteId', 10002)
      store.dispatch('permission/filterRoutes', 10002)
      this.$router.push('/IOT/infotxOfficeList')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
