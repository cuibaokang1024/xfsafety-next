<template>
  <div class="content unitDevDetail">
    <div v-if="isShowBaseInfo" class="baseInfo box">
      <div class="title">
        <div class="text">
          基本信息
          <span :class="{flip:isBaseInfoShow}" class="icon" @click="toggleBaseInfo" />
        </div>
      </div>
      <transition name="hide">
        <el-form v-show="isBaseInfoShow" ref="form" inline :model="form" disabled>
          <el-col :span="12">
            <el-form-item label="位置：">
              <el-input v-model="form.addr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域：">
              <el-input v-model="form.areaName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类型：">
              <el-input v-model="form.categoryName " />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位分级：">
              <el-input v-model="form.levelName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防安全管理人：">
              <el-input v-model="form.deputyName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              <el-input v-model="form.deputyTel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防安全责任人：">
              <el-input v-model="form.primaryName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              <el-input v-model="form.primaryTel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防主管部门：">
              <el-input v-model="form.fireDeptName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消防监督员：">
              <el-input v-model="form.fireMonitors" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="行业主管部门：">
              <el-input v-model="form.directDeptName" />
            </el-form-item>
          </el-col>
        </el-form>
      </transition>
    </div>
    <div class="alarm-list box">
      <div class="title">
        <div class="text">
          报警信息
          <span :class="{flip:isAlertListShow}" class="icon" @click="toggleAlertList" />
        </div>
        <div class="btn">一键督办</div>
      </div>
      <transition name="hide">
        <div v-show="isAlertListShow" class="table-wrapper">
          <baseTable
            class="table"
            :border="false"
            :table-height="232"
            :table-data="alertList"
            :table-config="tableConfig"
            @handlerCellClick="handlerCellClick"
          />
        </div>
      </transition>
    </div>
    <div class="tab-wrapper">
      <ul class="tabs">
        <li
          v-for="item in tabs"
          :key="item.id"
          :class="{selected:devStatusVisible===item.value, hide:category!==0&&item.value===4}"
          @click="switchDevStatus(item.value)"
        >
          <div class="content">
            <div class="text">
              <span>{{ item.label }}</span>
              <span>{{ item.value?'[':'' }}</span>
              <span class="num">{{ devStatus[item.name] }}</span>
              <span>{{ item.value?']':'' }}</span>
            </div>
            <div class="line" />
          </div>
        </li>
      </ul>
      <div class="content">
        <div v-if="!devData.length>0" class="noData">暂无数据</div>
        <ul v-else class="dev-item-wrapper">
          <li v-for="item in devData" :key="item.id">
            <dev-item
              :is-detail="true"
              :dev-type="category"
              :dev-data="item"
              :dev-status="devStatusVisible"
              @viewAlertRecord="viewAlertRecord"
              @viewDetail="viewDetail(item)"
            />
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="dark"
      :class="category===0?'electricDetail':'waterDetail'"
      :destroy-on-close="true"
      v-model:visible="dialogVisible"
      :append-to-body="true"
      :width="category===0?'1160px':'930px'"
    >
      <div name="title" class="dialog-title">{{ category===0?'电设备详情':'水设备详情' }}</div>
      <div class="dialog-content" style="height: 100%;">
        <dev-water-info v-if="category===1" ref="devDetail" :dev-data="devDataToView" />
        <dev-electric-info v-if="category===0" ref="devDetail" :dev-data="devDataToView" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">关 闭</el-button>
      </div>
    </el-dialog>
    <alarm-record
      :id="showAlarmRecordId"
      ref="alertRecord"
      :dev-type="category"
      :is-reset-table-flag="isResetTableFlag"
      :addr="alertLocation"
      :unit-name="form.name"
      :type="showAlarmRecordType"
    />
  </div>
</template>

<script>
import { getOfficeDevList, getOfficeDetail } from '@/api/iot'

import BaseTable from '@/components/baseTable'
import DevItem from '@/components/devItem'
import DevWaterInfo from '@/components/devWaterInfo'
import AlarmRecord from '@/components/alarmRecord'
import DevElectricInfo from '@/components/devElectricInfo'

export default {
  components: {
    BaseTable,
    DevItem,
    DevWaterInfo,
    AlarmRecord,
    DevElectricInfo
  },
  props: {
    officeId: {
      type: Number,
      default: 0
    },
    category: {
      type: Number,
      default: 0
    },
    categoryName: {
      type: String,
      default: ''
    },
    isShowBaseInfo: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      isResetTableFlag: false,
      isBaseInfoShow: false,
      isAlertListShow: true,
      showAlarmRecordId: '',
      showAlarmRecordType: '',
      alertLocation: '',
      form: {
        name: '',
        addr: '',
        areaName: '',
        categoryName: '',
        levelName: '',
        deputyName: '',
        deputyTel: '',
        primaryName: '',
        primaryTel: '',
        fireDeptName: '',
        fireMonitors: '',
        directDeptName: ''
      },
      devStatus: {},
      devStatusVisible: 3,
      alertList: [],
      devData: {},
      data: {},
      tabs: [
        {
          id: 1,
          label: '今日报警设备',
          value: 3,
          name: 'dayAlertNum'
        },
        {
          id: 2,
          label: '在线设备',
          value: 1,
          name: 'onLineNum'
        },
        {
          id: 3,
          label: '断线设备',
          value: 2,
          name: 'breakNum'
        },
        {
          id: 4,
          label: '脱扣设备',
          value: 4,
          name: 'tripNum'
        },
        {
          id: 5,
          label: '查看周报'
        },
        {
          id: 6,
          label: '查看月报'
        }
      ],
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'addr',
          label: '安装位置',
          align: 'center',
          width: ''
        },
        {
          prop: 'firstTime',
          label: '第一次报警时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'alertCount',
          label: '报警次数',
          align: 'center',
          width: ''
        },
        {
          prop: 'sensor',
          label: '报警类型',
          align: 'center',
          width: ''
        },
        {
          prop: 'msg',
          label: '处置方案',
          align: 'center',
          width: ''
        },
        {
          prop: 'msg',
          label: '督办',
          align: 'center',
          width: ''
        }
      ]
    }
  },
  created () {
    this._getOfficeDetail()
    this._getOfficeDevList()
  },
  methods: {
    _getOfficeDetail () {
      getOfficeDetail({
        data: {
          officeId: this.officeId
        },
        type: this.categoryName
      }).then(res => {
        if (res.data) {
          if (res.data.officeInfo) {
            this.form = { ...this.form, ...res.data.officeInfo }
          }
          this.devStatus = res.data.devStatus
          this.alertList = res.data.alertList || []
        }
      })
    },
    _getOfficeDevList () {
      getOfficeDevList({
        data: {
          officeId: this.officeId,
          status: this.devStatusVisible
        },
        type: this.categoryName
      }).then(res => {
        if (res.data) {
          this.devData = res.data.page.list
        }
      })
    },
    switchDevStatus (value) {
      if (value) {
        this.devStatusVisible = value
        this._getOfficeDevList()
      }
    },
    // 打开报警记录页
    viewAlertRecord (id, location, type) {
      this.showAlarmRecordType = ''
      if (type) {
        this.showAlarmRecordType = type
      }
      this.showAlarmRecordId = id
      this.alertLocation = location
      this.isResetTableFlag = !this.isResetTableFlag
      this.$refs.alertRecord.show()
    },
    // 打开设备详情页
    viewDetail (data) {
      this.devDataToView = data
      this.dialogVisible = true
    },
    // 关闭设备详情窗口
    hide () {
      this.dialogVisible = false
    },
    toggleBaseInfo () {
      this.isBaseInfoShow = !this.isBaseInfoShow
    },
    toggleAlertList () {
      this.isAlertListShow = !this.isAlertListShow
    },
    handlerCellClick (row, column, cell, event) {
      if (column.property !== 'alertCount') {
        return
      }
      const type = 'day'
      this.viewAlertRecord(row.devId, row.addr, type)
    }
  }
}
</script>

<style lang="scss">
.unitDevDetail {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: content-box;
  padding-right: 30px;
  width: 100%;
  .box {
    .title {
      height: 46px;
      line-height: 46px;
      padding: 0 30px;
      align-items: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(0, 113, 255, 0.2);
      margin-bottom: 15px;
      .text {
        color: #97c1ff;
        font-weight: bold;
        display: flex;
        align-items: center;
        .icon {
          display: inline-block;
          margin-left: 8px;
          width: 21px;
          height: 21px;
          background: url(./images/icon_arrow.png) 0 0 no-repeat;
          transition: all 0.3s;
          transform: rotateZ(0deg);
          &.flip {
            transform: rotateZ(180deg);
          }
        }
      }
      .btn {
        width: 80px;
        height: 24px;
        color: #41e2ff;
        background-color: transparent;
        line-height: 24px;
        border: 1px solid #41e2ff;
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .baseInfo {
    .el-form {
      width: auto !important;
      padding: 0 100px !important;
      margin-bottom: 10px;
      .el-form-item {
        margin-right: 0;
        display: flex;
        .el-form-item__label {
          width: 150px !important;
        }
        .el-form-item__content {
          width: calc(100% - 150px);
        }
      }
    }
    .hide-enter-active,
    .hide-leave-active {
      transition: height 0.5s ease-out;
      // transform: translate3d(100%, 0, 0);
    }
    .hide-enter,
    .hide-leave-to {
      height: 0;
    }
    .hide-enter-to,
    .hide-leave {
      height: 350px;
    }
  }
  .alarm-list {
    .table-wrapper {
      padding: 13px 27px 0 27px;
      background: rgba(255, 255, 255, 0.07);
      overflow: hidden;
      .el-table__header-wrapper {
        border-radius: 5px;
      }
      .el-checkbox__inner {
        width: 16px;
        height: 16px;
        background-color: transparent;
        border-color: #00a0e9;
      }
      .el-table__body {
        tr {
          td {
            border-color: rgba(255, 255, 255, 0.07);
          }
          &:hover {
            > td {
              background-color: rgba(255, 255, 255, 0.07);
              color: #b9d5ff;
            }
          }
        }
      }
    }
    .hide-enter-active,
    .hide-leave-active {
      transition: height 0.5s ease-out;
      // transform: translate3d(100%, 0, 0);
    }
    .hide-enter,
    .hide-leave-to {
      height: 0;
    }
    .hide-enter-to,
    .hide-leave {
      height: 245px;
    }
  }
  .tab-wrapper {
    .tabs {
      background-color: rgba(0, 113, 255, 0.2);
      list-style: none;
      display: flex;
      height: 46px;
      line-height: 46px;
      padding: 0;
      margin: 13px 0 4px 0;
      > li {
        &.hide {
          display: none;
        }
        &:nth-child(1) {
          .num {
            color: #ec6a6a;
          }
        }
        &:nth-child(2) {
          .num {
            color: #81e416;
          }
        }
        // &:nth-child(3){
        //   .num{
        //     color: #ec6a6a;
        //   }
        // }
        &:nth-child(4) {
          .num {
            color: #ffa800;
          }
        }
        height: 100%;
        flex: 1;
        &.selected {
          .text {
            background: rgba(0, 113, 255, 0.57);
          }
        }
        &:last-child {
          .line {
            display: none;
          }
        }
        > .content {
          cursor: pointer;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          .text {
            flex: 1;
            height: 100%;
            font-size: 14px;
            font-weight: bold;
            color: #97c1ff;
            text-align: center;
            &:hover {
              background: rgba(0, 113, 255, 0.57);
            }
          }
          .line {
            width: 1px;
            height: 15px;
            margin: 0 3px;
            background-color: #316acb;
          }
        }
      }
    }
    .content {
      .noData {
        text-align: center;
        color: #97c1ff;
        font-size: 16px;
      }
      .dev-item-wrapper {
        padding: 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-row-gap: 10px;
        grid-column-gap: 10px;
        > li {
        }
      }
    }
  }
}
</style>
