<template>
  <div style="width: 100%;height: 100%;">
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="wraper"
    >
      <el-container>
        <el-header>
          <div class="left">
            <div class="text">智慧用电监测</div>
          </div>
          <div class="right">
            <div class="alarmNum">
              <span class="text">今日报警设备（台）</span>
              <div class="num">
                <number-roll
                  ref="numberRoll"
                  :bg="true"
                  :width="'28px'"
                  :font-size="'36px'"
                  :number="alertCount"
                />
              </div>
            </div>
            <el-form ref="form" :inline="true" :model="listQuery" label-width="50px">
              <el-form-item label="楼座:">
                <span class="arrow" :class="isSelectBuilding ? 'arrow-up' : ''" />
                <el-select
                  v-model="listQuery.partId"
                  :popper-append-to-body="false"
                  style="width:146px"
                  placeholder="请选择楼座"
                  @change="buildingChange"
                  @visible-change="selectBuilding"
                >
                  <el-option :value="''" label="全部" />
                  <el-option
                    v-for="item in partList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="楼层:">
                <span class="arrow" :class="isSelectFloor ? 'arrow-up' : ''" />
                <el-select
                  v-model="listQuery.partAddrId"
                  :popper-append-to-body="false"
                  class="mini"
                  style="width:80px"
                  placeholder
                  @visible-change="selectFloor"
                >
                  <el-option :value="''" label="全部" />
                  <el-option
                    v-for="item in partAddrList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态:">
                <span class="arrow" :class="isSelectStatus?'arrow-up':''" />
                <el-select
                  v-model="listQuery.devElectricStatus"
                  :popper-append-to-body="false"
                  class="mini"
                  style="width:80px"
                  placeholder
                  @visible-change="selectStatus"
                >
                  <el-option :value="''" label="全部" />
                  <el-option
                    v-for="item in devStatusList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="_getAllElectricList()"
              >查询</el-button>
            </el-form>
          </div>
        </el-header>
        <div v-if="isHasData&&!loading" class="tips">暂无数据</div>
        <el-main>
          <el-container v-if="alertData.length>0">
            <el-header>
              <div class="title">
                <div class="text">报警设备</div>
                <svg-icon class="bg" icon-class="dev-title-alarm" />
              </div>
            </el-header>
            <el-main>
              <ul>
                <li v-for="item in alertData" :key="item.devid">
                  <dev-item
                    :dev-type="0"
                    :dev-status="3"
                    :dev-data="item"
                    @viewDetail="viewDetail(item)"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
              <el-button
                v-if="alertData.totalPage>alertData.currPage"
                type="primary"
                size="mini"
                @click="_getElectricList('3')"
              >加载更多</el-button>
            </el-main>
          </el-container>
          <el-container v-if="normalData.length>0">
            <el-header>
              <div class="title">
                <div class="text">正常设备</div>
                <svg-icon class="bg" icon-class="dev-title-onLine" />
              </div>
            </el-header>
            <el-main>
              <ul>
                <li v-for="item in normalData" :key="item.devid">
                  <dev-item
                    :dev-type="0"
                    :dev-status="1"
                    :dev-data="item"
                    @viewDetail="viewDetail(item)"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
              <el-button
                v-if="normalData.totalPage>normalData.currPage"
                type="primary"
                size="mini"
                @click="_getElectricList('1')"
              >加载更多</el-button>
            </el-main>
          </el-container>
          <el-container v-if="offlineData.length>0">
            <el-header>
              <div class="title">
                <div class="text">离线设备</div>
                <svg-icon class="bg" icon-class="dev-title-outLine" />
              </div>
            </el-header>
            <el-main>
              <ul>
                <li v-for="item in offlineData" :key="item.devid">
                  <dev-item
                    :dev-type="0"
                    :dev-status="2"
                    :dev-data="item"
                    @viewDetail="viewDetail(item)"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
              <el-button
                v-if="offlineData.totalPage>offlineData.currPage"
                type="primary"
                size="mini"
                @click="_getElectricList('2')"
              >加载更多</el-button>
            </el-main>
          </el-container>
          <el-container v-if="tripData.length>0">
            <el-header>
              <div class="title">
                <div class="text">脱扣设备</div>
                <svg-icon class="bg" icon-class="dev-title-trip" />
              </div>
            </el-header>
            <el-main>
              <ul>
                <li v-for="item in tripData" :key="item.devid">
                  <dev-item
                    :dev-type="0"
                    :dev-status="4"
                    :dev-data="item"
                    @viewDetail="viewDetail(item)"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
              <el-button
                v-if="tripData.totalPage>tripData.currPage"
                type="primary"
                size="mini"
                @click="_getElectricList('4')"
              >加载更多</el-button>
            </el-main>
          </el-container>
        </el-main>
        <transition name="el-fade-in-linear">
          <el-dialog
            v-if="dialogVisible"
            class="electricDetail dark"
            :destroy-on-close="true"
            :visible.sync="dialogVisible"
            width="1160px"
            close="closeDetail"
          >
            <div name="title" class="dialog-title">电设备详情</div>
            <div class="dialog-content">
              <dev-electric-info ref="devDetail" :latest-data="latestDetailData" :dev-data="devDataToView" />
            </div>
            <div name="footer" class="dialog-footer">
              <el-button @click="hide()">关闭</el-button>
            </div>
          </el-dialog>
        </transition>
      </el-container>
    </div>
  </div>
</template>

<script>
import DevItem from '@/components/devItem'
import NumberRoll from '@/components/numberRoll'
import DevElectricInfo from '@/components/devElectricInfo'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  getAllElectricList,
  getAlertCount,
  getDevStatusList,
  getElectricList
} from '@/api/electric'
import { mapGetters } from 'vuex'
import '@/styles/devList.scss'
export default {
  name: 'ElectricEquipmentAll',
  components: {
    DevItem,
    NumberRoll,
    DevElectricInfo
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      devDataToView: {}, // 传入详情页面的数据
      mqttClient: null,
      showDetailId: '', // 当前打开的详情页面的设备id(mqtt更新数据)
      showAlarmRecordId: '', // 查看报警记录的设备id
      alertType: 5, // 查询报警记录类型（0电压，1电流，2温度，3剩余电流）
      isResetTableFlag: false, // 每次打开报警记录重新请求
      alertLocation: '', // 设备位置
      alertData: [], // 报警设备列表
      normalData: [], // 正常设备列表
      offlineData: [], // 离线设备列表
      tripData: [], // 脱扣设备列表
      /**  加载更多查询参数（page）*/
      alertPage: 1,
      normalPage: 1,
      offlinePage: 1,
      tripPage: 1,
      /** */
      devStatusList: [], // 设备状态列表
      alertCount: 0, // 设备报警总数
      partList: [], // 楼座
      partAddrList: [], // 楼层
      latestData: {}, // mqtt最新数据
      latestDetailData: {},

      /**  自定义下拉选择框*/
      isSelectBuilding: false,
      isSelectFloor: false,
      isSelectStatus: false,
      /** */
      listQuery: {// 查询参数
        partId: '',
        partAddrId: '',
        devElectricStatus: ''
      },
      moreListQuery: {// 分类查询参数
        partId: '',
        partAddrId: '',
        page: 1,
        limit: 5,
        devElectricStatus: ''
      }
    }
  },
  computed: {
    // 是否有设备列表数据
    isHasData() {
      if (!this.alertData.length && !this.normalData.length && !this.tripData.length && !this.offlineData.length) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters([
      'electricLatestData'
    ])
  },
  watch: {
    'listQuery.partId': {
      handler(newVal, oldVal) {
        this.listQuery.partAddrId = ''
        this._getPartsAddrList(newVal)
      }
    },
    electricLatestData(newVal) {
      if (newVal) {
        this.latestData = newVal
        this.updateData()
        if (this.latestData.devid === this.showDetailId) {
          this.latestDetailData = this.latestData
        }
      }
    }
  },
  created() {
    this.$store.dispatch('device/changeIsSubscribeElectric', true)// 订阅电设备最新数据
    this._getAlertCount()
    this._getPartsList()
    this._getDevStatusList()
    this._getAllElectricList()
  },
  // 页面销毁取消订阅
  beforeDestroy() {
    this.$store.dispatch('device/changeIsSubscribeElectric', false)// 取消订阅
  },
  methods: {
    // 打开报警记录页
    viewAlertRecord(type, id, location) {
      this.showAlarmRecordId = id
      this.alertType = type
      this.alertLocation = location
      this.isResetTableFlag = !this.isResetTableFlag
      this.$refs.alertRecord.show()
    },
    // 打开设备详情页
    viewDetail(data) {
      this.devDataToView = data
      this.dialogVisible = true
      this.showDetailId = data.devid
    },
    // 关闭设备详情页
    closeDetail() {
      this.showDetailId = ''
      this.latestDetailData = {}
    },
    // 关闭设备详情窗口
    hide() {
      this.dialogVisible = false
      this.showDetailId = ''
      this.latestDetailData = {}
    },
    // 获取页面初始化数据
    async _getAllElectricList() {
      const query = this.listQuery
      this.moreListQuery = Object.assign(
        {},
        this.moreListQuery,
        this.listQuery
      )
      // 将分类分页参数置为1
      this.alertPage = 1
      this.normalPage = 1
      this.offlinePage = 1
      this.tripPage = 1
      // 未选择设备状态
      if (query.devElectricStatus === '') {
        const data = await getAllElectricList(query)
        this.alertData = data.alertData.list || []
        this.normalData = data.normalData.list || []
        this.offlineData = data.offlineData.list || []
        this.tripData = data.tripData.list || []
        this.loading = false
      } else {
        this.alertData = []
        this.normalData = []
        this.offlineData = []
        this.tripData = []
        getElectricList(query).then(res => {
          switch (query.devElectricStatus) {
            case '1':
              this.normalData = res.data.page.list
              break
            case '2':
              this.offlineData = res.data.page.list
              break
            case '3':
              this.alertData = res.data.page.list
              break
            case '4':
              this.tripData = res.data.page.list
              break
          }
        })
      }
    },
    // 电设备列表查询（加载更多）
    _getElectricList(status) {
      let params = {}
      switch (status) {
        case '1':
          this.normalPage += 1
          params = Object.assign({}, this.moreListQuery, {
            devElectricStatus: status,
            page: this.normalPage,
            limit: 5
          })
          getElectricList(params).then(res => {
            if (res.data) {
              this.normalData = [
                ...this.normalData,
                ...res.data.page.list
              ]
            }
          })
          break
        case '2':
          this.offlinePage += 1
          params = Object.assign({}, this.moreListQuery, {
            devElectricStatus: status,
            page: this.offlinePage,
            limit: 5
          })
          getElectricList(params).then(res => {
            if (res.data) {
              this.offlineData = [
                ...this.offlineData,
                ...res.data.page.list
              ]
            }
          })
          break
        case '3':
          this.alertPage += 1
          params = Object.assign({}, this.moreListQuery, {
            devElectricStatus: status,
            page: this.alertPage,
            limit: 5
          })
          getElectricList(params).then(res => {
            if (res.data) {
              this.alertData = [
                ...this.alertData,
                ...res.data.page.list
              ]
            }
          })
          break
        case '4':
          this.tripPage += 1
          params = Object.assign({}, this.moreListQuery, {
            devElectricStatus: status,
            page: this.tripPage,
            limit: 5
          })
          getElectricList(params).then(res => {
            if (res.data) {
              this.tripData = [
                ...this.tripData,
                ...res.data.page.list
              ]
            }
          })
          break
      }
    },
    // 获取设备报警总数
    _getAlertCount() {
      getAlertCount().then(res => {
        if (res.data) {
          this.alertCount = res.data
        }
      })
    },
    // 获取设备状态列表
    _getDevStatusList() {
      getDevStatusList().then(res => {
        if (res.data) {
          this.devStatusList = res.data
        }
      })
    },
    // 获取采集部位列表
    _getPartsList() {
      getPartsList().then(res => {
        if (res.data) {
          this.partList = res.data
        }
      })
    },
    //
    _getPartsAddrList(id) {
      getPartsAddrList({ partsId: id }).then((res) => {
        if (res.data) {
          this.partAddrList = res.data
        }
      })
    },
    selectBuilding(flag) {
      this.isSelectBuilding = flag
    },
    buildingChange() {
      this.listQuery.partAddrId = ''
    },
    selectFloor(flag) {
      this.isSelectFloor = flag
    },
    selectStatus(flag) {
      this.isSelectStatus = flag
    },
    mqttEnd() {
      this.mqttClient.end()
    },
    // 更新列表数据
    updateData() {
      const list = [
        ...this.normalData,
        ...this.offlineData,
        ...this.alertData,
        ...this.tripData
      ]
      const index = this.findIndex(list, this.latestData)
      if (index === -1) {
        return false
      } else {
        const targetData = list[index]
        const isAlert = this.latestData.isDayAlert || 0
        const isTrip = this.latestData.isTrip || 0
        const lastRevtime = this.latestData.lastTime || ''
        const newData = Object.assign({}, targetData, { lastRevtime, isAlert, person: this.latestData })
        if (this.alertData && this.alertData.includes(targetData)) {
          const index = this.findIndex(this.alertData, targetData)
          if (isAlert === 1) {
            this.$set(this.alertData, index, newData)
            // this.alertData.list[index] = newData
          } else if (isTrip === 1) {
            this.alertData.splice(index, 1)
            this.tripData.push(newData)
          } else {
            this.alertData.splice(index, 1)
            this.normalData.push(newData)
          }
        }
        if (this.normalData && this.normalData.includes(targetData)) {
          const index = this.findIndex(this.normalData, targetData)
          if (isAlert === 1) {
            this.normalData.splice(index, 1)
            this.alertData.push(newData)
          } else if (isTrip === 1) {
            this.normalData.splice(index, 1)
            this.tripData.push(newData)
          } else {
            this.$set(this.normalData, index, newData)
            // this.normalData.list[index] = newData
          }
        }
        if (this.offlineData && this.offlineData.includes(targetData)) {
          const index = this.findIndex(this.offlineData, targetData)
          if (isAlert === 1) {
            this.offlineData.splice(index, 1)
            this.alertData.push(newData)
          } else if (isTrip === 1) {
            this.offlineData.splice(index, 1)
            this.tripData.push(newData)
          } else {
            this.offlineData.splice(index, 1)
            this.normalData.push(newData)
          }
        }
        if (this.tripData && this.tripData.includes(targetData)) {
          const index = this.findIndex(this.tripData, targetData)
          if (isAlert === 1) {
            this.this.tripData.splice(index, 1)
            this.alertData.push(newData)
          } else if (isTrip === 1) {
            // this.tripData[index] = newData
            this.$set(this.tripData, index, newData)
          } else {
            this.this.tripData.splice(index, 1)
            this.normalData.push(newData)
          }
        }
      }
    },
    findIndex(list, data) {
      return list.findIndex(item => {
        return item.devid === data.devid
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  height: 100%;
}
</style>
