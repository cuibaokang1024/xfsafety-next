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
            <div class="text">可燃气体预警</div>
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
                  v-model="listQuery.devGasStatus"
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
                @click="_getAllGasList()"
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
                <li v-for="(item,index) in alertData" :key="index">
                  <dev-item
                    :dev-status="3"
                    :dev-type="3"
                    :dev-data="item"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
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
                <li v-for="(item,index) in normalData" :key="index">
                  <dev-item
                    :dev-status="1"
                    :dev-type="3"
                    :dev-data="item"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
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
                <li v-for="(item,index) in offlineData" :key="index">
                  <dev-item
                    :dev-status="2"
                    :dev-type="3"
                    :dev-data="item"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
            </el-main>
          </el-container>
          <el-container v-if="tripData.length>0">
            <el-header>
              <div class="title">
                <div class="text">故障设备</div>
                <svg-icon class="bg" icon-class="dev-title-trip" />
              </div>
            </el-header>
            <el-main>
              <ul>
                <li v-for="(item,index) in tripData" :key="index">
                  <dev-item
                    :dev-status="5"
                    :dev-type="3"
                    :dev-data="item"
                    @viewAlertRecord="viewAlertRecord"
                  />
                </li>
              </ul>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>
    <alarm-record :id="showAlarmRecordId" ref="alertRecord" :dev-type="3" :is-reset-table-flag="isResetTableFlag" :addr="alertLocation" />
  </div>
</template>

<script>
import DevItem from '@/components/devItem'
import NumberRoll from '@/components/numberRoll'
import AlarmRecord from '@/components/alarmRecord'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  getAllGasList,
  getAlertCount,
  getDevStatusList,
  getGasList
} from '@/api/gas'
import '@/styles/devList.scss'
export default {
  name: 'ElectricEquipmentAll',
  components: {
    DevItem,
    NumberRoll,
    AlarmRecord
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      showAlarmRecordId: '', // 查看报警记录的设备id
      isResetTableFlag: false, // 每次打开报警记录重新请求
      alertLocation: '', // 设备位置
      alertData: [], // 报警设备列表
      normalData: [], // 正常设备列表
      offlineData: [], // 离线设备列表
      tripData: [], // 故障设备列表
      /** */
      devStatusList: [], // 设备状态列表
      alertCount: 0, // 设备报警总数
      partList: [], // 楼座
      partAddrList: [], // 楼层
      /**  自定义下拉选择框*/
      isSelectBuilding: false,
      isSelectFloor: false,
      isSelectStatus: false,
      /** */
      listQuery: {// 查询参数
        partId: '',
        partAddrId: '',
        devGasStatus: '',
        page: 1,
        limit: -1
      }
    }
  },
  computed: {
    // 楼层列表
    floorList() {
      const selectedBuilding = this.BuildingList.filter(item => {
        return item.id === this.listQuery.partId
      })
      if (selectedBuilding && selectedBuilding.length > 0) {
        return selectedBuilding[0].partsAddrEntity
      } else {
        return false
      }
    },
    // 是否有设备列表数据
    isHasData() {
      if (!this.alertData.length && !this.normalData.length && !this.tripData.length && !this.offlineData.length) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this._getAlertCount()
    this._getPartsList()
    this._getDevStatusList()
    this._getAllGasList()
  },
  methods: {
    // 打开报警记录页
    viewAlertRecord(id, location) {
      this.showAlarmRecordId = id
      this.alertLocation = location
      this.isResetTableFlag = !this.isResetTableFlag
      this.$refs.alertRecord.show()
    },
    // 获取页面初始化数据
    async _getAllGasList() {
      this.loading = true
      const query = this.listQuery
      // 未选择设备状态
      this.alertData = []
      this.normalData = []
      this.offlineData = []
      this.tripData = []
      if (query.devGasStatus === '') {
        const data = await getAllGasList(query)
        this.alertData = data.alertData.list || []
        this.normalData = data.normalData.list || []
        this.offlineData = data.offlineData.list || []
        this.tripData = data.tripData.list || []
        this.loading = false
      } else {
        getGasList({ ...query, deviceStatus: query.devGasStatus }).then(res => {
          switch (query.devGasStatus) {
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
          this.loading = false
        })
      }
    },
    // 燃气备列表查询（加载更多）
    _getGasList(status) {
      let params = {}
      switch (status) {
        case '1':
          this.normalPage += 1
          params = Object.assign({}, this.moreListQuery, {
            devGasStatus: status,
            page: this.normalPage,
            limit: 5
          })
          getGasList(params).then(res => {
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
            devGasStatus: status,
            page: this.offlinePage,
            limit: 5
          })
          getGasList(params).then(res => {
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
            devGasStatus: status,
            page: this.alertPage,
            limit: 5
          })
          getGasList(params).then(res => {
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
            devGasStatus: status,
            page: this.tripPage,
            limit: 5
          })
          getGasList(params).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  height: 100%;
}
</style>
