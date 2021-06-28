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
            <div class="text">智慧用水监测</div>
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
                  v-model="listQuery.devWaterStatus"
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
                @click="_getAllWaterList()"
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
              <ul class="container">
                <li v-for="item in alertData" :key="item.id">
                  <dev-item :dev-status="3" :dev-type="1" :dev-data="item" @viewAlertRecord="viewAlertRecord" @viewDetail="viewDetail(item)" />
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
                  <dev-item :dev-status="1" :dev-type="1" :dev-data="item" @viewAlertRecord="viewAlertRecord" @viewDetail="viewDetail(item)" />
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
                <li v-for="(item,index) in offlineData" :key="index">
                  <dev-item :dev-status="2" :dev-type="1" :dev-data="item" @viewAlertRecord="viewAlertRecord" @viewDetail="viewDetail(item)" />
                </li>
              </ul>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
      <el-dialog
        v-if="dialogVisible"
        class="waterDetail dark"
        :destroy-on-close="true"
        :visible.sync="dialogVisible"
        width="930px"
        close="closeDetail"
      >
        <div name="title" class="dialog-title">水设备详情</div>
        <div class="dialog-content">
          <dev-water-info ref="devDetail" :dev-data="devDataToView" />
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="hide()">关闭</el-button>
        </div>
      </el-dialog>
      <alarm-record :id="showAlarmRecordId" ref="alertRecord" :dev-type="1" :is-reset-table-flag="isResetTableFlag" :addr="alertLocation" />
    </div>
  </div>

</template>

<script>
import DevItem from '@/components/devItem'
import NumberRoll from '@/components/numberRoll'
import DevWaterInfo from '@/components/devWaterInfo'
import AlarmRecord from '@/components/alarmRecord'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  getAllWaterList,
  getAlertCount,
  getDevStatusList,
  getWaterList
} from '@/api/water'
import '@/styles/devList.scss'
export default {
  components: {
    DevItem,
    NumberRoll,
    DevWaterInfo,
    AlarmRecord
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      devDataToView: {}, // 传入详情页面的数据
      showAlarmRecordId: '', // 查看报警记录的设备id
      isResetTableFlag: false,
      alertLocation: '', // 设备位置
      alertData: [], // 报警设备列表
      normalData: [], // 正常设备列表
      offlineData: [], // 离线设备列表
      /**  加载更多查询参数（page）*/
      alertPage: 1,
      normalPage: 1,
      offlinePage: 1,
      /** */
      devStatusList: [], // 设备状态列表
      alertCount: 0, // 设备报警总数
      BuildingList: [], // 采集部位列表
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
        page: 1,
        limit: 5,
        devWaterStatus: ''
      },
      moreListQuery: {// 分类查询参数
        partId: '',
        partAddrId: '',
        page: 1,
        limit: 5,
        devWaterStatus: ''
      }
    }
  },
  computed: {
    // 是否有设备列表数据
    isHasData() {
      if (!this.alertData.length && !this.normalData.length && !this.offlineData.length) {
        return true
      } else {
        return false
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
    this._getAllWaterList()
  },
  methods: {
    // 打开报警记录页
    viewAlertRecord(id, location) {
      this.showAlarmRecordId = id
      this.alertLocation = location
      this.isResetTableFlag = !this.isResetTableFlag
      this.$refs.alertRecord.show()
    },
    // 打开设备详情页
    viewDetail(data) {
      this.devDataToView = data
      this.dialogVisible = true
    },
    // 关闭设备详情窗口
    hide() {
      this.dialogVisible = false
    },
    // 获取页面初始化数据
    async _getAllWaterList() {
      this.loading = true
      const query = this.listQuery
      this.moreListQuery = Object.assign(
        {},
        this.moreListQuery,
        this.listQuery
      )
      // 未选择设备状态
      if (query.devWaterStatus === '') {
        const data = await getAllWaterList(query)
        this.alertData = data.alertData.list || []
        this.normalData = data.normalData.list || []
        this.offlineData = data.offlineData.list || []
        this.loading = false
      } else {
        this.alertData = []
        this.normalData = []
        this.offlineData = []
        this.loading = true
        getWaterList(query).then(res => {
          switch (query.devWaterStatus) {
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
    devInfoHide() {
      this.isShowDevInfo = false
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
<style lang="scss">

.waterDetail {
  .el-dialog__body{
    padding-top: 0;
  }
}
</style>
