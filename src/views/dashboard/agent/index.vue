<template>
  <div class="agent-home">
    <div class="container">
      <div class="map-wrapper">
        <BasMap :points="officeMapList" @viewDetail="viewUnitArchives" @belongUnits="belongUnits" />
        <div class="left">
          <div class="header">
            <el-select v-model="listQuery.deviceType">
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in deviceTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="content">
            <div v-for="item in devNum" :key="item.id" class="item">
              <p class="label">{{ item.label }}</p>
              <div class="num" @click="getOfficeListByStatus(item.deviceStatus)">
                <NumberRoll
                  ref="numberRoll"
                  :width="'19px'"
                  :complement="deviceStat[item.name] | complement"
                  :font-size="'18px'"
                  :number="deviceStat[item.name]"
                  :unit="'套'"
                />
              </div>
            </div>
          </div>
        </div>
        <transation name="slide">
          <div v-show="isShowOfficeList" class="right">
            <div class="header">
              <el-input v-model="listQuery.officeName">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="_getOfficeList" />
              </el-input>
            </div>
            <div class="label">单位列表</div>
            <ul v-scrollBottom="_getMoreOfficeList" class="unit-list">
              <li v-for="office in officeList" :key="office.id">
                <div class="title">{{ office.name }}</div>
                <div class="content">
                  <span class="item" @click="viewUnitDevList(office,1)">
                    <span class="num">{{ office.online||0 }}</span>
                    <span class="text">在线</span>
                  </span>
                  <span class="item" @click="viewUnitDevList(office,6)">
                    <span class="num">{{ office.warning||0 }}</span>
                    <span class="text">告警</span>
                  </span>
                  <span class="item" @click="viewUnitDevList(office,2)">
                    <span class="num">{{ office.offline||0 }}</span>
                    <span class="text">离线</span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </transation>
      </div>
      <div class="alert">
        <DevAlertList />
      </div>
      <div class="projectView">
        <projectView />
      </div>
      <div class="customDetail">
        <CustomDetail />
      </div>
      <div class="noticeCenter">
        <noticeCenter />
      </div>
    </div>
    <UnitDevList
      ref="unitDevList"
      :office-id="viewDevOfficeId"
      :is-reset-dev-data="isResetDevData"
      :dev-status="viewDevStatus"
    />
    <el-dialog
      v-if="dialogVisible"
      class="dark unitArchives"
      :append-to-body="true"
      :destroy-on-close="true"
      :visible.sync="dialogVisible"
      width="1240px"
    >
      <div name="title" class="dialog-title">单位档案</div>
      <div class="dialog-content">
        <unit-archives :office-id="viewOfficeId" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceType } from '@/api/sensor'
import { getDeviceStat, getOfficeList, getOfficeMapList } from '@/api/agent'
import { getOfficeList as getbelongOfficeList } from '@/api/map'// 地图所属单位
import BasMap from '@/components/bmap/base-map'
import CustomDetail from '@/components/CustomDetail'
import NumberRoll from '@/components/numberRoll'
import DevAlertList from './components/devAlertList'
import UnitDevList from './components/unitDevList'
import UnitArchives from '@/components/unitArchives'
import projectView from './components/projectView'
import noticeCenter from './components/noticeCenter'
import scrollBottom from '@/directive/scroll/index.js'

export default {
  components: {
    BasMap,
    NumberRoll,
    DevAlertList,
    CustomDetail,
    projectView,
    noticeCenter,
    UnitDevList,
    UnitArchives
  },
  directives: {
    scrollBottom
  },
  filters: {
    complement(val) {
      if (val) {
        return 6 - val.toString().length
      } else {
        return 5
      }
    }
  },
  data() {
    return {
      devNum: [
        {
          id: 1,
          label: '设备总数',
          name: 'total',
          deviceStatus: '0'
        },
        {
          id: 2,
          label: '报警设备',
          name: 'warning',
          deviceStatus: '1'
        },
        {
          id: 3,
          label: '离线设备',
          name: 'offline',
          deviceStatus: '2'
        },
        {
          id: 4,
          label: '近三日离线设备',
          name: 'offlineInThreeDays',
          deviceStatus: '3'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        deviceType: '',
        deviceStatus: '',
        officeName: ''
      },
      hasMore: false,
      isShowOfficeList: false,
      deviceTypeList: [],
      officeList: [],
      officeMapList: [],
      deviceStat: {},
      isResetDevData: false,
      dialogVisible: false,
      viewOfficeId: '',
      viewDevOfficeId: '',
      viewDevStatus: ''
    }
  },
  watch: {
    'listQuery.deviceType'(newVal) {
      this._getDeviceStat()
      if (this.isShowOfficeList) {
        this._getOfficeList()
      }
    }
  },
  created() {
    this._getDeviceStat()
    this._getDeviceType()
  },
  methods: {
    viewUnitDevList(data, status) {
      this.viewDevOfficeId = data.id
      this.viewDevStatus = status
      this.isResetDevData = !this.isResetDevData
      this.$refs.unitDevList.show()
    },
    _getDeviceStat() {
      getDeviceStat(this.listQuery).then(res => {
        if (res.data) {
          this.deviceStat = res.data
        }
      })
    },
    _getOfficeList() {
      this.listQuery.page = 1
      this.hasMore = true
      getOfficeList(this.listQuery).then(res => {
        if (res.data) {
          this.officeList = res.data.list
          this.checkMore(res.data)
        }
      })
      getOfficeMapList(this.listQuery).then(res => {
        if (res.data) {
          this.officeMapList = res.data
        }
      })
    },
    _getMoreOfficeList() {
      if (!this.hasMore) {
        return
      }
      this.listQuery.page++
      getOfficeList(this.listQuery).then(res => {
        if (res.data) {
          this.officeList = this.officeList.concat(res.data.list)
          this.checkMore(res.data)
        }
      })
    },
    _getDeviceType() {
      getDeviceType().then(res => {
        if (res.data) {
          this.deviceTypeList = res.data
        }
      })
    },
    getOfficeListByStatus(status) {
      this.isShowOfficeList = true
      this.listQuery.deviceStatus = status
      this._getOfficeList()
    },
    hide() {
      this.dialogVisible = false
    },
    checkMore(data) {
      const list = data.list
      if (
        !list.length ||
        list.currPage + (list.currPage - 1) * this.listQuery.limit >=
          list.totalCount
      ) {
        this.hasMore = false
      }
    },
    // 地图所属单位
    belongUnits(data) {
      const areaId = data.area.id
      getbelongOfficeList({ areaId }).then((res) => {
        if (res.data && res.data.allData) {
          this.officeMapList = res.data.allData
        }
      })
    },
    // 打开单位详情页面
    viewUnitArchives(data) {
      this.viewOfficeId = data.id
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-home {
  width: 100%;
  height: 100%;
  padding: 16px 16px 14px 16px;
  box-sizing: border-box;

  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 300px;
    grid-gap: 14px 16px;

    .map-wrapper {
      grid-column-start: 1;
      grid-column-end: 3;
      position: relative;

      .left {
        position: absolute;
        width: 204px;
        left: 10px;
        top: 10px;
        background: rgba(18, 22, 43, 0.79);
        display: flex;
        flex-direction: column;
        padding: 24px 13px 30px 13px;

        .content {
          .label {
            font-size: 14px;
            margin-top: 13px;
            font-weight: bold;
            color: #ffffff;
          }

          .num {
            height: 30px;
            margin-top: 15px;
            color: #fff;
            cursor: pointer;

            /deep/ .number {
              ul {
                justify-content: left !important;

                li {
                  background: #5938ff;
                  margin-right: 4px;

                  &:last-child {
                    margin-right: 0;
                  }

                  .num-text {
                    top: 50%;
                    margin-top: -9px;
                  }
                }

                .unit {
                  font-size: 14px;
                  padding-top: 15px;
                }
              }
            }
          }
        }
      }
      .right {
        position: absolute;
        width: 204px;
        padding: 14px 0 12px 0;
        top: 16px;
        right: 18px;
        bottom: 14px;
        background: rgba(18, 22, 43, 0.79);
        display: flex;
        flex-direction: column;

        .header {
          padding: 0 13px;
        }

        .label {
          width: 161px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          margin-top: 10px;
          text-indent: 20px;
          color: #f6ff64;
          background: url(./images/title.png) 0 0 no-repeat;
          background-size: 100% 100%;
        }

        .unit-list {
          display: flex;
          flex-direction: column;
          padding: 0 9px;
          overflow: auto;

          li {
            display: flex;
            flex-direction: column;
            background: #1e2662;
            margin-top: 13px;

            .title {
              font-size: 12px;
              line-height: 12px;
              padding: 9px 0 6px 0;
              text-align: center;
              font-weight: bold;
              color: #cfe2ff;
              border-bottom: 1px dotted rgba(253, 253, 253, 0.29);
            }

            .content {
              display: flex;
              justify-content: space-around;
              padding: 8px 0 6px 0;

              .item {
                display: flex;
                flex-direction: column;

                .num {
                  width: 40px;
                  height: 40px;
                  font-size: 14px;
                  color: #fff;
                  text-align: center;
                  line-height: 32px;
                  border-radius: 50%;
                  border: 4px solid #4cb300;
                  cursor: pointer;
                }

                &:nth-child(2) {
                  .num {
                    border-color: #d86060;
                  }
                }

                &:nth-child(3) {
                  .num {
                    border-color: #85aaaa;
                  }
                }

                .text {
                  font-size: 12px;
                  font-weight: 400;
                  line-height: 20px;
                  color: #cfe2ff;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }

    > div {
      background: #202342;
    }
  }
}
</style>
<style lang="scss">
.agent-home {
  .map-wrapper {
    .left {
      .el-select {
        input {
          height: 31px;
          line-height: 31px;
          background: #12162b;
          border: 1px solid #5543fc;
        }

        .el-input__suffix {
          border-left: 1px solid #5543fc;
          right: 0;
        }

        .el-input__icon {
          line-height: 31px;
          width: 31px;
          font-weight: bold;
          color: #5543fc;
        }
      }
    }

    .right {
      .header {
        .el-input {
          input {
            background: #000;
            border-radius: 14px;
            height: 27px;
            line-height: 27px;
            border-color: #5543fc;
          }

          .el-input__icon {
            line-height: 28px;
          }
        }
      }
    }
  }
}
</style>
