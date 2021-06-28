<template>
  <div>
    <el-dialog
      class="unitDevList dark"
      title="报警记录"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="1152px"
    >
      <div name="title" class="dialog-title">报警记录</div>
      <div ref="content" class="dialog-content">
        <ul class="tabs">
          <li
            v-for="item in tabs"
            :key="item.id"
            :class="{ selected:devTypeVisible === item.devTypeNameEn }"
            @click="switchDevType(item)"
          >
            <span class="text">{{ item.devTypeName }}</span>
            <span class="num">{{ item.devCount }}</span>
          </li>
        </ul>
        <div
          v-loading="listLoading"
          class="devList-wrapper"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
        >
          <ul class="devList">
            <li v-for="(item, index) in devList" :key="index">
              <dev-item
                :dev-status="devStatus"
                :dev-type="devType"
                :dev-data="item"
                @viewDetail="viewDetail"
                @viewAlertRecord="viewAlertRecord"
              />
            </li>
          </ul>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button type="primary" @click="hide()">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="devDetailDialogVisible"
      class="dark"
      :class="devType===0?'electricDetail':'waterDetail'"
      :destroy-on-close="true"
      :visible.sync="devDetailDialogVisible"
      :append-to-body="true"
      :width="devType===0?'1160px':'930px'"
    >
      <div name="title" class="dialog-title">{{ devType===0?'电设备详情':'水设备详情' }}</div>
      <div class="dialog-content" style="height: 100%;">
        <dev-water-info v-if="devType===1" ref="devDetail" :dev-data="devDataToView" />
        <dev-electric-info v-if="devType===0" ref="devDetail" :dev-data="devDataToView" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="closeDevDetail()">关闭</el-button>
      </div>
    </el-dialog>
    <alarm-record
      :id="showAlarmRecordId"
      ref="alertRecord"
      :dev-type="1"
      :is-reset-table-flag="isResetTableFlag"
      :addr="alertLocation"
    />
  </div>
</template>

<script>
import DevItem from '@/components/devItem'
import AlarmRecord from '@/components/alarmRecord'
import { getOfficeDevList } from '@/api/iot'
import { getOfficeDeviceState } from '@/api/agent'
import DevWaterInfo from '@/components/devWaterInfo'
import DevElectricInfo from '@/components/devElectricInfo'
export default {
  components: {
    DevItem,
    AlarmRecord,
    DevWaterInfo,
    DevElectricInfo
  },
  props: {
    // 设备ID
    officeId: {
      type: [String, Number],
      default: ''
    },
    devStatus: {
      type: [String, Number],
      default: -1
    },
    // 是否更新设备数据
    isResetDevData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      devType: 0,
      devList: [],
      devDetailDialogVisible: false,
      devDataToView: {},
      devTypeVisible: '',
      tabs: [],
      showAlarmRecordId: '',
      alertType: '',
      alertLocation: '',
      isResetTableFlag: false
    }
  },
  watch: {
    isResetDevData() {
      this._getOfficeDeviceState()
    }
  },
  created() {},
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
      this.devTypeVisible = ''
      this.devType = 0
    },
    _getOfficeDevList() {
      this.listLoading = true
      getOfficeDevList({
        data: {
          officeId: this.officeId,
          status: this.devStatus
        },
        type: this.devTypeVisible
      })
        .then(res => {
          if (res.data) {
            this.devList = res.data.page.list
          }
          this.listLoading = false
        })
        .catch((this.listLoading = false))
    },
    _getOfficeDeviceState() {
      getOfficeDeviceState({
        officeId: this.officeId,
        status: this.devStatus
      }).then(res => {
        if (res.data) {
          this.tabs = res.data
          this.switchDevType(this.tabs[0])
        }
      })
    },
    // 打开设备详情页
    viewDetail(data) {
      this.devDataToView = data
      this.devDetailDialogVisible = true
    },
    // 关闭设备详情窗口
    closeDevDetail() {
      this.devDetailDialogVisible = false
    },
    viewAlertRecord(type, id, location) {
      this.showAlarmRecordId = id
      this.alertType = type
      this.alertLocation = location
      this.isResetTableFlag = !this.isResetTableFlag
      this.$refs.alertRecord.show()
    },
    switchDevType(data) {
      if (!data) {
        this.devList = []
        return
      }
      this.devTypeVisible = data.devTypeNameEn
      this.devType = data.devTypeId
      this._getOfficeDevList()
    }
  }
}
</script>

<style lang="scss" scoped>
.unitDevList {
  .dialog-content {
    display: flex;
    flex-direction: column;
    .tabs {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 22px;
      padding: 0 20px;
      li {
        height: 58px;
        min-width: 91px;
        background: #141730;
        border: 1px solid #39408c;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #fff;
        margin-right: 10px;
        .text {
        }
        .num {
        }
        &.selected {
          background: linear-gradient(90deg, #7342fe, #3843fb);
        }
      }
    }
    .devList-wrapper {
      height: 300px;
      overflow: auto;
      .devList {
        display: grid;
        grid-template-columns: repeat(auto-fill, 355px);
        grid-row-gap: 10px;
        justify-content: space-evenly;
        word-break: normal;
      }
    }
  }
}
</style>
<style lang="scss">
.unitDevList {
  .el-dialog__body {
    padding: 10px 0;
    height: 400px;
    overflow: auto;
  }
}
</style>
