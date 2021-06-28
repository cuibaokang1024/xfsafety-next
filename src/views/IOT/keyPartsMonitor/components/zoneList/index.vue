<template>
  <div>
    <el-dialog class="alertRecord dark" title="报警记录" :visible.sync="dialogVisible" width="976px">
      <div name="title" class="dialog-title">监测防区</div>
      <div ref="content" class="dialog-content">
        <ul class="list-wrapper">
          <li v-for="item in areaList" :key="item.areaId" :class="item.status===0?'alarm':item.status===2?'deploy':'withdraw'" @click="viewAlarmRecord(item)">
            <div class="content">
              <div class="status">{{ item.status===0?'报警':item.status===2?'布防':'撤防' }}</div>
              <div class="dev-icon" />
              <div class="desc">
                <span>{{ `防区编号:${item.areaId}` }}</span>
                <span>{{ `设备名称:${item.devName}` }}</span>
                <span>{{ `安装位置:${item.location}` }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button type="primary" @click="hide()">关 闭</el-button>
      </div>
    </el-dialog>
    <zone-alarm-record ref="zoneAlarmRecord" :zone-data="zoneData" :alert-data="alertData" />
  </div>
</template>

<script>
import ZoneAlarmRecord from '../zoneAlarmRecord'
import { getAlarmHistor } from '@/api/alarmsys'
export default {
  components: {
    ZoneAlarmRecord
  },
  props: {
    account: {
      type: String,
      default: ''
    },
    areaList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      showAlarmRecordId: '',
      alertData: {},
      zoneData: {},
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    viewAlarmRecord(item) {
      this.zoneData = item
      getAlarmHistor(Object.assign({}, this.listQuery, {
        account: this.account,
        areano: item.areaId
      })).then((res) => {
        this.alertData = res.data
      })
      this.$refs.zoneAlarmRecord.show()
    },
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-wrapper{
    padding: 0;
    margin: 0;
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: 21px;
    grid-column-gap: 21px;
    >li{
      height: 140px;
      border: 3px solid;
      box-sizing: border-box;
      background: rgba(7,17,41,0.26);
      cursor: pointer;
      &.deploy{
        border-color:#0e733b;
        .status{
          background-color:#0e733b;
        }
        .dev-icon{
          background-color: rgba(14,115,59,0.33);
          background-image: url(./images/icon_deploy.png);
        }
      }
      &.withdraw{
        border-color:#a47333;
        .status{
          background-color:#a47333;
        }
        .dev-icon{
          background-color: rgba(164,115,51,0.33);
          background-image: url(./images/icon_withdraw.png);
        }
      }
      &.alarm{
        border-color:#d16262;
        .status{
          background-color: #d16262;
        }
        .dev-icon{
          background-color: rgba(209,98,98,0.33);
          background-image: url(./images/icon_alarm.png);
        }
      }
      .content{
        display: flex;
        flex-direction: column;
        position: relative;
        padding-top: 11px;
        .status{
          width: 71px;
          height: 29px;
          border-radius: 0 14px 14px 0;
          text-align: center;
          line-height: 29px;
          color: #fff;
          font-size: 16px;
        }
        .desc{
          display: flex;
          flex-direction: column;
          text-indent: 14px;
          font-size: 14px;
          color: #97c1ff;
          line-height: 26px;
          margin-top: 11px;
        }
        .dev-icon{
          position: absolute;
          right: 0;
          top: 0;
          width: 38px;
          height: 33px;
          border-radius: 0 0 0 10px;
          background-repeat: no-repeat;
          background-position: center center;
        }
      }
    }
  }
</style>
