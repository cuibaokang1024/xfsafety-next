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
            <div class="text">智慧烟感监测</div>
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
                  v-model="listQuery.devSmokeStatus"
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
                @click="_getAllSmokeList()"
              >查询</el-button>
            </el-form>
          </div>
        </el-header>
        <el-main>
          <el-container v-if="alertData.length>0">
            <el-header>
              <div class="title">
                <div class="text">报警设备</div>
                <svg-icon class="bg" icon-class="dev-title-alarm" />
              </div>
            </el-header>
            <el-main>
              <ul class="container">
                <li v-for="item in alertData" :key="item.id">
                  <dev-item :dev-status="3" :dev-type="2" :dev-data="item" @viewAlertRecord="viewAlertRecord" />
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
              <ul class="container">
                <li v-for="item in normalData" :key="item.id">
                  <dev-item :dev-status="1" :dev-type="2" :dev-data="item" @viewAlertRecord="viewAlertRecord" />
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
              <ul class="container">
                <li v-for="item in offlineData" :key="item.id">
                  <dev-item :dev-status="2" :dev-type="2" :dev-data="item" @viewAlertRecord="viewAlertRecord" />
                </li>
              </ul>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
      <alarm-record :id="showAlarmRecordId" ref="alertRecord" :dev-type="2" :is-reset-table-flag="isResetTableFlag" :addr="alertLocation" />
    </div>
  </div>

</template>

<script>
import DevItem from '@/components/devItem'
import NumberRoll from '@/components/numberRoll'
import AlarmRecord from '@/components/alarmRecord'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import { getAllSmokeList, getSmokeList, getAlertCount, getDevStatusList } from '@/api/smoke'
import '@/styles/devList.scss'
export default {
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
      isResetTableFlag: false,
      alertLocation: '', // 设备位置
      alertData: [], // 报警设备列表
      normalData: [], // 正常设备列表
      offlineData: [], // 离线设备列表
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
        devSmokeStatus: ''
      }
    }
  },
  watch: {
    'listQuery.partId': {
      handler(newVal, oldVal) {
        this.listQuery.partAddrId = ''
        this._getPartsAddrList(newVal)
      }
    }
  },
  created() {
    this._getAlertCount()
    this._getPartsList()
    this._getDevStatusList()
    this._getAllSmokeList()
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
    async _getAllSmokeList() {
      const query = this.listQuery
      // 未选择设备状态
      if (query.devSmokeStatus === '') {
        const data = await getAllSmokeList(query)
        this.alertData = data.alertData.list || []
        this.normalData = data.normalData.list || []
        this.offlineData = data.offlineData.list || []
        this.loading = false
      } else {
        this.alertData = []
        this.normalData = []
        this.offlineData = []
        this.loading = true
        getSmokeList(query).then(res => {
          switch (query.devSmokeStatus) {
            case '1':
              this.normalData = res.data.page.list
              break
            case '2':
              this.offlineData = res.data.page.list
              break
            case '3':
              this.alertData = res.data.page.list
              break
          }
          this.loading = false
        })
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
